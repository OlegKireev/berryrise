import { useColors } from '@/shared/ui';

import type { DayStatus } from '../model/types';

// Цвет дня в календаре, легенде и полоске недели
export function useDayColor() {
  const colors = useColors();
  return (s: DayStatus) =>
    s === null ? colors.border : s === 'sober' ? colors.sober : colors.relapse;
}
