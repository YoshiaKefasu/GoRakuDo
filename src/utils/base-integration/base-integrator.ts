// ========== BASE INTEGRATION MAIN SYSTEM ==========
// Main integration system following DRY + KISS principles
// Integrates existing SEO system, Fallback system, and data flow

import type { 
  BaseIntegrationConfig, 
  BaseIntegrationResult, 
  SEOIntegrationResult, 
  FallbackIntegrationResult, 
  DataFlowResult,
  IntegrationQualityResult 
} from '../../types/base-integration.js';

import { SEOConnector } from './seo-connector.js';
import { FallbackConnector } from './fallback-connector.js';
import { DataFlowBuilder } from './data-flow-builder.js';
import { QualityMeasurer } from './quality-measurer.js';

/**
 * 基盤統合メインシステム
 * 既存システムとの安全な基盤統合を実現
 */
export class BaseIntegrator {
  private config: BaseIntegrationConfig;
  private seoConnector: SEOConnector;
  private fallbackConnector: FallbackConnector;
  private dataFlowBuilder: DataFlowBuilder;
  private qualityMeasurer: QualityMeasurer;

  constructor(config: BaseIntegrationConfig) {
    this.config = config;
    this.seoConnector = new SEOConnector(config.seoSystem);
    this.fallbackConnector = new FallbackConnector(config.fallbackSystem);
    this.dataFlowBuilder = new DataFlowBuilder(config.dataFlow);
    this.qualityMeasurer = new QualityMeasurer();
  }

  /**
   * 基盤統合の実行
   * 既存システムとの安全な統合を段階的に実行
   */
  async integrateBaseSystems(): Promise<BaseIntegrationResult> {
    try {
      // Phase 1: SEOシステム統合
      const seoIntegration = await this.integrateSEOSystem();
      
      // Phase 2: Fallbackシステム統合
      const fallbackIntegration = await this.integrateFallbackSystem();
      
      // Phase 3: データフロー統合
      const dataFlow = await this.buildDataFlow();
      
      // Phase 4: 品質測定
      const quality = await this.measureIntegrationQuality({
        seo: seoIntegration,
        fallback: fallbackIntegration,
        dataFlow: dataFlow
      });

      // 統合結果の生成
      const result: BaseIntegrationResult = {
        success: quality.overall >= 80 && quality.stability >= 80,
        seoIntegration,
        fallbackIntegration,
        dataFlow,
        quality,
        timestamp: new Date(),
        version: this.config.version,
        issues: this.collectIssues(seoIntegration, fallbackIntegration, dataFlow),
        warnings: this.collectWarnings(seoIntegration, fallbackIntegration, dataFlow)
      };

      return result;
    } catch (error) {
      // エラー時のフォールバック処理
      return this.generateIntegrationFallback(error as Error);
    }
  }

