import { useTheme } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Button, TextInput, View } from 'react-native';

import {
  drinks,
  updateSpending,
  type Drink,
  type Habit,
} from '@/entities/habit';
import { currencySymbol } from '@/shared/i18n';
import { getLocale } from '@/shared/lib';
import { Chip, Text } from '@/shared/ui';

import { t } from '../i18n';

// ponytail: короткий список частых валют, расширим по запросу
const currencies = [
  'RUB',
  'USD',
  'EUR',
  'GEL',
  'KZT',
  'UAH',
  'BYN',
  'GBP',
  'TRY',
  'AMD',
];

const digits = (s: string) => s.replace(/\D/g, '');
const toInt = (s: string) => (s === '' ? null : Number(s));

type Props = {
  habit: Habit;
  submitLabel: string;
  onSaved: () => void;
};

// Траты и пресеты напитков: одна форма для онбординга и настроек
export function SpendingForm({ habit, submitLabel, onSaved }: Props) {
  const db = useSQLiteContext();
  const { colors } = useTheme();
  const [amount, setAmount] = useState(habit.weeklySpend?.toString() ?? '');
  const [currency, setCurrency] = useState(
    habit.currency ?? (getLocale() === 'ru' ? 'RUB' : 'USD'),
  );
  const [counts, setCounts] = useState<Partial<Record<Drink, string>>>(() =>
    Object.fromEntries(
      Object.entries(JSON.parse(habit.drinks) as Record<Drink, number>).map(
        ([k, n]) => [k, String(n)],
      ),
    ),
  );
  const [saving, setSaving] = useState(false);

  const input = {
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 8,
  };

  const save = async () => {
    setSaving(true);
    await updateSpending(db, habit.id, {
      weeklySpend: toInt(amount),
      currency,
      drinks: Object.fromEntries(
        drinks.map((d) => [d, toInt(counts[d] ?? '') ?? 0]),
      ),
    });
    setSaving(false);
    onSaved();
  };

  return (
    <>
      <Text style={{ fontWeight: '600' }}>{t('weeklySpend')}</Text>
      <TextInput
        value={amount}
        onChangeText={(s) => setAmount(digits(s))}
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
              selected={currency === c}
              onPress={() => setCurrency(c)}
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
            value={counts[d] ?? ''}
            onChangeText={(s) => setCounts({ ...counts, [d]: digits(s) })}
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
        disabled={saving}
        onPress={save}
      />
    </>
  );
}
