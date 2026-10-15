import { Fragment } from 'react';
import {
  Circle,
  ClipPath,
  Defs,
  G,
  LinearGradient,
  Stop,
} from 'react-native-svg';

import { ink, mix } from './palette';
import { Arc, Circ, Poly } from './primitives';

// Сцены восхождения для медалей стрика. Видимая часть - внутренний шестиугольник
// (x 21-79, y 18-86), снизу ее перекрывает лента с y 79, поэтому главное - в y 20-78

type Pt = [number, number];
const pts = (list: Pt[]) => list.map(([x, y]) => `${x},${y}`).join(' ');

// Небо по шагу стрика: в целом светлеет к вершине, чтобы читался подъем.
// Ориентир, а не правило: на золоте верх насыщенно-синий ради контраста со снегом
const skies = [
  ['#121B22', '#26414A'], // 1 день, ночь
  ['#172630', '#3A6670'], // 3 дня
  ['#1F3742', '#8C8F88'], // 7 дней, предрассветное
  ['#2A4E5A', '#A9A79A'], // 14 дней, раннее утро
  ['#3C6A75', '#C7B79A'], // 30 дней
  ['#6A7894', '#E3B49A'], // 60 дней, розовый рассвет
  ['#7FA3B0', '#F0C9A0'], // 90 дней
  ['#6FA8D0', '#F6DDB8'], // 180 дней, насыщенный синий: ясный день и контраст со снегом
  ['#7DB6DE', '#FBEFD6'], // 1 год
  // годы - выше гор: небо и космос, свои сцены вне лестницы яркости
  ['#6E7FB8', '#F4C79A'], // 2 года, рассвет над облаками
  ['#0B1230', '#2F5C9E'], // 3 года, стратосфера
  ['#05070F', '#151B33'], // 4 года, орбита
  ['#120A24', '#3A1F55'], // 5 лет, глубокий космос
] as const;

function Sky({ step }: { step: number }) {
  const [top, bottom] = skies[step]!;
  const id = `sky${step}`;
  return (
    <>
      <Defs>
        <LinearGradient
          id={id}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <Stop
            offset="0.15"
            stopColor={top}
          />
          <Stop
            offset="0.75"
            stopColor={bottom}
          />
        </LinearGradient>
      </Defs>
      <Poly
        points="0,0 100,0 100,108 0,108"
        fill={`url(#${id})`}
        bg
      />
    </>
  );
}

type PeakShape = { apex: Pt; left: number; right: number; base: number };

// Снежная шапка зубцами: светлая и теневая половины. Общая для Peak и для верха пика поверх рамки
function SnowCap({
  apex: [ax, ay],
  left,
  right,
  base,
  s,
}: PeakShape & { s: number }) {
  const ridgeX = ax + (right - left) * 0.06;
  const along = (x: number, t: number): Pt => [
    ax + (x - ax) * t,
    ay + (base - ay) * t,
  ];
  const notch: Pt = [ax + (ridgeX - ax) * s, ay + (base - ay) * s * 1.1];
  return (
    <>
      <Poly
        points={pts([
          [ax, ay],
          along(left, s),
          along(left + (ax - left) * 0.5, s * 0.75),
          notch,
        ])}
        fill={ink.snow}
      />
      <Poly
        points={pts([
          [ax, ay],
          notch,
          along(right - (right - ax) * 0.4, s * 0.8),
          along(right, s),
        ])}
        fill={mix(ink.snow, ink.teal, 0.45)}
      />
    </>
  );
}

// Гора: светлый левый склон, темный правый, снежная шапка зубцами
export function Peak({
  lit,
  shade,
  snow,
  ...shape
}: PeakShape & {
  lit: string;
  shade: string;
  snow?: number; // доля высоты под снегом
}) {
  const { apex, left, right, base } = shape;
  const ridge: Pt = [apex[0] + (right - left) * 0.06, base];
  return (
    <>
      <Poly
        points={pts([[left, base], apex, ridge])}
        fill={lit}
      />
      <Poly
        points={pts([ridge, apex, [right, base]])}
        fill={shade}
      />
      {snow ? (
        <SnowCap
          {...shape}
          s={snow}
        />
      ) : null}
    </>
  );
}

// Ель: ярусы треугольников, у каждого светлая и темная половина
export function Fir({
  x,
  base,
  h,
  lit = ink.sageDark,
  shade = ink.forest,
}: {
  x: number;
  base: number;
  h: number;
  lit?: string;
  shade?: string;
}) {
  const w = h * 0.42;
  const tiers = [0, 0.3, 0.55].map((t, i) => {
    const top = base - h + h * t;
    const bottom = base - h * 0.08 - (2 - i) * h * 0.18;
    const half = w * (0.55 + i * 0.22);
    return { top, bottom, half };
  });
  return (
    <>
      {tiers.map(({ top, bottom, half }, i) => (
        <Poly
          key={`l${i}`}
          points={pts([
            [x, top],
            [x - half, bottom],
            [x, bottom],
          ])}
          fill={lit}
        />
      ))}
      {tiers.map(({ top, bottom, half }, i) => (
        <Poly
          key={`r${i}`}
          points={pts([
            [x, top],
            [x, bottom],
            [x + half, bottom],
          ])}
          fill={shade}
        />
      ))}
    </>
  );
}

const Star = ({ x, y, r = 1.2 }: { x: number; y: number; r?: number }) => (
  <Poly
    points={pts([
      [x, y - r],
      [x + r * 0.6, y],
      [x, y + r],
      [x - r * 0.6, y],
    ])}
    fill={ink.paper}
  />
);

