import type { Locale } from './getLocale';

export type PluralForms = { one: string; few?: string; many: string };

// Форма слова для целого n: в Hermes нет Intl.PluralRules.
// one - 1, 21 (en - только 1); few - 2-4, 22-24 (только ru, по умолчанию как many); many - остальное.
export const pluralize = (
  n: number,
  { one, many, few = many }: PluralForms,
  locale: Locale,
) => {
  if (locale === 'en') {
    return n === 1 ? one : many;
  }

  const d = n % 10;
  const dd = n % 100;

  if (d === 1 && dd !== 11) {
    return one;
  }

  if (d >= 2 && d <= 4 && (dd < 12 || dd > 14)) {
    return few;
  }

  return many;
};
