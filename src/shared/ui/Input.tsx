import { TextInput, type TextInputProps } from 'react-native';

import { fonts, useColors } from './theme';

// Поле ввода в цветах темы. Многострочное сразу выше, текст сверху
export function Input({ style, multiline, ...props }: TextInputProps) {
  const colors = useColors();
  return (
    <TextInput
      multiline={multiline}
      placeholderTextColor={colors.muted}
      style={[
        {
          color: colors.text,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 10,
          paddingVertical: 10,
          paddingHorizontal: 12,
          fontFamily: fonts.regular,
          fontSize: 16,
        },
        multiline && { minHeight: 80, verticalAlign: 'top' },
        style,
      ]}
      {...props}
    />
  );
}
