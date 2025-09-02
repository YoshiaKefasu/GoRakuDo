// ========== VALIDATION TYPES FOR INTEGRATED SYSTEM ==========
// Consolidated validation types from fallback-system.ts and base-integration.ts
// Follows DRY principle by unifying validation patterns
// Uses Strict TypeScript mode throughout

import type { ValidationResult } from './base-types.js';

// ========== METADATA VALIDATION TYPES ==========
// Consolidated from fallback-system.ts

/**
 * Metadata gap detection interface
 * Identifies missing or incomplete metadata fields
 */
export interface MetadataGap {
  readonly field: keyof MetadataInput;
  readonly type: 'missing' | 'incomplete' | 'invalid';
  readonly priority: 'critical' | 'high' | 'medium' | 'low';
  readonly suggestedValue?: string;
  readonly fallbackSource?: 'title' | 'content' | 'similar' | 'default';
}

/**
 * Content extraction rule interface
 * Defines rules for extracting content from markdown
 */
export interface ContentExtractionRule {
  readonly pattern: RegExp;
  readonly priority: number;
  readonly maxLength: number;
  readonly qualityThreshold: number;
  readonly field: keyof MetadataInput;
}

/**
 * Extraction quality score interface
 * 3-dimensional quality evaluation for content extraction
 */
export interface ExtractionQualityScore {
  readonly overall: number; // 0-100
  readonly length: number; // 0-100
  readonly readability: number; // 0-100
  readonly relevance: number; // 0-100
  readonly confidence: number; // 0-1
}

/**
 * Content extraction result
 * Result of extracting content from markdown
 */
export interface ContentExtractionResult {
  readonly extractedContent: string;
  readonly qualityScore: ExtractionQualityScore;
  readonly extractionMethod: ContentExtractionRule['field'];
  readonly confidence: number;
}

// ========== FALLBACK SYSTEM TYPES ==========
// Consolidated fallback-specific types

/**
 * Fallback priority configuration
 * Defines priority levels for different fallback sources
 */
export interface FallbackPriorityConfig {
  readonly manual: number; // 100 (highest)
  readonly auto: number; // 80
  readonly fallback: number; // 60
  readonly default: number; // 40 (lowest)
}

/**
 * Stopwords configuration
 * Multi-language stopwords for keyword extraction
 */
export interface StopwordsConfig {
  readonly language: 'id' | 'ja' | 'en';
  readonly description: string;
  readonly words: readonly string[];
  readonly version: string;
}

/**
 * Fallback system configuration
 * Configurable options for fallback behavior
 */
export interface FallbackSystemConfig {
  readonly enableAutoExtraction: boolean;
  readonly enableKeywordSuggestions: boolean;
  readonly qualityThresholds: {
    readonly minLength: number;
    readonly maxLength: number;
    readonly minOverall: number;
  };
  readonly extractionRules: readonly ContentExtractionRule[];
  readonly priorityConfig: FallbackPriorityConfig;
}

// ========== METADATA INPUT TYPES ==========
// Consolidated metadata input types (forward declaration for MetadataInput)

/**
 * Base metadata input interface
 * Common fields for all metadata structures
 */
export interface MetadataInput {
  readonly title?: string;
  readonly description?: string;
  readonly keywords?: readonly string[];
  readonly author?: string;
  readonly date?: string;
  readonly category?: string;
  readonly tags?: readonly string[];
  readonly excerpt?: string;
  readonly image?: string;
  readonly url?: string;
  readonly language?: string;
}

/**
 * Fallback metadata interface
 * Extends base metadata with fallback-specific fields
 */
export interface FallbackMetadata extends MetadataInput {
  readonly source: 'manual' | 'auto' | 'fallback';
  readonly confidence: number; // 0-1
  readonly extractionMethod: 'title' | 'content' | 'similar' | 'default';
  readonly fallbackApplied: readonly string[];
  readonly publishedDate?: string; // ISO string format
  readonly readTime?: number; // estimated reading time in minutes
  readonly difficulty?: 'beginner' | 'intermediate' | 'advanced'; // content difficulty level
  readonly featured?: boolean; // whether content is featured
  readonly contentType?: string; // type of content (tutorial, article, guide, etc.)
}

/**
 * Fallback result interface
 * Complete result of fallback processing
 */
export interface FallbackResult {
  readonly metadata: FallbackMetadata;
  readonly gaps: readonly MetadataGap[];
  readonly needsFallback: boolean;
  readonly fallbackApplied: readonly string[];
  readonly qualityScore: ExtractionQualityScore;
}

/**
 * Metadata validation result interface
 * Provides detailed validation feedback for user input
 */
export interface MetadataValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly import('./base-types.js').ValidationError[];
  readonly warnings: readonly import('./base-types.js').ValidationWarning[];
}

/**
 * Metadata reading result interface
 * Result of reading metadata from .md files
 */
export interface MetadataReadResult {
  readonly success: boolean;
  readonly metadata?: MetadataInput;
  readonly error?: string;
  readonly filePath: string;
  readonly frontmatter?: Record<string, unknown>;
}

