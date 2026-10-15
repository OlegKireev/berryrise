import { Fragment } from 'react';
import { Defs, G, LinearGradient, Stop } from 'react-native-svg';

import { Fir, Peak, Stars } from './climb';
import { ink, mix } from './palette';
import { Arc, Circ, Poly } from './primitives';

// Сцены ситуационных медалей. Нарисованы в координатах, где видимая часть
// восьмиугольника - x и y 13-87, и вписаны в рамку одной трансформацией FIT
const FIT = 'translate(8.8 10.8) scale(0.824)';

type Pt = [number, number];

function Gradient({
  id,
  stops,
}: {
  id: string;
  stops: readonly (readonly [number, string])[];
}) {
  return (
    <Defs>
      <LinearGradient
        id={id}
        x1="0"
        y1="0"
        x2="0"
        y2="1"
      >
        {stops.map(([offset, color]) => (
          <Stop
            key={offset}
            offset={offset}
            stopColor={color}
          />
        ))}
      </LinearGradient>
    </Defs>
  );
}

function Fill({
  id,
  points = '0,0 100,0 100,100 0,100',
  bg,
}: {
  id: string;
  points?: string;
  bg?: boolean;
}) {
  return (
    <Poly
      points={points}
      fill={`url(#${id})`}
      bg={bg}
    />
  );
}

// Теплый свет окон и гирлянд
const light = {
  glow: '#FFE2A8',
  warm: '#F6B25E',
  deep: '#E08A3C',
};

const rect = (x: number, y: number, w: number, h: number) =>
  `${x},${y} ${x + w},${y} ${x + w},${y + h} ${x},${y + h}`;

const skin = '#E2B48E';

// Гирлянда: провод дугой и лампочки по нему
function Garland({
  from,
  via,
  to,
  bulbs,
}: {
  from: Pt;
  via: Pt;
  to: Pt;
  bulbs: number;
}) {
  const at = (t: number): Pt => [
    (1 - t) ** 2 * from[0] + 2 * (1 - t) * t * via[0] + t ** 2 * to[0],
    (1 - t) ** 2 * from[1] + 2 * (1 - t) * t * via[1] + t ** 2 * to[1],
  ];
  const colors = [light.glow, ink.dawn, light.warm];
  return (
    <>
      <Arc
        d={`M ${from[0]} ${from[1]} Q ${via[0]} ${via[1]} ${to[0]} ${to[1]}`}
        stroke={ink.strap}
        width={0.6}
      />
      {Array.from({ length: bulbs }, (_, k) => {
        const [x, y] = at((k + 0.5) / bulbs);
        return (
          <Fragment key={k}>
            <Circ
              cx={x}
              cy={y + 1}
              r={2.6}
              fill={light.glow}
              opacity={0.3}
            />
            <Circ
              cx={x}
              cy={y + 1}
              r={1.1}
              fill={colors[k % colors.length]!}
            />
          </Fragment>
        );
      })}
    </>
  );
}

// Компания 1 раз: окно кафе вечером, на столе чашка чая
export function Company1() {
  const stripes = 6;
  const w = 68 / stripes;
  return (
    <G transform={FIT}>
      <Gradient
        id="cafe1sky"
        stops={[
          [0, '#34477A'],
          [1, '#C98E8C'],
        ]}
      />
      <Gradient
        id="cafe1win"
        stops={[
          [0, light.glow],
          [1, light.deep],
        ]}
      />
      <Fill
        id="cafe1sky"
        bg
      />
      <Stars
        list={[
          [26, 18],
          [70, 16],
          [84, 24],
        ]}
      />
      {/* стена */}
      <Poly
        points={rect(0, 28, 100, 72)}
        fill="#2F5058"
      />
      <Poly
        points={rect(0, 28, 14, 72)}
        fill="#3A6068"
      />
      <Poly
        points={rect(86, 28, 14, 72)}
        fill="#264249"
      />
      {/* окно с теплым светом */}
      <Poly
        points={rect(20, 42, 60, 38)}
        fill={ink.strap}
      />
      <Fill
        id="cafe1win"
        points={rect(22, 44, 56, 34)}
        bg
      />
      {/* лампа под потолком и ее свет */}
      <Poly
        points={rect(49.6, 44, 0.8, 6)}
        fill={ink.strap}
      />
      <Circ
        cx={50}
        cy={53}
        r={9}
        fill={ink.paper}
        opacity={0.35}
      />
      <Poly
        points="46,53 54,53 52,50 48,50"
        fill={ink.terraDark}
      />
      {/* стол и чашка */}
      <Poly
        points={rect(32, 70, 36, 2.5)}
        fill={ink.wood}
      />
      <Poly
        points="48,72.5 52,72.5 53,78 47,78"
        fill={mix(ink.wood, ink.strap, 0.4)}
      />
      <Poly
        points="44,63 53,63 52,70 45,70"
        fill={ink.paper}
      />
      <Poly
        points="49,63 53,63 52,70 49,70"
        fill={mix(ink.paper, ink.dawn, 0.35)}
      />
      <Arc
        d="M 53 64.5 Q 56.5 65.5 52.6 68"
        stroke={ink.paper}
        width={1.1}
      />
      <Poly
        points="42,70 55,70 54,71 43,71"
        fill={mix(ink.paper, ink.mist, 0.3)}
      />
      {/* пар */}
      <Arc
        d="M 47 61 Q 45 58 47.5 55.5 Q 49.5 53 47.5 50"
        stroke={ink.paper}
        width={1}
        opacity={0.8}
      />
      <Arc
        d="M 50.5 61 Q 48.5 58.5 51 56"
        stroke={ink.paper}
        width={1}
        opacity={0.6}
      />
      {/* рама окна */}
      <Poly
        points={rect(22, 56, 56, 1)}
        fill={ink.strap}
        opacity={0.6}
      />
      <Poly
        points={rect(18, 80, 64, 3)}
        fill="#1E3439"
      />
      {/* полосатая маркиза с фестонами */}
      {Array.from({ length: stripes }, (_, k) => (
        <Fragment key={k}>
          <Poly
            points={`${16 + k * w},28 ${16 + (k + 1) * w},28 ${14 + (k + 1) * w * 1.06},37 ${14 + k * w * 1.06},37`}
            fill={k % 2 ? ink.paper : ink.terra}
          />
          <Poly
            points={`${14 + k * w * 1.06},37 ${14 + (k + 1) * w * 1.06},37 ${14 + (k + 0.5) * w * 1.06},40.5`}
            fill={k % 2 ? mix(ink.paper, ink.cloudShade, 0.5) : ink.terraMid}
          />
        </Fragment>
      ))}
      {/* тротуар */}
      <Poly
        points={rect(0, 84, 100, 16)}
        fill="#3A4560"
      />
      <Poly
        points="0,84 100,84 100,86 0,86"
        fill="#56607A"
      />
    </G>
  );
}

