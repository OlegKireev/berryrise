import { requireOptionalNativeModule } from 'expo';
import { startActivityAsync } from 'expo-intent-launcher';
import { Linking, Platform } from 'react-native';

import { logError } from '@/shared/lib';

const manufacturer =
  Platform.OS === 'android' ? Platform.constants.Manufacturer : '';

// Прошивки, которые убивают фон: им нужна подсказка про автозапуск
const AGGRESSIVE = /xiaomi|redmi|poco|huawei|honor|oppo|vivo|realme|oneplus/i;

const XIAOMI = /xiaomi|redmi|poco/i;

// Нативная часть - локальный модуль modules/autostart, в старой сборке его нет
const native = requireOptionalNativeModule<{ enabled(): boolean | null }>(
  'Autostart',
);

// Включен ли автозапуск; null - узнать нельзя (не Xiaomi, нет модуля, ошибка)
function autostartEnabled() {
  if (!XIAOMI.test(manufacturer)) {
    return null;
  }

  try {
    return native?.enabled() ?? null;
  } catch (e) {
    logError('notifications', e);

    return null;
  }
}

// Не кэшируем: автозапуск переключают в системе, пока приложение открыто
export const needsAutostartHint = () =>
  AGGRESSIVE.test(manufacturer) && autostartEnabled() !== true;

// Экран автозапуска MIUI/HyperOS открывается только по имени компонента
const XIAOMI_AUTOSTART = {
  packageName: 'com.miui.securitycenter',
  className: 'com.miui.permcenter.autostart.AutoStartManagementActivity',
};

// ponytail: прямой переход только для Xiaomi, остальным и при ошибке - настройки
// приложения. Компоненты других прошивок добавить, когда будет на чем проверить
export async function openAutostartSettings() {
  if (XIAOMI.test(manufacturer)) {
    try {
      await startActivityAsync('android.intent.action.MAIN', XIAOMI_AUTOSTART);
      return;
    } catch {
      // экрана нет в этой версии прошивки
    }
  }

  await Linking.openSettings();
}
