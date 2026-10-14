import { useTheme } from 'expo-router';
import { Button, View, type ColorValue } from 'react-native';

import type { Day } from '@/entities/habit';
import { formatMonth, weekdays } from '@/shared/i18n';
import { Text } from '@/shared/ui';

import { useCalendar, type Status } from '../model/useCalendar';

import { t } from '../i18n';

// ponytail: цвета наугад, подберем вместе со стилизацией
const SOBER = '#30a46c';
const RELAPSE = '#e5484d';

const Dot = ({ color }: { color: ColorValue }) => (
  <View
    style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: color }}
  />
);

export function Calendar({
  startAt,
  now,
  days,
  reviewDates,
}: {
  startAt: number;
  now: number;
  days: Day[];
  reviewDates: Set<string>;
}) {
  const { colors } = useTheme();
  const { year, month, weeks, status, canPrev, canNext, prev, next } =
    useCalendar(startAt, now, days);
  const color = (s: Status) =>
    s === null ? colors.border : s === 'sober' ? SOBER : RELAPSE;

  const legend: [Status, string][] = [
    ['sober', t('legendSober')],
    ['relapse', t('legendRelapse')],
  ];

  return (
    <View style={{ gap: 8 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Button
          title="<"
          accessibilityLabel={t('prevMonth')}
          disabled={!canPrev}
          onPress={prev}
        />
        <Text style={{ fontWeight: '600' }}>{formatMonth(year, month)}</Text>
        <Button
          title=">"
          accessibilityLabel={t('nextMonth')}
          disabled={!canNext}
          onPress={next}
        />
      </View>
      <View style={{ flexDirection: 'row', gap: 4 }}>
        {weekdays.map((w) => (
          <Text
            key={w}
            style={{ flex: 1, textAlign: 'center', opacity: 0.6 }}
          >
            {w}
          </Text>
        ))}
      </View>
      {weeks.map((week, i) => (
        <View
          key={i}
          style={{ flexDirection: 'row', gap: 4 }}
        >
          {week.map((date, j) => (
            <View
              key={date ?? `empty-${j}`}
              style={{
                flex: 1,
                aspectRatio: 1,
                borderRadius: 6,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: date ? color(status(date)) : 'transparent',
              }}
            >
              {date && <Text>{Number(date.slice(8))}</Text>}
              {date && reviewDates.has(date) && <Dot color={colors.text} />}
            </View>
          ))}
        </View>
      ))}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {legend.map(([s, label]) => (
          <View
            key={label}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
          >
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                backgroundColor: color(s),
              }}
            />
            <Text>{label}</Text>
          </View>
        ))}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Dot color={colors.text} />
          <Text>{t('dayReview')}</Text>
        </View>
      </View>
    </View>
  );
}