// Человек со спины по пояс: корпус, шея, затылок.
// x - центр, y - низ корпуса, s - масштаб
function Back({
  x,
  y,
  s = 1,
  color,
  hair = ink.strap,
}: {
  x: number;
  y: number;
  s?: number;
  color: string;
  hair?: string;
}) {
  const at = (dx: number, dy: number) => `${x + dx * s},${y - dy * s}`;
  return (
    <>
      <Poly
        points={[
          at(-4.2, 0),
          at(-4.6, 8),
          at(-3.4, 10.5),
          at(3.4, 10.5),
          at(4.6, 8),
          at(4.2, 0),
        ].join(' ')}
        fill={color}
      />
      <Poly
        points={[
          at(1, 0),
          at(1.4, 10.5),
          at(3.4, 10.5),
          at(4.6, 8),
          at(4.2, 0),
        ].join(' ')}
        fill={mix(color, ink.strap, 0.25)}
      />
      <Poly
        points={[at(-1, 10.3), at(1, 10.3), at(1, 12.5), at(-1, 12.5)].join(
          ' ',
        )}
        fill={skin}
      />
      <Circ
        cx={x - 3 * s}
        cy={y - 14 * s}
        r={0.8 * s}
        fill={skin}
      />
      <Circ
        cx={x + 3 * s}
        cy={y - 14 * s}
        r={0.8 * s}
        fill={skin}
      />
      <Circ
        cx={x}
        cy={y - 14.6 * s}
        r={3.2 * s}
        fill={hair}
      />
    </>
  );
}

// Город на горизонте: x, ширина, верх
const skyline: [number, number, number][] = [
  [0, 10, 52],
  [10, 7, 46],
  [17, 9, 55],
  [26, 6, 42],
  [32, 10, 50],
  [42, 8, 56],
  [74, 8, 48],
  [82, 6, 54],
  [88, 12, 44],
];
const nearCity: [number, number, number][] = [
  [0, 14, 62],
  [14, 10, 58],
  [24, 12, 64],
  [36, 9, 60],
  [45, 13, 66],
  [58, 10, 59],
  [68, 12, 63],
  [80, 9, 57],
  [89, 11, 62],
];

