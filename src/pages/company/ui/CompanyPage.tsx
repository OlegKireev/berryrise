import { useTheme } from 'expo-router';
import { Alert, Button, TextInput, View } from 'react-native';

import { partyDrinks } from '@/entities/party';
import { reasonLabel } from '@/entities/reason';
import { replies } from '@/entities/reply';
import { Chip, DateTimeField, Screen, Text } from '@/shared/ui';

import { useCompany } from '../model/useCompany';

import { t } from '../i18n';

const DAY = 24 * 60 * 60 * 1000;

export function CompanyPage() {
  const { colors } = useTheme();
  const company = useCompany();

  if (!company) {
    return null;
  }

  const { party } = company;

  const input = {
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 8,
  };

  // Долгое нажатие на свой напиток убирает его из списка
  const confirmDeleteDrink = (name: string) =>
    Alert.alert(t('deleteDrinkTitle'), name, [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: () => company.deleteDrink(name),
      },
    ]);

  return (
    <Screen>
      {company.reasons.length > 0 && (
        <View style={{ gap: 4 }}>
          <Text style={{ fontWeight: '600' }}>{t('reason.myReasons')}</Text>
          {company.reasons.map((r) => (
            <Text
              key={r.id}
              style={{ fontSize: 18 }}
            >
              • {reasonLabel(r)}
            </Text>
          ))}
        </View>
      )}

      <Text style={{ fontWeight: '600' }}>{t('partyEnd')}</Text>
      <DateTimeField
        value={new Date(party.expectedEndAt)}
        onChange={company.changeEnd}
        min={new Date(party.startAt)}
        max={new Date(party.startAt + DAY)}
      />

      <Text style={{ fontWeight: '600' }}>{t('partyDrinkTitle')}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {partyDrinks.map((k) => (
          <Chip
            key={k}
            label={t(`party.drinks.${k}`)}
            selected={company.drinkKeys.includes(k)}
            onPress={() => company.toggleDrink(k)}
          />
        ))}
        {company.customDrinks.map((d) => (
          <Chip
            key={d}
            label={d}
            selected={company.drinkCustoms.includes(d)}
            onPress={() => company.toggleCustomDrink(d)}
            onLongPress={() => confirmDeleteDrink(d)}
          />
        ))}
      </View>
      <TextInput
        value={company.drinkText}
        onChangeText={company.setDrinkText}
        placeholder={t('partyDrinkCustom')}
        placeholderTextColor={colors.border}
        style={input}
      />
      <Button
        title={t('add')}
        disabled={!company.canAddDrink}
        onPress={company.addDrink}
      />
      {company.customDrinks.length > 0 && (
        <Text style={{ opacity: 0.6 }}>{t('deleteDrinkHint')}</Text>
      )}

      <Text style={{ fontWeight: '600' }}>{t('repliesTitle')}</Text>
      {replies.map((k) => (
        <Text key={k}>• {t(`reply.${k}`)}</Text>
      ))}
      {company.myReplies.map((r) => (
        <View
          key={r.id}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
        >
          <Text style={{ flex: 1 }}>• {r.customText}</Text>
          <Button
            title={t('delete')}
            onPress={() => company.deleteReply(r.id)}
          />
        </View>
      ))}
      <TextInput
        value={company.replyText}
        onChangeText={company.setReplyText}
        placeholder={t('customReply')}
        placeholderTextColor={colors.border}
        style={input}
      />
      <Button
        title={t('add')}
        disabled={!company.canAddReply}
        onPress={company.addReply}
      />

      <Text style={{ fontSize: 18, marginTop: 8 }}>{t('leaveEarly')}</Text>
    </Screen>
  );
}
