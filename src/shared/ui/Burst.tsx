import { Animated, View } from 'react-native';

import { at } from '@/shared/lib';

// Искра: четыре луча из двух вытянутых ромбов
export function Spark({ size, color }: { size: number; color: string }) {
  const ray = { position: 'absolute', backgroundColor: color } as const;
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={[ray, { width: size * 0.2, height: size, borderRadius: size }]}
      />
      <View
        style={[ray, { width: size, height: size * 0.2, borderRadius: size }]}
      />
    </View>
  );
}

type Half = { x: number; y: number };

type Props = {
  progress: Animated.Value; // 0..1
  count: number;
  from: Half; // эллипс, с которого стартуют искры (полуоси)
  to: Half; // эллипс, до которого долетают ближние
  colors: [string, string]; // чередуются с размером: крупные первым цветом
};

// Каждая третья искра дальше: разлет не ровным кольцом
const REACH = [1, 1.17, 1.34];

// Разлет искр из центра родителя по progress. Родитель центрирует детей
export function Burst({ progress, count, from, to, colors }: Props) {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * 2 * Math.PI;
    const k = at(REACH, i % REACH.length);
    const odd = i % 2 === 1;
    return (
      <Animated.View
        key={i}
        pointerEvents="none"
        style={{
          position: 'absolute',
          opacity: progress.interpolate({
            inputRange: [0, 0.1, 1],
            outputRange: [0, 1, 0],
          }),
          transform: [
            {
              translateX: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [Math.cos(a) * from.x, Math.cos(a) * to.x * k],
              }),
            },
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [Math.sin(a) * from.y, Math.sin(a) * to.y * k],
              }),
            },
          ],
        }}
      >
        <Spark
          size={odd ? 8 : 12}
          color={odd ? colors[1] : colors[0]}
        />
      </Animated.View>
    );
  });
}