// Компания 5 раз: друзья вечером на крыше под гирляндой смотрят на город и закат
export function Company5() {
  return (
    <G transform={FIT}>
      <Gradient
        id="roof5"
        stops={[
          [0, '#34477A'],
          [0.45, '#9A7A9E'],
          [0.7, '#F6C08A'],
        ]}
      />
      <Fill
        id="roof5"
        bg
      />
      <Stars
        list={[
          [24, 18],
          [78, 16],
        ]}
      />
      {/* закатное солнце за городом */}
      <Circ
        cx={62}
        cy={56}
        r={13}
        fill={light.glow}
        opacity={0.35}
      />
      <Circ
        cx={62}
        cy={56}
        r={7}
        fill={light.glow}
      />
      {skyline.map(([x, w, top], k) => (
        <Poly
          key={k}
          points={rect(x, top, w, 70 - top)}
          fill={k % 2 ? '#6A5E86' : '#5E5680'}
        />
      ))}
      {nearCity.map(([x, w, top], k) => (
        <Fragment key={k}>
          <Poly
            points={rect(x, top, w, 80 - top)}
            fill={k % 2 ? '#3A3F68' : '#33395F'}
          />
          <Poly
            points={rect(x + 2, top + 3, 1.8, 2.2)}
            fill={k % 3 ? light.warm : light.glow}
          />
          <Poly
            points={rect(x + w - 4, top + 8, 1.8, 2.2)}
            fill={k % 2 ? light.glow : light.warm}
          />
        </Fragment>
      ))}
      <Garland
        from={[0, 20]}
        via={[50, 38]}
        to={[100, 20]}
        bulbs={9}
      />
      {/* край крыши */}
      <Poly
        points={rect(0, 76, 100, 24)}
        fill="#24363E"
      />
      <Poly
        points={rect(0, 76, 100, 2.4)}
        fill="#3E5A62"
      />
      {/* друзья со спины; средний обнимает левого за плечи */}
      <Back
        x={33}
        y={77}
        s={1.35}
        color={ink.terra}
      />
      <Back
        x={67}
        y={77}
        s={1.35}
        color={ink.sage}
        hair={ink.wood}
      />
      <Back
        x={50}
        y={77}
        s={1.4}
        color={ink.ochre}
        hair={ink.terraDeep}
      />
      <Arc
        d="M 45 64.5 Q 38 62 30 64"
        stroke={ink.ochre}
        width={2.6}
      />
      <Circ
        cx={29.5}
        cy={64.2}
        r={1.4}
        fill={skin}
      />
    </G>
  );
}

// Салют: лучи от центра, на концах искры
function Burst({
  cx,
  cy,
  r,
  colors,
  rays = 12,
}: {
  cx: number;
  cy: number;
  r: number;
  colors: readonly string[];
  rays?: number;
}) {
  return (
    <>
      <Circ
        cx={cx}
        cy={cy}
        r={r * 0.9}
        fill={light.glow}
        opacity={0.18}
      />
      {Array.from({ length: rays }, (_, k) => {
        const a = (k / rays) * Math.PI * 2;
        const long = k % 2 ? 1 : 0.75;
        const [c, s] = [Math.cos(a), Math.sin(a)];
        const color = colors[k % colors.length]!;
        return (
          <Fragment key={k}>
            <Arc
              d={`M ${cx + c * r * 0.3} ${cy + s * r * 0.3} L ${cx + c * r * long} ${cy + s * r * long}`}
              stroke={color}
              width={r * 0.09}
            />
            <Circ
              cx={cx + c * r * (long + 0.14)}
              cy={cy + s * r * (long + 0.14)}
              r={r * 0.06}
              fill={color}
            />
          </Fragment>
        );
      })}
    </>
  );
}

// Дома площади: x, ширина, верх
const square: [number, number, number][] = [
  [0, 16, 60],
  [16, 14, 52],
  [30, 12, 62],
  [58, 12, 58],
  [70, 14, 50],
  [84, 16, 60],
];

