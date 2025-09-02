// ========== METADATA INPUT TYPE DEFINITIONS ==========
// Strict TypeScript mode compliant type definitions for metadata input system
// Now imports from new unified validation system (DRY principle)

// Import and re-export types from unified systems for backward compatibility
export type {
  MetadataInput,
  MetadataValidationResult,
  MetadataReadResult,
  KeywordData,
  MetadataInputFormState,
  MetadataInputConfig,
  ValidationRule
} from './new-seo-system/validation-types.js';

export type { ValidationError, ValidationWarning } from './new-seo-system/base-types.js';

// Import types for local usage
import type { MetadataInput, MetadataValidationResult, MetadataInputConfig } from './new-seo-system/validation-types.js';

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
      validator: (value: unknown) => typeof value === 'string' && value.length > 0 && value.length <= 100,
      message: 'Title is required and must be 100 characters or less',
      isRequired: true
    },
    {
      field: 'description',
      validator: (value: unknown) => typeof value === 'string' && value.length > 0 && value.length <= 300,
      message: 'Description is required and must be 300 characters or less',
      isRequired: true
    },
    {
      field: 'tags',
      validator: (value: unknown) => Array.isArray(value) && value.length <= 10,
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
