import {
  getLocale,
  pluralize,
  type Locale,
  type PluralForms,
} from '@/shared/lib';

import { common } from './common';

const locale = getLocale();

type Tree = { [key: string]: string | Tree };
type CommonKey = keyof typeof common.ru;

// Ключи дерева через точку: { drinks: { beer } } -> 'drinks.beer'
type Path<T> = {
  [K in keyof T & (string | number)]: T[K] extends string
    ? `${K}`
    : `${K}.${Path<T[K]>}`;
}[keyof T & (string | number)];

const flatten = (tree: Tree, prefix = '', out: Record<string, string> = {}) => {
  for (const [k, v] of Object.entries(tree)) {
    if (typeof v === 'string') out[prefix + k] = v;
    else flatten(v, `${prefix}${k}.`, out);
  }
  return out;
};

type Dict<T extends Tree = Tree> = Record<Locale, T>;

const commonLang: Record<string, string> = common[locale];

// Словарь слайса. NoInfer: тип задает ru, en обязан совпасть с ним по ключам
export const defineDict = <T extends Tree>(dict: { ru: T; en: NoInfer<T> }) =>
  dict;

// Коллизии ключей запрещаем типами, с текстом ошибки прямо в сообщении tsc.
// Неймспейс: тип значения становится строкой с текстом, словарь в нее не подходит
type Clash<K, Taken, Msg extends string> = {
  [P in K & Taken & string]: `i18n: "${P}" ${Msg}`;
};
// Ключ слайса: значение-литерал в пересечении дало бы never, поэтому требуем
// фантомное поле i18nError, которого в словаре нет
type OwnClash<D> = [keyof D & CommonKey] extends [never]
  ? unknown
  : {
      i18nError: `i18n: "${keyof D & CommonKey & string}" уже есть в common.ts, переименуй ключ`;
    };

// t слайса: его строки, общие слова и словари нижних слоев под неймспейсами,
// createT(dict, { habit: habitDict }) -> t('habit.drinks.beer')
export const createT = <
  D extends Tree,
  N extends Record<string, Dict> = Record<never, never>,
>(
  dict: { ru: D; en: NoInfer<D> } & NoInfer<OwnClash<D>>,
  deps?: N &
    Clash<
      keyof N,
      keyof D | CommonKey,
      'уже занят ключом, выбери другой неймспейс'
    >,
) => {
  const lang = flatten(dict[locale]);
  for (const [ns, d] of Object.entries((deps ?? {}) as Record<string, Dict>))
    flatten(d[locale], `${ns}.`, lang);
  // Ключ без строки (например, устаревший ключ из базы) показываем как есть, а не undefined
  return (key: Path<D & { [K in keyof N]: N[K]['ru'] }> | CommonKey): string =>
    lang[key] ?? commonLang[key] ?? key;
};

// Только общие слова, для app и shared/ui
export const t = createT({ ru: {}, en: {} });

const dayForms: PluralForms =
  locale === 'ru'
    ? { one: 'день', few: 'дня', many: 'дней' }
    : { one: 'day', many: 'days' };

// "1 день", "3 дня", "5 дней", "11 дней", "21 день"
export const days = (n: number) => `${n} ${pluralize(n, dayForms, locale)}`;

const dateTime = new Intl.DateTimeFormat(locale, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const formatDateTime = (ms: number) => dateTime.format(ms);

// 24 часа в любой локали: пикер времени открывается так же
const timeOfDay = new Intl.DateTimeFormat(locale, {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

// "21:00" из минут от полуночи
export const formatTime = (minutes: number) =>
  timeOfDay.format(
    new Date(2026, 0, 1, Math.floor(minutes / 60), minutes % 60),
  );

const shortDate = new Intl.DateTimeFormat(locale, {
  day: 'numeric',
  month: 'short',
});

// "13 окт." из YYYY-MM-DD. Разбираем руками: new Date('YYYY-MM-DD') трактуется как UTC
export const formatDay = (date: string) => {
  const [y, m, d] = date.split('-').map(Number) as [number, number, number];
  return shortDate.format(new Date(y, m - 1, d));
};

const monthYear = new Intl.DateTimeFormat(locale, {
  month: 'long',
  year: 'numeric',
});

// "Октябрь 2026 г." / "October 2026", month с нуля, как в Date
export const formatMonth = (year: number, month: number) => {
  const s = monthYear.format(new Date(year, month, 1));
  return s.charAt(0).toUpperCase() + s.slice(1);
};

// Короткие дни недели с понедельника: 12.10.2026 - понедельник
const weekday = new Intl.DateTimeFormat(locale, { weekday: 'short' });
export const weekdays = Array.from({ length: 7 }, (_, i) =>
  weekday.format(new Date(2026, 9, 12 + i)),
);

const portionForms: PluralForms =
  locale === 'ru'
    ? { one: 'порция', few: 'порции', many: 'порций' }
    : { one: 'drink', many: 'drinks' };

// "1 порция", "3 порции", "5 порций"
export const portions = (n: number) =>
  `${n} ${pluralize(n, portionForms, locale)}`;

const moneyFormat = (currency: string) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });

// "12 500 ₽". Если Intl в Hermes не знает валюту, показываем "12500 RUB"
export const formatMoney = (amount: number, currency: string) => {
  try {
    return moneyFormat(currency).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
};

// Символ валюты для чипа: "₾" для GEL, иначе сам код
export const currencySymbol = (currency: string) => {
  try {
    return (
      moneyFormat(currency)
        .formatToParts(0)
        .find((p) => p.type === 'currency')?.value ?? currency
    );
  } catch {
    return currency;
  }
};
