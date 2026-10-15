import type { ReactNode } from 'react';
import {
  ClipPath,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Polygon,
  Rect,
  Stop,
} from 'react-native-svg';

import { ink, mix, type Metal } from './palette';
import { Shine } from './shine';

// Все медали в одном viewBox 100x108: рамка сверху, тень снизу
export const VIEW_W = 100;
export const VIEW_H = 108;

export type Shape = 'hex' | 'oct';

type Pt = [number, number];

const rad = (deg: number) => (deg * Math.PI) / 180;
const toPoints = (pts: Pt[]) =>
  pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

// Правильный многоугольник; первая вершина под углом start (0 - вправо, -90 - вверх)
function ring(n: number, cx: number, cy: number, r: number, start: number) {
  return Array.from({ length: n }, (_, i): Pt => {
    const a = rad(start + (360 / n) * i);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
}

// Стрик - шестиугольник острием вверх, как вершина; ситуационные - восьмиугольник.
// Площадь у них примерно одна, чтобы в сетке медали не отличались размером
const geometry = {
  hex: { n: 6, cx: 50, cy: 52, outer: 40, inner: 33.5, start: -90 },
  oct: { n: 8, cx: 50, cy: 52, outer: 39, inner: 33, start: -112.5 },
};

function outline(shape: Shape, which: 'outer' | 'inner') {
  const g = geometry[shape];
  return ring(g.n, g.cx, g.cy, g[which], g.start);
}

// Свет сверху слева: грань, повернутая к свету, светлее
const LIGHT: Pt = [-0.6, -0.8];

function Facets({ shape, metal }: { shape: Shape; metal: Metal }) {
  const g = geometry[shape];
  const o = outline(shape, 'outer');
  const i = outline(shape, 'inner');
  return o.map((p, k) => {
    const next = (k + 1) % g.n;
    const a = rad(g.start + (360 / g.n) * (k + 0.5));
    const lit = (1 + Math.cos(a) * LIGHT[0] + Math.sin(a) * LIGHT[1]) / 2;
    const fill =
      lit > 0.5
        ? mix(metal.base, metal.light, (lit - 0.5) * 2)
        : mix(metal.dark, metal.base, lit * 2);
    const facet = toPoints([p, o[next]!, i[next]!, i[k]!]);
    return (
      <G key={k}>
        <Polygon
          points={facet}
          fill={fill}
        />
      </G>
    );
  });
}

const toPath = (pts: Pt[]) =>
  'M' +
  pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L') +
  ' Z';

// Перелив по рамке: две косые полосы (розовый - сиреневый - голубой), только по кольцу рамки
const sheenStops = [
  [0.22, 0],
  [0.3, 0.55],
  [0.34, 0.85],
  [0.38, 0.55],
  [0.46, 0],
  [0.62, 0],
  [0.66, 0.5],
  [0.7, 0],
] as const;

function Sheen({ shape, color }: { shape: Shape; color: string }) {
  const ringPath =
    toPath(outline(shape, 'outer')) + ' ' + toPath(outline(shape, 'inner'));
  return (
    <G>
      <Defs>
        <ClipPath id="ring">
          <Path
            d={ringPath}
            clipRule="evenodd"
          />
        </ClipPath>
        <LinearGradient
          id="sheen"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          {sheenStops.map(([offset, opacity], k) => (
            <Stop
              key={k}
              offset={offset}
              // середина полосы почти белая, края в цвет блика
              stopColor={opacity > 0.8 ? '#FFFFFF' : color}
              stopOpacity={opacity}
            />
          ))}
        </LinearGradient>
      </Defs>
      <Rect
        x={0}
        y={0}
        width={VIEW_W}
        height={VIEW_H}
        fill="url(#sheen)"
        clipPath="url(#ring)"
      />
    </G>
  );
}

// Лента снизу рамки стрика, подпись накладывает Medal обычным Text
export const RIBBON_Y = 86.5;

function Ribbon({ metal }: { metal: Metal }) {
  const tail = mix(ink.ribbon, '#000000', 0.35);
  return (
    <G>
      <Polygon
        points="6,81 20,81 20,96 6,96 10,88.5"
        fill={tail}
      />
      <Polygon
        points="94,81 80,81 80,96 94,96 90,88.5"
        fill={tail}
      />
      <Polygon
        points="16,78 84,78 84,95 16,95"
        fill={ink.ribbon}
        stroke={metal.base}
        strokeWidth={1}
      />
    </G>
  );
}

type Props = {
  shape: Shape;
  metal: Metal;
  scene: ReactNode; // обрезается по внутреннему контуру
  over?: ReactNode; // то, что выходит за рамку
  shine?: boolean; // бегущий блик полученной медали в карточке
};

export function Frame({ shape, metal, scene, over, shine }: Props) {
  const inner = toPoints(outline(shape, 'inner'));
  return (
    <G>
      <Defs>
        <ClipPath id="inner">
          <Polygon points={inner} />
        </ClipPath>
      </Defs>
      <Ellipse
        cx={50}
        cy={103}
        rx={32}
        ry={3.5}
        fill="#000000"
        opacity={0.18}
      />
      <Polygon
        points={toPoints(outline(shape, 'outer'))}
        fill={metal.dark}
      />
      <G clipPath="url(#inner)">{scene}</G>
      <Facets
        shape={shape}
        metal={metal}
      />
      {metal.sheen && (
        <Sheen
          shape={shape}
          color={metal.sheen}
        />
      )}
      <Polygon
        points={inner}
        fill="none"
        stroke={metal.dark}
        strokeWidth={1.2}
      />
      {over}
      {shine && <Shine outer={toPoints(outline(shape, 'outer'))} />}
      {shape === 'hex' && <Ribbon metal={metal} />}
    </G>
  );
}
