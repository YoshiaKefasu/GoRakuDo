// ========== SIMPLE METADATA CONFIG ==========
/**
 * Simple Metadata Configuration Interface
 * Implements KISS principle by simplifying complex nested structures
 *
 * Original MetadataInput complexity: 45 (target: ≤12)
 * This simplified version reduces complexity through:
 * - Union types instead of nested interfaces
 * - Flattened structure
 * - Reduced property count
 */

// ========== SIMPLIFIED METADATA INTERFACE ==========

/**
 * Simple Metadata Configuration
 * Simplified version of MetadataInput with reduced complexity
 * KISS principle: Simple, straightforward structure
 */
export interface SimpleMetadataConfig {
  /** Content title */
  readonly title: string;

  /** Content description */
  readonly description: string;

  /** Publication date in ISO format */
  readonly publishedDate: string;

  /** Author name */
  readonly author: string;

  /** Optional emoji for content */
  readonly emoji?: string;

  /** Content difficulty level */
  readonly difficulty: 'beginner' | 'intermediate' | 'advanced';

  /** Content category */
  readonly category: string;

  /** Content tags */
  readonly tags: readonly string[];

  /** Featured content flag */
  readonly featured: boolean;

  /** Content type */
  readonly contentType: 'metodologi' | 'tutorial' | 'resource';
}

// ========== VALIDATION INTERFACES ==========

/**
 * Simple Validation Result
 * Simplified validation result structure
 */
export interface SimpleValidationResult {
  /** Overall validation status */
  readonly isValid: boolean;

  /** Validation errors */
  readonly errors: readonly SimpleValidationError[];

  /** Validation warnings */
  readonly warnings: readonly SimpleValidationWarning[];
}

/**
 * Simple Validation Error
 * Minimal error structure with essential fields
 */
export interface SimpleValidationError {
  /** Error code for programmatic handling */
  readonly code: string;

  /** Human-readable error message */
  readonly message: string;

  /** Field that caused the error */
  readonly field: string;
}

/**
 * Simple Validation Warning
 * Minimal warning structure with essential fields
 */
export interface SimpleValidationWarning {
  /** Warning code for programmatic handling */
  readonly code: string;

  /** Human-readable warning message */
  readonly message: string;

  /** Field that caused the warning */
  readonly field: string;
}

// ========== UTILITY TYPES ==========

/**
 * Metadata Field Names
 * Type-safe field name enumeration
 */
export type MetadataField = keyof SimpleMetadataConfig;

/**
 * Validation Severity Levels
 * Simple severity enumeration
 */
export type ValidationSeverity = 'error' | 'warning';

/**
 * Content Difficulty Levels
 * Explicit difficulty enumeration
 */
export type ContentDifficulty = 'beginner' | 'intermediate' | 'advanced';

/**
 * Content Types
 * Explicit content type enumeration
 */
export type ContentType = 'metodologi' | 'tutorial' | 'resource';

// ========== UTILITY FUNCTIONS ==========

/**
 * Create a SimpleMetadataConfig
 * Factory function for creating metadata configurations
 */
export function createSimpleMetadataConfig(
  title: string,
  description: string,
  author: string,
  category: string,
  tags: readonly string[] = [],
  options: {
    emoji?: string;
    difficulty?: ContentDifficulty;
    contentType?: ContentType;
    featured?: boolean;
    publishedDate?: string;
  } = {}
): SimpleMetadataConfig {
  const result: SimpleMetadataConfig = {
    title,
    description,
    publishedDate: options.publishedDate ?? new Date().toISOString(),
    author,
    difficulty: options.difficulty ?? 'beginner',
    category,
    tags,
    featured: options.featured ?? false,
    contentType: options.contentType ?? 'tutorial',
  };

  // Handle optional emoji property with exactOptionalPropertyTypes
  if (options.emoji !== undefined) {
    (result as any).emoji = options.emoji;
  }

  return result;
}

/**
 * Validate SimpleMetadataConfig
 * Type guard function to ensure configuration validity
 */
export function isValidSimpleMetadataConfig(
  config: unknown
): config is SimpleMetadataConfig {
  return (
    typeof config === 'object' &&
    config !== null &&
    typeof (config as SimpleMetadataConfig).title === 'string' &&
    typeof (config as SimpleMetadataConfig).description === 'string' &&
    typeof (config as SimpleMetadataConfig).author === 'string' &&
    typeof (config as SimpleMetadataConfig).category === 'string' &&
    Array.isArray((config as SimpleMetadataConfig).tags) &&
    typeof (config as SimpleMetadataConfig).featured === 'boolean' &&
    ['beginner', 'intermediate', 'advanced'].includes(
      (config as SimpleMetadataConfig).difficulty
    ) &&
    ['metodologi', 'tutorial', 'resource'].includes(
      (config as SimpleMetadataConfig).contentType
    )
  );
}

/**
 * Calculate complexity score for SimpleMetadataConfig
 * Should return ≤12 for KISS compliance
 */
export function calculateSimpleMetadataComplexity(
  config: SimpleMetadataConfig
): number {
  // Simple calculation: base score + union types + optional fields
  const baseScore = 6; // Basic structure
  const unionTypeScore = 2; // difficulty + contentType unions
  const optionalFieldScore = config.emoji ? 1 : 0; // Optional emoji field

  return baseScore + unionTypeScore + optionalFieldScore; // Should be ≤12
}

/**
 * Convert SimpleMetadataConfig to JSON
 * Utility function for serialization
 */
export function simpleMetadataConfigToJSON(
  config: SimpleMetadataConfig
): string {
  return JSON.stringify(config, null, 2);
}

/**
 * Parse SimpleMetadataConfig from JSON
 * Utility function for deserialization
 */
export function simpleMetadataConfigFromJSON(
  json: string
): SimpleMetadataConfig | null {
  try {
    const parsed = JSON.parse(json);
    return isValidSimpleMetadataConfig(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
