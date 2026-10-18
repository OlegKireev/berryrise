# Design

## Context

Сейчас `needsAutostartHint` в `features/notifications/model/autostart.ts` - константа по `Platform.constants.Manufacturer`. Ее читают `NotificationsPage` (показать `AutostartHint`) и `useNotificationsStep` (открыть `/onboarding/autostart` или сразу `/`).

Публичного API для автозапуска в Android нет. В MIUI и HyperOS он хранится в AppOps как своя операция `10008` (`MIUIOP(10008)`). На телефоне с HyperOS 3.0 (Android 16) `adb shell appops get com.berryrise.app.dev 10008` показал `allow` при включенном автозапуске и `ignore` после выключения. Прочитать операцию можно через скрытый `AppOpsManager.checkOpNoThrow(int, int, String)` рефлексией.

В проекте уже есть локальный Expo module `modules/icon-shape` (Kotlin, одна функция, autolinking находит `modules/` сам), и JS-обертка над ним в `shared/lib/iconMask.ts` через `requireOptionalNativeModule`.

## Goals / Non-Goals

**Goals:**

- Синхронный ответ "включен / выключен / неизвестно" на Xiaomi, `null` везде, где узнать нельзя.
- Сборка без нового модуля (старый dev build) работает как сейчас: подсказка видна.

**Non-Goals:**

- Кэширование состояния и подписка на его изменения: значение читается при каждом вызове, вызов дешевый.
- Проверка ограничений батареи.

## Decisions

### Отдельный модуль `modules/autostart`

Kotlin-модуль `Autostart` с одной функцией `enabled(): Boolean?`:

- рефлексией берет `AppOpsManager.checkOpNoThrow(Int, Int, String)` и зовет его с `10008`, `Process.myUid()` и именем пакета;
- `MODE_ALLOWED` -> `true`, `MODE_IGNORED` и `MODE_ERRORED` -> `false`, другое -> `null`;
- любое исключение (нет метода, `SecurityException`, нет контекста) -> `null`.

Функция не смотрит на производителя: это решает JS. Модуль только для Android, как `icon-shape`.

Альтернатива: добавить функцию в `icon-shape` и переименовать его в общий `device`. Отклонена: переименование трогает виджет и `iconMask`, хотя у модулей нет ничего общего. Два крошечных модуля проще одного с разными обязанностями.

### JS-обертка в `features/notifications`, а не в `shared/lib`

Состояние автозапуска нужно только напоминаниям. `model/autostart.ts` получает `autostartEnabled(): boolean | null` (через `requireOptionalNativeModule`, вызов только при `/xiaomi|redmi|poco/i` по производителю, иначе `null`, ошибка вызова -> `null`).

`needsAutostartHint` из константы становится функцией: прошивка из списка `AGGRESSIVE` и `autostartEnabled() !== true`. Неизвестно = показываем, так на прошивках, где проверить нельзя, и в старой сборке поведение не меняется.

Без кэша: пользователь меняет настройку в системе, а читать ее нужно свежей. Вызов синхронный и быстрый.

### Перечитывание в настройках

`useNotificationSettings` держит `autostartHint` в state и пересчитывает его на фокусе экрана (там уже проверяется разрешение) и на `AppState` -> `active`: возврат из системных настроек не вызывает фокус экрана в expo-router. Страница рисует `AutostartHint` по `settings.autostartHint`.

### Онбординг

`useNotificationsStep.submit` зовет `needsAutostartHint()` в момент перехода. Сам шаг `AutostartStepPage` не меняется: если пользователь включил автозапуск с этого шага, он и так нажмет "Готово".

## Risks / Trade-offs

- [Xiaomi уберет или перенумерует операцию в новой прошивке] -> вызов вернет `null` или бросит, подсказка покажется как сейчас. Ложного "включен" при этом не будет, пока `checkOpNoThrow` не начнет врать `MODE_ALLOWED`.
- [Из приложения значение может отличаться от `adb shell appops`, у shell другие права] -> проверяем на телефоне сразу после сборки (задача в tasks.md), до остальной работы.
- [Hidden API restrictions Android 9+ закроют рефлексию на `checkOpNoThrow`] -> метод в greylist и сейчас доступен; при блокировке получим исключение и `null`.
- [Автозапуск включен, а батарея ограничена - подсказка спрятана, хотя часть ее совета еще актуальна] -> принимаем: главная причина пропавших напоминаний на Xiaomi - автозапуск. Проверка батареи - отдельное изменение, если понадобится.

## Migration Plan

Нативное изменение: новый модуль в `modules/`. После него нужна пересборка: `yarn build:local:dev` и `yarn install:dev` для телефона, `yarn build:local:preview` для preview. Других нативных изменений в планах нет, собираем один раз. Откат - удалить модуль и вернуть константу, данных изменение не трогает.
