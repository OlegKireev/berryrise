import { router, useLocalSearchParams, useTheme } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Button, TextInput, View } from 'react-native';

import { getHabit, type Habit } from '@/entities/habit';
import { getParty } from '@/entities/party';
import { insertRelapse } from '@/entities/relapse';
import { logPartyRelapse } from '@/features/log-party-relapse';
import {
  hardships,
  moods,
  places,
  type Hardship,
  type Mood,
  type Place,
} from '@/shared/config';
import { Chip, DateTimeField, Screen, Text } from '@/shared/ui';

import { t } from '../i18n';

const toggle = <K,>(list: K[], key: K) =>
  list.includes(key) ? list.filter((k) => k !== key) : [...list, key];

export function RelapsePage() {
  const db = useSQLiteContext();
  const { colors } = useTheme();
  // Открыта кнопкой "выпил" из карточки вечеринки
  const { partyId } = useLocalSearchParams<{ partyId?: string }>();
  const [habit, setHabit] = useState<Habit | null>(null);
  // null - не трогали, срыв в момент сохранения
  const [at, setAt] = useState<Date | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [placeKeys, setPlaceKeys] = useState<Place[]>([]);
  const [hardshipKeys, setHardshipKeys] = useState<Hardship[]>([]);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getHabit(db).then(setHabit);
    // Вечеринка уже кончилась - по умолчанию срыв в ее конце
    if (partyId)
      getParty(db, partyId).then(
        (p) =>
          p && p.expectedEndAt < Date.now() && setAt(new Date(p.expectedEndAt)),
      );
  }, [db, partyId]);

  if (!habit) return null;

  const save = async () => {
    setSaving(true);
    const data = {
      habitId: habit.id,
      at: at?.getTime() ?? Date.now(),
      mood,
      places: placeKeys,
      hardships: hardshipKeys,
      note,
    };
    await (partyId
      ? logPartyRelapse(db, partyId, data)
      : insertRelapse(db, data));
    router.back();
  };

  return (
    <Screen>
      <Text>{t('relapseSupport')}</Text>

      <Text style={{ fontWeight: '600' }}>{t('relapseWhen')}</Text>
      <DateTimeField
        value={at ?? new Date()}
        onChange={setAt}
        min={new Date(habit.startAt)}
        max={new Date()}
      />

      <Text style={{ fontSize: 20, fontWeight: '600', marginTop: 8 }}>
        {t('relapseReview')}
      </Text>

      <Text style={{ fontWeight: '600' }}>{t('option.titles.mood')}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {moods.map((m) => (
          <Chip
            key={m}
            label={t(`option.mood.${m}`)}
            selected={mood === m}
            onPress={() => setMood(mood === m ? null : m)}
          />
        ))}
      </View>

      <Text style={{ fontWeight: '600' }}>{t('option.titles.place')}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {places.map((p) => (
          <Chip
            key={p}
            label={t(`option.place.${p}`)}
            selected={placeKeys.includes(p)}
            onPress={() => setPlaceKeys(toggle(placeKeys, p))}
          />
        ))}
      </View>

      <Text style={{ fontWeight: '600' }}>{t('option.titles.hardship')}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {hardships.map((h) => (
          <Chip
            key={h}
            label={t(`option.hardship.${h}`)}
            selected={hardshipKeys.includes(h)}
            onPress={() => setHardshipKeys(toggle(hardshipKeys, h))}
          />
        ))}
      </View>

      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder={t('note')}
        placeholderTextColor={colors.border}
        multiline
        style={{
          color: colors.text,
          verticalAlign: 'top',
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 8,
          padding: 8,
          minHeight: 80,
        }}
      />

      <Button
        title={t('save')}
        disabled={saving}
        onPress={save}
      />
    </Screen>
  );
}
