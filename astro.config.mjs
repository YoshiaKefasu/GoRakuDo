import { defineConfig } from "astro/config";

import vue from "@astrojs/vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://gorakudo.org",
  base: "/",

  // GitHub Pages Optimization
  output: "static",

  // Build optimization for GitHub Pages
  build: {
    assets: "_astro", // Cleaner asset URLs
  },

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

  // Vite optimization for GitHub Pages with safe bundle splitting
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Optimize for GitHub Pages CDN
      rollupOptions: {
        output: {
          // Better chunk naming for caching
          chunkFileNames: "assets/[name]-[hash].js",
          entryFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash].[ext]",
          // Safe manual chunk splitting
          manualChunks: {
            // Vue framework chunk
            "vue-framework": ["vue"],
            // Performance monitoring chunk (load after page load)
            performance: ["./src/utils/performance-monitor.js"],
            // Service Worker chunk (separate)
            "service-worker": ["./public/sw.js"],
          },
        },
      },
      // Use esbuild minification (safer than terser)
      minify: "esbuild",
      target: "es2020", // Modern browsers support
    },
    // Optimize CSS for GitHub Pages
    css: {
      devSourcemap: false, // Disable sourcemaps in production
    },
  },

  integrations: [
    vue(),
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
