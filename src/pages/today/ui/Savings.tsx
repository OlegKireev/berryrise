import { router } from 'expo-router';

import type { Savings as SavingsData } from '@/entities/habit';
import { formatMoney, portions } from '@/shared/i18n';
import { Button, Text } from '@/shared/ui';

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
        onPress={() => router.push('/settings')}
      />
    );
  }

  return (
    <>
      <Text variant="label">{t('saved')}</Text>
      {saved.money !== null && currency && (
        <Text style={{ fontSize: 24 }}>
          {formatMoney(saved.money, currency)}
        </Text>
      )}
      {hasDrinks && (
        <Text>
          {t('notDrunk')}: {portions(saved.portions)}, ~{saved.kcal} {t('kcal')}
        </Text>
      )}
    </>
  );
}
