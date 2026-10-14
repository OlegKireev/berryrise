import { useColors } from '@/shared/ui';

import type { Status } from '../model/useCalendar';

// Цвет дня в календаре и легенде
export function useStatusColor() {
  const colors = useColors();
  return (s: Status) =>
    s === null ? colors.border : s === 'sober' ? colors.sober : colors.relapse;
}
