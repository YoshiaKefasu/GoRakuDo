// ========== INTEGRATED SEO TYPE DEFINITIONS ==========
// Complete SEO type definitions for the unified system
// Follows DRY principle by importing from new-seo-system
// Eliminates circular references and re-export issues (KISS principle)

// Import all SEO-related types from unified component props system
export type {
  // Base SEO types
  BaseSEOProps,
  HeadSEOProps,
  BasicSEOProps,
  MetaManagerProps,
  IntegratedSEOProps,
  GlobalSEOConfig,
  SafetyConfig,

  // Configuration types
  FaviconConfig,
  ResourceHints,
  SEOProperties,
  SocialMediaConfig,
  OpenGraphProps,
  TwitterCardProps,
  AdvancedMetaConfig,
  ViewportConfig,
  PerformanceConfig,
  ResourceConfig,
  SecurityConfig,
  AnalyticsConfig,

  // Enum and utility types
  ArticleType,
  LearningStage,
  SearchIntent,

  // Simple test types (moved from legacy seo.ts)
  SimpleHeadSEOProps,
  SimpleBasicSEOProps,
  SimpleMetaManagerProps,

  // Union types for flexibility
  TestHeadSEOProps,
  TestBasicSEOProps,
  TestMetaManagerProps
} from './new-seo-system/component-props';

// ========== DEFAULT CONFIGURATIONS ==========
// Centralized default values for SEO configurations (DRY principle)
export { DEFAULT_SEO_CONFIG } from './new-seo-system/component-props';
