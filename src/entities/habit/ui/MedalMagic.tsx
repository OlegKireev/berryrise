import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { useReduceMotion } from '@/shared/lib';

import type { AchievementKey, MedalState } from '../model/achievements';

import { Medal } from './Medal';
import { VIEW_H, VIEW_W } from './medal/frames';
import { medals } from './medal/medals';
import { metals } from './medal/palette';

type Props = {
  achievement: AchievementKey;
  state: MedalState['state'];
  size: number;
  entrance?: boolean; // празднование: вспышка, рост, разлет частиц, вибрация
};

const DUST = 20;
const BURST = 18;

// Псевдослучайное 0..1 от индекса пылинки и номера свойства: при рендере Math.random нельзя
const rnd = (i: number, k: number) => {
  const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return v - Math.floor(v);
};

// Искра: четыре луча из двух вытянутых ромбов
function Spark({ size, color }: { size: number; color: string }) {
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

// Медаль с магией в духе золотых карт: свечение, блик по рамке, летающая пыль.
// У силуэта следующей медали магии нет. Все на Animated, без пересборки
export function MedalMagic({ achievement, state, size, entrance }: Props) {
  const reduce = useReduceMotion();
  const magic = state === 'got';
  const metal = metals[medals[achievement].metal];
  const box = size * 1.6;
  const height = (size * VIEW_H) / VIEW_W;

  const glow = useState(() => new Animated.Value(0))[0];
  const grow = useState(() => new Animated.Value(entrance ? 0 : 1))[0];
  const burst = useState(() => new Animated.Value(0))[0];
  const dust = useMemo(
    () =>
      Array.from({ length: DUST }, (_, i) => ({
        x: (rnd(i, 0) - 0.5) * size * 1.1,
        y: (rnd(i, 1) - 0.3) * height,
        size: 7 + rnd(i, 2) * 9,
        delay: rnd(i, 3) * 2400,
        duration: 1800 + rnd(i, 4) * 1400,
        white: rnd(i, 5) < 0.5,
        v: new Animated.Value(0),
      })),
    [size, height],
  );

  useEffect(() => {
    if (reduce === null) return;
    if (entrance)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (reduce || !magic) {
      grow.setValue(1);
      glow.setValue(magic ? 0.5 : 0);
      return;
    }
    const native = { useNativeDriver: true };
    const loops = [
      Animated.loop(
        Animated.sequence([
          Animated.timing(glow, {
            toValue: 1,
            duration: 1600,
            easing: Easing.inOut(Easing.sin),
            ...native,
          }),
          Animated.timing(glow, {
            toValue: 0,
            duration: 1600,
            easing: Easing.inOut(Easing.sin),
            ...native,
          }),
        ]),
      ),
      ...dust.map((d) =>
        Animated.sequence([
          Animated.delay(d.delay),
          Animated.loop(
            Animated.timing(d.v, {
              toValue: 1,
              duration: d.duration,
              easing: Easing.out(Easing.quad),
              ...native,
            }),
          ),
        ]),
      ),
    ];
    const enter = entrance
      ? Animated.parallel([
          Animated.spring(grow, {
            toValue: 1,
            friction: 5,
            tension: 60,
            ...native,
          }),
          Animated.timing(burst, {
            toValue: 1,
            duration: 900,
            easing: Easing.out(Easing.cubic),
            ...native,
          }),
        ])
      : null;
    enter?.start();
    loops.forEach((l) => l.start());
    return () => {
      enter?.stop();
      loops.forEach((l) => l.stop());
    };
  }, [reduce, magic, entrance, glow, grow, burst, dust]);

  // до ответа системы про движение не показываем вход, чтобы медаль не мигнула полной
  const hidden = entrance && reduce === null;

  return (
    <View
      style={{
        width: box,
        height: box,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: hidden ? 0 : 1,
      }}
    >
      {magic && (
        <Animated.View
          style={{
            position: 'absolute',
            opacity: glow.interpolate({
              inputRange: [0, 1],
              outputRange: [0.45, 0.9],
            }),
            transform: [
              {
                scale: glow.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.92, 1.08],
                }),
              },
            ],
          }}
        >
          <Svg
            width={box}
            height={box}
          >
            <Defs>
              <RadialGradient id="glow">
                <Stop
                  offset={0}
                  stopColor={metal.light}
                  stopOpacity={0.9}
                />
                <Stop
                  offset={0.55}
                  stopColor={metal.base}
                  stopOpacity={0.35}
                />
                <Stop
                  offset={1}
                  stopColor={metal.base}
                  stopOpacity={0}
                />
              </RadialGradient>
            </Defs>
            <Circle
              cx={box / 2}
              cy={box / 2}
              r={box / 2}
              fill="url(#glow)"
            />
          </Svg>
        </Animated.View>
      )}

      {entrance && magic && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size,
            backgroundColor: '#FFFFFF',
            opacity: burst.interpolate({
              inputRange: [0, 0.15, 1],
              outputRange: [0, 0.9, 0],
            }),
            transform: [
              {
                scale: burst.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.2, 2.2],
                }),
              },
            ],
          }}
        />
      )}

      <Animated.View style={{ transform: [{ scale: grow }] }}>
        <Medal
          achievement={achievement}
          state={state}
          size={size}
          shine={reduce === false}
        />
      </Animated.View>

      {entrance &&
        magic &&
        Array.from({ length: BURST }, (_, i) => {
          const a = (i / BURST) * 2 * Math.PI;
          const r = size * (0.7 + (i % 3) * 0.12);
          return (
            <Animated.View
              key={`b${i}`}
              pointerEvents="none"
              style={{
                position: 'absolute',
                opacity: burst.interpolate({
                  inputRange: [0, 0.1, 1],
                  outputRange: [0, 1, 0],
                }),
                transform: [
                  {
                    translateX: burst.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, Math.cos(a) * r],
                    }),
                  },
                  {
                    translateY: burst.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, Math.sin(a) * r],
                    }),
                  },
                ],
              }}
            >
              <Spark
                size={i % 2 ? 8 : 12}
                color={i % 2 ? metal.light : '#FFFFFF'}
              />
            </Animated.View>
          );
        })}

      {magic &&
        reduce === false &&
        dust.map((d, i) => (
          <Animated.View
            key={`d${i}`}
            pointerEvents="none"
            style={{
              position: 'absolute',
              opacity: d.v.interpolate({
                inputRange: [0, 0.3, 0.7, 1],
                outputRange: [0, 1, 0.8, 0],
              }),
              transform: [
                { translateX: d.x },
                {
                  translateY: d.v.interpolate({
                    inputRange: [0, 1],
                    outputRange: [d.y, d.y - size * 0.35],
                  }),
                },
                {
                  scale: d.v.interpolate({
                    inputRange: [0, 0.4, 1],
                    outputRange: [0.3, 1, 0.5],
                  }),
                },
              ],
            }}
          >
            <Spark
              size={d.size}
              color={d.white ? '#FFFFFF' : metal.light}
            />
          </Animated.View>
        ))}
    </View>
  );
}
