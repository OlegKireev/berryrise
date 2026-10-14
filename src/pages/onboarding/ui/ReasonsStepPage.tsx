import { router, useTheme } from 'expo-router';
import { Button, TextInput, View } from 'react-native';

import { reasons } from '@/entities/reason';
import { Chip, Screen, Text } from '@/shared/ui';

import { useReasonsStep } from '../model/useReasonsStep';

import { t } from '../i18n';

// Шаг после старта: привычка уже есть, поэтому шаг необязательный и назад не ведет
export function ReasonsStepPage() {
  const { colors } = useTheme();
  const form = useReasonsStep();

  return (
    <Screen>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>
        {t('reasonsStepTitle')}
      </Text>
      <Text>{t('reasonsStepHint')}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {reasons.map((k) => (
          <Chip
            key={k}
            label={t(`reason.labels.${k}`)}
            selected={form.keys.includes(k)}
            onPress={() => form.toggleKey(k)}
          />
        ))}
      </View>
      <TextInput
        value={form.custom}
        onChangeText={form.setCustom}
        placeholder={t('reason.customReason')}
        placeholderTextColor={colors.border}
        style={{
          color: colors.text,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 8,
          padding: 8,
        }}
      />
      <Button
        title={t('next')}
        disabled={!form.canSubmit}
        onPress={form.submit}
      />
      <Button
        title={t('skip')}
        disabled={form.saving}
        onPress={() => router.replace('/')}
      />
    </Screen>
  );
}
