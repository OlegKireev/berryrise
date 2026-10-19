import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Card } from './Card';
import { Text } from './Text';

type Props = { label?: string; children: ReactNode };

// Группа строк Row в одной карточке, с подписью над ней
export function Group({ label, children }: Props) {
  return (
    <View style={{ gap: 8 }}>
      {label && <Text variant="label">{label}</Text>}
      <Card style={{ gap: 0, paddingVertical: 4 }}>{children}</Card>
    </View>
  );
}
