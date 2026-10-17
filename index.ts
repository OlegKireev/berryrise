// Обработчики виджета и кнопок уведомлений регистрируются до старта приложения:
// их зовут фоновые задачи без UI
import { registerWidgetTaskHandler } from 'react-native-android-widget';

import { registerNotificationTask } from '@/features/notifications';
import { widgetTaskHandler } from '@/features/widget';
import { logError, trimLog } from '@/shared/lib';

import 'expo-router/entry';

trimLog();

// Необработанные JS-ошибки (и из фона виджета) - в журнал, дальше как обычно:
// redbox в dev, падение в release. Запись синхронная, до падения успевает
const defaultHandler = ErrorUtils.getGlobalHandler();
ErrorUtils.setGlobalHandler((e, isFatal) => {
  logError('global', e);
  defaultHandler(e, isFatal);
});

registerWidgetTaskHandler(widgetTaskHandler);
registerNotificationTask();
