# Tasks

## 1. Зависимости

- [x] 1.1 Установить `expo-sqlite` и `expo-crypto` через `npx expo install`, проверить, что `yarn doctor` не ругается на них

## 2. Схема и миграции

- [x] 2.1 Создать `src/db/keys.ts` с `as const`-массивами ключей (mood, craving, places, hardships, helpers, drinks, reasons, replies) и выведенными из них типами, проверить `yarn typecheck`
- [x] 2.2 Создать `src/db/types.ts` с типами строк всех таблиц из design.md, проверить `yarn typecheck`
- [x] 2.3 Создать `src/db/migrations.ts`: массив миграций, v1 со всеми таблицами и частичным уникальным индексом `checkin_date`, раннер, который в транзакции применяет миграции новее `PRAGMA user_version` и выставляет версию. Проверить: при запуске в Expo Go `PRAGMA user_version` равен 1, все таблицы есть, повторный запуск ничего не применяет
- [x] 2.4 Обернуть корневой layout в `SQLiteProvider` с `onInit` из 2.3, проверить, что приложение стартует в Expo Go без ошибок

## 3. Записи и целостность

- [x] 3.1 Добавить в `src/db/` хелпер для новых записей (uuid из `expo-crypto`, `createdAt = updatedAt = Date.now()`) и `deleteRelapse(db, id)`, который в одной транзакции помечает срыв удаленным и сбрасывает `result`/`relapseId` у связанной вечеринки. Проверить вручную: вставить вечеринку со срывом, удалить срыв, у вечеринки `result` и `relapseId` равны NULL

## 4. Документация

- [x] 4.1 Обновить `CLAUDE.md`: модуль `src/db/` в структуре, `SQLiteProvider` в корневом layout, статус проекта. Проверить, что описание совпадает с кодом
- [x] 4.2 Обновить таблицу сущностей в `docs/idea.md` по схеме из design.md (`party` вместо `outing`, без `achievement`, с `reply` и `contact`)

## 5. Проверка

- [x] 5.1 Прогнать `yarn typecheck` и `yarn lint`, оба проходят без ошибок
