// ========== VALIDATION TYPE DEFINITIONS ==========
// Centralized validation types for SEO system
// Focuses on keyword validation and metadata validation

// ========== VALIDATION RESULT ==========
// Comprehensive validation result structure
export interface ValidationResult {
  isValid: boolean; // Overall validation result
  errors: ValidationError[]; // Critical validation errors
  warnings: ValidationWarning[]; // Non-critical validation warnings
  suggestions: ValidationSuggestion[]; // Improvement suggestions
  optimizedKeywords: string[]; // Optimized keyword list
  validationTimestamp: Date; // When validation was performed
  validatorVersion: string; // Validator version for tracking
}

// ========== VALIDATION ERROR ==========
// Critical validation error that prevents operation
export interface ValidationError {
  code: string; // Error code for programmatic handling
  message: string; // Human-readable error message
  field: string; // Field that caused the error
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM'; // Error severity level
  suggestion?: string; // Suggested fix
}

// ========== VALIDATION WARNING ==========
// Non-critical validation warning
export interface ValidationWarning {
  code: string; // Warning code
  message: string; // Human-readable warning message
  field: string; // Field that caused the warning
  impact: 'PERFORMANCE' | 'SEO' | 'USER_EXPERIENCE' | 'ACCESSIBILITY';
  recommendation?: string; // Recommended action
}

// ========== VALIDATION SUGGESTION ==========
// Improvement suggestion for better SEO
export interface ValidationSuggestion {
  code: string; // Suggestion code
  message: string; // Human-readable suggestion
  field: string; // Field for the suggestion
  priority: 'HIGH' | 'MEDIUM' | 'LOW'; // Suggestion priority
  expectedBenefit: string; // Expected benefit from implementation
}

// ========== KEYWORD VALIDATION ==========
// Keyword-specific validation types
export interface KeywordValidationResult extends ValidationResult {
  keywordCount: number; // Total number of keywords
  validKeywords: string[]; // Keywords that passed validation
  invalidKeywords: string[]; // Keywords that failed validation
  duplicateKeywords: string[]; // Duplicate keywords found
  keywordLengthStats: KeywordLengthStats; // Keyword length statistics
}

// ========== KEYWORD LENGTH STATS ==========
// Statistics about keyword lengths
export interface KeywordLengthStats {
  shortest: number; // Shortest keyword length
  longest: number; // Longest keyword length
  average: number; // Average keyword length
  tooShort: number; // Count of too short keywords
  tooLong: number; // Count of too long keywords
  optimal: number; // Count of optimal length keywords
}

// ========== KEYWORD VALIDATION RULES ==========
// Configurable validation rules for keywords
export interface KeywordValidationRules {
  minLength: number; // Minimum keyword length (default: 2)
  maxLength: number; // Maximum keyword length (default: 50)
  maxCount: number; // Maximum number of keywords (default: 10)
  allowDuplicates: boolean; // Allow duplicate keywords (default: false)
  allowedLanguages: string[]; // Allowed languages (default: ['ja', 'en', 'id'])
  forbiddenCharacters: string[]; // Characters not allowed in keywords
  requiredPatterns?: RegExp[]; // Required patterns for keywords
  forbiddenPatterns?: RegExp[]; // Forbidden patterns for keywords
}

// ========== LANGUAGE SUPPORT ==========
// Multi-language support for validation
export interface LanguageSupport {
  language: string; // Language code (ja, en, id)
  name: string; // Language name
  isSupported: boolean; // Whether language is supported
  validationRules: LanguageSpecificRules; // Language-specific rules
}

// ========== LANGUAGE SPECIFIC RULES ==========
// Language-specific validation rules
export interface LanguageSpecificRules {
  minLength: number; // Language-specific minimum length
  maxLength: number; // Language-specific maximum length
  characterSet: string[]; // Allowed characters for this language
  commonWords: string[]; // Common words to avoid
  stopWords: string[]; // Stop words for this language
}

// ========== METADATA VALIDATION ==========
// Metadata-specific validation types
export interface MetadataValidationResult extends ValidationResult {
  metaTagCount: number; // Number of meta tags
  structuredDataCount: number; // Number of structured data items
  socialMediaTags: SocialMediaValidation; // Social media tag validation
  performanceHints: PerformanceValidation; // Performance validation
  securityValidation: SecurityValidation; // Security validation
}

