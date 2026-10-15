import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { Icon, type IconName } from './Icon';
import { Text } from './Text';
import { useColors } from './theme';

type Props = {
  label: string;
  // иконка раздела слева, декоративная
  icon?: IconName;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  // с ним строка нажимается целиком и ведет дальше, стрелка справа
  onPress?: () => void;
};

// Строка списка: подпись слева, справа значение или действие
export function Row({ label, icon, children, style, onPress }: Props) {
  const colors = useColors();
  const rowStyle: StyleProp<ViewStyle> = [
    { flexDirection: 'row', alignItems: 'center', gap: icon ? 12 : 8 },
    style,
  ];
  const content = (
    <>
      {icon && (
        <Icon
          name={icon}
          size={22}
        />
      )}
      <Text style={{ flex: 1 }}>{label}</Text>
      {children}
      {onPress && (
        <Icon
          name="chevronRight"
          size={20}
          color={colors.muted}
        />
      )}
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
