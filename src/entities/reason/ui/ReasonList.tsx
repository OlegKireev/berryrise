import { View } from 'react-native';

import { Text } from '@/shared/ui';

import { reasonLabel } from '../model/reasonLabel';
import type { ReasonRow } from '../model/schema';

// Список причин под заголовком страницы, пустой список не показываем
export function ReasonList({
  title,
  reasons,
}: {
  title: string;
  reasons: ReasonRow[];
}) {
  if (reasons.length === 0) {
    return null;
  }

  return (
    <View style={{ gap: 4 }}>
      <Text variant="label">{title}</Text>
      {reasons.map((r) => (
        <Text key={r.id}>• {reasonLabel(r)}</Text>
      ))}
    </View>
  );
}
