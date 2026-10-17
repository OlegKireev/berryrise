import { File, Paths } from 'expo-file-system';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import {
  clearLog,
  logFile,
  readLog,
  saveFile,
  shareFile,
  toDay,
  toggle,
  type LogEntry,
} from '@/shared/lib';
import { toast } from '@/shared/ui';

import { t } from '../i18n';

// ponytail: на экране только свежие записи, полный журнал - в файле
const VISIBLE = 200;
const MIME = 'text/plain';

// Копия журнала с понятным именем: его подставит диалог сохранения и увидит получатель
function copyForExport() {
  const name = `berryrise-log-${toDay(Date.now())}.txt`;
  const file = new File(Paths.cache, name);
  file.write(logFile().textSync());
  return { name, uri: file.uri };
}

// Записи журнала (перечитывает на фокусе), раскрытые стеки и действия с файлом
export function useLog() {
  const [entries, setEntries] = useState<LogEntry[] | null>(null);
  const [open, setOpen] = useState<number[]>([]);

  const load = useCallback(() => {
    readLog()
      .then((all) => setEntries(all.slice(0, VISIBLE)))
      .catch(() => setEntries([]));
  }, []);
  useFocusEffect(load);

  if (!entries) {
    return null;
  }

  const save = async () => {
    try {
      const saved = await saveFile({ ...copyForExport(), mime: MIME });

      if (saved !== null) {
        toast(`${t('savedFile')}: ${saved}`);
      }
    } catch {
      Alert.alert(t('saveFailed'));
    }
  };

  const share = () => shareFile(copyForExport().uri, MIME);

  const clear = () => {
    clearLog();
    setOpen([]);
    load();
  };

  return {
    entries,
    empty: entries.length === 0,
    isOpen: (i: number) => open.includes(i),
    toggleOpen: (i: number) => setOpen((list) => toggle(list, i)),
    save,
    share,
    clear,
  };
}
