## 1. Зависимость и Icon

- [x] 1.1 `npx expo install lucide-react-native` (при YN0016 из-за age gate `yarn add` предыдущей версии); `yarn audit` чистый
- [x] 1.2 `shared/ui/Icon.tsx`: тип `IconName` (`settings`, `chevronLeft`, `chevronRight`, `wallet`, `heart`, `bell`, `info`), мапа на компоненты Lucide, импортированные по одной иконке (путь сверить с `exports` пакета), пропсы `name`, `size` = 24, `color` = `colors.text`, `strokeWidth` 1.75 с `nonScalingStroke`; `Icon` и `IconName` только внутри `shared/ui`, наружу через `icon` у `Button` и `Row`

## 2. Базовые компоненты

- [x] 2.1 `Button`: пропсы объединением `{ title }` | `{ icon, accessibilityLabel }`, иконка 22 в цвете `fg` варианта
- [x] 2.2 `Row`: проп `icon` слева (`colors.text`, 22), шеврон `chevronRight` справа вместо "›" (`colors.muted`, 20); обе иконки скрыты от диктора

## 3. Места использования

- [x] 3.1 `app/(tabs)/_layout.tsx`: `SettingsButton` - `Button variant="ghost" icon="settings"` с `router.push('/settings')` и `accessibilityLabel`, без `Link`; у `Button` новый вариант `ghost` (прозрачная, цвет текста, без подчеркивания)
- [x] 3.2 `pages/progress/ui/PeriodNav.tsx`: стрелки через `icon="chevronLeft"` / `icon="chevronRight"`, подписи из `prevLabel` / `nextLabel`
- [x] 3.3 `pages/settings/ui/SettingsPage.tsx`: `icon` у строк хаба - `wallet`, `heart`, `bell`, `info`
- [x] 3.4 Убедиться, что символов-иконок в `src/` не осталось (поиск по "⚙", "›", "‹"; маркеры "•" остаются)

## 4. Проверка и документация

- [x] 4.1 Проверить на эмуляторе (`emulator-check`) в светлой и темной теме: шестеренка на обоих табах, хаб с иконками и шевронами, стрелки календаря и модалки дня, недоступная стрелка приглушена; смена темы на открытом хабе
- [x] 4.2 `CLAUDE.md`: `lucide-react-native` в стеке (только через `Icon`, импорт по одной иконке), `Icon` в списке `shared/ui`, проп `icon` у `Button` и `Row`
- [x] 4.3 `yarn test`, `yarn lint:unused`, `yarn typecheck` и `yarn lint` проходят

## Workflow follow-up

- После проверки архивировать change (`/opsx:archive`).
