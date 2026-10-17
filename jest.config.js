const preset = require('jest-expo/jest-preset');

// lucide-react-native публикует только ESM (.mjs), его тоже прогоняем через babel
const [nodeModules, ...ignore] = preset.transformIgnorePatterns;

module.exports = {
  preset: 'jest-expo',
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
