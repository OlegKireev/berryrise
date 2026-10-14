// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    // нативные Button и Switch не стилизуются, берем свои из shared/ui
    ignores: ['src/shared/ui/Switch.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react-native',
              importNames: ['Button', 'Switch'],
              message: 'Используй Button и Switch из @/shared/ui',
            },
          ],
        },
      ],
    },
  },
]);
