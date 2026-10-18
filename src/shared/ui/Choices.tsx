import { View } from 'react-native';
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
    <View>
      {title && (
        <Text
          variant="label"
          style={{ marginBottom: 6 }}
        >
          {title}
        </Text>
      )}
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
    </View>
  );
}
