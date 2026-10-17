# Tasks

## 1. Заголовки и плейсхолдер

- [x] 1.1 В `src/pages/today/i18n.ts` строка `reasonOfDay`: "Ради чего я не пью" / "What I'm staying sober for"; на "Сегодня" над причиной дня новый заголовок
- [x] 1.2 `ReasonList` в `src/entities/reason/ui/ReasonList.tsx` принимает проп `title`, строка `myReasons` удалена из `src/entities/reason/i18n.ts` (ru и en); `yarn typecheck` проходит
- [x] 1.3 В `src/pages/company/i18n.ts` строка `reasonsTitle`: "Помни, ради чего ты не пьешь" / "Remember why you don't drink", `CompanyPage` передает ее в `ReasonList`; в режиме компании список под новым заголовком
- [x] 1.4 В `src/entities/reason/i18n.ts` строка `customReason`: "Например, ради дочери" / "For example, my kids"; пустое поле своей причины в "Моих причинах" показывает пример

## 2. Итоги дня без причин

- [x] 2.1 Убрать `ReasonList` из `src/pages/day-review/ui/DayReviewPage.tsx`, `listReasons` и `reasons` из `src/pages/day-review/model/useDayReview.ts`; итоги дня начинаются с заголовка и вопросов, `yarn lint:unused` чистый
- [x] 2.2 Документация: в `docs/idea.md` (раздел "Мои причины") причины показываются на "Сегодня" и в режиме компании, без итогов дня; в `openspec/specs/reasons/spec.md` Purpose без итогов дня (напоминает в причине дня и в режиме компании)

## 3. Проверка

- [x] 3.1 На эмуляторе (`emulator-check`) с причинами "здоровье" и своей "ради дочери": скриншоты "Сегодня", режима компании, итогов дня и "Моих причин" с пустым полем, ru и en
- [x] 3.2 `yarn test`, `yarn typecheck` и `yarn lint` проходят

## Workflow follow-up

- Архивировать изменение через `/opsx:archive` после проверки.
