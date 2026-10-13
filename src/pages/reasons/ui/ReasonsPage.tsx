import { useFocusEffect, useTheme } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Button, TextInput, View } from 'react-native';

import {
  addReason,
  deleteReason,
  listReasons,
  reasonLabel,
  reasons,
  type NewReason,
  type ReasonRow,
} from '@/entities/reason';
import { t } from '@/shared/i18n';
import { Chip, Screen, Text } from '@/shared/ui';

export function ReasonsPage() {
  const db = useSQLiteContext();
  const { colors } = useTheme();
  const [list, setList] = useState<ReasonRow[] | null>(null);
  const [custom, setCustom] = useState('');

  const load = useCallback(() => {
    listReasons(db).then(setList);
  }, [db]);
  useFocusEffect(load);

  if (!list) return null;

  const add = async (item: NewReason) => {
    await addReason(db, item);
    load();
  };
  const remove = async (id: string) => {
    // Без подтверждения: причину легко вернуть
    await deleteReason(db, id);
    load();
  };
  const presets = reasons.filter((k) => !list.some((r) => r.key === k));

  return (
    <Screen>
      {list.length === 0 && <Text>{t('noReasons')}</Text>}
      {list.map((r) => (
        <View
          key={r.id}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
        >
          <Text style={{ flex: 1, fontSize: 18 }}>{reasonLabel(r)}</Text>
          <Button
            title={t('delete')}
            onPress={() => remove(r.id)}
          />
        </View>
      ))}

      <Text style={{ fontSize: 20, fontWeight: '600', marginTop: 8 }}>
        {t('addReasonTitle')}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {presets.map((k) => (
          <Chip
            key={k}
            label={t(`reason_${k}`)}
            selected={false}
            onPress={() => add({ key: k })}
          />
        ))}
      </View>
      <TextInput
        value={custom}
        onChangeText={setCustom}
        placeholder={t('customReason')}
        placeholderTextColor={colors.border}
        style={{
          color: colors.text,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 8,
          padding: 8,
        }}
      />
      <Button
        title={t('add')}
        disabled={!custom.trim()}
        onPress={async () => {
          await add({ customText: custom.trim() });
          setCustom('');
        }}
      />
    </Screen>
  );
}
