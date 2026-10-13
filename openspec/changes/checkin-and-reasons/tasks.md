# Tasks

## 1. День чек-ина

- [x] 1.1 Создать `src/entities/checkin/model/checkinDay.ts` с `checkinDay(now)` и `toDay(ms)` по design.md (граница 18:00, шаг назад через `setDate`). Проверить: `yarn typecheck` проходит
- [x] 1.2 Добавить `checkinDay.test.ts` рядом на `node:test` со сценариями из спеки `daily-checkin` (09:30, 17:59, 18:00, 00:40) и утром после перехода на летнее время. Импорты относительные с `.ts`. Проверить: `yarn test` зеленый

## 2. Данные чек-ина и причин

- [x] 2.1 Создать `src/entities/checkin/api/checkin.ts`: `getCheckin(db, date)` и `saveCheckin(db, data)` через `INSERT ... ON CONFLICT(date) WHERE deletedAt IS NULL DO UPDATE`, пустые массивы как `'[]'`, пустая заметка как `NULL`. Экспортировать вместе с `checkinDay`, `toDay` из `index.ts`. Проверить: `yarn typecheck` проходит
- [x] 2.2 Создать `src/entities/reason/api/reason.ts`: `listReasons`, `addReason`, `addReasons` (одна транзакция), `deleteReason` (мягкое), `order` через `MAX("order") + 1`. Добавить `reasonLabel(row)` в `model/` и экспорты в `index.ts`. Проверить: `yarn typecheck` проходит
- [x] 2.3 Добавить строки в `src/shared/i18n/ru.ts` и `en.ts`: подписи `craving_*`, `helper_*`, `reason_*`, заголовки вопросов чек-ина, подписи кнопки чек-ина (за сегодня/вчера, заполнен, подсказка про 18:00), строки таба и шага причин. Добавить `formatDay(date)` в `src/shared/i18n/index.ts` с разбором `YYYY-MM-DD` как локальной даты. Проверить: `yarn typecheck` проходит, у en те же ключи, что у ru

## 3. Чек-ин

- [x] 3.1 Наполнить `src/pages/check-in/ui/CheckInPage.tsx`: день из `checkinDay` при открытии, крупный заголовок "за сегодня/вчера, <дата>", причины над вопросами (если есть), чипы настроения и тяги (обязательные), мест, трудностей и помощи с `toggleExclusive` для `nothing`/`notNeeded`, заметка, предзаполнение из `getCheckin`, "Сохранить" неактивна без настроения и тяги, после сохранения `router.back()`. Проверить в Expo Go: сценарии спеки `daily-checkin` про ответы, "ничего" и повторное открытие
- [x] 3.2 Обновить `src/pages/today/ui/TodayPage.tsx`: читать чек-ин за `checkinDay(now)`, три состояния кнопки из design.md, таймер на ближайшую из границ 18:00 и полночь. Проверить в Expo Go: подпись меняется после сохранения чек-ина; при старте сегодня утром вместо кнопки подсказка про 18:00

## 4. Причины

- [x] 4.1 Наполнить `src/pages/reasons/ui/ReasonsPage.tsx`: список через `listReasons` в `useFocusEffect`, пустое состояние, удаление без подтверждения, чипы готовых причин, которых нет в списке, поле своей причины с `trim` и неактивной кнопкой при пустом тексте. Проверить в Expo Go: сценарии спеки `reasons`, удаленная причина пропадает и из чек-ина

## 5. Онбординг

- [x] 5.1 Создать страницу `src/pages/onboarding/ui/ReasonsStepPage.tsx` и роут `src/app/onboarding/reasons.tsx` без жеста и кнопки назад: причины без лимита (готовые в порядке выбора плюс своя), "Дальше" через `addReasons` и `router.replace('/')`, "Пропустить" сразу `replace('/')`. В `StartPage` после `createHabit` делать `router.dismissAll()` и `router.replace('/onboarding/reasons')`. Проверить в Expo Go: сценарии спеки `onboarding` (выбор, пропуск, перезапуск на шаге причин открывает "Сегодня")

## 6. Документация и проверка

- [x] 6.1 Обновить `CLAUDE.md`: статус (есть чек-ин и причины), онбординг (`reasons` после `start`, онбординг пройден после старта), `checkinDay.ts` в описании `entities`, `formatDay` в i18n. Проверить, что описание совпадает с кодом
- [x] 6.2 Прогнать `yarn test`, `yarn typecheck` и `yarn lint`, все проходят без ошибок

## Workflow follow-up

- После ревью архивировать change через `/opsx:archive`.
