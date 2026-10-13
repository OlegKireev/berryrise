# Решено (sober)

Мобильное приложение для отказа от алкоголя, Android-first. Продуктовая спека: [docs/idea.md](docs/idea.md), ресерч конкурентов: [docs/competitors.md](docs/competitors.md).

Статус: есть каркас навигации с экранами-заглушками и локальная база со схемой MVP, фич пока нет.

## Стек

- TypeScript, Expo SDK 57 (React Native 0.86, React 19), expo-router.
- `expo-sqlite`, без ORM. Миграции через `PRAGMA user_version`.
- `expo-notifications` для локальных напоминаний с кнопками действий (categories).
- `react-native-android-widget` для виджета 1x1. iOS-виджета пока нет.
- Отдельного стейт-менеджера нет: хватает React и запросов к SQLite. Добавляем только если без него станет больно.
- i18n с первого дня: ru основной, en сразу рядом.
- Сборка через EAS (бесплатный тариф) или локально. Bundle id `dev.olegkireev.quit`.

## Команды

Пакетный менеджер yarn 4 (`nodeLinker: node-modules`).

```bash
yarn install
yarn start              # dev-сервер, на телефоне открыть в Expo Go по QR
yarn android            # dev-сервер и запуск на подключенном Android
yarn typecheck          # tsc --noEmit
yarn lint               # expo lint
yarn doctor             # expo-doctor
yarn audit              # уязвимости зависимостей
npx expo install <pkg>  # добавлять пакеты только так: подбирает версию под SDK
```

В yarn включен `npmMinimalAgeGate` (24 часа): версии моложе суток в карантине. Если `expo install` падает с YN0016, ставь через `yarn add` предыдущий патч. Тогда expo-doctor будет ругаться на patch mismatch, это ожидаемо, через сутки поправит `npx expo install --fix`.

Перед тем как считать задачу сделанной, прогоняй `yarn typecheck` и `yarn lint`.

## Структура

- `src/app/` - только роуты expo-router: каждый файл это экран, `_layout.tsx` задает навигатор. Остальной код (компоненты, логика, БД) держим вне `src/app/`.
- Навигация: корневой `Stack` в `src/app/_layout.tsx`, внутри группа `(tabs)` с табами "Сегодня" (`index`), "Прогресс", "Причины". Шестеренка в шапке табов ведет на `settings`. Отдельные экраны стека: `settings`, `company` (режим "иду в компанию"), `checkin` и `relapse` (модалки). Тема по системе через `ThemeProvider` (`DarkTheme`/`DefaultTheme`), цвета берем из `useTheme()`.
- `src/db/` - SQLite: `migrations.ts` (миграции по `PRAGMA user_version`, запускаются в `onInit` у `SQLiteProvider` в корневом layout), `types.ts` (типы строк), `keys.ts` (ключи готовых вариантов), `records.ts` (`newRow()` для служебных полей, `deleteRelapse`). В компонентах база берется через `useSQLiteContext()`. Схема и решения по ней: спека `local-data` в `openspec/specs/`.
- `src/i18n.ts` - словари ru/en и `t(key)`. Язык определяется через `Intl` при старте.
- `src/components/` - общие компоненты.
- `docs/` - спека и ресерч.
- `openspec/` - спеки OpenSpec: `specs/` описывает текущее поведение, `changes/` - изменения в работе, `config.yaml` - контекст и правила для артефактов. Слэш-команды и скиллы OpenSpec лежат в `.claude/`, их генерирует `openspec init`/`openspec update`, руками не правим.
- `android/` и `ios/` не коммитим, их генерирует `expo prebuild` (CNG). Нативные настройки задаются только через `app.json` и config plugins.

## Expo

- API Expo меняется от SDK к SDK. Перед работой с API сверяйся с доками своей версии: https://docs.expo.dev/versions/v57.0.0/ и https://docs.expo.dev/llms.txt.
- В Expo Go есть только встроенные нативные модули. Как только появится пакет со своим нативным кодом (виджет, например), нужен development build: `npx expo run:android` (нужны JDK и Android SDK, сейчас не установлены) или `eas build --profile development`.

## Процесс (OpenSpec)

Фичи и заметные изменения поведения идут через OpenSpec: `/opsx:explore` (по желанию обсудить идею) → `/opsx:propose <имя>` (proposal, delta-спеки, design, tasks в `openspec/changes/<имя>/`) → `/opsx:apply` → `/opsx:archive` (delta вливается в `openspec/specs/`). Мелкие правки, багфиксы и рефакторинг без изменения поведения делаем напрямую. Темы для изменений берем из `docs/idea.md`.

CLI ставится глобально (`npm i -g @fission-ai/openspec`), телеметрия отключена через `openspec config set telemetry.enabled false` (настройка машины, не репозитория). После обновления CLI запускать `openspec update`, чтобы обновить файлы в `.claude/`.

## Конвенции

- Все записи в БД с `id` (uuid), `createdAt`, `updatedAt`, удаление мягкое через `deletedAt`, чтобы потом добавить синхронизацию.
- Стрик, экономию и ачивки вычисляем, а не храним.
- Варианты ответов (чек-ин, причины, напитки) хранятся в коде ключами, тексты лежат в i18n.
- Тесты только на чистую логику: стрик, деньги, калории, условия ачивок.
- Аналитики и сетевых запросов нет. Данные пользователя не покидают устройство, кроме Android Auto Backup и ручного экспорта.
- Комментарии в коде на русском. Коммиты в формате Conventional Commits.
