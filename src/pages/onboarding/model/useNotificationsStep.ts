import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';

import {
  anyOn,
  defaultPrefs,
  ensurePermission,
  needsAutostartHint,
  savePrefs,
  syncNotifications,
  type NotificationPrefs,
} from '@/features/notifications';
import { logError } from '@/shared/lib';

// На шаге все виды включены: "Дальше" и есть согласие, "Пропустить" ничего не включает
export function useNotificationsStep() {
  const db = useSQLiteContext();

  const [prefs, setPrefs] = useState<NotificationPrefs>({
    dayReview: { ...defaultPrefs.dayReview, on: true },
    risk: { ...defaultPrefs.risk, on: true },
    party: { on: true },
  });
  const [saving, setSaving] = useState(false);

  return {
    prefs,
    setPrefs,
    saving,
    submit: async () => {
      setSaving(true);
      const on = anyOn(prefs);

      // ошибка разрешения не должна запереть в онбординге
      try {
        await savePrefs(db, prefs);

        // системный диалог только после шага и только если есть что показывать
        if (on) {
          await ensurePermission();
        }

        await syncNotifications(db);
      } catch (e) {
        logError('onboarding', e);
      }

      // подсказка про автозапуск нужна, только если что-то включено
      router.replace(on && needsAutostartHint ? '/onboarding/autostart' : '/');
    },
    skip: () => router.replace('/'),
  };
}
