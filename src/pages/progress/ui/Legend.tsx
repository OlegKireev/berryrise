import type { ReactNode } from 'react';
import { View } from 'react-native';

import { useDayColor, type DayStatus } from '@/entities/habit';
import { Text } from '@/shared/ui';

import { ReviewDot } from './ReviewDot';

import { t } from '../i18n';

// Что значат цвета и точка в календаре
export function Legend() {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
      <LegendItem label={t('legendSober')}>
        <Swatch status="sober" />
      </LegendItem>
      <LegendItem label={t('legendRelapse')}>
        <Swatch status="relapse" />
      </LegendItem>
      <LegendItem label={t('dayReview')}>
        <ReviewDot />
      </LegendItem>
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

function Swatch({ status }: { status: DayStatus }) {
  const color = useDayColor();
  return (
    <View
      style={{
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: color(status),
      }}
    />
  );
}
