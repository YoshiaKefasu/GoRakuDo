/**
 * Fallback System Types - Legacy System Integration
 * 
 * This file provides backward compatibility for the old fallback-system.ts
 * while maintaining DRY and KISS principles.
 * 
 * DRY原則: 共通のバリデーション基本型を作成し、各システム固有のバリデーション型で継承
 * KISS原則: 複雑なバリデーション型定義をシンプルで理解しやすい構造に統合
 */

// Legacy type definitions for backward compatibility
export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly ValidationError[];
  readonly warnings: readonly ValidationWarning[];
  readonly legacySupport: boolean;
}

export interface ValidationError {
  readonly code: string;
  readonly message: string;
  readonly field?: string;
  readonly legacySupport: boolean;
}

export interface ValidationWarning {
  readonly code: string;
  readonly message: string;
  readonly field?: string;
  readonly legacySupport: boolean;
}

// Base validation interface (DRY principle)
export interface BaseValidationConfig {
  readonly isValid: boolean;
  readonly legacySupport: boolean;
}

// Migration helper function
export function migrateFallbackConfig(
  legacyConfig: ValidationResult | ValidationError | ValidationWarning
): BaseValidationConfig {
  return {
    isValid: 'isValid' in legacyConfig ? legacyConfig.isValid : true,
    legacySupport: false
  };
}

// Type guard for legacy config
export function isLegacyFallbackConfig(
  config: unknown
): config is ValidationResult | ValidationError | ValidationWarning {
  return (
    typeof config === 'object' &&
    config !== null &&
    'legacySupport' in config &&
    typeof (config as any).legacySupport === 'boolean'
  );
}

