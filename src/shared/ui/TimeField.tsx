import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

import { formatTime } from '@/shared/i18n';
import { minutesOfDay, timeOfDay } from '@/shared/lib';

import { Button } from './Button';

type Props = {
  // минуты от полуночи
  value: number;
  onChange: (minutes: number) => void;
};

// Только время суток, без даты
export function TimeField({ value, onChange }: Props) {
  if (Platform.OS === 'ios') {
    return (
      <DateTimePicker
        value={timeOfDay(value)}
        mode="time"
        onValueChange={(_, d) => onChange(minutesOfDay(d))}
      />
    );
  }

  return (
    <Button
      title={formatTime(value)}
      onPress={() =>
        DateTimePickerAndroid.open({
          value: timeOfDay(value),
          mode: 'time',
          is24Hour: true,
          onValueChange: (_, d) => onChange(minutesOfDay(d)),
        })
      }
    />
  );
}
