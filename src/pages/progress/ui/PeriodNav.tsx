import { View } from 'react-native';

import { Button, Text } from '@/shared/ui';

type Props = {
  label: string;
  prevLabel: string; // для диктора: стрелка без текста
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
        icon="chevronLeft"
        accessibilityLabel={prevLabel}
        disabled={!canPrev}
        onPress={prev}
      />
      <Text variant="label">{label}</Text>
      <Button
        icon="chevronRight"
        accessibilityLabel={nextLabel}
        disabled={!canNext}
        onPress={next}
      />
    </View>
  );
}
