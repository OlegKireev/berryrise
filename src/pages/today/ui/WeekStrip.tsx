import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { DayCircle } from '@/entities/habit';
import { formatDay, weekdays } from '@/shared/i18n';
import { at } from '@/shared/lib';

import type { WeekDay } from '../model/week';

// Последние 7 дней кружками, как в календаре, сегодня справа.
// Тап по дню от старта открывает ту же карточку дня, что календарь на "Прогрессе"
export function WeekStrip({ week }: { week: WeekDay[] }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
      }}
    >
      {week.map((d, i) => (
        <Pressable
          key={d.date}
          disabled={!d.canOpen}
          onPress={() =>
            router.push({ pathname: '/day/[date]', params: { date: d.date } })
          }
          accessibilityRole="button"
          accessibilityLabel={formatDay(d.date)}
          accessibilityState={{ disabled: !d.canOpen }}
        >
          <DayCircle
            label={at(weekdays, d.weekday)}
            status={d.status}
            today={i === week.length - 1}
            dot={d.reviewed}
            size={36}
          />
        </Pressable>
      ))}
    </View>
  );
}
