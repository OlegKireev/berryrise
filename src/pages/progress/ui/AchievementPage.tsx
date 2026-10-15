import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MedalMagic, type AchievementKey } from '@/entities/habit';
import { formatDate } from '@/shared/i18n';
import { dayRange } from '@/shared/lib';
import { Text, useColors } from '@/shared/ui';

import { medalHint } from './MedalTile';

import { useProgress } from '../model/useProgress';

import { t } from '../i18n';

type Params = {
  key: AchievementKey;
  celebrate?: string; // '1' - празднование новой медали
  queue?: string; // следующие новые через запятую
};

// Кнопка на темной подложке: обычные кнопки темы на ней теряются в светлой теме
function ScrimButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={{
        alignSelf: 'stretch',
        paddingVertical: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.onScrim,
        alignItems: 'center',
      }}
    >
      <Text
        weight="semibold"
        style={{ color: colors.onScrim, fontSize: 17 }}
      >
        {title}
      </Text>
    </Pressable>
  );
}

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
      <SafeAreaView
        style={{
          flex: 1,
          padding: 24,
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
        {celebrate && (
          <View style={{ alignSelf: 'stretch', marginTop: 24 }}>
            <ScrimButton
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
