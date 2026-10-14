import type { Streak } from '@/entities/habit';
import { days, formatDateTime } from '@/shared/i18n';
import { Text } from '@/shared/ui';

import { t } from '../i18n';

export function StreakSummary({ streak }: { streak: Streak }) {
  return (
    <>
      <Text style={{ fontSize: 48, fontWeight: '700' }}>
        {days(streak.current)}
      </Text>
      <Text variant="hint">
        {t('since')} {formatDateTime(streak.since)}
      </Text>
      <Text>
        {t('bestStreak')}: {days(streak.best)}
      </Text>
      <Text>
        {t('totalDays')}: {streak.total}
      </Text>
    </>
  );
}
