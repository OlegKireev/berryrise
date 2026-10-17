// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const js = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', '.yarn/*'],
  },
  js.configs.recommended,
  {
    // правила с типами, только для TS
    files: ['**/*.{ts,tsx}'],
    extends: [tseslint.configs.strictTypeChecked],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: __dirname },
    },
    rules: {
      // eslint:recommended не знает про типы, это проверяет tsc
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      // числа в шаблонных строках - нормальная практика
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true },
      ],
      // async-колбэки в onPress и Alert - обычное дело в RN
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: false },
      ],
      // промисы "запустил и забыл" в эффектах и обработчиках - норма, метить их void не хотим
      '@typescript-eslint/no-floating-promises': 'off',
      // стилистика: `return Alert.alert(...)` и onPress={() => setX(1)} никого не путают
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      // as ломает проверку типов: вместо него satisfies, сужение проверкой или разбор данных.
      // as const правило не трогает
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        { assertionStyle: 'never' },
      ],
    },
  },
  {
    // числа даем по имени: константа, единица из shared/lib (DAYS_PER_WEEK, DAY_MS) или поле объекта.
    // Значения в объектах (стили, конфиги анимаций) правило не трогает
    files: ['src/**/*.{ts,tsx}'],
    ignores: [
      // в тестах числа - сами данные
      '**/*.test.ts',
      // иллюстрации: координаты сцен медалей и кривые анимации
      'src/entities/habit/ui/medal/**',
      'src/entities/habit/ui/MedalMagic.tsx',
      'src/shared/ui/Burst.tsx',
      // числа и есть правило склонения
      'src/shared/lib/utils/pluralize.ts',
    ],
    rules: {
      '@typescript-eslint/no-magic-numbers': [
        'error',
        {
          ignore: [-1, 0, 1, 2],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
          ignoreReadonlyClassProperties: true,
          ignoreTypeIndexes: true,
          enforceConst: true,
        },
      ],
    },
  },
  {
    files: ['*.js'],
    languageOptions: { globals: { __dirname: 'readonly' } },
  },
  {
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'import/no-duplicates': 'error',
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': 'error',
      eqeqeq: ['error', 'smart'],
      // блоки всегда в скобках, тело на новой строке ставит prettier
      curly: ['error', 'all'],
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
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
          // другой слайс импортируем только через @/ и его index.ts
          patterns: [
            {
              group: ['@/*/*/**'],
              message: 'Импортируй слайс через его index.ts: @/<слой>/<слайс>',
            },
            {
              regex: String.raw`^\.\./\.\./\.\./(?!\.\./assets/)`,
              message: 'Другой слайс импортируй через @/<слой>/<слайс>',
            },
          ],
        },
      ],
    },
  },
]);
