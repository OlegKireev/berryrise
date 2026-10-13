import { router, useTheme } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Button, TextInput, View } from 'react-native';

import {
  addReasons,
  reasons,
  type NewReason,
  type Reason,
} from '@/entities/reason';
import { t } from '@/shared/i18n';
import { Chip, Screen, Text } from '@/shared/ui';

// Шаг после старта: привычка уже есть, поэтому шаг необязательный и назад не ведет
export function ReasonsStepPage() {
  const db = useSQLiteContext();
  const { colors } = useTheme();
  // Готовые в порядке выбора
  const [keys, setKeys] = useState<Reason[]>([]);
  const [custom, setCustom] = useState('');
  const [saving, setSaving] = useState(false);

  const text = custom.trim();

  const toggle = (k: Reason) =>
    setKeys(keys.includes(k) ? keys.filter((x) => x !== k) : [...keys, k]);

  const next = async () => {
    setSaving(true);
    const items: NewReason[] = keys.map((key) => ({ key }));
    if (text) items.push({ customText: text });
    await addReasons(db, items);
    router.replace('/');
  };

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
            label={t(`reason_${k}`)}
            selected={keys.includes(k)}
            onPress={() => toggle(k)}
          />
        ))}
      </View>
      <TextInput
        value={custom}
        onChangeText={setCustom}
        placeholder={t('customReason')}
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
        disabled={saving || (keys.length === 0 && !text)}
        onPress={next}
      />
      <Button
        title={t('skip')}
        disabled={saving}
        onPress={() => router.replace('/')}
      />
    </Screen>
  );
}
