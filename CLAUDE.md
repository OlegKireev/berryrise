# Решено (sober)

Мобильное приложение для отказа от алкоголя, Android-first. Продуктовая спека: [docs/idea.md](docs/idea.md), ресерч конкурентов: [docs/competitors.md](docs/competitors.md).

Статус: есть онбординг (дисклеймер, скрининг, старт, траты, причины, напоминания, подсказка про автозапуск), счетчик трезвых дней и блок "Сэкономлено" на "Сегодня", итоги дня (вечерний опрос), модалка срыва, на "Прогрессе" календарь месяца с тягой, ачивки и история срывов, таб "Причины", в настройках старт и траты, режим "иду в компанию" с карточкой "как прошло?" на "Сегодня", локальные уведомления (итоги дня, дни риска, "как прошло?") с разделом в настройках. Майлстоунов в уведомлениях, фразы дня, инфографики, виджета, экспорта и экстренных контактов пока нет. Визуальная база есть (палитра "Чернила", Manrope, свои кнопки), новой компоновки экранов из `docs/idea.md` (два таба, причина дня, хаб настроек) пока нет.

## Стек

- TypeScript, Expo SDK 57 (React Native 0.86, React 19), expo-router.
- `expo-sqlite`, без ORM. Миграции через `PRAGMA user_version`.
- `@react-native-community/datetimepicker` для выбора даты и времени. На Android открываем императивно через `DateTimePickerAndroid.open`.
- `expo-notifications` для локальных напоминаний с кнопками действий (categories), В Expo Go на Android не работает (падает уже на импорте), поэтому разработка идет в development build.
- Шрифт Manrope из `@expo-google-fonts/manrope`, грузится в рантайме через его `useFonts` (под капотом `expo-font` из `expo`). Прямой зависимости `expo-font` и его плагина в `app.json` нет: `npx expo install expo-font` дописывает плагин, а это нативное изменение.
- Заранее в сборке, чтобы не пересобирать ради них: `expo-sharing` (экспорт через "Поделиться"), `expo-contacts` (экстренные контакты из телефонной книги, `Contact.presentPicker`; в `app.json` только `READ_CONTACTS`, плагин не подключен, чтобы не тянуть `WRITE_CONTACTS`), `expo-haptics`. Пока не используются: `expo-contacts` и `expo-haptics` в `ignoreDependencies` в `knip.json`, убрать оттуда, когда появится код.
- `react-native-android-widget` для виджета 1x1. iOS-виджета пока нет.
- Отдельного стейт-менеджера нет: хватает React и запросов к SQLite. Добавляем только если без него станет больно.
- i18n с первого дня: ru основной, en сразу рядом.
- `expo-dev-client`: development build вместо Expo Go. Сборка через EAS (бесплатный тариф, профили в `eas.json`) или локально. Bundle id `dev.olegkireev.quit`.

## Команды

Пакетный менеджер yarn 4 (`nodeLinker: node-modules`).

```bash
yarn install
yarn start              # dev-сервер, на телефоне открыть в development build (не Expo Go)
yarn build:dev          # собрать dev build (APK) в EAS; пересобирать после изменения нативных пакетов или app.json
yarn build:preview      # обычный APK без dev-клиента
yarn eas <команда>      # любой eas-cli (login, init, build:list)
yarn android            # dev-сервер и запуск на подключенном Android
yarn typecheck          # tsc --noEmit
yarn test               # тесты чистой логики на node:test (TZ=Europe/Berlin, чтобы ловить переход на летнее время)
yarn lint               # expo lint
yarn lint:unused        # knip: неиспользуемые файлы, экспорты, зависимости (knip.json)
yarn lint:circular      # madge: циклические импорты в src/
yarn format             # prettier --write . (конфиг .prettierrc, .claude/ в .prettierignore)
yarn doctor             # expo-doctor
yarn audit              # уязвимости зависимостей
npx expo install <pkg>  # добавлять пакеты только так: подбирает версию под SDK
```

`eas-cli` не в зависимостях, а через `yarn dlx`: он пинует свои зависимости точными версиями с известными уязвимостями, и `yarn audit` в pre-push падал бы без возможности это исправить.

