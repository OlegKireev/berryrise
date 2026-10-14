import { Alert, Button } from 'react-native';

import { useResetData } from '../model/useResetData';

import { t } from '../i18n';

// ponytail: dev-кнопка без i18n, в релизную сборку не попадает
export function DevResetButton() {
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
