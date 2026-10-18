import { View } from 'react-native';

import { Text, useColors } from '@/shared/ui';

import { useDayColor } from './dayColor';

import type { DayStatus } from '../model/types';

// тонкий пунктир в 1 px теряется
const DASHED_WIDTH = 1.5;

type Props = {
  label: string;
  status: DayStatus;
  today?: boolean;
  // без size кружок занимает ширину родителя
  size?: number;
  // точка внизу кружка: итоги дня подведены
  dot?: boolean;
};

// День кружком: полоска недели и календарь месяца выглядят одинаково
export function DayCircle({ label, status, today, size, dot }: Props) {
  const color = useDayColor();
  const colors = useColors();
  // сегодня закрашиваем только срыв: трезвым день станет, когда закончится
  const filled = status === 'relapse' || (!today && status !== null);
  // на закрашенном цифра и точка цветом фона, иначе в темной теме сливаются
  const fg = filled ? colors.background : today ? colors.text : colors.muted;
  // идущий трезвый день: пунктир цветом трезвого, в цвет рамки его не видно
  const dashed = today && !filled;
  return (
    <View
      style={{
        width: size ?? '100%',
        aspectRatio: 1,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: filled ? color(status) : 'transparent',
        borderWidth: filled ? 0 : dashed ? DASHED_WIDTH : 1,
        borderColor: dashed ? colors.sober : colors.border,
        borderStyle: dashed ? 'dashed' : 'solid',
      }}
    >
      <Text style={{ fontSize: 14, color: fg }}>{label}</Text>
      {dot && (
        <View
          style={{
            position: 'absolute',
            bottom: '14%',
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: fg,
          }}
        />
      )}
    </View>
  );
}
