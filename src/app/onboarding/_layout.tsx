import { Stack } from 'expo-router';

import { headerOptions } from '@/shared/ui';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ ...headerOptions, title: '' }}>
      {/* первый шаг без шапки: иконка продолжает сплэш */}
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
