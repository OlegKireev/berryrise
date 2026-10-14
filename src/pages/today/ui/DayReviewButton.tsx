import { router } from 'expo-router';
import { Button } from 'react-native';

import { formatDay } from '@/shared/i18n';
import { Text } from '@/shared/ui';

import { t } from '../i18n';

type Props = {
  day: string;
  isToday: boolean;
  done: boolean;
  beforeStart: boolean;
};

export function DayReviewButton({ day, isToday, done, beforeStart }: Props) {
  if (beforeStart) {
    return <Text variant="hint">{t('review.later')}</Text>;
  }

  const title = done
    ? t(isToday ? 'dayReviewTodayDone' : 'dayReviewYesterdayDone')
    : t(isToday ? 'dayReviewToday' : 'dayReviewYesterday');

  return (
    <Button
      title={`${title}, ${formatDay(day)}`}
      onPress={() => router.push('/day-review')}
    />
  );
}
