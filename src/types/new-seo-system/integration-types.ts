// ========== INTEGRATION TYPES FOR UNIFIED SYSTEM ==========
// Integrated configuration and result types for SEO system
// Consolidates base-integration.ts and fallback-system.ts (DRY principle)
// Follows KISS principle with simple, focused interfaces

import type { BaseIntegrationConfig, ValidationResult } from './base-types.js';

// Re-export ValidationResult for backward compatibility
export type { ValidationResult } from './base-types.js';

// ========== SEO INTEGRATION TYPES ==========
// Consolidated from base-integration.ts

/**
 * SEO integration configuration
 * Unified configuration for SEO system integration
 */
export interface SEOIntegrationConfig extends BaseIntegrationConfig {
  readonly apiEndpoint: string;
  readonly qualityThreshold: number; // 0-100
}

/**
 * SEO integration result
 * Result of SEO system integration operations
 */
export interface SEOIntegrationResult {
  readonly success: boolean;
  readonly status: 'connected' | 'disconnected' | 'error' | 'disabled';
  readonly timestamp: Date;
  readonly errorMessage?: string;
  readonly issues?: readonly string[];
  readonly warnings?: readonly string[];
  readonly endpoint?: string;
  readonly lastConnected?: Date;
  readonly seoAnalysis?: unknown; // Type to be defined based on SEO analysis structure
  readonly processingResult?: unknown; // Type to be defined based on processing result
}

// ========== FALLBACK INTEGRATION TYPES ==========
// Consolidated from fallback-system.ts

/**
 * Fallback integration configuration
 * Unified configuration for fallback system integration
 */
export interface FallbackIntegrationConfig extends BaseIntegrationConfig {
  readonly fallbackEndpoint: string;
  readonly priority: 'manual' | 'auto' | 'fallback' | 'default';
  readonly confidenceThreshold: number; // 0-1
}

/**
 * Fallback integration result
 * Result of fallback system integration operations
 */
export interface FallbackIntegrationResult {
  readonly success: boolean;
  readonly status: 'connected' | 'disconnected' | 'error' | 'disabled';
  readonly timestamp: Date;
  readonly errorMessage?: string;
  readonly issues?: readonly string[];
  readonly warnings?: readonly string[];
  readonly endpoint?: string;
  readonly lastConnected?: Date;
  readonly fallbackResult?: unknown; // Type to be defined based on fallback result
  readonly metadata?: unknown; // Type to be defined based on metadata structure
}

// ========== DATA FLOW INTEGRATION TYPES ==========
// Consolidated data flow configuration and results

/**
 * Data flow configuration
 * Configuration for metadata and SEO data flow
 */
export interface DataFlowConfig extends BaseIntegrationConfig {
  readonly metadataFlow: boolean;
  readonly seoFlow: boolean;
  readonly validation: boolean;
  readonly fallbackEnabled: boolean;
  readonly qualityMonitoring: boolean;
}

/**
 * Data flow result
 * Result of data flow operations
 */
export interface DataFlowResult {
  readonly success: boolean;
  readonly status: 'connected' | 'disconnected' | 'error' | 'disabled';
  readonly timestamp: Date;
  readonly errorMessage?: string;
  readonly issues?: readonly string[];
  readonly warnings?: readonly string[];
  readonly metadataFlow: boolean;
  readonly seoFlow: boolean;
  readonly validation: boolean;
  readonly flowStatus: 'active' | 'inactive' | 'error';
  readonly lastProcessed?: Date;
  readonly processedCount: number;
  readonly errorCount: number;
}

// ========== INTEGRATED SYSTEM CONFIGURATION ==========
// Main configuration that combines all integration types

/**
 * Complete integration configuration
 * Unified configuration for the entire integration system
 */
export interface IntegrationConfig {
  readonly seoSystem: SEOIntegrationConfig;
  readonly fallbackSystem: FallbackIntegrationConfig;
  readonly dataFlow: DataFlowConfig;
  readonly environment: 'development' | 'staging' | 'production';
  readonly version: string;
}

/**
 * Integration quality measurement result
 * Consolidated quality metrics for all integrated systems
 */
