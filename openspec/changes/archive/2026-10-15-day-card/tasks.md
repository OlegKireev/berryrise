# Tasks

## 1. Нативная зависимость

- [x] 1.1 `npx expo install react-native-svg` (при YN0016 - предыдущий патч через `yarn add`), в `CLAUDE.md` в стеке строка про `react-native-svg` (медали, дальше графики инфографики); `yarn doctor` без новых ошибок, кроме ожидаемого patch mismatch
- [x] 1.2 Пересобрать dev build (`yarn build:local:dev`, `yarn install:dev`; эмулятор - `emulator-check up`), приложение стартует

## 2. Данные за день

- [x] 2.1 `shared/lib/utils/dayRange.ts`: `dayRange(date)` -> `[from, to)` epoch ms локального дня, экспорт из `shared/lib`; тест рядом (обычный день, день перехода на летнее и зимнее время в `Europe/Berlin`), `useDayReview` берет границы из нее; `yarn test` проходит
- [x] 2.2 `entities/relapse`: `listRelapsesBetween(db, from, to)` - полные строки неудаленных срывов в `[from, to)` по возрастанию `at`, экспорт из `index.ts`; `yarn typecheck` проходит
- [x] 2.3 `entities/party`: `getPartyOn(db, from, to)` - последняя неудаленная вечеринка с началом в `[from, to)` или `null`, экспорт из `index.ts`; `yarn typecheck` проходит

## 3. Медаль

- [x] 3.1 Токены цветов медалей (бронза, серебро, золото, ситуационная) в `shared/ui/theme.ts` для `light` и `dark`
- [x] 3.2 `entities/habit/ui/Medal.tsx`: SVG-диск с ободком и лентами, цвет по уровню достижения, неполученная в цветах рамки, короткая надпись нашим `Text` поверх; короткие надписи `medal.<key>` в `entities/habit/i18n.ts` (ru и en); экспорт из `index.ts`; посмотреть все 16 медалей полученными и нет в светлой и темной теме (временный `__DEV__`-блок или экран всех достижений из группы 5)

## 4. Карточка дня и выбор дня

- [x] 4.1 `useProgress`: состояние `selected` (по умолчанию сегодня) и `select`; `Calendar` и `DayCell` получают `selected` и `onSelect`, `DayCell` - `Pressable` только для дат от дня старта по сегодня, выбранный обведен рамкой вокруг `DayCircle`; проверить сценарии требования "Тап по дню" (в том числе листание месяца)
- [x] 4.2 `pages/progress/model/useDayCard.ts`: срывы, вечеринка и итоги дня за `date` через `dayRange`, перечитывает при смене даты и на фокусе, отдает `reload`; `yarn typecheck` проходит
- [x] 4.3 `DayCard` и секции `DayRelapse` (время, непустой разбор, `DeleteRelapseButton`), `DayParty`, `DayReviewSummary` (ответы, "заполнить"/"изменить" на `/day-review` с `params: { day }`), медали дня из `got`; строки в `pages/progress/i18n.ts` (ru и en); проверить сценарии требований "Карточка дня", "Срыв в карточке дня", "Вечеринка в карточке дня", "Итоги дня в карточке дня" и "Из карточки дня" в `day-review`
- [x] 4.4 Удаление срыва из карточки: карточка перечитывается и зовет `reload` из `useProgress`; удалить `Relapses.tsx` и строки `relapses`/`noRelapses`; проверить сценарии "Удаление срыва" и "Удален срыв" (день в календаре трезвый, стрик пересчитан), `yarn lint:unused` чистый

## 5. Достижения медалями

- [x] 5.1 `pages/progress/model/medals.ts`: `pickMedals(got, n = 3)` - полученные по убыванию даты, при равной дате обратный порядок `achievementKeys`, добивка первыми неполученными; тест `medals.test.ts` по сценариям требования "Короткий блок достижений" (больше трех, ноль, одна), `yarn test` проходит
- [x] 5.2 `Achievements.tsx` переписать в короткий блок: заголовок, "N из M", ссылка "Все", три медали с названием и датой; строки в `pages/progress/i18n.ts` (ru и en)
- [x] 5.3 `AchievementsPage` в `pages/progress` (данные из `useProgress`, сетка по 3: медаль, название, дата), экспорт из `index.ts`, роут `src/app/achievements.tsx`, заголовок в `common.ts` (ru и en) и `Stack.Screen` в корневом layout; проверить сценарии "Список достижений" и "Переход ко всем"

## 6. Документация и проверка

- [x] 6.1 `CLAUDE.md`: статус (карточка дня и медали есть, списка срывов нет), структура "Прогресса" (выбор дня, `DayCard` и `useDayCard`, `AchievementsPage`, роут `achievements`), `Medal` в `habit/ui`, `dayRange` в утилитах, новые файлы в списке тестов с относительными импортами
- [x] 6.2 Пройти "Прогресс" на эмуляторе (`emulator-check`) в светлой и темной теме, ru и en: карточка дня с срывом, вечеринкой и итогами, медали; посмотреть, видна ли карточка без прокрутки, и записать вывод для решения про модалку
- [x] 6.3 `yarn test`, `yarn typecheck`, `yarn lint`, `yarn lint:unused`, `yarn lint:circular` проходят

## 7. Карточка дня в модалке

- [x] 7.1 Убрать выбор дня: `selected`/`select` из `useProgress`, рамку из `DayCell`; `Calendar` получает `onOpen`, тап делает `router.push` на `/day/<date>`; `DayCard` уходит из `ProgressPage`
- [x] 7.2 `DayPage` в `pages/progress` (дата из параметров заголовком через `Stack.Screen`, `DayCard` с `got`, днем старта и сегодня из `useProgress`), `DayCard` без `Card` и без даты; роут `src/app/day/[date].tsx`, `Stack.Screen` с `presentation: 'modal'` в корневом layout; `CLAUDE.md` (навигация, структура "Прогресса")
- [x] 7.3 Проверить на эмуляторе сценарии "Тап по дню" (в том числе возврат после удаления срыва в прошлом месяце) и "Карточка дня", итоги за прошлый день из модалки; `yarn test`, `yarn typecheck`, `yarn lint`, `yarn lint:unused`, `yarn lint:circular` проходят

## 8. Листание дней в модалке

- [x] 8.1 `MonthNav` -> `PeriodNav` с подписью и подписями стрелок для доступности, календарь передает месяц; `CLAUDE.md` про `PeriodNav`
- [x] 8.2 `DayPage`: заголовок шапки "День" (`common.ts`, ru и en), сверху `PeriodNav` с датой, стрелки `router.setParams` на соседний день через `dayRange` в границах старта и сегодня; `useDayCard` держит прежний день до загрузки нового, `DayCard` берет дату из загруженных данных; строки стрелок в `pages/progress/i18n.ts`
- [x] 8.3 Проверить на эмуляторе сценарии "Листание дней в карточке дня" (границы, закрытие одним "назад"); `yarn test`, `yarn typecheck`, `yarn lint`, `yarn lint:unused`, `yarn lint:circular` проходят

## Workflow follow-up

- Архивировать change через `/opsx:archive`.
