import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { Icon, type IconName } from './Icon';
import { Text } from './Text';
import { useColors } from './theme';

// кнопка из одной иконки обязана иметь подпись для диктора
type Content =
  | {
      title: string;
      icon?: never;
      accessibilityLabel?: string;
    }
  | {
      icon: IconName;
      title?: never;
      accessibilityLabel: string;
    };

type Props = Content & {
  onPress: () => void;
  // primary - одна на экран, основное действие; quiet - отмена, пропуск, удаление, срыв;
  // ghost - прозрачная в цвет текста без подчеркивания, для кнопок-иконок в шапке
  variant?: 'primary' | 'secondary' | 'quiet' | 'ghost';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  title,
  icon,
  onPress,
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
  }[variant];
  const bg =
    variant === 'primary'
      ? colors.primary
      : variant === 'secondary'
        ? colors.secondary
        : 'transparent';
  return (
    <Pressable
      onPress={onPress}
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
      ) : (
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
      )}
    </Pressable>
  );
}
