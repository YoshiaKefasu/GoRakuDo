// ========== QUALITY MEASURER ==========
// Measures integration quality using existing patterns following DRY principle
// Integrates with existing quality measurement patterns

import type { 
  IntegrationQualityResult, 
  SEOIntegrationResult, 
  FallbackIntegrationResult, 
  DataFlowResult 
} from '../../types/base-integration.js';

/**
 * 品質測定モジュール
 * 既存の品質測定パターンを活用した統合品質測定
 */
export class QualityMeasurer {
  
  // Phase 4.1: 統合品質基準の設定
  private QUALITY_THRESHOLDS = {
    // 既存の品質基準パターンを活用（DRY原則）
    seo: {
      minScore: 80,
      targetScore: 90,
      criticalScore: 60
    },
    fallback: {
      minScore: 80,
      targetScore: 90,
      criticalScore: 60
    },
    dataFlow: {
      minScore: 80,
      targetScore: 90,
      criticalScore: 60
    },
    overall: {
      minScore: 80,
      targetScore: 90,
      criticalScore: 60
    },
    stability: {
      minScore: 85,
      targetScore: 95,
      criticalScore: 70
    },
    performance: {
      minScore: 75,
      targetScore: 85,
      criticalScore: 50
    }
  };

  constructor() {
    // 品質測定の初期化
    this.initializeQualityMonitoring();
  }

  // 品質監視の基盤設定
  private readonly MONITORING_CONFIG = {
    continuous: true,
    alertThreshold: 0.8, // 80%以下でアラート
    improvementThreshold: 0.9, // 90%以上で改善検討
    measurementInterval: 1000 // 1秒間隔
  };

  /**
   * 品質監視の初期化
   * 既存の監視パターンを活用（DRY原則）
   */
  private initializeQualityMonitoring(): void {
    console.log('🔍 Initializing quality monitoring system...');
    console.log(`📊 Quality thresholds: ${JSON.stringify(this.QUALITY_THRESHOLDS, null, 2)}`);
    console.log(`📊 Monitoring config: ${JSON.stringify(this.MONITORING_CONFIG, null, 2)}`);
    console.log('✅ Quality monitoring system initialized');
  }

  /**
   * 統合品質基準の取得
   * 既存の品質基準パターンを活用（DRY原則）
   */
  getQualityThresholds(): typeof this.QUALITY_THRESHOLDS {
    return { ...this.QUALITY_THRESHOLDS };
  }

  /**
   * 品質基準の動的更新
   * 既存の品質基準パターンを活用（DRY原則）
   */
  updateQualityThresholds(newThresholds: Partial<typeof this.QUALITY_THRESHOLDS>): void {
    this.QUALITY_THRESHOLDS = { ...this.QUALITY_THRESHOLDS, ...newThresholds };
    console.log('📊 Quality thresholds updated:', this.QUALITY_THRESHOLDS);
  }

