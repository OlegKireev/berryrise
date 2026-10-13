export type Locale = 'ru' | 'en';

// Язык интерфейса по локали системы: русский для ru-*, для остальных английский.
// ponytail: без expo-localization и смены на лету, вызывается один раз при старте
export const getLocale = (
  systemLocale = Intl.DateTimeFormat().resolvedOptions().locale,
): Locale =>
  systemLocale.toLowerCase().split(/[-_]/)[0] === 'ru' ? 'ru' : 'en';
