// Журнал ошибок и событий в файле на устройстве. Запись синхронная: успевает до падения процесса.
// Не в SQLite: не попадает в экспорт, переживает импорт и работает, когда сломана сама база
import { File, Paths } from 'expo-file-system';

import { entryLine, parseLog, trimLines, type LogTag } from './logEntries';

const MAX_ENTRIES = 1000;

export const logFile = () => new File(Paths.document, 'app.log');

function append(line: string) {
  try {
    const file = logFile();

    if (!file.exists) {
      file.create();
    }

    file.write(line, { append: true });
  } catch {
    // журнал не должен ничего ломать
  }
}

// Событие (фоновые задачи); в консоль не пишем, только в журнал
export function log(tag: LogTag, msg: string) {
  append(entryLine('info', tag, msg));
}

// Ошибка со стеком; в dev она по-прежнему видна в metro
export function logError(tag: LogTag, e: unknown) {
  console.warn(`[${tag}]`, e);
  append(
    e instanceof Error
      ? entryLine('error', tag, e.message, e.stack)
      : entryLine('error', tag, String(e)),
  );
}

export async function readLog() {
  const file = logFile();
  return file.exists ? parseLog(await file.text()) : [];
}

export function clearLog() {
  const file = logFile();

  if (file.exists) {
    file.delete();
  }
}

// Раз при старте процесса (index.ts): лимит записей и удаление прежнего журнала виджета
export function trimLog() {
  try {
    const old = new File(Paths.document, 'widget.log');

    if (old.exists) {
      old.delete();
    }

    const file = logFile();

    if (!file.exists) {
      return;
    }

    const trimmed = trimLines(file.textSync(), MAX_ENTRIES);

    if (trimmed !== null) {
      file.write(trimmed);
    }
  } catch {
    // журнал не должен ничего ломать
  }
}
