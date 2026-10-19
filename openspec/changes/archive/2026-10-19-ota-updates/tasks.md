# Tasks

## 1. Нативная часть (одной пачкой, потом одна пересборка)

- [x] 1.1 `npx expo install expo-updates` (при YN0016 - предыдущий патч через `yarn add`). Проверка: пакет в `package.json`, `yarn doctor` без новых ошибок, кроме ожидаемого patch mismatch
- [x] 1.2 В `app.json`: `runtimeVersion: { "policy": "fingerprint" }`, `updates.url` проекта EAS (`https://u.expo.dev/<projectId>`), `checkAutomatically: "ON_LOAD"`, `fallbackToCacheTimeout: 0`. В `app.config.ts` при `isDev` - `updates: { ...config.updates, enabled: false }`. Проверка: `npx expo config --type public` показывает поля для обычной сборки и `enabled: false` при `APP_VARIANT=development`
- [x] 1.3 Каналы в `eas.json`: `preview.channel: "preview"`, новый профиль `production` (`channel: "production"`, `android.buildType: "app-bundle"`, `env` как у preview с `TODO(release)`). Создать каналы и ветки в EAS (`yarn eas channel:create` или первой публикацией). Проверка: `yarn eas channel:list` показывает `preview` и `production`
- [x] 1.4 ~~Подпись~~ (снята: code signing в EAS только на платном тарифе, `certs/` и `keys/` удалены, поля убраны из `app.json`): `npx expo-updates codesigning:generate` (ключ в `keys/`, сертификат в `certs/`, срок по умолчанию), `codesigning:configure` пишет `codeSigningCertificate` и `codeSigningMetadata` в `app.json`. В `.gitignore`: `keys/` и исключение `!certs/certificate.pem` после `*.pem`. Проверка: `git status` показывает сертификат и не показывает ключ
- [x] 1.5 ~~Сохранить ключ~~ (ключ больше не нужен). Вместо этого: попросить пользователя включить 2FA на аккаунте Expo. Проверка: пользователь подтвердил

## 2. Код

- [x] 2.1 Тег `updates` в `LogTag` (`src/shared/lib/logEntries.ts`)
- [x] 2.2 `src/shared/lib/updates.ts`: `logUpdateLaunch()` (id текущего бандла или "встроенный" при `isEmbeddedLaunch`, пометка `isEmergencyLaunch`; сравнение с `Paths.document/update-id`, при отличии `log('updates', ...)` и запись нового id; ошибки не бросает) и `currentUpdate()` (`null` для встроенного, иначе первые 8 символов `updateId` и `createdAt`). Экспорт через `index.ts`, вызов `logUpdateLaunch()` в корневом `index.ts` после `trimLog()`. Проверка: `yarn lint:unused` и `yarn lint:circular` чистые
- [x] 2.3 `AboutPage`: при `currentUpdate()` рядом с версией строка с id и датой через `formatDate`, подпись `update` в ru и en в `src/pages/settings/i18n.ts`. Проверка: в dev-сборке (встроенного обновления нет) строка версии прежняя
- [x] 2.4 В `migrate` (`src/shared/db/migrations.ts`) комментарий: версия выше известной - штатный случай после отката OTA, срез пустой, миграции не применяются. Проверка чтением: `migrations.slice(user_version)` при `user_version > length` пустой, ошибки нет

## 3. Скрипты и документация

- [x] 3.1 Скрипты в `package.json`: `update:preview` (`yarn dlx eas-cli update --channel preview --input-dir .expo/update`, сообщение через `-m`) и `update:promote` (`eas update:republish` из канала `preview` в `production`). Флаги сверить с актуальной докой eas-cli. Проверка: `yarn update:preview --help` и `yarn eas update:republish --help` принимают флаги
- [x] 3.2 README: раздел про OTA - что можно и нельзя доставлять обновлением, публикация в preview, проверка на телефоне, промоут в production, откат через republish предыдущей группы, где ключ
- [x] 3.3 CLAUDE.md: `expo-updates` в стеке (fingerprint, каналы, подпись, dev без OTA), новые скрипты в "Командах", `shared/lib/updates.ts` в структуре, правило аддитивных миграций (новая колонка `NULL` или с default, без удаления и переименования), "Аналитики и сетевых запросов нет" заменить на "единственный запрос - проверка обновления, без данных пользователя". То же в `context` `openspec/config.yaml`
- [x] 3.4 Пометка `TODO(release)` (в `eas.json` у `production`): политика приватности для Play упоминает запрос обновлений

## 4. Проверка

- [x] 4.1 Пересобрать `yarn build:local:preview`, поставить `yarn install:preview`. Опубликовать тестовое обновление `yarn update:preview`, открыть приложение дважды. Проверка: в "О приложении" id и дата обновления, в журнале одна запись `updates`, после третьего запуска новой записи нет
- [x] 4.2 Пересобрать `yarn build:local:dev`, поставить `yarn install:dev`, убедиться, что dev-сборка работает с dev-сервером как раньше
- [x] 4.3 Прогнать `yarn test`, `yarn typecheck` и `yarn lint`, все зеленые
