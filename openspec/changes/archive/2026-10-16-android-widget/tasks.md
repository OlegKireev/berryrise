# Tasks

## 1. Зависимость и нативная часть

- [x] 1.1 `npx expo install react-native-android-widget`, проверить, что пакет в `package.json` и `yarn doctor` не ругается на него
- [x] 1.2 `assets/src/widget-preview.svg` (квадрат с числом в светлой палитре), добавить его в скрипт `yarn icons`; проверить, что `yarn icons` создает `assets/widget-preview.png`
- [x] 1.3 Плагин `react-native-android-widget` в `app.json`: виджет `Streak` 1x1, `updatePeriodMillis: 1800000`, превью, описание "Счетчик дней", шрифт Manrope Bold; проверить через `npx expo config --type prebuild`, что плагин подхватился
- [x] 1.4 Пересобрать dev build на эмуляторе (`emulator-check up`) и убедиться, что виджет "Морс" есть в списке виджетов лаунчера

## 2. Слайс `features/widget`

- [x] 2.1 `ui/StreakWidget.tsx`: число по центру, кегль по числу цифр, фон и цвет числа из токенов `theme.ts` для light и dark, радиус 10, `OPEN_APP`, описание для TalkBack через `dayWord`; проверить `yarn typecheck`
- [x] 2.2 `model/updateWidget.tsx`: `widgetTree(db)` (стрик из `getHabit` и `listRelapses`, без привычки 0) и `updateWidget(db)` через `requestWidgetUpdate` с перехватом ошибок; `index.ts` слайса; проверить `yarn typecheck`
- [x] 2.3 `model/updateWidget.tsx` (`widgetTaskHandler`): на `WIDGET_ADDED`/`WIDGET_UPDATE`/`WIDGET_RESIZED` открыть `berryrise.db` и отрендерить `widgetTree`; проверить `yarn typecheck`
- [x] 2.4 `model/useWidget.ts`: обновление на монтировании и при `AppState` -> `background`, подключить в корневом `_layout.tsx` внутри `SQLiteProvider`; проверить `yarn typecheck`

## 3. Точка входа

- [x] 3.1 `index.ts` в корне: `registerWidgetTaskHandler(widgetTaskHandler)` и `import 'expo-router/entry'`, `main` в `package.json` на него; проверить, что приложение стартует на эмуляторе и `yarn lint:unused` чист (при необходимости добавить вход в `knip.json`)

## 4. Проверка на эмуляторе

- [x] 4.1 Добавить виджет на рабочий стол: сразу показывает текущий стрик; скриншоты в светлой и темной теме, тема меняется без открытия приложения
- [x] 4.2 Через `seed` задать стрики 7, 365 и 1024: числа целиком в одну строку, однозначное крупнее трехзначного; повторить 365 с максимальным системным шрифтом и при необходимости поправить кегли
- [x] 4.3 Отметить срыв, свернуть приложение: виджет показывает 0; удалить срыв на "Прогрессе", свернуть: стрик вернулся
- [x] 4.4 Сдвинуть время эмулятора за полночь при закрытом приложении: виджет сменил число не позже чем через 30 минут (или вызвать обновление через `adb shell am broadcast` с `APPWIDGET_UPDATE`)
- [x] 4.5 Тап по виджету открывает приложение; до прохождения онбординга виджет показывает 0

## 5. Документация и финальные проверки

- [x] 5.1 Обновить `CLAUDE.md` (статус, стек, `features/widget`, точка входа `index.ts`, превью в `yarn icons`) и раздел "Виджет" в `docs/idea.md` (только число, обновление раз в 30 минут); README, если менялись шаги сборки
- [x] 5.2 Прогнать `yarn test`, `yarn typecheck` и `yarn lint`, все зеленые

## 6. Два вида, квадрат и форма иконок

- [x] 6.1 Локальный модуль `modules/icon-shape` (Kotlin `mask()` из `config_icon_mask`, `null` если нет) и JS-обертка с кэшем; проверить `yarn typecheck`, `yarn lint:unused`
- [x] 6.2 Второй виджет `StreakInk` ("Счетчик дней, темный") в `app.json` и его превью `assets/src/widget-preview-ink.svg` в `yarn icons`; проверить `npx expo config --type prebuild`
- [x] 6.3 `StreakWidget`: проп `variant`, квадрат `size` по центру прозрачной ячейки, фон `SvgWidget` по маске (рамка у карточки, свечение у чернил), ягодная черта у карточки, кегль от `size`; `widgetTree` по `widgetName` и размеру, `updateWidget` для обоих имен; проверить `yarn typecheck`
- [x] 6.4 Пересобрать dev build, на эмуляторе: в пикере оба вида, карточка первой; оба квадратные и круглые (как иконки Pixel); 7, 365 и 1024 влезают в круг; карточка меняет тему, чернила нет; обновление при уходе в фон работает для обоих
- [x] 6.5 Обновить `CLAUDE.md` (модуль `modules/icon-shape`, два вида, исключение для цветов виджета) и `docs/idea.md`; прогнать `yarn test`, `yarn typecheck` и `yarn lint`

## Workflow follow-up

- Архивировать изменение через `/opsx:archive` после проверки на телефоне.
