import { Pressable, View } from 'react-native';

import { formatDateTime } from '@/shared/i18n';
import type { LogEntry } from '@/shared/lib';
import { Text, useColors } from '@/shared/ui';

type Props = { entry: LogEntry; open: boolean; onToggle: () => void };

// Запись журнала: время и источник, сообщение (ошибки цветом срыва), стек по тапу
export function LogEntryRow({ entry, open, onToggle }: Props) {
  const colors = useColors();
  const error = entry.level === 'error';
  const content = (
    <View style={{ gap: 2 }}>
      <Text variant="hint">
        {formatDateTime(entry.at)} · {entry.tag}
      </Text>
      <Text
        weight={error ? 'semibold' : undefined}
        style={error ? { color: colors.relapse } : undefined}
      >
        {entry.msg}
      </Text>
      {open && entry.stack ? (
        <Text
          variant="hint"
          style={{ fontSize: 12 }}
        >
          {entry.stack}
        </Text>
      ) : null}
    </View>
  );

  if (!entry.stack) {
    return content;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      onPress={onToggle}
    >
      {content}
    </Pressable>
  );
}
