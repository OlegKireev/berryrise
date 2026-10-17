import { File, Paths } from 'expo-file-system';
import { useSQLiteContext } from 'expo-sqlite';
import { Alert } from 'react-native';

import { schemaVersion } from '@/shared/db';
import { saveFile, shareFile } from '@/shared/lib';
import { toast } from '@/shared/ui';

import { dumpTables } from '../api/backup';
import { APP, backupFileName } from './format';

import { t } from '../i18n';

const MIME = 'application/json';

export function useExport() {
  const db = useSQLiteContext();

  // Файл экспорта во временной папке приложения, оттуда его копируют или отправляют
  const build = async () => {
    const now = new Date();
    const name = backupFileName(now);
    const file = new File(Paths.cache, name);
    file.write(
      JSON.stringify({
        app: APP,
        schemaVersion,
        exportedAt: now.getTime(),
        tables: await dumpTables(db),
      }),
    );
    return { name, uri: file.uri };
  };

  const save = async () => {
    const { name, uri } = await build();

    try {
      const saved = await saveFile({ uri, name, mime: MIME });

      if (saved !== null) {
        toast(`${t('saved')}: ${saved}`);
      }
    } catch {
      Alert.alert(t('saveFailed'));
    }
  };

  const share = async () => {
    const { uri } = await build();
    await shareFile(uri, MIME);
  };

  return () =>
    Alert.alert(t('exportData'), t('exportWhere'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('send'), onPress: share },
      { text: t('saveToPhone'), onPress: save },
    ]);
}
