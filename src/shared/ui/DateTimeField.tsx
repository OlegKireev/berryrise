import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { Platform, View } from 'react-native';

import { formatDate, formatDateTime, t } from '@/shared/i18n';
import { dayDate, toDay } from '@/shared/lib';
import { Button } from './Button';
import { Text } from './Text';

type Props = {
  value: Date;
  onChange: (d: Date) => void;
  min?: Date;
  max: Date;
  mode?: 'date' | 'datetime'; // date - только день, значение - локальная полночь
};

// Дата и время в границах [min, max]. Пикер времени границ не знает, поэтому результат прижимаем.
export function DateTimeField({
  value,
  onChange,
  min,
  max,
  mode = 'datetime',
}: Props) {
  const dateOnly = mode === 'date';

  const set = (picked: Date) => {
    const d = dateOnly ? dayDate(toDay(picked.getTime())) : picked;
    onChange(
      new Date(
        Math.min(
          Math.max(d.getTime(), min?.getTime() ?? -Infinity),
          max.getTime(),
        ),
      ),
    );
  };

  if (Platform.OS === 'ios') {
    return (
      <DateTimePicker
        value={value}
        mode={mode}
        minimumDate={min}
        maximumDate={max}
        onValueChange={(_, d) => set(d)}
      />
    );
  }

  const open = (picker: 'date' | 'time') =>
    DateTimePickerAndroid.open({
      value,
      mode: picker,
      minimumDate: min,
      maximumDate: max,
      onValueChange: (_, d) => set(d),
    });

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontSize: 20 }}>
        {(dateOnly ? formatDate : formatDateTime)(value.getTime())}
      </Text>
      <Button
        title={t('changeDate')}
        onPress={() => open('date')}
      />
      {!dateOnly && (
        <Button
          title={t('changeTime')}
          onPress={() => open('time')}
        />
      )}
    </View>
  );
}
