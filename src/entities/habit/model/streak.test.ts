import assert from 'node:assert/strict';

import { soberDays, streak } from './streak';

// Месяц с нуля, как в Date: oct(13, 9) = 13 октября, 09:00 по местному времени
const oct = (d: number, h = 12, min = 0) =>
  new Date(2026, 9, d, h, min).getTime();

test('старт в 23:50, в полночь уже 1 день', () => {
  assert.equal(streak(oct(12, 23, 50), [], oct(13, 0)).current, 1);
});

test('день старта не трезвый', () => {
  assert.deepEqual(streak(oct(13, 9), [], oct(13, 18)), {
    current: 0,
    best: 0,
    total: 0,
    since: oct(13, 9),
  });
});

test('срыв сегодня обнуляет стрик, завтра снова 1', () => {
  const relapse = oct(23, 22);
  assert.equal(streak(oct(13), [relapse], oct(23, 23)).current, 0);
  assert.equal(streak(oct(13), [relapse], oct(24, 8)).current, 1);
});

test('серия после срыва и всего трезвых', () => {
  const s = streak(oct(12, 23), [oct(15, 22)], oct(17));
  assert.equal(s.current, 2);
  assert.equal(s.total, 4);
  assert.equal(s.since, oct(15, 22));
});

test('лучшая серия в прошлом', () => {
  const s = streak(oct(1), [oct(11)], oct(13));
  assert.equal(s.best, 9);
  assert.equal(s.current, 2);
});

test('удаленный срыв просто не передается', () => {
  assert.equal(streak(oct(1), [], oct(13)).current, 12);
});

test('переход на зимнее время не сбивает счет', () => {
  // TZ=Europe/Berlin задан в скрипте test, 25.10.2026 там 25 часов
  assert.equal(streak(oct(24), [], oct(27)).current, 3);
  assert.equal(
    streak(
      new Date(2026, 2, 28, 12).getTime(),
      [],
      new Date(2026, 2, 31, 12).getTime(),
    ).current,
    3,
  );
});

test('soberDays: без дня старта, с сегодня, срыв не трезвый', () => {
  assert.deepEqual(soberDays(oct(12, 23), [oct(14, 22)], oct(15, 8)), [
    { date: '2026-10-13', sober: true },
    { date: '2026-10-14', sober: false },
    { date: '2026-10-15', sober: true },
  ]);
});

test('soberDays: даты подряд через переход на зимнее время', () => {
  assert.deepEqual(
    soberDays(oct(24), [], oct(27)).map((d) => d.date),
    ['2026-10-25', '2026-10-26', '2026-10-27'],
  );
});
