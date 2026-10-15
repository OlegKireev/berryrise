import { View } from 'react-native';

import { DayCircle, type DayStatus } from '@/entities/habit';

type Props = {
  date: string | null; // null - пустая клетка до начала или после конца месяца
  status: DayStatus;
  today: boolean;
  reviewed: boolean;
};

export function DayCell({ date, status, today, reviewed }: Props) {
  return (
    <View style={{ flex: 1 }}>
      {date && (
        <DayCircle
          label={String(Number(date.slice(8)))}
          status={status}
          today={today}
          dot={reviewed}
        />
      )}
    </View>
  );
}
