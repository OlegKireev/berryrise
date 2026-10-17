import Constants from 'expo-constants';

import { shareWidgetLog, useWidgetLog } from '@/features/widget';
import { Button, Screen, Text, toast } from '@/shared/ui';

import { t } from '../i18n';

export function AboutPage() {
  const widgetLog = useWidgetLog();
  return (
    <Screen>
      <Text variant="title">{Constants.expoConfig?.name}</Text>
      <Text variant="hint">
        {t('version')} {Constants.expoConfig?.version}
      </Text>
      <Text>{t('disclaimer')}</Text>
      {/* TODO(widget-log): временно, убрать вместе с журналом виджета */}
      <Button
        variant="quiet"
        title={t('shareWidgetLog')}
        onPress={async () => {
          if (!(await shareWidgetLog())) toast(t('widgetLogEmpty'));
        }}
      />
      {widgetLog ? <Text variant="hint">{widgetLog}</Text> : null}
    </Screen>
  );
}
