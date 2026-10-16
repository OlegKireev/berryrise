import { View } from 'react-native';

import type { Mood } from '@/shared/config';
import { Text, useColors } from '@/shared/ui';

import { t } from '../i18n';

type Props = { counts: { mood: Mood; count: number }[] };

// Чем лучше настроение, тем насыщеннее цвет: от "ужасно" бледным до "отлично" полным
const opacity = (mood: Mood) => 0.3 + (mood - 1) * 0.175;

// Доли дней с каждым настроением одной полосой, слева "отлично". Под ней легенда с числом дней
export function MoodChart({ counts }: Props) {
  const colors = useColors();
  const shown = counts.filter((c) => c.count > 0).reverse();
  return (
    <View style={{ gap: 12 }}>
      <Text weight="semibold">{t('option.titles.mood')}</Text>
      <View
        style={{
          flexDirection: 'row',
          height: 16,
          gap: 2,
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        {shown.map(({ mood, count }) => (
          <View
            key={mood}
            style={{
              flex: count,
              backgroundColor: colors.special,
              opacity: opacity(mood),
            }}
          />
        ))}
      </View>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          columnGap: 12,
        }}
      >
        {shown.map(({ mood, count }) => (
          <View
            key={mood}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: colors.special,
                opacity: opacity(mood),
              }}
            />
            <Text variant="hint">
              {t(`option.mood.${mood}`)}: {count}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
