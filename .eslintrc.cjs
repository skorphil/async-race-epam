const { rules } = require('eslint-plugin-react-refresh');

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb', 'airbnb-typescript', 'plugin:react/jsx-runtime'],
  ignorePatterns: [
    'dist',
    'node_modules',
    '.eslintrc.cjs',
    'vite.config.ts',
    '*/**.css',
  ],
  overrides: [
    {
      // Allow mocking in tests
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      rules: {
        'import/first': 'off',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.app.json',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'object-curly-newline': 'off',
    'implicit-arrow-linebreak': 'off', // conflicting with limit characters in a line
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    // 'max-lines-per-function': ['error', 40],
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['state'], // Allow mutations within redux Toolkit
      },
    ],
  },
};
