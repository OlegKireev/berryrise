import { useTheme } from 'expo-router';
import { Button, TextInput, View } from 'react-native';

import { hardships, moods, places } from '@/shared/config';
import { Chip, DateTimeField, Screen, Text } from '@/shared/ui';

import { useRelapse } from '../model/useRelapse';

import { t } from '../i18n';

export function RelapsePage() {
  const { colors } = useTheme();
  const form = useRelapse();

  if (!form) {
    return null;
  }

  return (
    <Screen>
      <Text>{t('relapseSupport')}</Text>

      <Text style={{ fontWeight: '600' }}>{t('relapseWhen')}</Text>
      <DateTimeField
        value={form.at ?? new Date()}
        onChange={form.setAt}
        min={new Date(form.startAt)}
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
            selected={form.mood === m}
            onPress={() => form.toggleMood(m)}
          />
        ))}
      </View>

      <Text style={{ fontWeight: '600' }}>{t('option.titles.place')}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {places.map((p) => (
          <Chip
            key={p}
            label={t(`option.place.${p}`)}
            selected={form.places.includes(p)}
            onPress={() => form.togglePlace(p)}
          />
        ))}
      </View>

      <Text style={{ fontWeight: '600' }}>{t('option.titles.hardship')}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {hardships.map((h) => (
          <Chip
            key={h}
            label={t(`option.hardship.${h}`)}
            selected={form.hardships.includes(h)}
            onPress={() => form.toggleHardship(h)}
          />
        ))}
      </View>

      <TextInput
        value={form.note}
        onChangeText={form.setNote}
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
        disabled={form.saving}
        onPress={form.save}
      />
    </Screen>
  );
}
