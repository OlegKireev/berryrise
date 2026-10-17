import { weekdays } from '@/shared/i18n';
import { DAYS_PER_WEEK } from '@/shared/lib';
import { Chip, ChipRow, Row, TimeField } from '@/shared/ui';

import { RISK_TIME, type NotificationPrefs } from '../model/types';

import { t } from '../i18n';
import { NotificationGroup } from './NotificationGroup';

type Props = {
  value: NotificationPrefs;
  onChange: (prefs: NotificationPrefs) => void;
};

// weekdays идут с понедельника, getDay считает с воскресенья
const dayOf = (i: number) => (i + 1) % DAYS_PER_WEEK;

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
      <NotificationGroup
        title={t('form.dayReview')}
        hint={t('form.dayReviewHint')}
        on={dayReview.on}
        onToggle={(on) =>
          onChange({ ...value, dayReview: { ...dayReview, on } })
        }
      >
        <Row label={t('form.time')}>
          <TimeField
            value={dayReview.time}
            onChange={(time) =>
              onChange({ ...value, dayReview: { ...dayReview, time } })
            }
          />
        </Row>
      </NotificationGroup>

      <NotificationGroup
        title={t('form.risk')}
        hint={t('form.riskHint')}
        on={risk.on}
        onToggle={(on) => onChange({ ...value, risk: { ...risk, on } })}
      >
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
                  onChange={(m) => setRiskDays({ ...risk.days, [dayOf(i)]: m })}
                />
              </Row>
            )
          );
        })}
      </NotificationGroup>

      <NotificationGroup
        title={t('form.party')}
        hint={t('form.partyHint')}
        on={party.on}
        onToggle={(on) => onChange({ ...value, party: { on } })}
      />
    </>
  );
}