/**
 * Keyword management interface
 * Enhanced keyword functionality for metadata input
 */
export interface KeywordData {
  readonly value: string;
  readonly priority: number; // 1-5 scale
  readonly relatedKeywords: readonly string[];
  readonly usageCount: number;
}

/**
 * Metadata input form state interface
 * Manages form state and validation during input
 */
export interface MetadataInputFormState {
  readonly metadata: MetadataInput;
  readonly validation: MetadataValidationResult;
  readonly isDirty: boolean;
  readonly isSubmitting: boolean;
  readonly lastSaved?: Date;
}

/**
 * Metadata input configuration interface
 * Configurable options for metadata input system
 */
export interface MetadataInputConfig {
  readonly maxTitleLength: number;
  readonly maxDescriptionLength: number;
  readonly maxTagsCount: number;
  readonly maxTagLength: number;
  readonly autoSaveInterval: number; // milliseconds
  readonly validationRules: readonly ValidationRule[];
}

/**
 * Advanced optimization configuration interface
 * Configuration for advanced SEO optimization features
 */
export interface AdvancedOptimizationConfig {
  readonly structuredData: {
    readonly enabled: boolean;
    readonly schemas: readonly string[];
    readonly autoGeneration: boolean;
  };
  readonly qualityMonitoring: {
    readonly enabled: boolean;
    readonly realTime: boolean;
    readonly autoDetection: boolean;
  };
  readonly algorithmEnhancement: {
    readonly enabled: boolean;
    readonly machineLearning: boolean;
    readonly userBehavior: boolean;
  };
}

/**
 * Advanced optimization result interface
 * Result of advanced optimization operations
 */
export interface AdvancedOptimizationResult {
  readonly success: boolean;
  readonly quality: number; // 0-100
  readonly enhancement: number; // 0-100
  readonly issues: readonly string[];
  readonly recommendations: readonly string[];
}

/**
 * Structured data configuration interface
 * Configuration for structured data generation
 */
export interface StructuredDataConfig {
  readonly articleSchema: boolean;
  readonly organizationSchema: boolean;
  readonly websiteSchema: boolean;
  readonly breadcrumbSchema: boolean;
  readonly autoGeneration: boolean;
}

/**
 * Structured data result interface
 * Result of structured data generation
 */
export interface StructuredDataResult {
  readonly success: boolean;
  readonly schemas: readonly string[];
  readonly quality: number; // 0-100
  readonly validation: readonly string[];
}

/**
 * Quality gate configuration interface
 * Configuration for quality gates
 */
export interface QualityGateConfig {
  readonly phase5: {
    readonly minQualityScore: number;
    readonly requiredFeatures: readonly string[];
    readonly testCoverage: number;
  };
  readonly phase6: {
    readonly minQualityScore: number;
    readonly requiredFeatures: readonly string[];
    readonly testCoverage: number;
  };
}

/**
 * Quality gate result interface
 * Result of quality gate evaluation
 */
export interface QualityGateResult {
  readonly phase: 'phase5' | 'phase6';
  readonly passed: boolean;
  readonly score: number;
  readonly details: {
    readonly qualityScore: number;
    readonly testCoverage: number;
    readonly featureCompleteness: number;
    readonly issues: readonly string[];
  };
}

/**
 * Test cleanup configuration interface
 * Configuration for test cleanup operations
 */
export interface TestCleanupConfig {
  readonly enabled: boolean;
  readonly autoCleanup: boolean;
  readonly redundantFileDetection: boolean;
  readonly duplicateTestMerging: boolean;
  readonly cleanupPatterns: readonly string[];
}

/**
 * Test cleanup result interface
 * Result of test cleanup operations
 */
export interface TestCleanupResult {
  readonly success: boolean;
  readonly cleanedFiles: readonly string[];
  readonly removedArtifacts: readonly string[];
  readonly mergedTests: readonly string[];
  readonly spaceSaved: number; // bytes
}

/**
 * Redundant file information interface
 * Information about redundant files
 */
export interface RedundantFileInfo {
  readonly path: string;
  readonly type: 'test' | 'artifact' | 'temporary' | 'duplicate';
  readonly size: number; // bytes
  readonly lastModified: string;
  readonly reason: string;
}

// ========== ENHANCED VALIDATION TYPES ==========
// Additional validation types for the integrated system

/**
 * Validation rule interface
 * Generic validation rule for any configuration
 */
export interface ValidationRule<T = unknown> {
  readonly validator: (value: T) => boolean;
  readonly message: string;
  readonly isRequired: boolean;
  readonly field?: string;
}

/**
 * Validation schema interface
 * Collection of validation rules for a configuration object
 */
export interface ValidationSchema<T extends Record<string, unknown> = Record<string, unknown>> {
  readonly rules: readonly ValidationRule<T>[];
  readonly validateAll?: boolean;
}

