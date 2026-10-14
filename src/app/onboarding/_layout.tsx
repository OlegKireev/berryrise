import { Stack } from 'expo-router';

import { useScreenColors } from '@/shared/ui';

export default function OnboardingLayout() {
  const screenColors = useScreenColors();
  return <Stack screenOptions={{ ...screenColors, title: '' }} />;
}
