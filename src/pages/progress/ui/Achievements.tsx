import { router } from 'expo-router';
import { View } from 'react-native';

import {
  achievementKeys,
  type AchievementKey,
  type MedalState,
} from '@/entities/habit';
import { Button, Text } from '@/shared/ui';

import { MedalTile } from './MedalTile';

import { pickMedals } from '../model/medals';

import { t } from '../i18n';

type Props = {
  got: Record<AchievementKey, string | null>;
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
          onPress={() => router.push('/achievements')}
        />
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {pickMedals(got, states).map((k) => (
          <MedalTile
            key={k}
            achievement={k}
            date={got[k]}
            state={states[k]!}
            onPress={() =>
              router.push({
                pathname: '/achievement/[key]',
                params: { key: k },
              })
            }
          />
        ))}
      </View>
    </View>
  );
}
