// Scripts Index - Easy imports for all categorized scripts
// Google Engineering Team 2025 Approach

// Performance Scripts
export { default as PerformanceMonitor } from "./performance/performance-monitor.js";
export { default as LocalhostPerformanceMonitor } from "./performance/localhost-performance-monitor.js";

// UI Scripts
export { default as DocsPagination } from "./ui/docs-pagination.js";
// export { default as DocsSearch } from "./ui/docs-search.js"; // Removed - search handled inline in docs.astro
export { default as DocsSkeletonLoader } from "./ui/docs-skeleton-loader.js";
export { default as PostSkeletonLoader } from "./ui/post-skeleton-loader.js";
export { default as SettingsManager } from "./ui/settings-manager.js";

// Core Scripts
export { default as HomepageScript } from "./core/hompage-script.js";
export { default as PostScript } from "./core/post-script.js";
export { default as UpgradeBrowser } from "./core/upgrade-browsermu.js";

// Utility function to load scripts dynamically
export function loadScript(category, scriptName) {
  const scriptMap = {
    performance: {
      "performance-monitor": () =>
        import("./performance/performance-monitor.js"),
      "localhost-performance-monitor": () =>
        import("./performance/localhost-performance-monitor.js"),
    },
    ui: {
      "docs-pagination": () => import("./ui/docs-pagination.js"),
      // "docs-search": () => import("./ui/docs-search.js"), // Removed - search handled inline in docs.astro
      "docs-skeleton-loader": () => import("./ui/docs-skeleton-loader.js"),
      "post-skeleton-loader": () => import("./ui/post-skeleton-loader.js"),
      "settings-manager": () => import("./ui/settings-manager.js"),
    },
    core: {
      "homepage-script": () => import("./core/hompage-script.js"),
      "post-script": () => import("./core/post-script.js"),
      "upgrade-browsermu": () => import("./core/upgrade-browsermu.js"),
    },
  };

  if (scriptMap[category] && scriptMap[category][scriptName]) {
    return scriptMap[category][scriptName]();
  }

  throw new Error(`Script not found: ${category}/${scriptName}`);
}

// Initialize all scripts
export function initializeScripts() {
  console.log("🚀 Initializing GoRakuDo Scripts...");

  // Auto-initialize based on page type
  const path = window.location.pathname;

  if (path === "/") {
    // Homepage
    import("./core/hompage-script.js");
  } else if (path.startsWith("/docs/") && path !== "/docs") {
    // Individual post page
    import("./core/post-script.js");
    import("./ui/post-skeleton-loader.js");
  } else if (path === "/docs") {
    // Docs listing page
    import("./ui/docs-pagination.js");
    // import("./ui/docs-search.js"); // Removed - search handled inline in docs.astro
    import("./ui/docs-skeleton-loader.js");
  } else if (path === "/admin/settings") {
    // Settings page
    import("./ui/settings-manager.js");
  }

  // Always load performance monitoring
  import("./performance/performance-monitor.js");

  console.log("✅ Scripts initialized successfully");
}
