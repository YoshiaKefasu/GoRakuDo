import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://gorakudo.org",

  // GitHub Pages Optimization
  output: "static",

  // Build optimization for GitHub Pages
  build: {
    assets: "_astro", // Cleaner asset URLs
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

  // Vite optimization for GitHub Pages with enhanced performance
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Optimize for GitHub Pages CDN with performance focus
      rollupOptions: {
        output: {
          // Optimized chunk naming for better caching
          chunkFileNames: "assets/[name]-[hash].js",
          entryFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash].[ext]",
          // Enhanced manual chunk splitting for optimal performance
          manualChunks: {
            // Critical Vue framework chunk (load first) - OPTIMIZED FOR LOCALHOST
            "vue-core": ["vue"],
            // Vue runtime optimization for localhost
            "vue-runtime": ["vue/dist/runtime-dom.esm-bundler.js"],
            // Non-critical Vue components (load after)
            "vue-components": ["@astrojs/vue"],
            // Performance monitoring (load after page load)
            performance: ["./src/utils/performance/performance-monitor.js"],
            // Scripts (migrated from public/scripts/)
            "scripts-performance": [
              "./src/scripts/performance/performance-monitor.js",
            ],
            "scripts-ui": [
              "./src/scripts/ui/docs-pagination.js",
              // "./src/scripts/ui/docs-search.js", // Removed - search handled inline in docs.astro
              // FIX #131: 404 error for docs-search.js - Unused file reference
              // ROOT CAUSE: File referenced but not actually loaded
              // SOLUTION: Removed reference, search handled inline
              // STATUS: ✅ RESOLVED
            ],
            // AI content utilities (load on demand)
            "ai-content": ["./src/utils/ai-content/content-analysis.js"],
            // Semantic relationships (load on demand)
            semantic: ["./src/utils/ai-content/semantic-relationships.js"],
            // Settings page optimization (load on demand)
            settings: ["./src/pages/settings.astro"],
            // Discord error reporter (load on demand)
            discord: ["./src/utils/error-handling/discord-error-reporter.js"],
            // Image slideshow (load on demand)
            slideshow: ["./src/components/ImageSlideshow.astro"],
          },
        },
      },
      // Use esbuild minification for faster builds
      minify: "esbuild",
      target: "es2020", // Modern browsers support
      // Performance optimizations
      cssCodeSplit: true, // Split CSS for better caching
      sourcemap: false, // Disable sourcemaps for production
    },
    // Optimize CSS for performance
    css: {
      devSourcemap: false, // Disable sourcemaps in production
    },
    // Performance optimizations
    optimizeDeps: {
      include: ["vue"], // Pre-bundle Vue for faster loading
      exclude: [], // Don't exclude anything for localhost
    },
    // Simplified chunking for development stability
    build: {
      chunkSizeWarningLimit: 500, // Increased for development stability
      rollupOptions: {
        output: {
          // Simplified chunking to prevent dev toolbar conflicts
          manualChunks: (id) => {
            // Basic Vue chunking
            if (id.includes("vue")) {
              return "vue";
            }
            // Default chunking
            return "vendor";
          },
        },
      },
    },
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

  integrations: [
    vue({
      // Enhanced Vue configuration for better performance
      include: ["**/*.vue"],
      // Disable experimental features to prevent conflicts
      experimentalReactivityTransform: false,
    }),
    // Enable View Transitions API for smooth page transitions
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
    },
  ],
});
