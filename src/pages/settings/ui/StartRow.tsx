import { Alert, Platform } from 'react-native';

import { days, formatDate } from '@/shared/i18n';
import { DateTimeField, pickDate, Row, Text } from '@/shared/ui';

import type { StartChange } from '../model/startChange';

import { t } from '../i18n';

type Props = {
  startAt: number;
  maxStart: number;
  checkStart: (d: Date) => Promise<StartChange | null>;
  changeStart: (d: Date) => Promise<void>;
};

const confirmText = ({ streak, medalsLost }: StartChange) =>
  [
    streak &&
      `${t('streakBecomes')} ${days(streak.to)} ${t('insteadOf')} ${String(streak.from)}.`,
    medalsLost && t('medalsLost'),
  ]
    .filter(Boolean)
    .join(' ');

// Дата старта прямо в хабе. Если что-то потеряется, сначала спрашиваем
export function StartRow({
  startAt,
  maxStart,
  checkStart,
  changeStart,
}: Props) {
  const change = async (d: Date) => {
    const loss = await checkStart(d);

    if (!loss) {
      await changeStart(d);
      return;
    }

    Alert.alert(t('laterStartTitle'), confirmText(loss), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('change'), onPress: () => changeStart(d) },
    ]);
  };
  const field = {
    value: new Date(startAt),
    max: new Date(maxStart),
    onChange: change,
  };

  if (Platform.OS === 'ios') {
    return (
      <Row
        icon="calendar"
        label={t('startDate')}
      >
        <DateTimeField
          mode="date"
          {...field}
        />
      </Row>
    );
  }

  return (
    <Row
      icon="calendar"
      label={t('startDate')}
      arrow={false}
      onPress={() => pickDate(field)}
    >
      <Text variant="hint">{formatDate(startAt)}</Text>
    </Row>
  );
}
