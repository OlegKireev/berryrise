// Медали для короткого блока достижений, чистая логика для node:test

import {
  achievementKeys,
  type AchievementKey,
  type MedalState,
} from '../../../entities/habit/model/achievements.ts';

// Последние полученные (новые первыми, при равной дате - дальше в общем порядке),
// не хватает - добиваем следующими по общему порядку (скрытые медали серий пропускаем)
export function pickMedals(
  got: Record<AchievementKey, string | null>,
  states: Partial<Record<AchievementKey, MedalState>>,
  n = 3,
): AchievementKey[] {
  const order = (k: AchievementKey) => achievementKeys.indexOf(k);
  const recent = achievementKeys
    .filter((k) => got[k])
    .sort(
      (a, b) =>
        (got[b] as string).localeCompare(got[a] as string) ||
        order(b) - order(a),
    );
  const next = achievementKeys.filter((k) => states[k]?.state === 'next');
  return [...recent, ...next].slice(0, n);
}
