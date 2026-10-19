import { View } from 'react-native';

import { Button, Screen } from '@/shared/ui';

import { DayReviewButton } from './DayReviewButton';
import { PartyCard } from './PartyCard';
import { PartyGoing } from './PartyGoing';
import { ReasonOfDay } from './ReasonOfDay';
import { Savings } from './Savings';
import { StreakSummary } from './StreakSummary';
import { WeekStrip } from './WeekStrip';

import { useToday } from '../model/useToday';

import { t } from '../i18n';

export function TodayPage() {
  const today = useToday();

  if (!today) {
    return null;
  }

  const { party } = today;

  return (
    <Screen>
      <StreakSummary streak={today.streak} />
      <WeekStrip week={today.week} />
      <Savings
        saved={today.saved}
        currency={today.currency}
        hasDrinks={today.hasDrinks}
      />
      <ReasonOfDay reason={today.reason} />
      <DayReviewButton
        day={today.reviewDay}
        isToday={today.isToday}
        done={today.reviewDone}
        beforeStart={today.beforeStart}
      />
      {party && today.partyEnded ? (
        <PartyCard
          party={party}
          onSober={() => today.markPartySober(party.id)}
        />
      ) : party ? (
        <PartyGoing party={party} />
      ) : (
        <Button
          variant="primary"
          title={t('company')}
          href="/company"
        />
      )}
      {/* Срыв отдельно и внизу, чтобы не путать с остальными действиями */}
      <View style={{ marginTop: 8 }}>
        <Button
          variant="quiet"
          title={t('hadRelapse')}
          href="/relapse"
        />
      </View>
    </Screen>
  );
}
