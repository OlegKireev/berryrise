import { View } from 'react-native';

import { Button, Text } from '@/shared/ui';

type Props = {
  label: string;
  prevLabel: string; // для доступности: стрелка без текста
  nextLabel: string;
  canPrev: boolean;
  canNext: boolean;
  prev: () => void;
  next: () => void;
};

// Подпись периода и стрелки листания: месяц в календаре, день в модалке дня
export function PeriodNav({
  label,
  prevLabel,
  nextLabel,
  canPrev,
  canNext,
  prev,
  next,
}: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Button
        title="‹"
        accessibilityLabel={prevLabel}
        disabled={!canPrev}
        onPress={prev}
      />
      <Text variant="label">{label}</Text>
      <Button
        title="›"
        accessibilityLabel={nextLabel}
        disabled={!canNext}
        onPress={next}
      />
    </View>
  );
}
