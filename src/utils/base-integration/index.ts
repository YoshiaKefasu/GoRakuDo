// ========== BASE INTEGRATION INDEX FILE ==========
// Centralized exports for base integration system following DRY principle
// Integrates with existing export patterns

// Core Base Integration System
export { BaseIntegrator, integrateBaseSystems } from './base-integrator.js';

// System Connectors
export { SEOConnector } from './seo-connector.js';
export { FallbackConnector } from './fallback-connector.js';

// Data Flow and Quality
export { DataFlowBuilder } from './data-flow-builder.js';
export { QualityMeasurer } from './quality-measurer.js';

// Types from unified integration system
export type {
  IntegrationConfig as BaseIntegrationConfig,
  IntegrationResult as BaseIntegrationResult,
  SEOIntegrationConfig,
  SEOIntegrationResult,
  FallbackIntegrationConfig,
  FallbackIntegrationResult,
  DataFlowConfig,
  DataFlowResult,
  IntegrationQualityResult,
  IntegrationErrorContext,
  IntegrationValidationRule,
  IntegrationValidationResult,
  ValidationError as IntegrationValidationError,
  ValidationWarning as IntegrationValidationWarning,
  ValidationResult,
} from '../../types/new-seo-system/integration-types.js';

// Default Configuration
export { DEFAULT_INTEGRATION_CONFIG as DEFAULT_BASE_INTEGRATION_CONFIG } from '../../types/new-seo-system/integration-types.js';
