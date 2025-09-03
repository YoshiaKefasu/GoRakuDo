/**
 * Base Integration Types - Legacy System Integration
 * 
 * This file provides backward compatibility for the old base-integration.ts
 * while maintaining DRY and KISS principles.
 * 
 * DRY原則: 共通の基本設定型を作成し、各システム固有の設定型で継承
 * KISS原則: 複雑な型定義をシンプルで理解しやすい構造に統合
 */

// Legacy type definitions for backward compatibility
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

// Base configuration interface (DRY principle)
export interface BaseIntegrationConfig {
  readonly enabled: boolean;
  readonly timeout: number;
}

// Migration helper function
export function migrateLegacyConfig(
  legacyConfig: SEOIntegrationConfig | FallbackIntegrationConfig
): BaseIntegrationConfig {
  const { legacySupport, ...newConfig } = legacyConfig;
  return newConfig;
}

// Type guard for legacy config
export function isLegacyConfig(
  config: unknown
): config is SEOIntegrationConfig | FallbackIntegrationConfig {
  return (
    typeof config === 'object' &&
    config !== null &&
    'legacySupport' in config &&
    typeof (config as any).legacySupport === 'boolean'
  );
}
