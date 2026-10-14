import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from './Text';
import { useColors } from './theme';

type Props = {
  title: string;
  onPress: () => void;
  // primary - одна на экран, основное действие; quiet - отмена, пропуск, удаление, срыв
  variant?: 'primary' | 'secondary' | 'quiet';
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  title,
  onPress,
  variant = 'secondary',
  disabled,
  accessibilityLabel,
  style,
}: Props) {
  const colors = useColors();
  const filled = variant !== 'quiet';
  const fg =
    variant === 'primary'
      ? colors.onPrimary
      : variant === 'secondary'
        ? colors.onSecondary
        : colors.muted;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      android_ripple={{ color: fg, foreground: true }}
      style={[
        {
          paddingVertical: filled ? 13 : 8,
          paddingHorizontal: 16,
          borderRadius: 10,
          overflow: 'hidden',
          alignItems: 'center',
          backgroundColor:
            variant === 'primary'
              ? colors.primary
              : variant === 'secondary'
                ? colors.secondary
                : 'transparent',
          opacity: disabled ? 0.4 : 1,
        },
        style,
      ]}
    >
      <Text
        weight={filled ? 'semibold' : 'medium'}
        style={{
          color: fg,
          fontSize: 15,
          textAlign: 'center',
          textDecorationLine: filled ? 'none' : 'underline',
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
