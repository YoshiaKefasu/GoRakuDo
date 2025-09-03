// ========== FALLBACK SYSTEM TYPE DEFINITIONS ==========
// Strict TypeScript mode compliant type definitions for fallback system
// Now imports from new unified validation system (DRY principle)

// ========== TYPE RE-EXPORTS ==========
// Re-export types from unified validation system for backward compatibility
// This maintains existing import paths while using the new unified system

export type {
  MetadataGap,
  ExtractionQualityScore,
  MetadataInput,
  FallbackMetadata,
  FallbackResult
} from './new-seo-system/validation-types.js';

// Import types to ensure they are used (prevents unused import warnings)
import type { MetadataGap as _MetadataGap } from './new-seo-system/validation-types.js';
import type { ExtractionQualityScore as _ExtractionQualityScore } from './new-seo-system/validation-types.js';
import type { MetadataInput as _MetadataInput } from './new-seo-system/validation-types.js';
import type { FallbackMetadata as _FallbackMetadata } from './new-seo-system/validation-types.js';
import type { FallbackResult as _FallbackResult } from './new-seo-system/validation-types.js';

// ========== LEGACY CONFIGURATION ALIASES ==========
// Configuration types are now imported from unified validation system
// Maintained for backward compatibility during migration (DRY principle)
