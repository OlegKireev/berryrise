import { t } from '../i18n';

import type { ReasonRow } from './types';

// Готовая причина - подпись на языке приложения, своя - текст пользователя
export const reasonLabel = (r: Pick<ReasonRow, 'key' | 'customText'>) =>
  r.key ? t(`labels.${r.key}`) : (r.customText ?? '');
