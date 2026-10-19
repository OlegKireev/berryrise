import { router } from 'expo-router';

import { useCelebrate } from '@/features/celebrate-achievement';
import { Screen, Text } from '@/shared/ui';

import { Achievements } from './Achievements';
import { Calendar } from './Calendar';
import { InsightsPreview } from './InsightsPreview';
import { NotesPreview } from './NotesPreview';
import { StreakStats } from './StreakStats';

import { useProgress } from '../model/useProgress';

import { t } from '../i18n';

export function ProgressPage() {
  const data = useProgress();
  useCelebrate();

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
        onOpen={(date) =>
          router.push({ pathname: '/day/[date]', params: { date } })
        }
      />
      <Achievements
        got={data.got}
        states={data.states}
        gotCount={data.gotCount}
      />
      <InsightsPreview />
      <NotesPreview />
    </Screen>
  );
}
