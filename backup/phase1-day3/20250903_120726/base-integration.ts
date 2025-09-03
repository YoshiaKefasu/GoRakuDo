/**
 * @deprecated This file is deprecated. Use src/types/new-seo-system/base-integration-integration.ts instead.
 *
 * This file will be removed in the next major version.
 * Please migrate to the new system using the migration helper functions.
 *
 * 移行手順:
 * 1. 新しい統合ファイルから型をインポート
 * 2. migrateLegacyConfig関数を使用して設定を移行
 * 3. 古い型定義の使用箇所を新しい型に置換
 */

// Legacy type definitions (deprecated) - Direct implementation to avoid circular dependencies
export interface SEOIntegrationConfig {
  readonly enabled: boolean;
  readonly apiEndpoint: string;
  readonly timeout: number;
  readonly legacySupport: boolean;
}

export interface FallbackIntegrationConfig {
  readonly enabled: boolean;
  readonly fallbackEndpoint: string;
  readonly timeout: number;
  readonly legacySupport: boolean;
}

// Migration warning
console.warn(
  'DEPRECATION WARNING: base-integration.ts is deprecated. ' +
  'Please migrate to the new system. ' +
  'See src/types/new-seo-system/base-integration-integration.ts for details.'
);
