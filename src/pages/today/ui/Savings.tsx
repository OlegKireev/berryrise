import { View } from 'react-native';

import type { Savings as SavingsData } from '@/entities/habit';
import { formatMoney, formatNumber, portions } from '@/shared/i18n';
import { Button, Card, Text } from '@/shared/ui';

import { t } from '../i18n';

type Props = {
  saved: SavingsData;
  currency: string | null;
  hasDrinks: boolean;
};

// Сэкономлено. Без трат и напитков считать нечего, зовем их указать
export function Savings({ saved, currency, hasDrinks }: Props) {
  if (saved.money === null && !hasDrinks) {
    return (
      <Button
        title={t('savingsEmpty')}
        href="/settings/spending"
      />
    );
  }

  return (
    <Card>
      <Text variant="hint">{t('saved')}</Text>
      {saved.money !== null && currency && (
        <Text
          weight="bold"
          style={{ fontSize: 32 }}
        >
          {formatMoney(saved.money, currency)}
        </Text>
      )}
      {hasDrinks && (
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Text variant="hint">{portions(saved.portions)}</Text>
          <Text variant="hint">
            {formatNumber(saved.kcal)} {t('kcal')}
          </Text>
        </View>
      )}
    </Card>
  );
}
