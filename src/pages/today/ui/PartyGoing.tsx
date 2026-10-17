import { View } from 'react-native';

import type { Party } from '@/entities/party';
import { formatTime } from '@/shared/i18n';
import { minutesOfDay } from '@/shared/lib';
import { Button, Icon, Text, useColors } from '@/shared/ui';

import { t } from '../i18n';

// Вечер идет: плашка на месте "Иду в компанию", тап возвращает в режим
export function PartyGoing({ party }: { party: Party }) {
  const colors = useColors();
  const fg = { color: colors.onPrimary };

  return (
    <Button
      variant="primary"
      href="/company"
      style={{ flexDirection: 'row', paddingVertical: 14 }}
    >
      <View style={{ flex: 1 }}>
        <Text
          weight="semibold"
          style={[fg, { fontSize: 17 }]}
        >
          {t('partyGoing')}
        </Text>
        <Text style={[fg, { fontSize: 13, opacity: 0.8 }]}>
          {t('partyUntil')}{' '}
          {formatTime(minutesOfDay(new Date(party.expectedEndAt)))}
        </Text>
      </View>
      <Icon
        name="chevronRight"
        color={colors.onPrimary}
      />
    </Button>
  );
}
