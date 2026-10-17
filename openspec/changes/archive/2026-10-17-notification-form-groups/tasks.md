# Tasks

## 1. Плавное раскрытие

- [x] 1.1 Добавить `Collapse` в `src/shared/ui/Collapse.tsx` (проп `open`, `Animated` по высоте с замером через абсолютный внутренний блок, размонтирование после сворачивания, без анимации на первом замере и при `useReduceMotion()` не `false`) и экспорт в `shared/ui/index.ts`; проверить `yarn typecheck`
- [x] 1.2 Описать `Collapse` в списке базовых компонентов `shared/ui` в `CLAUDE.md`; проверить, что строка есть

## 2. Карточки видов

- [x] 2.1 В `src/features/notifications/i18n.ts` (ru и en) поменять `form.party` на "Как прошло?" / "How did it go?", переписать `form.riskHint`, добавить `form.dayReviewHint` и `form.partyHint` по таблице из design.md; проверить `yarn typecheck`
- [x] 2.2 Добавить `NotificationGroup` в `src/features/notifications/ui/` (`Card`: заголовок с `Switch` с `accessibilityLabel`, описание `hint`, `Collapse` с настройками); проверить `yarn typecheck`
- [x] 2.3 Переписать `NotificationForm` на три `NotificationGroup`, убрать подпись над чипами дней риска; проверить, что онбординг и настройки компилируются без правок страниц (`yarn typecheck`)
- [x] 2.4 Обновить описание `notifications` в `CLAUDE.md` (форма из карточек `NotificationGroup` с описаниями)

## 3. Проверка в приложении

- [x] 3.1 Скиллом `emulator-check` пройти шаг уведомлений онбординга и экран "Уведомления" в настройках: три карточки с описаниями, плавное раскрытие и сворачивание итогов дня и дней риска, плавное добавление дня риска, без анимации при открытии с включенными видами; скриншоты в светлой и темной теме, ru и en
- [x] 3.2 На эмуляторе включить "уменьшить движение" (удалить анимации в настройках разработчика) и проверить, что настройки появляются сразу
- [x] 3.3 Прогнать `yarn test`, `yarn typecheck` и `yarn lint`, все зеленое

## Workflow follow-up

- Архивировать изменение через `/opsx:archive` после проверки.
