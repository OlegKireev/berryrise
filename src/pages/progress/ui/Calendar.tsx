import { useTheme } from 'expo-router';
import { useState } from 'react';
import { Button, View, type ColorValue } from 'react-native';

import type { Day } from '@/entities/habit';
import { formatMonth, t, weekdays } from '@/shared/i18n';
import { toDay } from '@/shared/lib';
import { Text } from '@/shared/ui';

// ponytail: цвета наугад, подберем вместе со стилизацией
const SOBER = '#30a46c';
const RELAPSE = '#e5484d';

type Status = 'sober' | 'relapse' | null; // null - нейтральный день

const monthIndex = (ms: number) => {
  const d = new Date(ms);
  return d.getFullYear() * 12 + d.getMonth();
};

// Ячейки месяца с понедельника, null - добивка до полной недели
function monthCells(year: number, month: number): (string | null)[] {
  const first = new Date(year, month, 1);
  const length = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = Array((first.getDay() + 6) % 7).fill(null);
  for (let d = 1; d <= length; d++) {
    cells.push(toDay(new Date(year, month, d).getTime()));
  }
  while (cells.length % 7) cells.push(null);
  return cells;
}

const Dot = ({ color }: { color: ColorValue }) => (
  <View
    style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: color }}
  />
);

export function Calendar({
  startAt,
  now,
  days,
  checkinDates,
}: {
  startAt: number;
  now: number;
  days: Day[];
  checkinDates: Set<string>;
}) {
  const { colors } = useTheme();
  const [shown, setShown] = useState(() => monthIndex(now));
  // если экран вернулся из фона в новый месяц, не даем уйти за границы
  const first = monthIndex(startAt);
  const last = monthIndex(now);
  const index = Math.min(Math.max(shown, first), last);
  const year = Math.floor(index / 12);
  const month = index % 12;

  const sober = new Map(days.map((d) => [d.date, d.sober]));
  const status = (date: string): Status => {
    const s = sober.get(date);
    if (s === undefined) return null;
    return s ? 'sober' : 'relapse';
  };
  const color = (s: Status) =>
    s === null ? colors.border : s === 'sober' ? SOBER : RELAPSE;

  const cells = monthCells(year, month);
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) =>
    cells.slice(i * 7, i * 7 + 7),
  );

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
          disabled={index <= first}
          onPress={() => setShown(index - 1)}
        />
        <Text style={{ fontWeight: '600' }}>{formatMonth(year, month)}</Text>
        <Button
          title=">"
          accessibilityLabel={t('nextMonth')}
          disabled={index >= last}
          onPress={() => setShown(index + 1)}
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
              {date && checkinDates.has(date) && <Dot color={colors.text} />}
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
          <Text>{t('checkin')}</Text>
        </View>
      </View>
    </View>
  );
}
