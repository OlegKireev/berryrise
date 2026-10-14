import { useTheme } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Alert, Button, TextInput, View } from 'react-native';

import {
  addCustomDrink,
  deleteCustomDrink,
  listCustomDrinks,
  partyDrinks,
  setPartyDrinks,
  setPartyEnd,
  startParty,
  type Party,
  type PartyDrink,
} from '@/entities/party';
import { listReasons, reasonLabel, type ReasonRow } from '@/entities/reason';
import {
  addReply,
  deleteReply,
  listReplies,
  replies,
  type ReplyRow,
} from '@/entities/reply';
import { t } from '@/shared/i18n';
import { Chip, DateTimeField, Screen, Text } from '@/shared/ui';

const DAY = 24 * 60 * 60 * 1000;

export function CompanyPage() {
  const db = useSQLiteContext();
  const { colors } = useTheme();
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

  if (!party) return null;

  const input = {
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 8,
  };

  const changeEnd = (d: Date) => {
    setParty({ ...party, expectedEndAt: d.getTime() });
    setPartyEnd(db, party.id, d.getTime());
  };

  // Напитков может быть несколько: тап добавляет или убирает
  const drinkKeys: PartyDrink[] = JSON.parse(party.drinkKeys);
  const drinkCustoms: string[] = JSON.parse(party.drinkCustoms);
  const toggle = <K,>(list: K[], item: K, on = !list.includes(item)) =>
    on ? [...new Set([...list, item])] : list.filter((x) => x !== item);

  const changeDrinks = (keys: PartyDrink[], customs: string[]) => {
    setParty({
      ...party,
      drinkKeys: JSON.stringify(keys),
      drinkCustoms: JSON.stringify(customs),
    });
    setPartyDrinks(db, party.id, keys, customs);
  };

  const addDrink = async () => {
    const custom = drinkText.trim();
    await addCustomDrink(db, custom);
    setCustomDrinks(await listCustomDrinks(db));
    changeDrinks(drinkKeys, toggle(drinkCustoms, custom, true));
    setDrinkText('');
  };

  // Долгое нажатие на свой напиток убирает его из списка
  const confirmDeleteDrink = (name: string) =>
    Alert.alert(t('deleteDrinkTitle'), name, [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: async () => {
          await deleteCustomDrink(db, name);
          setCustomDrinks(await listCustomDrinks(db));
          changeDrinks(drinkKeys, toggle(drinkCustoms, name, false));
        },
      },
    ]);

  const reloadReplies = () => listReplies(db).then(setMyReplies);

  return (
    <Screen>
      {reasons.length > 0 && (
        <View style={{ gap: 4 }}>
          <Text style={{ fontWeight: '600' }}>{t('myReasons')}</Text>
          {reasons.map((r) => (
            <Text
              key={r.id}
              style={{ fontSize: 18 }}
            >
              • {reasonLabel(r)}
            </Text>
          ))}
        </View>
      )}

      <Text style={{ fontWeight: '600' }}>{t('partyEnd')}</Text>
      <DateTimeField
        value={new Date(party.expectedEndAt)}
        onChange={changeEnd}
        min={new Date(party.startAt)}
        max={new Date(party.startAt + DAY)}
      />

      <Text style={{ fontWeight: '600' }}>{t('partyDrinkTitle')}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {partyDrinks.map((k) => (
          <Chip
            key={k}
            label={t(`partyDrink_${k}`)}
            selected={drinkKeys.includes(k)}
            onPress={() => changeDrinks(toggle(drinkKeys, k), drinkCustoms)}
          />
        ))}
        {customDrinks.map((d) => (
          <Chip
            key={d}
            label={d}
            selected={drinkCustoms.includes(d)}
            onPress={() => changeDrinks(drinkKeys, toggle(drinkCustoms, d))}
            onLongPress={() => confirmDeleteDrink(d)}
          />
        ))}
      </View>
      <TextInput
        value={drinkText}
        onChangeText={setDrinkText}
        placeholder={t('partyDrinkCustom')}
        placeholderTextColor={colors.border}
        style={input}
      />
      <Button
        title={t('add')}
        disabled={!drinkText.trim()}
        onPress={addDrink}
      />
      {customDrinks.length > 0 && (
        <Text style={{ opacity: 0.6 }}>{t('deleteDrinkHint')}</Text>
      )}

      <Text style={{ fontWeight: '600' }}>{t('repliesTitle')}</Text>
      {replies.map((k) => (
        <Text key={k}>• {t(`reply_${k}`)}</Text>
      ))}
      {myReplies.map((r) => (
        <View
          key={r.id}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
        >
          <Text style={{ flex: 1 }}>• {r.customText}</Text>
          <Button
            title={t('delete')}
            onPress={() => deleteReply(db, r.id).then(reloadReplies)}
          />
        </View>
      ))}
      <TextInput
        value={replyText}
        onChangeText={setReplyText}
        placeholder={t('customReply')}
        placeholderTextColor={colors.border}
        style={input}
      />
      <Button
        title={t('add')}
        disabled={!replyText.trim()}
        onPress={async () => {
          await addReply(db, replyText.trim());
          setReplyText('');
          reloadReplies();
        }}
      />

      <Text style={{ fontSize: 18, marginTop: 8 }}>{t('leaveEarly')}</Text>
    </Screen>
  );
}
