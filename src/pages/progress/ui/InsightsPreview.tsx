import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Button, Card, Text } from '@/shared/ui';

import { CollectingData } from './CollectingData';

import { useInsights } from '../model/useInsights';

import { t } from '../i18n';

// Превью статистики за последние 30 дней на "Прогрессе", тап открывает экран целиком
export function InsightsPreview() {
  const data = useInsights();

  if (!data) {
    return null;
  }

  const open = () => router.push('/insights');

  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text
          variant="heading"
          style={{ flex: 1 }}
        >
          {t('insights')}
        </Text>
        <Button
          variant="quiet"
          title={t('allAchievements')}
          onPress={open}
        />
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={open}
        style={({ pressed }) => pressed && { opacity: 0.6 }}
      >
        <Card>
          {data.enough ? (
            <>
              <Text>
                {data.peakWeekday === null
                  ? t('noCraving')
                  : `${t('peak')} ${t(`weekdayIn.${data.peakWeekday}`)}`}
              </Text>
              {data.topHelper && (
                <Text>
                  {t('topHelper')} {t(`option.helper.${data.topHelper}`)}
                </Text>
              )}
            </>
          ) : (
            <CollectingData count={data.reviewCount} />
          )}
        </Card>
      </Pressable>
    </View>
  );
}
