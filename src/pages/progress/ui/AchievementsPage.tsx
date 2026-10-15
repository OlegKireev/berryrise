import { router } from 'expo-router';
import { View } from 'react-native';

import { achievementKeys } from '@/entities/habit';
import { Screen, Text } from '@/shared/ui';

import { MedalTile } from './MedalTile';

import { useProgress } from '../model/useProgress';

import { t } from '../i18n';

// Полученные и следующие достижения сеткой по три, в общем порядке;
// дальше следующей медали серии не показываем
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
        {achievementKeys.map((k) => {
          const state = data.states[k];
          return (
            state && (
              <View
                key={k}
                style={{ width: '33.33%', paddingHorizontal: 4 }}
              >
                <MedalTile
                  achievement={k}
                  date={data.got[k]}
                  state={state}
                  onPress={() =>
                    router.push({
                      pathname: '/achievement/[key]',
                      params: { key: k },
                    })
                  }
                />
              </View>
            )
          );
        })}
      </View>
    </Screen>
  );
}
