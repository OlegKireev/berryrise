# Tasks

## 1. Уведомление в дни риска

- [x] 1.1 В `features/notifications/i18n.ts` (ru и en) новый текст `notify.risk`: "Вечер впереди" / "Идешь в компанию? Возьми с собой поддержку", кнопки "Иду" и "Не иду"
- [x] 1.2 В `setup.ts` категории `risk` кнопки `company` ("Иду") и `skip` ("Не иду") с `opensAppToForeground: false`; поправить комментарий про "все кнопки открывают приложение"
- [x] 1.3 В `useNotificationResponse.ts` для `risk` с действием `skip` не открывать режим (уведомление закрывается уже существующим `dismissNotificationAsync`)
- [x] 1.4 Поставить `expo-task-manager` (`npx expo install`), фоновая задача уведомлений в `features/notifications` закрывает уведомление по "Не иду", регистрация в корневом `index.ts`; обновить стек в `CLAUDE.md`

## 2. "Сегодня"

- [x] 2.1 `useToday` отдает признак `partyEnded` (`expectedEndAt <= Date.now()` на загрузке), убрать `cancelParty`
- [x] 2.2 Плашка вечера в `pages/today/ui` на `Button variant="primary"` с `children`: "Вечер в компании", "до <время>", иконка `chevronRight`, `href="/company"`
- [x] 2.3 `PartyCard` оставить только "Как прошло?" и две кнопки "Без алкоголя" / "Выпил"; `TodayPage` выбирает плашку или карточку по `partyEnded`
- [x] 2.4 Строки в `pages/today/i18n.ts` (ru и en): подпись плашки, убрать `partyOpen`, `partyCancel`, `partyCardUntil`, если больше не нужны

## 3. Режим компании

- [x] 3.1 В `useCompany` действия `leave` ("Уже ушел": `setPartyResult` трезвый, `syncNotifications`, `router.replace` на `/day-review?day=<день начала>`) и `cancel` (`cancelParty`, `syncNotifications`, `router.back()`)
- [x] 3.2 В `CompanyPage` внизу кнопка "Уже ушел" и тихая "Не пошел" (в `footer` у `Screen` или после текста про уход), строки в `pages/company/i18n.ts` (ru и en)

## 4. Документация

- [x] 4.1 В `docs/idea.md` обновить разделы про режим компании, уведомление в дни риска и экран "Сегодня"
- [x] 4.2 В `CLAUDE.md` поправить упоминания карточки вечеринки, если они расходятся с новым поведением

## 5. Проверка

- [x] 5.1 На эмуляторе (`emulator-check`): плашка до конца, карточка после (сдвиг времени), "Уже ушел" -> вечер трезвый -> итоги -> "Сегодня" без "Как прошло?", "Не пошел" из режима, обе темы
- [x] 5.2 На эмуляторе: уведомление дней риска, "Не иду" при живом и убитом приложении закрывает уведомление и не открывает приложение; если не закрывает - запасной путь из design.md
- [x] 5.3 `yarn test`, `yarn typecheck` и `yarn lint`
