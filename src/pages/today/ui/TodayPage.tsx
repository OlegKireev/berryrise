import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-native';

import { checkinDay, getCheckin, toDay } from '@/entities/checkin';
import { getHabit, savings, streak, type Habit } from '@/entities/habit';
import { listRelapses } from '@/entities/relapse';
import {
  days,
  formatDateTime,
  formatDay,
  formatMoney,
  portions,
  t,
} from '@/shared/i18n';
import { Screen, Text } from '@/shared/ui';

export function TodayPage() {
  const db = useSQLiteContext();
  const [data, setData] = useState<{
    habit: Habit;
    relapseAts: number[];
    // день, за который чек-ин уже заполнен
    filledDay: string | null;
  } | null>(null);
  const [now, setNow] = useState(Date.now);

  // Перечитываем при каждом фокусе, в том числе после закрытия модалки срыва
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const habit = await getHabit(db);
        if (!habit) return;
        const now = Date.now();
        const [relapses, checkin] = await Promise.all([
          listRelapses(db),
          getCheckin(db, checkinDay(now)),
        ]);
        setData({
          habit,
          relapseAts: relapses.map((r) => r.at),
          filledDay: checkin?.date ?? null,
        });
        setNow(now);
      })();
    }, [db]),
  );

  // В полночь прибавляется день, в 18:00 чек-ин переключается на сегодня
  useEffect(() => {
    const next = new Date(now);
    next.setHours(next.getHours() < 18 ? 18 : 24, 0, 0, 0);
    const id = setTimeout(
      () => setNow(Date.now()),
      next.getTime() - Date.now(),
    );
    return () => clearTimeout(id);
  }, [now]);

  if (!data) return null;
  const s = streak(data.habit.startAt, data.relapseAts, now);
  const day = checkinDay(now);
  const isToday = day === toDay(now);
  const { weeklySpend, currency } = data.habit;
  const saved = savings(s.total, weeklySpend, JSON.parse(data.habit.drinks));
  const hasDrinks = data.habit.drinks !== '{}';

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
      {saved.money === null && !hasDrinks ? (
        <Button
          title={t('savingsEmpty')}
          onPress={() => router.push('/settings')}
        />
      ) : (
        <>
          <Text style={{ fontWeight: '600' }}>{t('saved')}</Text>
          {saved.money !== null && currency && (
            <Text style={{ fontSize: 24 }}>
              {formatMoney(saved.money, currency)}
            </Text>
          )}
          {hasDrinks && (
            <Text>
              {t('notDrunk')}: {portions(saved.portions)}, ~{saved.kcal}{' '}
              {t('kcal')}
            </Text>
          )}
        </>
      )}
      <Button
        title={t('company')}
        onPress={() => router.push('/company')}
      />
      {day < toDay(data.habit.startAt) ? (
        <Text style={{ opacity: 0.6 }}>{t('checkinLater')}</Text>
      ) : (
        <Button
          title={`${
            data.filledDay === day
              ? t(isToday ? 'checkinTodayDone' : 'checkinYesterdayDone')
              : t(isToday ? 'checkinToday' : 'checkinYesterday')
          }, ${formatDay(day)}`}
          onPress={() => router.push('/check-in')}
        />
      )}
      <Button
        title={t('relapse')}
        onPress={() => router.push('/relapse')}
      />
    </Screen>
  );
}
