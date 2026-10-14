import { Button, Text } from '@/shared/ui';

import { openAutostartSettings } from '../model/autostart';

import { t } from '../i18n';

// Как не дать Xiaomi и подобным убить напоминания
export function AutostartHint() {
  return (
    <>
      <Text variant="heading">{t('autostart.title')}</Text>
      <Text>{t('autostart.body')}</Text>
      <Button
        title={t('autostart.open')}
        onPress={openAutostartSettings}
      />
    </>
  );
}
