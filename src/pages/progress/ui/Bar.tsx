import { View } from 'react-native';

import { useColors } from '@/shared/ui';

const PERCENT = 100;

// Горизонтальная полоска доли 0..1 на дорожке
export function Bar({ share }: { share: number }) {
  const colors = useColors();
  return (
    <View
      style={{
        flex: 1,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.border,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          width: `${Math.min(share, 1) * PERCENT}%`,
          height: '100%',
          backgroundColor: colors.special,
        }}
      />
    </View>
  );
}