В yarn включен `npmMinimalAgeGate` (24 часа): версии моложе суток в карантине. Если `expo install` падает с YN0016, ставь через `yarn add` предыдущий патч. Тогда expo-doctor будет ругаться на patch mismatch, это ожидаемо, через сутки поправит `npx expo install --fix`.

Git-хуки через lefthook (`lefthook.yml`), ставятся сами на `yarn install` локальным плагином `.yarn/plugins/plugin-lefthook.cjs`. pre-commit: lint-staged (eslint --fix и prettier по застейдженным файлам, конфиг в `package.json`). pre-push: typecheck, knip, madge, тесты, audit.

knip: заготовка под будущий раздел (слайс `contact`) лежит в `ignore` в `knip.json`. Отдельный неиспользуемый пока экспорт помечаем `/** @public */` и на объявлении, и на реэкспорте в `index.ts`. Остальное неиспользуемое удаляем.

audit: уязвимости без исправленной версии игнорируем в `npmAuditIgnoreAdvisories` в `.yarnrc.yml`, с комментарием, почему. Устаревший eslint 9 не считаем (`--no-deprecations`): eslint-config-expo пока не работает с eslint 10.

Перед тем как считать задачу сделанной, прогоняй `yarn test`, `yarn typecheck` и `yarn lint`.

## Структура