// Рюкзак спереди: ручка, боковые карманы, клапан с пряжками, карман.
// Нарисован с низом в (45, 77), переносится сдвигом и масштабом
function Backpack({
  x,
  base,
  scale,
}: {
  x: number;
  base: number;
  scale: number;
}) {
  return (
    <G transform={`translate(${x} ${base}) scale(${scale}) translate(-45 -77)`}>
      <Poly
        points="42.5,43.5 47.5,43.5 47.5,47 46.3,47 46.3,44.7 43.7,44.7 43.7,47 42.5,47"
        fill={ink.strap}
      />
      <Poly
        points="45,77.5 58,76.5 58,79 32,79 32,76.5"
        fill="#000000"
        opacity={0.35}
      />
      <Poly
        points="31,58 34,56 34,74 31,74"
        fill={ink.terraDark}
      />
      <Poly
        points="59,58 56,56 56,74 59,74"
        fill={ink.terraDark}
      />
      <Poly
        points="34,52 37,47 53,47 56,52 56,77 34,77"
        fill={ink.terra}
      />
      <Poly
        points="45,47 53,47 56,52 56,77 45,77"
        fill={mix(ink.terra, ink.terraDark, 0.45)}
      />
      <Poly
        points="34,52 37,47 53,47 56,52 55,61 35,61"
        fill={ink.terraMid}
      />
      <Poly
        points="37,47 53,47 56,52 45,50"
        fill={mix(ink.terraMid, '#FFFFFF', 0.25)}
      />
      <Poly
        points="39,59 41,59 41,64 39,64"
        fill={ink.ember}
      />
      <Poly
        points="49,59 51,59 51,64 49,64"
        fill={ink.ember}
      />
      <Poly
        points="37,66 53,66 53,75 37,75"
        fill={ink.terraDeep}
      />
      <Poly
        points="37,67 53,67 53,68 37,68"
        fill={ink.paper}
        opacity={0.6}
      />
      <Poly
        points="34.5,52 37,48 38,48 35.5,52.5 35,60 34.3,60"
        fill={ink.rim}
      />
    </G>
  );
}

// 1 день: ночь, рюкзак у подножия, гора вдали
export function Day1() {
  return (
    <>
      <Sky step={0} />
      <Star
        x={30}
        y={30}
      />
      <Star
        x={42}
        y={24}
        r={0.9}
      />
      <Star
        x={70}
        y={44}
        r={0.9}
      />
      <Star
        x={36}
        y={40}
        r={0.8}
      />
      {/* месяц: светлый круг, сверху круг цвета неба */}
      <Circ
        cx={66}
        cy={30}
        r={5}
        fill={ink.paper}
      />
      <Circ
        cx={68.5}
        cy={28.5}
        r={4.3}
        fill={mix(ink.night, ink.dusk, 0.3)}
        bg
      />
      <Peak
        apex={[60, 36]}
        left={30}
        right={92}
        base={70}
        lit={ink.teal}
        shade={ink.deep}
        snow={0.25}
      />
      <Peak
        apex={[30, 50]}
        left={8}
        right={52}
        base={72}
        lit={mix(ink.teal, ink.deep, 0.5)}
        shade={mix(ink.deep, ink.night, 0.5)}
      />
      <Poly
        points="0,70 34,66 62,70 100,66 100,108 0,108"
        fill={ink.forest}
      />
      <Poly
        points="0,70 34,66 44,108 0,108"
        fill={mix(ink.forest, ink.sageDark, 0.4)}
      />
      <Backpack
        x={45}
        base={77}
        scale={1}
      />
    </>
  );
}

// 3 дня: тропа уходит в лес, звезды гаснут
export function Day3() {
  return (
    <>
      <Sky step={1} />
      <Star
        x={34}
        y={30}
        r={0.9}
      />
      <Star
        x={68}
        y={34}
        r={0.7}
      />
      <Peak
        apex={[52, 30]}
        left={18}
        right={88}
        base={66}
        lit={mix(ink.teal, ink.mist, 0.7)}
        shade={ink.dusk}
        snow={0.3}
      />
      <Poly
        points="0,66 30,62 56,66 100,61 100,108 0,108"
        fill={ink.sageDark}
      />
      {/* тропа петляет от зрителя к лесу */}
      <Poly
        points="38,82 60,82 56,76 50,70 53,64 51,64 46,70 49,76"
        fill={mix(ink.ochre, ink.forest, 0.25)}
      />
      <Poly
        points="49,76 56,76 60,82 50,82"
        fill={mix(ink.ochre, ink.forest, 0.45)}
      />
      <Fir
        x={27}
        base={72}
        h={20}
      />
      <Fir
        x={35}
        base={68}
        h={15}
      />
      <Fir
        x={23}
        base={80}
        h={18}
        lit={ink.sage}
        shade={ink.sageDark}
      />
      <Fir
        x={66}
        base={68}
        h={16}
      />
      <Fir
        x={74}
        base={74}
        h={22}
      />
      <Fir
        x={68}
        base={82}
        h={16}
        lit={ink.sage}
        shade={ink.sageDark}
      />
    </>
  );
}

