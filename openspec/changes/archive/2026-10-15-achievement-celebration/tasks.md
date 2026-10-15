# Tasks

## 1. Расчет медалей в фиче

- [x] 1.1 Создать `features/celebrate-achievement` и перенести загрузку истории и расчет `got`/`states`/`gotCount` из `useProgress` в `api/achievements.ts` (`loadAchievements(db, now)`); `useProgress` зовет его. Проверка: `yarn typecheck`, "Прогресс" и "Все достижения" на эмуляторе показывают то же, что до переноса
- [x] 1.2 Добавить в `entities/relapse/api` запрос "есть ли сегодня срыв" (`at` или `createdAt` в `dayRange` сегодняшнего дня, только неудаленные). Проверка: `yarn typecheck`

## 2. Решение "что праздновать"

- [x] 2.1 Написать чистую `model/celebrate.ts` по design (первый запуск, день срыва, забывание пропавших, очередь в общем порядке) и тест `celebrate.test.ts` на все сценарии `achievement-celebration` из спеки (первый запуск, итоги в день срыва, срыв и завтра, ошибочный срыв удален, медаль пропала и вернулась, две сразу). Проверка: `yarn test`
- [x] 2.2 `api/seen.ts`: чтение и запись `seenAchievements` в `settings` по образцу `features/notifications/api/prefs.ts`. Проверка: `yarn typecheck`
- [x] 2.3 `model/useCelebrate.ts` с `check()` (флаг от параллельных вызовов, запись `seen`, переход на `/achievement/<key>?celebrate=1&queue=...`) и экспорт через `index.ts`. Проверка: `yarn typecheck`, `yarn lint:unused`

## 3. Эффекты медали

- [x] 3.1 Проп `shine` у `Medal`: полоса блика с градиентом внутри `ClipPath` по внешнему контуру рамки, едет `Animated` раз в ~3 с. Проверка: на эмуляторе блик проходит по рамке и не вылезает за нее у шестиугольной и восьмиугольной медали
- [x] 3.2 `MedalMagic` в `entities/habit/ui`: свечение под медалью, пыль поверх (цвет по металлу), проп `entrance` (вспышка, рост пружиной, разлет частиц, `Haptics.notificationAsync(Success)`), у силуэта эффектов нет; хук уменьшения движения через `AccessibilityInfo`. Экспорт через `index.ts`. Проверка: `yarn typecheck`
- [x] 3.3 Убрать `expo-haptics` из `ignoreDependencies` в `knip.json` и из заметки про неиспользуемые пакеты в `CLAUDE.md`. Проверка: `yarn lint:unused`

## 4. Карточка медали

- [x] 4.1 Роут `src/app/achievement/[key].tsx` и `Stack.Screen` в корневом layout с `presentation: 'transparentModal'` без шапки. Проверка: `yarn typecheck`
- [x] 4.2 `AchievementPage` в `pages/progress` на `useProgress`: темная подложка (тап закрывает), `MedalMagic` с `key={achievement}`, название, дата или "еще N", при `celebrate` подпись "Новое достижение" и вход, кнопка "Дальше" (`router.setParams` со следующим из `queue`) или "Закрыть". Строки ru и en в `pages/progress/i18n.ts`. Проверка: `yarn typecheck`
- [x] 4.3 `onPress` у `MedalTile`, переход из `Achievements` и `AchievementsPage`. Проверка: на эмуляторе тап по медали открывает карточку, у полученной есть эффект, у силуэта нет

## 5. Проверка новых медалей

- [x] 5.1 Вызвать `check()` на фокусе `TodayPage` и `ProgressPage` и после ответа на вечеринку в `useToday`. Проверка: `yarn typecheck`
- [x] 5.2 Проверить на эмуляторе (`emulator-check`, данные через `seed`): первый запуск с медалями без праздника; серия дошла до 7 дней - празднуется при открытии; седьмые итоги - празднуются после закрытия итогов; срыв сегодня - празднования нет, после сдвига даты на завтра - есть; две медали сразу - "Дальше" и "Закрыть"; уменьшение движения - без анимации. Скриншоты в светлой и темной теме

## 6. Документация и финал

- [x] 6.1 Обновить `CLAUDE.md`: фича `celebrate-achievement` (расчет медалей, `seenAchievements`, где зовется `check`), роут `achievement/[key]`, `MedalMagic` и `shine` у `Medal`, `celebrate.ts` в списке файлов с тестами и относительными импортами; статус в начале файла. Проверка: описание совпадает с кодом
- [x] 6.2 Прогнать `yarn test`, `yarn typecheck` и `yarn lint`, все зеленое