// Компания 10 раз: праздник на площади, большой салют выходит за рамку (Company10Over)
export function Company10() {
  return (
    <G transform={FIT}>
      <Gradient
        id="square10"
        stops={[
          [0, '#1C2550'],
          [0.55, '#45427A'],
          [1, '#D4907C'],
        ]}
      />
      <Fill
        id="square10"
        bg
      />
      <Stars
        list={[
          [20, 30],
          [36, 18],
          [62, 14],
        ]}
      />
      <Burst
        cx={30}
        cy={32}
        r={11}
        colors={[ink.dawn, light.glow]}
        rays={10}
      />
      {/* дома с окнами */}
      {square.map(([x, w, top], k) => (
        <Fragment key={k}>
          <Poly
            points={rect(x, top, w, 100 - top)}
            fill={k % 2 ? '#2A3F5A' : '#344B66'}
          />
          {[0, 1].map((row) =>
            [0, 1].map((col) => (
              <Poly
                key={`${row}${col}`}
                points={rect(
                  x + 2.5 + col * (w / 2),
                  top + 5 + row * 8,
                  2.6,
                  3.4,
                )}
                fill={(k + row + col) % 3 ? light.warm : light.glow}
              />
            )),
          )}
        </Fragment>
      ))}
      {/* ратуша с часами в центре */}
      <Poly
        points={rect(42, 46, 16, 54)}
        fill="#3C5674"
      />
      <Poly
        points="42,46 50,34 58,46"
        fill={ink.terraMid}
      />
      <Poly
        points="50,34 58,46 50,46"
        fill={ink.terraDark}
      />
      <Circ
        cx={50}
        cy={53}
        r={4}
        fill={light.glow}
      />
      <Arc
        d="M 50 53 L 50 50.5 M 50 53 L 52 53"
        stroke={ink.strap}
        width={0.7}
      />
      <Garland
        from={[0, 50]}
        via={[50, 68]}
        to={[100, 50]}
        bulbs={10}
      />
      {/* толпа на площади, затылки дальнего ряда */}
      {(
        [
          [22, 79, ink.mist, ink.wood],
          [38, 77, ink.dawn, ink.strap],
          [62, 77, ink.sageDark, ink.terraDeep],
          [78, 79, ink.terraMid, ink.strap],
        ] as const
      ).map(([x, y, color, hair], k) => (
        <Back
          key={k}
          x={x}
          y={y}
          s={0.95}
          color={mix(color, '#33395F', 0.35)}
          hair={hair}
        />
      ))}
      {/* те же друзья, что на крыше (5 раз), стоят в обнимку */}
      <Back
        x={33}
        y={90}
        s={1.4}
        color={ink.terra}
      />
      <Back
        x={67}
        y={90}
        s={1.4}
        color={ink.sage}
        hair={ink.wood}
      />
      <Back
        x={50}
        y={90}
        s={1.45}
        color={ink.ochre}
        hair={ink.terraDeep}
      />
      <Arc
        d="M 44.5 77 Q 38 74.5 29.5 76.5"
        stroke={ink.ochre}
        width={2.6}
      />
      <Circ
        cx={29}
        cy={76.7}
        r={1.4}
        fill={skin}
      />
      <Arc
        d="M 62 77 Q 58 75 55.5 76"
        stroke={ink.sage}
        width={2.6}
      />
      {/* бенгальский огонь в поднятой руке */}
      <Arc
        d="M 54.5 76 L 58 62"
        stroke={ink.ochre}
        width={2.6}
      />
      <Circ
        cx={58.2}
        cy={61.4}
        r={1.4}
        fill={skin}
      />
      <Arc
        d="M 58.4 61 L 61 52"
        stroke={ink.rock}
        width={0.6}
      />
      <Circ
        cx={61.3}
        cy={51.2}
        r={5}
        fill={light.glow}
        opacity={0.4}
      />
      <Arc
        d="M 61.3 47.5 L 61.3 55 M 57.6 51.2 L 65 51.2 M 58.7 48.6 L 63.9 53.8 M 58.7 53.8 L 63.9 48.6"
        stroke={light.glow}
        width={0.7}
      />
    </G>
  );
}

// Большой салют в правом верхнем углу, поверх рамки; след ракеты идет из сцены
export function Company10Over() {
  return (
    <>
      <Arc
        d="M 70 48 Q 70 34 73 22"
        stroke={light.glow}
        width={0.9}
        opacity={0.8}
      />
      <Burst
        cx={75}
        cy={18}
        r={13}
        colors={[light.glow, ink.terra, light.warm, ink.dawn]}
        rays={14}
      />
    </>
  );
}

// Первая трезвая пятница: уютный вечер дома. Окно изнутри, на подоконнике чай, книги и кот
export function Friday() {
  return (
    <G transform={FIT}>
      <Gradient
        id="fri"
        stops={[
          [0, '#2C3A6A'],
          [0.6, '#7A6A96'],
          [1, '#E9A98A'],
        ]}
      />
      {/* стена комнаты */}
      <Poly
        points="0,0 100,0 100,100 0,100"
        fill="#4A3F5C"
      />
      {/* окно: вечернее небо и огни за стеклом */}
      <Fill
        id="fri"
        points={rect(22, 16, 56, 56)}
        bg
      />
      <Circ
        cx={64}
        cy={28}
        r={4.5}
        fill={ink.paper}
      />
      <Circ
        cx={66.2}
        cy={26.6}
        r={4}
        fill="#3A4775"
      />
      <Stars
        list={[
          [32, 24],
          [44, 20],
          [52, 30],
        ]}
      />
      {[
        [22, 8, 56],
        [30, 7, 50],
        [37, 9, 58],
        [46, 6, 53],
        [52, 9, 60],
        [61, 7, 52],
        [68, 10, 57],
      ].map(([x, w, top], k) => (
        <Fragment key={k}>
          <Poly
            points={rect(x!, top!, w!, 72 - top!)}
            fill={k % 2 ? '#3A3F68' : '#33395F'}
          />
          <Poly
            points={rect(x! + 2, top! + 3, 1.6, 2)}
            fill={k % 3 ? light.warm : light.glow}
          />
        </Fragment>
      ))}
      {/* рама окна */}
      <Poly
        points={rect(49, 16, 2, 56)}
        fill="#E8DCCB"
      />
      <Poly
        points={rect(22, 42, 56, 2)}
        fill="#E8DCCB"
      />
      <Poly
        points={`${rect(20, 14, 60, 2.4)}`}
        fill="#E8DCCB"
      />
      {/* шторы */}
      <Poly
        points="4,10 24,10 20,40 24,76 4,76"
        fill={ink.terra}
      />
      <Poly
        points="14,10 20,10 17,40 20,76 13,76 11,40"
        fill={ink.terraMid}
      />
      <Poly
        points="96,10 76,10 80,40 76,76 96,76"
        fill={ink.terra}
      />
      <Poly
        points="86,10 80,10 83,40 80,76 87,76 89,40"
        fill={ink.terraMid}
      />
      {/* подоконник */}
      <Poly
        points="12,72 88,72 92,77 8,77"
        fill="#E8DCCB"
      />
      <Poly
        points={rect(8, 77, 84, 2.4)}
        fill="#BFAF9A"
      />
      {/* стопка книг */}
      <Poly
        points={rect(25, 67.5, 14, 4.5)}
        fill={ink.sage}
      />
      <Poly
        points={rect(26.5, 63, 12, 4.5)}
        fill={ink.ochre}
      />
      <Poly
        points={rect(26.5, 63, 1.2, 4.5)}
        fill={mix(ink.ochre, ink.strap, 0.3)}
      />
      {/* чашка чая с паром */}
      <Poly
        points="42,63 50,63 49,72 43,72"
        fill={ink.paper}
      />
      <Poly
        points="46.5,63 50,63 49,72 46.5,72"
        fill={mix(ink.paper, ink.dawn, 0.35)}
      />
      <Arc
        d="M 50 65 Q 53.5 66 49.6 69"
        stroke={ink.paper}
        width={1.1}
      />
      <Arc
        d="M 45 60.5 Q 43 57.5 45.5 55 Q 47.5 52.5 45.5 49.5"
        stroke={ink.paper}
        width={1}
        opacity={0.75}
      />
      {/* кот со спины смотрит в окно */}
      <Poly
        points="58,72 72,72 71,64 67,58 63,58 59,64"
        fill={ink.strap}
      />
      <Circ
        cx={65}
        cy={55}
        r={4.4}
        fill={ink.strap}
      />
      <Poly
        points="61,53.5 61.5,48 64.5,51.5"
        fill={ink.strap}
      />
      <Poly
        points="69,53.5 68.5,48 65.5,51.5"
        fill={ink.strap}
      />
      <Arc
        d="M 71 70.5 Q 79 70 77 63"
        stroke={ink.strap}
        width={2}
      />
      {/* стена под окном и теплый свет лампы */}
      <Poly
        points={rect(0, 79, 100, 21)}
        fill="#3A3150"
      />
      <Circ
        cx={10}
        cy={90}
        r={16}
        fill={light.glow}
        opacity={0.18}
      />
    </G>
  );
}

