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

// Выбор прижимаем к [min, max]: пикер времени границ не знает. date - локальная полночь
const clamp = (
  { min, max, mode }: Omit<Props, 'value' | 'onChange'>,
  picked: Date,
) => {
  const d = mode === 'date' ? dayDate(toDay(picked.getTime())) : picked;
  return new Date(
    Math.min(Math.max(d.getTime(), min?.getTime() ?? -Infinity), max.getTime()),
  );
};

const openAndroid = (props: Props, picker: 'date' | 'time') =>
  DateTimePickerAndroid.open({
    value: props.value,
    mode: picker,
    minimumDate: props.min,
    maximumDate: props.max,
    onValueChange: (_, d) => props.onChange(clamp(props, d)),
  });

// Только Android: сразу открыть выбор дня, без поля (строка "Дата старта" в настройках)
export const pickDate = (props: Omit<Props, 'mode'>) =>
  openAndroid({ ...props, mode: 'date' }, 'date');

// Дата и время в границах [min, max]
export function DateTimeField(props: Props) {
  const { value, min, max, mode = 'datetime' } = props;
  const dateOnly = mode === 'date';

  if (Platform.OS === 'ios') {
    return (
      <DateTimePicker
        value={value}
        mode={mode}
        minimumDate={min}
        maximumDate={max}
        onValueChange={(_, d) => props.onChange(clamp({ min, max, mode }, d))}
      />
    );
  }

  const open = (picker: 'date' | 'time') =>
    openAndroid({ ...props, mode }, picker);

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
