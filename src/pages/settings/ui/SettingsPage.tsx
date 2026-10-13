import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Alert, Button, DevSettings } from 'react-native';

import { getHabit, updateHabitStart, type Habit } from '@/entities/habit';
import { listRelapses } from '@/entities/relapse';
import { SpendingForm } from '@/features/edit-spending';
import { resetDatabase } from '@/shared/db';
import { t } from '@/shared/i18n';
import { DateTimeField, Screen, Text } from '@/shared/ui';

// ponytail: dev-кнопка без i18n, в релизную сборку не попадает
function DevResetButton() {
  const db = useSQLiteContext();
  const confirm = () =>
    Alert.alert('Сбросить все данные?', 'База удалится, начнется онбординг.', [
      { text: t('cancel'), style: 'cancel' },
      {
        text: 'Сбросить',
        style: 'destructive',
        onPress: async () => {
          await resetDatabase(db);
          // Перезагрузка JS: migrate создаст схему заново, табы уведут на онбординг
          DevSettings.reload();
        },
      },
    ]);
  return (
    <Button
      title="DEV: сбросить данные"
      color="red"
      onPress={confirm}
    />
  );
}

export function SettingsPage() {
  const db = useSQLiteContext();
  const [habit, setHabit] = useState<Habit | null>(null);
  // Старт не позже текущего момента и самого раннего срыва
  const [maxStart, setMaxStart] = useState(0);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const [h, relapses] = await Promise.all([
          getHabit(db),
          listRelapses(db),
        ]);
        setHabit(h);
        setMaxStart(Math.min(Date.now(), relapses.at(-1)?.at ?? Infinity));
      })();
    }, [db]),
  );

  if (!habit) return null;

  // Сохраняем сразу: поле одно, отдельная кнопка не нужна
  const changeStart = async (d: Date) => {
    await updateHabitStart(db, habit.id, d.getTime());
    setHabit({ ...habit, startAt: d.getTime() });
  };

  return (
    <Screen>
      <Text style={{ fontWeight: '600' }}>{t('startAt')}</Text>
      <DateTimeField
        value={new Date(habit.startAt)}
        onChange={changeStart}
        max={new Date(maxStart)}
      />
      <SpendingForm
        habit={habit}
        submitLabel={t('save')}
        onSaved={() => router.back()}
      />
      {__DEV__ && <DevResetButton />}
    </Screen>
  );
}
