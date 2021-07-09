module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'jest',
    'jest-dom',
    'react-hooks',
    'jsx-a11y',
    'prettier',
  ],
  extends: [
    'plugin:react/recommended',
    'airbnb-typescript',
    'plugin:jest/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
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
    'react/jsx-filename-extension': [
      2,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    'import/no-extraneous-dependencies': 0,
    'react/prop-types': 0,
    'react/jsx-props-no-spreading': 0,
    'no-console': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/naming-convention': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
  },
  settings: {
    'import/resolver': {
      node: {
        paths: [__dirname + '/react'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    jest: {
      version: 'latest',
    },
  },
};
