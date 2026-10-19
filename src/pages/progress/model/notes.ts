import type { Craving, Mood } from '@/shared/config';
import { toDay } from '@/shared/lib';

type ReviewNote = {
  date: string;
  mood: Mood;
  craving: Craving;
  note: string | null;
};

type RelapseNote = {
  at: number;
  mood: Mood | null;
  note: string | null;
};

export type NoteDay = {
  date: string;
  review: (ReviewNote & { note: string }) | null;
  relapses: (RelapseNote & { note: string })[];
};

export type NoteMonth = {
  // YYYY-MM
  month: string;
  data: NoteDay[];
};

// Заметку без текста (NULL или одни пробелы) в ленту не берем
const withNote = <T extends { note: string | null }>(row: T) => {
  const note = row.note?.trim();
  return note ? { ...row, note } : null;
};

// Лента заметок: дни новые сверху, внутри дня итоги и под ними срывы по времени,
// дни сгруппированы по месяцам (секции SectionList)
export function notesFeed(input: {
  reviews: ReviewNote[];
  relapses: RelapseNote[];
}): NoteMonth[] {
  const days = new Map<string, NoteDay>();
  const day = (date: string) => {
    const found = days.get(date);

    if (found) {
      return found;
    }

    const created: NoteDay = { date, review: null, relapses: [] };
    days.set(date, created);
    return created;
  };

  for (const r of input.reviews) {
    const review = withNote(r);

    if (review) {
      day(review.date).review = review;
    }
  }

  for (const r of input.relapses) {
    const relapse = withNote(r);

    if (relapse) {
      day(toDay(relapse.at)).relapses.push(relapse);
    }
  }

  const months: NoteMonth[] = [];

  for (const d of [...days.values()].sort((a, b) =>
    b.date.localeCompare(a.date),
  )) {
    d.relapses.sort((a, b) => a.at - b.at);
    const month = d.date.slice(0, 'YYYY-MM'.length);
    const last = months.at(-1);

    if (last?.month === month) {
      last.data.push(d);
    } else {
      months.push({ month, data: [d] });
    }
  }

  return months;
}
