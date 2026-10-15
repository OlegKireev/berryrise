import type { ReactNode } from 'react';
import { View } from 'react-native';

import type { Party } from '@/entities/party';
import { formatDateTime } from '@/shared/i18n';
import { Button, Card, Text } from '@/shared/ui';

import { t } from '../i18n';

type Props = {
  party: Party;
  onSober: () => void;
  onCancel: () => void;
};

// Идущая вечеринка: ответить "как прошло?" можно в любой момент
export function PartyCard({ party, onSober, onCancel }: Props) {
  return (
    <Card>
      <Text variant="heading">{t('partyCardTitle')}</Text>
      <Text variant="hint">
        {t('partyCardUntil')} {formatDateTime(party.expectedEndAt)}
      </Text>
      {/* Главный вопрос: два ответа рядом, трезвый ответ главный */}
      <ButtonPair>
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
      </ButtonPair>
      <ButtonPair>
        <Button
          title={t('partyOpen')}
          href="/company"
          style={{ flex: 1 }}
        />
        <Button
          variant="quiet"
          title={t('partyCancel')}
          onPress={onCancel}
          style={{ flex: 1 }}
        />
      </ButtonPair>
    </Card>
  );
}

const ButtonPair = ({ children }: { children: ReactNode }) => (
  <View style={{ flexDirection: 'row', gap: 8 }}>{children}</View>
);
