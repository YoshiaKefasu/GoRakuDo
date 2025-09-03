/**
 * Base Integration Types - Legacy System Integration
 *
 * This file provides backward compatibility for the old base-integration.ts
 * while maintaining DRY and KISS principles.
 *
 * DRY原則: 共通の基本設定型を作成し、各システム固有の設定型で継承
 * KISS原則: 複雑な型定義をシンプルで理解しやすい構造に統合
 */

import type {
  BaseIntegrationConfig
} from './base-types';
import type {
  SEOIntegrationConfig as NewSEOIntegrationConfig,
  FallbackIntegrationConfig as NewFallbackIntegrationConfig
} from './integration-types';

// Legacy type aliases for backward compatibility
export type SEOIntegrationConfig = NewSEOIntegrationConfig;
export type FallbackIntegrationConfig = NewFallbackIntegrationConfig;

// Legacy interface for backward compatibility
export interface LegacyBaseIntegrationConfig extends BaseIntegrationConfig {
  readonly legacySupport: boolean;
}

// Migration helper function
export function migrateLegacyConfig(
  legacyConfig: LegacyBaseIntegrationConfig
): BaseIntegrationConfig {
  const { legacySupport, ...newConfig } = legacyConfig;
  return newConfig;
}

// Type guard for legacy config
export function isLegacyConfig(
  config: unknown
): config is LegacyBaseIntegrationConfig {
  return (
    typeof config === 'object' &&
    config !== null &&
    'legacySupport' in config &&
    typeof (config as any).legacySupport === 'boolean'
  );
}

// Export all new system types for convenience
export * from './index.js';
