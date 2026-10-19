// Какой бандл сейчас работает: скачанное OTA-обновление или встроенный в APK.
// Проверку, скачивание и откат делает expo-updates сам по настройкам app.json
import { File, Paths } from 'expo-file-system';
import * as Updates from 'expo-updates';

import { log, logError } from './log';

const SHORT_ID = 8;

// id бандла прошлого запуска. Файл, а не settings: settings уходит в экспорт, а бандл - свойство устройства
const lastIdFile = () => new File(Paths.document, 'update-id');

// Раз при старте процесса (index.ts): событие в журнал, если бандл сменился с прошлого запуска
export function logUpdateLaunch() {
  try {
    const id = Updates.isEmbeddedLaunch
      ? 'embedded'
      : (Updates.updateId ?? 'embedded');
    const file = lastIdFile();

    if (file.exists && file.textSync() === id) {
      return;
    }

    log(
      'updates',
      Updates.isEmergencyLaunch ? `launch ${id} (emergency)` : `launch ${id}`,
    );

    if (!file.exists) {
      file.create();
    }

    file.write(id);
  } catch (e) {
    logError('updates', e);
  }
}

// Скачанное обновление для "О приложении"; null - работает встроенный бандл
export function currentUpdate() {
  if (Updates.isEmbeddedLaunch || !Updates.updateId || !Updates.createdAt) {
    return null;
  }

  return {
    id: Updates.updateId.slice(0, SHORT_ID),
    createdAt: Updates.createdAt.getTime(),
  };
}
