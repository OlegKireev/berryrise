import { View } from 'react-native';

import { Text } from '@/shared/ui';

import { ReviewDot } from './ReviewDot';
import { useStatusColor } from './statusColor';

import type { Status } from '../model/useCalendar';

type Props = {
  date: string | null; // null - пустая клетка до начала или после конца месяца
  status: Status;
  reviewed: boolean;
};

export function DayCell({ date, status, reviewed }: Props) {
  const color = useStatusColor();
  return (
    <View
      style={{
        flex: 1,
        aspectRatio: 1,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: date ? color(status) : 'transparent',
      }}
    >
      {date && <Text>{Number(date.slice(8))}</Text>}
      {date && reviewed && <ReviewDot />}
    </View>
  );
}
