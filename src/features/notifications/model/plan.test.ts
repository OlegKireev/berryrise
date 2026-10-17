import assert from 'node:assert/strict';

import { HORIZON_DAYS, isStale, parseNotificationData, plan } from './plan';
import { defaultPrefs, type NotificationPrefs } from './types';

// 2026-10-14 - среда. Месяц с нуля, как в Date
const oct = (d: number, h = 12, min = 0) =>
  new Date(2026, 9, d, h, min).getTime();

const none = { reviewDates: [], partyDays: [], activeParty: null };

const prefs = (p: Partial<NotificationPrefs>): NotificationPrefs => ({
  ...defaultPrefs,
  ...p,
});

const reviewOn = prefs({ dayReview: { on: true, time: 21 * 60 } });
const riskOn = prefs({ risk: { on: true, days: defaultPrefs.risk.days } });

test('по умолчанию ничего не планируется', () => {
  assert.deepEqual(plan(defaultPrefs, oct(14), none), []);
});

test('итоги дня каждый вечер на весь горизонт', () => {
  const out = plan(reviewOn, oct(14), none);
  assert.equal(out.length, HORIZON_DAYS);
  assert.equal(out[0]?.at, oct(14, 21));
  assert.equal(out[1]?.at, oct(15, 21));
});

test('прошедшее время сегодня не планируется', () => {
  const out = plan(reviewOn, oct(14, 22), none);
  assert.equal(out[0]?.at, oct(15, 21));
});

test('заполненные итоги пропускают день', () => {
  const out = plan(reviewOn, oct(14, 19), {
    ...none,
    reviewDates: ['2026-10-14'],
  });
  assert.equal(out[0]?.at, oct(15, 21));
});

test('напоминание до 18:00 сверяется с итогами за вчера', () => {
  const p = prefs({ dayReview: { on: true, time: 9 * 60 } });
  const out = plan(p, oct(14, 8), { ...none, reviewDates: ['2026-10-13'] });
  assert.equal(out[0]?.at, oct(15, 9));
});

test('дни риска по умолчанию в пятницу и субботу', () => {
  const out = plan(riskOn, oct(14), none);
  assert.deepEqual(
    out.slice(0, 2).map((p) => p.at),
    [oct(16, 17), oct(17, 17)],
  );
  assert.equal(out.length, 4);
});

test('у каждого дня риска свое время', () => {
  const p = prefs({ risk: { on: true, days: { 0: 15 * 60, 5: 17 * 60 } } });
  const out = plan(p, oct(14), none);
  assert.deepEqual(
    out.slice(0, 2).map((p) => p.at),
    [oct(16, 17), oct(18, 15)],
  );
});

test('вечеринка в этот день снимает день риска', () => {
  const out = plan(riskOn, oct(16, 16), { ...none, partyDays: ['2026-10-16'] });
  assert.equal(out[0]?.at, oct(17, 17));
});

test('как прошло только на будущий конец идущей вечеринки', () => {
  const p = prefs({ party: { on: true } });
  const activeParty = { id: 'p1', expectedEndAt: oct(14, 23) };
  assert.deepEqual(plan(p, oct(14, 19), { ...none, activeParty }), [
    { kind: 'party', at: oct(14, 23), partyId: 'p1' },
  ]);
  assert.deepEqual(plan(p, oct(15, 1), { ...none, activeParty }), []);
});

test('переход на летнее время не сдвигает 21:00', () => {
  // 29 марта 2026 в Europe/Berlin часы переводятся вперед
  const out = plan(reviewOn, new Date(2026, 2, 27, 12).getTime(), none);

  for (const p of out) {
    assert.equal(new Date(p.at).getHours(), 21);
  }

  assert.equal(new Date(out[2]?.at ?? 0).getDate(), 29);
});

test('итоги в шторке устарели, когда за их день все заполнено', () => {
  const n = { kind: 'dayReview' as const, day: '2026-10-14' };
  assert.equal(isStale(n, none), false);
  assert.equal(isStale(n, { ...none, reviewDates: ['2026-10-14'] }), true);
  assert.equal(isStale({ kind: 'dayReview' }, none), false);
});

test('день риска в шторке устарел, когда вечеринка в этот день начата', () => {
  const n = { kind: 'risk' as const, day: '2026-10-16' };
  assert.equal(isStale(n, none), false);
  assert.equal(isStale(n, { ...none, partyDays: ['2026-10-16'] }), true);
});

test('как прошло в шторке устарело, когда вечеринка уже не идет', () => {
  const n = { kind: 'party' as const, partyId: 'p1' };
  const activeParty = { id: 'p1', expectedEndAt: oct(14, 23) };
  assert.equal(isStale(n, { ...none, activeParty }), false);
  assert.equal(isStale(n, none), true);
});

test('data уведомления: неизвестный вид - null, лишнее отбрасываем', () => {
  assert.equal(parseNotificationData({ kind: 'other' }), null);
  assert.equal(parseNotificationData(null), null);
  assert.deepEqual(
    parseNotificationData({ kind: 'risk', day: '2026-10-16', partyId: 1 }),
    {
      kind: 'risk',
      day: '2026-10-16',
      partyId: undefined,
    },
  );
});
