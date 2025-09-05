# Technology Stack - GoRakuDo

## Overview

This document provides a comprehensive overview of the technology stack used in the GoRakuDo project, a modern Japanese language learning platform built with Astro and Vue.js.

## Table of Contents

1. [Core Framework](#core-framework)
2. [Frontend Technologies](#frontend-technologies)
3. [Styling & UI](#styling--ui)
4. [Content Management](#content-management)
5. [Development Tools](#development-tools)
6. [Testing Framework](#testing-framework)
7. [Build & Deployment](#build--deployment)
8. [Performance & Optimization](#performance--optimization)
9. [Browser Support](#browser-support)
10. [Architecture Decisions](#architecture-decisions)

---

## Core Framework

### Astro 5.13.0
- **Purpose**: Static site generator and web framework
- **Why Astro**: Zero-JavaScript by default, optimal performance, component islands architecture
- **Key Features**:
  - Static site generation with optional SSR
  - Component islands for selective hydration
  - Built-in image optimization
  - Content Collections for type-safe content management
  - File-based routing

#### 実際の使用例
```astro
---
// src/pages/docs.astro
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

const posts = await getCollection('docs');
---

<BaseLayout title="ドキュメント">
  <main>
    {posts.map(post => (
      <article>
        <h2>{post.data.title}</h2>
        <p>{post.data.description}</p>
      </article>
    ))}
  </main>
</BaseLayout>
```

#### 設定例 (astro.config.mjs)
```javascript
export default defineConfig({
  site: "https://gorakudo.org",
  output: "static",
  integrations: [
    vue({
      include: ["**/*.vue"],
      experimentalReactivityTransform: false,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            "vue-core": ["vue"],
            "vue-runtime": ["vue/dist/runtime-dom.esm-bundler.js"],
          },
        },
      },
    },
  },
});
```

### Vue.js 3.5.18
- **Purpose**: Interactive UI components
- **Integration**: Via `@astrojs/vue` integration
- **Usage**: Limited to interactive components requiring client-side state
- **Hydration Strategy**: `client:visible` and `client:idle` for performance optimization

---

## Frontend Technologies

### TypeScript 5.9.2
- **Configuration**: Strict mode enabled
- **Features**:
  - Strict null checks
  - No implicit any
  - Strict function types
  - No implicit returns
  - Strict property initialization
- **Target**: ES2020
- **Module System**: ES Modules (ESM) mandatory

#### TypeScript設定例 (tsconfig.json)
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "target": "ES2020",
    "module": "ES2020",
    "moduleResolution": "bundler",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/types/*": ["src/types/*"]
    },
    "types": ["node"],
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

#### 実際の型定義例
```typescript
// src/types/global.d.ts
declare global {
  interface Window {
    clientLogger: {
      log: (message: string, level?: 'info' | 'success' | 'warning' | 'error') => void;
      startGroup: (title: string) => void;
      endGroup: (title: string) => void;
    };
    searchEngine?: {
      search: (query: string) => Promise<unknown[]>;
      filter: (filters: Record<string, unknown>) => unknown[];
    };
  }
}

// src/utils/search/types.ts
export interface SearchPost {
  id: string;
  title: string;
  description: string;
  tags: string[];
  slug: string;
  contentType: 'guide' | 'tool' | 'methodology' | 'practice';
  learningStage: 'beginner' | 'intermediate' | 'advanced';
  isRecommended: boolean;
}

export interface SearchResult {
  posts: SearchPost[];
  filteredCount: number;
  totalCount: number;
}
```

### JavaScript Standards
- **ES Modules**: All JavaScript files use `import`/`export`
- **No CommonJS**: `require`/`module.exports` prohibited
- **Modern Syntax**: ES2020+ features enabled

---

## Styling & UI

### Tailwind CSS 4.1.12
- **Integration**: Via `@tailwindcss/vite` plugin
- **Configuration**: Custom theme with GoRakuDo brand colors
- **Features**:
  - Utility-first CSS framework
  - Custom color palette (purple/gold theme)
  - Responsive design utilities
  - Custom animations and keyframes
  - Purging enabled for production builds

### Custom CSS
- **Global Styles**: `src/styles/global.css`
- **Component Styles**: Scoped styles in Astro components
- **CSS Variables**: Custom properties for theming
- **Color System**:
  - Primary: Purple (#8B5DFF)
  - Secondary: Gold (#E4B43B)
  - Background: Dark (#0A0A0A)
  - Text: White/light gray

---

## Content Management

### Astro Content Collections
- **Collections**:
  - `docs`: Main documentation content
  - `templates`: Content creation templates
  - `tool-articles`: Tool documentation
- **Schema**: Zod-based validation
- **Features**:
  - Type-safe content access
  - Automatic path resolution
  - Content filtering and search

### Content Structure
- **Format**: Markdown with frontmatter
- **Metadata**: Rich metadata system with AI-generated content analysis
- **Organization**: Category and tag-based classification
- **Search**: Full-text search with Fuse.js integration

---

## Development Tools

### ESLint 9.34.0
- **Configuration**: Custom configuration with multiple plugins
- **Plugins**:
  - `@typescript-eslint/eslint-plugin`
  - `eslint-plugin-astro`
  - `eslint-plugin-vue`
  - `eslint-plugin-prettier`
- **Rules**: Strict TypeScript enforcement, ES Modules only

### Prettier 3.6.2
- **Configuration**: Consistent code formatting
- **Settings**:
  - 2 spaces indentation
  - Single quotes
  - Semicolons required
  - Trailing commas (ES5)

### Astro Check 0.9.4
- **Purpose**: Type checking for Astro files
- **Integration**: Part of build process
- **Features**: TypeScript validation for Astro components

---

## Testing Framework

### Vitest 3.2.4
- **Environment**: jsdom for browser simulation
- **Coverage**: V8 coverage reporting
- **Configuration**: Integrated with Vite
- **Setup**: Custom test setup files

### Testing Library
- **Jest DOM**: Custom matchers for DOM testing
- **Types**: TypeScript definitions for Jest

---

## Build & Deployment

### Vite (via Astro)
- **Build Tool**: Modern build system
- **Features**:
  - Fast HMR (Hot Module Replacement)
  - Optimized bundling
  - Code splitting
  - Asset optimization

### Build Process
```bash
npm run build  # Lint + Build + Type Check
npm run dev    # Development server
npm run preview # Preview production build
```

#### 実際のビルドスクリプト (package.json)
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "npm run lint && astro build && astro check",
    "build:quality": "npm run quality && astro build",
    "preview": "astro preview",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext .ts,.tsx,.js,.jsx,.astro",
    "lint:fix": "eslint src --ext .ts,.tsx,.js,.jsx,.astro --fix",
    "format": "prettier --write src/**/*.{ts,tsx,js,jsx,json,css,md}",
    "format:check": "prettier --check src/**/*.{ts,tsx,js,jsx,json,css,md}",
    "quality": "npm run lint && npm run format:check && npm run type-check"
  }
}
```

#### ビルド出力例
```
20:23:21 [build] 17 page(s) built in 6.66s
20:23:21 [build] Complete!

Building client (vite) 
20:23:21 [vite] ✓ 31 modules transformed.
20:23:21 [vite] dist/assets/docs-C6tHllgP.css    21.47 kB │ gzip:  4.47 kB
20:23:21 [vite] dist/assets/Navbar-ClubC9cv.js  4.60 kB │ gzip:  2.03 kB
20:23:21 [vite] dist/assets/runtime-dom.esm-bundler-DKLfQnj8.js 74.69 kB │ gzip: 29.67 kB
```

### Output
- **Static Site**: Generated in `dist/` directory
- **Optimization**: Minified CSS/JS, optimized images
- **Deployment**: GitHub Pages compatible

---

## Performance & Optimization

### Image Optimization
- **Astro Image Component**: Automatic optimization
- **Formats**: WebP, AVIF generation
- **Responsive**: Multiple sizes for different screens
- **Lazy Loading**: Built-in lazy loading support

### Bundle Optimization
- **Code Splitting**: Manual chunk configuration
- **Tree Shaking**: Dead code elimination
- **Minification**: esbuild for fast minification
- **Caching**: Optimized cache headers

### Service Worker
- **Caching Strategy**: Cache-first for static assets
- **Network Strategy**: Network-first for HTML pages
- **Versioning**: Cache versioning for updates

#### サービスワーカー実装例 (public/sw.js)
```javascript
const CACHE_NAME = 'gorakudo-v1';
const STATIC_CACHE = 'gorakudo-static-v1';

const STATIC_FILES = [
  '/',
  '/css/homepage-styles.css',
  '/favicon/favicon.ico',
  '/favicon/favicon.svg',
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('✅ Service Worker installed successfully');
        return self.skipWaiting();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== location.origin) {
    return;
  }

  if (request.destination === 'document') {
    // HTML pages - network first, cache fallback
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
  } else {
    // Static assets - cache first, network fallback
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          return fetch(request)
            .then((response) => {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(STATIC_CACHE)
                  .then((cache) => cache.put(request, responseClone));
              }
              return response;
            });
        })
    );
  }
});
```

---

## Browser Support

### Target Browsers
- **Modern Browsers**: ES2020+ support
- **Mobile**: Responsive design
- **Accessibility**: WCAG compliance

### Progressive Enhancement
- **Core Functionality**: Works without JavaScript
- **Enhanced Features**: JavaScript for interactivity
- **Fallbacks**: Graceful degradation

---

## Architecture Decisions

### Why Astro?
1. **Performance**: Zero JavaScript by default
2. **Flexibility**: Use any UI framework when needed
3. **Developer Experience**: Great TypeScript support
4. **SEO**: Static generation for optimal SEO

### Why Vue.js?
1. **Selective Use**: Only for interactive components
2. **Performance**: Minimal JavaScript footprint
3. **Developer Experience**: Excellent TypeScript integration
4. **Ecosystem**: Rich component ecosystem

### Why Tailwind CSS?
1. **Utility-First**: Rapid development
2. **Consistency**: Design system enforcement
3. **Performance**: Purging unused styles
4. **Customization**: Easy theme customization

### Why TypeScript Strict Mode?
1. **Type Safety**: Catch errors at compile time
2. **Developer Experience**: Better IDE support
3. **Maintainability**: Self-documenting code
4. **Refactoring**: Safe code changes

---

## File Structure

```
src/
├── components/          # Reusable UI components
│   ├── public-components/  # Public-facing components
│   ├── search/         # Search functionality
│   └── homepage/       # Homepage components
├── pages/              # Astro pages and routes
├── layouts/            # Page layouts
├── content/            # Content collections
├── utils/              # Utility functions
├── scripts/            # Client-side scripts
├── styles/             # Global styles
├── types/              # TypeScript definitions
└── data/               # Static data
```

---

## Configuration Files

### Core Configuration
- `astro.config.mjs`: Astro framework configuration
- `tailwind.config.mjs`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration
- `eslint.config.js`: ESLint configuration
- `vitest.config.ts`: Testing configuration

### Package Management
- `package.json`: Dependencies and scripts
- `package-lock.json`: Exact dependency versions

---

## Development Workflow

### Local Development
```bash
npm run dev          # Start development server
npm run type-check   # TypeScript validation
npm run lint         # Code linting
npm run format       # Code formatting
```

### Quality Assurance
```bash
npm run quality      # Lint + Format + Type Check
npm run test         # Run tests
npm run test:coverage # Run tests with coverage
```

#### 品質チェック実行例
```bash
$ npm run quality
> gorakudo-astro@0.0.1 quality
> npm run lint && npm run format:check && npm run type-check

> gorakudo-astro@0.0.1 lint
> eslint src --ext .ts,.tsx,.js,.jsx,.astro

> gorakudo-astro@0.0.1 format:check
> prettier --check src/**/*.{ts,tsx,js,jsx,json,css,md}

> gorakudo-astro@0.0.1 type-check
> tsc --noEmit

✅ All quality checks passed!
```

### Production Build
```bash
npm run build        # Full production build
npm run preview      # Preview production build
```

#### 本番ビルド実行例
```bash
$ npm run build
> gorakudo-astro@0.0.1 build
> npm run lint && astro build && astro check

20:23:15 [build] output: "static"
20:23:15 [build] mode: "static"
20:23:15 [build] directory: D:\Libraries\Documents\GitHub\GoRakuDo\dist\
20:23:15 [build] ✓ Completed in 512ms.
20:23:21 [build] 17 page(s) built in 6.66s
20:23:21 [build] Complete!
```

---

## Dependencies Summary

### Production Dependencies
- `astro`: ^5.13.0 (Core framework)
- `@astrojs/vue`: ^5.1.0 (Vue integration)
- `@astrojs/check`: ^0.9.4 (Type checking)
- `@tailwindcss/vite`: ^4.1.12 (Tailwind integration)
- `tailwindcss`: ^4.1.12 (CSS framework)
- `vue`: ^3.5.18 (UI framework)
- `typescript`: ^5.9.2 (Type system)
- `dotenv`: ^17.2.1 (Environment variables)

### Development Dependencies
- `eslint`: ^9.34.0 (Linting)
- `prettier`: ^3.6.2 (Formatting)
- `vitest`: ^3.2.4 (Testing)
- `@typescript-eslint/*`: ^8.42.0 (TypeScript linting)
- `eslint-plugin-*`: Various plugins
- `@testing-library/jest-dom`: ^6.8.0 (Testing utilities)

---

## Performance Metrics

### Build Performance
- **Build Time**: ~6.66s for 17 pages
- **Bundle Size**: Optimized chunks (largest: 74.69kB)
- **Asset Optimization**: Automatic image optimization

### Runtime Performance
- **Core Web Vitals**: Optimized for LCP, FID, CLS
- **JavaScript**: Minimal runtime JavaScript
- **Caching**: Service worker caching strategy

---

## Security Considerations

### Content Security
- **Input Validation**: Zod schema validation
- **XSS Prevention**: Astro's built-in protection
- **HTTPS**: Enforced in production

### Dependencies
- **Regular Updates**: Dependencies kept current
- **Vulnerability Scanning**: npm audit integration
- **Minimal Attack Surface**: Few external dependencies

---

## Future Considerations

### Potential Upgrades
- **Astro**: Keep updated with latest versions
- **Vue**: Monitor Vue 3 ecosystem updates
- **Tailwind**: Consider Tailwind CSS v4 migration
- **TypeScript**: Stay current with TypeScript releases

### Scalability
- **Content**: Content Collections scale well
- **Performance**: Static generation handles traffic
- **Maintenance**: Clear architecture for team growth

---

## Conclusion

The GoRakuDo technology stack represents a modern, performance-focused approach to web development. By leveraging Astro's static generation capabilities, Vue.js for selective interactivity, and TypeScript for type safety, the project achieves excellent performance while maintaining developer productivity.

The stack is designed for:
- **Performance**: Fast loading and optimal Core Web Vitals
- **Maintainability**: Clear architecture and strict typing
- **Scalability**: Static generation handles growth
- **Developer Experience**: Modern tools and workflows

For questions about the technology stack or suggestions for improvements, please open an issue or discuss with the development team.
