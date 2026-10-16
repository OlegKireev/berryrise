import { Alert } from 'react-native';

import { reasons } from '@/entities/reason';
import { AddField, Chip, ChipRow, Text } from '@/shared/ui';

import type { ReasonPickerState } from '../model/useReasonPicker';

import { t } from '../i18n';

// Готовые и свои причины чипами, как напитки в режиме компании. Выбор сохраняется сразу
export function ReasonPicker({ picker }: { picker: ReasonPickerState }) {
  // Долгое нажатие на свою причину убирает ее из списка
  const confirmForget = (text: string) =>
    Alert.alert(t('deleteReasonTitle'), text, [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: () => picker.forget(text),
      },
    ]);

  return (
    <>
      <ChipRow>
        {reasons.map((k) => (
          <Chip
            key={k}
            label={t(`reason.labels.${k}`)}
            selected={picker.keys.includes(k)}
            onPress={() => picker.toggleKey(k)}
          />
        ))}
        {picker.library.map((c) => (
          <Chip
            key={c}
            label={c}
            selected={picker.customs.includes(c)}
            onPress={() => picker.toggleCustom(c)}
            onLongPress={() => confirmForget(c)}
          />
        ))}
      </ChipRow>
      <AddField
        value={picker.text}
        onChangeText={picker.setText}
        placeholder={t('reason.customReason')}
        canAdd={picker.canAdd}
        onAdd={picker.add}
      />
      {picker.library.length > 0 && (
        <Text variant="hint">{t('deleteReasonHint')}</Text>
      )}
    </>
  );
}
