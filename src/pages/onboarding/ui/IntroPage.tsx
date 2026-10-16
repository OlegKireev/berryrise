import { ImportButton } from '@/features/backup';
import { Button, Screen, Text } from '@/shared/ui';

import { useRestore } from '../model/useRestore';

import { t } from '../i18n';

export function IntroPage() {
  const { onImported } = useRestore();
  return (
    <Screen>
      <Text variant="title">{t('introTitle')}</Text>
      <Text>{t('introText')}</Text>
      <Text variant="label">{t('disclaimer')}</Text>
      <Button
        variant="primary"
        title={t('next')}
        href="/onboarding/screening"
      />
      <ImportButton
        variant="quiet"
        title={t('restoreFromFile')}
        confirm={false}
        onImported={onImported}
      />
    </Screen>
  );
}
