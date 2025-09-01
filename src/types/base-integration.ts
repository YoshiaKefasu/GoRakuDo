// ========== BASE INTEGRATION TYPE DEFINITIONS ==========
// Strict TypeScript mode compliant type definitions for base integration system
// Extends existing types.ts and fallback-system.ts patterns (DRY principle)

import type { SEOAnalysis, AIProcessingResult } from '../utils/ai/types.js';
import type { FallbackResult, FallbackMetadata } from './fallback-system.js';

/**
 * SEOシステム統合設定
 * 既存のSEO最適化システムとの連携設定
 */
export interface SEOIntegrationConfig {
  readonly enabled: boolean;                    // 既存SEOシステムとの連携有効化
  readonly apiEndpoint: string;                 // 既存SEOシステムのAPIエンドポイント
  readonly timeout: number;                     // 連携タイムアウト設定
  readonly maxRetries: number;                  // 最大リトライ回数
  readonly qualityThreshold: number;            // 品質閾値（0-100）
}

/**
 * Fallbackシステム統合設定
 * Story 4B Fallbackシステムとの連携設定
 */
export interface FallbackIntegrationConfig {
  readonly enabled: boolean;                    // Fallbackシステムとの連携有効化
  readonly fallbackEndpoint: string;            // Fallbackシステムのエンドポイント
  readonly timeout: number;                     // 連携タイムアウト設定
  readonly priority: 'manual' | 'auto' | 'fallback' | 'default';
  readonly confidenceThreshold: number;         // 信頼度閾値（0-1）
}

/**
 * データフロー設定
 * メタデータとSEO最適化データの流れ設定
 */
export interface DataFlowConfig {
  readonly metadataFlow: boolean;               // メタデータフローの有効化
  readonly seoFlow: boolean;                    // SEO最適化フローの有効化
  readonly validation: boolean;                 // データ検証の有効化
  readonly fallbackEnabled: boolean;            // Fallback機能の有効化
  readonly qualityMonitoring: boolean;          // 品質監視の有効化
}

/**
 * 基盤統合設定
 * 既存システムとの統合設定の完全な定義
 */
export interface BaseIntegrationConfig {
  readonly seoSystem: SEOIntegrationConfig;
  readonly fallbackSystem: FallbackIntegrationConfig;
  readonly dataFlow: DataFlowConfig;
  readonly environment: 'development' | 'staging' | 'production';
  readonly version: string;
}

/**
 * SEOシステム統合結果
 * 既存SEOシステムとの連携結果
 */
export interface SEOIntegrationResult {
  readonly status: 'connected' | 'disconnected' | 'error' | 'disabled';
  readonly endpoint?: string;
  readonly timeout?: number;
  readonly lastConnected?: Date;
  readonly errorMessage?: string;
  readonly seoAnalysis?: SEOAnalysis;
  readonly processingResult?: AIProcessingResult;
}

/**
 * Fallbackシステム統合結果
 * Story 4B Fallbackシステムとの連携結果
 */
export interface FallbackIntegrationResult {
  readonly status: 'connected' | 'disconnected' | 'error' | 'disabled';
  readonly endpoint?: string;
  readonly timeout?: number;
  readonly lastConnected?: Date;
  readonly errorMessage?: string;
  readonly fallbackResult?: FallbackResult;
  readonly metadata?: FallbackMetadata;
}

/**
 * データフロー結果
 * メタデータとSEO最適化データの流れ結果
 */
export interface DataFlowResult {
  readonly metadataFlow: boolean;
  readonly seoFlow: boolean;
  readonly validation: boolean;
  readonly flowStatus: 'active' | 'inactive' | 'error';
  readonly lastProcessed?: Date;
  readonly processedCount: number;
  readonly errorCount: number;
}

/**
 * 統合品質測定結果
 * 基盤統合の品質と安定性の測定結果
 */
export interface IntegrationQualityResult {
  readonly overall: number;                     // 総合品質スコア（0-100）
  readonly seoQuality: number;                  // SEO統合品質（0-100）
  readonly fallbackQuality: number;             // Fallback統合品質（0-100）
  readonly dataFlowQuality: number;             // データフロー品質（0-100）
  readonly stability: number;                   // 統合安定性スコア（0-100）
  readonly performance: number;                 // パフォーマンススコア（0-100）
  readonly lastMeasured: Date;
  readonly recommendations: readonly string[];
}

/**
 * 基盤統合結果
 * 完全な統合結果と品質測定結果
 */
export interface BaseIntegrationResult {
  readonly success: boolean;                    // 統合成功フラグ
  readonly seoIntegration: SEOIntegrationResult;
  readonly fallbackIntegration: FallbackIntegrationResult;
  readonly dataFlow: DataFlowResult;
  readonly quality: IntegrationQualityResult;
  readonly timestamp: Date;
  readonly version: string;
  readonly issues: readonly string[];           // 統合時の問題点
  readonly warnings: readonly string[];         // 統合時の警告
}

/**
 * 統合エラーコンテキスト
 * 既存のErrorContextパターンを活用（DRY原則）
 */
export interface IntegrationErrorContext {
  readonly system: 'seo' | 'fallback' | 'dataFlow';
  readonly action: string;
  readonly timestamp: number;
  readonly component: string;
}

/**
 * 統合バリデーションルール
 * 既存のValidationRuleパターンを活用（DRY原則）
 */
export interface IntegrationValidationRule {
  readonly system: 'seo' | 'fallback' | 'dataFlow';
  readonly validator: (config: unknown) => boolean;
  readonly message: string;
  readonly isRequired: boolean;
}

/**
 * 統合バリデーション結果
 * 既存のMetadataValidationResultパターンを活用（DRY原則）
 */
export interface IntegrationValidationResult {
  readonly isValid: boolean;
  readonly errors: IntegrationValidationError[];
  readonly warnings: IntegrationValidationWarning[];
  readonly seoSystem: ValidationResult;
  readonly fallbackSystem: ValidationResult;
  readonly dataFlow: ValidationResult;
}

/**
 * 統合バリデーションエラー
 * 既存のValidationErrorパターンを活用（DRY原則）
 */
export interface IntegrationValidationError {
  readonly system: 'seo' | 'fallback' | 'dataFlow';
  readonly field: string;
  readonly message: string;
  readonly code: string;
}

/**
 * 統合バリデーション警告
 * 既存のValidationWarningパターンを活用（DRY原則）
 */
export interface IntegrationValidationWarning {
  readonly system: 'seo' | 'fallback' | 'dataFlow';
  readonly field: string;
  readonly message: string;
  readonly code: string;
}

/**
 * 個別システムバリデーション結果
 * 既存のValidationResultパターンを活用（DRY原則）
 */
export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: string[];
  readonly warnings: string[];
}

// ========== DEFAULT CONFIGURATION ==========
// Centralized configuration values following DRY principle

export const DEFAULT_BASE_INTEGRATION_CONFIG: BaseIntegrationConfig = {
  seoSystem: {
    enabled: true,
    apiEndpoint: '/api/seo',
    timeout: 5000,
    maxRetries: 3,
    qualityThreshold: 80
  },
  fallbackSystem: {
    enabled: true,
    fallbackEndpoint: '/api/fallback',
    timeout: 5000,
    priority: 'fallback',
    confidenceThreshold: 0.8
  },
  dataFlow: {
    metadataFlow: true,
    seoFlow: true,
    validation: true,
    fallbackEnabled: true,
    qualityMonitoring: true
  },
  environment: 'development',
  version: '1.0.0'
};
