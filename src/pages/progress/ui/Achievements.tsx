import { router } from 'expo-router';
import { View } from 'react-native';

import {
  achievementKeys,
  type AchievementKey,
  type Got,
  type MedalState,
} from '@/entities/habit';
import { Button, Text } from '@/shared/ui';

import { MedalTile } from './MedalTile';

import { pickMedals } from '../model/medals';

import { t } from '../i18n';

type Props = {
  got: Got;
  states: Partial<Record<AchievementKey, MedalState>>;
  gotCount: number;
};

// Три медали: последние полученные или ближайшие цели, остальные - на экране "Все"
export function Achievements({ got, states, gotCount }: Props) {
  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text
          variant="heading"
          style={{ flex: 1 }}
        >
          {t('achievementsTitle')}
        </Text>
        <Text variant="hint">
          {gotCount} {t('of')} {achievementKeys.length}
        </Text>
        <Button
          variant="quiet"
          title={t('allAchievements')}
          href="/achievements"
        />
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {pickMedals(got, states).map((k) => {
          const state = states[k];
          return (
            state && (
              <MedalTile
                key={k}
                achievement={k}
                date={got[k]}
                state={state}
                onPress={() =>
                  router.push({
                    pathname: '/achievement/[key]',
                    params: { key: k },
                  })
                }
              />
            )
          );
        })}
      </View>
    </View>
  );
}
