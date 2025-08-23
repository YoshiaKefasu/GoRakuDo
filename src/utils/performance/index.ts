// Performance Utilities - Index File
// Centralized exports for all performance optimization utilities

export {
  generateAIPrefetchHints,
  generatePageSpecificAIOptimizations,
  defaultAIConfig,
} from "./ai-prefetch-optimizer";

export type {
  AIPrefetchConfig,
  ResourceHint,
  AIPrefetchResult,
} from "./ai-prefetch-optimizer";

// Performance Enhancement Loader exports removed to prevent 404 errors in development server
// These are now imported directly in components that need them
// export {
//   PerformanceEnhancementLoader,
//   performanceLoader,
// } from "./performance-enhancement-loader";

// export type {
//   PerformanceMetrics,
//   EnhancementConfig,
//   UserPreferences,
//   BrowserCapabilities,
// } from "./performance-enhancement-loader";

export { initPerformanceMonitoring } from "./performance-monitor";

export { HybridProgressiveEnhancement } from "./progressive-enhancement";

export type {
  EnhancementConfig as ProgressiveEnhancementConfig,
  EnhancementState,
} from "./progressive-enhancement";

export {
  optimizeForLocalhost,
  generateLocalhostResourceHints,
  getLocalhostBundleSplitting,
  optimizeVueImports,
  generateCriticalCSS,
  generateLocalhostPerformanceMonitoring,
} from "./localhost-optimizer";

export type { LocalhostOptimizationConfig } from "./localhost-optimizer";
