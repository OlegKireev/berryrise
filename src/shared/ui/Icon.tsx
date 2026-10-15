// По одной иконке, а не из корня пакета: Metro в dev не вырезает неиспользуемое
import Bell from 'lucide-react-native/icons/bell';
import ChevronLeft from 'lucide-react-native/icons/chevron-left';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import Heart from 'lucide-react-native/icons/heart';
import Info from 'lucide-react-native/icons/info';
import Settings from 'lucide-react-native/icons/settings';
import Wallet from 'lucide-react-native/icons/wallet';

import { useColors } from './theme';

const icons = {
  bell: Bell,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  heart: Heart,
  info: Info,
  settings: Settings,
  wallet: Wallet,
};

export type IconName = keyof typeof icons;

type Props = {
  name: IconName;
  size?: number;
  color?: string;
};

// Единственное место, которое знает про Lucide. Толщина линии одна на все размеры
export function Icon({ name, size = 24, color }: Props) {
  const colors = useColors();
  const Component = icons[name];
  return (
    <Component
      size={size}
      color={color ?? colors.text}
      strokeWidth={1.75}
      nonScalingStroke
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    />
  );
}
