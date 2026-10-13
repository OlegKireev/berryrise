import type { Row } from '@/shared/db';

// Экстренный контакт
export type Contact = Row & { name: string; phone: string; order: number };
