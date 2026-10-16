import { Button, Screen, Text } from '@/shared/ui';

import { t } from '../i18n';

export function WarningPage() {
  return (
    <Screen
      footer={
        <Button
          variant="primary"
          title={t('warningNext')}
          href="/onboarding/start"
        />
      }
    >
      <Text variant="title">{t('warningTitle')}</Text>
      <Text>{t('warningText')}</Text>
    </Screen>
  );
}
