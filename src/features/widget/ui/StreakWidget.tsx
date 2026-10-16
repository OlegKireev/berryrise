import {
  FlexWidget,
  OverlapWidget,
  SvgWidget,
  TextWidget,
  type HexColor,
} from 'react-native-android-widget';

import { days } from '@/shared/i18n';
import { iconMask } from '@/shared/lib';
import { palette } from '@/shared/ui';

export type WidgetVariant = 'card' | 'ink';

// Цвета иконки (assets/src/icon.svg): иллюстрация, одинаковая в обеих темах, как медали
const ink = { bg: '#1C1A18', glow: '#8E3040', text: '#F4F1EA' } as const;
const berry = '#E0475B';

// Если форму не узнать - скругленный квадрат с радиусом почти четверть стороны, как иконки MIUI/HyperOS
const fallbackMask =
  'M23 0H77A23 23 0 0 1 100 23V77A23 23 0 0 1 77 100H23A23 23 0 0 1 0 77V23A23 23 0 0 1 23 0Z';

// Фон по форме системных иконок, в координатах маски 0..100
function background(
  variant: WidgetVariant,
  scheme: 'light' | 'dark',
  size: number,
) {
  const d = iconMask() ?? fallbackMask;
  const wrap = (body: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${body}</svg>`;
  if (variant === 'ink') {
    return wrap(
      `<defs><radialGradient id="g" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="${ink.glow}" stop-opacity=".85"/><stop offset="1" stop-color="${ink.glow}" stop-opacity="0"/></radialGradient></defs>` +
        `<path d="${d}" fill="${ink.bg}"/><path d="${d}" fill="url(#g)"/>`,
    );
  }
  // рамка 1dp: та же форма цветом рамки, сверху уменьшенная цветом карточки
  const c = palette[scheme];
  const k = 1 - 2 / size;
  return wrap(
    `<path d="${d}" fill="${c.border}"/>` +
      `<path d="${d}" fill="${c.card}" transform="translate(50 50) scale(${k}) translate(-50 -50)"/>`,
  );
}

// Кегль - доля стороны по числу цифр: три влезают и в круг, четыре (1000+ дней) мельче
const fontShare = (digits: number) =>
  digits <= 2 ? 0.5 : digits === 3 ? 0.375 : 0.275;

// Виджет 1x1: только число в квадрате по центру ячейки, вокруг прозрачно
export function StreakWidget({
  count,
  variant,
  scheme,
  size,
}: {
  count: number;
  variant: WidgetVariant;
  scheme: 'light' | 'dark';
  size: number;
}) {
  const text = String(count);
  // токены палитры - hex-строки, библиотека хочет их литеральным типом
  const color = (
    variant === 'ink' ? ink.text : palette[scheme].text
  ) as HexColor;
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      accessibilityLabel={days(count)}
      style={{
        height: 'match_parent',
        width: 'match_parent',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <OverlapWidget style={{ width: size, height: size }}>
        <SvgWidget
          svg={background(variant, scheme, size)}
          style={{ width: size, height: size }}
        />
        <FlexWidget
          style={{
            width: size,
            height: size,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <TextWidget
            text={text}
            maxLines={1}
            // крупный системный шрифт не должен выталкивать цифры за край
            allowFontScaling={false}
            style={{
              fontSize: Math.round(size * fontShare(text.length)),
              fontFamily: 'Manrope_700Bold',
              letterSpacing: -0.5,
              color,
            }}
          />
          {variant === 'card' && (
            // ягодная черта - горизонт с иконки
            <FlexWidget
              style={{
                width: Math.round(size * 0.24),
                height: Math.max(2, Math.round(size * 0.04)),
                borderRadius: size,
                backgroundColor: berry,
              }}
            />
          )}
        </FlexWidget>
      </OverlapWidget>
    </FlexWidget>
  );
}
