module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:astro/recommended',
    'prettier', // Prettierとの競合を避ける
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'astro'],
  rules: {
    // TypeScript固有のルール
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',

    // 一般的なルール
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',

    // Astro固有のルール
    'astro/no-unused-css-selector': 'warn',
    'astro/prefer-class-list-directive': 'warn',
  },
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {
        // Astroファイル固有のルール
        'astro/no-unused-css-selector': 'warn',
        'astro/prefer-class-list-directive': 'warn',
      },
    },
    {
      files: ['*.js', '*.mjs'],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    'backup/',
    '.astro/',
    'public/',
    '*.config.js',
    '*.config.ts',
  ],
};
