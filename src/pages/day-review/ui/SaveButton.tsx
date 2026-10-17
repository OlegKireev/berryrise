import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { useReduceMotion } from '@/shared/lib';
import { Burst, Button, Icon, useColors } from '@/shared/ui';

import { t } from '../i18n';

type Props = {
  disabled: boolean;
  done: boolean; // сохранено: кнопка становится галочкой, искры, вибрация
  onPress: () => void;
};

const SPARKS = 16;
// искры стартуют с краев кнопки и улетают на столько дальше
const SPARK_REACH = 28;
// кнопка вжимается и отпружинивает обратно
const PRESSED_SCALE = 0.9;

// "Сохранить" итогов дня с маленькой наградой после сохранения.
// При "уменьшить движение" - только галочка и вибрация
export function SaveButton({ disabled, done, onPress }: Props) {
  const colors = useColors();
  const reduce = useReduceMotion();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const fill = useState(() => new Animated.Value(0))[0];
  const pop = useState(() => new Animated.Value(1))[0];
  const burst = useState(() => new Animated.Value(0))[0];

  useEffect(() => {
    if (!done || reduce === null) {
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (reduce) {
      fill.setValue(1);
      return;
    }

    const native = { useNativeDriver: true };
    pop.setValue(PRESSED_SCALE);
    const enter = Animated.parallel([
      Animated.timing(fill, { toValue: 1, duration: 150, ...native }),
      Animated.spring(pop, {
        toValue: 1,
        friction: 3,
        tension: 120,
        ...native,
      }),
      Animated.timing(burst, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        ...native,
      }),
    ]);
    enter.start();
    return () => enter.stop();
  }, [done, reduce, fill, pop, burst]);

  const half = { x: size.width / 2, y: size.height / 2 };

  return (
    <View
      style={{ alignItems: 'center', justifyContent: 'center' }}
      onLayout={(e) => setSize(e.nativeEvent.layout)}
    >
      {done && reduce === false && (
        <Burst
          progress={burst}
          count={SPARKS}
          from={half}
          to={{ x: half.x + SPARK_REACH, y: half.y + SPARK_REACH }}
          colors={[colors.sober, colors.gold]}
        />
      )}
      <Animated.View
        style={{ alignSelf: 'stretch', transform: [{ scale: pop }] }}
      >
        <Button
          variant="primary"
          title={t('save')}
          disabled={disabled}
          onPress={onPress}
        />
        <Animated.View
          pointerEvents="none"
          accessibilityLiveRegion="polite"
          accessibilityLabel={done ? t('done') : undefined}
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.sober,
              opacity: fill,
            },
          ]}
        >
          <Icon
            name="check"
            size={26}
            color={colors.onPrimary}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}