  /**
   * SEOシステム統合
   * 既存のSEO最適化システムとの基盤連携
   */
  private async integrateSEOSystem(): Promise<SEOIntegrationResult> {
    if (!this.config.seoSystem.enabled) {
      return { status: 'disabled' };
    }

    try {
      return await this.seoConnector.connect();
    } catch (error) {
      return {
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Fallbackシステム統合
   * Story 4B Fallbackシステムとの基盤連携
   */
  private async integrateFallbackSystem(): Promise<FallbackIntegrationResult> {
    if (!this.config.fallbackSystem.enabled) {
      return { status: 'disabled' };
    }

    try {
      return await this.fallbackConnector.connect();
    } catch (error) {
      return {
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * データフロー構築
   * 既存のデータフローパターンを活用した基盤構築
   */
  private async buildDataFlow(): Promise<DataFlowResult> {
    try {
      return await this.dataFlowBuilder.build();
    } catch (error) {
      return {
        metadataFlow: false,
        seoFlow: false,
        validation: false,
        flowStatus: 'error',
        processedCount: 0,
        errorCount: 1
      };
    }
  }

  /**
   * 統合品質測定
   * 既存の品質測定パターンを活用
   */
  private async measureIntegrationQuality(params: {
    seo: SEOIntegrationResult;
    fallback: FallbackIntegrationResult;
    dataFlow: DataFlowResult;
  }): Promise<IntegrationQualityResult> {
    return this.qualityMeasurer.measure(params);
  }

  /**
   * 問題点の収集
   * 統合時の問題点を収集
   */
  private collectIssues(
    seo: SEOIntegrationResult,
    fallback: FallbackIntegrationResult,
    dataFlow: DataFlowResult
  ): string[] {
    const issues: string[] = [];

    if (seo.status === 'error') {
      issues.push(`SEO system integration failed: ${seo.errorMessage}`);
    }

    if (fallback.status === 'error') {
      issues.push(`Fallback system integration failed: ${fallback.errorMessage}`);
    }

    if (dataFlow.flowStatus === 'error') {
      issues.push('Data flow construction failed');
    }

    return issues;
  }

  /**
   * 警告の収集
   * 統合時の警告を収集
   */
  private collectWarnings(
    seo: SEOIntegrationResult,
    fallback: FallbackIntegrationResult,
    dataFlow: DataFlowResult
  ): string[] {
    const warnings: string[] = [];

    if (seo.status === 'disconnected') {
      warnings.push('SEO system is disconnected');
    }

    if (fallback.status === 'disconnected') {
      warnings.push('Fallback system is disconnected');
    }

    if (dataFlow.errorCount > 0) {
      warnings.push(`Data flow has ${dataFlow.errorCount} errors`);
    }

    return warnings;
  }

  /**
   * 統合フォールバック生成
   * 統合失敗時のフォールバック処理
   */
  private generateIntegrationFallback(error: Error): BaseIntegrationResult {
    return {
      success: false,
      seoIntegration: { 
        status: 'error', 
        errorMessage: error.message 
      },
      fallbackIntegration: { 
        status: 'error', 
        errorMessage: error.message 
      },
      dataFlow: { 
        metadataFlow: false,
        seoFlow: false,
        validation: false,
        flowStatus: 'error',
        processedCount: 0,
        errorCount: 1
      },
      quality: {
        overall: 0,
        seoQuality: 0,
        fallbackQuality: 0,
        dataFlowQuality: 0,
        stability: 0,
        performance: 0,
        lastMeasured: new Date(),
        recommendations: ['Check system configuration', 'Verify existing system status']
      },
      timestamp: new Date(),
      version: this.config.version,
      issues: [error.message],
      warnings: ['Integration fallback mode activated']
    };
  }

  /**
   * 設定の更新
   * 統合設定の動的更新
   */
  updateConfig(newConfig: Partial<BaseIntegrationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // 各コンポーネントの設定を更新
    if (newConfig.seoSystem) {
      this.seoConnector.updateConfig(newConfig.seoSystem);
    }
    
    if (newConfig.fallbackSystem) {
      this.fallbackConnector.updateConfig(newConfig.fallbackSystem);
    }
    
    if (newConfig.dataFlow) {
      this.dataFlowBuilder.updateConfig(newConfig.dataFlow);
    }
  }

  /**
   * 統合状態の取得
   * 現在の統合状態を取得
   */
  getIntegrationStatus(): {
    seoStatus: string;
    fallbackStatus: string;
    dataFlowStatus: string;
  } {
    return {
      seoStatus: this.seoConnector.getStatus(),
      fallbackStatus: this.fallbackConnector.getStatus(),
      dataFlowStatus: this.dataFlowBuilder.getDataFlowStatus().isConfigured ? 'configured' : 'not-configured'
    };
  }
}

/**
 * 基盤統合関数
 * 既存の統合パターンを活用した統合関数
 */
export async function integrateBaseSystems(config: BaseIntegrationConfig): Promise<BaseIntegrationResult> {
  const integrator = new BaseIntegrator(config);
  return integrator.integrateBaseSystems();
}
