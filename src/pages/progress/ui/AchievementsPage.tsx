import { View } from 'react-native';

import { achievementKeys } from '@/entities/habit';
import { Screen, Text } from '@/shared/ui';

import { MedalTile } from './MedalTile';

import { useProgress } from '../model/useProgress';

import { t } from '../i18n';

// Все ачивки сеткой по три, в общем порядке
export function AchievementsPage() {
  const data = useProgress();

  if (!data) {
    return null;
  }

  return (
    <Screen>
      <Text variant="hint">
        {t('achievementsGot')} {data.gotCount} {t('of')}{' '}
        {achievementKeys.length}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 20 }}>
        {achievementKeys.map((k) => (
          <View
            key={k}
            style={{ width: '33.33%', paddingHorizontal: 4 }}
          >
            <MedalTile
              achievement={k}
              date={data.got[k]}
            />
          </View>
        ))}
      </View>
    </Screen>
  );
}
