import { Chip } from './Chip';
import { ChipRow } from './ChipRow';
import { Text } from './Text';

type Props<K> = {
  title?: string;
  keys: readonly K[];
  label: (k: K) => string;
  isSelected: (k: K) => boolean;
  onPress: (k: K) => void;
};

// Группа вариантов чипами, с подписью или без
export function Choices<K extends string | number>({
  title,
  keys,
  label,
  isSelected,
  onPress,
}: Props<K>) {
  return (
    <>
      {title && <Text variant="label">{title}</Text>}
      <ChipRow>
        {keys.map((k) => (
          <Chip
            key={k}
            label={label(k)}
            selected={isSelected(k)}
            onPress={() => onPress(k)}
          />
        ))}
      </ChipRow>
    </>
  );
}
