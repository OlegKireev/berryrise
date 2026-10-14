import type { ReactNode } from 'react';
import { View } from 'react-native';

// Чипы в ряд с переносом
export function ChipRow({ children }: { children: ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {children}
    </View>
  );
}