/**
 * Validation pipeline interface
 * Sequence of validation operations
 */
export interface ValidationPipeline<T = unknown> {
  readonly steps: readonly ValidationRule<T>[];
  readonly stopOnFirstError?: boolean;
}

// ========== QUALITY VALIDATION TYPES ==========
// Types for quality measurement and validation

/**
 * Quality validation result
 * Result of quality validation operations
 */
export interface QualityValidationResult extends ValidationResult {
  readonly score: number; // 0-100
  readonly factors: readonly string[];
  readonly recommendations: readonly string[];
}

/**
 * Performance validation interface
 * Validates performance aspects of the system
 */
export interface PerformanceValidation {
  readonly responseTime: number;
  readonly throughput: number;
  readonly memoryUsage: number;
  readonly isAcceptable: boolean;
  readonly bottlenecks: readonly string[];
}

// ========== TYPE GUARDS ==========
// Runtime type checking functions following KISS principle

/**
 * Type guard for MetadataGap
 */
export function isMetadataGap(obj: unknown): obj is MetadataGap {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'field' in obj &&
    typeof (obj as MetadataGap).field === 'string' &&
    'type' in obj &&
    ['missing', 'incomplete', 'invalid'].includes((obj as MetadataGap).type) &&
    'priority' in obj &&
    ['critical', 'high', 'medium', 'low'].includes((obj as MetadataGap).priority)
  );
}

/**
 * Type guard for ContentExtractionRule
 */
export function isContentExtractionRule(obj: unknown): obj is ContentExtractionRule {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'pattern' in obj &&
    (obj as ContentExtractionRule).pattern instanceof RegExp &&
    'priority' in obj &&
    typeof (obj as ContentExtractionRule).priority === 'number' &&
    'maxLength' in obj &&
    typeof (obj as ContentExtractionRule).maxLength === 'number' &&
    'qualityThreshold' in obj &&
    typeof (obj as ContentExtractionRule).qualityThreshold === 'number' &&
    'field' in obj &&
    typeof (obj as ContentExtractionRule).field === 'string'
  );
}

/**
 * Type guard for ExtractionQualityScore
 */
export function isExtractionQualityScore(obj: unknown): obj is ExtractionQualityScore {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'overall' in obj &&
    typeof (obj as ExtractionQualityScore).overall === 'number' &&
    'length' in obj &&
    typeof (obj as ExtractionQualityScore).length === 'number' &&
    'readability' in obj &&
    typeof (obj as ExtractionQualityScore).readability === 'number' &&
    'relevance' in obj &&
    typeof (obj as ExtractionQualityScore).relevance === 'number' &&
    'confidence' in obj &&
    typeof (obj as ExtractionQualityScore).confidence === 'number'
  );
}

// ========== DEFAULT CONFIGURATIONS ==========
// Centralized defaults following DRY principle

export const DEFAULT_EXTRACTION_RULES: readonly ContentExtractionRule[] = [
  {
    pattern: /^#\s+(.+)$/m,
    priority: 100,
    maxLength: 200,
    qualityThreshold: 70,
    field: 'title',
  },
  {
    pattern: /^>\s*(.+)$/m,
    priority: 80,
    maxLength: 300,
    qualityThreshold: 60,
    field: 'excerpt',
  },
] as const;

export const DEFAULT_PRIORITY_CONFIG: FallbackPriorityConfig = {
  manual: 100,
  auto: 80,
  fallback: 60,
  default: 40,
} as const;

export const DEFAULT_QUALITY_THRESHOLDS = {
  minLength: 50,
  maxLength: 500,
  minOverall: 70,
} as const;

export const DEFAULT_FALLBACK_SYSTEM_CONFIG: FallbackSystemConfig = {
  enableAutoExtraction: true,
  enableKeywordSuggestions: true,
  qualityThresholds: DEFAULT_QUALITY_THRESHOLDS,
  extractionRules: DEFAULT_EXTRACTION_RULES,
  priorityConfig: DEFAULT_PRIORITY_CONFIG,
} as const;

// ========== TYPE ALIASES FOR COMPATIBILITY ==========
// Backward compatibility aliases

export type MetadataGapType = MetadataGap;
export type ContentExtractionRuleType = ContentExtractionRule;
export type ExtractionQualityScoreType = ExtractionQualityScore;
export type FallbackPriorityConfigType = FallbackPriorityConfig;
export type StopwordsConfigType = StopwordsConfig;
export type FallbackSystemConfigType = FallbackSystemConfig;
export type MetadataInputType = MetadataInput;
export type FallbackMetadataType = FallbackMetadata;
export type FallbackResultType = FallbackResult;
export type ValidationRuleType<T = unknown> = ValidationRule<T>;
export type ValidationSchemaType<T extends Record<string, unknown> = Record<string, unknown>> = ValidationSchema<T>;
export type ValidationPipelineType<T = unknown> = ValidationPipeline<T>;
export type QualityValidationResultType = QualityValidationResult;
export type PerformanceValidationType = PerformanceValidation;