  /**
   * 品質基準の適合性チェック
   * 既存の品質基準パターンを活用（DRY原則）
   */
  checkQualityCompliance(qualityResult: IntegrationQualityResult): {
    isCompliant: boolean;
    complianceScore: number;
    violations: string[];
    recommendations: string[];
  } {
    const violations: string[] = [];
    const recommendations: string[] = [];

    // SEO品質の適合性チェック
    if (qualityResult.seoQuality < this.QUALITY_THRESHOLDS.seo.minScore) {
      violations.push(`SEO quality below minimum threshold: ${qualityResult.seoQuality} < ${this.QUALITY_THRESHOLDS.seo.minScore}`);
    }

    // Fallback品質の適合性チェック
    if (qualityResult.fallbackQuality < this.QUALITY_THRESHOLDS.fallback.minScore) {
      violations.push(`Fallback quality below minimum threshold: ${qualityResult.fallbackQuality} < ${this.QUALITY_THRESHOLDS.fallback.minScore}`);
    }

    // データフロー品質の適合性チェック
    if (qualityResult.dataFlowQuality < this.QUALITY_THRESHOLDS.dataFlow.minScore) {
      violations.push(`Data flow quality below minimum threshold: ${qualityResult.dataFlowQuality} < ${this.QUALITY_THRESHOLDS.dataFlow.minScore}`);
    }

    // 総合品質の適合性チェック
    if (qualityResult.overall < this.QUALITY_THRESHOLDS.overall.minScore) {
      violations.push(`Overall quality below minimum threshold: ${qualityResult.overall} < ${this.QUALITY_THRESHOLDS.overall.minScore}`);
    }

    // 安定性の適合性チェック
    if (qualityResult.stability < this.QUALITY_THRESHOLDS.stability.minScore) {
      violations.push(`Stability below minimum threshold: ${qualityResult.stability} < ${this.QUALITY_THRESHOLDS.stability.minScore}`);
    }

    // パフォーマンスの適合性チェック
    if (qualityResult.performance < this.QUALITY_THRESHOLDS.performance.minScore) {
      violations.push(`Performance below minimum threshold: ${qualityResult.performance} < ${this.QUALITY_THRESHOLDS.performance.minScore}`);
    }

    // 改善推奨事項の生成
    if (qualityResult.seoQuality < this.QUALITY_THRESHOLDS.seo.targetScore) {
      recommendations.push('Consider improving SEO system integration quality');
    }

    if (qualityResult.fallbackQuality < this.QUALITY_THRESHOLDS.fallback.targetScore) {
      recommendations.push('Consider improving fallback system integration quality');
    }

    if (qualityResult.dataFlowQuality < this.QUALITY_THRESHOLDS.dataFlow.targetScore) {
      recommendations.push('Consider improving data flow integration quality');
    }

    if (qualityResult.stability < this.QUALITY_THRESHOLDS.stability.targetScore) {
      recommendations.push('Consider improving system integration stability');
    }

    if (qualityResult.performance < this.QUALITY_THRESHOLDS.performance.targetScore) {
      recommendations.push('Consider optimizing integration performance');
    }

    // 適合性スコアの計算
    const complianceScore = this.calculateComplianceScore(qualityResult);
    const isCompliant = violations.length === 0;

    return {
      isCompliant,
      complianceScore,
      violations,
      recommendations
    };
  }

  /**
   * 適合性スコアの計算
   * 既存の品質測定パターンを活用（DRY原則）
   */
  private calculateComplianceScore(qualityResult: IntegrationQualityResult): number {
    let totalScore = 0;
    let maxScore = 0;

    // SEO品質の適合性スコア
    const seoScore = Math.max(0, Math.min(100, (qualityResult.seoQuality / this.QUALITY_THRESHOLDS.seo.minScore) * 100));
    totalScore += seoScore;
    maxScore += 100;

    // Fallback品質の適合性スコア
    const fallbackScore = Math.max(0, Math.min(100, (qualityResult.fallbackQuality / this.QUALITY_THRESHOLDS.fallback.minScore) * 100));
    totalScore += fallbackScore;
    maxScore += 100;

    // データフロー品質の適合性スコア
    const dataFlowScore = Math.max(0, Math.min(100, (qualityResult.dataFlowQuality / this.QUALITY_THRESHOLDS.dataFlow.minScore) * 100));
    totalScore += dataFlowScore;
    maxScore += 100;

    // 総合品質の適合性スコア
    const overallScore = Math.max(0, Math.min(100, (qualityResult.overall / this.QUALITY_THRESHOLDS.overall.minScore) * 100));
    totalScore += overallScore;
    maxScore += 100;

    // 安定性の適合性スコア
    const stabilityScore = Math.max(0, Math.min(100, (qualityResult.stability / this.QUALITY_THRESHOLDS.stability.minScore) * 100));
    totalScore += stabilityScore;
    maxScore += 100;

    // パフォーマンスの適合性スコア
    const performanceScore = Math.max(0, Math.min(100, (qualityResult.performance / this.QUALITY_THRESHOLDS.performance.minScore) * 100));
    totalScore += performanceScore;
    maxScore += 100;

    return Math.round((totalScore / maxScore) * 100);
  }

