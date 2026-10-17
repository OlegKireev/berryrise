import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Animated, Easing, View, type LayoutChangeEvent } from 'react-native';

import { useReduceMotion } from '@/shared/lib';

type Props = {
  open: boolean;
  children: ReactNode;
};

// height нативный драйвер не умеет
const timing = {
  duration: 220,
  easing: Easing.out(Easing.cubic),
  useNativeDriver: false,
};

// Блок, который плавно раскрывается и сворачивается по высоте.
// Содержимое лежит абсолютно и меряется на свою высоту, внешний блок анимирует ее.
// Свернутое содержимое размонтируется, чтобы не попадать в фокус TalkBack.
export function Collapse({ open, children }: Props) {
  const reduce = useReduceMotion();
  const height = useState(() => new Animated.Value(0))[0];
  // последняя измеренная высота содержимого
  const size = useRef<number | null>(null);
  // открыт с первого рендера: первый замер ставим без анимации
  const instant = useRef(open);
  const [mounted, setMounted] = useState(open);

  if (open && !mounted) {
    setMounted(true);
  }

  // пока не знаем про "уменьшить движение", тоже без анимации
  const animate = useCallback(
    (to: number, done?: () => void) => {
      if (reduce !== false) {
        height.setValue(to);
        done?.();
        return;
      }

      Animated.timing(height, { toValue: to, ...timing }).start(
        ({ finished }) => {
          if (finished) {
            done?.();
          }
        },
      );
    },
    [height, reduce],
  );

  useEffect(() => {
    if (!open) {
      animate(0, () => {
        size.current = null;
        setMounted(false);
      });
      return;
    }

    // открыли снова, пока сворачивался: содержимое не перемерится само
    if (size.current !== null) {
      animate(size.current);
    }
  }, [open, animate]);

  const onLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    size.current = h;

    if (!open) {
      return;
    }

    if (instant.current) {
      instant.current = false;
      height.setValue(h);
      return;
    }

    animate(h);
  };

  if (!mounted) {
    return null;
  }

  return (
    <Animated.View style={{ height, overflow: 'hidden' }}>
      <View
        style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
        onLayout={onLayout}
      >
        {children}
      </View>
    </Animated.View>
  );
}
