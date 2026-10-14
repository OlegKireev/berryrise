import { View } from 'react-native';

import { Text, useColors } from '@/shared/ui';

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
  const colors = useColors();
  // на закрашенной клетке цифра цветом фона, иначе в темной теме сливается
  const fg = status ? colors.background : colors.text;
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
      {date && <Text style={{ color: fg }}>{Number(date.slice(8))}</Text>}
      {date && reviewed && <ReviewDot color={fg} />}
    </View>
  );
}
