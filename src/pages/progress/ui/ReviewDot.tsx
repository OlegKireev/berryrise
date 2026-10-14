import { useTheme } from 'expo-router';
import { View } from 'react-native';

// Отметка "итоги дня подведены"
export function ReviewDot() {
  const { colors } = useTheme();
  return (
    <View
      style={{
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.text,
      }}
    />
  );
}
