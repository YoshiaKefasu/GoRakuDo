/**
 * Fallback System Types - Legacy System Integration
 *
 * This file provides backward compatibility for the old fallback-system.ts
 * while maintaining DRY and KISS principles.
 *
 * DRY原則: 共通のバリデーション基本型を作成し、各システム固有のバリデーション型で継承
 * KISS原則: 複雑なバリデーション型定義をシンプルで理解しやすい構造に統合
 */

import type {
  ValidationResult,
  ValidationError,
  ValidationWarning,
  BaseIntegrationConfig
} from './base-types';

// Legacy type aliases for backward compatibility
export type FallbackValidationResult = ValidationResult;
export type FallbackValidationError = ValidationError;
export type FallbackValidationWarning = ValidationWarning;

// Legacy interface for backward compatibility
export interface LegacyFallbackConfig extends BaseIntegrationConfig {
  readonly legacySupport: boolean;
}

// Migration helper function
export function migrateFallbackConfig(
  legacyConfig: LegacyFallbackConfig
): BaseIntegrationConfig {
  const { legacySupport, ...newConfig } = legacyConfig;
  return newConfig;
}

// Type guard for legacy config
export function isLegacyFallbackConfig(
  config: unknown
): config is LegacyFallbackConfig {
  return (
    typeof config === 'object' &&
    config !== null &&
    'legacySupport' in config &&
    typeof (config as any).legacySupport === 'boolean'
  );
}

// Export all new system types for convenience
export * from './validation-types.js';
