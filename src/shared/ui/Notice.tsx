import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Card } from './Card';
import { Icon, type IconName } from './Icon';

type Props = { icon: IconName; children: ReactNode };

// Карточка "важно прочитать": иконка слева, справа текст и, если нужно, кнопка
export function Notice({ icon, children }: Props) {
  return (
    <Card style={{ flexDirection: 'row', gap: 12 }}>
      <Icon
        name={icon}
        size={22}
      />
      <View style={{ flex: 1, gap: 8 }}>{children}</View>
    </Card>
  );
}
