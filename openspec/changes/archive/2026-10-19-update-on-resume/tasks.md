# Tasks

## 1. Возврат из фона

- [x] 1.1 `useUpdateOnResume()` в `src/shared/lib/updates.ts`: `AppState`, время ухода в фон в `useRef`, порог `RESUME_RELOAD_AFTER = HOUR_MS`; при возврате после порога `reloadAsync()`, если `useUpdates().isUpdatePending`, иначе `checkForUpdateAsync()` и `fetchUpdateAsync()` без перезапуска; при `!otaEnabled` (`Updates.isEnabled && !__DEV__`: в dev-клиенте `isEnabled` true) ничего; ошибки глотаются без журнала. Экспорт через `index.ts`. Проверка: `yarn lint:unused` чистый
- [x] 1.2 Вызов `useUpdateOnResume()` в `Background` корневого `src/app/_layout.tsx`. Проверка: dev-сборка с Metro при сворачивании и возврате не перезапускается и не пишет ошибок в консоль

## 2. Ручная проверка

- [x] 2.1 `src/pages/settings/model/useCheckUpdate.ts`: `{ available, checking, check }` - проверка, скачивание и `reloadAsync`; нет обновления - `toast(t('upToDate'))`; ошибка - `Alert` с `t('updateFailed')` и `logError('updates', e)`; повторный вызов при `checking` игнорируется
- [x] 2.2 Строки `checkUpdates` ("Проверить обновления" / "Check for updates"), `checking` ("Проверяю…" / "Checking…"), `upToDate` ("Установлена последняя версия" / "You have the latest version"), `updateFailed` ("Не удалось проверить обновления. Проверь интернет и попробуй еще раз." / "Couldn't check for updates. Check your connection and try again.") в `src/pages/settings/i18n.ts`
- [x] 2.3 `AboutPage`: строка `Row` над "Журналом" с подписью `checkUpdates` или `checking`, `onPress={check}`, только при `available`. Проверка: в dev-сборке строки нет

## 3. Документация и проверка

- [x] 3.1 CLAUDE.md: `useUpdateOnResume` и порог в описании `expo-updates`, строка "Проверить обновления" в "О приложении" (статус и `pages/settings`). README, раздел OTA: проверка на телефоне кнопкой вместо двух перезапусков, применение при возврате после часа
- [x] 3.2 На preview-сборке телефона: опубликовать обновление `yarn update:preview`, нажать "Проверить обновления" - приложение перезапускается, в "О приложении" новый id; второй тап на той же версии - тост "Установлена последняя версия"; без сети - алерт
- [x] 3.3 (первый прогон: перезапуска не было; по журналу `isUpdatePending` теряет событие, см. группу 4) На preview: опубликовать еще одно обновление, открыть приложение (скачивается), свернуть, перевести часы на час вперед, вернуться - приложение перезапускается на новом id; свернуть на минуту - без перезапуска
- [x] 3.4 Прогнать `yarn test`, `yarn typecheck` и `yarn lint`, все зеленые

## 4. Надежный перезапуск и тост

- [x] 4.1 `useUpdateOnResume`: если `isUpdatePending` false - проверка и скачивание, и при конце скачивания не позже `RELOAD_WINDOW` (3 с) от возврата - перезапуск. Убрать временную запись `resume away=...`, решения после часа и ошибки писать `log`/`logError` с тегом `updates`
- [x] 4.2 `reloadForUpdate()` (метка `Paths.document/update-reloaded` + `reloadAsync`, при ошибке метку удалить) и `consumeUpdateReloaded()` в `shared/lib/updates.ts`; хук возврата и `useCheckUpdate` перезапускаются через `reloadForUpdate`
- [x] 4.3 `Background` в `src/app/_layout.tsx`: на монтировании `consumeUpdateReloaded()` - `toast(t('appUpdated'))`; строка `appUpdated` ("Приложение обновлено" / "App updated") в `src/shared/i18n/common.ts`. Проверка: `yarn lint:circular` чистый
- [x] 4.4 CLAUDE.md: окно перезапуска, метка и тост в описании `expo-updates`
- [x] 4.5 (перерыв считается тиками, не по событию `background`; часы сдвигать на 1 ч 10 мин) На preview: опубликовать обновление, холодный старт (скачивается), свернуть, часы на час вперед, вернуться - перезапуск на новый id и тост "Приложение обновлено"; в журнале `resume: ...`. Еще раз: процесс перезапустить вручную после скачивания (`am force-stop` не годится - это холодный старт; вместо него опубликовать новое обновление уже после старта) и проверить путь `pending=false` - `check` - `fetched` - перезапуск с тостом. "Проверить обновления" - тоже тост после перезапуска
- [x] 4.6 Прогнать `yarn test`, `yarn typecheck`, `yarn lint`, все зеленые