  /**
   * 統合品質の測定
   * 既存の品質測定パターンを活用
   */
  async measure(params: {
    seo: SEOIntegrationResult;
    fallback: FallbackIntegrationResult;
    dataFlow: DataFlowResult;
  }): Promise<IntegrationQualityResult> {
    try {
      // 各システムの品質を個別に測定
      const seoQuality = this.measureSEOSystemQuality(params.seo);
      const fallbackQuality = this.measureFallbackSystemQuality(params.fallback);
      const dataFlowQuality = this.measureDataFlowQuality(params.dataFlow);
      
      // 統合安定性の測定
      const stability = this.measureIntegrationStability(params);
      
      // パフォーマンスの測定
      const performance = this.measureIntegrationPerformance(params);
      
      // 総合品質スコアの計算
      const overall = this.calculateOverallQuality({
        seoQuality,
        fallbackQuality,
        dataFlowQuality,
        stability,
        performance
      });
      
      // 改善推奨事項の生成
      const recommendations = this.generateRecommendations({
        seoQuality,
        fallbackQuality,
        dataFlowQuality,
        stability,
        performance
      });

      return {
        overall,
        seoQuality,
        fallbackQuality,
        dataFlowQuality,
        stability,
        performance,
        lastMeasured: new Date(),
        recommendations
      };
    } catch (error) {
      console.error('Quality measurement failed:', error);
      
      // エラー時のフォールバック品質測定
      return this.generateFallbackQualityMeasurement();
    }
  }

  /**
   * SEOシステム品質の測定
   * 既存の品質測定パターンを活用
   */
  private measureSEOSystemQuality(seo: SEOIntegrationResult): number {
    try {
      let score = 0;
      
      // 接続状態による品質評価
      switch (seo.status) {
        case 'connected':
          score = 100; // 完全接続
          break;
        case 'disconnected':
          score = 50;  // 部分接続
          break;
        case 'error':
          score = 0;   // エラー状態
          break;
        case 'disabled':
          score = 75;  // 無効化（意図的な設定）
          break;
        default:
          score = 0;
      }
      
      // エラーメッセージがある場合は減点
      if (seo.errorMessage) {
        score = Math.max(0, score - 20);
      }
      
      // 接続時刻による品質評価
      if (seo.lastConnected) {
        const timeSinceConnection = Date.now() - seo.lastConnected.getTime();
        const hoursSinceConnection = timeSinceConnection / (1000 * 60 * 60);
        
        // 24時間以内の接続は品質維持
        if (hoursSinceConnection <= 24) {
          score = Math.min(100, score + 10);
        } else if (hoursSinceConnection <= 72) {
          // 72時間以内は品質維持
          score = score;
        } else {
          // 72時間以上経過は品質低下
          score = Math.max(0, score - 20);
        }
      }
      
      return Math.round(score);
    } catch (error) {
      console.error('SEO system quality measurement failed:', error);
      return 0;
    }
  }

  /**
   * Fallbackシステム品質の測定
   * 既存の品質測定パターンを活用
   */
  private measureFallbackSystemQuality(fallback: FallbackIntegrationResult): number {
    try {
      let score = 0;
      
      // 接続状態による品質評価
      switch (fallback.status) {
        case 'connected':
          score = 100; // 完全接続
          break;
        case 'disconnected':
          score = 50;  // 部分接続
          break;
        case 'error':
          score = 0;   // エラー状態
          break;
        case 'disabled':
          score = 75;  // 無効化（意図的な設定）
          break;
        default:
          score = 0;
      }
      
      // エラーメッセージがある場合は減点
      if (fallback.errorMessage) {
        score = Math.max(0, score - 20);
      }
      
      // 接続時刻による品質評価
      if (fallback.lastConnected) {
        const timeSinceConnection = Date.now() - fallback.lastConnected.getTime();
        const hoursSinceConnection = timeSinceConnection / (1000 * 60 * 60);
        
        // 24時間以内の接続は品質維持
        if (hoursSinceConnection <= 24) {
          score = Math.min(100, score + 10);
        } else if (hoursSinceConnection <= 72) {
          // 72時間以内は品質維持
          score = score;
        } else {
          // 72時間以上経過は品質低下
          score = Math.max(0, score - 20);
        }
      }
      
      return Math.round(score);
    } catch (error) {
      console.error('Fallback system quality measurement failed:', error);
      return 0;
    }
  }

