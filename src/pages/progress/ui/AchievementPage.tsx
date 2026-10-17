import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MedalMagic, type AchievementKey } from '@/entities/habit';
import { formatDate } from '@/shared/i18n';
import { dayRange } from '@/shared/lib';
import { Button, Text, useColors } from '@/shared/ui';

import { medalHint } from './MedalTile';

import { useProgress } from '../model/useProgress';

import { t } from '../i18n';

type Params = {
  key: AchievementKey;
  celebrate?: string; // '1' - празднование новой медали
  queue?: string; // следующие новые через запятую
};

// Карточка медали поверх экрана: медаль крупно с магией, название, похвала у полученной или условие у следующей, дата или "еще N".
// При празднике - вход с вспышкой и очередь новых кнопкой "Дальше"; тап по подложке закрывает
export function AchievementPage() {
  const { key, celebrate, queue } = useLocalSearchParams<Params>();
  const data = useProgress();
  const colors = useColors();

  const state = data?.states[key];
  if (!data || !state) {
    return null;
  }

  const date = data.got[key];
  const [next, ...rest] = queue ? queue.split(',') : [];
  const hint = date
    ? formatDate(dayRange(date).from)
    : medalHint(key, date, state);

  return (
    <Pressable
      onPress={() => router.back()}
      accessible={false}
      style={{ flex: 1, backgroundColor: colors.scrim }}
    >
      <SafeAreaView style={{ flex: 1, padding: 24 }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {celebrate && (
            <Text
              variant="label"
              style={{ color: colors.onScrim }}
            >
              {t('newAchievement')}
            </Text>
          )}
          <MedalMagic
            // новый key - новый вход у следующей медали очереди
            key={key}
            achievement={key}
            state={state.state}
            size={180}
            entrance={!!celebrate}
          />
          <Text
            variant="title"
            style={{ color: colors.onScrim, textAlign: 'center' }}
          >
            {t(`habit.achievements.${key}`)}
          </Text>
          <Text style={{ color: colors.onScrim, textAlign: 'center' }}>
            {date ? t(`habit.praise.${key}`) : t(`habit.goal.${key}`)}
          </Text>
          {hint && (
            <Text style={{ color: colors.onScrim, opacity: 0.7 }}>{hint}</Text>
          )}
        </View>
        {celebrate && (
          // кнопка прибита к низу: при листании очереди текст разной длины не двигает ее
          <View style={{ marginTop: 24 }}>
            <Button
              variant="scrim"
              title={next ? t('nextAchievement') : t('close')}
              onPress={() =>
                next
                  ? // setParams, а не push: "назад" закрывает карточку сразу
                    router.setParams({ key: next, queue: rest.join(',') })
                  : router.back()
              }
            />
          </View>
        )}
      </SafeAreaView>
    </Pressable>
  );
}
