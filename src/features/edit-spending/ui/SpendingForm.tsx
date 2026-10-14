import { useTheme } from 'expo-router';
import { Button, TextInput, View } from 'react-native';

import { drinks, type Habit } from '@/entities/habit';
import { currencySymbol } from '@/shared/i18n';
import { Chip, Text } from '@/shared/ui';

import { currencies, useSpendingForm } from '../model/useSpendingForm';

import { t } from '../i18n';

type Props = {
  habit: Habit;
  submitLabel: string;
  onSaved: () => void;
};

// Траты и пресеты напитков: одна форма для онбординга и настроек
export function SpendingForm({ habit, submitLabel, onSaved }: Props) {
  const { colors } = useTheme();
  const form = useSpendingForm(habit, onSaved);

  const input = {
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 8,
  };

  return (
    <>
      <Text style={{ fontWeight: '600' }}>{t('weeklySpend')}</Text>
      <TextInput
        value={form.amount}
        onChangeText={form.setAmount}
        keyboardType="number-pad"
        maxLength={9}
        style={input}
      />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {currencies.map((c) => {
          const symbol = currencySymbol(c);
          return (
            <Chip
              key={c}
              label={symbol === c ? c : `${c} ${symbol}`}
              selected={form.currency === c}
              onPress={() => form.setCurrency(c)}
            />
          );
        })}
      </View>

      <Text style={{ fontWeight: '600' }}>{t('drinksTitle')}</Text>
      {drinks.map((d) => (
        <View
          key={d}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
        >
          <Text style={{ flex: 1 }}>{t(`habit.drinks.${d}`)}</Text>
          <TextInput
            value={form.counts[d] ?? ''}
            onChangeText={(s) => form.setCount(d, s)}
            keyboardType="number-pad"
            maxLength={3}
            placeholder="0"
            placeholderTextColor={colors.border}
            style={[input, { width: 64, textAlign: 'center' }]}
          />
        </View>
      ))}

      <Button
        title={submitLabel}
        disabled={form.saving}
        onPress={form.save}
      />
    </>
  );
}
