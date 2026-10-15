import { router, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { Icon, type IconName } from './Icon';
import { Text } from './Text';
import { useColors } from './theme';

// кнопка из одной иконки обязана иметь подпись для диктора;
// children - свое содержимое (несколько строк), цвета текста задает вызывающий
type Content =
  | {
      title: string;
      icon?: never;
      children?: never;
      accessibilityLabel?: string;
    }
  | {
      icon: IconName;
      title?: never;
      children?: never;
      accessibilityLabel: string;
    }
  | {
      children: ReactNode;
      title?: never;
      icon?: never;
      accessibilityLabel?: string;
    };

// href - переход по пути через router.push, вместо своего onPress
type Action =
  { onPress: () => void; href?: never } | { href: Href; onPress?: never };

type Props = Content &
  Action & {
    // primary - одна на экран, основное действие; quiet - отмена, пропуск, удаление, срыв;
    // ghost - прозрачная в цвет текста без подчеркивания, для кнопок-иконок в шапке;
    // scrim - рамка на темной подложке, где кнопки темы теряются
    variant?: 'primary' | 'secondary' | 'quiet' | 'ghost' | 'scrim';
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
  };

export function Button({
  title,
  icon,
  children,
  onPress,
  href,
  variant = 'secondary',
  disabled,
  accessibilityLabel,
  style,
}: Props) {
  const colors = useColors();
  const filled = variant !== 'quiet' && variant !== 'ghost';
  const fg = {
    primary: colors.onPrimary,
    secondary: colors.onSecondary,
    quiet: colors.muted,
    ghost: colors.text,
    scrim: colors.onScrim,
  }[variant];
  const bg =
    variant === 'primary'
      ? colors.primary
      : variant === 'secondary'
        ? colors.secondary
        : 'transparent';
  return (
    <Pressable
      onPress={href ? () => router.push(href) : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      // ripple цветом текста на ~12%, как у нажатия в Material;
      // у ghost без ripple, только приглушение при нажатии, как у Row
      android_ripple={
        variant === 'ghost' ? undefined : { color: `${fg}1F`, foreground: true }
      }
      style={({ pressed }) => [
        {
          paddingVertical: filled ? 16 : 8,
          paddingHorizontal: 16,
          borderRadius: 10,
          overflow: 'hidden',
          alignItems: 'center',
          backgroundColor: bg,
          borderWidth: variant === 'scrim' ? 1 : 0,
          borderColor: fg,
          opacity: disabled ? 0.4 : variant === 'ghost' && pressed ? 0.6 : 1,
        },
        style,
      ]}
    >
      {icon ? (
        <Icon
          name={icon}
          size={22}
          color={fg}
        />
      ) : title !== undefined ? (
        <Text
          weight={filled ? 'semibold' : 'medium'}
          style={{
            color: fg,
            fontSize: filled ? 17 : 16,
            textAlign: 'center',
            textDecorationLine: variant === 'quiet' ? 'underline' : 'none',
          }}
        >
          {title}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
