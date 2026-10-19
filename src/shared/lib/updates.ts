// Какой бандл сейчас работает: скачанное OTA-обновление или встроенный в APK.
// Проверку, скачивание и откат делает expo-updates сам по настройкам app.json
import { File, Paths } from 'expo-file-system';
import * as Updates from 'expo-updates';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { log, logError } from './log';
import { HOUR_MS } from './utils/time';

const SHORT_ID = 8;
// После такого перерыва человек обычно начинает с "Сегодня", перезапуск ничего не обрывает
const RESUME_RELOAD_AFTER = HOUR_MS;
// Скачалось за это время от возврата - еще можно перезапуститься незаметно для действий
const RELOAD_WINDOW = 3000;
// Как часто отмечаем, что приложение на экране; точность перерыва
const TICK = 30_000;

// В dev-клиенте isEnabled true даже при updates.enabled: false (модуль подменяет dev launcher)
export const otaEnabled = Updates.isEnabled && !__DEV__;

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

// Метка "перезапустились ради обновления": по ней корневой layout покажет тост.
// На холодном старте бандл тоже меняется, но двойной загрузки человек не видит
const reloadedFile = () => new File(Paths.document, 'update-reloaded');

// Перезапуск на скачанном обновлении с меткой для тоста
export async function reloadForUpdate() {
  const file = reloadedFile();

  try {
    if (!file.exists) {
      file.create();
    }

    await Updates.reloadAsync();
  } catch (e) {
    if (file.exists) {
      file.delete();
    }

    throw e;
  }
}

// Раз на старте: был ли этот запуск перезапуском ради обновления (метка снимается)
export function consumeUpdateReloaded() {
  try {
    const file = reloadedFile();

    if (!file.exists) {
      return false;
    }

    file.delete();
    return true;
  } catch {
    return false;
  }
}

// Корневой layout: при возврате из фона после долгого перерыва перезапуск на скачанном
// обновлении, а если его нет - проверка и скачивание; перезапуск, только если скачалось
// за RELOAD_WINDOW от возврата: позже человек уже работает с экраном, и перезапуск выбил бы его.
// isUpdatePending одного не хватает: событие о скачивании при запуске может прийти до подписки,
// и флаг останется false (свежего состояния API не дает). Уже скачанный бандл
// fetchUpdateAsync отдает за доли секунды, он попадает в окно
export function useUpdateOnResume() {
  const { isUpdatePending } = Updates.useUpdates();
  const pending = useRef(isUpdatePending);

  useEffect(() => {
    pending.current = isUpdatePending;
  }, [isUpdatePending]);

  useEffect(() => {
    if (!otaEnabled) {
      return;
    }

    // Время ухода не берем из события background: свернутый процесс Android замораживает,
    // и событие может прийти только при возврате, вместе с active (перерыв выйдет нулевым).
    // Вместо этого тик раз в TICK отмечает "был на экране"; в фоне JS-таймеры стоят,
    // поэтому разрыв между отметками и есть перерыв. Проверяют и тик, и active: кто раньше
    let lastSeen = Date.now();
    const onTick = () => {
      // фоновые задачи виджета и уведомлений идут в том же процессе, таймер может тикнуть и там
      if (AppState.currentState !== 'active') {
        return;
      }

      const backAt = Date.now();
      const away = backAt - lastSeen;
      lastSeen = backAt;
      if (away < RESUME_RELOAD_AFTER) {
        return;
      }

      // возврат после часа редок, поэтому решение и ошибки пишем в журнал
      const reload = () => {
        log('updates', 'resume: reload');
        reloadForUpdate().catch((e: unknown) => logError('updates', e));
      };

      if (pending.current) {
        reload();
        return;
      }

      Updates.checkForUpdateAsync()
        .then((r) => {
          log('updates', `resume: check available=${String(r.isAvailable)}`);
          return r.isAvailable ? Updates.fetchUpdateAsync() : null;
        })
        .then((f) => {
          if (!f?.isNew) {
            return;
          }

          const took = Date.now() - backAt;
          log('updates', `resume: fetched in ${String(took)}ms`);

          if (took <= RELOAD_WINDOW) {
            reload();
          }
        })
        .catch((e: unknown) => logError('updates', e));
    };

    const timer = setInterval(onTick, TICK);
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') {
        onTick();
      }
    });
    return () => {
      clearInterval(timer);
      sub.remove();
    };
  }, []);
}
