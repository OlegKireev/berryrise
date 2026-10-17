// Что пил раньше: пресеты для экономии и калорий
/** @public */
export const drinks = ['beer', 'wine', 'shot', 'cocktail'] as const;
/** @public */
export type Drink = (typeof drinks)[number];

// Статус дня для цвета: null - нейтральный (до старта или вне истории)
export type DayStatus = 'sober' | 'relapse' | null;
