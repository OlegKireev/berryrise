import { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StatusBar,
  type LayoutChangeEvent,
} from 'react-native';

import { at, useReduceMotion } from '@/shared/lib';

// пауза между появлением строк и их подъем снизу
const STAGGER_MS = 120;
const ROW_RISE = 12;

// Вход первого шага: иконка из центра экрана (где она была на сплэше) уезжает
// на место, потом по очереди появляются строки. При "уменьшить движение" сразу все
export function useIntroEntrance(items: number) {
  const reduce = useReduceMotion();
  const icon = useState(() => new Animated.Value(0))[0];
  const rows = useState(() =>
    Array.from({ length: items }, () => new Animated.Value(0)),
  )[0];
  // сдвиг иконки от ее места до центра экрана, null - еще не измерили
  const [offset, setOffset] = useState<number | null>(null);

  const onIconLayout = (e: LayoutChangeEvent) => {
    if (offset !== null) {
      return;
    }

    e.currentTarget.measureInWindow((_x, y, _w, h) => {
      // measureInWindow считает от низа статус-бара, а сплэш центрирован по экрану
      const center =
        Dimensions.get('screen').height / 2 - (StatusBar.currentHeight ?? 0);
      setOffset(center - (y + h / 2));
    });
  };

  const ready = reduce !== null && offset !== null;

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (reduce) {
      icon.setValue(1);
      rows.forEach((r) => r.setValue(1));
      return;
    }

    const anim = Animated.sequence([
      Animated.timing(icon, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.stagger(
        STAGGER_MS,
        rows.map((r) =>
          Animated.timing(r, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ),
      ),
    ]);
    anim.start();
    return () => anim.stop();
  }, [ready, reduce, icon, rows]);

  return {
    onIconLayout,
    // пока не измерили, прячем все, чтобы не мигнуть конечной раскладкой
    iconStyle: {
      opacity: ready ? 1 : 0,
      transform: [
        {
          translateY: icon.interpolate({
            inputRange: [0, 1],
            outputRange: [offset ?? 0, 0],
          }),
        },
      ],
    },
    rowStyle: (i: number) => ({
      opacity: at(rows, i),
      transform: [
        {
          translateY: at(rows, i).interpolate({
            inputRange: [0, 1],
            outputRange: [ROW_RISE, 0],
          }),
        },
      ],
    }),
  };
}
