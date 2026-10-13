import { useSQLiteContext } from 'expo-sqlite';
import { Alert, Button, DevSettings, View } from 'react-native';

import { resetDatabase } from '@/shared/db';
import { Placeholder } from '@/shared/ui';
import { t } from '@/shared/i18n';

// ponytail: dev-кнопка без i18n, в релизную сборку не попадает
function DevResetButton() {
  const db = useSQLiteContext();
  const confirm = () =>
    Alert.alert('Сбросить все данные?', 'База удалится, начнется онбординг.', [
      { text: t('cancel'), style: 'cancel' },
      {
        text: 'Сбросить',
        style: 'destructive',
        onPress: async () => {
          await resetDatabase(db);
          // Перезагрузка JS: migrate создаст схему заново, табы уведут на онбординг
          DevSettings.reload();
        },
      },
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
  return (
    <View style={{ flex: 1 }}>
      <Placeholder title={t('settings')} />
      {__DEV__ && (
        <View style={{ padding: 16 }}>
          <DevResetButton />
        </View>
      )}
    </View>
  );
}
