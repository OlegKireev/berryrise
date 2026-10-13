# Решено (sober)

Мобильное приложение для отказа от алкоголя, Android-first. Продуктовая спека: [docs/idea.md](docs/idea.md), ресерч конкурентов: [docs/competitors.md](docs/competitors.md).

Статус: есть онбординг (дисклеймер, скрининг, старт, причины), счетчик трезвых дней на "Сегодня", вечерний чек-ин, модалка срыва и история срывов на "Прогресс", таб "Причины". Остальные экраны пока заглушки, стилизации нет.

## Стек

- TypeScript, Expo SDK 57 (React Native 0.86, React 19), expo-router.
- `expo-sqlite`, без ORM. Миграции через `PRAGMA user_version`.
- `@react-native-community/datetimepicker` для выбора даты и времени (есть в Expo Go). На Android открываем императивно через `DateTimePickerAndroid.open`.
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
yarn test               # тесты чистой логики на node:test (TZ=Europe/Berlin, чтобы ловить переход на летнее время)
yarn lint               # expo lint
yarn doctor             # expo-doctor
yarn audit              # уязвимости зависимостей
npx expo install <pkg>  # добавлять пакеты только так: подбирает версию под SDK
```

В yarn включен `npmMinimalAgeGate` (24 часа): версии моложе суток в карантине. Если `expo install` падает с YN0016, ставь через `yarn add` предыдущий патч. Тогда expo-doctor будет ругаться на patch mismatch, это ожидаемо, через сутки поправит `npx expo install --fix`.

Перед тем как считать задачу сделанной, прогоняй `yarn test`, `yarn typecheck` и `yarn lint`.

## Структура

Код в `src/` разложен по [Feature-Sliced Design](https://feature-sliced.design/). Слои сверху вниз: `app` → `pages` → `features` → `entities` → `shared`. Слой импортирует только слои ниже себя, слайсы одного слоя друг друга не импортируют. Снаружи слайса импортируем только его `index.ts`, без глубоких путей. Алиас `@/` указывает на `src/` (`paths` в `tsconfig.json`, Metro подхватывает сам).

- `src/app/` - роуты expo-router, он же FSD-слой `app`. Каждый роут - одна строка `export { XPage as default } from '@/pages/x'`. В `_layout.tsx` лежат навигаторы и провайдеры (`SQLiteProvider` с `onInit={migrate}`, `ThemeProvider`).
- Навигация: корневой `Stack`, внутри группа `(tabs)` с табами "Сегодня" (`index`), "Прогресс", "Причины". Шестеренка в шапке табов ведет на `settings`. Отдельные экраны стека: `settings`, `company` (режим "иду в компанию"), `check-in` и `relapse` (модалки). Онбординг - группа `onboarding/` со своим `Stack` (`index` дисклеймер, `screening`, `warning`, `start`, `reasons`). Онбординг пройден = в `habit` есть строка: она создается на шаге `start`, а layout табов без нее делает `Redirect` на `/onboarding`. Шаги после `start` необязательные, их стек сбрасывается через `dismissAll`, чтобы "назад" не вернул на старт. Тема по системе, цвета берем из `useTheme()`.
- `src/pages/<экран>/` - экраны: `ui/<Name>Page.tsx` и `index.ts`. В `onboarding` пять страниц.
- `src/features/` - действия пользователя, которые затрагивают несколько сущностей. Сейчас там `delete-relapse`: мягкое удаление срыва и сброс результата связанной вечеринки в одной транзакции, плюс кнопка с подтверждением.
- `src/entities/<сущность>/` - по слайсу на таблицу. В `model/types.ts` тип строки и ключи вариантов, которые нужны только этой сущности. В `api/` запросы к SQLite, они принимают `db` из `useSQLiteContext()`. SQL пишем только в `api/` сущностей и в `features`, в страницах его нет. В `habit` еще лежит `model/streak.ts` - чистая логика стрика (трезвый день - календарный день после дня старта без срывов), в `checkin` - `model/checkinDay.ts` (до 18:00 чек-ин за вчера, с 18:00 за сегодня, даты строками `YYYY-MM-DD`), тесты рядом. Подпись причины (готовой или своей) - `reasonLabel` в `reason`.
- `src/shared/db/` - инфраструктура базы: `migrations.ts` (вся схема целиком, миграции по `PRAGMA user_version`; по сущностям не делится, потому что порядок версий глобальный), `records.ts` (`newRow()`, типы `Row` и `Setting`), `reset.ts` (`resetDatabase` для dev-кнопки сброса в настройках, видна только при `__DEV__`). Схема и решения по ней: спека `local-data` в `openspec/specs/`.
- `src/shared/config/options.ts` - ключи готовых вариантов, общих для срыва и чек-ина (настроение, тяга, места, трудности, что помогло).
- `src/shared/i18n/` - словари `ru.ts`/`en.ts`, в `index.ts` функции `t(key)`, `days(n)`, `formatDateTime`, `formatDay` (короткая дата из `YYYY-MM-DD`). Язык определяется один раз при старте. Словари не делим по слайсам, чтобы `t` оставался строго типизированным.
- `src/shared/lib/utils/` - чистые утилиты без зависимостей, по файлу на функцию, тест рядом: `getLocale` (ru/en по локали системы), `pluralize(n, { one, few?, many }, locale)` (склонение руками, в Hermes нет `Intl.PluralRules`).
- `src/shared/ui/` - базовые компоненты: `Text` в цвет темы, `Screen`, `Chip`, `DateTimeField` (дата и время в границах), `Placeholder`.
- Тесты и код, который они импортируют (`streak.ts`, `checkinDay.ts`, `shared/lib/utils`), используют только относительные импорты с `.ts`: node алиас `@/` не разрешает.
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
- Тесты только на чистую логику: стрик, деньги, калории, условия ачивок. Раннер встроенный `node:test` без Jest: node 24 сам снимает типы, поэтому импорты в тестах с расширением `.ts` (`allowImportingTsExtensions`), а типы node подключаются в тестовом файле через `/// <reference types="node" />`.
- Аналитики и сетевых запросов нет. Данные пользователя не покидают устройство, кроме Android Auto Backup и ручного экспорта.
- Комментарии в коде на русском. Коммиты в формате Conventional Commits.
