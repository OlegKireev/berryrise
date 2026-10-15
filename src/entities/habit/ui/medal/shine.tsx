import { useEffect, useState } from 'react';
import { Animated, Easing } from 'react-native';
import {
  ClipPath,
  Defs,
  G,
  LinearGradient,
  Polygon,
  Rect,
  Stop,
} from 'react-native-svg';

const BAND = 26;

// Блик полученной медали: косая светлая полоса пробегает по всей медали, обрезана по рамке.
// SVG-атрибуты нативный драйвер не двигает, а JS-драйвер на Fabric до пропсов SVG не доходит.
// Поэтому значение слушаем и кладем в state: перерисовывается только полоса, для одной медали хватает
export function Shine({ outer }: { outer: string }) {
  const x = useState(() => new Animated.Value(-60))[0];
  const [pos, setPos] = useState(-60);

  useEffect(() => {
    const run = Animated.loop(
      Animated.sequence([
        Animated.timing(x, {
          toValue: 130,
          duration: 1300,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.delay(1800),
        Animated.timing(x, {
          toValue: -60,
          duration: 0,
          useNativeDriver: false,
        }),
      ]),
    );
    const id = x.addListener(({ value }) => setPos(value));
    run.start();
    return () => {
      run.stop();
      x.removeListener(id);
    };
  }, [x]);

  return (
    <G>
      <Defs>
        <ClipPath id="shine">
          <Polygon points={outer} />
        </ClipPath>
        <LinearGradient
          id="shineBand"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <Stop
            offset={0}
            stopColor="#FFFFFF"
            stopOpacity={0}
          />
          <Stop
            offset={0.5}
            stopColor="#FFFFFF"
            stopOpacity={0.7}
          />
          <Stop
            offset={1}
            stopColor="#FFFFFF"
            stopOpacity={0}
          />
        </LinearGradient>
      </Defs>
      <G clipPath="url(#shine)">
        <G transform="rotate(20 50 54)">
          <Rect
            x={pos}
            y={-30}
            width={BAND}
            // с запасом на поворот: viewBox медали 100x108
            height={170}
            fill="url(#shineBand)"
          />
        </G>
      </G>
    </G>
  );
}
