import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from './Text';

type Props = {
  label: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

// Строка списка: подпись слева, справа значение или действие
export function Row({ label, children, style }: Props) {
  return (
    <View
      style={[{ flexDirection: 'row', alignItems: 'center', gap: 8 }, style]}
    >
      <Text style={{ flex: 1 }}>{label}</Text>
      {children}
    </View>
  );
}
