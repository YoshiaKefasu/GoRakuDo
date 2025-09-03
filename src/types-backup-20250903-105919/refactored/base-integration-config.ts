// ========== BASE INTEGRATION CONFIG ==========
/**
 * Base Integration Configuration Interface
 * Implements DRY principle by extracting common fields from integration interfaces
 *
 * This interface serves as the foundation for:
 * - SEOIntegrationConfig (base-integration.ts)
 * - FallbackIntegrationConfig (base-integration.ts)
 * - QualityGateConfig (advanced-optimization.ts)
 * - TestCleanupConfig (advanced-optimization.ts)
 */

// ========== COMMON BASE INTERFACE ==========

/**
 * Base Integration Configuration
 * Common fields shared across all integration configurations
 * DRY principle: Extracted from SEOIntegrationConfig and FallbackIntegrationConfig
 */
export interface BaseIntegrationConfig {
  /** Integration enable/disable flag */
  readonly enabled: boolean;

  /** Timeout setting in milliseconds */
  readonly timeout: number;
}

// ========== EXTENDED INTEGRATION INTERFACES ==========

/**
 * SEO Integration Configuration
 * Extends BaseIntegrationConfig with SEO-specific fields
 */
export interface SEOIntegrationConfig extends BaseIntegrationConfig {
  /** SEO API endpoint URL */
  readonly apiEndpoint: string;

  /** Maximum retry attempts */
  readonly maxRetries: number;

  /** Quality threshold (0-100) */
  readonly qualityThreshold: number;
}

/**
 * Fallback Integration Configuration
 * Extends BaseIntegrationConfig with fallback-specific fields
 */
export interface FallbackIntegrationConfig extends BaseIntegrationConfig {
  /** Fallback endpoint URL */
  readonly fallbackEndpoint: string;

  /** Priority level for fallback execution */
  readonly priority: 'manual' | 'auto' | 'fallback' | 'default';

  /** Confidence threshold (0-1) */
  readonly confidenceThreshold: number;
}

/**
 * Quality Gate Configuration
 * Extends BaseIntegrationConfig with quality monitoring fields
 */
export interface QualityGateConfig extends BaseIntegrationConfig {
  /** Quality threshold value */
  readonly threshold: number;

  /** Metrics to monitor */
  readonly metrics: readonly string[];

  /** Auto-adjustment enable flag */
  readonly autoAdjust: boolean;
}

/**
 * Test Cleanup Configuration
 * Extends BaseIntegrationConfig with cleanup-specific fields
 */
export interface TestCleanupConfig extends BaseIntegrationConfig {
  /** Cleanup interval in milliseconds */
  readonly cleanupInterval: number;

  /** Retention period in days */
  readonly retentionPeriod: number;

  /** Archive enable flag */
  readonly archiveEnabled: boolean;
}

// ========== COMPOSITE CONFIGURATIONS ==========

/**
 * Complete Integration Configuration
 * Combines all integration types into a single configuration object
 */
export interface CompleteIntegrationConfig {
  /** SEO integration settings */
  readonly seo: SEOIntegrationConfig;

  /** Fallback integration settings */
  readonly fallback: FallbackIntegrationConfig;

  /** Quality gate settings */
  readonly quality: QualityGateConfig;

  /** Test cleanup settings */
  readonly cleanup: TestCleanupConfig;

  /** Environment identifier */
  readonly environment: 'development' | 'staging' | 'production';

  /** Configuration version */
  readonly version: string;
}

// ========== UTILITY FUNCTIONS ==========

/**
 * Create a default BaseIntegrationConfig
 * Factory function for creating base integration configurations
 */
export function createBaseIntegrationConfig(
  enabled: boolean = false,
  timeout: number = 5000
): BaseIntegrationConfig {
  return {
    enabled,
    timeout,
  };
}

/**
 * Validate BaseIntegrationConfig
 * Type guard function to ensure configuration validity
 */
export function isValidBaseIntegrationConfig(
  config: unknown
): config is BaseIntegrationConfig {
  return (
    typeof config === 'object' &&
    config !== null &&
    typeof (config as BaseIntegrationConfig).enabled === 'boolean' &&
    typeof (config as BaseIntegrationConfig).timeout === 'number' &&
    (config as BaseIntegrationConfig).timeout > 0
  );
}

/**
 * Merge BaseIntegrationConfig with overrides
 * Utility function for configuration merging
 */
export function mergeBaseIntegrationConfig(
  base: BaseIntegrationConfig,
  overrides: Partial<BaseIntegrationConfig>
): BaseIntegrationConfig {
  return {
    enabled: overrides.enabled ?? base.enabled,
    timeout: overrides.timeout ?? base.timeout,
  };
}
