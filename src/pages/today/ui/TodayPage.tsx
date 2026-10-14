import { router } from 'expo-router';
import { Button, View } from 'react-native';

import { Screen } from '@/shared/ui';

import { SECONDARY } from './colors';
import { DayReviewButton } from './DayReviewButton';
import { PartyCard } from './PartyCard';
import { Savings } from './Savings';
import { StreakSummary } from './StreakSummary';

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
      <Savings
        saved={today.saved}
        currency={today.currency}
        hasDrinks={today.hasDrinks}
      />
      {party ? (
        <PartyCard
          party={party}
          onSober={() => today.markPartySober(party.id)}
          onCancel={() => today.cancelParty(party.id)}
        />
      ) : (
        <Button
          title={t('company')}
          onPress={() => router.push('/company')}
        />
      )}
      <DayReviewButton
        day={today.reviewDay}
        isToday={today.isToday}
        done={today.reviewDone}
        beforeStart={today.beforeStart}
      />
      {/* Срыв отдельно и внизу, чтобы не путать с остальными действиями */}
      <View style={{ marginTop: 24 }}>
        <Button
          title={t('relapse')}
          color={SECONDARY}
          onPress={() => router.push('/relapse')}
        />
      </View>
    </Screen>
  );
}
