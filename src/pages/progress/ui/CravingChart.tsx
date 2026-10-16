import { View } from 'react-native';

import { cravings } from '@/shared/config';
import { weekdays } from '@/shared/i18n';
import { Text, useColors } from '@/shared/ui';

import { t } from '../i18n';

const HEIGHT = 96;
const LINE = 14; // высота строки подписи шкалы: линии сетки идут по центру подписей
const PLOT = HEIGHT - LINE; // от линии "нет" до линии "сильно"
const MAX = cravings.length - 1;

// Средняя тяга по дням недели столбиками на шкале уровней "нет".."сильно".
// Без итогов - пусто, тяга "нет" - линия у основания
export function CravingChart({ values }: { values: (number | null)[] }) {
  const colors = useColors();
  const levels = [...cravings].reverse(); // сверху "сильно"
  return (
    <View style={{ gap: 12 }}>
      <Text weight="semibold">{t('cravingByWeekday')}</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ height: HEIGHT, justifyContent: 'space-between' }}>
          {levels.map((c) => (
            <Text
              key={c}
              variant="hint"
              style={{ fontSize: 12, lineHeight: LINE }}
            >
              {t(`option.craving.${c}`)}
            </Text>
          ))}
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ height: HEIGHT }}>
            {levels.map((c, i) => (
              <View
                key={c}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: LINE / 2 + (i / MAX) * PLOT,
                  height: 1,
                  backgroundColor: colors.border,
                }}
              />
            ))}
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: LINE / 2,
                flexDirection: 'row',
                alignItems: 'flex-end',
                gap: 6,
              }}
            >
              {values.map((v, i) => (
                <View
                  key={i}
                  accessible
                  accessibilityLabel={
                    v === null
                      ? weekdays[i]
                      : `${weekdays[i]}: ${t(`option.craving.${cravings[Math.round(v)]!}`)}`
                  }
                  style={{
                    flex: 1,
                    height: v === null ? 0 : Math.max(2, (v / MAX) * PLOT),
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                    backgroundColor: colors.special,
                  }}
                />
              ))}
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {weekdays.map((d) => (
              <Text
                key={d}
                variant="hint"
                style={{ flex: 1, textAlign: 'center', fontSize: 12 }}
              >
                {d}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
