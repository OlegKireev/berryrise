# Tasks

## 1. Журнал в shared

- [x] 1.1 `shared/lib/log.ts`: тип тегов, `log`, `logError` (синхронный append JSON-строки, стек до 4000 символов, `console.warn`, все в `try`), `readLog`, `clearLog`, `logFile`, `trimLog` (до 1000 записей, удаление `widget.log`), чистые `parseLog` и `trimLines`; экспорт из `shared/lib/index.ts`. Проверка: `log.test.ts` - битая строка пропускается, свежие первыми, `trimLines` оставляет хвост, `yarn test` зеленый
- [x] 1.2 `shared/lib/files.ts`: `saveFile({ uri, name, mime })` (имя, `null` при отмене, бросает при ошибке) и `shareFile(uri, mime)`; `features/backup/model/useExport.ts` перевести на них. Проверка: на эмуляторе экспорт "Сохранить на телефон" и "Отправить" работают как раньше, отмена диалога молча

## 2. Перехват ошибок

- [x] 2.1 `index.ts`: `trimLog()` и `ErrorUtils.setGlobalHandler`, который вызывает `logError('global', e)` и прежний обработчик. Проверка: dev-кнопкой или временным `throw` в обработчике нажатия запись `global` появляется в журнале, redbox в dev остается
- [x] 2.2 Слайс `pages/error`: `ErrorPage` (сообщение и кнопка "Заново" через `retry`), `model/useErrorPage.ts` пишет `logError('render', error)`, строки ru/en в `pages/error/i18n.ts`; в `src/app/_layout.tsx` - `export { ErrorPage as ErrorBoundary } from '@/pages/error'`. Проверка: временный `throw` в рендере экрана показывает экран ошибки в обеих темах, "Заново" после снятия `throw` рисует экран, в журнале запись `render`
- [x] 2.3 Заменить `console.warn` на `logError` с тегом: `useReasonPicker` (`reasons`), `useSpendingForm` (`spending`), `notifications/model/sync.ts` (`notifications`), `useNotificationsStep` (`onboarding`), `updateWidget.tsx` (`widget`). Проверка: `grep -rn "console.warn" src` пустой, кроме `shared/lib/log.ts`
- [x] 2.4 Виджет: `logWidget` заменить на `log('widget', ...)` с тем же содержимым, удалить `features/widget/model/log.ts` и его экспорт из `features/widget/index.ts`. Проверка: `emu.py` - добавить виджет и прогнать обновление, в журнале событие `widget` с действием, именем и числом; `yarn lint:unused` чистый

## 3. Экран журнала

- [x] 3.1 `pages/settings`: `model/useLog.ts` (`readLog` на фокусе, первые 200 записей, `save` через копию в `Paths.cache/berryrise-log-YYYY-MM-DD.txt` и `saveFile`, `share`, `clear`), `ui/LogPage.tsx` (запись - `Pressable` с временем, уровнем, тегом и сообщением; ошибки цветом `relapse`, стек раскрывается тапом; пустое состояние; кнопки "Сохранить на телефон", "Отправить" недоступны при пустом журнале, "Очистить" с `Alert`-подтверждением), экспорт `LogPage` из `index.ts`, роут `src/app/settings/log.tsx` и регистрация в корневом `Stack` с заголовком "Журнал" (общее название экрана - в `shared/i18n/common.ts`). Строки ru и en в `pages/settings/i18n.ts`. Проверка: на эмуляторе в светлой и темной теме - порядок свежие сверху, раскрытие стека, сохранение в Download с тостом "Сохранено", "Отправить" открывает "Поделиться", очистка с подтверждением и отменой
- [x] 3.2 `AboutPage`: убрать кнопку и хвост журнала виджета и `TODO(widget-log)`, добавить `Row` "Журнал" с `href="/settings/log"`; удалить ключи `shareWidgetLog` и `widgetLogEmpty`. Проверка: на эмуляторе "О приложении" - строка "Журнал" открывает экран, "назад" возвращает обратно

## 4. Документация и проверка

- [x] 4.1 `CLAUDE.md`: журнал в `shared/lib` (файл, формат, теги, лимит, обрезка в `index.ts`), `files.ts`, слайс `pages/error` и `ErrorBoundary` в корневом layout, экран `settings/log` в навигации, из описания `widget` убрать временный журнал; правило "ошибки не глотаем в `console.warn`, а пишем через `logError`" в конвенции. Проверка: в `CLAUDE.md` нет упоминаний `widget.log` и `logWidget`
- [x] 4.2 `yarn test`, `yarn typecheck`, `yarn lint`, `yarn lint:unused`, `yarn lint:circular` проходят

## Workflow follow-up

- После проверки на телефоне - `/opsx:archive error-log`.
