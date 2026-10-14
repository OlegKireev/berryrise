import { useTheme } from 'expo-router';
import { TextInput, type TextInputProps } from 'react-native';

// Поле ввода в цветах темы. Многострочное сразу выше, текст сверху
export function Input({ style, multiline, ...props }: TextInputProps) {
  const { colors } = useTheme();
  return (
    <TextInput
      multiline={multiline}
      placeholderTextColor={colors.border}
      style={[
        {
          color: colors.text,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 8,
          padding: 8,
        },
        multiline && { minHeight: 80, verticalAlign: 'top' },
        style,
      ]}
      {...props}
    />
  );
}
