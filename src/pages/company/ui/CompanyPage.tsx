import { ReasonList } from '@/entities/reason';
import { DAY_MS } from '@/shared/lib';
import { DateTimeField, Screen, Text } from '@/shared/ui';

import { DrinksSection } from './DrinksSection';
import { RepliesSection } from './RepliesSection';

import { useCompany } from '../model/useCompany';

import { t } from '../i18n';

export function CompanyPage() {
  const company = useCompany();

  if (!company) {
    return null;
  }

  const { party } = company;

  return (
    <Screen>
      <ReasonList reasons={company.reasons} />

      <Text variant="label">{t('partyEnd')}</Text>
      <DateTimeField
        value={new Date(party.expectedEndAt)}
        onChange={company.changeEnd}
        min={new Date(party.startAt)}
        max={new Date(party.startAt + DAY_MS)}
      />

      <DrinksSection drinks={company.drinks} />
      <RepliesSection />

      <Text style={{ fontSize: 18, marginTop: 8 }}>{t('leaveEarly')}</Text>
    </Screen>
  );
}