// 7 дней: граница леса, предрассветная синева
export function Day7() {
  return (
    <>
      <Sky step={2} />
      <Circ
        cx={56}
        cy={64}
        r={22}
        fill={ink.dawn}
        opacity={0.22}
      />
      <Peak
        apex={[54, 32]}
        left={22}
        right={90}
        base={66}
        lit={mix(ink.mist, ink.dawn, 0.15)}
        shade={mix(ink.dusk, ink.deep, 0.3)}
        snow={0.34}
      />
      {/* склон, по которому идет тропа */}
      <Poly
        points="0,74 100,58 100,108 0,108"
        fill={ink.sageDark}
      />
      <Poly
        points="0,74 60,64 40,108 0,108"
        fill={ink.sage}
      />
      <Poly
        points="24,77 64,66 67,67 28,79"
        fill={mix(ink.paper, ink.sage, 0.35)}
      />
      {/* камни */}
      <Poly
        points="64,68 69,63 73,68"
        fill={mix(ink.mist, ink.paper, 0.3)}
      />
      <Poly
        points="69,63 73,68 74,65"
        fill={ink.mist}
      />
      {/* последние ели внизу */}
      <Fir
        x={28}
        base={80}
        h={14}
      />
      <Fir
        x={35}
        base={79}
        h={10}
      />
      <Fir
        x={76}
        base={72}
        h={12}
      />
    </>
  );
}

// Клуб облака: граненый круг
function Puff({
  x,
  y,
  r,
  fill,
}: {
  x: number;
  y: number;
  r: number;
  fill: string;
}) {
  const list = Array.from({ length: 8 }, (_, k): Pt => {
    const a = (Math.PI / 4) * k + Math.PI / 8;
    return [
      +(x + r * Math.cos(a)).toFixed(1),
      +(y + r * Math.sin(a)).toFixed(1),
    ];
  });
  return (
    <Poly
      points={pts(list)}
      fill={fill}
    />
  );
}

// Камень: светлая и темная грань
function Rock({
  x,
  base,
  w,
  h,
}: {
  x: number;
  base: number;
  w: number;
  h: number;
}) {
  const top: Pt = [x + w * 0.1, base - h];
  return (
    <>
      <Poly
        points={pts([[x - w / 2, base], top, [x + w * 0.15, base]])}
        fill={ink.rock}
      />
      <Poly
        points={pts([top, [x + w / 2, base], [x + w * 0.15, base]])}
        fill={ink.rockDark}
      />
    </>
  );
}

// 14 дней: переправа через горный ручей, раннее утро
export function Day14() {
  return (
    <>
      <Sky step={3} />
      <Peak
        apex={[58, 27]}
        left={22}
        right={96}
        base={62}
        lit={mix(ink.dawn, ink.paper, 0.35)}
        shade={ink.teal}
        snow={0.36}
      />
      <Peak
        apex={[28, 40]}
        left={4}
        right={50}
        base={63}
        lit={mix(ink.mist, ink.dawn, 0.4)}
        shade={ink.teal}
        snow={0.18}
      />
      {/* дальний берег с ельником */}
      <Poly
        points="0,62 100,58 100,70 0,72"
        fill={ink.sageDark}
      />
      <Fir
        lit={ink.sage}
        shade={ink.sageDark}
        x={30}
        base={65}
        h={12}
      />
      <Fir
        lit={ink.sage}
        shade={ink.sageDark}
        x={36}
        base={64}
        h={9}
      />
      <Fir
        lit={ink.sage}
        shade={ink.sageDark}
        x={68}
        base={62}
        h={11}
      />
      <Fir
        lit={ink.sage}
        shade={ink.sageDark}
        x={74}
        base={63}
        h={14}
      />
      {/* ручей и блики на воде */}
      <Poly
        points="0,71 100,66 100,75 0,81"
        fill={ink.water}
      />
      <Poly
        points="24,74 36,73 35,74 23,75"
        fill={ink.waterLight}
      />
      <Poly
        points="60,71 74,70 73,71 59,72"
        fill={ink.waterLight}
      />
      <Poly
        points="30,78 40,77 39,78 29,79"
        fill={ink.waterLight}
      />
      {/* ближний берег */}
      <Poly
        points="0,80 100,74 100,108 0,108"
        fill={mix(ink.sage, ink.paper, 0.2)}
      />
      <Poly
        points="0,80 46,77 30,108 0,108"
        fill={mix(ink.sage, ink.paper, 0.15)}
      />
      {/* мостик из досок с перилами, уходит вдаль через ручей */}
      <Poly
        points="38,82 54,82 54,66 48,66"
        fill={ink.wood}
      />
      {[0, 1, 2, 3, 4, 5].map((k) => {
        // доски: ближние шире, дальние уже
        const y0 = 82 - k * 2.7;
        const y1 = y0 - 1.2;
        const l0 = 38 + (k / 6) * 10;
        const l1 = 38 + ((k + 0.45) / 6) * 10;
        return (
          <Poly
            key={k}
            points={pts([
              [l0, y0],
              [54, y0],
              [54, y1],
              [l1, y1],
            ])}
            fill={mix(ink.wood, ink.ember, 0.55)}
          />
        );
      })}
      {/* перила: столбики и жердь с обеих сторон */}
      <Poly
        points="38,82 39,82 49,66 48.4,66 48.4,62.5 49,62.5 39,76 38,76"
        fill={ink.strap}
      />
      <Poly
        points="53.2,82 54.4,82 54.4,66 53.8,66 53.8,62.5 54.4,62.5 54.4,76 53.2,76"
        fill={ink.strap}
      />
      <Poly
        points="38,76 49,62.5 49,63.4 38,77.2"
        fill={ink.strap}
      />
      <Rock
        x={64}
        base={78}
        w={9}
        h={6}
      />
      <Rock
        x={28}
        base={81}
        w={7}
        h={4}
      />
    </>
  );
}

