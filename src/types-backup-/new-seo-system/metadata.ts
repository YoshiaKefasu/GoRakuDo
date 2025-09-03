// ========== METADATA TYPE DEFINITIONS ==========
// Centralized metadata types for SEO system
// Focuses on meta tag generation, structured data, and optimization

// ========== META GENERATION RESULT ==========
// Comprehensive result of metadata generation
export interface MetaGenerationResult {
  metaTags: MetaTag[]; // Generated meta tags
  structuredData: StructuredData[]; // Generated structured data
  performanceHints: PerformanceHint[]; // Performance optimization hints
  securityHeaders: SecurityHeader[]; // Security headers
  generationTimestamp: Date; // When generation was performed
  generatorVersion: string; // Generator version for tracking
  validationResult: import('./validation').ValidationResult; // Validation result of generated metadata
}

// ========== META TAG ==========
// Individual meta tag definition
export interface MetaTag {
  name: string; // Meta tag name
  content: string; // Meta tag content
  property?: string; // Property attribute (for Open Graph)
  httpEquiv?: string; // HTTP-equiv attribute
  charset?: string; // Charset attribute
  isRequired: boolean; // Whether this tag is required
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'; // Tag priority
  category: MetaTagCategory; // Tag category
}

// ========== META TAG CATEGORY ==========
// Categories of meta tags
export type MetaTagCategory =
  | 'BASIC_SEO' // Basic SEO tags (title, description)
  | 'SOCIAL_MEDIA' // Social media tags (Open Graph, Twitter)
  | 'PERFORMANCE' // Performance tags (resource hints)
  | 'SECURITY' // Security tags (CSP, HSTS)
  | 'ACCESSIBILITY' // Accessibility tags (viewport, theme-color)
  | 'ANALYTICS' // Analytics tags (Google Analytics, etc.)
  | 'CUSTOM'; // Custom meta tags

// ========== STRUCTURED DATA ==========
// Structured data for search engines
export interface StructuredData {
  type: string; // Schema.org type
  data: Record<string, any>; // Structured data content
  format: 'JSON-LD' | 'Microdata' | 'RDFa'; // Data format
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'; // Data priority
  isRequired: boolean; // Whether this data is required
  validationUrl?: string; // URL for validation
}

// ========== PERFORMANCE HINT ==========
// Performance optimization hint
export interface PerformanceHint {
  hintType: 'preload' | 'prefetch' | 'dns-prefetch' | 'preconnect';
  href: string; // Resource URL
  as?: string; // Resource type
  crossorigin?: string; // Cross-origin setting
  mimeType?: string; // MIME type
  priority: 'HIGH' | 'MEDIUM' | 'LOW'; // Hint priority
  reason: string; // Reason for this hint
}

// ========== SECURITY HEADER ==========
// Security header configuration
export interface SecurityHeader {
  name: string; // Header name
  value: string; // Header value
  isRequired: boolean; // Whether this header is required
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'; // Header priority
  description: string; // Header description
  riskMitigation: string; // Risk mitigation provided
}

// ========== META TAG GENERATOR ==========
// Interface for meta tag generation
export interface MetaTagGenerator {
  generateBasicTags(
    props: import('./component-props').BasicSEOProps
  ): MetaTag[];
  generateSocialMediaTags(
    props: import('./component-props').BasicSEOProps
  ): MetaTag[];
  generatePerformanceTags(
    props: import('./component-props').MetaManagerProps
  ): PerformanceHint[];
  generateSecurityTags(
    props: import('./component-props').MetaManagerProps
  ): SecurityHeader[];
  generateStructuredData(
    props: import('./component-props').BasicSEOProps
  ): StructuredData[];
  validateGeneratedTags(
    tags: MetaTag[]
  ): import('./validation').ValidationResult;
}

