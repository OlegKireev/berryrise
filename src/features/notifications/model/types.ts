import { MINUTES_PER_HOUR } from '@/shared/lib';

// Время - минуты от полуночи, день недели как у Date.getDay(): 0 - воскресенье
export type NotificationPrefs = {
  dayReview: { on: boolean; time: number };
  risk: { on: boolean; days: Partial<Record<number, number>> };
  party: { on: boolean };
};

export type NotificationKind = keyof NotificationPrefs;

const RISK_HOUR = 17;
const DAY_REVIEW_HOUR = 21;

export const RISK_TIME = RISK_HOUR * MINUTES_PER_HOUR;

// Значения до первого включения: все выключено, время и дни по умолчанию
export const defaultPrefs: NotificationPrefs = {
  dayReview: { on: false, time: DAY_REVIEW_HOUR * MINUTES_PER_HOUR },
  risk: { on: false, days: { 5: RISK_TIME, 6: RISK_TIME } },
  party: { on: false },
};

export const anyOn = (p: NotificationPrefs) =>
  p.dayReview.on || p.risk.on || p.party.on;
