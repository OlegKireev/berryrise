import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from './Text';
import { useColors } from './theme';

type Props = {
  label: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  // с ним строка нажимается целиком и ведет дальше, стрелка справа
  onPress?: () => void;
};

// Строка списка: подпись слева, справа значение или действие
export function Row({ label, children, style, onPress }: Props) {
  const colors = useColors();
  const rowStyle: StyleProp<ViewStyle> = [
    { flexDirection: 'row', alignItems: 'center', gap: 8 },
    style,
  ];
  const content = (
    <>
      <Text style={{ flex: 1 }}>{label}</Text>
      {children}
      {onPress && <Text style={{ color: colors.muted, fontSize: 22 }}>›</Text>}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          rowStyle,
          { paddingVertical: 12 },
          pressed && { opacity: 0.6 },
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={rowStyle}>{content}</View>;
}
