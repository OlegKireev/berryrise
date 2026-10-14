import { drinks, type Drink } from '@/entities/habit';
import { Input, Row, Text } from '@/shared/ui';

import { t } from '../i18n';

type Props = {
  counts: Partial<Record<Drink, string>>;
  setCount: (d: Drink, s: string) => void;
};

// Сколько порций каждого напитка в неделю
export function DrinkCounts({ counts, setCount }: Props) {
  return (
    <>
      <Text variant="label">{t('drinksTitle')}</Text>
      {drinks.map((d) => (
        <Row
          key={d}
          label={t(`habit.drinks.${d}`)}
        >
          <Input
            value={counts[d] ?? ''}
            onChangeText={(s) => setCount(d, s)}
            keyboardType="number-pad"
            maxLength={3}
            placeholder="0"
            style={{ width: 64, textAlign: 'center' }}
          />
        </Row>
      ))}
    </>
  );
}
