import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-native';

import { getHabit, streak } from '@/entities/habit';
import { listRelapses } from '@/entities/relapse';
import { days, formatDateTime, t } from '@/shared/i18n';
import { Screen, Text } from '@/shared/ui';

export function TodayPage() {
  const db = useSQLiteContext();
  const [data, setData] = useState<{
    startAt: number;
    relapseAts: number[];
  } | null>(null);
  const [now, setNow] = useState(Date.now);

  // Перечитываем при каждом фокусе, в том числе после закрытия модалки срыва
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const habit = await getHabit(db);
        if (!habit) return;
        const relapses = await listRelapses(db);
        setData({ startAt: habit.startAt, relapseAts: relapses.map((r) => r.at) });
        setNow(Date.now());
      })();
    }, [db]),
  );

  // В полночь прибавляется день
  useEffect(() => {
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const id = setTimeout(
      () => setNow(Date.now()),
      midnight.getTime() - Date.now(),
    );
    return () => clearTimeout(id);
  }, [now]);

  if (!data) return null;
  const s = streak(data.startAt, data.relapseAts, now);

  return (
    <Screen>
      <Text style={{ fontSize: 48, fontWeight: '700' }}>{days(s.current)}</Text>
      <Text style={{ opacity: 0.6 }}>
        {t('since')} {formatDateTime(s.since)}
      </Text>
      <Text>
        {t('bestStreak')}: {days(s.best)}
      </Text>
      <Text>
        {t('totalDays')}: {s.total}
      </Text>
      <Button
        title={t('company')}
        onPress={() => router.push('/company')}
      />
      <Button
        title={t('checkin')}
        onPress={() => router.push('/check-in')}
      />
      <Button
        title={t('relapse')}
        onPress={() => router.push('/relapse')}
      />
    </Screen>
  );
}
