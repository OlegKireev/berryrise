import assert from 'node:assert/strict';

import { at } from '@/shared/lib';

import { notesFeed } from './notes';

const review = (date: string, note: string | null) => ({
  date,
  mood: 3 as const,
  craving: 'none' as const,
  note,
});

const relapse = (at: Date, note: string | null) => ({
  at: at.getTime(),
  mood: null,
  note,
});

const dates = (feed: ReturnType<typeof notesFeed>) =>
  feed.map((m) => [m.month, m.data.map((d) => d.date)]);

test('notesFeed: дни и месяцы новые сверху', () => {
  const feed = notesFeed({
    reviews: [
      review('2026-09-28', 'a'),
      review('2026-10-03', 'b'),
      review('2026-10-12', 'c'),
    ],
    relapses: [],
  });
  assert.deepEqual(dates(feed), [
    ['2026-10', ['2026-10-12', '2026-10-03']],
    ['2026-09', ['2026-09-28']],
  ]);
});

test('notesFeed: итоги и срывы одного дня под одной датой, срывы по времени', () => {
  const feed = notesFeed({
    reviews: [review('2026-10-12', 'итоги')],
    relapses: [
      relapse(new Date(2026, 9, 12, 21, 40), 'поздний'),
      relapse(new Date(2026, 9, 12, 13, 0), 'ранний'),
    ],
  });
  assert.equal(feed.length, 1);
  const day = at(at(feed, 0).data, 0);
  assert.equal(day.review?.note, 'итоги');
  assert.deepEqual(
    day.relapses.map((r) => r.note),
    ['ранний', 'поздний'],
  );
});

test('notesFeed: пустые и пробельные заметки отбрасываются, текст обрезается', () => {
  const feed = notesFeed({
    reviews: [review('2026-10-10', '   '), review('2026-10-11', ' мысль\n')],
    relapses: [relapse(new Date(2026, 9, 10, 20, 0), null)],
  });
  assert.deepEqual(dates(feed), [['2026-10', ['2026-10-11']]]);
  assert.equal(at(at(feed, 0).data, 0).review?.note, 'мысль');
});

test('notesFeed: срыв около полуночи относится к своему локальному дню', () => {
  const feed = notesFeed({
    reviews: [],
    relapses: [
      relapse(new Date(2026, 9, 25, 23, 59), 'до'),
      relapse(new Date(2026, 9, 26, 0, 1), 'после'),
    ],
  });
  assert.deepEqual(dates(feed), [['2026-10', ['2026-10-26', '2026-10-25']]]);
});

test('notesFeed: нет заметок - пустая лента', () => {
  assert.deepEqual(notesFeed({ reviews: [], relapses: [] }), []);
});
