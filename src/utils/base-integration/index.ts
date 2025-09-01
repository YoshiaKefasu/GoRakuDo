// ========== BASE INTEGRATION INDEX FILE ==========
// Centralized exports for base integration system following DRY principle
// Integrates with existing export patterns

// Core Base Integration System
export { BaseIntegrator, integrateBaseSystems } from "./base-integrator.js";

// System Connectors
export { SEOConnector } from "./seo-connector.js";
export { FallbackConnector } from "./fallback-connector.js";

// Data Flow and Quality
export { DataFlowBuilder } from "./data-flow-builder.js";
export { QualityMeasurer } from "./quality-measurer.js";

// Types
export type {
  BaseIntegrationConfig,
  BaseIntegrationResult,
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
  IntegrationValidationError,
  IntegrationValidationWarning,
  ValidationResult
} from "../../types/base-integration.js";

// Default Configuration
export { DEFAULT_BASE_INTEGRATION_CONFIG } from "../../types/base-integration.js";
