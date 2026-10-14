import { currencySymbol } from '@/shared/i18n';
import { Choices, Input, Text } from '@/shared/ui';

import { currencies } from '../model/useSpendingForm';

import { t } from '../i18n';

type Props = {
  amount: string;
  setAmount: (s: string) => void;
  currency: string;
  setCurrency: (c: string) => void;
};

// Сумма в неделю и валюта
export function WeeklySpend({
  amount,
  setAmount,
  currency,
  setCurrency,
}: Props) {
  return (
    <>
      <Text variant="label">{t('weeklySpend')}</Text>
      <Input
        value={amount}
        onChangeText={setAmount}
        keyboardType="number-pad"
        maxLength={9}
      />
      <Choices
        keys={currencies}
        label={currencyLabel}
        isSelected={(c) => c === currency}
        onPress={setCurrency}
      />
    </>
  );
}

// Код и символ, если он отличается: "EUR €", но просто "CHF"
const currencyLabel = (c: string) => {
  const symbol = currencySymbol(c);
  return symbol === c ? c : `${c} ${symbol}`;
};