Код в `src/` разложен по [Feature-Sliced Design](https://feature-sliced.design/). Слои сверху вниз: `app` → `pages` → `features` → `entities` → `shared`. Слой импортирует только слои ниже себя, слайсы одного слоя друг друга не импортируют. Снаружи слайса импортируем только его `index.ts`, без глубоких путей. Алиас `@/` указывает на `src/` (`paths` в `tsconfig.json`, Metro подхватывает сам).

- `src/app/` - роуты expo-router, он же FSD-слой `app`. Каждый роут - одна строка `export { XPage as default } from '@/pages/x'`. В `_layout.tsx` лежат навигаторы и провайдеры (`SQLiteProvider` с `onInit={migrate}`, `ThemeProvider` с темой из `navigationTheme`), там же загрузка шрифта (до нее рендерим `null`) и цвет окна через `expo-system-ui`.
- Навигация: корневой `Stack`, внутри группа `(tabs)` с табами "Сегодня" (`index`), "Прогресс", "Причины". Шестеренка в шапке табов ведет на `settings`. Отдельные экраны стека: `settings`, `company` (режим "иду в компанию"), `day-review` (итоги дня) и `relapse` (модалки). Онбординг - группа `onboarding/` со своим `Stack` (`index` дисклеймер, `screening`, `warning`, `start`, `spending`, `reasons`, `notifications`, `autostart` - последний только на Xiaomi и подобных). Онбординг пройден = в `habit` есть строка: она создается на шаге `start`, а layout табов без нее делает `Redirect` на `/onboarding`. Шаги после `start` необязательные, их стек сбрасывается через `dismissAll`, чтобы "назад" не вернул на старт. Тема по системе, база светлая.
- `src/pages/<экран>/` - экраны: `ui/<Name>Page.tsx`, `model/use<Name>.ts` и `index.ts`. В `onboarding` шесть страниц.
- Компоненты маленькие, каждый делает одно или собирает несколько других; критерий - страница читается сверху вниз как список блоков. Страница раскладывается на секции в своем `ui/` (`StreakSummary`, `Savings`, `PartyCard` в `today`; `MonthNav`, `DayCell`, `Legend` у календаря), повторяющееся между слайсами уезжает в `shared/ui` или в `ui/` сущности (`ReasonList` в `reason`). Секция со своими данными может звать свой хук (`RepliesSection` и `useReplies` в `company`).
- Компоненты в `ui/` только рисуют: JSX, тема, стили, `Alert` подтверждений и простая навигация по кнопкам. Состояние, загрузка из базы (`useSQLiteContext`), таймеры, сохранение и навигация после него живут в хуках в `model/` своего слайса. Хук экрана с загрузкой возвращает `null`, пока данные не пришли, и готовые к показу значения и действия (`canSave`, `togglePlace`, `save`). Чистую логику без React выносим в отдельный файл в `model/` и покрываем тестом.
- `src/features/` - действия пользователя, которые затрагивают несколько сущностей. Сейчас там `delete-relapse` (мягкое удаление срыва и сброс результата связанной вечеринки в одной транзакции, хук `useDeleteRelapse` и кнопка с подтверждением), `log-party-relapse` (срыв из карточки вечеринки: запись срыва и `result = 'drank'` со ссылкой на него в одной транзакции) `edit-spending` (форма трат и пресетов напитков, общая для онбординга и настроек; состояние формы и список валют в `model/useSpendingForm.ts`) и `notifications` (локальные напоминания). В `notifications`: настройки одним JSON под ключом `notifications` в `settings` (нет строки - все выключено), чистая `model/plan.ts` строит разовые уведомления на 14 дней вперед (итоги дня пропускают день с заполненными итогами по `reviewDay`, дни риска - день с вечеринкой, "как прошло?" на `expectedEndAt` идущей), `syncNotifications(db)` снимает все запланированное и ставит заново, вызовы идут очередью, заодно убирает из шторки устаревшие (`isStale` по `day`/`partyId` в `data` уведомления). Синхронизируем при старте и возврате в приложение (`useNotifications` в корневом layout, там же обработка тапов и кнопок), и после записей, которые меняют план: сохранение итогов дня, ответ на вечеринку на "Сегодня", срыв из вечеринки, удаление срыва на "Прогрессе", старт и смена конца в режиме компании, изменение настроек. Новое место, которое пишет итоги или вечеринки, должно звать `syncNotifications` само. Форма `NotificationForm` и `AutostartHint` общие для онбординга и настроек, `needsAutostartHint` - по `Platform.constants.Manufacturer`, `openAutostartSettings` открывает экран автозапуска MIUI/HyperOS через `expo-intent-launcher` (по имени компонента), остальным - настройки приложения. Точных будильников нет (ни `USE_EXACT_ALARM`, ни `SCHEDULE_EXACT_ALARM`): напоминания могут опоздать на минуты, это осознанно.
- `src/entities/<сущность>/` - по слайсу на таблицу. В `model/types.ts` тип строки и ключи вариантов, которые нужны только этой сущности. В `api/` запросы к SQLite, они принимают `db` из `useSQLiteContext()`. SQL пишем только в `api/` сущностей и в `features`, в страницах его нет. В `habit` еще лежат `model/streak.ts` - чистая логика стрика (трезвый день - календарный день после дня старта без срывов; `soberDays` отдает статус каждого дня, на нем держатся стрик, календарь и ачивки), `model/achievements.ts` (ачивки с датой получения из `soberDays`, дат итогов дня и вечеров в компании, не хранятся) и `model/savings.ts` (деньги, порции и ккал от всех трезвых дней, суммы целые, калорийность пресетов константами), в `day-review` - `model/reviewDay.ts` (до 18:00 итоги за вчера, с 18:00 за сегодня, даты строками `YYYY-MM-DD`), тесты рядом. Подпись причины (готовой или своей) - `reasonLabel` в `reason`. Вечеринка (`party`) - любая встреча, где пьют другие: идущая = без `result` и не удалена, начинается при открытии режима (`startParty`), "не пошел" ее мягко удаляет. Готовые заготовки ответов (`reply`) живут только в коде, в таблице лежат свои. Свои напитки на вечер - общий список в `settings` (ключ `customPartyDrinks`). Календарь лежит в странице: `pages/progress/ui/Calendar.tsx` (шапка `MonthNav`, клетка `DayCell`, `Legend`, цвета дней в `statusColor.ts`), листание в `model/useCalendar.ts`, сетка месяца в `model/calendar.ts` (с тестом).
- `src/shared/db/` - инфраструктура базы: `migrations.ts` (вся схема целиком, миграции по `PRAGMA user_version`; по сущностям не делится, потому что порядок версий глобальный), `records.ts` (`newRow()`, типы `Row` и `Setting`), `reset.ts` (`resetDatabase` для dev-кнопки сброса в настройках, видна только при `__DEV__`). Схема и решения по ней: спека `local-data` в `openspec/specs/`.
- `src/shared/config/options.ts` - ключи готовых вариантов, общих для срыва и итогов дня (настроение, тяга, места, трудности, что помогло).
- `src/shared/i18n/` - инфраструктура i18n и форматтеры. В `common.ts` только общие слова (названия экранов, кнопки), `t` из `index.ts` знает только их (для `app` и `shared/ui`). `defineDict({ ru, en })` объявляет словарь слайса, `createT(dict, { habit: habitDict })` отдает функцию `t` слайса: его строки, общие слова и словари нижних слоев под неймспейсами (``t(`habit.drinks.${d}`)``). Словарь может быть вложенным, ключи тогда через точку (`t('drinks.beer')`, ``t(`mood.${m}`)``), путь типизирован. Тип словаря задает `ru`, `en` обязан совпасть по ключам (`NoInfer`). Еще там `days(n)`, `portions(n)`, `formatDateTime`, `formatTime` (время из минут от полуночи), `formatDay` (короткая дата из `YYYY-MM-DD`), `formatMonth` и `weekdays` (для календаря), `formatMoney` и `currencySymbol` (через `Intl.NumberFormat`, с запасным форматом, если Hermes не знает валюту). Язык определяется один раз при старте.
- Строки живут в слайсе, которому принадлежат: `<слайс>/i18n.ts` с ru и en рядом. Страницы и фичи делают `export const t = createT(...)` и импортируют его как `../i18n`, в компонентах только этот `t`. Сущности и `shared/config` отдают через `index.ts` словарь `<слайс>Dict` (`habitDict`, `optionDict`, `reasonDict`), страница подключает нужные в свой `createT`. Коллизии (ключ слайса = общий ключ, неймспейс = ключ слайса или общий) запрещены типами в `createT`: конфликтующий ключ становится `never`. Поэтому `dayReviewDict` подключаем как `review`: `dayReview` - общий заголовок экрана. Строка нужна нескольким слайсам одного слоя - кладем ее в слой ниже.
- `src/shared/lib/utils/` - чистые утилиты без зависимостей, по файлу на функцию, тест рядом: `getLocale` (ru/en по локали системы), `pluralize(n, { one, few?, many }, locale)` (склонение руками, в Hermes нет `Intl.PluralRules`), `toDay` (локальная дата `YYYY-MM-DD` из epoch ms), `toggle`/`toggleExclusive` (выбор в списке, вариант "ничего" снимает остальные).
- `src/shared/ui/theme.ts` - токены цветов `{ light, dark }` (палитра в разделе "Дизайн" `docs/idea.md`), `useColors()` для компонентов (по `useColorScheme()`), `useScreenColors()` для `screenOptions` навигаторов (шапка, фон экрана; тема из `ThemeProvider` до экранов доходит только при монтировании и смену темы не видит, поэтому цвета навигации задаем явно), `navigationTheme(scheme)` для `ThemeProvider` (шапки и таб-бар), `fonts` - семейство на каждое начертание. Цвета берем только из `useColors()`, `useTheme()` и hex по месту не используем. `fontWeight` не пишем: Android не подбирает начертание кастомного шрифта, вместо него проп `weight` у `Text`.
- `src/shared/ui/` - базовые компоненты: `Text` в цвет темы с `variant` (`title`, `heading`, `label`, `hint`) и `weight`, `Button` (`primary` - одна на экран, основное действие; `secondary` - по умолчанию; `quiet` - тихая ссылка для отмены, пропуска, удаления и срыва), `Card` (рамка без тени), `Switch`, `Screen`, `Input` (поле в цветах темы, `multiline` под заметку), `AddField` (поле и кнопка "Добавить"), `Chip`, `ChipRow` (чипы с переносом), `Choices` (группа вариантов чипами с подписью), `Row` (подпись слева, значение или действие справа), `DateTimeField` (дата и время в границах), `TimeField` (только время, значение в минутах).
- Тесты и код, который они импортируют (`streak.ts`, `savings.ts`, `achievements.ts`, `reviewDay.ts`, `pages/progress/model/calendar.ts`, `features/notifications/model/plan.ts`, `shared/lib/utils`), используют только относительные импорты с `.ts`: node алиас `@/` не разрешает. Поэтому `plan.ts` берет `reviewDay` глубоким относительным путем из `entities/day-review`, это единственное исключение из правила про `index.ts`.
- `docs/` - спека и ресерч.
- `openspec/` - спеки OpenSpec: `specs/` описывает текущее поведение, `changes/` - изменения в работе, `config.yaml` - контекст и правила для артефактов. Слэш-команды и скиллы OpenSpec лежат в `.claude/`, их генерирует `openspec init`/`openspec update`, руками не правим.
- `android/` и `ios/` не коммитим, их генерирует `expo prebuild` (CNG). Нативные настройки задаются только через `app.json` и config plugins.

## Expo

- API Expo меняется от SDK к SDK. Перед работой с API сверяйся с доками своей версии: https://docs.expo.dev/versions/v57.0.0/ и https://docs.expo.dev/llms.txt.
- Разработка идет в development build (`expo-dev-client`), Expo Go не подходит: в нем на Android нет `expo-notifications`. JS-изменения подхватываются dev-сервером как обычно. После добавления или обновления пакета с нативным кодом, плагина или нативных полей `app.json` dev build нужно пересобрать: `yarn build:dev` или `npx expo run:android` (нужны JDK и Android SDK, сейчас не установлены).

### Пересборки (бюджет EAS)

Бесплатный тариф EAS - 15 Android-сборок в месяц, очередь низкоприоритетная. Пересобираем как можно реже.

- Нативное изменение = все, что не подхватит dev-сервер: новый, удаленный или обновленный пакет с нативным кодом (в том числе `npx expo install --fix` и обновление SDK), config plugin, нативные поля `app.json` (`android.*`, `ios.*`, `plugins`, `permissions`, `scheme`, иконка, splash), `eas.json`. Изменения только в JS/TS и ассетах, которые грузит Metro, пересборки не требуют.
- Каждый раз, когда вносишь нативное изменение, явно пиши об этом в ответе: что именно изменилось и что нужна пересборка.
- Если в текущей задаче или ближайших запланированных (tasks.md активных изменений, следующий change из `docs/idea.md`) есть еще нативные изменения, предупреди и посоветуй собрать один раз после всех. Нативные изменения по возможности делай в начале задачи пачкой, чтобы проверять JS уже на свежей сборке.
- Не предлагай пересборку ради проверки, которую можно сделать в JS (dev-кнопки, логи, `__DEV__`-блоки).
- Сборка не тратит квоту, если собирать локально (`npx expo run:android` или `yarn eas build --local`), но для этого нужны JDK и Android SDK.

## Процесс (OpenSpec)

Фичи и заметные изменения поведения идут через OpenSpec: `/opsx:explore` (по желанию обсудить идею) → `/opsx:propose <имя>` (proposal, delta-спеки, design, tasks в `openspec/changes/<имя>/`) → `/opsx:apply` → `/opsx:archive` (delta вливается в `openspec/specs/`). Мелкие правки, багфиксы и рефакторинг без изменения поведения делаем напрямую. Темы для изменений берем из `docs/idea.md`.

CLI ставится глобально (`npm i -g @fission-ai/openspec`), телеметрия отключена через `openspec config set telemetry.enabled false` (настройка машины, не репозитория). После обновления CLI запускать `openspec update`, чтобы обновить файлы в `.claude/`.

## Конвенции

- Все записи в БД с `id` (uuid), `createdAt`, `updatedAt`, удаление мягкое через `deletedAt`, чтобы потом добавить синхронизацию.
- Стрик, экономию и ачивки вычисляем, а не храним.
- Варианты ответов (итоги дня, причины, напитки) хранятся в коде ключами, тексты лежат в i18n.
- Тесты только на чистую логику: стрик, деньги, калории, условия ачивок. Раннер встроенный `node:test` без Jest: node 24 сам снимает типы, поэтому импорты в тестах с расширением `.ts` (`allowImportingTsExtensions`), а типы node подключаются в тестовом файле через `/// <reference types="node" />`.
- `Button` и `Switch` из `react-native` запрещены правилом `no-restricted-imports` в `eslint.config.js`, берем свои из `@/shared/ui`.
- Аналитики и сетевых запросов нет. Данные пользователя не покидают устройство, кроме Android Auto Backup и ручного экспорта.
- Комментарии в коде на русском. Коммиты в формате Conventional Commits.
