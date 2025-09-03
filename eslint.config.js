import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        performance: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        FormData: 'readonly',
        CustomEvent: 'readonly',
        IntersectionObserver: 'readonly',
        PerformanceObserver: 'readonly',
        module: 'readonly',
        global: 'readonly',
      },
    },
    rules: {
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-undef': 'off', // Browser globals are defined above
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // TypeScript specific rules can be added here when TypeScript parser is available
    },
  },
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      'coverage/',
      'backup/',
      '.astro/',
      'public/',
      '*.config.js',
      '*.config.ts',
      'src/types-backup*/**/*.ts',
      'src/types-backup*/**/*.d.ts',
    ],
  },
];
