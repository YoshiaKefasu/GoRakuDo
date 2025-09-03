/**
 * @deprecated This file is deprecated. Use src/types/new-seo-system/fallback-system-integration.ts instead.
 *
 * This file will be removed in the next major version.
 * Please migrate to the new system using the migration helper functions.
 *
 * 移行手順:
 * 1. 新しい統合ファイルからバリデーション型をインポート
 * 2. migrateFallbackConfig関数を使用して設定を移行
 * 3. 古いバリデーション型定義の使用箇所を新しい型に置換
 */

// Re-export from new system for backward compatibility
export * from '../new-seo-system/fallback-system-integration.js';
export * from '../new-seo-system/base-integration-integration.js';

// Legacy type definitions (deprecated)
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

// Migration warning
console.warn(
  'DEPRECATION WARNING: fallback-system.ts is deprecated. ' +
  'Please migrate to the new system. ' +
  'See src/types/new-seo-system/fallback-system-integration.ts for details.'
);
