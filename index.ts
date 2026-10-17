// Обработчик виджета регистрируется до старта приложения: его зовет фоновая задача без UI
import { registerWidgetTaskHandler } from 'react-native-android-widget';

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
