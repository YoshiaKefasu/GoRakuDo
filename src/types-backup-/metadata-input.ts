// ========== METADATA INPUT TYPE DEFINITIONS ==========
// INTEGRATED: Now imports directly from new unified validation system (DRY principle)
// Strict TypeScript mode compliant type definitions for metadata input system
// Now imports from new unified validation system (DRY principle)

// Import types directly from unified validation system
// Following DRY principle by eliminating re-exports and importing directly
import type { MetadataInputConfig } from './new-seo-system/validation-types.js';

// Re-export for backward compatibility (KISS principle - minimal changes for existing code)
export type {
  MetadataInput,
  MetadataValidationResult,
  MetadataReadResult,
  KeywordData,
  MetadataInputFormState,
  MetadataInputConfig,
  ValidationRule,
} from './new-seo-system/validation-types.js';

export type {
  ValidationError,
  ValidationWarning,
} from './new-seo-system/base-types.js';

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
      validator: (value: unknown) =>
        typeof value === 'string' && value.length > 0 && value.length <= 100,
      message: 'Title is required and must be 100 characters or less',
      isRequired: true,
    },
    {
      field: 'description',
      validator: (value: unknown) =>
        typeof value === 'string' && value.length > 0 && value.length <= 300,
      message: 'Description is required and must be 300 characters or less',
      isRequired: true,
    },
    {
      field: 'tags',
      validator: (value: unknown) => Array.isArray(value) && value.length <= 10,
      message: 'Tags must be an array with 10 or fewer items',
      isRequired: false,
    },
  ],
};

// ========== UTILITY TYPES ==========
// Utility types now imported from unified validation system (DRY principle)
// This eliminates code duplication and centralizes type definitions

// Utility types are re-exported from unified system - no local imports needed

// Re-export utility types for backward compatibility
export type {
  PartialMetadataInput,
  MetadataFieldUpdate,
  MetadataInputEvent,
} from './new-seo-system/validation-types.js';
