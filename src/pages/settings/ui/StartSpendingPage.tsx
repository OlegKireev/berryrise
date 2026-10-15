import { router } from 'expo-router';

import { SpendingForm } from '@/features/edit-spending';
import { DateTimeField, Screen, Text } from '@/shared/ui';

import { useSettings } from '../model/useSettings';

import { t } from '../i18n';

export function StartSpendingPage() {
  const settings = useSettings();

  if (!settings) {
    return null;
  }

  return (
    <Screen>
      <Text variant="label">{t('startAt')}</Text>
      <DateTimeField
        value={new Date(settings.habit.startAt)}
        onChange={settings.changeStart}
        max={new Date(settings.maxStart)}
      />
      <SpendingForm
        habit={settings.habit}
        submitLabel={t('save')}
        onSaved={() => router.back()}
      />
    </Screen>
  );
}
