# Решено (sober)

Мобильное приложение для отказа от алкоголя, Android-first. Продуктовая спека: [docs/idea.md](docs/idea.md), ресерч конкурентов: [docs/competitors.md](docs/competitors.md).

Статус: развернут пустой Expo-проект с заглушкой экрана, фич пока нет.

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
- `docs/` - спека и ресерч.
- `android/` и `ios/` не коммитим, их генерирует `expo prebuild` (CNG). Нативные настройки задаются только через `app.json` и config plugins.

## Expo

- API Expo меняется от SDK к SDK. Перед работой с API сверяйся с доками своей версии: https://docs.expo.dev/versions/v57.0.0/ и https://docs.expo.dev/llms.txt.
- В Expo Go есть только встроенные нативные модули. Как только появится пакет со своим нативным кодом (виджет, например), нужен development build: `npx expo run:android` (нужны JDK и Android SDK, сейчас не установлены) или `eas build --profile development`.

## Конвенции

- Все записи в БД с `id` (uuid), `createdAt`, `updatedAt`, удаление мягкое через `deletedAt`, чтобы потом добавить синхронизацию.
- Стрик, экономию и ачивки вычисляем, а не храним.
- Варианты ответов (чек-ин, причины, напитки) хранятся в коде ключами, тексты лежат в i18n.
- Тесты только на чистую логику: стрик, деньги, калории, условия ачивок.
- Аналитики и сетевых запросов нет. Данные пользователя не покидают устройство, кроме Android Auto Backup и ручного экспорта.
- Комментарии в коде на русском. Коммиты в формате Conventional Commits.
