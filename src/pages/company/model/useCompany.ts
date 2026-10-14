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
import {
  addReply,
  deleteReply,
  listReplies,
  type ReplyRow,
} from '@/entities/reply';
import { toggle } from '@/shared/lib';

// Режим "иду в компанию". null - еще грузим
export function useCompany() {
  const db = useSQLiteContext();

  const [party, setParty] = useState<Party | null>(null);
  const [reasons, setReasons] = useState<ReasonRow[]>([]);
  const [myReplies, setMyReplies] = useState<ReplyRow[]>([]);
  const [customDrinks, setCustomDrinks] = useState<string[]>([]);
  const [drinkText, setDrinkText] = useState('');
  const [replyText, setReplyText] = useState('');

  // Открытие режима начинает вечеринку или подхватывает идущую
  useEffect(() => {
    (async () => {
      const [p, r, my, drinks] = await Promise.all([
        startParty(db),
        listReasons(db),
        listReplies(db),
        listCustomDrinks(db),
      ]);
      setParty(p);
      setCustomDrinks(drinks);
      setReasons(r);
      setMyReplies(my);
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

  const reloadReplies = () => listReplies(db).then(setMyReplies);

  return {
    party,
    reasons,
    changeEnd: (d: Date) => {
      setParty({ ...party, expectedEndAt: d.getTime() });
      setPartyEnd(db, party.id, d.getTime());
    },

    drinkKeys,
    drinkCustoms,
    customDrinks,
    toggleDrink: (k: PartyDrink) =>
      changeDrinks(toggle(drinkKeys, k), drinkCustoms),
    toggleCustomDrink: (d: string) =>
      changeDrinks(drinkKeys, toggle(drinkCustoms, d)),
    drinkText,
    setDrinkText,
    canAddDrink: drinkText.trim() !== '',
    addDrink: async () => {
      const custom = drinkText.trim();
      await addCustomDrink(db, custom);
      setCustomDrinks(await listCustomDrinks(db));
      changeDrinks(drinkKeys, toggle(drinkCustoms, custom, true));
      setDrinkText('');
    },
    deleteDrink: async (name: string) => {
      await deleteCustomDrink(db, name);
      setCustomDrinks(await listCustomDrinks(db));
      changeDrinks(drinkKeys, toggle(drinkCustoms, name, false));
    },

    myReplies,
    replyText,
    setReplyText,
    canAddReply: replyText.trim() !== '',
    addReply: async () => {
      await addReply(db, replyText.trim());
      setReplyText('');
      reloadReplies();
    },
    deleteReply: (id: string) => deleteReply(db, id).then(reloadReplies),
  };
}
