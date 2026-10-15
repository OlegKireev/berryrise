## 1. Ассеты

- [x] 1.1 SVG-исходники в `assets/src/` (холст 108x108, геометрия и цвета из design.md): `icon.svg` (фон `#34504C` на весь квадрат, знак без масштаба), `android-icon-foreground.svg` (прозрачный фон, знак в `scale(2/3)` вокруг 54,54), `android-icon-monochrome.svg` (то же, все белым, с прозрачностью отражений), `splash-icon.svg` (прозрачный фон, круг `#34504C` диаметром 72 по центру, внутри знак в пропорциях иконки); проверка - открыть SVG и сверить с макетом варианта 8
- [x] 1.2 Скрипт `yarn icons` в `package.json`: рендер четырех SVG в PNG 1024x1024 в `assets/` через `yarn dlx @resvg/resvg-js-cli` (бинарь и флаг размера сверить); проверка - `sips -g pixelWidth -g hasAlpha` показывает 1024 и альфу у foreground, monochrome и splash, а у `icon.png` фон непрозрачный
- [x] 1.3 Удалить `assets/favicon.png` и `assets/android-icon-background.png`; проверка - `grep` по репо не находит ссылок на них

## 2. Конфиг и сплэш

- [x] 2.1 `npx expo install expo-splash-screen` (при YN0016 - `yarn add` предыдущего патча); `yarn audit` и `yarn doctor` без новых ошибок
- [x] 2.2 `app.json`: `adaptiveIcon.backgroundColor` `#34504C` без `backgroundImage`; плагин `expo-splash-screen` с `image: ./assets/splash-icon.png`, `imageWidth: 200`, `backgroundColor: #F4F1EA`, `dark.backgroundColor: #1A1917`; проверка - `npx expo config --type prebuild` показывает плагин и цвета
- [x] 2.3 `src/app/_layout.tsx`: `SplashScreen.preventAutoHideAsync()` на уровне модуля, `SplashScreen.hide()` и рендер при `loaded || error` у `useFonts`; убрать ponytail-комментарий про мигание первого кадра, если он больше не актуален
- [x] 2.4 `src/shared/ui/theme.ts`: комментарий у токенов `background`, что они повторены в `app.json` для сплэша

## 3. Проверка на эмуляторе

- [x] 3.1 Пересобрать dev build (`emulator-check up`, нативные входы поменялись) и проверить скриншотами: иконка в лаунчере на светлых и темных обоях, по размеру как на макете; тематические иконки Android 13+ показывают монохромный силуэт; холодный старт в светлой и темной теме - медальон по центру на фоне темы, край круга не срезан, без пустого кадра перед первым экраном; при необходимости подобрать `imageWidth`
- [x] 3.2 Если запланированы другие нативные изменения, напомнить пользователю собрать телефонный APK (`yarn build:local:dev` / `build:local:preview`) один раз после всех

## 4. Документация и финальные проверки

- [x] 4.1 `CLAUDE.md`: `expo-splash-screen` в стеке (сплэш держится до загрузки шрифтов), команда `yarn icons` в разделе "Команды", исходники иконок в `assets/src/`; `README.md`, если там есть раздел про ассеты; в `docs/idea.md` раздел "Дизайн" - строка про иконку (солнце над горизонтом, глубокий шалфей) и сплэш (медальон на фоне темы)
- [x] 4.2 `yarn test`, `yarn lint:unused`, `yarn typecheck` и `yarn lint` проходят

## Workflow follow-up

- После проверки на телефоне архивировать change (`/opsx:archive`).
