import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://gorakudo.org",
  base: "/",

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
              "./src/scripts/ui/docs-search.js",
            ],
            "scripts-core": [
              "./src/scripts/core/hompage-script.js",
              "./src/scripts/core/post-script.js",
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
    // Reduce bundle size for performance
    build: {
      chunkSizeWarningLimit: 300, // Reduced from 500KB for stricter optimization
      rollupOptions: {
        output: {
          // Optimize for performance
          manualChunks: (id) => {
            // Critical chunks for performance
            if (id.includes("vue") && id.includes("runtime")) {
              return "vue-runtime-critical";
            }
            if (id.includes("vue") && !id.includes("runtime")) {
              return "vue-core";
            }
            // Non-critical chunks for performance
            if (id.includes("settings") || id.includes("admin")) {
              return "settings-chunk";
            }
            if (id.includes("discord") || id.includes("error")) {
              return "error-handling-chunk";
            }
            if (id.includes("slideshow") || id.includes("image")) {
              return "media-chunk";
            }
            // Default chunking
            return "vendor";
          },
        },
      },
    },
    // Performance-specific optimizations
    server: {
      // Optimize development server for performance
      hmr: {
        overlay: false, // Disable error overlay for faster performance
      },
      // Enable faster development
      watch: {
        usePolling: false, // Use native file watching for performance
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
      // Enable experimental features for better performance
      experimentalReactivityTransform: true,
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
