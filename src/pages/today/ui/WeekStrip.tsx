import { View } from 'react-native';

import { DayCircle } from '@/entities/habit';
import { weekdays } from '@/shared/i18n';

import type { WeekDay } from '../model/week';

// Последние 7 дней кружками, как в календаре, сегодня справа
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
        <DayCircle
          key={d.date}
          label={weekdays[d.weekday]!}
          status={d.status}
          today={i === week.length - 1}
          size={36}
        />
      ))}
    </View>
  );
}
