# Tasks

## 1. Данные и расчет

- [x] 1.1 В `src/shared/db/migrations.ts` в первой миграции заменить `weeklySpendMinor` на `weeklySpend INTEGER`, удалить `naCountsAsRelapse`. Обновить тип `Habit` в `src/entities/habit/model/types.ts` (`weeklySpend: number | null`, без флага). В `docs/idea.md` убрать пункт про б/а в "Привычка и стрик" и в "Настройках", поправить строку `habit` в таблице и "деньги в минорных единицах" на целые единицы. Проверить: `yarn typecheck` проходит, `grep -r naCountsAsRelapse src docs` пусто
- [x] 1.2 Добавить в `src/entities/habit/api/habit.ts` `updateHabitStart(db, id, startAt)` и `updateSpending(db, id, { weeklySpend, currency, drinks })` с обновлением `updatedAt`, `drinks` пишется JSON только с количеством больше нуля. Экспортировать из `index.ts`, снять `@public` с `drinks`/`Drink`, если они теперь используются. Проверить: `yarn typecheck` и `yarn lint:unused` проходят
- [x] 1.3 Создать `src/entities/habit/model/savings.ts`: `drinkKcal` и `savings(total, weeklySpend, drinks)` по design.md (умножение до деления, `Math.floor`), импорты относительные с `.ts`. Тест `savings.test.ts` рядом на `node:test` со сценариями спеки `savings`: 700 x 14 = 1400, 1000 x 1 = 142, пиво 7 в неделю за 2 дня = 2 порции и 430 ккал, `weeklySpend = null` дает `money = null`, пустые пресеты дают нули. Проверить: `yarn test` зеленый

## 2. Форма трат

- [x] 2.1 Добавить в `src/shared/i18n/index.ts` `formatMoney(amount, currency)` через `Intl.NumberFormat` (`style: 'currency'`, `maximumFractionDigits: 0`) с запасным форматом `${n} ${code}` в `try/catch`, функцию для символа валюты через `formatToParts` и `portions(n)` со склонением как у `days`. Добавить строки в `src/shared/i18n/ru.ts` и `en.ts`: заголовок и подсказка шага трат, "сумма в неделю", подписи пресетов `drink_*`, "сэкономлено", "не выпито", "ккал", подсказка "Укажи траты, чтобы видеть экономию", "старт". Проверить: `yarn typecheck` проходит, у en те же ключи, что у ru
- [x] 2.2 Создать фичу `src/features/edit-spending`: `SpendingForm` (props: `habit`, `submitLabel`, `onSaved`) с полем суммы (`number-pad`, только цифры), чипами валют из списка в design.md (по умолчанию по локали или сохраненная), полями порций на каждый пресет и кнопкой сохранения через `updateSpending`. Экспорт из `index.ts`. Проверить: `yarn typecheck`, `yarn lint:circular` проходят

## 3. Экраны

- [x] 3.1 Создать `src/pages/onboarding/ui/SpendingStepPage.tsx` и роут `src/app/onboarding/spending.tsx`: `SpendingForm` с подписью "Дальше" и кнопка "Пропустить", обе ведут `router.replace('/onboarding/reasons')`. В `StartPage` вести на `/onboarding/spending` вместо причин. Проверить в Expo Go: сценарии спеки `onboarding` (траты указаны, пропуск, перезапуск на шаге трат открывает "Сегодня", назад на старт не вернуться)
- [x] 3.2 Наполнить `src/pages/settings/ui/SettingsPage.tsx`: старт через `DateTimeField` с `max = min(now, самый ранний срыв)` и сохранением на `onChange` через `updateHabitStart`, ниже `SpendingForm` с подписью "Сохранить"; dev-кнопку сброса оставить. Данные перечитывать на фокусе. Проверить в Expo Go: сценарии спеки `settings` (сдвиг в прошлое, нельзя позже первого срыва и в будущее, после удаления срыва граница - сейчас)
- [x] 3.3 Обновить `src/pages/today/ui/TodayPage.tsx`: читать траты из `habit`, считать `savings(s.total, ...)`, показывать деньги (`formatMoney`), "не выпито N порций" и "~N ккал" по спеке `savings`, либо подсказку с переходом в `/settings`. Проверить в Expo Go: сценарии блока "Сэкономлено" (только деньги, только пресеты, ничего, возврат из настроек) и формат "12 500 ₽" на русском. Если `Intl.NumberFormat` с валютой не работает, убедиться, что срабатывает запасной формат

## 4. Документация и проверка

- [x] 4.1 Обновить `CLAUDE.md`: статус (траты, экономия, настройки старта и трат), онбординг (`spending` между `start` и `reasons`), `features/edit-spending`, `savings.ts` в `habit` и в списке файлов с относительными импортами, `formatMoney`/`portions` в i18n. Проверить, что описание совпадает с кодом
- [x] 4.2 Сбросить базу на устройстве dev-кнопкой и пройти онбординг заново, затем прогнать `yarn test`, `yarn typecheck` и `yarn lint`, все проходят без ошибок
