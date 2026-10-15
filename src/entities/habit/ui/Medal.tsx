import { memo } from 'react';
import { View } from 'react-native';
import Svg from 'react-native-svg';

import { createT } from '@/shared/i18n';
import { Text } from '@/shared/ui';

import type { AchievementKey, MedalState } from '../model/achievements';

import { dict } from '../i18n';
import { Frame, RIBBON_Y, VIEW_H, VIEW_W } from './medal/frames';
import { medals } from './medal/medals';
import { ink, metals, silhouette } from './medal/palette';
import { Silhouette } from './medal/primitives';

const t = createT(dict);

// подпись на ленте есть только у стрика
type StreakKey = Extract<AchievementKey, `days${number}`>;

type Props = {
  achievement: AchievementKey;
  state: MedalState['state'];
  size?: number;
  shine?: boolean; // бегущий блик, только у полученной
};

// Медаль достижения: рамка по уровню и сцена (матрица в medal/medals.tsx).
// Следующая неполученная - силуэтом сцены в своей рамке; дальше по серии медали не показываем.
// Нарисована кодом; на картинки заменяется только этот файл и папка medal/
export const Medal = memo(function Medal({
  achievement,
  state,
  size = 64,
  shine,
}: Props) {
  const m = medals[achievement];
  const height = (size * VIEW_H) / VIEW_W;
  const label = m.shape === 'hex';
  const text = label ? t(`medal.${achievement as StreakKey}`) : '';
  // лента высотой 17 из 108: цифры должны влезать с запасом
  const fontSize = size * (text.length > 3 ? 0.095 : 0.125);
  return (
    <View style={{ width: size, height }}>
      <Svg
        width={size}
        height={height}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      >
        <Silhouette.Provider value={state === 'next' ? silhouette : null}>
          <Frame
            shape={m.shape}
            metal={metals[m.metal]}
            scene={<m.Scene />}
            over={m.Over && <m.Over />}
            shine={shine && state === 'got'}
          />
        </Silhouette.Provider>
      </Svg>
      {label && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            // центр подписи на ленте. У Manrope цифры сидят ниже середины строки,
            // поэтому чуть выше центра
            top: (height * RIBBON_Y) / VIEW_H - size * 0.165,
            height: size * 0.3,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            weight="bold"
            style={{
              fontSize,
              lineHeight: fontSize * 1.2,
              includeFontPadding: false,
              color: ink.paper,
            }}
          >
            {text}
          </Text>
        </View>
      )}
    </View>
  );
});
