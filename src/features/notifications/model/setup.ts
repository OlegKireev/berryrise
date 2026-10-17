import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { t } from '../i18n';

export const CHANNEL = 'reminders';

// Кнопки с ответом открывают приложение: без него ответ некому обработать.
// "Не иду" ничего не записывает, приложение ему не нужно
const action = (identifier: string, buttonTitle: string, opens = true) => ({
  identifier,
  buttonTitle,
  options: { opensAppToForeground: opens },
});

// Канал и кнопки. Канал нужен до запроса разрешения: на Android 13 без него
// системный диалог не появится
export async function setupNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: () =>
      Promise.resolve({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: t('channel'),
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  await Promise.all([
    Notifications.setNotificationCategoryAsync('dayReview', [
      action('fill', t('notify.dayReview.fill')),
    ]),
    Notifications.setNotificationCategoryAsync('risk', [
      action('company', t('notify.risk.company')),
      action('skip', t('notify.risk.skip'), false),
    ]),
    Notifications.setNotificationCategoryAsync('party', [
      action('sober', t('notify.party.sober')),
      action('drank', t('notify.party.drank')),
    ]),
  ]);
}

// Разрешение просим, пока система готова показать диалог. По status не
// смотрим: на Android 13+ до первого запроса он уже DENIED, потому что
// expo-notifications проверяет areNotificationsEnabled раньше UNDETERMINED
export async function ensurePermission() {
  const { granted, canAskAgain } = await Notifications.getPermissionsAsync();

  if (!granted && canAskAgain) {
    await Notifications.requestPermissionsAsync();
  }
}

export const permissionDenied = async () =>
  (await Notifications.getPermissionsAsync()).status ===
  Notifications.PermissionStatus.DENIED;
