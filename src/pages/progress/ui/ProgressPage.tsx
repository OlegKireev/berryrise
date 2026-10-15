import { Screen, Text } from '@/shared/ui';

import { Achievements } from './Achievements';
import { Calendar } from './Calendar';
import { Relapses } from './Relapses';
import { StreakStats } from './StreakStats';

import { useProgress } from '../model/useProgress';

import { t } from '../i18n';

export function ProgressPage() {
  const data = useProgress();

  if (!data) {
    return null;
  }

  return (
    <Screen>
      <StreakStats
        best={data.best}
        total={data.total}
      />
      <Text variant="heading">{t('calendar')}</Text>
      <Calendar
        startAt={data.startAt}
        now={data.now}
        days={data.days}
        reviewDates={data.reviewDates}
      />
      <Achievements
        got={data.got}
        gotCount={data.gotCount}
      />
      <Relapses
        relapses={data.relapses}
        onDeleted={data.reload}
      />
    </Screen>
  );
}
