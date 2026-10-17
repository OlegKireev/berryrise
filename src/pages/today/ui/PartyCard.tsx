import { View } from 'react-native';

import type { Party } from '@/entities/party';
import { Button, Card, Text } from '@/shared/ui';

import { t } from '../i18n';

type Props = {
  party: Party;
  onSober: () => void;
};

// Вечер закончился по времени: два ответа рядом, трезвый главный
export function PartyCard({ party, onSober }: Props) {
  return (
    <Card>
      <Text variant="heading">{t('partyCardTitle')}</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button
          variant="primary"
          title={t('partySober')}
          onPress={onSober}
          style={{ flex: 1 }}
        />
        <Button
          title={t('partyDrank')}
          href={{ pathname: '/relapse', params: { partyId: party.id } }}
          style={{ flex: 1 }}
        />
      </View>
    </Card>
  );
}
