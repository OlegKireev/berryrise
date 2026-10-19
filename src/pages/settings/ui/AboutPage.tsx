import Constants from 'expo-constants';

import { formatDate } from '@/shared/i18n';
import { currentUpdate } from '@/shared/lib';
import { Row, Screen, Text } from '@/shared/ui';

import { t } from '../i18n';

export function AboutPage() {
  const update = currentUpdate();

  return (
    <Screen>
      <Text variant="title">{Constants.expoConfig?.name}</Text>
      <Text variant="hint">
        {t('version')} {Constants.expoConfig?.version}
        {update &&
          ` (${t('update')} ${update.id}, ${formatDate(update.createdAt)})`}
      </Text>
      <Text>{t('disclaimer')}</Text>
      <Row
        label={t('log')}
        href="/settings/log"
      />
    </Screen>
  );
}
