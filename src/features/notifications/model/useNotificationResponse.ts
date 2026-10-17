import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';

import { getActiveParty, setPartyResult } from '@/entities/party';

import { parseNotificationData } from './plan';
import { syncNotifications } from './sync';

// Тапы и кнопки уведомлений. Последний ответ покрывает и холодный старт, и живое приложение
export function useNotificationResponse() {
  const db = useSQLiteContext();
  const response = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (!response) {
      return;
    }

    const { actionIdentifier: action, notification } = response;
    const { kind, day, partyId } = parseNotificationData(
      notification.request.content.data,
    ) ?? { kind: null };
    const tap = action === Notifications.DEFAULT_ACTION_IDENTIFIER;

    (async () => {
      Notifications.clearLastNotificationResponse();
      // кнопки на Android уведомление не закрывают, в отличие от тапа
      await Notifications.dismissNotificationAsync(
        notification.request.identifier,
      );

      if (kind === 'dayReview') {
        // ровно тот день, о котором напомнили: в 18:30 reviewDay уже сегодняшний
        router.push(day ? `/day-review?day=${day}` : '/day-review');
      } else if (kind === 'risk') {
        router.push('/company');
      } else if (kind === 'party') {
        // старое уведомление после ответа на карточке ничего не меняет
        const active = tap ? undefined : await getActiveParty(db);
        const activeId = active?.id === partyId ? active?.id : undefined;

        if (activeId && action === 'sober') {
          await setPartyResult(db, activeId, 'sober');
          await syncNotifications(db);
        }

        router.navigate('/');

        if (activeId && action === 'drank') {
          router.push(`/relapse?partyId=${activeId}`);
        }
      }
    })();
  }, [db, response]);
}
