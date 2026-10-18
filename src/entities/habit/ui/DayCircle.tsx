import { View } from 'react-native';

import { Text, useColors } from '@/shared/ui';

import { useDayColor } from './dayColor';

import type { DayStatus } from '../model/types';

// тонкий пунктир в 1 px теряется
const DASHED_WIDTH = 1.5;
// цветное кольцо дня без итогов толще серого, чтобы пустой день был заметен
const RING_WIDTH = 2;

type Props = {
  label: string;
  status: DayStatus;
  today?: boolean;
  // без size кружок занимает ширину родителя
  size?: number;
  // итоги дня подведены: кружок закрашен, иначе кольцо
  reviewed?: boolean;
};

// День кружком: полоска недели и календарь месяца выглядят одинаково.
// Цвет - статус дня, заливка - итоги дня
export function DayCircle({ label, status, today, size, reviewed }: Props) {
  const color = useDayColor();
  const colors = useColors();
  const filled = !!reviewed;
  // идущий трезвый день без итогов: пунктир, трезвым он станет, когда закончится
  const dashed = today && !filled && status !== 'relapse';
  // на цветной заливке цифра цветом фона, иначе в темной теме сливается;
  // нейтральная заливка светлая, на ней цифра цветом текста
  const fg =
    filled && status !== null
      ? colors.background
      : filled || today || status !== null
        ? colors.text
        : colors.muted;
  return (
    <View
      style={{
        width: size ?? '100%',
        aspectRatio: 1,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: filled ? color(status) : 'transparent',
        borderWidth: filled
          ? 0
          : dashed
            ? DASHED_WIDTH
            : status === null
              ? 1
              : RING_WIDTH,
        borderColor: dashed ? colors.sober : color(status),
        borderStyle: dashed ? 'dashed' : 'solid',
      }}
    >
      <Text style={{ fontSize: 14, color: fg }}>{label}</Text>
    </View>
  );
}
