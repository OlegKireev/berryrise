import { View } from 'react-native';

import { achievementKeys } from '@/entities/habit';
import { DeleteRelapseButton } from '@/features/delete-relapse';
import { formatDateTime, formatDay } from '@/shared/i18n';
import { Screen, Text } from '@/shared/ui';

import { Calendar } from './Calendar';

import { useProgress } from '../model/useProgress';

import { t } from '../i18n';

export function ProgressPage() {
  const data = useProgress();

  if (!data) {
    return null;
  }

  const { got, relapses } = data;

  return (
    <Screen>
      <Text style={{ fontSize: 20, fontWeight: '600' }}>{t('calendar')}</Text>
      <Calendar
        startAt={data.startAt}
        now={data.now}
        days={data.days}
        reviewDates={data.reviewDates}
      />

      <Text style={{ fontSize: 20, fontWeight: '600' }}>
        {t('achievementsTitle')}
      </Text>
      <Text style={{ opacity: 0.6 }}>
        {t('achievementsGot')} {data.gotCount} {t('of')}{' '}
        {achievementKeys.length}
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
          <Text>{t(`habit.achievements.${k}`)}</Text>
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
            onDeleted={data.reload}
          />
        </View>
      ))}
    </Screen>
  );
}
