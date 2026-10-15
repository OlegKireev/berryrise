import { View } from 'react-native';
import Svg, { Circle, Polygon } from 'react-native-svg';

import { createT } from '@/shared/i18n';
import { Text, useColors } from '@/shared/ui';

import type { AchievementKey } from '../model/achievements';

import { dict } from '../i18n';

const t = createT(dict);

type Props = {
  achievement: AchievementKey;
  got: boolean;
  size?: number;
};

const tiers = {
  days1: 'bronze',
  days3: 'bronze',
  days7: 'bronze',
  days14: 'silver',
  days30: 'silver',
  days60: 'silver',
  days90: 'gold',
  days180: 'gold',
  days365: 'gold',
} as const;

// Медаль достижения: диск на двух лентах, цвет по уровню, неполученная - контуром.
// Нарисована кодом, чтобы подстраиваться под тему; на PNG заменяется только этот файл
export function Medal({ achievement, got, size = 64 }: Props) {
  const colors = useColors();
  const tier =
    achievement in tiers ? tiers[achievement as keyof typeof tiers] : 'special';
  const color = got ? colors[tier] : colors.border;
  // пропорции из viewBox 64x72: ленты сверху, диск снизу
  const height = (size * 72) / 64;
  return (
    <View style={{ width: size, height }}>
      <Svg
        width={size}
        height={height}
        viewBox="0 0 64 72"
      >
        <Polygon
          points="14,0 28,0 34,26 20,26"
          fill={color}
          opacity={0.55}
        />
        <Polygon
          points="50,0 36,0 30,26 44,26"
          fill={color}
          opacity={0.55}
        />
        <Circle
          cx={32}
          cy={44}
          r={26}
          fill={got ? color : 'none'}
          stroke={color}
          strokeWidth={got ? 0 : 2}
        />
        <Circle
          cx={32}
          cy={44}
          r={21}
          fill="none"
          stroke={got ? colors.background : colors.border}
          strokeOpacity={got ? 0.5 : 1}
          strokeWidth={1.5}
        />
      </Svg>
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: (height * 18) / 72,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          weight="bold"
          style={{
            fontSize: size * 0.26,
            color: got ? colors.background : colors.muted,
          }}
        >
          {t(`medal.${achievement}`)}
        </Text>
      </View>
    </View>
  );
}
