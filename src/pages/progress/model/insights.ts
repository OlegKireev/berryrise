import {
  cravings,
  hardships as hardshipKeys,
  helpers as helperKeys,
  moods,
  places as placeKeys,
  type Craving,
  type Hardship,
  type Helper,
  type Mood,
  type Place,
} from '@/shared/config';
import {
  addDays,
  dayDate,
  DAYS_PER_WEEK,
  MONTHS_PER_YEAR,
  toDay,
  weekdayFromMonday,
} from '@/shared/lib';

import { monthIndex } from './calendar';

// Сколько итогов дня в периоде нужно, чтобы показать графики из них
export const REVIEWS_NEEDED = 7;

// Длина периода last30 в днях
const LAST_DAYS = 30;
const TOP_SIZE = 3;

export type Period =
  { kind: 'last30' } | { kind: 'month'; year: number; month: number };

// Периоды для листания: сначала последние 30 дней, дальше прошлые месяцы до месяца старта
export function periods(startAt: number, now: number): Period[] {
  const out: Period[] = [{ kind: 'last30' }];

  for (let i = monthIndex(now) - 1; i >= monthIndex(startAt); i--) {
    out.push({
      kind: 'month',
      year: Math.floor(i / MONTHS_PER_YEAR),
      month: i % MONTHS_PER_YEAR,
    });
  }

  return out;
}

// Даты периода YYYY-MM-DD по порядку. Через конструктор Date: сутки бывают по 23 и 25 часов
export function periodDays(period: Period, now: number): string[] {
  if (period.kind === 'month') {
    const { year, month } = period;
    const length = new Date(year, month + 1, 0).getDate();
    return Array.from({ length }, (_, i) =>
      toDay(new Date(year, month, i + 1).getTime()),
    );
  }

  const today = toDay(now);
  return Array.from({ length: LAST_DAYS }, (_, i) =>
    addDays(today, i - LAST_DAYS + 1),
  );
}

export type Top<K> = { key: K; count: number }[];

// Три самых частых варианта; при равенстве - порядок вопроса, skip ("ничего") не считаем
const top3 = <K extends string>(
  lists: K[][],
  order: readonly K[],
  skip?: K,
): Top<K> =>
  order
    .filter((key) => key !== skip)
    .map((key) => ({ key, count: lists.filter((l) => l.includes(key)).length }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, TOP_SIZE);

// День недели с понедельника: 0 - понедельник
// день недели как у Date.getDay()
// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- список ключей, числа и есть данные
const weekdayList = [0, 1, 2, 3, 4, 5, 6] as const;
const weekdayOf = (date: string) => weekdayFromMonday(dayDate(date));

type Input = {
  reviews: {
    date: string;
    mood: Mood;
    craving: Craving;
    hardships: Hardship[];
    helpers: Helper[];
  }[];
  relapses: { places: Place[]; hardships: Hardship[] }[];
  partyResults: ('sober' | 'drank')[]; // только вечеринки с ответом
};

// Все блоки статистики за период
export function insights({ reviews, relapses, partyResults }: Input) {
  const sums = Array<number>(DAYS_PER_WEEK).fill(0);
  const counts = Array<number>(DAYS_PER_WEEK).fill(0);

  for (const r of reviews) {
    const wd = weekdayOf(r.date);
    sums[wd] = (sums[wd] ?? 0) + cravings.indexOf(r.craving);
    counts[wd] = (counts[wd] ?? 0) + 1;
  }

  // средний уровень 0..3, null - за этот день недели итогов нет
  const cravingByWeekday = sums.map((s, i) =>
    counts[i] ? s / counts[i] : null,
  );

  const peak = Math.max(...cravingByWeekday.map((c) => c ?? 0));
  const helpers = top3(
    reviews.map((r) => r.helpers),
    helperKeys,
    'notNeeded',
  );

  return {
    reviewCount: reviews.length,
    enough: reviews.length >= REVIEWS_NEEDED,
    cravingByWeekday,
    // сколько дней было каждое настроение, от 1 до 5
    moodCounts: moods.map((mood) => ({
      mood,
      count: reviews.filter((r) => r.mood === mood).length,
    })),
    hardships: top3(
      reviews.map((r) => r.hardships),
      hardshipKeys,
      'nothing',
    ),
    helpers,
    relapses: relapses.length
      ? {
          count: relapses.length,
          // с разбором: есть трудности или места, только они попадают в топы
          analyzed: relapses.filter(
            (r) => r.hardships.length || r.places.length,
          ).length,
          hardships: top3(
            relapses.map((r) => r.hardships),
            hardshipKeys,
            'nothing',
          ),
          places: top3(
            relapses.map((r) => r.places),
            placeKeys,
          ),
        }
      : null,
    company: partyResults.length
      ? {
          total: partyResults.length,
          sober: partyResults.filter((r) => r === 'sober').length,
        }
      : null,
    // для превью: день недели с самой сильной тягой (ранний при равенстве), null - тяги не было
    peakWeekday:
      peak > 0
        ? (weekdayList.find((w) => cravingByWeekday[w] === peak) ?? null)
        : null,
    topHelper: helpers[0]?.key ?? null,
  };
}

export type Insights = ReturnType<typeof insights>;
