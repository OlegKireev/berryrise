import Constants from 'expo-constants';

import { formatDate } from '@/shared/i18n';
import { currentUpdate } from '@/shared/lib';
import { Row, Screen, Text } from '@/shared/ui';

import { t } from '../i18n';
import { useCheckUpdate } from '../model/useCheckUpdate';

export function AboutPage() {
  const update = currentUpdate();
  const { available, checking, check } = useCheckUpdate();

  return (
    <Screen>
      <Text variant="title">{Constants.expoConfig?.name}</Text>
      <Text variant="hint">
        {t('version')} {Constants.expoConfig?.version}
        {update &&
          ` (${t('update')} ${update.id}, ${formatDate(update.createdAt)})`}
      </Text>
      <Text>{t('disclaimer')}</Text>
      {available && (
        <Row
          label={checking ? t('checking') : t('checkUpdates')}
          onPress={check}
        />
      )}
      <Row
        label={t('log')}
        href="/settings/log"
      />
    </Screen>
  );
}
