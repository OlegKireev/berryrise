import {
  errorCodes,
  isErrorWithCode,
  saveDocuments,
} from '@react-native-documents/picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useSQLiteContext } from 'expo-sqlite';
import { Alert } from 'react-native';

import { schemaVersion } from '@/shared/db';
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

  // Системный диалог "Сохранить как": в нем можно выбрать и Download, и корень памяти
  // (выбор папки туда не пускает). Здесь, в отличие от "Поделиться", результат известен точно
  const save = async () => {
    const { name, uri } = await build();
    try {
      const [res] = await saveDocuments({
        sourceUris: [uri],
        mimeType: MIME,
        fileName: name,
      });
      if (res.error) throw new Error(res.error);
      toast(`${t('saved')}: ${res.name ?? name}`);
    } catch (e) {
      if (isErrorWithCode(e) && e.code === errorCodes.OPERATION_CANCELED)
        return;
      Alert.alert(t('saveFailed'));
    }
  };

  // Системное "Поделиться". Закрыть меню - не ошибка:
  // на Android shareAsync завершается одинаково, отправили файл или нет
  const share = async () => {
    const { uri } = await build();
    await Sharing.shareAsync(uri, { mimeType: MIME });
  };

  return () =>
    Alert.alert(t('exportData'), t('exportWhere'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('send'), onPress: share },
      { text: t('saveToPhone'), onPress: save },
    ]);
}
