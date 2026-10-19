import * as Updates from 'expo-updates';
import { useState } from 'react';
import { Alert } from 'react-native';

import { logError, otaEnabled, reloadForUpdate } from '@/shared/lib';
import { toast } from '@/shared/ui';

import { t } from '../i18n';

// Ручная проверка OTA из "О приложении": есть обновление - скачать и сразу перезапуститься.
// В сборке без OTA (dev) строки нет
export function useCheckUpdate() {
  const [checking, setChecking] = useState(false);

  const check = async () => {
    if (checking) {
      return;
    }

    setChecking(true);

    try {
      const { isAvailable } = await Updates.checkForUpdateAsync();

      if (!isAvailable) {
        toast(t('upToDate'));
        return;
      }

      await Updates.fetchUpdateAsync();
      await reloadForUpdate();
    } catch (e) {
      logError('updates', e);
      Alert.alert(t('updateFailed'));
    } finally {
      setChecking(false);
    }
  };

  return { available: otaEnabled, checking, check };
}
