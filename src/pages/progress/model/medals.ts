// Медали для короткого блока ачивок, чистая логика для node:test

import {
  achievementKeys,
  type AchievementKey,
} from '../../../entities/habit/model/achievements.ts';

// Последние полученные (новые первыми, при равной дате - дальше в общем порядке),
// не хватает - добиваем первыми неполученными
export function pickMedals(
  got: Record<AchievementKey, string | null>,
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
  const next = achievementKeys.filter((k) => !got[k]);
  return [...recent, ...next].slice(0, n);
}
