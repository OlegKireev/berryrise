import { View } from 'react-native';

import { Button, Icon, Text, useColors } from '@/shared/ui';

type Props = {
  label: string;
  prevLabel: string; // для диктора: стрелка без текста
  nextLabel: string;
  canPrev: boolean;
  canNext: boolean;
  prev: () => void;
  next: () => void;
  // знак у подписи (собранный месяц), строка - что он значит, для диктора
  mark?: string;
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
  mark,
}: Props) {
  const colors = useColors();
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
      <View
        accessible
        accessibilityLabel={mark ? `${label}, ${mark}` : label}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
      >
        <Text variant="label">{label}</Text>
        {mark && (
          <Icon
            name="star"
            size={18}
            color={colors.special}
            fill={colors.special}
          />
        )}
      </View>
      <Button
        icon="chevronRight"
        accessibilityLabel={nextLabel}
        disabled={!canNext}
        onPress={next}
      />
    </View>
  );
}
