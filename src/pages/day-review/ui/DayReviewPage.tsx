import { useTheme } from 'expo-router';
import { Button, TextInput, View } from 'react-native';

import { reasonLabel } from '@/entities/reason';
import { cravings, hardships, helpers, moods, places } from '@/shared/config';
import { formatDay } from '@/shared/i18n';
import { Chip, Screen, Text } from '@/shared/ui';

import { useDayReview } from '../model/useDayReview';

import { t } from '../i18n';

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
  const { colors } = useTheme();
  const form = useDayReview();

  if (!form) {
    return null;
  }

  if (form.beforeStart)
    return (
      <Screen>
        <Text>{t('review.later')}</Text>
      </Screen>
    );

  return (
    <Screen>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>
        {form.isToday ? t('forToday') : t('forYesterday')},{' '}
        {formatDay(form.day)}
      </Text>

      {form.reasons.length > 0 && (
        <View style={{ gap: 4 }}>
          <Text style={{ fontWeight: '600' }}>{t('reason.myReasons')}</Text>
          {form.reasons.map((r) => (
            <Text key={r.id}>• {reasonLabel(r)}</Text>
          ))}
        </View>
      )}

      <Group
        title={t('option.titles.mood')}
        keys={moods}
        label={(m) => t(`option.mood.${m}`)}
        isSelected={(m) => form.mood === m}
        onPress={form.setMood}
      />
      <Group
        title={t('option.titles.craving')}
        keys={cravings}
        label={(c) => t(`option.craving.${c}`)}
        isSelected={(c) => form.craving === c}
        onPress={form.setCraving}
      />
      <Group
        title={t('option.titles.place')}
        keys={places}
        label={(p) => t(`option.place.${p}`)}
        isSelected={(p) => form.places.includes(p)}
        onPress={form.togglePlace}
      />
      <Group
        title={t('option.titles.hardship')}
        keys={hardships}
        label={(h) => t(`option.hardship.${h}`)}
        isSelected={(h) => form.hardships.includes(h)}
        onPress={form.toggleHardship}
      />
      <Group
        title={t('option.titles.helper')}
        keys={helpers}
        label={(h) => t(`option.helper.${h}`)}
        isSelected={(h) => form.helpers.includes(h)}
        onPress={form.toggleHelper}
      />

      <TextInput
        value={form.note}
        onChangeText={form.setNote}
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
        disabled={!form.canSave}
        onPress={form.save}
      />
    </Screen>
  );
}
