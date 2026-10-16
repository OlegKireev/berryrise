# Tasks

## 1. Нативное: id, название, иконка (одна пересборка)

- [x] 1.1 `app.json`: `name` "Морс", `slug` и `scheme` `berryrise`, `android.package` и `ios.bundleIdentifier` `com.berryrise.app`, `adaptiveIcon.backgroundImage: ./assets/android-icon-background.png` вместо `backgroundColor`; проверка - `npx expo config --type prebuild` показывает новые значения
- [x] 1.2 SVG в `assets/src/` по design.md (вариант E5): новый `android-icon-background.svg` (заливка и свечение, пересчитанное под знак, уменьшенный на 2/3), `android-icon-foreground.svg` (ягода с градиентом, блик, хвостик, линии), `android-icon-monochrome.svg` (силуэт белым, без блика), `icon.svg` (все на весь квадрат), `splash-icon.svg` (медальон r=36 с заливкой и свечением); комментарии в файлах обновить; проверка - открыть SVG и сверить с превью E5
- [x] 1.3 `yarn icons`: добавить `android-icon-background` в список и собрать PNG; проверка - `sips -g pixelWidth -g hasAlpha assets/*.png` показывает 1024, у background и `icon.png` фон непрозрачный
- [x] 1.4 `docs/idea.md`, раздел "Дизайн": строка про иконку (ягода над горизонтом, чернила со свечением, цвета) вместо солнца на шалфее; в CLAUDE.md про сплэш и иконку упомянуть фон adaptive icon картинкой

## 2. Код: база, резервная копия, строки

- [x] 2.1 `src/app/_layout.tsx`: `databaseName="berryrise.db"`; проверка - `yarn typecheck`
- [x] 2.2 `src/features/backup/model/format.ts`: `APP = 'com.berryrise.app'`, `LEGACY_APP = 'dev.olegkireev.quit'` с комментарием "удалить после переноса данных автора", `parseBackup` принимает оба, имя файла `berryrise-...json`; в `format.test.ts` новые имена файлов и тест, что файл с `LEGACY_APP` принимается, а с чужим маркером - `notBackup`; проверка - `yarn test`
- [x] 2.3 i18n: `backup` (`notBackup`: ru "Морс", en "Berryrise"), `notifications` (подсказка про автозапуск: ru "Морс", en сверить, что названия нет или "Berryrise"), `onboarding` (`introTitle` ru "Морс"); проверка - `grep -rn "Решено\|Resheno" src` пусто
- [x] 2.4 CLAUDE.md: маркер файла бэкапа `com.berryrise.app` и временный прием старого, имя базы

## 3. Инструменты и документы

- [x] 3.1 `package.json`: `name` `berryrise`, пути `dist/berryrise-dev.apk` и `dist/berryrise-preview.apk` в `build:local:*` и `install:*`; `yarn install` обновляет `yarn.lock`; проверка - `grep resheno package.json yarn.lock` пусто
- [x] 3.2 Скилл `emulator-check`: в `scripts/emu.py` `PKG = 'com.berryrise.app'`, deeplink `exp+berryrise://...`, `DB = 'files/SQLite/berryrise.db'`, докстринг; в `SKILL.md` название "Морс"; проверка - `python3 -m py_compile` и `grep` без старых значений
- [x] 3.3 README и CLAUDE.md: заголовок, пакет `com.berryrise.app`, пути APK, абзац про первую сборку с новым keystore; в `docs/idea.md` заголовок и раздел "Название" (RU "Морс: трезвая жизнь", под иконкой "Морс", EN "Berryrise", id `com.berryrise.app`, почему ушли от "Решено": чужой товарный знак 864547 и приложение в RuStore; Стеклышко, Ясно, Довольно - в отклоненные); проверка - `grep -rni "resheno\|решено\|olegkireev.quit" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=archive .` находит только `LEGACY_APP`, его тест, CLAUDE.md про временный прием, спеку `backup` и этот change

## 4. EAS и проверка в приложении

- [x] 4.1 Попросить автора переименовать проект на expo.dev в `berryrise` (или согласовать запасной путь из design.md); проверка - `yarn eas project:info` показывает slug `berryrise` без ошибки несовпадения
- [x] 4.2 Эмулятор: удалить `dev.olegkireev.quit`, `emulator-check up` пересобирает dev build; проверить скриншотами: подпись "Морс" и новая иконка в лаунчере на светлых и темных обоях, в круглой маске свечение по центру ягоды, тематическая иконка - силуэт, сплэш в светлой и темной теме, онбординг с заголовком "Морс"
- [x] 4.3 Эмулятор: импорт файла с маркером `dev.olegkireev.quit` на первом шаге онбординга открывает "Сегодня" с данными; новый экспорт называется `berryrise-...json` и содержит `"app": "com.berryrise.app"`; чужой JSON дает сообщение про "Морс" (и "Berryrise" в английской локали)
- [x] 4.4 Напомнить автору: первая сборка для телефона (`yarn build:local:dev`) интерактивная, чтобы EAS сгенерировал keystore для `com.berryrise.app`; перенос данных по Migration Plan из design.md
- [x] 4.5 Автор перенес данные: убрать `LEGACY_APP` из `format.ts`, его тест, сценарии про старый id из дельт `backup` и `onboarding`, упоминание в CLAUDE.md; проверка - `yarn test`, `grep -rn olegkireev.quit src` пусто

## 5. Финальные проверки

- [x] 5.1 `yarn test`, `yarn lint:unused`, `yarn typecheck` и `yarn lint` проходят

## Workflow follow-up

- После переноса данных на телефоне архивировать change (`/opsx:archive`); спеки `app-theme`, `backup`, `onboarding` получат дельты.
