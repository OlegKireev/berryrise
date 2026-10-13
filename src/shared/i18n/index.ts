import { getLocale, pluralize, type PluralForms } from '@/shared/lib';

import { en } from './en';
import { ru } from './ru';

const locale = getLocale();
const lang = locale === 'ru' ? ru : en;

export const t = (key: keyof typeof ru) => lang[key];

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