// ========== BASIC META TAG GENERATION ==========
// Basic meta tag generation configuration
export interface BasicMetaTagConfig {
  title: string; // Page title
  description: string; // Page description
  keywords: string[]; // Page keywords
  author?: string; // Page author
  robots?: string; // Robots directive
  language: string; // Page language
  charset: string; // Character encoding
  viewport: ViewportConfig; // Viewport configuration
  themeColor?: string; // Theme color
  colorScheme?: 'light' | 'dark' | 'auto'; // Color scheme
}

// ========== VIEWPORT CONFIG ==========
// Viewport meta tag configuration
export interface ViewportConfig {
  width: string; // Viewport width
  initialScale: number; // Initial scale
  minimumScale: number; // Minimum scale
  maximumScale: number; // Maximum scale
  userScalable: boolean; // User scalable
  viewportFit?: 'auto' | 'contain' | 'cover'; // Viewport fit
}

// ========== SOCIAL MEDIA META TAG GENERATION ==========
// Social media meta tag generation configuration
export interface SocialMediaMetaConfig {
  openGraph: OpenGraphConfig; // Open Graph configuration
  twitterCard: TwitterCardConfig; // Twitter Card configuration
  linkedIn?: LinkedInConfig; // LinkedIn configuration
  pinterest?: PinterestConfig; // Pinterest configuration
}

// ========== OPEN GRAPH CONFIG ==========
// Open Graph meta tag configuration
export interface OpenGraphConfig {
  title: string; // Open Graph title
  description: string; // Open Graph description
  image: string; // Open Graph image
  url: string; // Open Graph URL
  type: string; // Open Graph type
  siteName?: string; // Site name
  locale?: string; // Locale
  localeAlternate?: string[]; // Alternate locales
}

// ========== TWITTER CARD CONFIG ==========
// Twitter Card meta tag configuration
export interface TwitterCardConfig {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  title: string; // Twitter Card title
  description: string; // Twitter Card description
  image: string; // Twitter Card image
  creator?: string; // Twitter creator
  site?: string; // Twitter site
  player?: TwitterPlayerConfig; // Twitter Player configuration
}

// ========== TWITTER PLAYER CONFIG ==========
// Twitter Player configuration
export interface TwitterPlayerConfig {
  width: number; // Player width
  height: number; // Player height
  stream?: string; // Stream URL
  streamContentType?: string; // Stream content type
}

// ========== LINKEDIN CONFIG ==========
// LinkedIn meta tag configuration
export interface LinkedInConfig {
  title: string; // LinkedIn title
  description: string; // LinkedIn description
  image: string; // LinkedIn image
  url: string; // LinkedIn URL
  type: string; // LinkedIn type
}

// ========== PINTEREST CONFIG ==========
// Pinterest meta tag configuration
export interface PinterestConfig {
  title: string; // Pinterest title
  description: string; // Pinterest description
  image: string; // Pinterest image
  url: string; // Pinterest URL
}

// ========== STRUCTURED DATA GENERATION ==========
// Structured data generation configuration
export interface StructuredDataConfig {
  organization: OrganizationData; // Organization data
  website: WebsiteData; // Website data
  page: PageData; // Page-specific data
  breadcrumb?: BreadcrumbData[]; // Breadcrumb data
  article?: ArticleData; // Article data
  faq?: FAQData[]; // FAQ data
  review?: ReviewData[]; // Review data
}

// ========== ORGANIZATION DATA ==========
// Organization structured data
export interface OrganizationData {
  name: string; // Organization name
  url: string; // Organization URL
  logo: string; // Organization logo
  description?: string; // Organization description
  sameAs?: string[]; // Social media profiles
  contactPoint?: ContactPointData; // Contact information
}

// ========== WEBSITE DATA ==========
// Website structured data
export interface WebsiteData {
  name: string; // Website name
  url: string; // Website URL
  description?: string; // Website description
  inLanguage: string; // Website language
  publisher: OrganizationData; // Publisher information
}

// ========== PAGE DATA ==========
// Page-specific structured data
export interface PageData {
  name: string; // Page name
  url: string; // Page URL
  description?: string; // Page description
  inLanguage: string; // Page language
  isPartOf: WebsiteData; // Website information
  breadcrumb?: BreadcrumbData[]; // Breadcrumb information
}