// Первые трезвые выходные: утро у озера, палатка и костер с котелком
export function Weekend() {
  return (
    <G transform={FIT}>
      <Gradient
        id="wknd"
        stops={[
          [0, '#7DB6DE'],
          [0.55, '#FBEFD6'],
        ]}
      />
      <Fill
        id="wknd"
        bg
      />
      {/* солнце встает из-за гор */}
      <Circ
        cx={66}
        cy={44}
        r={14}
        fill={ink.paper}
        opacity={0.5}
      />
      <Circ
        cx={66}
        cy={44}
        r={7}
        fill={mix(ink.paper, ink.ember, 0.3)}
      />
      <Peak
        apex={[30, 26]}
        left={-6}
        right={64}
        base={56}
        lit="#8FB0B8"
        shade="#5F8A94"
        snow={0.28}
      />
      <Peak
        apex={[80, 32]}
        left={52}
        right={110}
        base={56}
        lit="#A3BDC2"
        shade="#6F969E"
        snow={0.24}
      />
      {/* озеро с отражением солнца */}
      <Poly
        points={rect(0, 56, 100, 12)}
        fill={ink.water}
      />
      <Poly
        points="58,58 74,58 72,60 60,60"
        fill={ink.waterLight}
      />
      <Poly
        points="61,62.5 71,62.5 70,64 62,64"
        fill={ink.waterLight}
      />
      {/* дальний берег с елями */}
      {[
        [12, 58, 10],
        [18, 58, 13],
        [86, 58, 12],
        [92, 58, 9],
      ].map(([x, base, h], k) => (
        <Fir
          key={k}
          x={x!}
          base={base!}
          h={h!}
        />
      ))}
      {/* луг */}
      <Poly
        points="0,66 40,64 100,67 100,100 0,100"
        fill={ink.sage}
      />
      <Poly
        points="0,74 60,70 100,74 100,100 0,100"
        fill={mix(ink.sage, ink.sageDark, 0.4)}
      />
      {/* палатка */}
      <Poly
        points="16,82 34,56 52,82"
        fill={ink.terra}
      />
      <Poly
        points="34,56 52,82 40,82"
        fill={ink.terraMid}
      />
      <Poly
        points="34,64 29,82 39,82"
        fill={ink.terraDeep}
      />
      <Poly
        points="34,64 37,82 39,82"
        fill={ink.strap}
      />
      {/* костер с котелком и дымком */}
      <Arc
        d="M 63 78 L 68 66 L 73 78"
        stroke={ink.strap}
        width={1}
      />
      <Arc
        d="M 68 66 L 68 69"
        stroke={ink.strap}
        width={0.6}
      />
      <Poly
        points="64.5,69 71.5,69 70.5,74 65.5,74"
        fill={ink.rockDark}
      />
      <Poly
        points="62,82 74,79 75,81 63,84"
        fill={ink.wood}
      />
      <Poly
        points="62,79 74,82 73,84 61,81"
        fill={mix(ink.wood, ink.strap, 0.3)}
      />
      <Poly
        points="64,80 66,74.5 68,78 70,74 72,80"
        fill={ink.ember}
      />
      <Poly
        points="66,80 68,76 70,80"
        fill={light.glow}
      />
      <Arc
        d="M 68 64 Q 65 60 68 56 Q 71 52 68 48"
        stroke={ink.paper}
        width={1.2}
        opacity={0.7}
      />
    </G>
  );
}

