# Tasks

## 1. Навигация и хаб настроек

- [x] 1.1 `Row` в `shared/ui` с необязательным `onPress`: строка `Pressable` на всю ширину со стрелкой `›` справа; без `onPress` выглядит как раньше (проверить на экране причин), `yarn typecheck` проходит
- [x] 1.2 `common.ts`: заголовки `startSpending`, `notifications`, `about` (ru и en), `reasons` -> "Мои причины" / "My reasons", `disclaimer` переезжает сюда из `pages/onboarding/i18n.ts`, `IntroPage` берет его из общего `t`; `yarn typecheck` проходит
- [x] 1.3 Страницы в `pages/settings`: `StartSpendingPage` (старт и `SpendingForm` из нынешней `SettingsPage`), `NotificationsPage` (бывшая `NotificationsSection`), `AboutPage` (название, `Constants.expoConfig?.version`, дисклеймер), `SettingsPage` как хаб из четырех `Row` с `onPress` и `DevResetButton` внизу; строки страницы в `pages/settings/i18n.ts` (ru и en), экспорт из `index.ts`
- [x] 1.4 Роуты: `src/app/settings.tsx` заменить папкой `src/app/settings/` (`index`, `start`, `reasons`, `notifications`, `about`), удалить `src/app/(tabs)/reasons.tsx` и его `Tabs.Screen`, в корневом `Stack` заголовки для `settings/*`; ссылку "Укажи траты" в `Savings` на `/settings/start`; проверить на телефоне сценарии `app-navigation` и `settings` (хаб, "назад" в хаб после сохранения трат, "О приложении"), `yarn lint:unused` чистый
- [x] 1.5 Тексты `pages/reasons` поправить под экран в настройках, если там есть слова про таб; проверить сценарии требования "Список причин в настройках"

## 2. Цвет дня в сущности

- [x] 2.1 `useStatusColor` и `Status` переезжают в `entities/habit/ui/dayColor.ts` как `useDayColor` и `DayStatus`, экспорт из `entities/habit/index.ts`; `Calendar`, `DayCell`, `Legend`, `useCalendar` берут их оттуда, `statusColor.ts` удален; календарь на "Прогрессе" в тех же цветах, `yarn lint:circular` и `yarn lint:unused` чистые

## 3. "Сегодня"

- [x] 3.1 `pages/today/model/week.ts`: `lastWeek(days, now)` - 7 записей `{ date, status }` от шести дней назад до сегодня, `null` для дней без записи; тест `week.test.ts` (неделя без срывов, срыв позавчера, старт вчера, переход на летнее время), `yarn test` проходит
- [x] 3.2 `WeekStrip` в `pages/today/ui`: клетки цветом `useDayColor`, подписи из `weekdays`, данные из `useToday` через `lastWeek`; проверить на телефоне сценарии требования "Полоска последних 7 дней"
- [x] 3.3 `entities/reason/model/reasonOfDay.ts`: `reasonOfDay(list, day)` по номеру локального дня по модулю длины, `null` для пустого списка, экспорт из `index.ts`; тест рядом (одна причина, три причины в соседние дни по кругу, пустой список), `yarn test` проходит
- [x] 3.4 `useToday` грузит `listReasons` при фокусе и отдает причину дня; `ReasonOfDay` в `pages/today/ui`: `Card` с `reasonLabel` и тапом на `/settings/reasons`, без причин тихая `Button` с приглашением; строки в `pages/today/i18n.ts` (ru и en); проверить сценарии требований "Причина дня" и "Нет причин на "Сегодня""
- [x] 3.5 `TodayPage` в порядке спеки `today-screen`: счетчик, `WeekStrip`, `Savings`, `ReasonOfDay`, итоги дня, "Иду в компанию" / `PartyCard`, внизу "Был срыв"; проверить сценарии требования "Порядок блоков"

## 4. Оформление по макету

- [x] 4.1 Форматтеры `dayWord`, `formatDate`, `formatNumber` в `shared/i18n`, дни недели с заглавной; `StreakSummary` - число, "дней без алкоголя", дата серии без времени; проверить склонение 1/3/5 на телефоне
- [x] 4.2 `WeekStrip` кружками: сегодня пунктир или цвет срыва, дни до старта пустые; карточки `Savings` и `ReasonOfDay` ("Я решил, потому что"), `DayReviewButton` шалфейной плашкой с датой и "заполнить"/"заполнено"; строки ru и en в `pages/today/i18n.ts`
- [x] 4.3 `StreakStats` (лучший и всего) над календарем на "Прогрессе", строки в `pages/progress/i18n.ts`
- [x] 4.4 Шапка табов с крупным заголовком слева, `TabLabel` с полоской у активного, `Button` крупнее; `fonts` экспортирован из `shared/ui`
- [x] 4.5 Сверить на телефоне с макетом в светлой и темной теме: "Сегодня", "Прогресс", таб-бар, сценарии `sobriety-streak` и полоски из `today-screen`

## 5. Общий кружок дня

- [x] 5.1 `DayCircle` в `entities/habit/ui` (подпись, статус, `today` пунктиром, `size`, `dot`), экспорт из `index.ts`; `WeekStrip` и `DayCell` на нем, в календаре передается сегодняшний день, кружок легенды круглый; `yarn typecheck`, `yarn lint`, `yarn lint:unused` проходят
- [x] 5.2 Проверить на эмуляторе в обеих темах: календарь кружками, сегодня пунктиром и цветом срыва после срыва, точка итогов дня видна на закрашенном и незакрашенном кружке

## 6. Документация и проверка

- [x] 6.1 `CLAUDE.md`: статус (два таба, хаб настроек, причина дня, полоска), навигация и роуты `settings/*`, страницы `pages/settings`, `useDayColor` в `entities/habit`, `reasonOfDay` и `lastWeek` в списке чистой логики с тестами; в `docs/idea.md` ничего не менять
- [x] 6.2 `yarn test`, `yarn typecheck` и `yarn lint` проходят

## Workflow follow-up

- После проверки на телефоне архивировать change (`/opsx:archive`), следом `day-card`.
