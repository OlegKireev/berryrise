import { Pressable, View } from 'react-native';

import { DayCircle, type DayStatus } from '@/entities/habit';
import { dayDate } from '@/shared/lib';

type Props = {
  date: string | null; // null - пустая клетка до начала или после конца месяца
  status: DayStatus;
  today: boolean;
  reviewed: boolean;
  // null - день не выбирается: до старта или в будущем
  onPress: (() => void) | null;
};

export function DayCell({ date, status, today, reviewed, onPress }: Props) {
  if (!date) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress ?? undefined}
      accessibilityRole="button"
      accessibilityState={{ disabled: !onPress }}
      style={{ flex: 1 }}
    >
      <DayCircle
        label={String(dayDate(date).getDate())}
        status={status}
        today={today}
        dot={reviewed}
      />
    </Pressable>
  );
}
