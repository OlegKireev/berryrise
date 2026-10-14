import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

import { listDayReviewDates, listCompanyDates } from '@/entities/day-review';
import {
  achievementKeys,
  achievements,
  getHabit,
  soberDays,
} from '@/entities/habit';
import { listSoberPartyStarts } from '@/entities/party';
import { listRelapses, type Relapse } from '@/entities/relapse';
import { DeleteRelapseButton } from '@/features/delete-relapse';
import { formatDateTime, formatDay, t } from '@/shared/i18n';
import { toDay } from '@/shared/lib';
import { Screen, Text } from '@/shared/ui';

import { Calendar } from './Calendar';

type Data = {
  startAt: number;
  now: number;
  relapses: Pick<Relapse, 'id' | 'at'>[];
  reviewDates: string[];
  soberParties: number[];
  companyDates: string[];
};

export function ProgressPage() {
  const db = useSQLiteContext();
  const [data, setData] = useState<Data | null>(null);

  const load = useCallback(() => {
    (async () => {
      const [habit, relapses, reviewDates, soberParties, companyDates] =
        await Promise.all([
          getHabit(db),
          listRelapses(db),
          listDayReviewDates(db),
          listSoberPartyStarts(db),
          listCompanyDates(db),
        ]);
      if (!habit) return;
      setData({
        startAt: habit.startAt,
        now: Date.now(),
        relapses,
        reviewDates,
        soberParties,
        companyDates,
      });
    })();
  }, [db]);

  useFocusEffect(load);

  if (!data) return null;
  const { startAt, now, relapses, reviewDates, soberParties, companyDates } =
    data;
  const days = soberDays(
    startAt,
    relapses.map((r) => r.at),
    now,
  );
  const got = achievements(days, reviewDates, toDay(now), {
    soberParties,
    companyDates,
  });
  const gotCount = achievementKeys.filter((k) => got[k]).length;

  return (
    <Screen>
      <Text style={{ fontSize: 20, fontWeight: '600' }}>{t('calendar')}</Text>
      <Calendar
        startAt={startAt}
        now={now}
        days={days}
        reviewDates={new Set(reviewDates)}
      />

      <Text style={{ fontSize: 20, fontWeight: '600' }}>
        {t('achievementsTitle')}
      </Text>
      <Text style={{ opacity: 0.6 }}>
        {t('achievementsGot')} {gotCount} {t('of')} {achievementKeys.length}
      </Text>
      {achievementKeys.map((k) => (
        <View
          key={k}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            opacity: got[k] ? 1 : 0.35,
          }}
        >
          <Text>{t(`achievement_${k}`)}</Text>
          {got[k] && <Text>{formatDay(got[k])}</Text>}
        </View>
      ))}

      <Text style={{ fontSize: 20, fontWeight: '600' }}>{t('relapses')}</Text>
      {relapses.length === 0 && (
        <Text style={{ opacity: 0.6 }}>{t('noRelapses')}</Text>
      )}
      {relapses.map((r) => (
        <View
          key={r.id}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text>{formatDateTime(r.at)}</Text>
          <DeleteRelapseButton
            id={r.id}
            onDeleted={load}
          />
        </View>
      ))}
    </Screen>
  );
}
