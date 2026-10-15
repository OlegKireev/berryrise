import { View } from 'react-native';

import { Medal, type AchievementKey } from '@/entities/habit';
import { formatDay } from '@/shared/i18n';
import { Text } from '@/shared/ui';

import { t } from '../i18n';

type Props = { achievement: AchievementKey; date: string | null };

// Медаль с названием и датой получения; неполученная серая и без даты
export function MedalTile({ achievement, date }: Props) {
  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 4 }}>
      <Medal
        achievement={achievement}
        got={!!date}
      />
      <Text
        style={{ textAlign: 'center', fontSize: 14 }}
        variant={date ? 'body' : 'hint'}
      >
        {t(`habit.achievements.${achievement}`)}
      </Text>
      {date && (
        <Text
          variant="hint"
          style={{ fontSize: 13 }}
        >
          {formatDay(date)}
        </Text>
      )}
    </View>
  );
}
