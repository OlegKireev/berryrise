import { router } from 'expo-router';
import { Pressable } from 'react-native';

import { reasonLabel, type ReasonRow } from '@/entities/reason';
import { Button, Card, Text } from '@/shared/ui';

import { t } from '../i18n';

const openReasons = () => router.push('/settings/reasons');

// Причина дня, без причин - приглашение добавить
export function ReasonOfDay({ reason }: { reason: ReasonRow | null }) {
  if (!reason) {
    return (
      <Button
        variant="quiet"
        title={t('reasonsEmpty')}
        onPress={openReasons}
      />
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={openReasons}
    >
      <Card>
        <Text variant="hint">{t('reasonOfDay')}</Text>
        <Text
          weight="medium"
          style={{ fontSize: 20 }}
        >
          {reasonLabel(reason)}
        </Text>
      </Card>
    </Pressable>
  );
}
