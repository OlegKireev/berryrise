// ponytail: короткий список частых валют, расширим по запросу
export const currencies = [
  'RUB',
  'USD',
  'EUR',
  'GEL',
  'KZT',
  'UAH',
  'BYN',
  'GBP',
  'TRY',
  'AMD',
];

const euro = 'AT BE CY DE EE ES FI FR GR HR IE IT LT LU LV MT NL PT SI SK';

// Страна -> валюта, только для валют из списка
const byRegion: Record<string, string> = {
  RU: 'RUB',
  US: 'USD',
  GE: 'GEL',
  KZ: 'KZT',
  UA: 'UAH',
  BY: 'BYN',
  GB: 'GBP',
  TR: 'TRY',
  AM: 'AMD',
  ...Object.fromEntries(euro.split(' ').map((r) => [r, 'EUR'])),
};

// Валюта по умолчанию по региону системной локали (ru-KZ -> KZT).
// Региона нет или его валюты нет в списке - по языку: рубль для русского, иначе доллар
export function defaultCurrency(
  systemLocale = Intl.DateTimeFormat().resolvedOptions().locale,
): string {
  const [lang = '', ...rest] = systemLocale.split(/[-_]/);
  // регион - первая часть из двух букв: в ru-Cyrl-KZ перед ним скрипт
  const region = rest.find((p) => /^[a-z]{2}$/i.test(p)) ?? '';

  return (
    byRegion[region.toUpperCase()] ??
    (lang.toLowerCase() === 'ru' ? 'RUB' : 'USD')
  );
}
