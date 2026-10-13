import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Button } from 'react-native';

import { createHabit } from '@/entities/habit';
import { t } from '@/shared/i18n';
import { DateTimeField, Screen, Text } from '@/shared/ui';

// Привычка создается только здесь, ее наличие и значит "онбординг пройден". Дальше только необязательные шаги
export function StartPage() {
  const db = useSQLiteContext();
  // null - не трогали, старт в момент подтверждения
  const [startAt, setStartAt] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);

  const start = async () => {
    setSaving(true);
    await createHabit(db, startAt?.getTime() ?? Date.now());
    // Онбординг пройден. Сбрасываем его стек, чтобы "назад" не вернул на старт
    router.dismissAll();
    router.replace('/onboarding/spending');
  };

  return (
    <Screen>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>{t('startTitle')}</Text>
      <Text>{t('startHint')}</Text>
      <DateTimeField
        value={startAt ?? new Date()}
        onChange={setStartAt}
        max={new Date()}
      />
      <Button
        title={t('startButton')}
        disabled={saving}
        onPress={start}
      />
    </Screen>
  );
}
