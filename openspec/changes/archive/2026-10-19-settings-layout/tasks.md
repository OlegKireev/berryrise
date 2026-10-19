# Tasks

## 1. Общие блоки в shared/ui

- [x] 1.1 Добавить иконки `calendar` и `bellOff` в мапу `Icon.tsx` (по одной из `lucide-react-native/icons/<name>`); проверка: `yarn typecheck`
- [x] 1.2 Добавить `Group({ label, children })` (подпись и `Card` со строками без лишних отступов) и `Notice({ icon, children })` (`Card` с иконкой слева), экспортировать из `shared/ui/index.ts`; проверка: `yarn typecheck`, `yarn lint`
- [x] 1.3 Вынести Android-логику `DateTimeField` в экспортируемую `pickDate({ value, min, max, onChange })` в том же файле, `DateTimeField` зовет ее; проверка: на эмуляторе дата в итогах дня и в онбординге выбирается как раньше

## 2. Подтверждение более позднего старта

- [x] 2.1 `loadAchievements(db, now, startAt?)`: необязательный старт вместо `habit.startAt` и `current` в результате; проверка: `yarn typecheck`, "Прогресс" и празднование работают как раньше
- [x] 2.2 Чистая `pages/settings/model/startChange.ts` (`null` или `{ streak?: { from, to }, medalsLost }`) и тест рядом: старт раньше - `null`, позже без срывов - стрик, позже при срывах - только медали, без потерь - `null`; проверка: `yarn test`

## 3. Хаб настроек

- [x] 3.1 Расширить `useSettings`: на фокусе грузить привычку, срывы, причины, настройки и запрет уведомлений; отдавать `startAt`, `maxStart`, `spending`, `reasonCount`, `notifications`, `checkStart`, `changeStart`; проверка: `yarn typecheck`
- [x] 3.2 Собрать `SettingsPage` из двух `Group` ("Мой отказ", "Приложение") со значениями строк по спеке; строка "Дата старта" на Android открывает `pickDate`, на iOS справа `DateTimeField mode="date"`; перед сохранением более поздней даты `Alert` с текстом из `startChange`; проверка: на эмуляторе сценарии "Значения в строках хаба" и "Подтверждение более позднего старта" из `specs/settings`
- [x] 3.3 Строки в `shared/i18n/common.ts` (`spending` "Траты", `backup` "Резервная копия", `startDate` "Дата старта" вместо `startSpending` и `exportImport`) и в `pages/settings/i18n.ts` (подписи групп, значения, тексты подтверждения), ru и en; проверка: `yarn typecheck` (en совпадает с ru по ключам)

## 4. Разделы

- [x] 4.1 `StartSpendingPage` -> `SpendingPage` только с формой трат, роут `app/settings/start.tsx` -> `spending.tsx`, экран в корневом `Stack` с заголовком "Траты", ссылка из `pages/today/ui/Savings.tsx` на `/settings/spending`; проверка: на эмуляторе тап по "Сэкономлено" и строке "Траты" открывает экран трат
- [x] 4.2 `AboutPage`: версия без слова "обновление", дисклеймер в `Notice` с `info`, строки в `Group` без подписи; убрать неиспользуемый ключ `update`; проверка: на эмуляторе сценарии "О приложении"
- [x] 4.3 `BackupPage`: `backupHint` разделить на `exportHint` над экспортом и `importHint` над импортом, ru и en; проверка: на эмуляторе сценарий "Открытие экрана" из `specs/backup`
- [x] 4.4 `NotificationsPage`: плашка запрета в `Notice` с `bellOff` и кнопкой "Включить в настройках"; проверка: на эмуляторе с запрещенными уведомлениями и включенными итогами дня

## 5. Документация и проверка

- [x] 5.1 Обновить `CLAUDE.md` (экраны `settings`: `spending` вместо `start`, `Group`, `Notice`, `pickDate` в списке `shared/ui`, `loadAchievements` со стартом) и описание хаба в `docs/idea.md`; проверка: в тексте нет "Старт и траты" и "Экспорт и импорт"
- [x] 5.2 Скриншоты хаба, "О приложении", "Резервной копии" и "Уведомлений" на эмуляторе в светлой и темной теме (скилл `emulator-check`); проверка: группы и карточки читаются в обеих темах
- [x] 5.3 Прогнать `yarn test`, `yarn typecheck` и `yarn lint`; проверка: все три без ошибок

## Workflow follow-up

- `/opsx:archive settings-layout` после проверки.
