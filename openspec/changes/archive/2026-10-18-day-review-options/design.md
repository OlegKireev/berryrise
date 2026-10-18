# Design

## Context

Варианты ответов - массивы ключей в `src/shared/config/options.ts`, подписи в `shared/config/i18n.ts`. Итоги дня и срыв пользуются общими `places` и `hardships`, помощь (`helpers`) есть только у итогов. В базе это JSON-массивы: `dayReview.places/hardships/helpers` (NOT NULL, по умолчанию `'[]'`) и `relapse.places/hardships` (nullable). Читаются они через `jsonList`: неизвестный ключ отбрасывается с событием `db` в журнале. Схема сейчас одной миграцией (версия 1). Встроенный в expo-sqlite SQLite 3.50 умеет `ALTER TABLE ... DROP COLUMN` и JSON-функции.

Места итогов дня используются в трех местах: в форме (`useDayReview`, там же подстановка `company` после вечеринки через `hasPartyOn`), в карточке дня (`DayReviewSummary`) и в достижениях (`listCompanyDates`: места `company` или `bar`). "Ничего" держат `toggleExclusive` в форме и параметр `skip` у `top3` в `insights.ts`.

## Goals / Non-Goals

**Goals:**

- Старые данные приводятся к новым спискам миграцией, а не молчаливым отбрасыванием при чтении.
- Уже полученные медали "выстоял в компании" не пропадают.

**Non-Goals:**

- Не трогаем вид чипов, `Choices` и форму срыва, кроме списка мест.
- Не храним, с какого экрана выбран вариант, и не версионируем списки.

## Decisions

**Ключи: новые только для нового смысла.** `holiday` и `sport` остаются, меняются только подписи ("Повод отметить", "Спорт или прогулка"): смысл расширился, а не сменился, и миграция для них не нужна. Новые ключи: трудности `conflict`, `anxiety`; помощь `work`, `hobby`, `reasons`, `leftEarly`; места `guests`, `outside`. Удаляются `nothing`, `notNeeded`, `activity`, `company`, `family`. Порядок в массивах = порядок на экране из спеки. `activity` не переносим ни в `work`, ни в `hobby`: честно разделить его нельзя.

Итоговые списки:

- `places`: `home`, `work`, `guests`, `bar`, `road`, `outside`
- `hardships`: `stress`, `fatigue`, `boredom`, `loneliness`, `conflict`, `anxiety`, `holiday`, `othersDrinking`
- `helpers`: `naDrink`, `sport`, `food`, `talk`, `sleep`, `work`, `hobby`, `reasons`, `leftEarly`

**Миграция 2 - SQL, без JS.** `restoreDatabase` гоняет миграции строками SQL и после вставки файла: та же миграция приводит и базу при обновлении, и импорт старого файла. Порядок внутри нее:

1. `dayReview.hardships`: добавить `othersDrinking` там, где в `places` есть `company` или `bar` и его еще нет (`json_insert(hardships, '$[#]', ...)`). Делаем до удаления колонки.
2. `dayReview.hardships`: убрать `nothing`. `dayReview.helpers`: убрать `notNeeded` и `activity`. `relapse.hardships`: убрать `nothing`.
3. `relapse.places`: `company` -> `guests`, `family` -> `home`, без повторов (`json_group_array(DISTINCT CASE ... END)` по `json_each`).
4. `ALTER TABLE dayReview DROP COLUMN places`.

Фильтрация - пересборкой массива: `(SELECT json_group_array(value) FROM json_each(col) WHERE value NOT IN (...))`, на пустом наборе это `'[]'`. Каждое выражение под `CASE WHEN json_valid(col) AND json_type(col) = 'array' THEN ... ELSE col END`: сломанный или NULL-список остается как был и не роняет миграцию, а при чтении его разберет `jsonList`. `updatedAt` не трогаем: это не правка пользователя. `id/createdAt/updatedAt/deletedAt` и частичный индекс `dayReview_date` не затрагиваются. Миграция 1 не меняется.

Альтернатива - оставить чистку на `jsonList`. Отказались: так не перенести места срыва и "рядом пили", а журнал на каждом запуске получал бы событие `db`.

**"Выстоял в компании" через "рядом пили".** `listCompanyDates` фильтрует по `hardships.includes('othersDrinking')`. Шаг 1 миграции сохраняет старые засчитанные дни. Скорее всего, функцию стоит переименовать по смыслу (например, `listOthersDrinkingDates`), это решим при реализации.

**Форма итогов.** `useDayReview` теряет `places`, `togglePlace`, подстановку через `hasPartyOn` и `toggleExclusive`: трудности и помощь переключаются обычным `toggle`. Выбор помощи живет в state независимо от тяги, поэтому если тягу вернуть, он восстанавливается. При сохранении `helpers` пишется как `craving === 'none' ? [] : helpers`. Хук отдает `showHelpers: craving !== null && craving !== 'none'`, страница оборачивает `Choices` помощи в `Collapse open={showHelpers}`. `Collapse` уже не анимирует, когда первый рендер идет с `open`, и не анимирует при "уменьшить движение", а свернутое размонтирует. Состояние в хуке, поэтому размонтирование ничего не теряет.

**Статистика.** `insights()` берет для топов только итоги с `craving !== 'none'` и отдает `cravingCount`. `top3` теряет параметр `skip`. Доля полоски в `TopList` - от `cravingCount` (сейчас от `reviewCount`). При `cravingCount === 0` страница вместо двух `TopList` рисует оба заголовка с текстом из уже существующего ключа `noCraving` ("Тяги не было"). Порог `enough` по-прежнему от `reviewCount`. `topHelper` превью считается из того же топа помощи, то есть тоже по дням с тягой. Срывы считаются как раньше, `places` срыва без изменений в логике.

**Удаление мертвого кода.** `toggleExclusive` удаляется из `shared/lib` вместе с тестом. `hasPartyOn` удаляется из `entities/party`, если knip покажет, что он больше не нужен. Тип `DayReviewData` и INSERT/UPSERT в `saveDayReview` теряют `places`.

## Risks / Trade-offs

- [Старые итоги, где место "в компании" или "бар" было, а пьющих рядом нет, получат "рядом пили" и поднимут этот вариант в старой статистике трудностей] -> Принято осознанно ради сохранения медалей. Отличить такие дни задним числом нельзя.
- [Ленивость `CASE` в SQLite - деталь реализации: если подзапрос `json_each` по сломанному тексту все-таки вычислится, миграция упадет и приложение не стартует] -> Проверить на эмуляторе: засеять строку с не-JSON в `hardships` на версии 1 и обновить. Если упадет, перенести `json_valid` в `WHERE` отдельного `UPDATE`.
- [`DROP COLUMN` переписывает таблицу] -> Таблица маленькая (строка на день), это мгновенно.
- [Файл экспорта новой версии не откроется в старом приложении] -> Уже так устроено: проверка `schemaVersion` попросит обновить приложение.

## Migration Plan

Миграция 2 применяется сама при старте (`migrate`) и при импорте файла версии 1 (`restoreDatabase`). Отката нет, как и у остальных миграций: данные приводятся необратимо, исходные места итогов дня теряются (кроме того, что ушло в "рядом пили").
