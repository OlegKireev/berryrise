import { View } from 'react-native';

import { Text } from '@/shared/ui';

import { reasonLabel } from '../model/reasonLabel';
import type { ReasonRow } from '../model/types';

import { t } from '../i18n';

// Напоминание "Мои причины", пустой список не показываем
export function ReasonList({ reasons }: { reasons: ReasonRow[] }) {
  if (reasons.length === 0) {
    return null;
  }

  return (
    <View style={{ gap: 4 }}>
      <Text variant="label">{t('myReasons')}</Text>
      {reasons.map((r) => (
        <Text key={r.id}>• {reasonLabel(r)}</Text>
      ))}
    </View>
  );
}
