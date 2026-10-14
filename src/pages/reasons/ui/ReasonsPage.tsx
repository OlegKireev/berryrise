import { useTheme } from 'expo-router';
import { Button, TextInput, View } from 'react-native';

import { reasonLabel } from '@/entities/reason';
import { Chip, Screen, Text } from '@/shared/ui';

import { useReasons } from '../model/useReasons';

import { t } from '../i18n';

export function ReasonsPage() {
  const { colors } = useTheme();
  const reasons = useReasons();

  if (!reasons) {
    return null;
  }

  return (
    <Screen>
      {reasons.list.length === 0 && <Text>{t('noReasons')}</Text>}
      {reasons.list.map((item) => (
        <View
          key={item.id}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
        >
          <Text style={{ flex: 1, fontSize: 18 }}>{reasonLabel(item)}</Text>
          <Button
            title={t('delete')}
            onPress={() => reasons.remove(item.id)}
          />
        </View>
      ))}

      <Text style={{ fontSize: 20, fontWeight: '600', marginTop: 8 }}>
        {t('addReasonTitle')}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {reasons.presets.map((k) => (
          <Chip
            key={k}
            label={t(`reason.labels.${k}`)}
            selected={false}
            onPress={() => reasons.addPreset(k)}
          />
        ))}
      </View>
      <TextInput
        value={reasons.custom}
        onChangeText={reasons.setCustom}
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
        title={t('add')}
        disabled={!reasons.canAddCustom}
        onPress={reasons.addCustom}
      />
    </Screen>
  );
}