export interface IntegrationQualityResult {
  readonly overall: number; // 0-100
  readonly seoQuality: number; // 0-100
  readonly fallbackQuality: number; // 0-100
  readonly dataFlowQuality: number; // 0-100
  readonly stability: number; // 0-100
  readonly performance: number; // 0-100
  readonly lastMeasured: Date;
  readonly recommendations: readonly string[];
}

/**
 * Complete integration result
 * Final result of all integration operations
 */
export interface IntegrationResult {
  readonly success: boolean;
  readonly status: 'connected' | 'disconnected' | 'error' | 'disabled';
  readonly timestamp: Date;
  readonly errorMessage?: string;
  readonly issues?: readonly string[];
  readonly warnings?: readonly string[];
  readonly seoIntegration: SEOIntegrationResult;
  readonly fallbackIntegration: FallbackIntegrationResult;
  readonly dataFlow: DataFlowResult;
  readonly quality: IntegrationQualityResult;
  readonly version: string;
}

// ========== VALIDATION TYPES ==========
// Consolidated validation types for the integrated system

/**
 * Integration validation rule
 * Rule for validating integration configurations
 */
export interface IntegrationValidationRule {
  readonly system: 'seo' | 'fallback' | 'dataFlow';
  readonly validator: (config: unknown) => boolean;
  readonly message: string;
  readonly isRequired: boolean;
}

/**
 * Integration validation result
 * Result of validating integration configurations
 */
export interface IntegrationValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly ValidationError[];
  readonly warnings: readonly ValidationWarning[];
  readonly seoSystem: ValidationResult;
  readonly fallbackSystem: ValidationResult;
  readonly dataFlow: ValidationResult;
}

/**
 * Integration validation error
 * Error details for integration validation failures
 */
export interface ValidationError {
  readonly system: 'seo' | 'fallback' | 'dataFlow';
  readonly field: string;
  readonly message: string;
  readonly code: string;
}

/**
 * Integration validation warning
 * Warning details for integration validation issues
 */
export interface ValidationWarning {
  readonly system: 'seo' | 'fallback' | 'dataFlow';
  readonly field: string;
  readonly message: string;
  readonly code: string;
}

// ========== ERROR CONTEXT TYPES ==========
// Consolidated error context for better error tracking

/**
 * Integration error context
 * Context information for integration errors
 */
export interface IntegrationErrorContext {
  readonly system: 'seo' | 'fallback' | 'dataFlow';
  readonly action: string;
  readonly timestamp: number;
  readonly component: string;
}

// ========== DEFAULT CONFIGURATIONS ==========
// Centralized default values following DRY principle

export const DEFAULT_SEO_CONFIG: SEOIntegrationConfig = {
  enabled: true,
  apiEndpoint: '/api/seo',
  timeout: 5000,
  maxRetries: 3,
  qualityThreshold: 80,
} as const;

export const DEFAULT_FALLBACK_CONFIG: FallbackIntegrationConfig = {
  enabled: true,
  fallbackEndpoint: '/api/fallback',
  timeout: 5000,
  priority: 'fallback',
  confidenceThreshold: 0.8,
} as const;

export const DEFAULT_DATAFLOW_CONFIG: DataFlowConfig = {
  enabled: true,
  metadataFlow: true,
  seoFlow: true,
  validation: true,
  fallbackEnabled: true,
  qualityMonitoring: true,
  timeout: 5000,
} as const;

export const DEFAULT_INTEGRATION_CONFIG: IntegrationConfig = {
  seoSystem: DEFAULT_SEO_CONFIG,
  fallbackSystem: DEFAULT_FALLBACK_CONFIG,
  dataFlow: DEFAULT_DATAFLOW_CONFIG,
  environment: 'development',
  version: '1.0.0',
} as const;

// ========== TYPE ALIASES FOR COMPATIBILITY ==========
// Maintain backward compatibility during migration

export type SEOIntegrationConfigType = SEOIntegrationConfig;
export type FallbackIntegrationConfigType = FallbackIntegrationConfig;
export type DataFlowConfigType = DataFlowConfig;
export type IntegrationConfigType = IntegrationConfig;
export type IntegrationResultType = IntegrationResult;
export type IntegrationValidationRuleType = IntegrationValidationRule;
export type IntegrationValidationResultType = IntegrationValidationResult;
