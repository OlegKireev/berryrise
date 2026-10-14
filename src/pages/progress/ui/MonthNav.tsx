import { Button, View } from 'react-native';

import { formatMonth } from '@/shared/i18n';
import { Text } from '@/shared/ui';

import { t } from '../i18n';

type Props = {
  year: number;
  month: number;
  canPrev: boolean;
  canNext: boolean;
  prev: () => void;
  next: () => void;
};

// Название месяца и стрелки листания
export function MonthNav({ year, month, canPrev, canNext, prev, next }: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Button
        title="<"
        accessibilityLabel={t('prevMonth')}
        disabled={!canPrev}
        onPress={prev}
      />
      <Text variant="label">{formatMonth(year, month)}</Text>
      <Button
        title=">"
        accessibilityLabel={t('nextMonth')}
        disabled={!canNext}
        onPress={next}
      />
    </View>
  );
}
