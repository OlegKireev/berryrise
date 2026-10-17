// TODO(widget-log): временный журнал фоновых обновлений виджета, чтобы поймать,
// почему утром на виджете не то число. Убрать после диагностики вместе с кнопкой в "О приложении".
import { File, Paths } from 'expo-file-system';
import { useFocusEffect } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useCallback, useState } from 'react';

// ponytail: файл растет без ограничений, ~6 КБ в день; журнал временный
const logFile = () => new File(Paths.document, 'widget.log');

const pad = (n: number) => String(n).padStart(2, '0');

export function logWidget(line: string) {
  const d = new Date();
  const at = `${pad(d.getDate())}.${pad(d.getMonth() + 1)} ${d.toTimeString().split(' ')[0] ?? ''}`;

  try {
    const file = logFile();

    if (!file.exists) {
      file.create();
    }

    file.write(`${at} ${line}\n`, { append: true });
  } catch {
    // журнал не должен ломать виджет
  }
}

// false - журнала еще нет
export async function shareWidgetLog() {
  const file = logFile();

  if (!file.exists) {
    return false;
  }

  await Sharing.shareAsync(file.uri, { mimeType: 'text/plain' });
  return true;
}

// Последние строки журнала, свежие сверху; перечитывает на фокусе экрана
export function useWidgetLog(lines = 40) {
  const [text, setText] = useState('');
  useFocusEffect(
    useCallback(() => {
      const file = logFile();

      if (!file.exists) {
        return setText('');
      }

      file
        .text()
        .then((s) =>
          setText(s.trim().split('\n').slice(-lines).reverse().join('\n')),
        )
        .catch(() => setText(''));
    }, [lines]),
  );
  return text;
}
