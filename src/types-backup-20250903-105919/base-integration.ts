// ========== BASE INTEGRATION TYPE DEFINITIONS ==========
// Strict TypeScript mode compliant type definitions for base integration system
// Direct re-export from unified integration system (DRY principle applied)

// Re-export all integration types from unified system
export type {
  SEOIntegrationConfig,
  FallbackIntegrationConfig,
  DataFlowConfig,
  IntegrationConfig,
  SEOIntegrationResult,
  FallbackIntegrationResult,
  DataFlowResult,
  IntegrationResult,
  IntegrationQualityResult,
  IntegrationValidationRule,
  IntegrationValidationResult,
  ValidationError,
  ValidationWarning,
  IntegrationErrorContext,
  ValidationResult,
} from './new-seo-system/integration-types.js';

// Re-export configuration from unified system
export { DEFAULT_INTEGRATION_CONFIG } from './new-seo-system/integration-types.js';
