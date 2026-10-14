import { View, type ViewProps } from 'react-native';

import { useColors } from './theme';

// Карточка: отделена рамкой и фоном, без тени, чтобы одинаково читаться в обеих темах
export function Card({ style, ...props }: ViewProps) {
  const colors = useColors();
  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 10,
          padding: 16,
          gap: 8,
        },
        style,
      ]}
      {...props}
    />
  );
}
