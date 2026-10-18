import type { ReactNode } from 'react';
import { View } from 'react-native';

import { useDayColor, type DayStatus } from '@/entities/habit';
import { Text, useColors } from '@/shared/ui';

import { t } from '../i18n';

const row = {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: 12,
} as const;

// Что значат цвета и заливка в календаре: строка статусов и строка итогов
export function Legend() {
  return (
    <View style={{ gap: 8 }}>
      <View style={row}>
        <LegendItem label={t('legendSober')}>
          <Swatch status="sober" />
        </LegendItem>
        <LegendItem label={t('legendRelapse')}>
          <Swatch status="relapse" />
        </LegendItem>
        <LegendItem label={t('today')}>
          <TodaySwatch />
        </LegendItem>
      </View>
      <View style={row}>
        <LegendItem label={t('legendEmpty')}>
          <Swatch
            status="sober"
            ring
          />
        </LegendItem>
        <LegendItem label={t('legendReviewed')}>
          <Swatch status="sober" />
        </LegendItem>
      </View>
    </View>
  );
}

const LegendItem = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
    {children}
    <Text>{label}</Text>
  </View>
);

// ring - день без итогов, как в календаре
function Swatch({ status, ring }: { status: DayStatus; ring?: boolean }) {
  const color = useDayColor();

  return (
    <View
      style={{
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: ring ? 'transparent' : color(status),
        borderWidth: ring ? 2 : 0,
        borderColor: color(status),
      }}
    />
  );
}

// идущий день пунктиром, как в календаре
function TodaySwatch() {
  const colors = useColors();

  return (
    <View
      style={{
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: colors.sober,
      }}
    />
  );
}
