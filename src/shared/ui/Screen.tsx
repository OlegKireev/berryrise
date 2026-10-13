import type { ReactNode } from 'react';
import { ScrollView } from 'react-native';

export function Screen({ children }: { children: ReactNode }) {
  return (
    <ScrollView
      contentContainerStyle={{ padding: 16, gap: 12 }}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}
