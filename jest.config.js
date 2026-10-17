const preset = require('jest-expo/jest-preset');

// lucide-react-native публикует только ESM (.mjs), его тоже прогоняем через babel
const [nodeModules, ...ignore] = preset.transformIgnorePatterns;

module.exports = {
  preset: 'jest-expo',
  // барель shared/lib тянет document picker, без нативного модуля он падает на импорте
  setupFiles: [
    '<rootDir>/node_modules/@react-native-documents/picker/jest/build/jest/setup.js',
  ],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  transform: {
    ...preset.transform,
    '\\.mjs$': preset.transform['\\.[jt]sx?$'],
  },
  transformIgnorePatterns: [
    nodeModules.replace('(?!(', '(?!(lucide-react-native|'),
    ...ignore,
  ],
};
