import { router, type Href } from 'expo-router';
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
  // то же, но переход по пути через router.push
  href?: Href;
  // стрелка у нажимаемой строки; false - тап открывает что-то на месте, а не экран
  arrow?: boolean;
};

// Отступ после иконки раздела шире
const gaps = { icon: 12, plain: 8 };

// Строка списка: подпись слева, справа значение или действие
export function Row({
  label,
  icon,
  children,
  style,
  onPress,
  href,
  arrow = true,
}: Props) {
  const colors = useColors();
  const press = href ? () => router.push(href) : onPress;
  const rowStyle: StyleProp<ViewStyle> = [
    {
      flexDirection: 'row',
      alignItems: 'center',
      gap: icon ? gaps.icon : gaps.plain,
    },
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
      {press && arrow && (
        <Icon
          name="chevronRight"
          size={20}
          color={colors.muted}
        />
      )}
    </>
  );

  if (press) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={press}
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