// 30 дней: первый перевал, рюкзак на седловине, внизу долина
export function Day30() {
  return (
    <>
      <Sky step={4} />
      {/* дальний хребет */}
      <Poly
        points="0,54 14,47 26,52 40,45 54,52 100,50 100,60 0,60"
        fill={mix(ink.mist, ink.paper, 0.2)}
      />
      <Peak
        apex={[68, 24]}
        left={40}
        right={100}
        base={58}
        lit={mix(ink.ember, ink.paper, 0.45)}
        shade={mix(ink.teal, ink.mist, 0.4)}
        snow={0.42}
      />
      {/* долина внизу с рекой */}
      <Poly
        points="0,58 100,56 100,70 0,72"
        fill={ink.sage}
      />
      <Poly
        points="44,66 60,63 76,62 100,61 100,62.4 76,63.4 60,64.6 46,67.6"
        fill={ink.waterLight}
      />
      <Fir
        x={84}
        base={62}
        h={7}
      />
      <Fir
        x={60}
        base={61}
        h={6}
      />
      {/* седловина перевала */}
      <Poly
        points="0,72 30,69 54,71 74,66 100,70 100,108 0,108"
        fill={mix(ink.rockDark, ink.rock, 0.5)}
      />
      <Poly
        points="0,72 30,69 54,71 44,108 0,108"
        fill={mix(ink.rock, ink.paper, 0.3)}
      />
      {/* рюкзак из первой медали отдыхает на перевале */}
      <Backpack
        x={37}
        base={75}
        scale={0.6}
      />
    </>
  );
}

// 60 дней: выше облаков, розовый рассвет
export function Day60() {
  return (
    <>
      <Sky step={5} />
      {/* солнце у горизонта */}
      <Circ
        cx={32}
        cy={56}
        r={14}
        fill={ink.ember}
        opacity={0.35}
      />
      <Circ
        cx={32}
        cy={56}
        r={7}
        fill={mix(ink.paper, ink.ember, 0.3)}
      />
      <Peak
        apex={[62, 22]}
        left={34}
        right={98}
        base={60}
        lit={mix(ink.dawn, ink.paper, 0.1)}
        shade={mix(ink.dusk, ink.dawn, 0.2)}
        snow={0.45}
      />
      <Peak
        apex={[24, 46]}
        left={8}
        right={40}
        base={60}
        lit={mix(ink.dawn, ink.teal, 0.4)}
        shade={ink.dusk}
        snow={0.3}
      />
      {/* море облаков: ряды граненых клубов, задние темнее */}
      {[
        { y: 60, r: 6, step: 9, fill: ink.cloudShade, shift: 0 },
        {
          y: 64,
          r: 6.5,
          step: 10,
          fill: mix(ink.cloud, ink.cloudShade, 0.5),
          shift: 5,
        },
        {
          y: 70,
          r: 7,
          step: 11,
          fill: ink.cloud,
          shift: 0,
        },
      ].map(({ y, r, step, fill, shift }, row) => (
        <Fragment key={row}>
          {Array.from({ length: Math.ceil(110 / step) }, (_, k) => (
            <Puff
              key={k}
              x={shift + k * step - 4}
              y={y - (k % 2) * 2}
              r={r - (k % 3)}
              fill={fill}
            />
          ))}
          <Poly
            points={`-4,${y} 104,${y} 104,${y + 12} -4,${y + 12}`}
            fill={fill}
          />
        </Fragment>
      ))}
      {/* гребень под ногами со снегом */}
      <Poly
        points="0,74 40,68 100,73 100,108 0,108"
        fill={ink.rockDark}
      />
      <Poly
        points="0,74 40,68 30,108 0,108"
        fill={ink.rock}
      />
      <Poly
        points="30,70 40,68 50,69 42,71"
        fill={ink.snow}
      />
      <Poly
        points="62,71 74,71.5 68,73"
        fill={ink.snow}
      />
    </>
  );
}

// Солнце со свечением
function Sun({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <>
      <Circ
        cx={x}
        cy={y}
        r={r * 2.4}
        fill={ink.paper}
        opacity={0.35}
      />
      <Circ
        cx={x}
        cy={y}
        r={r}
        fill={mix(ink.paper, ink.ember, 0.25)}
      />
    </>
  );
}

// Снежное поле: светлая часть слева, в тени справа
function Snowfield({ points, shade }: { points: string; shade: string }) {
  return (
    <>
      <Poly
        points={points}
        fill={ink.snow}
      />
      <Poly
        points={shade}
        fill={mix(ink.snow, ink.mist, 0.45)}
      />
    </>
  );
}

// 90 дней: лагерь у снегов, встает солнце
export function Day90() {
  return (
    <>
      <Sky step={6} />
      <Sun
        x={30}
        y={40}
        r={5}
      />
      <Peak
        apex={[62, 24]}
        left={30}
        right={100}
        base={60}
        lit={mix(ink.ember, ink.paper, 0.65)}
        shade={mix(ink.mist, ink.teal, 0.3)}
        snow={0.5}
      />
      <Peak
        apex={[26, 44]}
        left={4}
        right={46}
        base={62}
        lit={mix(ink.ember, ink.paper, 0.55)}
        shade={mix(ink.mist, ink.teal, 0.2)}
        snow={0.4}
      />
      <Snowfield
        points="0,64 40,60 100,63 100,108 0,108"
        shade="60,61.5 100,63 100,108 70,108"
      />
      {/* следы к палатке */}
      {[0, 1, 2, 3].map((k) => (
        <Poly
          key={k}
          points={pts([
            [70 - k * 4, 76 - k * 1.2],
            [72 - k * 4, 76 - k * 1.2],
            [71.5 - k * 4, 77 - k * 1.2],
            [69.5 - k * 4, 77 - k * 1.2],
          ])}
          fill={mix(ink.snow, ink.mist, 0.6)}
        />
      ))}
      {/* палатка */}
      <Poly
        points="31,72 55,72 54,73.5 32,73.5"
        fill="#000000"
        opacity={0.15}
      />
      <Poly
        points="32,72 43,56 43,72"
        fill={ink.terra}
      />
      <Poly
        points="43,56 54,72 43,72"
        fill={ink.terraDark}
      />
      <Poly
        points="43,61 39.5,72 46.5,72"
        fill={ink.strap}
      />
      <Backpack
        x={60}
        base={73}
        scale={0.38}
      />
    </>
  );
}

