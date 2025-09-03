// ========== ADVANCED OPTIMIZATION TYPE DEFINITIONS ==========
// INTEGRATED: Now imports directly from new unified validation system (DRY principle)
// Strict TypeScript mode compliant type definitions for advanced optimization system
// Now imports from new unified validation system (DRY principle)

// Types are re-exported from unified validation system for backward compatibility
// Following DRY principle - no local imports needed, all types come from unified system

// Re-export for backward compatibility (KISS principle - minimal changes for existing code)
export type {
  AdvancedOptimizationConfig,
  AdvancedOptimizationResult,
  StructuredDataConfig,
  StructuredDataResult,
  QualityGateConfig,
  QualityGateResult,
  TestCleanupConfig,
  TestCleanupResult,
  RedundantFileInfo,
  // Re-export moved utility types
  AdvancedQualityMonitoringConfig,
  AdvancedQualityMonitoringResult,
  AlgorithmEnhancementConfig,
  AlgorithmEnhancementResult,
  PhaseCompletionStatus,
  PhaseQualityGate
} from './new-seo-system/validation-types.js';

// ========== UTILITY TYPES ==========
// Utility types now imported from unified validation system (DRY principle)
// This eliminates code duplication and centralizes type definitions
// All advanced optimization utility types have been moved to the unified system

