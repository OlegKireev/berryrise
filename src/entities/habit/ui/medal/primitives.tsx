import { createContext, useContext } from 'react';
import { Circle, Path, Polygon } from 'react-native-svg';

// Примитивы сцен. В силуэте (следующая неполученная медаль) красят все одним цветом:
// фон сцены (bg) - цветом фона, остальное - цветом фигур. Градиенты при этом не нужны
export const Silhouette = createContext<{ bg: string; fill: string } | null>(
  null,
);

type Paint = { fill: string; bg?: boolean; opacity?: number };

function usePaint({ fill, bg, opacity }: Paint) {
  const s = useContext(Silhouette);

  if (!s) {
    return { fill, opacity };
  }

  // полупрозрачные блики и сияние в силуэте не нужны, иначе проступают пятнами
  if (opacity !== undefined && opacity < 1) {
    return { fill, opacity: 0 };
  }

  return { fill: bg ? s.bg : s.fill };
}

// seam - обводка цветом заливки: закрывает просветы сглаживания между соседними гранями
export function Poly({
  points,
  seam,
  ...paint
}: Paint & { points: string; seam?: number }) {
  const p = usePaint(paint);
  return (
    <Polygon
      points={points}
      {...p}
      stroke={seam ? p.fill : undefined}
      strokeWidth={seam}
      strokeLinejoin="round"
    />
  );
}

export function Circ({
  cx,
  cy,
  r,
  ...paint
}: Paint & { cx: number; cy: number; r: number }) {
  return (
    <Circle
      cx={cx}
      cy={cy}
      r={r}
      {...usePaint(paint)}
    />
  );
}

// Линия по пути (дуги колец и атмосферы): обводка без заливки, в силуэте - цветом фигур
export function Arc({
  d,
  stroke,
  width,
  opacity,
}: {
  d: string;
  stroke: string;
  width: number;
  opacity?: number;
}) {
  const paint = usePaint({ fill: stroke, opacity });
  return (
    <Path
      d={d}
      fill="none"
      stroke={paint.fill}
      strokeOpacity={paint.opacity}
      strokeWidth={width}
      strokeLinecap="round"
    />
  );
}
