import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';

import {
  addCustomDrink,
  deleteCustomDrink,
  listCustomDrinks,
  setPartyDrinks,
  setPartyEnd,
  startParty,
  type Party,
  type PartyDrink,
} from '@/entities/party';
import { listReasons, type ReasonRow } from '@/entities/reason';
import { toggle } from '@/shared/lib';

// Режим "иду в компанию". null - еще грузим
export function useCompany() {
  const db = useSQLiteContext();

  const [party, setParty] = useState<Party | null>(null);
  const [reasons, setReasons] = useState<ReasonRow[]>([]);
  const [customDrinks, setCustomDrinks] = useState<string[]>([]);
  const [drinkText, setDrinkText] = useState('');

  // Открытие режима начинает вечеринку или подхватывает идущую
  useEffect(() => {
    (async () => {
      const [p, r, drinks] = await Promise.all([
        startParty(db),
        listReasons(db),
        listCustomDrinks(db),
      ]);
      setParty(p);
      setCustomDrinks(drinks);
      setReasons(r);
    })();
  }, [db]);

  if (!party) {
    return null;
  }

  // Напитков может быть несколько: тап добавляет или убирает
  const drinkKeys: PartyDrink[] = JSON.parse(party.drinkKeys);
  const drinkCustoms: string[] = JSON.parse(party.drinkCustoms);

  const changeDrinks = (keys: PartyDrink[], customs: string[]) => {
    setParty({
      ...party,
      drinkKeys: JSON.stringify(keys),
      drinkCustoms: JSON.stringify(customs),
    });
    setPartyDrinks(db, party.id, keys, customs);
  };

  return {
    party,
    reasons,
    changeEnd: (d: Date) => {
      setParty({ ...party, expectedEndAt: d.getTime() });
      setPartyEnd(db, party.id, d.getTime());
    },
    drinks: {
      keys: drinkKeys,
      customs: drinkCustoms,
      // все свои напитки, выбранные на этот вечер - в customs
      myDrinks: customDrinks,
      toggleKey: (k: PartyDrink) =>
        changeDrinks(toggle(drinkKeys, k), drinkCustoms),
      toggleCustom: (d: string) =>
        changeDrinks(drinkKeys, toggle(drinkCustoms, d)),
      text: drinkText,
      setText: setDrinkText,
      canAdd: drinkText.trim() !== '',
      add: async () => {
        const custom = drinkText.trim();
        await addCustomDrink(db, custom);
        setCustomDrinks(await listCustomDrinks(db));
        changeDrinks(drinkKeys, toggle(drinkCustoms, custom, true));
        setDrinkText('');
      },
      remove: async (name: string) => {
        await deleteCustomDrink(db, name);
        setCustomDrinks(await listCustomDrinks(db));
        changeDrinks(drinkKeys, toggle(drinkCustoms, name, false));
      },
    },
  };
}

export type Drinks = NonNullable<ReturnType<typeof useCompany>>['drinks'];
