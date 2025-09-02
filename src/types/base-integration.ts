// ========== BASE INTEGRATION TYPE DEFINITIONS ==========
// Strict TypeScript mode compliant type definitions for base integration system
// Now imports from new unified integration system (DRY principle)

// Import types from unified system
import type {
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
  IntegrationErrorContext
} from './new-seo-system/integration-types.js';

// Import values from unified system
import {
  DEFAULT_INTEGRATION_CONFIG
} from './new-seo-system/integration-types.js';

// Import base types
import type { ValidationResult } from './new-seo-system/base-types.js';

// Legacy imports for backward compatibility during migration
// Note: These imports are kept for potential future use but currently unused

// ========== LEGACY TYPE ALIASES ==========
// These types are now imported from the unified integration system
// Maintained for backward compatibility during migration (DRY principle)

/**
 * SEOシステム統合設定
 * 既存のSEO最適化システムとの連携設定
 * @deprecated Use SEOIntegrationConfig from new-seo-system/integration-types.ts
 */
export type SEOIntegrationConfigLegacy = SEOIntegrationConfig;

/**
 * Fallbackシステム統合設定
 * Story 4B Fallbackシステムとの連携設定
 * @deprecated Use FallbackIntegrationConfig from new-seo-system/integration-types.ts
 */
export type FallbackIntegrationConfigLegacy = FallbackIntegrationConfig;

/**
 * データフロー設定
 * メタデータとSEO最適化データの流れ設定
 * @deprecated Use DataFlowConfig from new-seo-system/integration-types.ts
 */
export type DataFlowConfigLegacy = DataFlowConfig;

/**
 * 基盤統合設定
 * 既存システムとの統合設定の完全な定義
 * @deprecated Use IntegrationConfig from new-seo-system/integration-types.ts
 */
export type BaseIntegrationConfigLegacy = IntegrationConfig;

// ========== LEGACY RESULT TYPE ALIASES ==========
// Result types are now imported from the unified integration system
// Maintained for backward compatibility during migration (DRY principle)

/**
 * SEOシステム統合結果
 * 既存SEOシステムとの連携結果
 * @deprecated Use SEOIntegrationResult from new-seo-system/integration-types.ts
 */
export type SEOIntegrationResultLegacy = SEOIntegrationResult;

/**
 * Fallbackシステム統合結果
 * Story 4B Fallbackシステムとの連携結果
 * @deprecated Use FallbackIntegrationResult from new-seo-system/integration-types.ts
 */
export type FallbackIntegrationResultLegacy = FallbackIntegrationResult;

/**
 * データフロー結果
 * メタデータとSEO最適化データの流れ結果
 * @deprecated Use DataFlowResult from new-seo-system/integration-types.ts
 */
export type DataFlowResultLegacy = DataFlowResult;

/**
 * 統合品質測定結果
 * 基盤統合の品質と安定性の測定結果
 * @deprecated Use IntegrationQualityResult from new-seo-system/integration-types.ts
 */
export type IntegrationQualityResultLegacy = IntegrationQualityResult;

/**
 * 基盤統合結果
 * 完全な統合結果と品質測定結果
 * @deprecated Use IntegrationResult from new-seo-system/integration-types.ts
 */
export type BaseIntegrationResultLegacy = IntegrationResult;

// ========== LEGACY VALIDATION TYPE ALIASES ==========
// Validation types are now imported from the unified system
// Maintained for backward compatibility during migration (DRY principle)

/**
 * 統合エラーコンテキスト
 * 既存のErrorContextパターンを活用（DRY原則）
 * @deprecated Use IntegrationErrorContext from new-seo-system/integration-types.ts
 */
export type IntegrationErrorContextLegacy = IntegrationErrorContext;

/**
 * 統合バリデーションルール
 * 既存のValidationRuleパターンを活用（DRY原則）
 * @deprecated Use IntegrationValidationRule from new-seo-system/integration-types.ts
 */
export type IntegrationValidationRuleLegacy = IntegrationValidationRule;

/**
 * 統合バリデーション結果
 * 既存のMetadataValidationResultパターンを活用（DRY原則）
 * @deprecated Use IntegrationValidationResult from new-seo-system/integration-types.ts
 */
export type IntegrationValidationResultLegacy = IntegrationValidationResult;

/**
 * 統合バリデーションエラー
 * 既存のValidationErrorパターンを活用（DRY原則）
 * @deprecated Use ValidationError from new-seo-system/integration-types.ts
 */
export type IntegrationValidationErrorLegacy = ValidationError;

/**
 * 統合バリデーション警告
 * 既存のValidationWarningパターンを活用（DRY原則）
 * @deprecated Use ValidationWarning from new-seo-system/integration-types.ts
 */
export type IntegrationValidationWarningLegacy = ValidationWarning;

/**
 * 個別システムバリデーション結果
 * 既存のValidationResultパターンを活用（DRY原則）
 * @deprecated Use ValidationResult from new-seo-system/integration-types.ts
 */
export type ValidationResultLegacy = ValidationResult;

// ========== LEGACY DEFAULT CONFIGURATION ==========
// Default configuration now imported from unified integration system
// Maintained for backward compatibility during migration (DRY principle)

/**
 * Legacy default configuration
 * @deprecated Use DEFAULT_INTEGRATION_CONFIG from new-seo-system/integration-types.ts
 */
export const DEFAULT_BASE_INTEGRATION_CONFIG: IntegrationConfig = DEFAULT_INTEGRATION_CONFIG;
