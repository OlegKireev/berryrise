import { Alert, Button } from 'react-native';

import { useDeleteRelapse } from '../model/deleteRelapse';

import { t } from '../i18n';

type Props = { id: string; onDeleted: () => void };

// Удаление срыва с подтверждением
export function DeleteRelapseButton({ id, onDeleted }: Props) {
  const deleteRelapse = useDeleteRelapse();

  const confirm = () =>
    Alert.alert(t('deleteRelapseTitle'), t('deleteRelapseText'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: () => deleteRelapse(id).then(onDeleted),
      },
    ]);

  return (
    <Button
      title={t('delete')}
      onPress={confirm}
    />
  );
}
