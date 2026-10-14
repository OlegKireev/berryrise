import { router } from 'expo-router';
import { Button } from 'react-native';

import { Screen, Text } from '@/shared/ui';

import { t } from '../i18n';

export function WarningPage() {
  return (
    <Screen>
      <Text variant="title">{t('warningTitle')}</Text>
      <Text>{t('warningText')}</Text>
      <Button
        title={t('warningNext')}
        onPress={() => router.push('/onboarding/start')}
      />
    </Screen>
  );
}