// 180 дней: гребень перед вершиной, ясный день, облака далеко внизу
export function Day180() {
  return (
    <>
      <Sky step={7} />
      <Sun
        x={30}
        y={28}
        r={4}
      />
      {/* облака внизу слева */}
      {[
        [10, 66, 5],
        [18, 64, 6],
        [27, 66, 5],
        [14, 70, 6],
        [24, 70, 6],
      ].map(([x, y, r], k) => (
        <Circ
          key={k}
          cx={x!}
          cy={y!}
          r={r!}
          fill={k > 2 ? ink.cloud : mix(ink.cloud, '#FFFFFF', 0.5)}
        />
      ))}
      {/* вершина впереди и гребень к ней */}
      <Peak
        apex={[66, 22]}
        left={8}
        right={104}
        base={92}
        lit={mix(ink.paper, ink.ember, 0.2)}
        shade={mix(ink.mist, ink.teal, 0.35)}
        snow={0.25}
      />
      <Poly
        points="0,84 30,66 46,60 66,22 52,62 34,74 0,92"
        fill={mix(ink.snow, '#FFFFFF', 0.4)}
      />
      <Poly
        points="0,92 34,74 52,62 66,22 70,40 60,64 40,80 0,100"
        fill={mix(ink.mist, ink.teal, 0.2)}
      />
      {/* скальные грани по краю гребня */}
      <Poly
        points="30,66 46,60 47,62 32,68"
        fill={ink.rock}
      />
      <Poly
        points="52,62 66,22 64,34 54,62"
        fill={mix(ink.rock, ink.paper, 0.2)}
      />
      <Backpack
        x={38}
        base={70}
        scale={0.42}
      />
    </>
  );
}

// 1 год: флаг на вершине, ясный день. Пик смещен вправо, солнце слева: свет падает на левый склон, как у всех Peak.
// Верх пика с флагом выходит за рамку (Day365Over)
const SUMMIT: PeakShape = { apex: [58, 7], left: 16, right: 98, base: 74 };
const SUMMIT_SNOW = 0.45;

export function Day365() {
  return (
    <>
      <Sky step={8} />
      <Sun
        x={30}
        y={34}
        r={4.5}
      />
      {/* дальний пик слева ниже нас, торчит из облаков */}
      <Peak
        apex={[24, 54]}
        left={0}
        right={42}
        base={74}
        lit={mix(ink.paper, ink.ember, 0.2)}
        shade={mix(ink.mist, ink.teal, 0.3)}
        snow={0.5}
      />
      <Peak
        {...SUMMIT}
        lit={mix(ink.ember, ink.paper, 0.45)}
        shade={mix(ink.mist, ink.teal, 0.45)}
        snow={SUMMIT_SNOW}
      />
    </>
  );
}

// Клубы облаков [x, y, r]: разного размера и высоты, слева гуще, справа реже
type Clouds = readonly (readonly [number, number, number])[];

const OVER_CLOUDS: Clouds = [
  [4, 71, 3.5],
  [10, 67, 6],
  [18, 70, 8],
  [27, 74, 5],
  [33, 70.5, 4],
  [41, 75, 6.5],
  [49, 76, 3.5],
  [57, 74.5, 5.5],
  [66, 76, 4],
  [74, 72, 7],
  [83, 70, 4.5],
  [90, 72.5, 5.5],
  [96, 70, 3],
];

function CloudBank({
  clouds,
  fill,
  shade,
}: {
  clouds: Clouds;
  fill: string;
  shade: string;
}) {
  return (
    <>
      {/* тень облака чуть ниже, сверху светлый клуб */}
      {clouds.map(([x, y, r], k) => (
        <Circ
          key={`s${k}`}
          cx={x}
          cy={y + 1.5}
          r={r}
          fill={shade}
        />
      ))}
      {clouds.map(([x, y, r], k) => (
        <Circ
          key={k}
          cx={x}
          cy={y}
          r={r}
          fill={fill}
        />
      ))}
    </>
  );
}

// Флаг на вершине: древко вверх от apex и полотнище вправо
function Flag({ apex: [ax, ay], size }: { apex: Pt; size: number }) {
  const top = Math.max(0.5, ay - size * 0.9);
  return (
    <>
      <Poly
        points={pts([
          [ax - 0.4, ay],
          [ax + 0.4, ay],
          [ax + 0.4, top],
          [ax - 0.4, top],
        ])}
        fill={ink.strap}
      />
      <Poly
        points={pts([
          [ax + 0.4, top],
          [ax + size, top + size * 0.23],
          [ax + 0.4, top + size * 0.45],
        ])}
        fill={ink.terra}
      />
    </>
  );
}

