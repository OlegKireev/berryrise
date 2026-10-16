import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';
import {
  requestWidgetUpdate,
  type WidgetInfo,
  type WidgetTaskHandler,
} from 'react-native-android-widget';

import { getHabit, streak } from '@/entities/habit';
import { listRelapses } from '@/entities/relapse';

import { StreakWidget, type WidgetVariant } from '../ui/StreakWidget';

// Имена как в app.json: карточка первой в пикере, чернила вторым
const variants: Record<string, WidgetVariant> = {
  Streak: 'card',
  StreakInk: 'ink',
};

async function currentStreak(db: SQLiteDatabase) {
  const habit = await getHabit(db);
  if (!habit) return 0; // онбординг не пройден
  const relapses = await listRelapses(db);
  return streak(
    habit.startAt,
    relapses.map((r) => r.at),
    Date.now(),
  ).current;
}

// Квадрат по меньшей стороне: ячейка 1x1 бывает выше, чем шире (Pixel Launcher)
const widgetTree = (count: number, info: WidgetInfo) => {
  const variant = variants[info.widgetName] ?? 'card';
  const size = Math.floor(Math.min(info.width, info.height));
  return {
    light: (
      <StreakWidget
        count={count}
        variant={variant}
        scheme="light"
        size={size}
      />
    ),
    dark: (
      <StreakWidget
        count={count}
        variant={variant}
        scheme="dark"
        size={size}
      />
    ),
  };
};

// Из приложения: при старте и уходе в фон
export async function updateWidget(db: SQLiteDatabase) {
  try {
    const count = await currentStreak(db);
    for (const widgetName of Object.keys(variants)) {
      await requestWidgetUpdate({
        widgetName,
        renderWidget: (info) => widgetTree(count, info),
      });
    }
  } catch (e) {
    console.warn('widget update failed', e);
  }
}

// Из фона: добавление виджета и updatePeriodMillis (раз в 30 минут, так ловим полночь)
export const widgetTaskHandler: WidgetTaskHandler = async (props) => {
  if (props.widgetAction === 'WIDGET_DELETED') return;
  if (props.widgetAction === 'WIDGET_CLICK') return; // OPEN_APP библиотека обрабатывает сама
  let count = 0;
  try {
    // ponytail: только чтение, без миграций; до первого запуска таблиц нет - тогда 0
    const db = await openDatabaseAsync('berryrise.db');
    try {
      count = await currentStreak(db);
    } finally {
      await db.closeAsync();
    }
  } catch (e) {
    console.warn('widget task failed', e);
  }
  props.renderWidget(widgetTree(count, props.widgetInfo));
};
