import { View } from 'react-native';

import type { Streak } from '@/entities/habit';
import { dayWord, formatDate } from '@/shared/i18n';
import { dayDate } from '@/shared/lib';
import { Text } from '@/shared/ui';

import { t } from '../i18n';

// Крупное число дней, лучший и всего живут на "Прогрессе"
export function StreakSummary({ streak }: { streak: Streak }) {
  return (
    <View>
      <Text
        weight="bold"
        style={{ fontSize: 80, lineHeight: 88, letterSpacing: -2 }}
      >
        {streak.current}
      </Text>
      <Text
        weight="semibold"
        style={{ fontSize: 22 }}
      >
        {dayWord(streak.current)} {t('withoutAlcohol')}
      </Text>
      <Text variant="hint">
        {/* 0 - сегодня день старта или срыва, первый трезвый день еще впереди */}
        {streak.current === 0
          ? t('firstSoberTomorrow')
          : `${t('since')} ${formatDate(dayDate(streak.since).getTime())}`}
      </Text>
    </View>
  );
}
