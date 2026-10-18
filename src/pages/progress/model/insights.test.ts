import assert from 'node:assert/strict';

import { insights, periodDays, periods } from './insights';

const at = (y: number, m: number, d: number) =>
  new Date(y, m - 1, d, 12).getTime();

type Review = Parameters<typeof insights>[0]['reviews'][number];
const review = (date: string, over: Partial<Review> = {}): Review => ({
  date,
  mood: 3,
  craving: 'none',
  hardships: [],
  helpers: [],
  ...over,
});
const run = (over: Partial<Parameters<typeof insights>[0]>) =>
  insights({ reviews: [], relapses: [], partyResults: [], ...over });

test('последние 30 дней - сегодня и 29 дней до него', () => {
  const days = periodDays({ kind: 'last30' }, at(2026, 10, 16));
  assert.equal(days.length, 30);
  assert.equal(days[0], '2026-09-17');
  assert.equal(days[29], '2026-10-16');
});

test('последние 30 дней через переход на летнее время без дыр и повторов', () => {
  // 29.03.2026 в Берлине сутки по 23 часа
  const days = periodDays({ kind: 'last30' }, at(2026, 4, 10));
  assert.equal(new Set(days).size, 30);
  assert.equal(days[0], '2026-03-12');
  assert.ok(days.includes('2026-03-29'));
});

test('месяц целиком', () => {
  const days = periodDays({ kind: 'month', year: 2026, month: 8 }, 0);
  assert.equal(days.length, 30);
  assert.equal(days[0], '2026-09-01');
  assert.equal(days[29], '2026-09-30');
});

test('периоды: последние 30 дней, потом прошлые месяцы до месяца старта', () => {
  assert.deepEqual(periods(at(2026, 8, 20), at(2026, 10, 16)), [
    { kind: 'last30' },
    { kind: 'month', year: 2026, month: 8 },
    { kind: 'month', year: 2026, month: 7 },
  ]);
});

test('старт в текущем месяце - только последние 30 дней', () => {
  assert.deepEqual(periods(at(2026, 10, 3), at(2026, 10, 16)), [
    { kind: 'last30' },
  ]);
});

test('периоды через новый год', () => {
  const list = periods(at(2025, 12, 5), at(2026, 1, 10));
  assert.deepEqual(list[1], { kind: 'month', year: 2025, month: 11 });
});

test('порог: 7 итогов достаточно, 6 нет', () => {
  const reviews = Array.from({ length: 7 }, (_, i) =>
    review(`2026-10-0${i + 1}`),
  );
  assert.equal(run({ reviews }).enough, true);
  assert.equal(run({ reviews: reviews.slice(1) }).enough, false);
  assert.equal(run({ reviews: reviews.slice(1) }).reviewCount, 6);
});

test('тяга: среднее по дню недели, день без итогов - null', () => {
  // 9.10 и 16.10.2026 - пятницы
  const r = run({
    reviews: [
      review('2026-10-09', { craving: 'strong' }),
      review('2026-10-16', { craving: 'slight' }),
      review('2026-10-12', { craving: 'none' }), // понедельник
    ],
  });
  assert.equal(r.cravingByWeekday[4], 2);
  assert.equal(r.cravingByWeekday[0], 0);
  assert.equal(r.cravingByWeekday[2], null);
  assert.equal(r.peakWeekday, 4);
});

test('тяги не было - peakWeekday null', () => {
  const r = run({ reviews: [review('2026-10-09'), review('2026-10-10')] });
  assert.equal(r.peakWeekday, null);
});

test('настроение: сколько дней было каждое', () => {
  const r = run({
    reviews: [
      review('2026-10-05', { mood: 4 }),
      review('2026-10-06', { mood: 4 }),
      review('2026-10-07', { mood: 1 }),
    ],
  });
  assert.deepEqual(r.moodCounts, [
    { mood: 1, count: 1 },
    { mood: 2, count: 0 },
    { mood: 3, count: 0 },
    { mood: 4, count: 2 },
    { mood: 5, count: 0 },
  ]);
});

test('топ 3: по убыванию, равенство по порядку вопроса', () => {
  const reviews = [
    ...Array<ReturnType<typeof review>>(9).fill(
      review('2026-10-01', { craving: 'slight', hardships: ['stress'] }),
    ),
    ...Array<ReturnType<typeof review>>(5).fill(
      review('2026-10-01', {
        craving: 'strong',
        hardships: ['boredom', 'fatigue'],
      }),
    ),
    ...Array<ReturnType<typeof review>>(2).fill(
      review('2026-10-01', {
        craving: 'noticeable',
        hardships: ['loneliness'],
      }),
    ),
  ];
  const r = run({ reviews });
  assert.deepEqual(r.hardships, [
    { key: 'stress', count: 9 },
    { key: 'fatigue', count: 5 },
    { key: 'boredom', count: 5 },
  ]);
  assert.equal(r.cravingCount, 16);
});

test('топы только по дням с тягой', () => {
  const r = run({
    reviews: [
      review('2026-10-01', {
        craving: 'slight',
        hardships: ['stress'],
        helpers: ['hobby'],
      }),
      review('2026-10-02', { hardships: ['stress', 'boredom'] }),
      review('2026-10-03', { helpers: ['sleep'] }),
    ],
  });
  assert.equal(r.reviewCount, 3);
  assert.equal(r.cravingCount, 1);
  assert.deepEqual(r.hardships, [{ key: 'stress', count: 1 }]);
  assert.deepEqual(r.helpers, [{ key: 'hobby', count: 1 }]);
  assert.equal(r.topHelper, 'hobby');
});

test('тяги не было: топы пустые', () => {
  const r = run({
    reviews: [
      review('2026-10-01', { hardships: ['stress'], helpers: ['sleep'] }),
      review('2026-10-02', { hardships: ['anxiety'] }),
    ],
  });
  assert.equal(r.cravingCount, 0);
  assert.deepEqual(r.hardships, []);
  assert.deepEqual(r.helpers, []);
  assert.equal(r.topHelper, null);
});

test('срывы: без срывов null, без разбора только в счет', () => {
  assert.equal(run({}).relapses, null);
  const r = run({
    relapses: [
      { places: ['bar'], hardships: ['othersDrinking'] },
      { places: ['bar'], hardships: [] },
      { places: [], hardships: [] },
    ],
  });
  assert.deepEqual(r.relapses, {
    count: 3,
    analyzed: 2,
    hardships: [{ key: 'othersDrinking', count: 1 }],
    places: [{ key: 'bar', count: 2 }],
  });
});

test('компания: всего и без алкоголя, без вечеров null', () => {
  assert.equal(run({}).company, null);
  assert.deepEqual(
    run({ partyResults: ['sober', 'sober', 'drank', 'sober'] }).company,
    { total: 4, sober: 3 },
  );
});
