import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import tailwindcss from "@tailwindcss/vite";

import mcp from "astro-mcp";

// https://astro.build/config
export default defineConfig({
  site: "https://gorakudo.org",

  // GitHub Pages Optimization
  output: "static",

  // Phase 3: Enhanced build optimization with caching strategy
  build: {
    assets: "_astro", // Cleaner asset URLs
    // Phase 3: Build-time caching optimization
    cache: {
      // Enable build cache for faster rebuilds
      enabled: true,
      // Cache invalidation strategy
      invalidate: (file) => {
        // Invalidate cache for content changes
        return file.includes('src/content/') || 
               file.includes('src/pages/') ||
               file.includes('src/components/')
      }
    }
  },

  // Public directory configuration for migrated scripts
  publicDir: "public",

  // Image optimization configuration
  image: {
    // Enable image optimization
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
    // Generate multiple formats
    formats: ["webp", "avif"],
    // Responsive image sizes
    sizes: [640, 768, 1024, 1280, 1920],
    // Quality settings
    quality: 85,
    // Enable blur placeholder
    placeholder: "blur",
  },

  // Phase 3: Enhanced Vite optimization with advanced caching
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Phase 3: Optimized for GitHub Pages CDN with advanced caching
      rollupOptions: {
        output: {
          // Phase 3: Enhanced chunk naming for optimal caching
          chunkFileNames: "assets/[name]-[hash].js",
          entryFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash].[ext]",
          // Phase 3: Optimized manual chunk splitting
          manualChunks: {
            // Critical Vue framework chunk (load first)
            "vue-core": ["vue"],
            // Vue runtime optimization
            "vue-runtime": ["vue/dist/runtime-dom.esm-bundler.js"],
            // Non-critical Vue components (load after)
            "vue-components": ["@astrojs/vue"],
            // Phase 3: Optimized script chunks
            "scripts-ui": [
              "./src/scripts/ui/docs-pagination.js",
            ],
            // Phase 3: Consolidated utility chunks
            "utils-core": [
              "./src/utils/ai-content/content-analysis.js",
              "./src/utils/ai-content/semantic-relationships.js",
              "./src/utils/error-handling/discord-error-reporter.js"
            ],
            // Phase 3: Component chunks
            "components": ["./src/components/ImageSlideshow.astro"],
          },
        },
      },
      // Phase 3: Enhanced build optimizations
      minify: "esbuild",
      target: "es2020", // Modern browsers support
      cssCodeSplit: true, // Split CSS for better caching
      sourcemap: false, // Disable sourcemaps for production
      // Phase 3: Advanced caching optimizations
      cache: {
        // Enable Vite build cache
        enabled: true,
        // Cache directory
        cacheDir: "node_modules/.vite",
        // Cache invalidation
        invalidate: (file) => {
          return file.includes('src/') || file.includes('astro.config.mjs')
        }
      }
    },
    // Phase 3: Enhanced CSS optimization
    css: {
      devSourcemap: false, // Disable sourcemaps in production
      // Phase 3: CSS optimization
      postcss: {
        plugins: [
          // Add PostCSS plugins for CSS optimization
        ]
      }
    },
    // Phase 3: Enhanced resolve configuration
    resolve: {
      alias: {
        '@': './src'
      },
      // Phase 3: Optimized module resolution
      dedupe: ['vue', 'astro']
    },
    // Phase 3: Advanced dependency optimization
    optimizeDeps: {
      include: ["vue"], // Pre-bundle Vue for faster loading
      exclude: [], // Don't exclude anything for localhost
      // Phase 3: Enhanced dependency optimization
      force: false, // Don't force re-optimization
      esbuildOptions: {
        // Phase 3: ESBuild optimization
        target: 'es2020',
        supported: {
          'top-level-await': true
        }
      }
    },
    // Simplified chunking for development stability
    // build configuration moved to main build section above
    // Development server configuration for stability
    server: {
      // Enable error overlay for better debugging
      hmr: {
        overlay: true, // Enable error overlay for development
      },
      // Standard file watching
      watch: {
        usePolling: false, // Use native file watching
      },
    },
    // Optimize for performance
    define: {
      // Optimize for performance environment
      __DEV__: JSON.stringify(process.env.NODE_ENV === "development"),
    },
  },

  integrations: [vue({
    // Enhanced Vue configuration for better performance
    include: ["**/*.vue"],
    // Disable experimental features to prevent conflicts
    experimentalReactivityTransform: false,
    // Enable global imports for composition API
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.startsWith('ion-')
      }
    }
  }), // Enable View Transitions API for smooth page transitions
  {
    name: "view-transitions",
    hooks: {
      "astro:config:setup": ({ updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [tailwindcss()],
          },
          experimental: {
            viewTransitions: true,
          },
        });
      },
    },
  }, mcp()],
});