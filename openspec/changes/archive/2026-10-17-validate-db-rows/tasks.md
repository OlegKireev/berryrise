# Tasks

## 1. Зависимость и спайк

- [x] 1.1 `yarn add zod` (прямая зависимость, не expo-пакет), проверить `yarn audit` и `yarn lint:unused`
- [x] 1.2 Спайк в dev build на эмуляторе (`emulator-check`, без пересборки): временный `__DEV__`-вызов парсит объект со `.extend`, `.catch`, `.transform` и `.pick`, результат в лог metro. Если на Hermes ошибка или предупреждение про `new Function` - включить `z.config({ jitless: true })` в `shared/db/schema.ts`. Временный вызов удалить

## 2. Общие куски в shared

- [x] 2.1 Тег `'db'` в `LogTag` (`shared/lib/logEntries.ts`)
- [x] 2.2 `shared/db/schema.ts`: `rowSchema`, хелперы `jsonList(item, column)`, `jsonCounts(keys, column)`, `optional(schema, column)` с логом фолбэка (таблица, колонка, id, без значения; один раз за запуск на "таблица.колонка"), `parseRows`/`parseRow(table, schema, rows, 'throw' | 'skip')` с `logError('db', ...)` по путям issues и id. `Row` в `records.ts` - `z.infer<typeof rowSchema>`. Экспорт через `shared/db/index.ts`
- [x] 2.3 Тест `shared/db/schema.test.ts`: `jsonList` выкидывает неизвестный элемент и битый JSON дает `[]`, `optional` дает `null`, `parseRows` пропускает строку со сломанным скелетом в режиме `skip` и бросает в режиме `throw`, мягкий фолбэк не валит строку

## 3. Схемы сущностей и api

- [x] 3.1 `relapse`: `model/schema.ts` (`mood` через `optional`, `places`/`hardships` через `jsonList`), тип `Relapse` из схемы, все чтения в `api/relapse.ts` через `parseRows(..., 'throw')`, частичный `SELECT id, at` через `.pick`
- [x] 3.2 `habit`: схема (`drinks` через `jsonCounts`), `getHabit` через `parseRow(..., 'throw')`, запись трат принимает объект порций
- [x] 3.3 `day-review`: схема (`mood`, `craving` обязательные, три `jsonList`), чтения через `'skip'`, запись принимает массивы
- [x] 3.4 `party`: схема (`drinkKeys` - `jsonList(partyDrink)`, `drinkCustoms` - `jsonList(z.string())`, `result` enum), чтения через `'skip'`, `startParty` и обновление напитков работают с массивами
- [x] 3.5 `reason` и `reply`: схемы (ключ из списка или `null`, при сломанном ключе без `customText` строка пропускается), чтения через `'skip'`
- [x] 3.6 Экспорт схем из `index.ts` каждой сущности; старые ручные типы строк из `types.ts` удалить, ключи вариантов оставить

## 4. Потребители

- [x] 4.1 Убрать разбор JSON-колонок из `useDayCard`, `useDayReview`, `useCompany`, `useInsights`, `useToday`, `useSpendingForm`: брать готовые массивы и объекты из строк
- [x] 4.2 Поправить остальные места, где тип строки поменялся (`celebrate-achievement`, `widget`, `notifications/model/plan.ts`, `onboarding`, `relapse`, `log-party-relapse`, `delete-relapse`) - по ошибкам `yarn typecheck`
- [x] 4.3 Удалить из `shared/lib/utils/json.ts` то, что стало ненужным (`parseCounts`, если не осталось пользователей; `parseList` остается для `settings`), по `yarn lint:unused`

## 5. Импорт

- [x] 5.1 `restoreDatabase(db, version, fill, check?)`: `check(tx)` после последней миграции внутри транзакции
- [x] 5.2 `importBackup` передает `check`: все строки таблиц сущностей, включая удаленные, через `parseRows(..., 'throw')`; ошибка откатывает импорт, страница показывает "файл поврежден" как сейчас

## 6. Проверка и документация

- [x] 6.1 Проверить на эмуляторе (`emulator-check`, `seed`): итоги дня с неизвестным местом - карточка дня и статистика открываются, в журнале одна запись `db` без значения; итоги дня с неизвестной тягой не видны, остальные дни на месте; срыв с текстом в `at` - стрик не показывается, в журнале ошибка `db`; импорт файла со срывом с текстом в `at` - "файл поврежден", данные прежние
- [x] 6.2 `CLAUDE.md`: zod в стеке, схемы строк в `model/schema.ts` сущностей, `parseRows` вместо дженерика `getAllAsync<T>`, JSON-колонки разбираются в `api/`, мягкий и жесткий режим; поправить описание `json.ts` и `records.ts`
- [x] 6.3 `yarn test`, `yarn typecheck`, `yarn lint`

## Workflow follow-up

- `/opsx:archive` после реализации: delta вольется в `local-data`, `backup`, `error-log`
