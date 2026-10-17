// Чистая часть журнала: формат записи, разбор и обрезка файла (сам файл в log.ts)
import { isOneOf, isRecord, isString, parseJson } from './utils/json';

// Источник записи
export type LogTag =
  | 'global'
  | 'render'
  | 'widget'
  | 'notifications'
  | 'reasons'
  | 'spending'
  | 'onboarding';

const levels = ['error', 'info'] as const;
type LogLevel = (typeof levels)[number];

// tag при чтении - любая строка: запись от прошлой версии не теряем
export type LogEntry = {
  at: number;
  level: LogLevel;
  tag: string;
  msg: string;
  stack?: string;
};

const MAX_STACK = 4000;

// Одна JSON-строка на запись: переводы строк в стеке экранируются
export function entryLine(
  level: LogLevel,
  tag: LogTag,
  msg: string,
  stack?: string,
) {
  const entry: LogEntry = {
    at: Date.now(),
    level,
    tag,
    msg,
    ...(stack ? { stack: stack.slice(0, MAX_STACK) } : {}),
  };
  return `${JSON.stringify(entry)}\n`;
}

function toEntry(v: unknown): LogEntry | null {
  if (
    !isRecord(v) ||
    typeof v.at !== 'number' ||
    !isOneOf(levels)(v.level) ||
    !isString(v.tag) ||
    !isString(v.msg)
  ) {
    return null;
  }

  return {
    at: v.at,
    level: v.level,
    tag: v.tag,
    msg: v.msg,
    ...(isString(v.stack) ? { stack: v.stack } : {}),
  };
}

// Записи свежими первыми; битые строки (оборванные при падении) пропускаем
export function parseLog(text: string): LogEntry[] {
  return text
    .split('\n')
    .map((line) => (line ? toEntry(parseJson(line)) : null))
    .filter((e) => e !== null)
    .reverse();
}

// Последние max строк файла; null - обрезать нечего
export function trimLines(text: string, max: number): string | null {
  const lines = text.split('\n').filter(Boolean);

  if (lines.length <= max) {
    return null;
  }

  return `${lines.slice(-max).join('\n')}\n`;
}
