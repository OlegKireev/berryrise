import { router } from 'expo-router';
import { Button } from 'react-native';

import { Screen, Text } from '@/shared/ui';
import { t } from '@/shared/i18n';

export function WarningPage() {
  return (
    <Screen>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>
        {t('warningTitle')}
      </Text>
      <Text>{t('warningText')}</Text>
      <Button
        title={t('warningNext')}
        onPress={() => router.push('/onboarding/start')}
      />
    </Screen>
  );
}
