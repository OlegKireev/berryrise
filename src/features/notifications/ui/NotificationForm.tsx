import { weekdays } from '@/shared/i18n';
import { Chip, ChipRow, Row, Switch, Text, TimeField } from '@/shared/ui';

import { RISK_TIME, type NotificationPrefs } from '../model/types';

import { t } from '../i18n';

type Props = {
  value: NotificationPrefs;
  onChange: (prefs: NotificationPrefs) => void;
};

// weekdays идут с понедельника, getDay считает с воскресенья
const dayOf = (i: number) => (i + 1) % 7;

// Переключатели и время напоминаний: одна форма для онбординга и настроек
export function NotificationForm({ value, onChange }: Props) {
  const { dayReview, risk, party } = value;
  const setRiskDays = (days: NotificationPrefs['risk']['days']) =>
    onChange({ ...value, risk: { ...risk, days } });

  const toggleDay = (d: number) => {
    const { [d]: time, ...rest } = risk.days;
    setRiskDays(time === undefined ? { ...risk.days, [d]: RISK_TIME } : rest);
  };

  return (
    <>
      <Row label={t('form.dayReview')}>
        <Switch
          value={dayReview.on}
          onValueChange={(on) =>
            onChange({ ...value, dayReview: { ...dayReview, on } })
          }
        />
      </Row>
      {dayReview.on && (
        <Row label={t('form.time')}>
          <TimeField
            value={dayReview.time}
            onChange={(time) =>
              onChange({ ...value, dayReview: { ...dayReview, time } })
            }
          />
        </Row>
      )}

      <Row label={t('form.risk')}>
        <Switch
          value={risk.on}
          onValueChange={(on) => onChange({ ...value, risk: { ...risk, on } })}
        />
      </Row>
      {risk.on && (
        <>
          <Text variant="hint">{t('form.riskHint')}</Text>
          <ChipRow>
            {weekdays.map((name, i) => (
              <Chip
                key={name}
                label={name}
                selected={risk.days[dayOf(i)] !== undefined}
                onPress={() => toggleDay(dayOf(i))}
              />
            ))}
          </ChipRow>
          {weekdays.map((name, i) => {
            const time = risk.days[dayOf(i)];
            return (
              time !== undefined && (
                <Row
                  key={name}
                  label={name}
                >
                  <TimeField
                    value={time}
                    onChange={(m) =>
                      setRiskDays({ ...risk.days, [dayOf(i)]: m })
                    }
                  />
                </Row>
              )
            );
          })}
        </>
      )}

      <Row label={t('form.party')}>
        <Switch
          value={party.on}
          onValueChange={(on) => onChange({ ...value, party: { on } })}
        />
      </Row>
    </>
  );
}
