import { router, useTheme } from 'expo-router';
import { Button, View } from 'react-native';

import type { Party } from '@/entities/party';
import {
  days,
  formatDateTime,
  formatDay,
  formatMoney,
  portions,
} from '@/shared/i18n';
import { Screen, Text } from '@/shared/ui';

import { useToday } from '../model/useToday';

import { t } from '../i18n';

// ponytail: цвета кнопок константами, пока нет токенов дизайна
const SOBER = '#2e7d32';
const SECONDARY = '#8e8e93';

export function TodayPage() {
  const today = useToday();

  if (!today) {
    return null;
  }

  const { streak, saved, currency, hasDrinks, party } = today;

  return (
    <Screen>
      <Text style={{ fontSize: 48, fontWeight: '700' }}>
        {days(streak.current)}
      </Text>
      <Text style={{ opacity: 0.6 }}>
        {t('since')} {formatDateTime(streak.since)}
      </Text>
      <Text>
        {t('bestStreak')}: {days(streak.best)}
      </Text>
      <Text>
        {t('totalDays')}: {streak.total}
      </Text>
      {saved.money === null && !hasDrinks ? (
        <Button
          title={t('savingsEmpty')}
          onPress={() => router.push('/settings')}
        />
      ) : (
        <>
          <Text style={{ fontWeight: '600' }}>{t('saved')}</Text>
          {saved.money !== null && currency && (
            <Text style={{ fontSize: 24 }}>
              {formatMoney(saved.money, currency)}
            </Text>
          )}
          {hasDrinks && (
            <Text>
              {t('notDrunk')}: {portions(saved.portions)}, ~{saved.kcal}{' '}
              {t('kcal')}
            </Text>
          )}
        </>
      )}
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
      {today.beforeStart ? (
        <Text style={{ opacity: 0.6 }}>{t('review.later')}</Text>
      ) : (
        <Button
          title={`${
            today.reviewDone
              ? t(
                  today.isToday
                    ? 'dayReviewTodayDone'
                    : 'dayReviewYesterdayDone',
                )
              : t(today.isToday ? 'dayReviewToday' : 'dayReviewYesterday')
          }, ${formatDay(today.reviewDay)}`}
          onPress={() => router.push('/day-review')}
        />
      )}
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

// Идущая вечеринка: ответить "как прошло?" можно в любой момент
function PartyCard({
  party,
  onSober,
  onCancel,
}: {
  party: Party;
  onSober: () => void;
  onCancel: () => void;
}) {
  const { colors } = useTheme();
  const row = { flexDirection: 'row', gap: 8 } as const;
  return (
    <View
      style={{
        gap: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: '600' }}>
        {t('partyCardTitle')}
      </Text>
      <Text style={{ opacity: 0.6 }}>
        {t('partyCardUntil')} {formatDateTime(party.expectedEndAt)}
      </Text>
      {/* Главный вопрос: два ответа рядом и разными цветами */}
      <View style={row}>
        <View style={{ flex: 1 }}>
          <Button
            title={t('partySober')}
            color={SOBER}
            onPress={onSober}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            title={t('partyDrank')}
            color={colors.notification}
            onPress={() =>
              router.push({
                pathname: '/relapse',
                params: { partyId: party.id },
              })
            }
          />
        </View>
      </View>
      <View style={row}>
        <View style={{ flex: 1 }}>
          <Button
            title={t('partyOpen')}
            color={SECONDARY}
            onPress={() => router.push('/company')}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            title={t('partyCancel')}
            color={SECONDARY}
            onPress={onCancel}
          />
        </View>
      </View>
    </View>
  );
}
