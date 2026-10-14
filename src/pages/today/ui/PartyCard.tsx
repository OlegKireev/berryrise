import { router, useTheme } from 'expo-router';
import type { ReactNode } from 'react';
import { Button, View, type ColorValue } from 'react-native';

import type { Party } from '@/entities/party';
import { formatDateTime } from '@/shared/i18n';
import { Text } from '@/shared/ui';

import { SECONDARY, SOBER } from './colors';

import { t } from '../i18n';

type Props = {
  party: Party;
  onSober: () => void;
  onCancel: () => void;
};

// Идущая вечеринка: ответить "как прошло?" можно в любой момент
export function PartyCard({ party, onSober, onCancel }: Props) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        gap: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
      }}
    >
      <Text variant="heading">{t('partyCardTitle')}</Text>
      <Text variant="hint">
        {t('partyCardUntil')} {formatDateTime(party.expectedEndAt)}
      </Text>
      {/* Главный вопрос: два ответа рядом и разными цветами */}
      <ButtonPair>
        <HalfButton
          title={t('partySober')}
          color={SOBER}
          onPress={onSober}
        />
        <HalfButton
          title={t('partyDrank')}
          color={colors.notification}
          onPress={() =>
            router.push({ pathname: '/relapse', params: { partyId: party.id } })
          }
        />
      </ButtonPair>
      <ButtonPair>
        <HalfButton
          title={t('partyOpen')}
          color={SECONDARY}
          onPress={() => router.push('/company')}
        />
        <HalfButton
          title={t('partyCancel')}
          color={SECONDARY}
          onPress={onCancel}
        />
      </ButtonPair>
    </View>
  );
}

const ButtonPair = ({ children }: { children: ReactNode }) => (
  <View style={{ flexDirection: 'row', gap: 8 }}>{children}</View>
);

const HalfButton = (props: {
  title: string;
  color: ColorValue;
  onPress: () => void;
}) => (
  <View style={{ flex: 1 }}>
    <Button {...props} />
  </View>
);
