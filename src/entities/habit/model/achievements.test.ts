import assert from 'node:assert/strict';

import { toDay } from '@/shared/lib';
import {
  achievements,
  achievementKeys,
  medalStates,
  type AchievementKey,
  type Got,
} from './achievements';
import { soberDays } from './streak';

// Месяц с нуля, как в Date: oct(13, 9) = 13 октября 2026, 09:00 по местному времени.
// 16.10.2026 - пятница
const oct = (d: number, h = 12, min = 0) =>
  new Date(2026, 9, d, h, min).getTime();
const day = (d: number) => toDay(oct(d));

const get = (
  startAt: number,
  relapseAts: number[],
  now: number,
  reviewDates: string[] = [],
  soberParties: number[] = [],
  companyDates: string[] = [],
) =>
  achievements(soberDays(startAt, relapseAts, now), reviewDates, toDay(now), {
    soberParties,
    companyDates,
  });

test('первый день в полночь', () => {
  assert.equal(get(oct(13, 23, 50), [], oct(14, 0)).days1, day(14));
});

test('дни кусками не складываются', () => {
  const a = get(oct(1), [oct(6), oct(11)], oct(14));
  assert.equal(a.days3, day(4));
  assert.equal(a.days7, undefined);
});

test('дата по первой серии, срыв не забирает', () => {
  const a = get(oct(1), [oct(9)], oct(16));
  assert.equal(a.days7, day(8));
});

test('пятница засчитывается, когда прошла', () => {
  assert.equal(get(oct(12), [], oct(16, 23)).friday, undefined);
  assert.equal(get(oct(12), [], oct(17, 0)).friday, day(16));
});

test('трезвые пт-вс', () => {
  assert.equal(get(oct(12), [], oct(18, 23)).weekend, undefined);
  assert.equal(get(oct(12), [], oct(19)).weekend, day(18));
});

test('срыв в субботу переносит выходные на следующую неделю', () => {
  assert.equal(get(oct(12), [oct(17)], oct(26)).weekend, day(25));
});

test('старт в субботу: первые выходные не считаются', () => {
  const a = get(oct(17), [], oct(19));
  assert.equal(a.weekend, undefined);
  assert.equal(a.friday, undefined);
});

test('итоги дня 7 дней подряд', () => {
  const dates = [3, 1, 2, 4, 5, 6, 7].map(day);
  assert.equal(get(oct(1), [], oct(14), dates).reviews7, day(7));
});

test('пропуск в итогах дня', () => {
  const dates = [1, 2, 3, 5, 6, 7, 8].map(day);
  assert.equal(get(oct(1), [], oct(14), dates).reviews7, undefined);
});

test('итоги дня подряд через переход на зимнее время', () => {
  const dates = [22, 23, 24, 25, 26, 27, 28].map(day);
  assert.equal(get(oct(1), [], oct(29), dates).reviews7, day(28));
});

test('вернулся после срыва и продержался 7 дней', () => {
  assert.equal(get(oct(1), [oct(5)], oct(11)).comeback7, undefined);
  assert.equal(get(oct(1), [oct(5)], oct(12)).comeback7, day(12));
});

test('без срывов восстановления нет', () => {
  assert.equal(get(oct(1), [], oct(31)).comeback7, undefined);
});

test('сводный пример со спеки: 5 из 20', () => {
  const a = get(oct(1), [], oct(9));
  assert.deepEqual(a, {
    days1: day(2),
    days3: day(4),
    days7: day(8),
    friday: day(2),
    weekend: day(4),
  });
  assert.equal(achievementKeys.length, 20);
});

test('первая трезвая вечеринка', () => {
  assert.equal(get(oct(1), [], oct(20), [], [oct(16, 19)]).company1, day(16));
});

test('вечеринка и место в один день - один вечер', () => {
  const a = get(oct(1), [], oct(31), [], [oct(16, 19)], [day(16), day(17)]);
  assert.equal(a.company1, day(16));
  assert.equal(a.company5, undefined);
});

test('5 вечеров только по местам в итогах', () => {
  const dates = [3, 10, 17, 24, 31].map(day);
  const a = get(oct(1), [], new Date(2026, 10, 2).getTime(), [], [], dates);
  assert.equal(a.company1, day(3));
  assert.equal(a.company5, day(31));
  assert.equal(a.company10, undefined);
});

test('место в день срыва не засчитывается', () => {
  assert.equal(
    get(oct(1), [oct(16)], oct(20), [], [], [day(16)]).company1,
    undefined,
  );
});

test('вечеринка в день старта засчитывается по ответу', () => {
  assert.equal(
    get(oct(16, 10), [], oct(17), [], [oct(16, 19)]).company1,
    day(16),
  );
});

test('два года', () => {
  const now = new Date(2028, 9, 1, 12).getTime();
  const a = get(oct(1), [], now);
  assert.equal(a.days365, '2027-10-01');
  assert.equal(a.days730, '2028-09-30'); // 2028 високосный, 730-й день на день раньше
  assert.equal(a.days1095, undefined);
});

const none = (): Got => ({});
const gotUpTo = (...keys: AchievementKey[]) => {
  const g = none();

  for (const k of keys) {
    g[k] = '2026-10-01';
  }

  return g;
};

test('ничего не получено: первая в серии следующая, дальше скрыты', () => {
  const s = medalStates(none(), 0, 0);
  assert.deepEqual(s.days1, { state: 'next', left: 1 });
  assert.equal(s.days3, undefined);
  assert.deepEqual(s.company1, { state: 'next', left: 1 });
  assert.equal(s.company5, undefined);
  assert.deepEqual(s.friday, { state: 'next', left: undefined });
  assert.equal(s.reviews7?.state, 'next');
});

test('середина стрика: остаток от текущей серии', () => {
  const s = medalStates(gotUpTo('days1', 'days3', 'days7'), 10, 0);
  assert.equal(s.days7?.state, 'got');
  assert.deepEqual(s.days14, { state: 'next', left: 4 });
  assert.equal(s.days30, undefined);
});

test('после срыва остаток считается от текущей, а не от лучшей серии', () => {
  const s = medalStates(gotUpTo('days1', 'days3', 'days7', 'days14'), 3, 0);
  assert.deepEqual(s.days30, { state: 'next', left: 27 });
});

test('вечера в компании', () => {
  const s = medalStates(gotUpTo('company1'), 0, 3);
  assert.deepEqual(s.company5, { state: 'next', left: 2 });
  assert.equal(s.company10, undefined);
});

test('возвращение после срыва скрыто, пока не получено', () => {
  assert.equal(medalStates(none(), 0, 0).comeback7, undefined);
  assert.equal(medalStates(gotUpTo('comeback7'), 0, 0).comeback7?.state, 'got');
});

test('полученная одиночная', () => {
  assert.equal(medalStates(gotUpTo('friday'), 0, 0).friday?.state, 'got');
});
