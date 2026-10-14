import { View } from 'react-native';

import { useColors } from '@/shared/ui';

// Отметка "итоги дня подведены"
export function ReviewDot({ color }: { color?: string }) {
  const colors = useColors();
  return (
    <View
      style={{
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: color ?? colors.text,
      }}
    />
  );
}
