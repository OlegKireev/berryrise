import { router } from 'expo-router';

import { Button, Screen, Text } from '@/shared/ui';

import { t } from '../i18n';

export function IntroPage() {
  return (
    <Screen>
      <Text variant="title">{t('introTitle')}</Text>
      <Text>{t('introText')}</Text>
      <Text variant="label">{t('disclaimer')}</Text>
      <Button
        variant="primary"
        title={t('next')}
        onPress={() => router.push('/onboarding/screening')}
      />
    </Screen>
  );
}
