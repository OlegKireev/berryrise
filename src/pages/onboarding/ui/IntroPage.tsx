import { router } from 'expo-router';
import { Button } from 'react-native';

import { Screen, Text } from '@/shared/ui';

import { t } from '../i18n';

export function IntroPage() {
  return (
    <Screen>
      <Text style={{ fontSize: 28, fontWeight: '600' }}>{t('introTitle')}</Text>
      <Text>{t('introText')}</Text>
      <Text style={{ fontWeight: '600' }}>{t('disclaimer')}</Text>
      <Button
        title={t('next')}
        onPress={() => router.push('/onboarding/screening')}
      />
    </Screen>
  );
}
