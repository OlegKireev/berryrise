// Время - минуты от полуночи, день недели как у Date.getDay(): 0 - воскресенье
export type NotificationPrefs = {
  dayReview: { on: boolean; time: number };
  risk: { on: boolean; days: Partial<Record<number, number>> };
  party: { on: boolean };
};

export type NotificationKind = keyof NotificationPrefs;

export const RISK_TIME = 17 * 60;

// Значения до первого включения: все выключено, время и дни по умолчанию
export const defaultPrefs: NotificationPrefs = {
  dayReview: { on: false, time: 21 * 60 },
  risk: { on: false, days: { 5: RISK_TIME, 6: RISK_TIME } },
  party: { on: false },
};

export const anyOn = (p: NotificationPrefs) =>
  p.dayReview.on || p.risk.on || p.party.on;
