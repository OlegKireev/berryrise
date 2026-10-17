import Constants from 'expo-constants';

import { Row, Screen, Text } from '@/shared/ui';

import { t } from '../i18n';

export function AboutPage() {
  return (
    <Screen>
      <Text variant="title">{Constants.expoConfig?.name}</Text>
      <Text variant="hint">
        {t('version')} {Constants.expoConfig?.version}
      </Text>
      <Text>{t('disclaimer')}</Text>
      <Row
        label={t('log')}
        href="/settings/log"
      />
    </Screen>
  );
}
