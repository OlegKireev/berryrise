# Tasks

## 1. Нативный модуль (нативное изменение, нужна пересборка)

- [x] 1.1 Создать `modules/autostart` по образцу `modules/icon-shape`: `expo-module.config.json` (только android) и `AutostartModule.kt` с функцией `enabled(): Boolean?` (рефлексия на `AppOpsManager.checkOpNoThrow`, операция `10008`, `Process.myUid()`, имя пакета; `MODE_ALLOWED` -> `true`, `MODE_IGNORED`/`MODE_ERRORED` -> `false`, другое и исключение -> `null`). Проверка: `npx expo-modules-autolinking search` (или `expo prebuild --clean` в черновике) видит модуль.
- [x] 1.2 Собрать и поставить dev build на телефон (`yarn build:local:dev`, `yarn install:dev`). Временным `__DEV__`-логом или из консоли metro проверить, что `enabled()` дает `true` при включенном автозапуске и `false` после выключения (переключать в системных настройках или `adb shell appops set com.berryrise.app.dev 10008 ignore|allow`). Если из приложения значение не читается, остановиться и вернуться к design.md.

## 2. Состояние автозапуска в `features/notifications`

- [x] 2.1 В `model/autostart.ts` добавить `autostartEnabled(): boolean | null` (через `requireOptionalNativeModule('Autostart')`, вызов только для `xiaomi|redmi|poco`, иначе и при ошибке `null`) и превратить `needsAutostartHint` в функцию: прошивка из `AGGRESSIVE` и `autostartEnabled() !== true`. Обновить вызовы в `useNotificationsStep` и `NotificationsPage`. Проверка: `yarn typecheck`.
- [x] 2.2 В `pages/settings/model/useNotificationSettings.ts` держать `autostartHint` в state, пересчитывать на фокусе и на `AppState` `active` (подписка снимается при размонтировании); `NotificationsPage` рисует `AutostartHint` по `settings.autostartHint`. Проверка: на телефоне с выключенным автозапуском подсказка видна, после включения через кнопку подсказки и возврата в приложение пропадает без перезахода на экран.
- [x] 2.3 Проверить онбординг на телефоне: при включенном автозапуске после шага уведомлений сразу открывается "Сегодня", при выключенном - шаг про автозапуск (сценарии `onboarding`).
- [x] 2.4 Проверить на эмуляторе (`emulator-check`, Pixel): подсказки в настройках уведомлений нет, онбординг после уведомлений сразу открывает "Сегодня".
- [x] 2.5 Обновить `CLAUDE.md`: модуль `modules/autostart` рядом с описанием `icon-shape`, `needsAutostartHint()` - производитель плюс состояние автозапуска (операция AppOps 10008, `null` = неизвестно, подсказка видна), перечитывание на возврате в приложение. Проверка: описание совпадает с кодом.

## 3. Финальная проверка

- [x] 3.1 Собрать preview (`yarn build:local:preview`, `yarn install:preview`) и убедиться, что на нем подсказка тоже реагирует на автозапуск.
- [x] 3.2 Прогнать `yarn test`, `yarn typecheck` и `yarn lint`, все проходят.

## Workflow follow-up

- `/opsx:archive` после проверки на телефоне.
