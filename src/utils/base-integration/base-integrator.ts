// ========== BASE INTEGRATION MAIN SYSTEM ==========
// Main integration system following DRY + KISS principles
// Integrates existing SEO system, Fallback system, and data flow

import type {
  IntegrationConfig,
  IntegrationResult,
  SEOIntegrationResult,
  FallbackIntegrationResult,
  DataFlowResult,
  IntegrationQualityResult
} from '../../types/new-seo-system/integration-types.js';

import { SEOConnector } from './seo-connector.js';
import { FallbackConnector } from './fallback-connector.js';
import { DataFlowBuilder } from './data-flow-builder.js';
import { QualityMeasurer } from './quality-measurer.js';

/**
 * 基盤統合メインシステム
 * 既存システムとの安全な基盤統合を実現
 */
export class BaseIntegrator {
  private config: IntegrationConfig;
  private seoConnector: SEOConnector;
  private fallbackConnector: FallbackConnector;
  private dataFlowBuilder: DataFlowBuilder;
  private qualityMeasurer: QualityMeasurer;

  constructor(config: IntegrationConfig) {
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
  async integrateBaseSystems(): Promise<IntegrationResult> {
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
      const result: IntegrationResult = {
        success: quality.overall >= 80 && quality.stability >= 80,
        status: 'connected',
        timestamp: new Date(),
        seoIntegration,
        fallbackIntegration,
        dataFlow,
        quality,
        version: this.config.version
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
    const timestamp = new Date();
    if (!this.config.seoSystem.enabled) {
      return {
        success: false,
        status: 'disabled',
        timestamp
      };
    }

    try {
      const result = await this.seoConnector.connect();
      const response: SEOIntegrationResult = {
        success: result.status === 'connected',
        status: result.status,
        timestamp
      };

      // Handle optional properties with exactOptionalPropertyTypes
      if (result.endpoint !== undefined) {
        (response as any).endpoint = result.endpoint;
      }
      if (result.lastConnected !== undefined) {
        (response as any).lastConnected = result.lastConnected;
      }
      if (result.errorMessage !== undefined) {
        (response as any).errorMessage = result.errorMessage;
      }

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const response: SEOIntegrationResult = {
        success: false,
        status: 'error',
        timestamp
      };

      // Handle optional errorMessage property with exactOptionalPropertyTypes
      if (errorMessage !== undefined) {
        (response as any).errorMessage = errorMessage;
      }

      return response;
    }
  }

  /**
   * Fallbackシステム統合
   * Story 4B Fallbackシステムとの基盤連携
   */
  private async integrateFallbackSystem(): Promise<FallbackIntegrationResult> {
    const timestamp = new Date();
    if (!this.config.fallbackSystem.enabled) {
      return {
        success: false,
        status: 'disabled',
        timestamp
      };
    }

    try {
      const result = await this.fallbackConnector.connect();
      const response: FallbackIntegrationResult = {
        success: result.status === 'connected',
        status: result.status,
        timestamp
      };

      // Handle optional properties with exactOptionalPropertyTypes
      if (result.endpoint !== undefined) {
        (response as any).endpoint = result.endpoint;
      }
      if (result.lastConnected !== undefined) {
        (response as any).lastConnected = result.lastConnected;
      }
      if (result.errorMessage !== undefined) {
        (response as any).errorMessage = result.errorMessage;
      }

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const response: FallbackIntegrationResult = {
        success: false,
        status: 'error',
        timestamp
      };

      // Handle optional errorMessage property with exactOptionalPropertyTypes
      if (errorMessage !== undefined) {
        (response as any).errorMessage = errorMessage;
      }

      return response;
    }
  }

  /**
   * データフロー構築
   * 既存のデータフローパターンを活用した基盤構築
   */
  private async buildDataFlow(): Promise<DataFlowResult> {
    const timestamp = new Date();
    try {
      const result = await this.dataFlowBuilder.build();
      const response: DataFlowResult = {
        success: result.flowStatus === 'active',
        status: result.flowStatus === 'active' ? 'connected' : 'error',
        timestamp,
        metadataFlow: result.metadataFlow,
        seoFlow: result.seoFlow,
        validation: result.validation,
        flowStatus: result.flowStatus,
        processedCount: result.processedCount,
        errorCount: result.errorCount
      };

      // Handle optional lastProcessed property with exactOptionalPropertyTypes
      if (result.lastProcessed !== undefined) {
        (response as any).lastProcessed = result.lastProcessed;
      }

      return response;
    } catch (error) {
      return {
        success: false,
        status: 'error',
        timestamp,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
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
   * 統合フォールバック生成
   * 統合失敗時のフォールバック処理
   */
  private generateIntegrationFallback(error: Error): IntegrationResult {
    const timestamp = new Date();
    return {
      success: false,
      status: 'error',
      timestamp,
      seoIntegration: {
        success: false,
        status: 'error',
        timestamp,
        errorMessage: error.message
      },
      fallbackIntegration: {
        success: false,
        status: 'error',
        timestamp,
        errorMessage: error.message
      },
      dataFlow: {
        success: false,
        status: 'error',
        timestamp,
        errorMessage: error.message,
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
        lastMeasured: timestamp,
        recommendations: ['Check system configuration', 'Verify existing system status']
      },
      version: this.config.version
    };
  }

  /**
   * 設定の更新
   * 統合設定の動的更新
   */
  updateConfig(newConfig: Partial<IntegrationConfig>): void {
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
export async function integrateBaseSystems(config: IntegrationConfig): Promise<IntegrationResult> {
  const integrator = new BaseIntegrator(config);
  return integrator.integrateBaseSystems();
}