// 7 итогов дня подряд: открытый дневник, семь отметок и ручка
export function Reviews7() {
  const rows = Array.from({ length: 7 }, (_, k) => 30 + k * 7);
  return (
    <G transform={FIT}>
      {/* стол */}
      <Poly
        points="0,0 100,0 100,100 0,100"
        fill="#2F5058"
        bg
      />
      <Circ
        cx={30}
        cy={20}
        r={40}
        fill={light.glow}
        opacity={0.12}
      />
      {/* листья растения в углу */}
      <Poly
        points="76,12 96,6 90,22"
        fill={ink.sage}
      />
      <Poly
        points="82,20 100,24 88,32"
        fill={ink.sageDark}
      />
      <G transform="translate(7.5 8) scale(0.85)">
        {/* тень и обложка */}
        <Poly
          points="14,26 88,22 90,86 16,90"
          fill="#1E3439"
        />
        <Poly
          points="12,23 86,19 88,83 14,87"
          fill={ink.terraMid}
        />
        {/* страницы */}
        <Poly
          points="15,24 50,22 50,84 17,86"
          fill={ink.paper}
          bg
        />
        <Poly
          points="50,22 84,20 85,82 50,84"
          fill={mix(ink.paper, ink.cloudShade, 0.25)}
          bg
        />
        <Poly
          points="48,22 52,22 52,84 48,84"
          fill={mix(ink.paper, ink.rock, 0.35)}
        />
        {/* закладка */}
        <Poly
          points="72,20 77,20 77,94 74.5,90 72,94"
          fill={ink.terra}
        />
        {/* семь строк с галочками */}
        {rows.map((y, k) => (
          <Fragment key={k}>
            <Poly
              points={rect(20, y, 4, 4)}
              fill="none"
            />
            <Arc
              d={`M 20 ${y} L 24 ${y} L 24 ${y + 4} L 20 ${y + 4} Z`}
              stroke={ink.rock}
              width={0.6}
            />
            <Arc
              d={`M 20.6 ${y + 2} L 22 ${y + 3.6} L 25 ${y - 0.6}`}
              stroke={ink.sageDark}
              width={1.2}
            />
            <Arc
              d={`M 27 ${y + 2} L ${40 + ((k * 5) % 7)} ${y + 2}`}
              stroke={ink.rock}
              width={0.7}
            />
          </Fragment>
        ))}
        {/* правая страница: строки и солнце на полях */}
        {[34, 41, 48, 55, 62].map((y, k) => (
          <Arc
            key={k}
            d={`M 55 ${y} L ${78 - (k % 2) * 6} ${y}`}
            stroke={ink.rock}
            width={0.7}
          />
        ))}
        <Circ
          cx={62}
          cy={72}
          r={3.4}
          fill={ink.ember}
        />
        <Arc
          d="M 62 66 L 62 67.5 M 62 76.5 L 62 78 M 56 72 L 57.5 72 M 66.5 72 L 68 72 M 57.8 67.8 L 58.9 68.9 M 65.1 75.1 L 66.2 76.2 M 57.8 76.2 L 58.9 75.1 M 65.1 68.9 L 66.2 67.8"
          stroke={ink.ember}
          width={0.8}
        />
        {/* ручка наискосок */}
        <Poly
          points="58,90 84,52 87,54 61,92"
          fill={ink.ochre}
        />
        <Poly
          points="84,52 87,54 89,50.5 86,48.5"
          fill={ink.strap}
        />
        <Poly
          points="58,90 61,92 57,95"
          fill={ink.paper}
        />
        <Poly
          points="58,90 59.5,91 84,52 85.5,53"
          fill={mix(ink.ochre, ink.paper, 0.35)}
        />
      </G>
    </G>
  );
}

// Вернулся после срыва: рассвет над пеплом, феникс поднимается (сам феникс - в Comeback7Over)
export function Comeback7() {
  return (
    <G transform={FIT}>
      <Gradient
        id="phx"
        stops={[
          [0, '#3A2F5E'],
          [0.5, '#C9707A'],
          [0.85, '#F6C08A'],
        ]}
      />
      <Fill
        id="phx"
        bg
      />
      <Circ
        cx={50}
        cy={58}
        r={30}
        fill={light.glow}
        opacity={0.25}
      />
      <Circ
        cx={50}
        cy={58}
        r={18}
        fill={light.glow}
        opacity={0.45}
      />
      {/* пепел и угли внизу */}
      <Poly
        points="0,82 22,76 40,80 60,77 80,80 100,76 100,100 0,100"
        fill="#3A2F3C"
      />
      <Poly
        points="22,76 40,80 30,86"
        fill="#4E3E48"
      />
      <Poly
        points="60,77 80,80 70,86"
        fill="#4E3E48"
      />
      {[
        [30, 84],
        [46, 86],
        [56, 83],
        [68, 88],
        [38, 90],
      ].map(([x, y], k) => (
        <Circ
          key={k}
          cx={x!}
          cy={y!}
          r={0.9}
          fill={ink.ember}
        />
      ))}
    </G>
  );
}