// ========== BREADCRUMB DATA ==========
// Breadcrumb structured data
export interface BreadcrumbData {
  name: string; // Breadcrumb name
  url: string; // Breadcrumb URL
  position: number; // Breadcrumb position
}

// ========== ARTICLE DATA ==========
// Article structured data
export interface ArticleData {
  headline: string; // Article headline
  description: string; // Article description
  image: string; // Article image
  author: PersonData; // Article author
  publisher: OrganizationData; // Article publisher
  datePublished: string; // Publication date
  dateModified?: string; // Modification date
  articleSection?: string; // Article section
  keywords?: string[]; // Article keywords
}

// ========== PERSON DATA ==========
// Person structured data
export interface PersonData {
  name: string; // Person name
  url?: string; // Person URL
  image?: string; // Person image
  sameAs?: string[]; // Social media profiles
}

// ========== CONTACT POINT DATA ==========
// Contact point structured data
export interface ContactPointData {
  telephone: string; // Contact telephone
  contactType: string; // Contact type
  areaServed?: string; // Area served
  availableLanguage?: string[]; // Available languages
}

// ========== FAQ DATA ==========
// FAQ structured data
export interface FAQData {
  question: string; // FAQ question
  answer: string; // FAQ answer
}

// ========== REVIEW DATA ==========
// Review structured data
export interface ReviewData {
  author: PersonData; // Review author
  reviewRating: ReviewRatingData; // Review rating
  reviewBody: string; // Review body
  datePublished: string; // Review date
}

// ========== REVIEW RATING DATA ==========
// Review rating structured data
export interface ReviewRatingData {
  ratingValue: number; // Rating value
  bestRating: number; // Best rating
  worstRating: number; // Worst rating
}

// ========== META TAG VALIDATION ==========
// Meta tag validation interface
export interface MetaTagValidator {
  validateBasicTags(tags: MetaTag[]): import('./validation').ValidationResult;
  validateSocialMediaTags(
    tags: MetaTag[]
  ): import('./validation').ValidationResult;
  validatePerformanceTags(
    hints: PerformanceHint[]
  ): import('./validation').ValidationResult;
  validateSecurityTags(
    headers: SecurityHeader[]
  ): import('./validation').ValidationResult;
  validateStructuredData(
    data: StructuredData[]
  ): import('./validation').ValidationResult;
  generateValidationReport(result: MetaGenerationResult): ValidationReport;
}

// ========== VALIDATION REPORT ==========
// Comprehensive validation report
export interface ValidationReport {
  summary: ValidationSummary; // Validation summary
  details: ValidationDetail[]; // Detailed validation results
  recommendations: string[]; // Improvement recommendations
  score: number; // Overall validation score
  grade: 'A' | 'B' | 'C' | 'D' | 'F'; // Validation grade
  timestamp: Date; // Report generation timestamp
}

// ========== VALIDATION SUMMARY ==========
// Validation summary information
export interface ValidationSummary {
  totalTags: number; // Total number of tags
  validTags: number; // Number of valid tags
  invalidTags: number; // Number of invalid tags
  warnings: number; // Number of warnings
  errors: number; // Number of errors
  criticalIssues: number; // Number of critical issues
}

// ========== VALIDATION DETAIL ==========
// Detailed validation result
export interface ValidationDetail {
  category: MetaTagCategory; // Tag category
  tagCount: number; // Number of tags in category
  validCount: number; // Number of valid tags
  invalidCount: number; // Number of invalid tags
  issues: ValidationIssue[]; // Specific issues found
  score: number; // Category score
}

// ========== VALIDATION ISSUE ==========
// Specific validation issue
export interface ValidationIssue {
  type: 'ERROR' | 'WARNING' | 'SUGGESTION'; // Issue type
  message: string; // Issue message
  tagName?: string; // Affected tag name
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; // Issue severity
  suggestion?: string; // Suggested fix
}
