# Tasks

## 1. Шрифт и зависимости

- [x] 1.1 `npx expo install @expo-google-fonts/manrope` без прямого `expo-font` и без плагина в `app.json`; `yarn doctor` и `yarn lint:unused` чистые
- [x] 1.2 В `src/app/_layout.tsx` грузить Manrope 400/500/600/700 через `useFonts`, до загрузки рендерить `null`; проверить на dev build, что приложение стартует и текст в шапке сменил шрифт

## 2. Токены и тема

- [x] 2.1 `src/shared/ui/theme.ts`: палитра `{ light, dark }` по таблице из design.md, `useColors()` (светлая при `null`), `navigationTheme(scheme)` с `fonts` на Manrope, экспорт из `shared/ui/index.ts`; `yarn typecheck` проходит
- [x] 2.2 Корневой layout: `ThemeProvider` с `navigationTheme`, `headerShadowVisible: false` в `screenOptions` стека, `SystemUI.setBackgroundColorAsync(background)` при смене схемы; проверить на устройстве, что шапки и фон в обеих темах из палитры
- [x] 2.3 Таб-бар в `src/app/(tabs)/_layout.tsx`: фон `card`, верхняя рамка `border`, активный `text`, неактивный `muted`, шестеренка `muted`; layout онбординга без своих цветов, только тема; проверить визуально в обеих темах

## 3. Базовые компоненты

- [x] 3.1 `Text`: семейство по варианту и проп `weight`, `hint` цветом `muted`, цвета из `useColors()`; убрать `fontWeight` из `StreakSummary` в пользу `weight`; `grep -rn fontWeight src` пуст
- [x] 3.2 `Button` (`primary`/`secondary`/`quiet`, `disabled`, `style`) и `Card` в `shared/ui`, экспорт из `index.ts`; проверить все три вида и `disabled` в обеих темах (временно на любом экране или через dev-блок, без коммита)
- [x] 3.3 `Switch` в `shared/ui` с цветами из токенов; `Input` и `Chip` на `useColors()` и токены по design.md; `yarn typecheck` проходит
- [x] 3.4 `no-restricted-imports` в `eslint.config.js` на `Button` и `Switch` из `react-native` (исключение - `shared/ui/Switch.tsx`); `yarn lint` показывает все оставшиеся места использования

## 4. Перевод экранов

- [x] 4.1 `shared/ui` (`AddField`, `DateTimeField`, `TimeField`) на свой `Button` по таблице видов из design.md; поля дат и добавление работают в онбординге и настройках
- [x] 4.2 "Сегодня": `TodayPage`, `DayReviewButton`, `Savings`, `PartyCard` (вид кнопок по таблице, `PartyCard` на `Card`, пары кнопок с `flex: 1`); удалить `pages/today/ui/colors.ts`; проверить "Сегодня" без вечеринки и с идущей
- [x] 4.3 "Прогресс": `statusColor.ts` и `ReviewDot` на токены (`sober`, `relapse`, `border`, `text`), `MonthNav` на второстепенные кнопки "‹" "›"; проверить календарь и легенду: срыв охристый, не красный
- [x] 4.4 Онбординг (все 8 страниц): "Далее"/"Начать" главная, "Пропустить" тихая, `Switch` в `ScreeningPage` свой; пройти онбординг после dev-сброса
- [x] 4.5 Остальные страницы и фичи: `DayReviewPage`, `RelapsePage`, `ReasonsPage`, `RepliesSection`, `SpendingForm`, `DeleteRelapseButton`, `NotificationForm`, `AutostartHint`, `NotificationsSection`, `DevResetButton`, `DevNotificationDebug`; `yarn lint` без нарушений `no-restricted-imports`, `grep -rn "useTheme" src` пуст

## 5. Документация и проверка

- [x] 5.1 `CLAUDE.md`: Manrope и `@expo-google-fonts/manrope` в стеке, `theme.ts`/`useColors`, `Button`/`Card`/`Switch` в списке `shared/ui`, правило видов кнопок и запрет RN `Button`/`Switch`, тема в `_layout.tsx`; убрать "стилизации нет" из статуса
- [x] 5.2 Пройти все экраны (Сегодня с вечеринкой и без, Прогресс, Причины, Настройки, Режим компании, Итоги дня, Срыв, онбординг) в светлой и темной теме на устройстве; подправить темную палитру в `theme.ts`, если что-то не читается
- [x] 5.3 `yarn test`, `yarn typecheck`, `yarn lint`, `yarn lint:unused` проходят
