import { View } from 'react-native';

import { days } from '@/shared/i18n';
import { Card, Text } from '@/shared/ui';

import { t } from '../i18n';

// Лучший стрик и всего трезвых дней двумя карточками в ряд
export function StreakStats({ best, total }: { best: number; total: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <Stat
        label={t('bestStreak')}
        value={days(best)}
      />
      <Stat
        label={t('totalDays')}
        value={days(total)}
      />
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card style={{ flex: 1 }}>
      <Text variant="hint">{label}</Text>
      <Text
        weight="bold"
        style={{ fontSize: 24 }}
      >
        {value}
      </Text>
    </Card>
  );
}
