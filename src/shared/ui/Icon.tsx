// По одной иконке, а не из корня пакета: Metro в dev не вырезает неиспользуемое
import Archive from 'lucide-react-native/icons/archive';
import Bell from 'lucide-react-native/icons/bell';
import Check from 'lucide-react-native/icons/check';
import CalendarCheck from 'lucide-react-native/icons/calendar-check';
import ChevronLeft from 'lucide-react-native/icons/chevron-left';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import Heart from 'lucide-react-native/icons/heart';
import Info from 'lucide-react-native/icons/info';
import Lock from 'lucide-react-native/icons/lock';
import Moon from 'lucide-react-native/icons/moon';
import Settings from 'lucide-react-native/icons/settings';
import Star from 'lucide-react-native/icons/star';
import Wallet from 'lucide-react-native/icons/wallet';

import { useColors } from './theme';

const icons = {
  archive: Archive,
  bell: Bell,
  calendarCheck: CalendarCheck,
  check: Check,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  heart: Heart,
  info: Info,
  lock: Lock,
  moon: Moon,
  settings: Settings,
  star: Star,
  wallet: Wallet,
};

export type IconName = keyof typeof icons;

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  // заливка контура, по умолчанию нет
  fill?: string;
};

// Единственное место, которое знает про Lucide. Толщина линии одна на все размеры
export function Icon({ name, size = 24, color, fill = 'none' }: Props) {
  const colors = useColors();
  const Component = icons[name];
  return (
    <Component
      size={size}
      color={color ?? colors.text}
      fill={fill}
      strokeWidth={1.75}
      nonScalingStroke
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    />
  );
}
