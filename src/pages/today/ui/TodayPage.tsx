import { router } from 'expo-router';
import { View } from 'react-native';

import { Button, Screen } from '@/shared/ui';

import { DayReviewButton } from './DayReviewButton';
import { PartyCard } from './PartyCard';
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
      {party ? (
        <PartyCard
          party={party}
          onSober={() => today.markPartySober(party.id)}
          onCancel={() => today.cancelParty(party.id)}
        />
      ) : (
        <Button
          variant="primary"
          title={t('company')}
          onPress={() => router.push('/company')}
        />
      )}
      {/* Срыв отдельно и внизу, чтобы не путать с остальными действиями */}
      <View style={{ marginTop: 24 }}>
        <Button
          variant="quiet"
          title={t('hadRelapse')}
          onPress={() => router.push('/relapse')}
        />
      </View>
    </Screen>
  );
}
