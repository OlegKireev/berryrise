# Tasks

## 1. База и api сущностей

- [x] 1.1 В первой миграции `src/shared/db/migrations.ts` заменить у `party` `drinkKey`/`drinkCustom` на массивы `drinkKeys`/`drinkCustoms` (см. design), тип `Party`; проверить: после сброса базы приложение стартует, `PRAGMA user_version` = 1
- [x] 1.2 `entities/party/api`: `startParty` (проверка идущей и вставка в одной транзакции), `getActiveParty`, `getParty`, `setPartyEnd`, `setPartyDrinks`, `listCustomDrinks`/`addCustomDrink`/`deleteCustomDrink`, `setPartyResult`, `cancelParty` (мягкое удаление), `hasPartyOn`, `listSoberPartyStarts`; экспорт из `index.ts`; проверить `yarn typecheck`
- [x] 1.3 `entities/reply/api`: `listReplies`, `addReply`, `deleteReply` по образцу `reason` (`replyLabel` не понадобился: свои - всегда текст, готовые - ключ i18n); проверить `yarn typecheck`
- [x] 1.4 `insertRelapse` возвращает id; `listCompanyDates` в `day-review` (места `company` или `bar`); проверить `yarn typecheck`
- [x] 1.5 Убрать `party` и `reply` из `ignore` в `knip.json`; проверить `yarn lint:unused` после группы 3

## 2. Ачивки за компанию

- [x] 2.1 Ключи `company1`, `company5`, `company10` в конце `achievementKeys`, параметр `company` в `achievements` по design; проверить тестами в `achievements.test.ts`: трезвая вечеринка, вечеринка и место в один день считаются одним вечером, место в день срыва не считается, "выпил" не считается, 5 вечеров только по местам
- [x] 2.2 "Прогресс" передает вечеринки и даты мест в `achievements`, названия ачивок в `src/shared/i18n/ru.ts` и `en.ts`; проверить: счетчик "N из 16"

## 3. Режим компании

- [x] 3.1 i18n ru/en: напитки (`partyDrink_*`), заготовки (`reply_*`), тексты режима, "можно просто уйти", карточки "как прошло?" и ее кнопок; проверить `yarn typecheck` (словари строго типизированы)
- [x] 3.2 `CompanyPage`: начало или подхват идущей вечеринки, причины, ожидаемый конец через `DateTimeField` (от начала до +24ч), напитки (несколько, готовые и свои), заготовки (готовые, свои, добавить, удалить), блок "можно уйти"; проверить в Expo Go сценарии спеки `company-mode` про начало, конец, напиток и заготовки
- [x] 3.3 Фича `log-party-relapse`: срыв и `result = 'drank'` с `relapseId` в одной транзакции
- [x] 3.4 `RelapsePage` принимает `partyId`: время по умолчанию `min(now, expectedEndAt)`, сохранение через `log-party-relapse`; проверить в Expo Go: "выпил" и сохранение закрывают карточку, закрытие модалки оставляет ее, удаление срыва на "Прогрессе" возвращает карточку
- [x] 3.5 Карточка идущей вечеринки на "Сегодня": конец, "без алкоголя", "выпил", "не пошел", переход в режим; проверить в Expo Go, что после ответа карточка пропадает, а "без алкоголя" дает ачивку на "Прогрессе"

## 4. Итоги дня

- [x] 4.1 В `DayReviewPage` заранее выбирать место "в компании" через `hasPartyOn`, если итогов за день еще нет; проверить в Expo Go три сценария из дельты `day-review`

## 5. Документация и проверка

- [x] 5.1 `docs/idea.md`: убрать "трезвый праздник", описать подстановку места в итогах дня и правило подсчета "выстоял в компании"; `CLAUDE.md`: статус, фича `log-party-relapse`, api `party` и `reply`, knip; проверить, что описание совпадает с кодом
- [x] 5.2 Прогнать `yarn test`, `yarn typecheck`, `yarn lint`, `yarn lint:unused`, `yarn lint:circular`, все зеленые