// Вершина поверх рамки: та же снежная шапка, что в сцене (без шва), флаг и облака
function PeakOver({
  shape,
  snow,
  flag = 10,
  clouds,
}: {
  shape: PeakShape;
  snow: number;
  flag?: number;
  clouds?: { list: Clouds; fill: string; shade: string };
}) {
  return (
    <>
      <SnowCap
        {...shape}
        s={snow}
      />
      <Flag
        apex={shape.apex}
        size={flag}
      />
      {clouds && (
        <CloudBank
          clouds={clouds.list}
          fill={clouds.fill}
          shade={clouds.shade}
        />
      )}
    </>
  );
}

export function Day365Over() {
  return (
    <PeakOver
      shape={SUMMIT}
      snow={SUMMIT_SNOW}
      clouds={{
        list: OVER_CLOUDS,
        fill: mix(ink.cloud, '#FFFFFF', 0.6),
        shade: mix(ink.cloud, ink.mist, 0.35),
      }}
    />
  );
}

// Годы 2-5: после первой вершины подъем продолжается - небо, стратосфера, орбита, космос.
// В каждой медали что-то выходит за рамку (Year*Over)

// Прежняя покоренная вершина вдали: маленький пик с флажком
function FlagPeak({
  x,
  base,
  h,
  lit,
  shade,
}: {
  x: number;
  base: number;
  h: number;
  lit: string;
  shade: string;
}) {
  const apex: Pt = [x, base - h];
  return (
    <>
      <Peak
        apex={apex}
        left={x - h * 0.9}
        right={x + h * 0.9}
        base={base}
        lit={lit}
        shade={shade}
        snow={0.4}
      />
      <Flag
        apex={apex}
        size={3.5}
      />
    </>
  );
}

export function Stars({ list, r = 0.8 }: { list: readonly Pt[]; r?: number }) {
  return (
    <>
      {list.map(([x, y], k) => (
        <Star
          key={k}
          x={x}
          y={y}
          r={k % 3 ? r : r * 1.5}
        />
      ))}
    </>
  );
}

const starField: Pt[] = [
  [24, 24],
  [36, 20],
  [30, 36],
  [64, 22],
  [74, 34],
  [44, 30],
  [80, 26],
  [22, 46],
  [56, 40],
  [70, 50],
  [38, 52],
  [76, 62],
];

// Полоса сияния: зеленая середина, к краям прозрачная и фиолетовая
function Aurora({ id, points }: { id: string; points: string }) {
  return (
    <>
      <Defs>
        <LinearGradient
          id={id}
          x1="0"
          y1="1"
          x2="0"
          y2="0"
        >
          <Stop
            offset="0"
            stopColor="#6BF2B8"
            stopOpacity={0}
          />
          <Stop
            offset="0.3"
            stopColor="#6BF2B8"
            stopOpacity={0.9}
          />
          <Stop
            offset="0.75"
            stopColor="#9C7BFF"
            stopOpacity={0.6}
          />
          <Stop
            offset="1"
            stopColor="#9C7BFF"
            stopOpacity={0}
          />
        </LinearGradient>
      </Defs>
      <Poly
        points={points}
        fill={`url(#${id})`}
        opacity={0.95}
      />
    </>
  );
}

// 2 года: воздушный шар на рассвете над облаками, внизу первая вершина
export function Year2() {
  return (
    <>
      <Sky step={9} />
      <Circ
        cx={26}
        cy={56}
        r={16}
        fill={ink.ember}
        opacity={0.35}
      />
      <FlagPeak
        x={30}
        base={70}
        h={14}
        lit={mix(ink.ember, ink.paper, 0.5)}
        shade={mix(ink.dusk, ink.dawn, 0.35)}
      />
      {/* дальний маленький шар для глубины */}
      <Circ
        cx={30}
        cy={36}
        r={3.2}
        fill={ink.sage}
      />
      <Poly
        points="29,40 31,40 30.8,41.6 29.2,41.6"
        fill={ink.wood}
      />
      <CloudBank
        clouds={OVER_CLOUDS.map(([x, y, r]) => [x, y - 4, r] as const)}
        fill={mix(ink.cloud, '#FFFFFF', 0.5)}
        shade={ink.cloudShade}
      />
    </>
  );
}

export function Year2Over() {
  return (
    <>
      {/* оболочка: терракота, светлые клинья, правая половина в тени */}
      <Poly
        points="56,1 64,3 69.5,9 71,17 69,25 64,32 60,38 52,38 48,32 43,25 41,17 42.5,9 48,3"
        fill={ink.terra}
      />
      <Poly
        points="56,1 59,8 60,18 58.5,30 56,38 53.5,30 52,18 53,8"
        fill={ink.paper}
      />
      <Poly
        points="48,3 47.5,12 48.5,24 52,38 48,32 43,25 41,17 42.5,9"
        fill={ink.ember}
      />
      <Poly
        points="64,3 64.5,12 63.5,24 60,38 64,32 69,25 71,17 69.5,9"
        fill={ink.ember}
      />
      <Poly
        points="56,1 64,3 69.5,9 71,17 69,25 64,32 60,38 56,38 56,1"
        fill="#000000"
        opacity={0.18}
      />
      {/* стропы, горелка, корзина */}
      <Poly
        points="52,38 52.6,38 53.6,45 53,45"
        fill={ink.strap}
      />
      <Poly
        points="60,38 59.4,38 58.4,45 59,45"
        fill={ink.strap}
      />
      <Poly
        points="54.5,41 56,37.5 57.5,41"
        fill={ink.ember}
      />
      <Poly
        points="52,45 60,45 59.3,52 52.7,52"
        fill={ink.wood}
      />
      <Poly
        points="52,45 60,45 60,46.3 52,46.3"
        fill={mix(ink.wood, ink.ember, 0.5)}
      />
    </>
  );
}

