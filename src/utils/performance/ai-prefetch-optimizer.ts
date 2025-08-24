// Simplified AI Prefetch Optimizer for SEO 2025-2030
// Optimized for Google's AI integration with reduced complexity
// 100% safe implementation with essential optimizations only

export interface AIPrefetchConfig {
  // Core Web Vitals optimization
  enableLCPOptimization: boolean;
  enableFIDOptimization: boolean;
  enableCLSOptimization: boolean;

  // AI Search Engine specific optimizations
  enableAICrawlerHints: boolean;
  enableSemanticPreloading: boolean;
  enableContentPrediction: boolean;

  // Performance monitoring
  enablePerformanceMonitoring: boolean;
  enableAIMetrics: boolean;
}

export interface ResourceHint {
  rel: string;
  href: string;
  as?: string;
  type?: string;
  crossorigin?: string;
  fetchpriority?: string;
  media?: string;
}

export interface AIPrefetchResult {
  resourceHints: ResourceHint[];
  performanceScripts: string[];
  aiOptimizations: string[];
}

// Simplified configuration - essential optimizations only
export const defaultAIConfig: AIPrefetchConfig = {
  enableLCPOptimization: true,
  enableFIDOptimization: true,
  enableCLSOptimization: true,
  enableAICrawlerHints: true,
  enableSemanticPreloading: false, // Simplified: removed complex semantic preloading
  enableContentPrediction: false, // Simplified: removed content prediction
  enablePerformanceMonitoring: true,
  enableAIMetrics: true,
};

/**
 * Generate simplified AI-optimized resource hints for enhanced SEO performance
 * Reduced complexity while maintaining core AI search engine optimization
 */
export function generateAIPrefetchHints(
  config: Partial<AIPrefetchConfig> = {},
): AIPrefetchResult {
  const finalConfig = { ...defaultAIConfig, ...config };
  const resourceHints: ResourceHint[] = [];
  const performanceScripts: string[] = [];
  const aiOptimizations: string[] = [];

  try {
    // 1. Essential Core Web Vitals Optimization (Simplified)
    if (finalConfig.enableLCPOptimization) {
      // LCP optimization - only critical resources
      resourceHints.push(
        {
          rel: "preload",
          href: "/img/SlideshowHomepage/Slide-post-0.webp",
          as: "image",
          type: "image/webp",
          fetchpriority: "high",
        },
        {
          rel: "preload",
          href: "/css/homepage-styles.css",
          as: "style",
          fetchpriority: "high",
        },
      );
    }

    if (finalConfig.enableFIDOptimization) {
      // FID optimization - only essential interactive resources
      resourceHints.push({
        rel: "preload",
        href: "/scripts/ui/docs-search.js",
        as: "script",
        fetchpriority: "high",
      });
    }

    // 2. Essential DNS Prefetch (Simplified)
    if (finalConfig.enableAICrawlerHints) {
      resourceHints.push(
        { rel: "dns-prefetch", href: "https://discord.gg" },
        { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
        { rel: "dns-prefetch", href: "https://fonts.gstatic.com" },
      );
    }

    // 3. Essential Preconnect (Simplified)
    if (finalConfig.enableAICrawlerHints) {
      resourceHints.push(
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        { rel: "preconnect", href: "https://discord.gg" },
      );
    }

    // 4. Essential Prefetch (Simplified)
    resourceHints.push(
      { rel: "prefetch", href: "/docs" },
      { rel: "prefetch", href: "/discord" },
    );

    // 5. Essential Performance Scripts (Simplified)
    if (finalConfig.enablePerformanceMonitoring) {
      performanceScripts.push("performance-monitor.js");
    }

    // 6. Essential AI Optimizations (Simplified)
    if (finalConfig.enableAIMetrics) {
      aiOptimizations.push("ai-metrics-collection");
    }

    // AI prefetch hints generated successfully

    return {
      resourceHints,
      performanceScripts,
      aiOptimizations,
    };
  } catch (error) {
    console.error("❌ Error generating AI prefetch hints:", error);

    // Fallback: return minimal essential hints
    return {
      resourceHints: [
        { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
      ],
      performanceScripts: [],
      aiOptimizations: [],
    };
  }
}

/**
 * Generate page-specific AI optimizations (Simplified)
 */
export function generatePageSpecificAIOptimizations(
  pageType: "home" | "docs" | "post" | "discord" = "home",
): AIPrefetchResult {
  const baseResult = generateAIPrefetchHints();

  // Add page-specific optimizations (simplified)
  switch (pageType) {
    case "home":
      baseResult.resourceHints.push(
        { rel: "prefetch", href: "/docs" },
        { rel: "prefetch", href: "/discord" },
      );
      // Page-specific AI optimizations generated for home
      break;

    case "docs":
      // Use hardcoded paths for performance optimization (can be updated later)
      baseResult.resourceHints.push(
        { rel: "prefetch", href: "/docs/getting-started" },
        { rel: "prefetch", href: "/docs/immersion-philosophy" },
      );
      // Page-specific AI optimizations generated for docs
      break;

    case "post":
      baseResult.resourceHints.push({ rel: "prefetch", href: "/docs" });
      // Page-specific AI optimizations generated for post
      break;

    case "discord":
      baseResult.resourceHints.push({ rel: "prefetch", href: "/" });
      // Page-specific AI optimizations generated for discord
      break;
  }

  // AI-Optimized resource hints generated for ${pageType} page

  return baseResult;
}

/**
 * Generate AI-optimized scripts (Simplified)
 */
export function generateAIOptimizedScripts(
  pageType: "home" | "docs" | "post" | "discord" = "home",
): string[] {
  const scripts = ["performance-monitor.js"];

  // Add page-specific scripts (simplified)
  switch (pageType) {
    case "home":
      scripts.push("homepage-script.js");
      break;
    case "docs":
      scripts.push("docs-search.js");
      break;
    case "post":
      scripts.push("post-script.js");
      break;
    case "discord":
      scripts.push("discord-script.js");
      break;
  }

  // AI-Optimized scripts generated for ${pageType} page

  return scripts;
}

// Type declarations for global AI metrics collector
declare global {
  interface Window {
    aiMetricsCollector?: {
      recordMetrics: (metrics: any) => void;
    };
  }
}
