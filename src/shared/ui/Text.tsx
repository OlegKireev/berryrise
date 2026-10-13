import { useTheme } from 'expo-router';
import { Text as TextNative, type TextProps } from 'react-native';

// Текст в цвет темы
export function Text({ style, ...props }: TextProps) {
  const { colors } = useTheme();
  return (
    <TextNative
      style={[{ color: colors.text, fontSize: 16 }, style]}
      {...props}
    />
  );
}
