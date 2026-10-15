import type { Theme } from 'expo-router';
import { useColorScheme } from 'react-native';

// Палитра "Чернила". Светлая базовая, темная в пару: рамки вместо теней, главная кнопка инвертирована
const palette = {
  light: {
    background: '#F4F1EA',
    card: '#FFFFFF',
    border: '#E6E0D4',
    text: '#23211D',
    muted: '#7A7466',
    primary: '#2A2824',
    onPrimary: '#F4F1EA',
    secondary: '#D9E1D5',
    onSecondary: '#34504C',
    sober: '#6E8F6A',
    relapse: '#C08A5B',
    // медали достижений: серии по уровням и ситуационные
    bronze: '#A9744A',
    silver: '#878B91',
    gold: '#B38B2A',
    special: '#4F7A73',
    // подложка карточки медали: темная в обеих темах, на ней светится магия
    scrim: 'rgba(16, 15, 13, 0.94)',
    onScrim: '#F4F1EA',
  },
  dark: {
    background: '#1A1917',
    card: '#23211E',
    border: '#37342F',
    text: '#ECE7DD',
    muted: '#A29C90',
    primary: '#ECE7DD',
    onPrimary: '#1A1917',
    secondary: '#2D3631',
    onSecondary: '#BFD0C3',
    sober: '#7FA27A',
    relapse: '#C99A6E',
    bronze: '#C9956A',
    silver: '#B4B8BD',
    gold: '#D8B456',
    special: '#8DB3AA',
    scrim: 'rgba(8, 8, 7, 0.94)',
    onScrim: '#ECE7DD',
  },
};

export type Colors = typeof palette.light;

// Android не подбирает начертание кастомного шрифта по fontWeight, поэтому у каждого свое семейство
export const fonts = {
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
};

export type Weight = keyof typeof fonts;

const schemeColors = (scheme: string | null | undefined) =>
  scheme === 'dark' ? palette.dark : palette.light;

// Цвета текущей темы. Система не сообщила тему - светлая
export function useColors(): Colors {
  return schemeColors(useColorScheme());
}

// Цвета шапки и фона экранов для screenOptions навигаторов. Тема из ThemeProvider в корне
// до навигаторов внутри экранов доходит только при монтировании, смену темы они не видят
export function useScreenColors() {
  const c = useColors();
  return {
    headerStyle: { backgroundColor: c.background },
    headerTintColor: c.text,
    headerTitleStyle: { color: c.text, fontFamily: fonts.semibold },
    headerShadowVisible: false,
    // фон экрана: contentStyle у стека, sceneStyle у табов
    contentStyle: { backgroundColor: c.background },
    sceneStyle: { backgroundColor: c.background },
  };
}

// Тема React Navigation из наших токенов: шапки, таб-бар и фон экранов
export function navigationTheme(scheme: string | null | undefined): Theme {
  const c = schemeColors(scheme);
  // fontWeight 'normal': начертание уже в семействе, иначе Android дорисует жирность поверх
  const font = (fontFamily: string) => ({
    fontFamily,
    fontWeight: 'normal' as const,
  });
  return {
    dark: scheme === 'dark',
    colors: {
      primary: c.text,
      background: c.background,
      // шапка в цвет экрана
      card: c.background,
      text: c.text,
      border: c.border,
      notification: c.relapse,
    },
    fonts: {
      regular: font(fonts.regular),
      medium: font(fonts.medium),
      bold: font(fonts.semibold),
      heavy: font(fonts.bold),
    },
  };
}
