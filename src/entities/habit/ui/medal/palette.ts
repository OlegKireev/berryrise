// Палитра медалей. Медаль - иллюстрация со своим фоном и рамкой, одинаковая в обеих темах,
// поэтому цвета здесь константами, а не из useColors() (единственное такое место)

// sheen - цвет перелива полосами по рамке
export type Metal = {
  light: string;
  base: string;
  dark: string;
  sheen?: string;
};

export const metals = {
  bronze: { light: '#E6B07E', base: '#A9744A', dark: '#5E3A1F' },
  silver: { light: '#F1F3F5', base: '#A9AFB6', dark: '#555B62' },
  gold: { light: '#FBE49A', base: '#C99A2E', dark: '#6E4F0E' },
  // платина отличается от серебра холодным тоном и розово-фиолетовым бликом
  platinum: {
    light: '#F8F4FB',
    base: '#C3C6D6',
    dark: '#585D73',
    sheen: '#D9A6E8',
  },
  // шалфейная медь для ситуационных медалей: special темы, смешанный с бронзой
  sage: { light: '#C5DCCF', base: '#6E9488', dark: '#2C4A44' },
} satisfies Record<string, Metal>;

export type MetalKey = keyof typeof metals;

// Сцены: чернильное небо, шалфей, охра, бумага
export const ink = {
  night: '#121B22',
  deep: '#1B2A30',
  dusk: '#26414A',
  teal: '#36616A',
  mist: '#6F9A9C',
  sage: '#7FA08A',
  sageDark: '#4E6E5B',
  forest: '#2F4A3E',
  ochre: '#D49A55',
  ember: '#E7B26A',
  dawn: '#E9A98A',
  paper: '#F4F1EA',
  snow: '#E8EEF0',
  water: '#8FC3CF',
  waterLight: '#D8EFF3',
  rock: '#8A9496',
  rockDark: '#4F5A5C',
  wood: '#8A5A34',
  cloud: '#F6E4DC',
  cloudShade: '#D9B2A8',
  // терракота: рюкзак и снаряжение, самое теплое пятно в сцене
  terra: '#D9603F',
  terraMid: '#B5482F',
  terraDark: '#8E3524',
  terraDeep: '#7A2C1E',
  rim: '#FFD9B0',
  strap: '#2A1C12',
  ribbon: '#1F2B2C',
};

// Силуэт следующей медали: фон сцены и фигуры на нем
export const silhouette = { bg: '#3A4A4D', fill: '#1E2729' };

const channels = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

// Смесь двух цветов: t = 0 - a, t = 1 - b
export function mix(a: string, b: string, t: number) {
  const ca = channels(a);
  const cb = channels(b);
  return (
    '#' +
    ca
      .map((c, i) =>
        Math.round(c + (cb[i]! - c) * t)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
}
