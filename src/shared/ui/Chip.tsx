import { useTheme } from 'expo-router';
import { Pressable } from 'react-native';
import { Text } from './Text';

// Вариант выбора: выбранный подсвечен цветом темы
export function Chip({
  label,
  selected,
  onPress,
  onLongPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  onLongPress?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      style={{
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: selected ? colors.primary : 'transparent',
      }}
    >
      <Text style={{ color: selected ? colors.background : colors.text }}>
        {label}
      </Text>
    </Pressable>
  );
}
