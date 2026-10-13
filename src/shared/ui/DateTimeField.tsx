import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { Button, Platform, View } from 'react-native';

import { formatDateTime, t } from '@/shared/i18n';
import { Text } from './Text';

type Props = {
  value: Date;
  onChange: (d: Date) => void;
  min?: Date;
  max: Date;
};

// Дата и время в границах [min, max]. Пикер времени границ не знает, поэтому результат прижимаем.
export function DateTimeField({ value, onChange, min, max }: Props) {
  const set = (d: Date) =>
    onChange(
      new Date(
        Math.min(
          Math.max(d.getTime(), min?.getTime() ?? -Infinity),
          max.getTime(),
        ),
      ),
    );

  if (Platform.OS === 'ios') {
    return (
      <DateTimePicker
        value={value}
        mode="datetime"
        minimumDate={min}
        maximumDate={max}
        onValueChange={(_, d) => set(d)}
      />
    );
  }

  const open = (mode: 'date' | 'time') =>
    DateTimePickerAndroid.open({
      value,
      mode,
      minimumDate: min,
      maximumDate: max,
      onValueChange: (_, d) => set(d),
    });

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontSize: 20 }}>{formatDateTime(value.getTime())}</Text>
      <Button
        title={t('changeDate')}
        onPress={() => open('date')}
      />
      <Button
        title={t('changeTime')}
        onPress={() => open('time')}
      />
    </View>
  );
}
