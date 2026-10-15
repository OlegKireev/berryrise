import { router, useLocalSearchParams } from 'expo-router';

import { formatDate } from '@/shared/i18n';
import { dayRange, toDay } from '@/shared/lib';
import { Screen } from '@/shared/ui';

import { DayCard } from './DayCard';
import { PeriodNav } from './PeriodNav';

import { useProgress } from '../model/useProgress';

import { t } from '../i18n';

// Модалка дня из календаря: дата со стрелками на соседние дни, под ней карточка дня.
// Дата не в шапке: там уже стрелка "назад", рядом с ней стрелки дней путались бы
export function DayPage() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const data = useProgress();

  if (!data) {
    return null;
  }

  const start = toDay(data.startAt);
  const today = toDay(data.now);
  const { from, to } = dayRange(date);
  const prev = toDay(from - 1);
  const next = toDay(to);

  return (
    <Screen>
      <PeriodNav
        label={formatDate(from)}
        prevLabel={t('prevDay')}
        nextLabel={t('nextDay')}
        canPrev={prev >= start}
        canNext={next <= today}
        // setParams, а не push: "назад" закрывает модалку сразу
        prev={() => router.setParams({ date: prev })}
        next={() => router.setParams({ date: next })}
      />
      <DayCard
        date={date}
        start={start}
        today={today}
        got={data.got}
        onChanged={data.reload}
      />
    </Screen>
  );
}
