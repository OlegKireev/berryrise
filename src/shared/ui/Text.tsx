import { useTheme } from 'expo-router';
import {
  Text as TextNative,
  type TextProps,
  type TextStyle,
} from 'react-native';

const variants = {
  body: {},
  // заголовок экрана
  title: { fontSize: 24, fontWeight: '600' },
  // заголовок блока на экране
  heading: { fontSize: 20, fontWeight: '600' },
  // подпись к полю или группе
  label: { fontWeight: '600' },
  // второстепенный текст
  hint: { opacity: 0.6 },
} satisfies Record<string, TextStyle>;

type Props = TextProps & { variant?: keyof typeof variants };

// Текст в цвет темы
export function Text({ variant = 'body', style, ...props }: Props) {
  const { colors } = useTheme();
  return (
    <TextNative
      style={[{ color: colors.text, fontSize: 16 }, variants[variant], style]}
      {...props}
    />
  );
}
