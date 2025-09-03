// ========== SEO TYPE DEFINITIONS ==========
// Unified SEO type definitions for the integrated system
// Follows DRY principle by importing from new-seo-system
// Eliminates circular references and re-export issues

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
  SearchIntent
} from './new-seo-system/component-props';

// ========== SIMPLIFIED TYPES FOR TESTING ==========
// Lightweight versions for testing and development
// These provide minimal interfaces for testing purposes

export interface SimpleHeadSEOProps {
  readonly title: string;
  readonly description: string;
  readonly lang?: string;
  readonly canonicalUrl?: string;
  readonly favicon?: {
    readonly ico?: string;
    readonly svg?: string;
  };
}

export interface SimpleBasicSEOProps {
  readonly keywords?: string;
  readonly canonicalUrl?: string;
  readonly structuredData?: Record<string, unknown>;
  readonly ogImage?: string;
  readonly twitterCard?: string;
}

export interface SimpleMetaManagerProps {
  readonly enableCSP?: boolean;
  readonly enableHSTS?: boolean;
  readonly preloadCritical?: boolean;
}

// ========== UNION TYPES FOR FLEXIBILITY ==========
// Union types for testing and development flexibility
// Allows both full and simplified implementations

export type TestHeadSEOProps = import('./new-seo-system/component-props').HeadSEOProps | SimpleHeadSEOProps;
export type TestBasicSEOProps = import('./new-seo-system/component-props').BasicSEOProps | SimpleBasicSEOProps;
export type TestMetaManagerProps = import('./new-seo-system/component-props').MetaManagerProps | SimpleMetaManagerProps;

// ========== DEFAULT CONFIGURATIONS ==========
// Centralized default values for SEO configurations

export const DEFAULT_SEO_CONFIG = {
  title: '',
  description: '',
  lang: 'en',
  canonicalUrl: '',
  keywords: '',
  ogImage: '',
  twitterCard: '',
  enableCSP: false,
  enableHSTS: false,
  preloadCritical: false
} as const;