  /**
   * データフロー品質の測定
   * 既存の品質測定パターンを活用
   */
  private measureDataFlowQuality(dataFlow: DataFlowResult): number {
    try {
      let score = 0;
      
      // フロー状態による品質評価
      switch (dataFlow.flowStatus) {
        case 'active':
          score = 100; // アクティブ状態
          break;
        case 'inactive':
          score = 50;  // 非アクティブ状態
          break;
        case 'error':
          score = 0;   // エラー状態
          break;
        default:
          score = 0;
      }
      
      // 各フローの有効性による品質評価
      if (dataFlow.metadataFlow) score += 20;
      if (dataFlow.seoFlow) score += 20;
      if (dataFlow.validation) score += 20;
      
      // エラー数による品質評価
      if (dataFlow.errorCount === 0) {
        score += 20; // エラーなし
      } else if (dataFlow.errorCount <= 2) {
        score += 10; // エラー少
      } else {
        score = Math.max(0, score - 20); // エラー多
      }
      
      // 処理数による品質評価
      if (dataFlow.processedCount > 0) {
        score += 10; // 処理実績あり
      }
      
      return Math.min(100, Math.round(score));
    } catch (error) {
      console.error('Data flow quality measurement failed:', error);
      return 0;
    }
  }

  /**
   * 統合安定性の測定
   * 既存の安定性測定パターンを活用
   */
  private measureIntegrationStability(params: {
    seo: SEOIntegrationResult;
    fallback: FallbackIntegrationResult;
    dataFlow: DataFlowResult;
  }): number {
    try {
      let stabilityScore = 0;
      
      // 各システムの安定性を評価
      const seoStable = params.seo.status === 'connected' || params.seo.status === 'disabled';
      const fallbackStable = params.fallback.status === 'connected' || params.fallback.status === 'disabled';
      const dataFlowStable = params.dataFlow.flowStatus === 'active';
      
      // 安定性スコアの計算
      if (seoStable) stabilityScore += 40;
      if (fallbackStable) stabilityScore += 40;
      if (dataFlowStable) stabilityScore += 20;
      
      // エラー状態の評価
      const hasErrors = 
        params.seo.status === 'error' ||
        params.fallback.status === 'error' ||
        params.dataFlow.flowStatus === 'error';
      
      if (hasErrors) {
        stabilityScore = Math.max(0, stabilityScore - 30);
      }
      
      return Math.min(100, stabilityScore);
    } catch (error) {
      console.error('Integration stability measurement failed:', error);
      return 0;
    }
  }

  /**
   * 統合パフォーマンスの測定
   * 既存のパフォーマンス測定パターンを活用
   */
  private measureIntegrationPerformance(params: {
    seo: SEOIntegrationResult;
    fallback: FallbackIntegrationResult;
    dataFlow: DataFlowResult;
  }): number {
    try {
      let performanceScore = 0;
      
      // 各システムのパフォーマンスを評価
      const seoPerformance = this.evaluateSystemPerformance(params.seo);
      const fallbackPerformance = this.evaluateSystemPerformance(params.fallback);
      const dataFlowPerformance = this.evaluateDataFlowPerformance(params.dataFlow);
      
      // パフォーマンススコアの計算
      performanceScore = Math.round((seoPerformance + fallbackPerformance + dataFlowPerformance) / 3);
      
      return Math.min(100, performanceScore);
    } catch (error) {
      console.error('Integration performance measurement failed:', error);
      return 0;
    }
  }

  /**
   * システムパフォーマンスの評価
   * 既存のパフォーマンス評価パターンを活用
   */
  private evaluateSystemPerformance(system: SEOIntegrationResult | FallbackIntegrationResult): number {
    try {
      let score = 0;
      
      // 接続状態によるパフォーマンス評価
      switch (system.status) {
        case 'connected':
          score = 100; // 最適パフォーマンス
          break;
        case 'disconnected':
          score = 60;  // 中程度パフォーマンス
          break;
        case 'error':
          score = 0;   // パフォーマンスなし
          break;
        case 'disabled':
          score = 80;  // 無効化（意図的な設定）
          break;
        default:
          score = 0;
      }
      
      // タイムアウト設定によるパフォーマンス評価
      if (system.timeout) {
        if (system.timeout <= 3000) {
          score += 10; // 高速応答
        } else if (system.timeout <= 10000) {
          score += 5;  // 中程度応答
        } else {
          score = Math.max(0, score - 10); // 低速応答
        }
      }
      
      return Math.min(100, score);
    } catch (error) {
      console.error('System performance evaluation failed:', error);
      return 0;
    }
  }

