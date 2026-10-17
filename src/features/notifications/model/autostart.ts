import { startActivityAsync } from 'expo-intent-launcher';
import { Linking, Platform } from 'react-native';

const manufacturer =
  Platform.OS === 'android' ? Platform.constants.Manufacturer : '';

// Прошивки, которые убивают фон: им нужна подсказка про автозапуск
const AGGRESSIVE = /xiaomi|redmi|poco|huawei|honor|oppo|vivo|realme|oneplus/i;

export const needsAutostartHint = AGGRESSIVE.test(manufacturer);

// Экран автозапуска MIUI/HyperOS открывается только по имени компонента
const XIAOMI_AUTOSTART = {
  packageName: 'com.miui.securitycenter',
  className: 'com.miui.permcenter.autostart.AutoStartManagementActivity',
};

// ponytail: прямой переход только для Xiaomi, остальным и при ошибке - настройки
// приложения. Компоненты других прошивок добавить, когда будет на чем проверить
export async function openAutostartSettings() {
  if (/xiaomi|redmi|poco/i.test(manufacturer)) {
    try {
      await startActivityAsync('android.intent.action.MAIN', XIAOMI_AUTOSTART);
      return;
    } catch {
      // экрана нет в этой версии прошивки
    }
  }

  await Linking.openSettings();
}
