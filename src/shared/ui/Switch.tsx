import { Switch as SwitchNative, type SwitchProps } from 'react-native';

import { useColors } from './theme';

// Переключатель в цветах темы
export function Switch(props: SwitchProps) {
  const colors = useColors();
  return (
    <SwitchNative
      trackColor={{ false: colors.border, true: colors.onSecondary }}
      // кружок контрастен дорожке в обеих темах, а не цвету фона
      thumbColor={props.value ? colors.secondary : colors.muted}
      {...props}
    />
  );
}
