// ========== ADVANCED OPTIMIZATION TYPE DEFINITIONS ==========
// Strict TypeScript mode compliant type definitions for advanced optimization system
// Now imports from new unified validation system (DRY principle)

// Re-export types from unified validation system for backward compatibility
// This maintains existing import paths while using the new unified system

export type {
  AdvancedOptimizationConfig,
  AdvancedOptimizationResult,
  StructuredDataConfig,
  StructuredDataResult,
  QualityGateConfig,
  QualityGateResult,
  TestCleanupConfig,
  TestCleanupResult,
  RedundantFileInfo
} from './new-seo-system/validation-types.js';

// Import types to ensure they are used (prevents unused import warnings)
import type { AdvancedOptimizationConfig as _AdvancedOptimizationConfig } from './new-seo-system/validation-types.js';
import type { QualityGateConfig as _QualityGateConfig } from './new-seo-system/validation-types.js';
import type { TestCleanupConfig as _TestCleanupConfig } from './new-seo-system/validation-types.js';

// Additional types specific to advanced optimization
export interface AdvancedQualityMonitoringConfig {
  readonly realTime: boolean;
  readonly autoDetection: boolean;
  readonly metrics: readonly string[];
  readonly thresholds: Record<string, number>;
}

export interface AdvancedQualityMonitoringResult {
  readonly status: 'active' | 'inactive' | 'error';
  readonly metrics: Record<string, number>;
  readonly issues: readonly string[];
  readonly recommendations: readonly string[];
}

export interface AlgorithmEnhancementConfig {
  readonly machineLearning: boolean;
  readonly userBehavior: boolean;
  readonly optimizationLevel: 'basic' | 'advanced' | 'expert';
  readonly adaptiveLearning: boolean;
}

export interface AlgorithmEnhancementResult {
  readonly success: boolean;
  readonly enhancement: number; // 0-100
  readonly improvements: readonly string[];
  readonly performance: Record<string, number>;
}

export interface PhaseCompletionStatus {
  readonly phase: 'phase5' | 'phase6';
  readonly status: 'pending' | 'in-progress' | 'completed' | 'failed';
  readonly completionDate?: string;
  readonly qualityScore?: number;
  readonly issues?: readonly string[];
}

export interface PhaseQualityGate {
  readonly phase: 'phase5' | 'phase6';
  readonly passed: boolean;
  readonly score: number;
  readonly requirements: readonly string[];
  readonly completedRequirements: readonly string[];
  readonly missingRequirements: readonly string[];
}


