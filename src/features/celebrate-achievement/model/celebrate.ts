// Какие медали праздновать, чистая логика для node:test

import {
  achievementKeys,
  type AchievementKey,
  type Got,
} from '../../../entities/habit/model/achievements.ts';

// seen - показанные медали, null - памяти еще нет (первый запуск после обновления).
// show - очередь празднования в общем порядке, seen - что запомнить
export function celebrate(
  got: Got,
  seen: AchievementKey[] | null,
  relapseToday: boolean,
): { show: AchievementKey[]; seen: AchievementKey[] } {
  const gotKeys = achievementKeys.filter((k) => got[k]);

  // старые медали молча считаем показанными, иначе вывалится пачка праздников
  if (seen === null) {
    return { show: [], seen: gotKeys };
  }

  // в день срыва не празднуем и не забываем: ошибочный срыв, удаленный в тот же день,
  // не должен вернуть праздник медали, которую он ненадолго забрал
  if (relapseToday) {
    return { show: [], seen };
  }

  const known = new Set(seen);
  // пропавшую медаль забываем: получит снова - отпразднуем снова
  return { show: gotKeys.filter((k) => !known.has(k)), seen: gotKeys };
}
