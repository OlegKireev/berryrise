import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { formatDate, formatTime } from '@/shared/i18n';
import { dayDate, minutesOfDay } from '@/shared/lib';
import { Card, Text } from '@/shared/ui';

import type { NoteDay } from '../model/notes';

import { t } from '../i18n';

type Props = {
  day: NoteDay;
  // в превью текст обрезаем, в ленте он целиком
  lines?: number;
};

function Entry({
  context,
  note,
  lines,
}: {
  context: string;
  note: string;
  lines?: number;
}) {
  return (
    <View style={{ gap: 2 }}>
      <Text variant="hint">{context}</Text>
      <Text numberOfLines={lines}>{note}</Text>
    </View>
  );
}

// Заметки одного дня: дата, итоги, под ними срывы. Тап открывает карточку дня
export function NoteCard({ day, lines }: Props) {
  const { review, relapses } = day;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() =>
        router.push({ pathname: '/day/[date]', params: { date: day.date } })
      }
      style={({ pressed }) => pressed && { opacity: 0.6 }}
    >
      <Card style={{ gap: 12 }}>
        <Text weight="semibold">{formatDate(dayDate(day.date).getTime())}</Text>
        {review && (
          <Entry
            context={`${t(`option.mood.${review.mood}`)} · ${t('noteCraving')}: ${t(`option.craving.${review.craving}`).toLowerCase()}`}
            note={review.note}
            lines={lines}
          />
        )}
        {relapses.map((r) => (
          <Entry
            key={r.at}
            context={[
              `${t('relapse')} · ${formatTime(minutesOfDay(new Date(r.at)))}`,
              r.mood && t(`option.mood.${r.mood}`),
            ]
              .filter(Boolean)
              .join(' · ')}
            note={r.note}
            lines={lines}
          />
        ))}
      </Card>
    </Pressable>
  );
}
