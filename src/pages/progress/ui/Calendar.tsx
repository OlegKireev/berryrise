import { View } from 'react-native';

import type { Day } from '@/entities/habit';
import { weekdays } from '@/shared/i18n';
import { Text } from '@/shared/ui';

import { DayCell } from './DayCell';
import { Legend } from './Legend';
import { MonthNav } from './MonthNav';

import { useCalendar } from '../model/useCalendar';

type Props = {
  startAt: number;
  now: number;
  days: Day[];
  reviewDates: Set<string>;
};

const week = { flexDirection: 'row', gap: 4 } as const;

export function Calendar({ startAt, now, days, reviewDates }: Props) {
  const { weeks, status, ...nav } = useCalendar(startAt, now, days);

  return (
    <View style={{ gap: 8 }}>
      <MonthNav {...nav} />
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
              reviewed={date !== null && reviewDates.has(date)}
            />
          ))}
        </View>
      ))}
      <Legend />
    </View>
  );
}
