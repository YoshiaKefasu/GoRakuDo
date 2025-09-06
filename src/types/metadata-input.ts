// ========== METADATA INPUT TYPE DEFINITIONS ==========
// Strict TypeScript mode compliant type definitions for metadata input system
// Follows existing content schema patterns from src/content/config.ts

/**
 * Metadata input interface for manual metadata entry
 * Extends existing content schema with input-specific fields
 */
export interface MetadataInput {
  title: string;
  description: string;
  publishedDate: string;
  author: string;
  emoji?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  featured: boolean;
  contentType: 'metodologi' | 'tutorial' | 'resource';
  readTime?: number;
}

/**
 * Metadata validation result interface
 * Provides detailed validation feedback for user input
 */
export interface MetadataValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

/**
 * Validation error interface
 * Specific error details for metadata validation
 */
export interface ValidationError {
  field: keyof MetadataInput;
  message: string;
  code: string;
}

/**
 * Validation warning interface
 * Non-blocking warnings for metadata input
 */
export interface ValidationWarning {
  field: keyof MetadataInput;
  message: string;
  code: string;
}

/**
 * Metadata reading result interface
 * Result of reading metadata from .md files
 */
export interface MetadataReadResult {
  success: boolean;
  metadata?: MetadataInput;
  error?: string;
  filePath: string;
  frontmatter?: Record<string, unknown>;
}

/**
 * Keyword management interface
 * Enhanced keyword functionality for metadata input
 */
export interface KeywordData {
  value: string;
  priority: number; // 1-5 scale
  relatedKeywords: string[];
  usageCount: number;
}

/**
 * Metadata input form state interface
 * Manages form state and validation during input
 */
export interface MetadataInputFormState {
  metadata: MetadataInput;
  validation: MetadataValidationResult;
  isDirty: boolean;
  isSubmitting: boolean;
  lastSaved?: Date;
}

/**
 * Metadata input configuration interface
 * Configurable options for metadata input system
 */
export interface MetadataInputConfig {
  maxTitleLength: number;
  maxDescriptionLength: number;
  maxTagsCount: number;
  maxTagLength: number;
  autoSaveInterval: number; // milliseconds
  validationRules: ValidationRule[];
}

/**
 * Validation rule interface
 * Configurable validation rules for metadata fields
 */
export interface ValidationRule {
  field: keyof MetadataInput;
  validator: (value: unknown) => boolean;
  message: string;
  isRequired: boolean;
}

// ========== DEFAULT CONFIGURATION ==========
// Centralized configuration values following DRY principle

export const DEFAULT_METADATA_CONFIG: MetadataInputConfig = {
  maxTitleLength: 100,
  maxDescriptionLength: 300,
  maxTagsCount: 10,
  maxTagLength: 30,
  autoSaveInterval: 5000, // 5 seconds
  validationRules: [
    {
      field: 'title',
      validator: (value) => typeof value === 'string' && value.length > 0 && value.length <= 100,
      message: 'Title is required and must be 100 characters or less',
      isRequired: true
    },
    {
      field: 'description',
      validator: (value) => typeof value === 'string' && value.length > 0 && value.length <= 300,
      message: 'Description is required and must be 300 characters or less',
      isRequired: true
    },
    {
      field: 'tags',
      validator: (value) => Array.isArray(value) && value.length <= 10,
      message: 'Tags must be an array with 10 or fewer items',
      isRequired: false
    }
  ]
};

// ========== UTILITY TYPES ==========
// Helper types for metadata input system

/**
 * Partial metadata input for form updates
 * Allows partial updates during form editing
 */
export type PartialMetadataInput = Partial<MetadataInput>;

/**
 * Metadata field update payload
 * Single field update for reactive form updates
 */
export interface MetadataFieldUpdate {
  field: keyof MetadataInput;
  value: unknown;
}

/**
 * Metadata input event types
 * Event handling for metadata input system
 */
export type MetadataInputEvent = 
  | { type: 'input'; field: keyof MetadataInput; value: unknown }
  | { type: 'validation'; result: MetadataValidationResult }
  | { type: 'save'; metadata: MetadataInput }
  | { type: 'load'; metadata: MetadataInput }
  | { type: 'error'; error: string };