// Феникс целиком поверх рамки: крылья из треугольников, по краю желтые зубцы.
// Свои насыщенные красные: огонь ярче палитры "Чернила" (по референсу low-poly феникса)
const fire = {
  dark: '#7A1C2E',
  wine: '#9E1F36',
  red: '#D42A3C',
  bright: '#EE3A45',
  coral: '#F06A55',
  orange: '#F49040',
  yellow: '#F7D57A',
};

type Curve = [Pt, Pt, Pt];
const bezier = ([a, c, b]: Curve, t: number): Pt => [
  (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t ** 2 * b[0],
  (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t ** 2 * b[1],
];

// Левое крыло: передний край от плеча к кончику и задний край дугой наружу
const LEAD: Curve = [
  [45, 44],
  [30, 22],
  [10, 4],
];
const TRAIL: Curve = [
  [42, 58],
  [-2, 54],
  [10, 4],
];
const US = [0, 0.18, 0.36, 0.54, 0.7, 0.84, 0.94];
const VS = [0, 0.34, 0.68, 1];
// сдвиги внутренних узлов сетки, чтобы грани были неровными
const JITTER: Pt[] = [
  [1.2, -0.8],
  [-1, 1.1],
  [0.6, 1.3],
  [-1.3, -0.5],
  [0.9, 0.4],
  [-0.4, -1.2],
];

function wingNode(i: number, j: number): Pt {
  const u = US[i]!;
  const v = VS[j]!;
  const l = bezier(LEAD, u);
  const t = bezier(TRAIL, u);
  const p: Pt = [l[0] + (t[0] - l[0]) * v, l[1] + (t[1] - l[1]) * v];
  const inner = i > 0 && i < US.length - 1 && j > 0 && j < VS.length - 1;
  if (!inner) return p;
  const [dx, dy] = JITTER[(i * 3 + j) % JITTER.length]!;
  return [p[0] + dx, p[1] + dy];
}

// Цвет грани: у переднего края у плеча светлая полоса, внутри темно-красный,
// к заднему краю ярче и теплее, у кончика коралл
function facetColor(i: number, j: number, half: number) {
  const odd = (i + j + half) % 2 === 1;
  if (j === 0 && i < 3) return odd ? fire.orange : fire.yellow;
  if (i >= US.length - 3) return odd ? fire.coral : fire.bright;
  if (j === 0) return odd ? fire.dark : fire.wine;
  if (j === 1) return odd ? fire.wine : fire.red;
  return odd ? fire.bright : fire.coral;
}

type Tri = { points: Pt[]; color: string };

const wingFacets: Tri[] = [];
for (let i = 0; i < US.length - 1; i++) {
  for (let j = 0; j < VS.length - 1; j++) {
    const a = wingNode(i, j);
    const b = wingNode(i + 1, j);
    const c = wingNode(i + 1, j + 1);
    const d = wingNode(i, j + 1);
    wingFacets.push(
      { points: [a, b, c], color: facetColor(i, j, 0) },
      { points: [a, c, d], color: facetColor(i, j, 1) },
    );
  }
}
// кончик крыла
wingFacets.push({
  points: [
    wingNode(US.length - 1, 0),
    LEAD[2],
    wingNode(US.length - 1, VS.length - 1),
  ],
  color: fire.coral,
});

// Зубцы по заднему краю и у кончика: наружу от крыла и чуть вниз
const wingSpikes: Tri[] = [];
for (let k = 0; k < 12; k++) {
  const u = 0.04 + k * 0.08;
  const a = bezier(TRAIL, u - 0.035);
  const b = bezier(TRAIL, u + 0.035);
  const mid = bezier(TRAIL, u);
  const lead = bezier(LEAD, u);
  const len = Math.hypot(mid[0] - lead[0], mid[1] - lead[1]) || 1;
  const size = 5 + (k % 3) * 2;
  const tip: Pt = [
    mid[0] + ((mid[0] - lead[0]) / len) * size - 1.5,
    mid[1] + ((mid[1] - lead[1]) / len) * size + 2,
  ];
  wingSpikes.push({
    points: [a, tip, b],
    color: k % 2 ? fire.orange : fire.yellow,
  });
}
for (const [u, size] of [
  [0.78, 5],
  [0.88, 6],
] as const) {
  const a = bezier(LEAD, u - 0.04);
  const b = bezier(LEAD, u + 0.04);
  const mid = bezier(LEAD, u);
  wingSpikes.push({
    points: [a, [mid[0] + size * 0.4, mid[1] - size], b],
    color: fire.yellow,
  });
}

// Контур крыла: передний край от плеча к кончику и задний обратно
const wingOutline: Pt[] = [
  ...US.map((u) => bezier(LEAD, u)),
  LEAD[2],
  ...[...US].reverse().map((u) => bezier(TRAIL, u)),
];

const toPts = (list: Pt[]) =>
  list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
const mirror = (list: Pt[]): Pt[] => list.map(([x, y]) => [100 - x, y]);

function Facets({ list, flip }: { list: Tri[]; flip?: boolean }) {
  return (
    <>
      {list.map(({ points, color }, k) => (
        <Poly
          key={k}
          points={toPts(flip ? mirror(points) : points)}
          fill={color}
          seam={0.5}
        />
      ))}
    </>
  );
}

// Тело, изогнутая шея, голова клювом вправо, хохолок назад, хвост пламенем с осколками
const body: Tri[] = [
  // хвост
  {
    points: [
      [46, 64],
      [50, 66],
      [38, 86],
    ],
    color: fire.orange,
  },
  {
    points: [
      [50, 66],
      [54, 64],
      [62, 84],
    ],
    color: fire.coral,
  },
  {
    points: [
      [46, 66],
      [54, 66],
      [49, 92],
    ],
    color: fire.yellow,
  },
  {
    points: [
      [47, 66],
      [51, 67],
      [43, 88],
    ],
    color: fire.red,
  },
  {
    points: [
      [50, 67],
      [54, 66],
      [56, 86],
    ],
    color: fire.bright,
  },
  {
    points: [
      [44, 90],
      [46, 89],
      [44.5, 95],
    ],
    color: fire.red,
  },
  {
    points: [
      [55, 88],
      [58, 89],
      [56, 93],
    ],
    color: fire.bright,
  },
  // корпус
  {
    points: [
      [42, 46],
      [50, 48],
      [46, 58],
    ],
    color: fire.wine,
  },
  {
    points: [
      [50, 48],
      [58, 46],
      [55, 58],
    ],
    color: fire.red,
  },
  {
    points: [
      [46, 58],
      [50, 48],
      [55, 58],
    ],
    color: fire.bright,
  },
  {
    points: [
      [46, 58],
      [55, 58],
      [50, 68],
    ],
    color: fire.dark,
  },
  {
    points: [
      [44, 56],
      [46, 58],
      [50, 68],
    ],
    color: fire.wine,
  },
  // шея изгибом: от груди влево и вверх, к голове вправо
  {
    points: [
      [46, 48],
      [43, 40],
      [48, 42],
    ],
    color: fire.dark,
  },
  {
    points: [
      [48, 42],
      [43, 40],
      [45, 33],
    ],
    color: fire.red,
  },
  {
    points: [
      [48, 42],
      [45, 33],
      [50, 35],
    ],
    color: fire.wine,
  },
  {
    points: [
      [45, 33],
      [48, 28],
      [50, 35],
    ],
    color: fire.bright,
  },
  {
    points: [
      [46, 48],
      [48, 42],
      [52, 47],
    ],
    color: fire.red,
  },
  // голова и клюв
  {
    points: [
      [48, 28],
      [54, 26],
      [50, 32],
    ],
    color: fire.red,
  },
  {
    points: [
      [54, 26],
      [57, 29],
      [50, 32],
    ],
    color: fire.wine,
  },
  {
    points: [
      [54, 26],
      [61, 29.5],
      [57, 29],
    ],
    color: fire.orange,
  },
  {
    points: [
      [57, 29],
      [61, 29.5],
      [56, 31],
    ],
    color: fire.yellow,
  },
  // хохолок языками назад
  {
    points: [
      [49, 28],
      [40, 25],
      [50, 26.5],
    ],
    color: fire.orange,
  },
  {
    points: [
      [50, 27],
      [42, 21.5],
      [52, 26],
    ],
    color: fire.yellow,
  },
  {
    points: [
      [51.5, 26.5],
      [46, 19.5],
      [53, 26],
    ],
    color: fire.orange,
  },
];

export function Comeback7Over() {
  return (
    // чуть меньше натуральной величины, чтобы рамка оставалась видна
    <G transform="translate(6 5) scale(0.88)">
      <Facets list={wingSpikes} />
      <Facets
        list={wingSpikes}
        flip
      />
      {/* общая подложка крыльев и тела: силуэт без щелей */}
      <Poly
        points={toPts(wingOutline)}
        fill={fire.wine}
        seam={0.8}
      />
      <Poly
        points={toPts(mirror(wingOutline))}
        fill={fire.wine}
        seam={0.8}
      />
      <Poly
        points="40,43 60,43 60,60 52,68 48,68 40,60"
        fill={fire.wine}
      />
      <Facets list={wingFacets} />
      <Facets
        list={wingFacets}
        flip
      />
      <Facets list={body} />
      <Circ
        cx={54.4}
        cy={28}
        r={0.7}
        fill={fire.yellow}
      />
    </G>
  );
}
