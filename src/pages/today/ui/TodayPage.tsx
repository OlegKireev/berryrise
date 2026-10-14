import { router, useFocusEffect, useTheme } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { Button, View } from 'react-native';

import { reviewDay, getDayReview } from '@/entities/day-review';
import { getHabit, savings, streak, type Habit } from '@/entities/habit';
import {
  cancelParty,
  getActiveParty,
  setPartyResult,
  type Party,
} from '@/entities/party';
import { listRelapses } from '@/entities/relapse';
import {
  days,
  formatDateTime,
  formatDay,
  formatMoney,
  portions,
} from '@/shared/i18n';
import { toDay } from '@/shared/lib';
import { Screen, Text } from '@/shared/ui';

import { t } from '../i18n';

// ponytail: цвета кнопок константами, пока нет токенов дизайна
const SOBER = '#2e7d32';
const SECONDARY = '#8e8e93';

export function TodayPage() {
  const db = useSQLiteContext();
  const [data, setData] = useState<{
    habit: Habit;
    relapseAts: number[];
    // день, за который итоги уже подведены
    filledDay: string | null;
    party: Party | null; // идущая вечеринка
  } | null>(null);
  const [now, setNow] = useState(Date.now);

  // Перечитываем при каждом фокусе, в том числе после закрытия модалки срыва
  const load = useCallback(() => {
    (async () => {
      const habit = await getHabit(db);
      if (!habit) return;
      const now = Date.now();
      const [relapses, review, party] = await Promise.all([
        listRelapses(db),
        getDayReview(db, reviewDay(now)),
        getActiveParty(db),
      ]);
      setData({
        habit,
        relapseAts: relapses.map((r) => r.at),
        filledDay: review?.date ?? null,
        party,
      });
      setNow(now);
    })();
  }, [db]);
  useFocusEffect(load);

  // В полночь прибавляется день, в 18:00 итоги переключаются на сегодня
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
  const day = reviewDay(now);
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
      {data.party ? (
        <PartyCard
          party={data.party}
          onSober={() => setPartyResult(db, data.party!.id, 'sober').then(load)}
          onCancel={() => cancelParty(db, data.party!.id).then(load)}
        />
      ) : (
        <Button
          title={t('company')}
          onPress={() => router.push('/company')}
        />
      )}
      {day < toDay(data.habit.startAt) ? (
        <Text style={{ opacity: 0.6 }}>{t('review.later')}</Text>
      ) : (
        <Button
          title={`${
            data.filledDay === day
              ? t(isToday ? 'dayReviewTodayDone' : 'dayReviewYesterdayDone')
              : t(isToday ? 'dayReviewToday' : 'dayReviewYesterday')
          }, ${formatDay(day)}`}
          onPress={() => router.push('/day-review')}
        />
      )}
      {/* Срыв отдельно и внизу, чтобы не путать с остальными действиями */}
      <View style={{ marginTop: 24 }}>
        <Button
          title={t('relapse')}
          color={SECONDARY}
          onPress={() => router.push('/relapse')}
        />
      </View>
    </Screen>
  );
}

// Идущая вечеринка: ответить "как прошло?" можно в любой момент
function PartyCard({
  party,
  onSober,
  onCancel,
}: {
  party: Party;
  onSober: () => void;
  onCancel: () => void;
}) {
  const { colors } = useTheme();
  const row = { flexDirection: 'row', gap: 8 } as const;
  return (
    <View
      style={{
        gap: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: '600' }}>
        {t('partyCardTitle')}
      </Text>
      <Text style={{ opacity: 0.6 }}>
        {t('partyCardUntil')} {formatDateTime(party.expectedEndAt)}
      </Text>
      {/* Главный вопрос: два ответа рядом и разными цветами */}
      <View style={row}>
        <View style={{ flex: 1 }}>
          <Button
            title={t('partySober')}
            color={SOBER}
            onPress={onSober}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            title={t('partyDrank')}
            color={colors.notification}
            onPress={() =>
              router.push({
                pathname: '/relapse',
                params: { partyId: party.id },
              })
            }
          />
        </View>
      </View>
      <View style={row}>
        <View style={{ flex: 1 }}>
          <Button
            title={t('partyOpen')}
            color={SECONDARY}
            onPress={() => router.push('/company')}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            title={t('partyCancel')}
            color={SECONDARY}
            onPress={onCancel}
          />
        </View>
      </View>
    </View>
  );
}
