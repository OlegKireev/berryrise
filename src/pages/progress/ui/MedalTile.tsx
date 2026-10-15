import { View } from 'react-native';

import { Medal, type AchievementKey, type MedalState } from '@/entities/habit';
import { days, evenings, formatDay } from '@/shared/i18n';
import { Text } from '@/shared/ui';

import { t } from '../i18n';

type Props = {
  achievement: AchievementKey;
  date: string | null;
  state: MedalState;
};

// Медаль с названием; под полученной дата, под следующей - сколько осталось
export function MedalTile({ achievement, date, state }: Props) {
  const left =
    state.state === 'next' && state.left !== undefined
      ? achievement.startsWith('company')
        ? evenings(state.left)
        : days(state.left)
      : null;
  const hint = date
    ? formatDay(date)
    : left && `${t('leftPrefix')}${left}${t('leftSuffix')}`;
  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 4 }}>
      <Medal
        achievement={achievement}
        state={state.state}
        size={80}
      />
      <Text
        style={{ textAlign: 'center', fontSize: 14 }}
        variant={date ? 'body' : 'hint'}
      >
        {t(`habit.achievements.${achievement}`)}
      </Text>
      {hint && (
        <Text
          variant="hint"
          style={{ fontSize: 13 }}
        >
          {hint}
        </Text>
      )}
    </View>
  );
}
