import { View } from 'react-native';

import { achievementKeys, Medal, type AchievementKey } from '@/entities/habit';
import { Text } from '@/shared/ui';

import { Answer } from './Answer';
import { DayRelapse } from './DayRelapse';
import { DayReviewSummary } from './DayReviewSummary';

import { useDayCard } from '../model/useDayCard';

import { t } from '../i18n';

type Props = {
  date: string; // YYYY-MM-DD, какой день грузить
  start: string; // день старта
  today: string;
  got: Record<AchievementKey, string | null>;
  // срыв удален: календарь, стрик и достижения пора пересчитать
  onChanged: () => void;
};

// Содержимое карточки дня: статус, срывы, вечеринка, итоги и достижения. Данные грузит сама
export function DayCard({ date, start, today, got, onChanged }: Props) {
  const { data, reload } = useDayCard(date);

  if (!data) {
    return null;
  }
  // рисуем по дате загруженных данных: пока грузится новый день, виден прежний целиком
  const day = data.date;

  const status =
    data.relapses.length > 0
      ? t('statusRelapse')
      : day === today
        ? t('statusToday')
        : day === start
          ? t('statusStart')
          : t('statusSober');
  const medals = achievementKeys.filter((k) => got[k] === day);

  return (
    <View style={{ gap: 20 }}>
      <Text variant="hint">{status}</Text>
      {data.relapses.map((r) => (
        <DayRelapse
          key={r.id}
          relapse={r}
          onDeleted={() => {
            reload();
            onChanged();
          }}
        />
      ))}
      {data.party && (
        <Answer
          title={t('party')}
          value={t(`partyResult.${data.party.result ?? 'none'}`)}
        />
      )}
      <DayReviewSummary
        date={day}
        review={data.review}
      />
      {medals.length > 0 && (
        <View style={{ gap: 8 }}>
          <Text weight="semibold">{t('dayAchievements')}</Text>
          {medals.map((k) => (
            <View
              key={k}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
            >
              <Medal
                achievement={k}
                state="got"
                size={40}
              />
              <Text style={{ flex: 1 }}>{t(`habit.achievements.${k}`)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
