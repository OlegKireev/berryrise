import { achievementKeys, type Got } from '@/entities/habit';

type State = { current: number; got: Got };

export type StartChange = {
  streak?: { from: number; to: number };
  medalsLost: boolean;
};

// Что потеряет пользователь с новым стартом. null - ничего, подтверждать не надо
export function startChange(before: State, after: State): StartChange | null {
  const medalsLost = achievementKeys.some(
    (k) => before.got[k] && !after.got[k],
  );
  const streak =
    after.current < before.current
      ? { from: before.current, to: after.current }
      : undefined;

  if (!streak && !medalsLost) {
    return null;
  }

  return { streak, medalsLost };
}
