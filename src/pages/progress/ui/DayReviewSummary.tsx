import { View } from 'react-native';

import type { Craving, Hardship, Helper, Mood } from '@/shared/config';
import { Button, Text } from '@/shared/ui';

import { Answer } from './Answer';

import { t } from '../i18n';

type Props = {
  date: string;
  review: {
    mood: Mood;
    craving: Craving;
    hardships: Hardship[];
    helpers: Helper[];
    note: string | null;
  } | null;
};

// Итоги дня в карточке: ответы и переход заполнить или изменить за этот день
export function DayReviewSummary({ date, review }: Props) {
  return (
    <View style={{ gap: 4 }}>
      <Text weight="semibold">{t('dayReview')}</Text>
      {review ? (
        <>
          <Answer
            title={t('option.titles.mood')}
            value={t(`option.mood.${review.mood}`)}
          />
          <Answer
            title={t('option.titles.craving')}
            value={t(`option.craving.${review.craving}`)}
          />
          <Answer
            title={t('option.titles.hardship')}
            value={review.hardships
              .map((h) => t(`option.hardship.${h}`))
              .join(', ')}
          />
          <Answer
            title={t('option.titles.helper')}
            value={review.helpers
              .map((h) => t(`option.helper.${h}`))
              .join(', ')}
          />
          {review.note && <Text>{review.note}</Text>}
        </>
      ) : (
        <Text variant="hint">{t('reviewEmpty')}</Text>
      )}
      <Button
        title={review ? t('reviewEdit') : t('reviewFill')}
        href={{ pathname: '/day-review', params: { day: date } }}
      />
    </View>
  );
}
