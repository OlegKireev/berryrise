# Tasks

## 1. Зависимости, development build и проверка кнопок

- [x] 1.1 `npx expo install expo-notifications`, плагин в `app.json`; проверить `yarn doctor`
- [x] 1.2 `expo-dev-client`, `eas.json` с профилем `development` (APK, internal); собрать dev build через EAS и поставить на телефон
- [x] 1.3 Проверка на телефоне в development build: канал, категория с двумя кнопками (одна `opensAppToForeground: false`), уведомление через 10 секунд; проверить, что кнопки видны, ответ доходит до `useLastNotificationResponse` при живом и убитом приложении, а уведомление после кнопки пропадает. Результат записать в design (раздел Risks), временный код удалить

## 2. Модель уведомлений

- [x] 2.1 `features/notifications`: `model/types.ts` (`NotificationPrefs`, значения по умолчанию) и `api/prefs.ts` (`getPrefs`/`savePrefs`, ключ `notifications` в `settings`, нет строки - все выключено); проверить `yarn typecheck`
- [x] 2.2 `model/plan.ts` по design: 14 дней, пропуск заполненных итогов по `reviewDay`, пропуск дней риска с вечеринкой, "как прошло?" на `expectedEndAt`; относительные импорты с `.ts`
- [x] 2.3 `model/plan.test.ts`: выключенное не планируется, прошедшее время сегодня не планируется, заполненные итоги пропускают день, вечеринка пропускает день риска, у каждого дня риска свое время, "как прошло?" только для будущего конца, переход на летнее время (конец марта в Europe/Berlin) не сдвигает 21:00; `yarn test`
- [x] 2.4 Запросы для плана: даты сохраненных итогов (`day-review`) и дни начала неудаленных вечеринок (`party`) за период, если существующих api не хватает; проверить `yarn typecheck`
- [x] 2.5 `model/setup.ts` (канал `reminders`, категории `dayReview`, `risk`, `party`, `setNotificationHandler`) и `model/sync.ts` (`syncNotifications(db)`: cancel all и schedule по плану, вызовы выстроены в цепочку); проверить `yarn typecheck`
- [x] 2.6 `model/useNotificationResponse.ts`: маршруты по таблице из design, проверка, что вечеринка еще идущая, `clearLastNotificationResponseAsync`; экспорт из `index.ts`
- [x] 2.7 i18n ru/en фичи: заголовки и тексты трех уведомлений, кнопки, подписи формы, подсказка про автозапуск

## 3. Подключение

- [x] 3.1 Корневой `_layout.tsx`: внутри `SQLiteProvider` компонент, который вызывает setup, `syncNotifications` при старте и при `AppState` → `active`, и `useNotificationResponse`; проверить, что приложение стартует в Expo Go
- [x] 3.2 `syncNotifications` в `useToday.load`, в `useCompany` после `startParty` и смены конца; проверить на телефоне: старт вечеринки с концом через 2 минуты дает "как прошло?", ответ на карточке до конца его снимает
- [x] 3.3 Определение Xiaomi и подобных по `Platform.constants.Manufacturer` (функция в фиче); `ui/AutostartHint.tsx` с кнопкой `Linking.openSettings()`

## 4. Форма и экраны

- [x] 4.1 `shared/ui/TimeField.tsx`: только время, значение в минутах, на Android `DateTimePickerAndroid.open({ mode: 'time' })`, на iOS инлайн-пикер; экспорт из `shared/ui`
- [x] 4.2 `ui/NotificationForm.tsx` (контролируемая): переключатели трех видов, время итогов, чипы дней риска (`weekdays` с понедельника → `getDay`) и время у каждого выбранного дня, новый день на 17:00
- [x] 4.3 Настройки: `NotificationsSection` и `model/useNotificationSettings.ts` (сохранение сразу, запрос разрешения при `undetermined` и включенном виде, `syncNotifications`, статус разрешения при фокусе, строка "выключены в системе" с `Linking.openSettings()`), подсказка на устройствах из списка; строки страницы в `pages/settings/i18n.ts`; проверить на телефоне сценарии дельты `settings` и требования про разрешение
- [x] 4.4 Онбординг: роуты `onboarding/notifications` и `onboarding/autostart`, страницы и хук шага; шаг причин ведет на шаг уведомлений; "Дальше" сохраняет, запрашивает разрешение и синхронизирует, "Пропустить" ничего не сохраняет; строки в `pages/onboarding/i18n.ts`; проверить после dev-сброса сценарии дельты `onboarding`

## 5. Проверка сценариев на телефоне

- [x] 5.1 Итоги дня: напоминание через пару минут приходит; после сохранения итогов за этот день не приходит; "Заполнить" открывает итоги того дня и убирает уведомление
- [x] 5.2 Дни риска: напоминание на сегодняшний день недели приходит; если до него открыть режим компании, не приходит; "Иду в компанию" открывает режим
- [x] 5.3 "Как прошло?": "Без алкоголя" из уведомления пишет трезвую вечеринку и открывает "Сегодня"; "Выпил" открывает модалку срыва; кнопка старого уведомления после ответа на карточке ничего не меняет

## 6. Документация и проверка

- [x] 6.1 `CLAUDE.md`: статус, стек (`expo-notifications` установлен), слайс `features/notifications`, `TimeField` в `shared/ui`, шаги онбординга, точки синхронизации; `docs/idea.md`: свой переключатель у "как прошло?", шаги онбординга, 14 дней вперед; проверить, что описание совпадает с кодом
- [x] 6.2 `yarn test`, `yarn lint:unused`, `yarn lint:circular`
- [x] 6.3 `yarn typecheck` и `yarn lint`
