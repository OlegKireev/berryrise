import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { Button, Platform } from 'react-native';

import { formatTime } from '@/shared/i18n';

type Props = {
  // минуты от полуночи
  value: number;
  onChange: (minutes: number) => void;
};

const toDate = (m: number) => new Date(2026, 0, 1, Math.floor(m / 60), m % 60);
const toMinutes = (d: Date) => d.getHours() * 60 + d.getMinutes();

// Только время суток, без даты
export function TimeField({ value, onChange }: Props) {
  if (Platform.OS === 'ios') {
    return (
      <DateTimePicker
        value={toDate(value)}
        mode="time"
        onValueChange={(_, d) => onChange(toMinutes(d))}
      />
    );
  }

  return (
    <Button
      title={formatTime(value)}
      onPress={() =>
        DateTimePickerAndroid.open({
          value: toDate(value),
          mode: 'time',
          is24Hour: true,
          onValueChange: (_, d) => onChange(toMinutes(d)),
        })
      }
    />
  );
}
