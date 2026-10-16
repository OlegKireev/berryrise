// Обработчик виджета регистрируется до старта приложения: его зовет фоновая задача без UI
import { registerWidgetTaskHandler } from 'react-native-android-widget';

import { widgetTaskHandler } from '@/features/widget';

import 'expo-router/entry';

registerWidgetTaskHandler(widgetTaskHandler);
