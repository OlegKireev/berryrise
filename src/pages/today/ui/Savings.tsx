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

  // одной строкой: слева сумма, справа порции и ккал - экран короче
  return (
    <Card
      style={{
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      }}
    >
      <View>
        <Text variant="hint">{t('saved')}</Text>
        {saved.money !== null && currency && (
          <Text
            weight="bold"
            style={{ fontSize: 28 }}
          >
            {formatMoney(saved.money, currency)}
          </Text>
        )}
      </View>
      {hasDrinks && (
        <View style={{ alignItems: 'flex-end' }}>
          <Text variant="hint">{portions(saved.portions)}</Text>
          <Text variant="hint">
            {formatNumber(saved.kcal)} {t('kcal')}
          </Text>
        </View>
      )}
    </Card>
  );
}
