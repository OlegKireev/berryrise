import { useTheme } from 'expo-router';

import type { Status } from '../model/useCalendar';

// ponytail: цвета наугад, подберем вместе со стилизацией
const SOBER = '#30a46c';
const RELAPSE = '#e5484d';

// Цвет дня в календаре и легенде
export function useStatusColor() {
  const { colors } = useTheme();
  return (s: Status) =>
    s === null ? colors.border : s === 'sober' ? SOBER : RELAPSE;
}