// ========== SOCIAL MEDIA VALIDATION ==========
// Social media meta tag validation
export interface SocialMediaValidation {
  openGraph: TagValidationResult; // Open Graph validation
  twitterCard: TagValidationResult; // Twitter Card validation
  linkedIn: TagValidationResult; // LinkedIn validation
  overall: TagValidationResult; // Overall social media validation
}

// ========== TAG VALIDATION RESULT ==========
// Individual tag validation result
export interface TagValidationResult {
  isValid: boolean; // Tag validity
  missingTags: string[]; // Missing required tags
  invalidTags: string[]; // Invalid tag values
  suggestions: string[]; // Improvement suggestions
}

// ========== PERFORMANCE VALIDATION ==========
// Performance-related validation
export interface PerformanceValidation {
  resourceHints: ResourceHintValidation; // Resource hint validation
  preloadValidation: PreloadValidation; // Preload validation
  prefetchValidation: PrefetchValidation; // Prefetch validation
  overall: PerformanceScore; // Overall performance score
}

// ========== RESOURCE HINT VALIDATION ==========
// Resource hint validation
export interface ResourceHintValidation {
  dnsPrefetch: string[]; // DNS prefetch domains
  preconnect: string[]; // Preconnect domains
  preload: string[]; // Preload resources
  prefetch: string[]; // Prefetch resources
  isValid: boolean; // Overall validity
}

// ========== PRELOAD VALIDATION ==========
// Preload resource validation
export interface PreloadValidation {
  criticalResources: string[]; // Critical resources for preload
  nonCriticalResources: string[]; // Non-critical resources
  isValid: boolean; // Preload validity
  suggestions: string[]; // Preload suggestions
}

// ========== PREFETCH VALIDATION ==========
// Prefetch resource validation
export interface PrefetchValidation {
  futureResources: string[]; // Resources for future use
  priority: 'HIGH' | 'MEDIUM' | 'LOW'; // Prefetch priority
  isValid: boolean; // Prefetch validity
  suggestions: string[]; // Prefetch suggestions
}

// ========== PERFORMANCE SCORE ==========
// Overall performance score
export interface PerformanceScore {
  score: number; // Performance score (0-100)
  grade: 'A' | 'B' | 'C' | 'D' | 'F'; // Performance grade
  factors: PerformanceFactor[]; // Performance factors
  recommendations: string[]; // Performance recommendations
}

// ========== PERFORMANCE FACTOR ==========
// Individual performance factor
export interface PerformanceFactor {
  name: string; // Factor name
  score: number; // Factor score (0-100)
  weight: number; // Factor weight in overall score
  description: string; // Factor description
  improvement: string; // Improvement suggestion
}

// ========== SECURITY VALIDATION ==========
// Security-related validation
export interface SecurityValidation {
  cspValidation: CSPValidation; // Content Security Policy validation
  hstsValidation: HSTSValidation; // HSTS validation
  referrerPolicy: ReferrerPolicyValidation; // Referrer Policy validation
  overall: SecurityScore; // Overall security score
}

// ========== CSP VALIDATION ==========
// Content Security Policy validation
export interface CSPValidation {
  isPresent: boolean; // Whether CSP is present
  isValid: boolean; // Whether CSP is valid
  directives: string[]; // CSP directives
  violations: string[]; // CSP violations
  recommendations: string[]; // CSP recommendations
}

// ========== HSTS VALIDATION ==========
// HTTP Strict Transport Security validation
export interface HSTSValidation {
  isPresent: boolean; // Whether HSTS is present
  isValid: boolean; // Whether HSTS is valid
  maxAge: number; // HSTS max-age value
  includeSubDomains: boolean; // Whether includeSubDomains is set
  preload: boolean; // Whether preload is set
}

// ========== REFERRER POLICY VALIDATION ==========
// Referrer Policy validation
export interface ReferrerPolicyValidation {
  isPresent: boolean; // Whether Referrer Policy is present
  isValid: boolean; // Whether policy is valid
  policy: string; // Referrer policy value
  recommendations: string[]; // Policy recommendations
}

// ========== SECURITY SCORE ==========
// Overall security score
export interface SecurityScore {
  score: number; // Security score (0-100)
  grade: 'A' | 'B' | 'C' | 'D' | 'F'; // Security grade
  factors: SecurityFactor[]; // Security factors
  recommendations: string[]; // Security recommendations
}

// ========== SECURITY FACTOR ==========
// Individual security factor
export interface SecurityFactor {
  name: string; // Factor name
  score: number; // Factor score (0-100)
  weight: number; // Factor weight in overall score
  description: string; // Factor description
  risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; // Risk level
  mitigation: string; // Risk mitigation strategy
}
