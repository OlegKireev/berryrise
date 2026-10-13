import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

import { listRelapses, type Relapse } from '@/entities/relapse';
import { DeleteRelapseButton } from '@/features/delete-relapse';
import { formatDateTime, t } from '@/shared/i18n';
import { Screen, Text } from '@/shared/ui';

export function ProgressPage() {
  const db = useSQLiteContext();
  const [relapses, setRelapses] = useState<Pick<Relapse, 'id' | 'at'>[]>([]);

  const load = useCallback(() => {
    listRelapses(db).then(setRelapses);
  }, [db]);

  useFocusEffect(load);

  return (
    <Screen>
      <Text style={{ fontSize: 20, fontWeight: '600' }}>{t('relapses')}</Text>
      {relapses.length === 0 && (
        <Text style={{ opacity: 0.6 }}>{t('noRelapses')}</Text>
      )}
      {relapses.map((r) => (
        <View
          key={r.id}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text>{formatDateTime(r.at)}</Text>
          <DeleteRelapseButton
            id={r.id}
            onDeleted={load}
          />
        </View>
      ))}
    </Screen>
  );
}
