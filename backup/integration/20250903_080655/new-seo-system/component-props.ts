// ========== COMPONENT PROPS TYPE DEFINITIONS ==========
// Centralized configuration for all SEO component properties
// Easy to modify for future component additions or property changes

// ========== BASE SEO PROPS ==========
// Common properties shared by multiple components (DRY principle)
export interface BaseSEOProps {
  title: string;           // Page title (like a book title)
  description: string;     // Page description (like a book summary)
  lang?: string;           // Language code (default: 'ja')
}

// ========== HEAD SEO PROPS ==========
// Basic HTML head elements with favicon and resource hints
export interface HeadSEOProps extends BaseSEOProps {
  canonicalUrl?: string;   // Canonical URL for SEO
  favicon?: FaviconConfig; // Favicon configuration
  
  // Resource hints for performance optimization
  resourceHints?: ResourceHints;
}

// ========== FAVICON CONFIGURATION ==========
// Centralized favicon configuration to avoid duplication (DRY principle)
export interface FaviconConfig {
  ico?: string;            // Traditional .ico file
  svg?: string;            // Modern SVG favicon
  png?: string;            // PNG favicon for older browsers
  appleTouchIcon?: string; // Apple touch icon
}

// ========== RESOURCE HINTS ==========
// Performance optimization hints for browsers
export interface ResourceHints {
  preload?: string[];      // Critical resources to preload
  prefetch?: string[];     // Resources to prefetch
  dnsPrefetch?: string[];  // DNS prefetch for external domains
}

// ========== BASIC SEO PROPS ==========
// Extends HeadSEOProps to avoid duplication (DRY principle)
export interface BasicSEOProps extends HeadSEOProps {
  // Required SEO properties
  primaryKeywords: string[];  // Main keywords for the page
  
  // Optional SEO properties
  longTailKeywords?: string[];    // Long-tail keywords
  articleKeywords?: string[];     // Article-specific keywords
  categoryKeywords?: string[];    // Category-specific keywords
  
  // SEO classification properties
  seoProperties?: SEOProperties;
  
  // Social media integration
  socialMedia?: SocialMediaConfig;
}

// ========== SEO PROPERTIES ==========
// Centralized SEO classification system
export interface SEOProperties {
  articleType?: ArticleType;      // Type of content
  learningStage?: LearningStage;  // Target audience level
  searchIntent?: SearchIntent;    // User search intent
}

// ========== SEO CLASSIFICATION TYPES ==========
// Simple, focused type definitions (KISS principle)
export type ArticleType = 'tutorial' | 'guide' | 'reference' | 'news';
export type LearningStage = 'beginner' | 'intermediate' | 'advanced';
export type SearchIntent = 'informational' | 'navigational' | 'transactional';

// ========== SOCIAL MEDIA CONFIG ==========
// Social media meta tag configuration
export interface SocialMediaConfig {
  openGraph?: OpenGraphProps;     // Facebook Open Graph
  twitterCard?: TwitterCardProps; // Twitter Card
}

// ========== OPEN GRAPH PROPS ==========
// Facebook Open Graph meta tags
export interface OpenGraphProps {
  title?: string;           // Open Graph title
  description?: string;     // Open Graph description
  image?: string;           // Open Graph image
  url?: string;             // Open Graph URL
  type?: string;            // Open Graph type
}

// ========== TWITTER CARD PROPS ==========
// Twitter Card meta tags
export interface TwitterCardProps {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  title?: string;           // Twitter Card title
  description?: string;     // Twitter Card description
  image?: string;           // Twitter Card image
  creator?: string;         // Twitter creator
  site?: string;            // Twitter site
}

// ========== META MANAGER PROPS ==========
// Advanced metadata management with simple, clear structure (KISS principle)
export interface MetaManagerProps {
  // Advanced metadata settings
  advancedMeta?: AdvancedMetaConfig;
  
  // Performance optimization
  performanceOptimization?: PerformanceConfig;
  
  // Security headers
  securityHeaders?: SecurityConfig;
  
  // Analytics integration
  analytics?: AnalyticsConfig;
}

// ========== ADVANCED META CONFIG ==========
// Simple, focused configuration (KISS principle)
export interface AdvancedMetaConfig {
  robots?: string;                    // Robots meta tag
  themeColor?: string;                // Theme color
  colorScheme?: 'light' | 'dark' | 'auto'; // Color scheme
  viewport?: ViewportConfig;          // Viewport configuration
}

// ========== VIEWPORT CONFIG ==========
// Viewport meta tag configuration
export interface ViewportConfig {
  width?: string;           // Viewport width
  initialScale?: number;    // Initial scale
  minimumScale?: number;    // Minimum scale
  maximumScale?: number;    // Maximum scale
  userScalable?: boolean;   // User scalable
}

// ========== PERFORMANCE CONFIG ==========
// Performance optimization settings
export interface PerformanceConfig {
  preload?: ResourceConfig[];         // Critical resources
  prefetch?: ResourceConfig[];        // Future resources
  dnsPrefetch?: string[];            // DNS prefetch domains
  preconnect?: string[];             // Preconnect domains
}

// ========== RESOURCE CONFIG ==========
// Resource configuration for performance optimization
export interface ResourceConfig {
  href: string;             // Resource URL
  as?: string;              // Resource type
  crossorigin?: string;     // Cross-origin setting
  type?: string;            // MIME type
}

// ========== SECURITY CONFIG ==========
// Security header configuration
export interface SecurityConfig {
  csp?: string;                       // Content Security Policy
  hsts?: string;                      // HTTP Strict Transport Security
  referrerPolicy?: string;            // Referrer Policy
  permissionsPolicy?: string;         // Permissions Policy
}

// ========== ANALYTICS CONFIG ==========
// Analytics integration configuration
export interface AnalyticsConfig {
  googleAnalytics?: string;           // Google Analytics ID
  googleTagManager?: string;          // Google Tag Manager ID
  facebookPixel?: string;             // Facebook Pixel ID
  customScripts?: string[];           // Custom analytics scripts
}

// ========== INTEGRATED SEO PROPS ==========
// Combines all three components with clear responsibility separation
export interface IntegratedSEOProps {
  // Component-specific configurations
  headSEO?: HeadSEOProps;      // Basic HTML head elements
  basicSEO?: BasicSEOProps;    // SEO-specific functionality
  metaManager?: MetaManagerProps; // Advanced metadata management
  
  // Global configuration
  globalConfig?: GlobalSEOConfig;
  
  // Safety configuration
  safetyConfig?: SafetyConfig;
}

// ========== GLOBAL SEO CONFIG ==========
// Global settings that apply to all components
export interface GlobalSEOConfig {
  siteName: string;             // Site name for all components
  defaultLanguage: string;      // Default language (default: 'ja')
  defaultTheme: 'light' | 'dark' | 'auto'; // Default theme
  enableDebugMode?: boolean;    // Development debug mode
}

// ========== SAFETY CONFIG ==========
// Safety configuration for all components
export interface SafetyConfig {
  enableSafetyChecks: boolean;  // Enable runtime safety checks
  strictMode: boolean;          // Enable strict safety mode
  autoRollback: boolean;        // Enable automatic rollback on critical issues
}
