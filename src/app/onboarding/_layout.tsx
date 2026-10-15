import { Stack } from 'expo-router';

import { headerOptions } from '@/shared/ui';

export default function OnboardingLayout() {
  return <Stack screenOptions={{ ...headerOptions, title: '' }} />;
}
