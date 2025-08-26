# Technology Stack - GoRakuDo

## Overview

This document outlines the actual technology stack used in the GoRakuDo project, including frameworks, libraries, tools, and deployment infrastructure. All technologies listed are actively used in the codebase.

## Table of Contents

1. [Core Framework](#core-framework)
2. [Frontend Technologies](#frontend-technologies)
3. [Styling & UI](#styling--ui)
4. [AI & Automation](#ai--automation)
5. [Search Implementation](#search-implementation)
6. [Performance & Optimization](#performance--optimization)
7. [Content Processing Pipeline](#content-processing-pipeline)
8. [Security Measures](#security-measures)
9. [Development Toolchain](#development-toolchain)
10. [Deployment & Hosting](#deployment--hosting)
11. [External Services](#external-services)
12. [Version Control](#version-control)

## Core Framework

### Astro.js
- **Version**: 5.13.0
- **Purpose**: Static Site Generator (SSG)
- **Configuration**: `astro.config.mjs`
- **Key Features**:
  - Zero JavaScript by default
  - Component Islands architecture
  - Built-in performance optimizations
  - Multiple framework support

```javascript
// astro.config.mjs
export default defineConfig({
  site: "https://gorakudo.org",
  output: "static", // Static site generation
  integrations: [vue()],
  // Performance optimizations
  build: {
    assets: "_astro",
  }
});
```

### Vue.js Integration
- **Version**: 3.5.18
- **Integration**: @astrojs/vue 5.1.0
- **Usage**: Interactive components and client-side functionality
- **Features**:
  - Composition API
  - TypeScript support
  - Reactive data binding

## Frontend Technologies

### TypeScript
- **Version**: 5.9.2
- **Configuration**: `tsconfig.json`
- **Features**:
  - Strict type checking
  - ES2020 target
  - Module resolution: node
  - JSX preservation

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "moduleResolution": "node"
  }
}
```

### JavaScript (ES2020+)
- **Features**:
  - Modern ES modules
  - Async/await
  - Optional chaining
  - Nullish coalescing

## Styling & UI

### Tailwind CSS
- **Version**: 4.1.12
- **Configuration**: `tailwind.config.mjs`
- **Features**:
  - JIT (Just-In-Time) compilation
  - Custom color palette
  - Responsive design utilities
  - Custom animations

```javascript
// tailwind.config.mjs
export default {
  mode: "jit",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: {
          500: "#8B5DFF", // Main purple
          600: "#7B4DEF",
        },
        secondary: {
          500: "#E4B43B", // Main gold
        }
      }
    }
  }
};
```

### Custom CSS
- **Location**: `src/styles/`
- **Features**:
  - Global styles
  - Component-specific styles
  - CSS custom properties
  - Responsive design

### Custom Icon System
- **Implementation**: SVG icons embedded directly in components
- **Usage**: Navigation, buttons, and interactive elements
- **Features**:
  - Optimized SVG graphics
  - Custom icon designs for GoRakuDo branding
  - Inline SVG for better performance

## AI & Automation

### Google Generative AI Integration
- **Package**: @google/genai 0.3.0
- **Usage**: AI-powered content generation and analysis
- **Features**:
  - Content metadata generation
  - SEO optimization
  - Content recommendations
  - Semantic analysis

### GenAI Post Metadata System
- **Location**: `GenAI-PostMetadata-Gemini/`
- **Purpose**: Centralized AI metadata generation system
- **Components**:
  - **Core API**: `core/gemini-api-new.ts` - Main GenAI API wrapper
  - **Metadata Generation**: `metadata/auto-ai-metadata-fixed.ts` - Enhanced metadata generation
  - **Content Recommendations**: `metadata/api-recommendations.ts` - AI-powered content suggestions
  - **Rate Limiting**: `core/rate-limiter.ts` - API quota management
  - **Environment Setup**: `core/node-env-setup.ts` - Configuration management

### AI CLI Tools
- **Main CLI**: `ai-cli.js` - Command-line interface for AI operations
- **Metadata CLI**: `geminiseo-metadata-cli.js` - Automated metadata generation
- **Silent CLI**: `geminiseo-metadata-cli-silent.js` - Non-interactive metadata generation
- **Windows Support**: `geminiseo-metadata-cli.bat` - Windows batch file

### AI Agent Bundles
- **Location**: `web-bundles/`
- **Purpose**: Pre-configured AI agent configurations
- **Structure**:
  - **Agents**: `agents/` - Individual AI agent configurations
  - **Teams**: `teams/` - Team-based AI configurations
  - **Expansion Packs**: `expansion-packs/` - Extended AI capabilities

### AI Content Analysis
- **Location**: `src/utils/ai-content/`
- **Features**:
  - Content analysis and internal linking
  - Semantic relationship detection
  - Word-to-link conversion
  - Inline internal linking
  - AI metadata validation

## Search Implementation

### Fuse.js Fuzzy Search
- **Version**: 7.1.0
- **Usage**: Client-side fuzzy search functionality
- **Features**:
  - Fuzzy matching for typo tolerance
  - Real-time search results
  - Configurable search thresholds
  - Indonesian language support

### Search Infrastructure
- **Search API**: `src/pages/search.json.js` - JSON endpoint for search data
- **Search Utilities**: `src/utils/search/` - Search-related utilities
- **Search Scripts**: `src/scripts/search/` - Client-side search functionality

### Search Data Generation
- **Location**: `src/utils/content/search-data-generator.ts`
- **Purpose**: Generate searchable content from markdown files
- **Features**:
  - Automatic content indexing
  - Keyword extraction
  - Topic categorization
  - Search result ranking

### Search Performance Optimization
- **Implementation**: Client-side search with pre-generated data
- **Benefits**:
  - Instant search results
  - No server requests for search
  - Offline search capability
  - Reduced server load

## Build Tools & Development

### Vite
- **Version**: Bundled with Astro
- **Features**:
  - Fast hot module replacement
  - Optimized builds
  - Plugin system
  - Development server

### PostCSS
- **Version**: 8.5.6
- **Usage**: CSS processing and optimization
- **Plugins**:
  - Autoprefixer
  - Tailwind CSS

### Autoprefixer
- **Version**: 10.4.21
- **Purpose**: Automatic vendor prefixing
- **Configuration**: Automatic based on browser targets

## Content Processing Pipeline

### Markdown Processing
- **Library**: marked 16.2.0
- **Usage**: Markdown to HTML conversion
- **Features**:
  - Frontmatter support
  - Astro.glob() for content collection
  - Metadata extraction
  - Custom markdown extensions

### Content Collections
- **Location**: `src/content/`
- **Configuration**: `src/content/config.ts` and `src/content/content-config.ts`
- **Features**:
  - Type-safe content with TypeScript
  - Automatic schema validation
  - SEO metadata generation
  - Content structure management

### Content Analysis & Enhancement
- **Location**: `src/utils/content/`
- **Components**:
  - **Enhanced Content Extractor**: `enhanced-content-extractor.ts` - Advanced content processing
  - **Auto Content Extractor**: `auto-content-extractor.ts` - Automated content analysis
  - **Search Data Generator**: `search-data-generator.ts` - Search index generation
  - **Content Structure**: `content-structure/` - Content organization utilities

### AI-Powered Content Processing
- **Location**: `src/utils/ai-content/`
- **Features**:
  - **Content Analysis**: `content-analysis.ts` - AI-powered content analysis
  - **Semantic Relationships**: `semantic-relationships.ts` - Content relationship detection
  - **Word-to-Link Conversion**: `word-to-link-converter.ts` - Automatic internal linking
  - **Inline Internal Linking**: `inline-internal-linking.ts` - Smart content linking
  - **Optimized Post Processor**: `optimized-post-processor.ts` - Enhanced content processing

### Content Metadata Generation
- **AI Metadata**: `src/utils/ai-content/auto-ai-metadata-fixed.ts`
- **Metadata Validation**: `src/utils/ai-content/ai-metadata-validator.ts`
- **Metadata Loading**: `src/utils/metadata-loader.ts`
- **Features**:
  - Automatic SEO description generation
  - Keyword extraction and optimization
  - Content recommendations
  - Metadata validation and quality assurance

## Performance & Optimization

### Image Optimization
- **Service**: Sharp (via Astro)
- **Features**:
  - Multiple formats (WebP, AVIF)
  - Responsive images
  - Blur placeholders
  - Quality optimization (85%)

```javascript
// astro.config.mjs
image: {
  service: {
    entrypoint: "astro/assets/services/sharp",
  },
  formats: ["webp", "avif"],
  sizes: [640, 768, 1024, 1280, 1920],
  quality: 85,
  placeholder: "blur",
}
```

### Bundle Optimization (GoRakuDo Specific)
- **Strategy**: Manual chunk splitting with performance focus
- **Implementation**: Custom Vite configuration in `astro.config.mjs`
- **Chunk Organization**:
  - **Vue Core**: `vue-core` - Critical Vue framework
  - **Vue Runtime**: `vue-runtime` - Vue runtime optimization
  - **Performance**: `performance` - Performance monitoring tools
  - **AI Content**: `ai-content` - AI utilities (load on demand)
  - **Scripts**: `scripts-performance`, `scripts-ui`, `scripts-core` - Organized by function
  - **Components**: `slideshow`, `settings`, `discord` - Page-specific components

### Performance Monitoring Tools
- **Location**: `src/utils/performance/`
- **Components**:
  - **Performance Monitor**: `performance-monitor.js` - Core Web Vitals tracking
  - **Localhost Optimizer**: `localhost-optimizer.ts` - Development performance optimization
  - **AI Prefetch Optimizer**: `ai-prefetch-optimizer.ts` - AI-optimized resource hints
  - **Progressive Enhancement**: `progressive-enhancement.ts` - Progressive enhancement system

### Performance Metrics Tracking
```javascript
// Real performance monitoring from GoRakuDo
console.log("🎯 LCP:", lcp.toFixed(2), "ms");
console.log("⚡ FID:", fid.toFixed(2), "ms");
console.log("📐 CLS:", clsValue.toFixed(4));
console.log("🌐 TTFB:", ttfb.toFixed(2), "ms");
console.log("🎨 FCP:", fcp.toFixed(2), "ms");
```

### Caching Strategy
- **Library**: node-cache 5.1.2
- **Usage**: Server-side caching for performance optimization
- **Features**:
  - In-memory caching
  - TTL (Time To Live) support
  - Performance optimization
  - Reduced API calls

## Deployment & Hosting

### GitHub Pages
- **URL**: https://gorakudo.org
- **Features**:
  - Static site hosting
  - Custom domain support
  - HTTPS by default
  - Global CDN

### Build Process
```bash
npm run build  # Creates optimized static files
npm run preview # Local preview of build
```

### Static Site Generation
- **Output**: `dist/` directory
- **Features**:
  - Pre-rendered HTML
  - Optimized assets
  - SEO-friendly URLs
  - Fast loading times

## Development Tools

### Node.js
- **Version**: 22.0+ (recommended)
- **Usage**: Development environment
- **Features**:
  - ES modules support
  - Package management
  - Development server

### Package Manager
- **Primary**: npm
- **Alternative**: pnpm, yarn
- **Lock file**: `package-lock.json`

### Development Scripts
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  }
}
```

## Security Measures

### XSS Prevention
- **Library**: DOMPurify 3.2.6
- **Usage**: HTML sanitization and XSS prevention
- **Features**:
  - HTML sanitization
  - Content filtering
  - Security hardening
  - Safe content rendering

### Security Utilities
- **Location**: `src/utils/security/`
- **Purpose**: Security-related utilities and validation
- **Features**:
  - Input validation
  - Content sanitization
  - Security best practices implementation

### Environment Security
- **Configuration**: `env.example` and environment variable management
- **Features**:
  - API key protection
  - Environment-specific configurations
  - Secure credential management

## Development Toolchain

### Code Formatting
- **Prettier**: 3.6.2
- **Plugin**: prettier-plugin-tailwindcss 0.6.14
- **Configuration**: Automatic code formatting with Tailwind CSS class sorting

### TypeScript Configuration
- **Version**: 5.9.2
- **Configuration**: `tsconfig.json`
- **Features**:
  - Strict type checking
  - ES2020 target
  - Module resolution: node
  - JSX preservation

### Development Scripts
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build", 
    "preview": "astro preview",
    "astro": "astro"
  }
}
```

### Quality Assurance
- **Location**: `qa/`
- **Structure**:
  - **Gates**: `qa/gates/` - Quality gates and checks
  - **Reports**: `qa/reports/` - QA reports and metrics

## External Services

### Google Generative AI
- **Package**: @google/genai 0.3.0
- **Usage**: AI-powered content generation and analysis
- **Features**:
  - Content analysis
  - Metadata generation for SEO optimization
  - Semantic content processing
  - AI-powered recommendations

### Environment Management
- **Library**: dotenv 17.2.1
- **Usage**: Environment variable management
- **Features**:
  - Environment-specific configurations
  - Secure credential management
  - Development/production environment separation

## Version Control

### Git
- **Repository**: GitHub
- **Branching**: Main branch workflow
- **Features**:
  - Version control
  - Collaboration
  - Issue tracking
  - Pull requests

### GitHub Actions (Planned)
- **Purpose**: CI/CD pipeline
- **Features**:
  - Automated builds
  - Deployment to GitHub Pages
  - Quality checks
  - Performance monitoring

## Development Environment

### Editor Support
- **Recommended**: VS Code
- **Extensions**:
  - Astro extension
  - Vue Language Features
  - Tailwind CSS IntelliSense
  - TypeScript support

### Browser Support
- **Target**: Modern browsers
- **Features**:
  - ES2020 support
  - CSS Grid/Flexbox
  - Web APIs
  - Progressive enhancement

## Performance Targets

### Core Web Vitals
- **LCP**: < 2s
- **FID**: < 75ms
- **CLS**: < 0.1

### Bundle Size
- **Target**: < 100KB initial bundle
- **Strategy**: Code splitting and lazy loading

### Loading Speed
- **Target**: < 3s on 3G
- **Strategy**: Static generation and optimization

## Security Considerations

### Content Security Policy
- **Implementation**: CSP headers
- **Features**:
  - XSS prevention
  - Resource restrictions
  - Secure defaults

### HTTPS
- **Enforcement**: Always HTTPS
- **Features**:
  - Secure connections
  - Mixed content prevention
  - SEO benefits

## Monitoring & Analytics

### Performance Monitoring
- **Implementation**: Custom performance tracking
- **Metrics**:
  - Page load times
  - User interactions
  - Error rates

### Error Reporting
- **Service**: Discord integration
- **Features**:
  - Real-time error alerts
  - Stack trace analysis
  - User context

## Key Technical Decisions

### Why This Stack?
1. **Astro.js**: Chosen for static site generation and performance optimization
2. **Vue.js**: Selected for interactive components and reactive data binding
3. **Tailwind CSS**: Adopted for rapid UI development and consistent design system
4. **AI Integration**: Implemented for automated content enhancement and SEO optimization
5. **Client-side Search**: Chosen for instant search results and offline capability

### Performance Focus
- **Static Generation**: Pre-rendered HTML for fast loading
- **Code Splitting**: Manual chunk optimization for optimal loading
- **Image Optimization**: Multiple formats and responsive images
- **Caching Strategy**: In-memory caching for performance

### AI-First Approach
- **Content Enhancement**: AI-powered metadata generation
- **Search Optimization**: Semantic content analysis
- **Automation**: CLI tools for content processing
- **Quality Assurance**: AI-powered content validation

## Future Considerations

### Planned Upgrades
- **Astro**: Latest stable versions
- **Vue**: Vue 3.x ecosystem
- **Tailwind**: v4.x features
- **TypeScript**: Latest features

### Potential Additions
- **Testing**: Vitest, Playwright
- **CMS**: Headless CMS integration
- **Analytics**: Privacy-focused analytics
- **PWA**: Progressive Web App features

## Conclusion

The GoRakuDo tech stack represents a modern, AI-enhanced approach to web development. The combination of Astro.js for static generation, Vue.js for interactivity, Tailwind CSS for styling, and comprehensive AI integration creates a powerful foundation for content-driven websites with excellent performance and user experience.

### Key Strengths:
- **Performance**: Optimized for Core Web Vitals and fast loading
- **AI Integration**: Automated content enhancement and SEO optimization
- **Developer Experience**: Modern toolchain with TypeScript and comprehensive tooling
- **Scalability**: Modular architecture with clear separation of concerns
- **Security**: XSS prevention and secure content handling

For questions about the tech stack or suggestions for improvements, please open an issue or discuss with the development team.
