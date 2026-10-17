import { requireOptionalNativeModule } from 'expo';
import { Platform } from 'react-native';

// Нативная часть - локальный модуль modules/icon-shape

const native = requireOptionalNativeModule<{ mask(): string | null }>(
  'IconShape',
);

let cached: string | null | undefined;

// Маска без дуг и кривых - квадрат. Так на MIUI/HyperOS: лаунчер скругляет иконки сам,
// а в системе остается квадрат, верить ему нельзя
const isSquare = (path: string) => !/[acqst]/i.test(path);

// Системная форма иконок (SVG-путь 0..100) или null, если узнать нельзя
export function iconMask() {
  if (cached === undefined) {
    try {
      const mask = Platform.OS === 'android' ? native?.mask() : null;
      cached = mask && !isSquare(mask) ? mask : null;
    } catch {
      cached = null;
    }
  }

  return cached;
}
