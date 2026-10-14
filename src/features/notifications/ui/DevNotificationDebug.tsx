import * as Notifications from 'expo-notifications';
import { useState } from 'react';
import { Button } from 'react-native';

import { Text } from '@/shared/ui';

import { CHANNEL } from '../model/setup';

// ponytail: временная dev-диагностика уведомлений, удалить после проверки на телефоне
export function DevNotificationDebug() {
  const [info, setInfo] = useState('нажми "обновить"');

  const refresh = async () => {
    try {
      const [perm, scheduled, channel] = await Promise.all([
        Notifications.getPermissionsAsync(),
        Notifications.getAllScheduledNotificationsAsync(),
        Notifications.getNotificationChannelAsync(CHANNEL),
      ]);
      const next = scheduled
        .map((n) => {
          const tr = n.trigger as { value?: number; date?: number } | null;
          const at = tr?.value ?? tr?.date;
          return `${n.content.categoryIdentifier} ${at ? new Date(at).toLocaleString() : JSON.stringify(n.trigger)}`;
        })
        .sort()
        .slice(0, 5);
      setInfo(
        [
          `permission: ${perm.status}`,
          `channel: ${channel ? `${channel.id} importance ${channel.importance}` : 'нет'}`,
          `scheduled: ${scheduled.length}`,
          ...next,
        ].join('\n'),
      );
    } catch (e) {
      setInfo(String(e));
    }
  };

  const test = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Тест',
          body: 'Через 10 секунд',
          categoryIdentifier: 'dayReview',
          data: { kind: 'dayReview' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 10,
          channelId: CHANNEL,
        },
      });
      refresh();
    } catch (e) {
      setInfo(String(e));
    }
  };

  const now = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Тест',
          body: 'Сразу',
          categoryIdentifier: 'dayReview',
          data: { kind: 'dayReview' },
        },
        trigger: null,
      });
    } catch (e) {
      setInfo(String(e));
    }
  };

  return (
    <>
      <Text variant="hint">{info}</Text>
      <Button
        title="DEV: обновить"
        onPress={refresh}
      />
      <Button
        title="DEV: уведомление сразу"
        onPress={now}
      />
      <Button
        title="DEV: уведомление через 10 с"
        onPress={test}
      />
    </>
  );
}
