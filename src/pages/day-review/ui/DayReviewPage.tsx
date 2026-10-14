import { router, useTheme } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Button, TextInput, View } from 'react-native';

import { reviewDay, getDayReview, saveDayReview } from '@/entities/day-review';
import { getHabit } from '@/entities/habit';
import { hasPartyOn } from '@/entities/party';
import { listReasons, reasonLabel, type ReasonRow } from '@/entities/reason';
import {
  cravings,
  hardships,
  helpers,
  moods,
  places,
  type Craving,
  type Hardship,
  type Helper,
  type Mood,
  type Place,
} from '@/shared/config';
import { formatDay } from '@/shared/i18n';
import { toDay } from '@/shared/lib';
import { Chip, Screen, Text } from '@/shared/ui';

import { t } from '../i18n';

const toggle = <K,>(list: K[], key: K) =>
  list.includes(key) ? list.filter((k) => k !== key) : [...list, key];

// Вариант "ничего" снимает остальные, любой другой снимает "ничего"
const toggleExclusive = <K,>(list: K[], key: K, none: K) =>
  key === none
    ? list.includes(none)
      ? []
      : [none]
    : toggle(
        list.filter((k) => k !== none),
        key,
      );

function Group<K extends string | number>({
  title,
  keys,
  label,
  isSelected,
  onPress,
}: {
  title: string;
  keys: readonly K[];
  label: (k: K) => string;
  isSelected: (k: K) => boolean;
  onPress: (k: K) => void;
}) {
  return (
    <>
      <Text style={{ fontWeight: '600' }}>{title}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {keys.map((k) => (
          <Chip
            key={k}
            label={label(k)}
            selected={isSelected(k)}
            onPress={() => onPress(k)}
          />
        ))}
      </View>
    </>
  );
}

export function DayReviewPage() {
  const db = useSQLiteContext();
  const { colors } = useTheme();
  // День считаем один раз при открытии: сохраняем ровно за тот, что в заголовке
  const [{ day, isToday }] = useState(() => {
    const now = Date.now();
    const day = reviewDay(now);
    return { day, isToday: day === toDay(now) };
  });
  // null - еще грузим
  const [state, setState] = useState<{
    beforeStart: boolean;
    reasons: ReasonRow[];
  } | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [craving, setCraving] = useState<Craving | null>(null);
  const [placeKeys, setPlaceKeys] = useState<Place[]>([]);
  const [hardshipKeys, setHardshipKeys] = useState<Hardship[]>([]);
  const [helperKeys, setHelperKeys] = useState<Helper[]>([]);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const [habit, reasons, existing] = await Promise.all([
        getHabit(db),
        listReasons(db),
        getDayReview(db, day),
      ]);
      if (existing) {
        setMood(existing.mood);
        setCraving(existing.craving);
        setPlaceKeys(JSON.parse(existing.places));
        setHardshipKeys(JSON.parse(existing.hardships));
        setHelperKeys(JSON.parse(existing.helpers));
        setNote(existing.note ?? '');
      } else {
        // Была вечеринка в этот день - заранее выбираем место "в компании"
        const [y, m, d] = day.split('-').map(Number) as [
          number,
          number,
          number,
        ];
        const from = new Date(y, m - 1, d).getTime();
        const to = new Date(y, m - 1, d + 1).getTime();
        if (await hasPartyOn(db, from, to)) setPlaceKeys(['company']);
      }
      setState({
        beforeStart: !habit || day < toDay(habit.startAt),
        reasons,
      });
    })();
  }, [db, day]);

  if (!state) return null;
  if (state.beforeStart)
    return (
      <Screen>
        <Text>{t('review.later')}</Text>
      </Screen>
    );

  const save = async () => {
    if (mood === null || craving === null) return;
    setSaving(true);
    await saveDayReview(db, {
      date: day,
      mood,
      craving,
      places: placeKeys,
      hardships: hardshipKeys,
      helpers: helperKeys,
      note,
    });
    router.back();
  };

  return (
    <Screen>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>
        {isToday ? t('forToday') : t('forYesterday')}, {formatDay(day)}
      </Text>

      {state.reasons.length > 0 && (
        <View style={{ gap: 4 }}>
          <Text style={{ fontWeight: '600' }}>{t('reason.myReasons')}</Text>
          {state.reasons.map((r) => (
            <Text key={r.id}>• {reasonLabel(r)}</Text>
          ))}
        </View>
      )}

      <Group
        title={t('option.titles.mood')}
        keys={moods}
        label={(m) => t(`option.mood.${m}`)}
        isSelected={(m) => mood === m}
        onPress={setMood}
      />
      <Group
        title={t('option.titles.craving')}
        keys={cravings}
        label={(c) => t(`option.craving.${c}`)}
        isSelected={(c) => craving === c}
        onPress={setCraving}
      />
      <Group
        title={t('option.titles.place')}
        keys={places}
        label={(p) => t(`option.place.${p}`)}
        isSelected={(p) => placeKeys.includes(p)}
        onPress={(p) => setPlaceKeys(toggle(placeKeys, p))}
      />
      <Group
        title={t('option.titles.hardship')}
        keys={hardships}
        label={(h) => t(`option.hardship.${h}`)}
        isSelected={(h) => hardshipKeys.includes(h)}
        onPress={(h) =>
          setHardshipKeys(toggleExclusive(hardshipKeys, h, 'nothing'))
        }
      />
      <Group
        title={t('option.titles.helper')}
        keys={helpers}
        label={(h) => t(`option.helper.${h}`)}
        isSelected={(h) => helperKeys.includes(h)}
        onPress={(h) =>
          setHelperKeys(toggleExclusive(helperKeys, h, 'notNeeded'))
        }
      />

      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder={t('note')}
        placeholderTextColor={colors.border}
        multiline
        style={{
          verticalAlign: 'top',
          color: colors.text,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 8,
          padding: 8,
          minHeight: 80,
        }}
      />

      <Button
        title={t('save')}
        disabled={saving || mood === null || craving === null}
        onPress={save}
      />
    </Screen>
  );
}
