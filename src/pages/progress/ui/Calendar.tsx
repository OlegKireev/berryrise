import { View } from 'react-native';

import type { Day } from '@/entities/habit';
import { formatMonth, weekdays } from '@/shared/i18n';
import { toDay } from '@/shared/lib';
import { Text } from '@/shared/ui';

import { Bar } from './Bar';
import { DayCell } from './DayCell';
import { Legend } from './Legend';
import { PeriodNav } from './PeriodNav';

import { monthReviews } from '../model/calendar';
import { useCalendar } from '../model/useCalendar';

import { t } from '../i18n';

type Props = {
  startAt: number;
  now: number;
  days: Day[];
  reviewDates: Set<string>;
  onOpen: (date: string) => void;
};

const week = { flexDirection: 'row', gap: 4 } as const;

export function Calendar({ startAt, now, days, reviewDates, onOpen }: Props) {
  const { weeks, status, year, month, ...nav } = useCalendar(
    startAt,
    now,
    days,
  );
  const today = toDay(now);
  const start = toDay(startAt);
  const reviews = monthReviews(year, month, start, now, reviewDates);

  return (
    <View style={{ gap: 8 }}>
      <PeriodNav
        label={formatMonth(year, month)}
        prevLabel={t('prevMonth')}
        nextLabel={t('nextMonth')}
        mark={reviews.collected ? t('monthCollected') : undefined}
        {...nav}
      />
      <View style={week}>
        {weekdays.map((w) => (
          <Text
            key={w}
            variant="hint"
            style={{ flex: 1, textAlign: 'center' }}
          >
            {w}
          </Text>
        ))}
      </View>
      {weeks.map((days, i) => (
        <View
          key={i}
          style={week}
        >
          {days.map((date, j) => (
            <DayCell
              key={date ?? `empty-${j}`}
              date={date}
              status={date ? status(date) : null}
              today={date === today}
              reviewed={date !== null && reviewDates.has(date)}
              onPress={
                date && date >= start && date <= today
                  ? () => onOpen(date)
                  : null
              }
            />
          ))}
        </View>
      ))}
      {reviews.total > 0 && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Bar share={reviews.done / reviews.total} />
          <Text variant="hint">
            {t('dayReview')}:{' '}
            {reviews.collected
              ? t('monthCollected')
              : `${reviews.done} ${t('of')} ${reviews.total}`}
          </Text>
        </View>
      )}
      <Legend />
    </View>
  );
}
