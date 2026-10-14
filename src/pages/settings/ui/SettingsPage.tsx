import { router } from 'expo-router';
import { Alert, Button } from 'react-native';

import { SpendingForm } from '@/features/edit-spending';
import { DateTimeField, Screen, Text } from '@/shared/ui';

import { useResetData } from '../model/useResetData';
import { useSettings } from '../model/useSettings';

import { t } from '../i18n';

// ponytail: dev-кнопка без i18n, в релизную сборку не попадает
function DevResetButton() {
  const reset = useResetData();
  const confirm = () =>
    Alert.alert('Сбросить все данные?', 'База удалится, начнется онбординг.', [
      { text: t('cancel'), style: 'cancel' },
      { text: 'Сбросить', style: 'destructive', onPress: reset },
    ]);
  return (
    <Button
      title="DEV: сбросить данные"
      color="red"
      onPress={confirm}
    />
  );
}

export function SettingsPage() {
  const settings = useSettings();

  if (!settings) {
    return null;
  }

  return (
    <Screen>
      <Text style={{ fontWeight: '600' }}>{t('startAt')}</Text>
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
      {__DEV__ && <DevResetButton />}
    </Screen>
  );
}
