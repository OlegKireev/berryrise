import { useSQLiteContext } from 'expo-sqlite';
import { Alert, Button } from 'react-native';

import { t } from '@/shared/i18n';

import { deleteRelapse } from '../model/deleteRelapse';

type Props = { id: string; onDeleted: () => void };

// Удаление срыва с подтверждением
export function DeleteRelapseButton({ id, onDeleted }: Props) {
  const db = useSQLiteContext();

  const confirm = () =>
    Alert.alert(t('deleteRelapseTitle'), t('deleteRelapseText'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: () => deleteRelapse(db, id).then(onDeleted),
      },
    ]);

  return (
    <Button
      title={t('delete')}
      onPress={confirm}
    />
  );
}
