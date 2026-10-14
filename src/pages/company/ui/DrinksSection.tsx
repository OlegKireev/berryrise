import { Alert } from 'react-native';

import { partyDrinks } from '@/entities/party';
import { AddField, Chip, ChipRow, Text } from '@/shared/ui';

import type { Drinks } from '../model/useCompany';

import { t } from '../i18n';

// Что пью вместо алкоголя: готовые и свои напитки
export function DrinksSection({ drinks }: { drinks: Drinks }) {
  // Долгое нажатие на свой напиток убирает его из списка
  const confirmRemove = (name: string) =>
    Alert.alert(t('deleteDrinkTitle'), name, [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: () => drinks.remove(name),
      },
    ]);

  return (
    <>
      <Text variant="label">{t('partyDrinkTitle')}</Text>
      <ChipRow>
        {partyDrinks.map((k) => (
          <Chip
            key={k}
            label={t(`party.drinks.${k}`)}
            selected={drinks.keys.includes(k)}
            onPress={() => drinks.toggleKey(k)}
          />
        ))}
        {drinks.myDrinks.map((d) => (
          <Chip
            key={d}
            label={d}
            selected={drinks.customs.includes(d)}
            onPress={() => drinks.toggleCustom(d)}
            onLongPress={() => confirmRemove(d)}
          />
        ))}
      </ChipRow>
      <AddField
        value={drinks.text}
        onChangeText={drinks.setText}
        placeholder={t('partyDrinkCustom')}
        canAdd={drinks.canAdd}
        onAdd={drinks.add}
      />
      {drinks.myDrinks.length > 0 && (
        <Text variant="hint">{t('deleteDrinkHint')}</Text>
      )}
    </>
  );
}
