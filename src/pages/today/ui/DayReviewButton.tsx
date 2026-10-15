import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { formatDay } from '@/shared/i18n';
import { Text, useColors } from '@/shared/ui';

import { t } from '../i18n';

type Props = {
  day: string;
  isToday: boolean;
  done: boolean;
  beforeStart: boolean;
};

// Шалфейная плашка: слева за какой день, справа что сделать
export function DayReviewButton({ day, isToday, done, beforeStart }: Props) {
  const colors = useColors();

  if (beforeStart) {
    return <Text variant="hint">{t('review.later')}</Text>;
  }

  const fg = { color: colors.onSecondary };
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push('/day-review')}
      android_ripple={{ color: colors.onSecondary, foreground: true }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: colors.secondary,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          weight="semibold"
          style={[fg, { fontSize: 17 }]}
        >
          {t(isToday ? 'dayReviewToday' : 'dayReviewYesterday')}
        </Text>
        <Text style={[fg, { fontSize: 13, opacity: 0.8 }]}>
          {formatDay(day)}
        </Text>
      </View>
      <Text
        weight="medium"
        style={fg}
      >
        {t(done ? 'reviewFilled' : 'reviewFill')}
      </Text>
    </Pressable>
  );
}