// 3 года: стратосфера, изгиб Земли и одна лента сияния; за рамку вылетает самолет
const EARTH3: Pt = [50, 152];
const EARTH3_R = 89;

export function Year3() {
  const [ex, ey] = EARTH3;
  return (
    <>
      <Sky step={10} />
      <Stars list={starField.slice(0, 8)} />
      <Aurora
        id="aurora3"
        points="54,60 58,42 66,28 74,22 70,32 64,46 64,60"
      />
      <Circ
        cx={ex}
        cy={ey}
        r={EARTH3_R + 4}
        fill="#7FD3F0"
        opacity={0.35}
      />
      <Defs>
        <ClipPath id="earth3">
          <Circle
            cx={ex}
            cy={ey}
            r={EARTH3_R}
          />
        </ClipPath>
      </Defs>
      <G clipPath="url(#earth3)">
        {/* океан и отмели */}
        <Poly
          points="0,50 100,50 100,108 0,108"
          fill="#2F6FA8"
        />
        <Poly
          points="16,72 30,66 36,68 24,76"
          fill="#4C9AC9"
        />
        {/* материк: лес, пустыня, горы со снегом */}
        <Poly
          points="34,66 50,62 64,64 70,70 58,76 42,76 32,72"
          fill={ink.sageDark}
        />
        <Poly
          points="50,62 64,64 66,68 54,70"
          fill={ink.sage}
        />
        <Poly
          points="58,70 70,70 66,76 56,76"
          fill={mix(ink.ochre, ink.paper, 0.2)}
        />
        <Poly
          points="42,68 46,63 50,68"
          fill={ink.rock}
        />
        <Poly
          points="44.5,64.8 46,63 47.5,64.8 46,65.5"
          fill={ink.snow}
        />
        <Poly
          points="48,69 52,64.5 56,69"
          fill={ink.rock}
        />
        <Poly
          points="50.5,66.3 52,64.5 53.5,66.3 52,67"
          fill={ink.snow}
        />
        {/* остров справа и полярный лед на краю */}
        <Poly
          points="74,66 82,64 86,68 78,70"
          fill={ink.sage}
        />
        <Poly
          points="10,70 20,64 22,66 12,74"
          fill={ink.snow}
        />
        {/* облака */}
        <Poly
          points="24,68 34,64.5 38,65.5 28,69.5"
          fill={ink.paper}
          opacity={0.85}
        />
        <Poly
          points="60,65 72,64.5 74,66 62,67"
          fill={ink.paper}
          opacity={0.85}
        />
      </G>
      {/* тонкая светлая кромка атмосферы */}
      <Arc
        d={`M ${ex - 60} ${ey - Math.sqrt(EARTH3_R ** 2 - 60 ** 2)} A ${EARTH3_R} ${EARTH3_R} 0 0 1 ${ex + 60} ${ey - Math.sqrt(EARTH3_R ** 2 - 60 ** 2)}`}
        stroke="#BFF0FF"
        width={0.8}
      />
    </>
  );
}

// Самолет вылетает за правый верхний угол, инверсионный след тянется из сцены
export function Year3Over() {
  return (
    <>
      <Arc
        d="M 26 50 Q 46 34 68 22"
        stroke={ink.paper}
        width={1.3}
        opacity={0.75}
      />
      <Arc
        d="M 28 53 Q 48 37 69 25"
        stroke={ink.paper}
        width={1.3}
        opacity={0.75}
      />
      {/* самолет выходит на светлую страницу: терракотовый киль и темные тени для контраста */}
      <G transform="translate(77 17) rotate(-28) scale(1.45)">
        <Poly
          points="-1,0 3,0 -3,-5.5 -4.6,-5.5"
          fill="#8E9AAD"
        />
        <Poly
          points="-9.5,-1.3 -6.5,-1.3 -8.8,-5.8 -10.6,-5.8"
          fill={ink.terra}
        />
        <Poly
          points="-10,-1.4 7,-1.4 10.5,0 7,1.4 -10,1.4"
          fill={ink.paper}
        />
        <Poly
          points="-10,0.3 7,0.3 10.5,0 7,1.4 -10,1.4"
          fill="#8E9AAD"
        />
        <Poly
          points="-1,0.6 3,0.6 -3.5,8 -5.5,8"
          fill={mix(ink.paper, '#8E9AAD', 0.45)}
        />
        <Poly
          points="-2.6,3.4 0.2,3.4 0.2,4.6 -2.6,4.6"
          fill="#2A3262"
        />
        <Poly
          points="6.5,-0.9 8.5,-0.4 8.5,0.2 6.5,0.2"
          fill="#2A3262"
        />
      </G>
    </>
  );
}

