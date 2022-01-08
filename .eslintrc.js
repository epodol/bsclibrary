module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: [
    '@typescript-eslint',
    'jest',
    'jest-dom',
    'jsx-a11y',
    'prettier',
    'import',
  ],
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:jest/recommended',
    'prettier',
    'plugin:import/typescript',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    project: [
      './react/tsconfig.json',
      './functions/tsconfig.json',
      './common/tsconfig.json',
      './discord/tsconfig.json',
    ],
    tsconfigRootDir: __dirname,
  },
  rules: {
    'prettier/prettier': 'warn',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/naming-convention': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
  settings: {
    jest: {
      version: 'latest',
    },
  },
};
