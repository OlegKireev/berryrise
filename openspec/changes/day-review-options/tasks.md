# Tasks

## 1. Варианты и подписи

- [x] 1.1 В `src/shared/config/options.ts` выставить списки `places`, `hardships`, `helpers` из design.md (порядок = порядок на экране). Проверка: `yarn typecheck` показывает все места, где используются удаленные ключи (`nothing`, `notNeeded`, `activity`, `company`, `family`).
- [x] 1.2 В `src/shared/config/i18n.ts` (ru и en) добавить подписи новых ключей, удалить старые, поменять `holiday` на "Повод отметить" / "Occasion to celebrate", `sport` на "Спорт или прогулка" / "Sport or a walk". Проверка: `yarn typecheck` (en обязан совпасть с ru по ключам).

## 2. Миграция базы

- [x] 2.1 Добавить в `src/shared/db/migrations.ts` миграцию 2 по шагам из design.md: "рядом пили" по старым местам, чистка `nothing`/`notNeeded`/`activity`, перенос мест срыва, `DROP COLUMN places`, все под защитой `json_valid`/`json_type`. Проверка: `yarn typecheck`, `schemaVersion` = 2.
- [x] 2.2 Обновить `dayReviewSchema` (без `places`), `DayReviewData` и INSERT/UPSERT в `saveDayReview`. `listCompanyDates` перевести на `othersDrinking` и при желании переименовать. Проверка: `yarn typecheck`.
- [x] 2.3 Проверить миграцию на эмуляторе (скилл `emulator-check`): на сборке до изменения засеять итоги с `places: ["bar"]`, `hardships: ["nothing"]`, `helpers: ["notNeeded","activity"]`, итоги с не-JSON в `hardships` и срыв с местами `["company","family","home"]`; обновить JS и перезапустить. Проверка: приложение стартует, в базе значения как в сценариях `local-data`, медаль "выстоял в компании" на месте, в журнале нет ошибок `db` по этим строкам.

## 3. Форма итогов дня

- [x] 3.1 В `useDayReview` убрать `places`, `togglePlace` и подстановку через `hasPartyOn`, трудности и помощь переключать через `toggle`, отдать `showHelpers`, при сохранении с тягой "нет" писать `helpers: []`. Проверка: `yarn typecheck`.
- [x] 3.2 В `DayReviewPage` убрать вопрос о месте, обернуть `Choices` помощи в `Collapse open={form.showHelpers}`. Проверка на эмуляторе: сценарии `day-review` "Тяга не выбрана", "Тянуло", "Передумал про тягу", "Вернул тягу до сохранения", "Повторное открытие" (раскрыт без анимации), скриншоты в светлой и темной теме.
- [x] 3.3 Удалить `toggleExclusive` из `src/shared/lib` (функция, реэкспорт, тест) и `hasPartyOn` из `entities/party`, если больше не используется. Проверка: `yarn lint:unused` чистый.

## 4. Срыв и карточка дня

- [x] 4.1 Убедиться, что `RelapsePage` показывает новый список мест без своих правок, а `DayReviewSummary` и `useDayCard` больше не читают места итогов. Проверка на эмуляторе: модалка срыва с шестью местами, карточка дня без строки мест у итогов.

## 5. Статистика

- [x] 5.1 В `pages/progress/model/insights.ts` считать топы трудностей и помощи только по итогам с тягой, вернуть `cravingCount`, убрать `skip` у `top3`. Обновить `insights.test.ts`: заменить кейс с "ничего", добавить кейсы "трудности без тяги не считаются" и "тяги не было" (пустые топы, `cravingCount` 0), проверить, что `topHelper` считается по дням с тягой. Проверка: `yarn test`.
- [x] 5.2 В `InsightsPage` передавать в `TopList` `total={data.cravingCount}`, при `cravingCount === 0` показывать под обоими заголовками `noCraving`. Проверка на эмуляторе: засеять 7+ итогов с тягой и без, сверить со сценариями `insights`.

## 6. Документация

- [x] 6.1 Обновить `docs/idea.md` (раздел "Итоги дня": вопросы, варианты, помощь только при тяге, места только в срыве) и `CLAUDE.md` (убрать `toggleExclusive` из списка утилит, поправить упоминания мест итогов дня и "выстоял в компании", если есть). Проверка: `grep -n "toggleExclusive\|Ничего не понадобилось" CLAUDE.md docs/idea.md` пусто.
- [x] 6.2 Поправить Purpose в `openspec/specs/day-review/spec.md`: без "где был". Проверка: в Purpose нет мест.

## 7. Финальная проверка

- [x] 7.1 Прогнать `yarn test`, `yarn typecheck` и `yarn lint`, все чисто.

## Workflow follow-up

- Заархивировать изменение через `/opsx:archive`, когда все задачи закрыты.
- Миграция 2 свернута в схему версии 1, `schemaVersion` = 1. Временный код, опускавший `user_version` 2 до 1, отработал на preview и удален, свежий экспорт сделан.
