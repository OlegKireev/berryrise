# Tasks

## 1. Траты сохраняются сразу

- [x] 1.1 В `features/edit-spending/model/useSpendingForm.ts` сеттеры (`setAmount`, `setCurrency`, `setCount`) кладут новое состояние в state и ставят `updateSpending` со всей формой в очередь (промис в `useRef`, `.catch(console.warn)`); `save`, `saving` и параметр `onSaved` убрать. Проверка: `yarn typecheck`.
- [x] 1.2 В `SpendingForm` убрать кнопку и пропсы `submitLabel`/`onSaved`. В `pages/settings/ui/StartSpendingPage.tsx` форма без кнопки. В `pages/onboarding/ui/SpendingStepPage.tsx` вместо "Пропустить" одна кнопка `primary` "Дальше" с `router.replace('/onboarding/reasons')`. Проверка: `yarn typecheck`, `yarn lint`.
- [x] 1.3 Обновить в `CLAUDE.md` описание `edit-spending` (автосохранение через очередь записей). Проверка: описание совпадает с кодом.

## 2. API своих причин

- [x] 2.1 В `entities/reason/api/reason.ts` добавить `listCustomReasons` и `saveCustomReasons` (весь список; ключ `customReasons` в `settings`, JSON-массив, по образцу своих напитков в `entities/party`), `deleteReason(db, item: NewReason)` - мягкое удаление активной строки по `key` или `customText` вместо удаления по id; `addReason` пишет `order` подзапросом, `addReasons` убран. Экспорт через `index.ts` (`yarn lint:unused` чистый).

## 3. Фича `edit-reasons`

- [x] 3.1 Создать `features/edit-reasons/model/useReasonPicker.ts`: на фокусе грузит активные причины и `customReasons`, свои чипы = список из `settings` + тексты активных своих строк, которых в нем нет (по `order`). Действия `toggleKey`, `toggleCustom`, `add` (обрезка, существующая своя включается), `forget`: сразу меняют локальный state, запись идет в очередь. Отдает число выбранных для пустого состояния. Проверка: `yarn typecheck`.
- [x] 3.2 Создать `features/edit-reasons/ui/ReasonPicker.tsx` по образцу `DrinksSection`: `ChipRow` (готовые, потом свои; долгий тап по своей - `Alert` с подтверждением удаления, у готовых `onLongPress` нет), `AddField`, подсказка про долгий тап, если своих хотя бы одна. Строки (заголовок подтверждения, подсказка) в `features/edit-reasons/i18n.ts`, ru и en, подписи причин - через `reasonDict`. Экспорт `ReasonPicker` из `index.ts`. Проверка: `yarn typecheck`, `yarn lint:circular`.

## 4. Экраны причин

- [x] 4.1 `pages/reasons`: `ReasonsPage` - пустое состояние (если не выбрано ни одной) и `ReasonPicker`; удалить `model/useReasons.ts` и строку `addReasonTitle` из `i18n.ts`, текст `noReasons` поменять на "выбери" вместо "добавь" (ru и en). Проверка: `yarn typecheck`, `yarn lint:unused`.
- [x] 4.2 `pages/onboarding`: `ReasonsStepPage` - заголовок, подсказка, `ReasonPicker`, одна кнопка `primary` "Дальше" с `router.replace('/onboarding/notifications')`; удалить `model/useReasonsStep.ts`. В `reasonsStepHint` дописать, что можно пропустить и выбрать позже в настройках (ru и en). Проверка: `yarn typecheck`, `yarn lint:unused`.
- [x] 4.3 Обновить `CLAUDE.md`: фича `edit-reasons` в списке `features`, `customReasons` в `settings`, онбординг и `pages/reasons` без своих хуков сохранения. Проверка: описание совпадает с кодом.

## 5. Проверка

- [x] 5.1 На эмуляторе (скилл `emulator-check`): в настройках поменять сумму и валюту, выйти назад и проверить, что на "Сегодня" новая экономия; на "Мои причины" включить и выключить готовую и свою, добавить свою, повторно добавить такую же (чип один), долгим тапом удалить свою; на онбординге (после dev-сброса) выбрать причины, закрыть приложение до "Дальше" и проверить, что они сохранены; скриншоты в светлой и темной теме.
- [x] 5.2 Прогнать `yarn test`, `yarn typecheck` и `yarn lint`, все проходит.
