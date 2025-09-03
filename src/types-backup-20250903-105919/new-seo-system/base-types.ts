// ========== BASE TYPES FOR INTEGRATION SYSTEM ==========
// Common type definitions for the integrated SEO system
// Follows DRY, KISS principles and Strict TypeScript mode
// CRITICAL: All types are readonly where appropriate for immutability

// ========== COMMON VALIDATION TYPES ==========
// Unified validation types following DRY principle
// Combines patterns from base-integration.ts and fallback-system.ts

/**
 * Unified validation result interface
 * Consolidates validation patterns from multiple files (DRY principle)
 * Extended to maintain backward compatibility with existing code
 * Made mutable for existing code compatibility (KISS principle)
 */
export interface ValidationResult {
  isValid: boolean;
  errors: (string | ValidationError)[];
  warnings: (string | ValidationWarning)[];
  // Extended properties for backward compatibility (made required for KISS principle)
  optimizedKeywords: string[];
  suggestions: (string | ValidationSuggestion)[];
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  impact?: 'SEO' | 'UX' | 'PERFORMANCE' | 'ACCESSIBILITY';
  validationTimestamp?: Date;
  validatorVersion?: string;
}

/**
 * Unified validation error interface
 * Consolidates error patterns from multiple files (DRY principle)
 * Extended to maintain backward compatibility with existing code
 */
export interface ValidationError {
  readonly field: string;
  readonly message: string;
  readonly code: string;
  readonly system?: 'seo' | 'fallback' | 'dataFlow' | 'metadata';
  // Extended properties for backward compatibility
  readonly severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  readonly impact?: 'SEO' | 'UX' | 'PERFORMANCE' | 'ACCESSIBILITY';
}

/**
 * Unified validation warning interface
 * Consolidates warning patterns from multiple files (DRY principle)
 * Extended to maintain backward compatibility with existing code
 */
export interface ValidationWarning {
  readonly field: string;
  readonly message: string;
  readonly code: string;
  readonly system?: 'seo' | 'fallback' | 'dataFlow' | 'metadata';
  // Extended properties for backward compatibility
  readonly severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  readonly impact?: 'SEO' | 'UX' | 'PERFORMANCE' | 'ACCESSIBILITY';
}

/**
 * Unified validation suggestion interface
 * Consolidates suggestion patterns from multiple files (DRY principle)
 */
export interface ValidationSuggestion {
  readonly field: string;
  readonly message: string;
  readonly code: string;
  readonly priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  readonly expectedBenefit?: string;
}

/**
 * Unified validation rule interface
 * Consolidates validation rule patterns from multiple files (DRY principle)
 */
export interface ValidationRule<T = unknown> {
  readonly field: keyof T;
  readonly validator: (value: T[keyof T]) => boolean;
  readonly message: string;
  readonly isRequired: boolean;
}

// ========== COMMON CONFIGURATION PATTERNS ==========
// Shared configuration patterns following DRY principle

/**
 * Base integration configuration interface
 * Common configuration pattern for all integration types
 */
export interface BaseIntegrationConfig<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly enabled: boolean;
  readonly timeout: number;
  readonly maxRetries?: number;
  readonly qualityThreshold?: number;
  readonly custom?: T;
}

/**
 * Base result interface
 * Common result pattern for all integration operations
 */
export interface BaseResult {
  readonly success: boolean;
  readonly status: 'connected' | 'disconnected' | 'error' | 'disabled';
  readonly timestamp: Date;
  readonly errorMessage?: string;
  readonly issues?: readonly string[];
  readonly warnings?: readonly string[];
}

// ========== COMMON ENUMS AND LITERALS ==========
// Centralized constants following DRY principle

export const SYSTEM_TYPES = [
  'seo',
  'fallback',
  'dataFlow',
  'metadata',
  'optimization',
] as const;
export type SystemType = (typeof SYSTEM_TYPES)[number];

export const PRIORITY_LEVELS = ['critical', 'high', 'medium', 'low'] as const;
export type PriorityLevel = (typeof PRIORITY_LEVELS)[number];

export const ENVIRONMENT_TYPES = [
  'development',
  'staging',
  'production',
] as const;
export type EnvironmentType = (typeof ENVIRONMENT_TYPES)[number];

// ========== COMMON UTILITY TYPES ==========
// Reusable utility types following DRY principle

/**
 * Generic configuration with environment awareness
 */
export interface EnvironmentAwareConfig {
  readonly environment: EnvironmentType;
  readonly version: string;
  readonly debug?: boolean;
}

/**
 * Generic quality score interface
 * Reusable across different quality measurement contexts
 */
export interface QualityScore {
  readonly overall: number; // 0-100
  readonly lastMeasured: Date;
  readonly factors?: readonly string[];
}

/**
 * Generic processing result interface
 * Reusable across different processing contexts
 */
export interface ProcessingResult<T = unknown> extends BaseResult {
  readonly success: boolean;
  readonly data?: T;
  readonly processedCount?: number;
  readonly processingTime?: number;
}

// ========== TYPE GUARDS AND VALIDATORS ==========
// Runtime type checking following KISS principle

/**
 * Type guard for ValidationResult
 */
export function isValidationResult(obj: unknown): obj is ValidationResult {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'isValid' in obj &&
    typeof (obj as ValidationResult).isValid === 'boolean' &&
    'errors' in obj &&
    Array.isArray((obj as ValidationResult).errors) &&
    'warnings' in obj &&
    Array.isArray((obj as ValidationResult).warnings)
  );
}

/**
 * Type guard for BaseIntegrationConfig
 */
export function isBaseIntegrationConfig(
  obj: unknown
): obj is BaseIntegrationConfig {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'enabled' in obj &&
    typeof (obj as BaseIntegrationConfig).enabled === 'boolean' &&
    'timeout' in obj &&
    typeof (obj as BaseIntegrationConfig).timeout === 'number'
  );
}

// ========== DEFAULT VALUES ==========
// Centralized default values following DRY principle

export const DEFAULT_TIMEOUT = 5000;
export const DEFAULT_MAX_RETRIES = 3;
export const DEFAULT_QUALITY_THRESHOLD = 80;
export const DEFAULT_CONFIDENCE_THRESHOLD = 0.8;

export const DEFAULT_BASE_CONFIG: BaseIntegrationConfig = {
  enabled: true,
  timeout: DEFAULT_TIMEOUT,
  maxRetries: DEFAULT_MAX_RETRIES,
  qualityThreshold: DEFAULT_QUALITY_THRESHOLD,
} as const;

// ========== TYPE ALIASES FOR BACKWARD COMPATIBILITY ==========
// Maintain compatibility with existing code during migration

export type ValidationResultType = ValidationResult;
export type ValidationErrorType = ValidationError;
export type ValidationWarningType = ValidationWarning;

export type BaseResultType = BaseResult;
export type SystemTypeAlias = SystemType;
export type PriorityLevelAlias = PriorityLevel;
export type EnvironmentTypeAlias = EnvironmentType;
