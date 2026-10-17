import { Pressable } from 'react-native';

import { Medal, type AchievementKey, type MedalState } from '@/entities/habit';
import { days, evenings, formatDay } from '@/shared/i18n';
import { Text } from '@/shared/ui';

import { t } from '../i18n';

type Props = {
  achievement: AchievementKey;
  date: string | undefined;
  state: MedalState;
  onPress: () => void;
};

// Подпись под медалью: у полученной дата, у следующей - сколько осталось
export function medalHint(
  achievement: AchievementKey,
  date: string | undefined,
  state: MedalState,
) {
  const left =
    state.state === 'next' && state.left !== undefined
      ? achievement.startsWith('company')
        ? evenings(state.left)
        : days(state.left)
      : null;
  return date
    ? formatDay(date)
    : left && `${t('leftPrefix')}${left}${t('leftSuffix')}`;
}

// Медаль с названием и подписью, тап открывает карточку медали
export function MedalTile({ achievement, date, state, onPress }: Props) {
  const hint = medalHint(achievement, date, state);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={{ flex: 1, alignItems: 'center', gap: 4 }}
    >
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
    </Pressable>
  );
}
