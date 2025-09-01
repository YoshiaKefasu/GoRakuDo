// ========== FALLBACK SYSTEM TYPE DEFINITIONS ==========
// Strict TypeScript mode compliant type definitions for fallback system
// Extends existing metadata-input.ts patterns (DRY principle)

import type { MetadataInput } from './metadata-input.js';

/**
 * Fallback metadata interface
 * Extends existing MetadataInput with fallback-specific fields
 */
export interface FallbackMetadata extends MetadataInput {
  readonly source: 'manual' | 'auto' | 'fallback';
  readonly confidence: number; // 0-1
  readonly extractionMethod: 'title' | 'content' | 'similar' | 'default';
  readonly fallbackApplied: readonly string[];
}

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
 * 3-dimensional quality evaluation (length, readability, relevance)
 */
export interface ExtractionQualityScore {
  readonly overall: number;        // 0-100
  readonly length: number;         // 0-100
  readonly readability: number;    // 0-100
  readonly relevance: number;      // 0-100
  readonly confidence: number;     // 0-1
}

/**
 * Fallback priority configuration
 * Defines priority levels for different fallback sources
 */
export interface FallbackPriorityConfig {
  readonly manual: number;         // 100 (highest)
  readonly auto: number;           // 80
  readonly fallback: number;       // 60
  readonly default: number;        // 40 (lowest)
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
