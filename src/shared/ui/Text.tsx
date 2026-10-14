import {
  Text as TextNative,
  type TextProps,
  type TextStyle,
} from 'react-native';

import { fonts, useColors, type Weight } from './theme';

const variants = {
  body: { weight: 'regular', style: {} },
  // заголовок экрана
  title: { weight: 'bold', style: { fontSize: 24 } },
  // заголовок блока на экране
  heading: { weight: 'semibold', style: { fontSize: 20 } },
  // подпись к полю или группе
  label: { weight: 'semibold', style: {} },
  // второстепенный текст
  hint: { weight: 'regular', style: {} },
} satisfies Record<string, { weight: Weight; style: TextStyle }>;

type Props = TextProps & {
  variant?: keyof typeof variants;
  // начертание вместо fontWeight: Android не подбирает его у кастомного шрифта
  weight?: Weight;
};

// Текст в цвет темы и шрифтом приложения
export function Text({ variant = 'body', weight, style, ...props }: Props) {
  const colors = useColors();
  const v = variants[variant];
  return (
    <TextNative
      style={[
        {
          color: variant === 'hint' ? colors.muted : colors.text,
          fontSize: 16,
          fontFamily: fonts[weight ?? v.weight],
        },
        v.style,
        style,
      ]}
      {...props}
    />
  );
}
