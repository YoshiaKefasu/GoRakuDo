# Source Tree - GoRakuDo

## Overview

This document provides a comprehensive overview of the GoRakuDo project's source code structure, accurately reflecting the actual file and directory organization.

## Table of Contents

1. [Root Directory](#root-directory)
2. [Source Code (`src/`)](#source-code-src)
3. [Public Assets (`public/`)](#public-assets-public)
4. [Documentation (`docs/`)](#documentation-docs)
5. [Configuration Files](#configuration-files)
6. [Build Output (`dist/`)](#build-output-dist)

## Root Directory

```
GoRakuDo/
├── src/                    # Source code
├── public/                 # Static assets
├── docs/                   # Project documentation
├── dist/                   # Build output (generated)
├── node_modules/           # Dependencies (generated)
├── web-bundles/            # AI agent bundles
├── qa/                     # Quality assurance
├── GenAI-PostMetadata-Gemini/  # AI metadata generation
├── package.json            # Project configuration
├── package-lock.json       # Dependency lock file
├── astro.config.mjs        # Astro configuration
├── tailwind.config.mjs     # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── README.md               # Project overview
├── LICENSE                 # Project license
├── SECURITY.md             # Security policy
├── LOCAL_SETUP.md          # Local development setup
├── NODE_ENV_SETUP.md       # Environment setup
├── Implementation Timelapses.md  # Development history
├── Developer and AI Notes.md     # Development notes
├── ai-cli.js               # AI CLI tool
├── geminiseo-metadata-cli.js     # SEO metadata CLI
├── geminiseo-metadata-cli.bat    # Windows batch file
├── geminiseo-metadata-cli-silent.js  # Silent CLI version
└── env.example             # Environment variables template
```

## Source Code (`src/`)

### Main Structure
```
src/
├── components/             # Reusable UI components
├── pages/                  # Astro pages and routes
├── layouts/                # Page layouts
├── content/                # Content collections
├── utils/                  # Utility functions
├── scripts/                # Client-side scripts
├── styles/                 # Global styles
├── types/                  # TypeScript definitions
├── data/                   # Static data
└── assets/                 # Images and static assets
```

### Components (`src/components/`)
```
components/
├── docs/                   # Documentation components
├── mind-map/               # Mind map visualization
├── public-components/      # Public-facing components
├── pages/                  # Page-specific components
├── search/                 # Search functionality
├── content/                # Content display components
└── homepage/               # Homepage components
```

### Pages (`src/pages/`)
```
pages/
├── index.astro             # Homepage (15KB, 388 lines)
├── tools.astro             # Tools page (21KB, 626 lines)
├── docs.astro              # Documentation page (70KB, 1956 lines)
├── docs/                   # Documentation subpages
├── admin/                  # Admin pages
├── search.json.js          # Search API (5.6KB, 159 lines)
├── 404.astro              # 404 error page (9.3KB, 347 lines)
├── mind-map.astro          # Mind map page (13KB, 532 lines)
├── discord.astro           # Discord page (11KB, 424 lines)
├── settings.astro          # Settings page (7.0KB, 245 lines)
└── sitemap.xml.ts          # Sitemap generator (1.3KB, 55 lines)
```

### Utils (`src/utils/`)
```
utils/
├── ai-content/             # AI content utilities
├── ai/                     # AI-related utilities
├── content/                # Content management
├── search/                 # Search utilities
├── performance/            # Performance monitoring
├── security/               # Security utilities
├── error-handling/         # Error handling
├── content-structure/      # Content structure utilities
├── index.ts                # Main utils export (1.3KB, 50 lines)
├── content-path-resolver.ts # Path resolution (8.0KB, 316 lines)
├── metadata-loader.ts      # Metadata loading (3.8KB, 151 lines)
├── content-config-README.md # Content config docs (11KB, 441 lines)
├── content-path-resolver.md # Path resolver docs (5.3KB, 218 lines)
└── README.md               # Utils documentation (4.6KB, 126 lines)
```

### Content (`src/content/`)
```
content/
├── tools/                  # Tools content
├── docs/                   # Documentation content
├── templates/              # Content templates
├── config.ts               # Content configuration (4.6KB, 153 lines)
└── content-config.ts       # Content structure config (18KB, 727 lines)
```

### Scripts (`src/scripts/`)
```
scripts/
├── ui/                     # UI-related scripts
├── background/             # Background scripts
├── core/                   # Core functionality
├── search/                 # Search scripts
├── performance/            # Performance scripts
├── index.js                # Main scripts entry (3.3KB, 83 lines)
└── README.md               # Scripts documentation (5.0KB, 173 lines)
```

### Styles (`src/styles/`)
```
styles/
├── tools/                  # Tools page styles
├── docs/                   # Documentation styles
├── homepage/               # Homepage styles
└── global.css              # Global styles (39KB, 1431 lines)
```

## Public Assets (`public/`)

```
public/
├── css/                    # Additional CSS files
├── img/                    # Images and graphics
├── favicon/                # Favicon assets
├── favicon.ico             # Main favicon (15KB)
├── favicon.svg             # SVG favicon (46KB)
├── sw.js                   # Service worker (3.4KB, 122 lines)
└── robots.txt              # Search engine directives (331B, 19 lines)
```

## Documentation (`docs/`)

```
docs/
├── architecture/           # Architecture documentation
│   ├── coding-standards.md # Coding standards
│   ├── tech-stack.md       # Technology stack
│   └── source-tree.md      # This document
├── stories/                # User stories and epics
├── epic-background-animation-modularization.md  # Animation epic (11KB, 255 lines)
├── gorakudo-stories-complete.md                 # Complete stories (26KB, 707 lines)
└── tools-page-ux-ui-enhancement.md              # Tools page enhancement (24KB, 881 lines)
```

## Configuration Files

### Package Configuration
- `package.json` - Project dependencies and scripts
- `package-lock.json` - Exact dependency versions

### Build Configuration
- `astro.config.mjs` - Astro framework configuration
- `tailwind.config.mjs` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

### Environment
- `env.example` - Environment variables template
- `NODE_ENV_SETUP.md` - Environment setup instructions

## Build Output (`dist/`)

```
dist/                       # Generated build output
├── _astro/                 # Astro-generated assets
├── css/                    # Compiled CSS
├── img/                    # Optimized images
├── favicon/                # Favicon files
├── admin/                  # Admin pages
├── discord/                # Discord page
├── docs/                   # Documentation pages
├── mind-map/               # Mind map page
├── settings/               # Settings page
├── tools/                  # Tools page
├── index.html              # Homepage
├── 404.html                # 404 page
├── robots.txt              # Search directives
├── sitemap.xml             # Sitemap
├── search.json             # Search index
└── sw.js                   # Service worker
```

## Key File Sizes and Line Counts

### Largest Source Files
- `src/pages/docs.astro` - 70KB, 1956 lines (Main documentation page)
- `src/styles/global.css` - 39KB, 1431 lines (Global styles)
- `src/content/content-config.ts` - 18KB, 727 lines (Content configuration)
- `src/pages/tools.astro` - 21KB, 626 lines (Tools page)
- `src/pages/mind-map.astro` - 13KB, 532 lines (Mind map page)

### Configuration Files
- `astro.config.mjs` - 163 lines (Astro configuration)
- `tailwind.config.mjs` - 127 lines (Tailwind configuration)
- `tsconfig.json` - 25 lines (TypeScript configuration)

### Documentation Files
- `docs/gorakudo-stories-complete.md` - 26KB, 707 lines
- `docs/tools-page-ux-ui-enhancement.md` - 24KB, 881 lines
- `src/utils/content-config-README.md` - 11KB, 441 lines

## Special Directories

### AI and Automation
- `GenAI-PostMetadata-Gemini/` - AI-powered metadata generation
- `web-bundles/` - AI agent bundles for different purposes
- `ai-cli.js` - AI command-line interface

### Quality Assurance
- `qa/` - Quality assurance and testing
- `qa/gates/` - Quality gates
- `qa/reports/` - QA reports

### Development Tools
- `Implementation Timelapses.md` - Development history tracking
- `Developer and AI Notes.md` - Development notes and AI interactions

## File Type Distribution

### Source Files
- **Astro Components**: `.astro` files for pages and components
- **Vue Components**: `.vue` files for interactive components
- **TypeScript**: `.ts` files for utilities and type definitions
- **JavaScript**: `.js` files for scripts and utilities
- **CSS**: `.css` files for styling
- **Markdown**: `.md` files for documentation and content

### Configuration Files
- **JSON**: Package and configuration files
- **JavaScript Modules**: `.mjs` files for modern JavaScript
- **TypeScript Config**: TypeScript configuration

### Build Output
- **HTML**: Generated static pages
- **CSS**: Compiled and optimized stylesheets
- **JavaScript**: Bundled and minified scripts
- **Images**: Optimized image assets

## Development Workflow

### Source Organization
1. **Components** are organized by feature/domain
2. **Pages** follow Astro's file-based routing
3. **Utils** are grouped by functionality
4. **Content** is structured for easy management
5. **Styles** are organized by page/component

### Build Process
1. **Development**: `npm run dev` - Local development server
2. **Build**: `npm run build` - Generate static site
3. **Preview**: `npm run preview` - Preview build locally
4. **Deploy**: Static files served from `dist/`

## Conclusion

The GoRakuDo source tree reflects a well-organized Astro.js project with clear separation of concerns, comprehensive documentation, and a focus on maintainability. The structure supports the project's goals of providing Japanese language learning resources through a modern, performant web application.

For questions about the source tree or suggestions for reorganization, please open an issue or discuss with the development team.