  /**
   * データフローパフォーマンスの評価
   * 既存のパフォーマンス評価パターンを活用
   */
  private evaluateDataFlowPerformance(dataFlow: DataFlowResult): number {
    try {
      let score = 0;
      
      // フロー状態によるパフォーマンス評価
      switch (dataFlow.flowStatus) {
        case 'active':
          score = 100; // 最適パフォーマンス
          break;
        case 'inactive':
          score = 50;  // 中程度パフォーマンス
          break;
        case 'error':
          score = 0;   // パフォーマンスなし
          break;
        default:
          score = 0;
      }
      
      // 処理効率によるパフォーマンス評価
      if (dataFlow.processedCount > 0 && dataFlow.errorCount === 0) {
        score += 20; // 高効率
      } else if (dataFlow.processedCount > 0 && dataFlow.errorCount <= 2) {
        score += 10; // 中効率
      } else if (dataFlow.errorCount > 5) {
        score = Math.max(0, score - 30); // 低効率
      }
      
      return Math.min(100, score);
    } catch (error) {
      console.error('Data flow performance evaluation failed:', error);
      return 0;
    }
  }

  /**
   * 総合品質スコアの計算
   * 既存の品質計算パターンを活用
   */
  private calculateOverallQuality(params: {
    seoQuality: number;
    fallbackQuality: number;
    dataFlowQuality: number;
    stability: number;
    performance: number;
  }): number {
    try {
      // 重み付けによる総合品質スコアの計算
      const weights = {
        seoQuality: 0.25,      // 25%
        fallbackQuality: 0.25, // 25%
        dataFlowQuality: 0.20, // 20%
        stability: 0.20,        // 20%
        performance: 0.10       // 10%
      };
      
      const overallScore = 
        params.seoQuality * weights.seoQuality +
        params.fallbackQuality * weights.fallbackQuality +
        params.dataFlowQuality * weights.dataFlowQuality +
        params.stability * weights.stability +
        params.performance * weights.performance;
      
      return Math.round(overallScore);
    } catch (error) {
      console.error('Overall quality calculation failed:', error);
      return 0;
    }
  }

  /**
   * 改善推奨事項の生成
   * 既存の推奨事項生成パターンを活用
   */
  private generateRecommendations(params: {
    seoQuality: number;
    fallbackQuality: number;
    dataFlowQuality: number;
    stability: number;
    performance: number;
  }): string[] {
    const recommendations: string[] = [];
    
    try {
      // SEOシステムの改善推奨
      if (params.seoQuality < 80) {
        recommendations.push('Improve SEO system integration quality');
      }
      
      // Fallbackシステムの改善推奨
      if (params.fallbackQuality < 80) {
        recommendations.push('Enhance fallback system integration');
      }
      
      // データフローの改善推奨
      if (params.dataFlowQuality < 80) {
        recommendations.push('Optimize data flow construction');
      }
      
      // 安定性の改善推奨
      if (params.stability < 80) {
        recommendations.push('Strengthen integration stability');
      }
      
      // パフォーマンスの改善推奨
      if (params.performance < 80) {
        recommendations.push('Improve integration performance');
      }
      
      // 全体的な改善推奨
      if (recommendations.length === 0) {
        recommendations.push('Integration quality is excellent - maintain current standards');
      }
      
      return recommendations;
    } catch (error) {
      console.error('Recommendations generation failed:', error);
      return ['Review integration configuration and system status'];
    }
  }

  /**
   * フォールバック品質測定の生成
   * エラー時の品質測定
   */
  private generateFallbackQualityMeasurement(): IntegrationQualityResult {
    return {
      overall: 0,
      seoQuality: 0,
      fallbackQuality: 0,
      dataFlowQuality: 0,
      stability: 0,
      performance: 0,
      lastMeasured: new Date(),
      recommendations: [
        'Check quality measurement system',
        'Verify integration status',
        'Review error logs'
      ]
    };
  }
}
