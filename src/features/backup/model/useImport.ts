import { File } from 'expo-file-system';
import { useSQLiteContext } from 'expo-sqlite';
import { Alert } from 'react-native';

import { schemaVersion } from '@/shared/db';
import { toast } from '@/shared/ui';

import { importBackup } from '../api/backup';
import { parseBackup, type Backup } from './format';

import { t } from '../i18n';

type Options = {
  // в онбординге заменять нечего, подтверждение не нужно
  confirm: boolean;
  onImported: () => void | Promise<void>;
};

// Облака и мессенджеры часто отдают JSON как octet-stream или text/plain, решает содержимое
const mimeTypes = [
  'application/json',
  'application/octet-stream',
  'text/plain',
];

const ask = () =>
  new Promise<boolean>((resolve) =>
    Alert.alert(
      t('replaceTitle'),
      t('replaceText'),
      [
        { text: t('cancel'), style: 'cancel', onPress: () => resolve(false) },
        {
          text: t('replace'),
          style: 'destructive',
          onPress: () => resolve(true),
        },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    ),
  );

// Выбор файла, проверка, подтверждение и замена всех данных
export function useImport({ confirm, onImported }: Options) {
  const db = useSQLiteContext();

  return async () => {
    const picked = await File.pickFileAsync({ mimeTypes });
    if (picked.canceled) return;

    let backup: Backup | 'notBackup' | 'tooNew';
    try {
      backup = parseBackup(await picked.result.text(), schemaVersion);
    } catch {
      backup = 'notBackup';
    }
    if (typeof backup === 'string')
      return Alert.alert(t('importFailed'), t(backup));
    if (confirm && !(await ask())) return;

    try {
      await importBackup(db, backup);
    } catch {
      return Alert.alert(t('importFailed'), t('damaged'));
    }
    toast(t('restored'));
    await onImported();
  };
}