// 4 года: орбита, Земля внизу, спутник, Луна за рамкой
export function Year4() {
  return (
    <>
      <Sky step={11} />
      <Stars list={starField} />
      <Circ
        cx={72}
        cy={100}
        r={46}
        fill="#7FD3F0"
        opacity={0.3}
      />
      <Defs>
        <ClipPath id="earth4">
          <Circle
            cx={72}
            cy={100}
            r={42}
          />
        </ClipPath>
      </Defs>
      <G clipPath="url(#earth4)">
        <Poly
          points="20,40 110,40 110,150 20,150"
          fill="#2F6FA8"
        />
        <Poly
          points="40,66 52,60 62,64 58,74 46,78 38,72"
          fill={ink.sage}
        />
        <Poly
          points="66,70 80,64 92,70 86,80 72,78"
          fill={mix(ink.ochre, ink.sage, 0.4)}
        />
        <Poly
          points="50,82 64,80 70,86 56,90"
          fill={ink.sage}
        />
        <Poly
          points="34,62 60,58 70,60 44,64"
          fill={ink.paper}
          opacity={0.8}
        />
      </G>
      {/* Луна внутри, в темном небе */}
      <Circ
        cx={36}
        cy={34}
        r={7}
        fill="#DDE3EA"
      />
      <Circ
        cx={39}
        cy={36.5}
        r={6.4}
        fill="#8E9AAD"
        opacity={0.55}
      />
      <Circ
        cx={33.5}
        cy={32}
        r={1.4}
        fill="#B5BFCC"
      />
      <Circ
        cx={37}
        cy={30}
        r={0.9}
        fill="#B5BFCC"
      />
    </>
  );
}

// Спутник крупно через верхний правый угол рамки: панели заходят за край
export function Year4Over() {
  const panel = (x: number) => (
    <>
      <Poly
        points={pts([
          [x, 15],
          [x + 13, 15],
          [x + 13, 24],
          [x, 24],
        ])}
        fill="#3D6FB0"
      />
      {[1, 2].map((k) => (
        <Poly
          key={k}
          points={pts([
            [x + (13 / 3) * k - 0.25, 15],
            [x + (13 / 3) * k + 0.25, 15],
            [x + (13 / 3) * k + 0.25, 24],
            [x + (13 / 3) * k - 0.25, 24],
          ])}
          fill="#7FA7DB"
        />
      ))}
    </>
  );
  return (
    <G transform="rotate(-18 74 19.5)">
      <Poly
        points="58,19 90,19 90,20 58,20"
        fill={ink.rock}
      />
      {panel(55)}
      {panel(80)}
      <Poly
        points="70,15 78,15 78,24 70,24"
        fill={ink.ember}
      />
      <Poly
        points="70,15 78,15 78,17 70,17"
        fill={mix(ink.ember, ink.paper, 0.5)}
      />
      <Poly
        points="73.6,9 74.4,9 74.4,15 73.6,15"
        fill={ink.rock}
      />
      <Circ
        cx={74}
        cy={9}
        r={1.6}
        fill={mix(ink.rock, ink.paper, 0.4)}
      />
    </G>
  );
}

// 5 лет: глубокий космос, туманность, планета с кольцами, комета
const PLANET: Pt = [48, 52];
const ringPath = (sweep: 0 | 1) =>
  `M ${PLANET[0] - 46} ${PLANET[1]} A 46 9 0 0 ${sweep} ${PLANET[0] + 46} ${PLANET[1]}`;

function Ring({ sweep }: { sweep: 0 | 1 }) {
  return (
    <G transform={`rotate(-16 ${PLANET[0]} ${PLANET[1]})`}>
      <Arc
        d={ringPath(sweep)}
        stroke={mix(ink.ember, ink.paper, 0.4)}
        width={3.2}
      />
      <Arc
        d={ringPath(sweep)}
        stroke={ink.ochre}
        width={1.2}
      />
    </G>
  );
}

function Planet() {
  const [px, py] = PLANET;
  return (
    <>
      <Defs>
        <ClipPath id="planet5">
          <Circle
            cx={px}
            cy={py}
            r={15}
          />
        </ClipPath>
      </Defs>
      <G clipPath="url(#planet5)">
        <Poly
          points="30,30 70,30 70,75 30,75"
          fill={ink.ember}
        />
        <Poly
          points="30,44 70,42 70,46 30,48"
          fill={ink.terra}
        />
        <Poly
          points="30,52 70,50 70,53 30,55"
          fill={ink.paper}
        />
        <Poly
          points="30,58 70,57 70,61 30,62"
          fill={ink.terraMid}
        />
        <Circ
          cx={px + 7}
          cy={py + 5}
          r={15}
          fill="#000000"
          opacity={0.3}
        />
      </G>
    </>
  );
}

export function Year5() {
  return (
    <>
      <Sky step={12} />
      <Circ
        cx={30}
        cy={34}
        r={20}
        fill="#C86BD8"
        opacity={0.25}
      />
      <Circ
        cx={70}
        cy={66}
        r={18}
        fill="#4E7BE0"
        opacity={0.25}
      />
      <Stars list={starField} />
    </>
  );
}

// Кольцо пересекает рамку, поэтому вся планета с кольцом поверх рамки:
// задняя половина кольца, планета, передняя половина
export function Year5Over() {
  return (
    <>
      <Ring sweep={1} />
      <Planet />
      <Ring sweep={0} />
      {/* комета: хвост уходит за рамку вверх вправо */}
      <Defs>
        <LinearGradient
          id="tail5"
          x1="0"
          y1="1"
          x2="1"
          y2="0"
        >
          <Stop
            offset="0"
            stopColor="#9FE6FF"
            stopOpacity={0.95}
          />
          <Stop
            offset="1"
            stopColor="#C86BD8"
            stopOpacity={0}
          />
        </LinearGradient>
      </Defs>
      <Poly
        points="68,30 96,-2 104,4 74,33"
        fill="url(#tail5)"
        opacity={0.95}
      />
      <Circ
        cx={71}
        cy={31.5}
        r={5.5}
        fill="#9FE6FF"
        opacity={0.4}
      />
      <Circ
        cx={71}
        cy={31.5}
        r={3}
        fill={ink.paper}
      />
    </>
  );
}
