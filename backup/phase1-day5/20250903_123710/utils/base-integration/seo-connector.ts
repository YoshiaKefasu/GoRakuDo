// ========== SEO SYSTEM CONNECTOR ==========
// Connects to existing SEO optimization system following DRY principle
// Integrates with existing SEOOptimizer class

import type { SEOIntegrationConfig, SEOIntegrationResult } from '../../types/new-seo-system/integration-types.js';
import type { SEOAnalysis, AIProcessingResult } from '../ai/types.js';

// 新しいSEOシステムをインポート（DRY原則）
import { NewSEOMetaManager } from '../new-seo-system/meta-manager';
import { NewSEOKeywordValidator } from '../new-seo-system/keyword-validator';
import type { AdvancedMetaConfig } from '../../types/new-seo-system';

/**
 * SEOシステム連携モジュール
 * 既存のSEO最適化システムとの基盤連携を実現
 */
export class SEOConnector {
  private config: SEOIntegrationConfig;
  private isConnected: boolean = false;
  private lastConnectionAttempt?: Date;
  private connectionErrors: string[] = [];
  private metaManager: NewSEOMetaManager;
  private keywordValidator: NewSEOKeywordValidator;

  constructor(config: SEOIntegrationConfig) {
    this.config = config;
    // 新しいSEOシステムの初期化
    this.metaManager = new NewSEOMetaManager();
    this.keywordValidator = new NewSEOKeywordValidator();
  }

  /**
   * SEOシステムとの接続
   * 既存のSEO最適化システムとの基盤連携を構築
   */
  async connect(): Promise<SEOIntegrationResult> {
    try {
      this.lastConnectionAttempt = new Date();
      
      // 既存のSEO最適化システムとの接続テスト
      const connectionTest = await this.testConnection();
      
      if (connectionTest.success) {
        this.isConnected = true;
        this.connectionErrors = [];
        
        const timestamp = new Date();
        return {
          success: true,
          status: 'connected',
          timestamp,
          endpoint: this.config.apiEndpoint,
          lastConnected: timestamp
        };
      } else {
        this.isConnected = false;
        this.connectionErrors.push(connectionTest.error || 'Connection test failed');
        
        const timestamp = new Date();
        return {
          success: false,
          status: 'error',
          timestamp,
          endpoint: this.config.apiEndpoint,
          errorMessage: connectionTest.error || 'Connection test failed'
        };
      }
    } catch (error) {
      this.isConnected = false;
      const errorMessage = error instanceof Error ? error.message : 'Unknown connection error';
      this.connectionErrors.push(errorMessage);
      
      const timestamp = new Date();
      return {
        success: false,
        status: 'error',
        timestamp,
        endpoint: this.config.apiEndpoint,
        errorMessage
      };
    }
  }

  /**
   * 接続テスト
   * 既存のSEO最適化システムの動作確認
   */
  private async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      // 新しいSEOシステムの基本機能テスト
      const testKeywords = ['test', 'seo', 'optimization'];
      const testMetaConfig: AdvancedMetaConfig = {
        robots: 'index,follow',
        themeColor: '#ffffff',
        colorScheme: 'light',
        viewport: {
          width: 'device-width',
          initialScale: 1
        }
      };

      // キーワード検証テスト
      const validationResult = this.keywordValidator.validateAll({
        primary: testKeywords
      });
      if (!validationResult.isValid) {
        return { success: false, error: 'Keyword validation failed' };
      }

      // メタタグ生成テスト
      const metaTags = this.metaManager.generateAdvancedMeta(testMetaConfig);
      if (!Array.isArray(metaTags) || metaTags.length === 0) {
        return { success: false, error: 'Meta tag generation failed' };
      }

      // 統合メタデータテスト
      const integratedResult = this.metaManager.integrateAll({
        advanced: metaTags,
        performance: [],
        security: [],
        analytics: []
      });
      if (!integratedResult.advanced || integratedResult.advanced.length === 0) {
        return { success: false, error: 'Meta integration failed' };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection test error'
      };
    }
  }

  /**
   * SEO分析の実行
   * 既存のSEO最適化システムを活用した分析
   */
  async analyzeSEO(title: string, content: string, keywords: string[] = []): Promise<SEOAnalysis | null> {
    if (!this.isConnected) {
      throw new Error('SEO system not connected');
    }

    try {
      // 新しいSEOシステムを活用（DRY原則）
      const validationResult = this.keywordValidator.validateAll({
        primary: keywords,
        article: [title] // タイトルを記事キーワードとして使用
      });

      // メタタグ生成
      const metaConfig: AdvancedMetaConfig = {
        robots: 'index,follow',
        themeColor: '#ffffff',
        colorScheme: 'light'
      };
      this.metaManager.generateAdvancedMeta(metaConfig);

      // 統合メタデータ生成（必要に応じて使用）
      // const integratedResult = this.metaManager.integrateAll({
      //   advanced: metaTags,
      //   performance: [],
      //   security: [],
      //   analytics: []
      // });

      // 既存の型定義に準拠したSEO分析結果を生成
      const seoAnalysis: SEOAnalysis = {
        title: title, // 新しいシステムではタイトル最適化は別途実装
        metaDescription: {
          description: content.substring(0, 160),
          length: Math.min(content.length, 160),
          hasKeywords: validationResult.optimizedKeywords.length > 0,
          hasCTA: this.hasCallToAction(content),
          language: this.detectLanguage(content),
          generatedAt: new Date().toISOString()
        },
        keywords: validationResult.optimizedKeywords,
        structuredKeywords: [], // 新しいシステムでは構造化キーワードは別途実装
        seoScore: validationResult.isValid ? 85 : 60 // 検証結果に基づく簡易スコア
      };

      return seoAnalysis;
    } catch (error) {
      console.error('SEO analysis failed:', error);
      return null;
    }
  }

  /**
   * AI処理結果の生成
   * 既存のAI処理パターンを活用
   */
  async generateAIProcessingResult(title: string, content: string): Promise<AIProcessingResult | null> {
    if (!this.isConnected) {
      throw new Error('SEO system not connected');
    }

    try {
      // 新しいSEOシステムを活用（DRY原則）
      const validationResult = this.keywordValidator.validateAll({
        primary: [title], // タイトルをプライマリキーワードとして使用
        article: [content.substring(0, 100)] // コンテンツの一部を記事キーワードとして使用
      });

      // メタタグ生成
      const metaConfig: AdvancedMetaConfig = {
        robots: 'index,follow',
        themeColor: '#ffffff',
        colorScheme: 'light'
      };
      this.metaManager.generateAdvancedMeta(metaConfig);

      // 簡易抜粋生成（新しいシステムでは別途実装が必要）
      const excerpt = content.length > 160 ? content.substring(0, 157) + "..." : content;

      // 既存の型定義に準拠したAI処理結果を生成
      const processingResult: AIProcessingResult = {
        metaDescription: {
          description: excerpt,
          length: excerpt.length,
          hasKeywords: validationResult.optimizedKeywords.length > 0,
          hasCTA: this.hasCallToAction(excerpt),
          language: this.detectLanguage(content),
          generatedAt: new Date().toISOString()
        },
        recommendations: [],
        keywords: validationResult.optimizedKeywords,
        seoScore: validationResult.isValid ? 85 : 60, // 検証結果に基づく簡易スコア
        processingTime: 0,
        apiCallsUsed: 0
      };

      return processingResult;
    } catch (error) {
      console.error('AI processing result generation failed:', error);
      return null;
    }
  }

  /**
   * コール・トゥ・アクションの検出
   * 既存のCTA検出パターンを活用
   */
  private hasCallToAction(text: string): boolean {
    const ctaWords = [
      'belajar', 'pelajari', 'mulai', 'gabung', 'daftar',
      '学び', '学習', '始め', '参加', '登録'
    ];
    
    return ctaWords.some(word => 
      text.toLowerCase().includes(word.toLowerCase())
    );
  }

  /**
   * 言語検出
   * 既存の言語検出パターンを活用
   */
  private detectLanguage(text: string): 'id' | 'ja' {
    const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
    const hasIndonesian = /belajar|bahasa|jepang|immersion/.test(text.toLowerCase());
    
    if (hasJapanese) return 'ja';
    if (hasIndonesian) return 'id';
    return 'id'; // デフォルト
  }

  /**
   * 接続状態の確認
   */
  isConnectedToSEOSystem(): boolean {
    return this.isConnected;
  }

  /**
   * 接続エラーの取得
   */
  getConnectionErrors(): string[] {
    return [...this.connectionErrors];
  }

  /**
   * 最後の接続試行時刻の取得
   */
  getLastConnectionAttempt(): Date | undefined {
    return this.lastConnectionAttempt;
  }

  /**
   * 設定の更新
   */
  updateConfig(newConfig: SEOIntegrationConfig): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * 状態の取得
   */
  getStatus(): string {
    return this.isConnected ? 'connected' : 'disconnected';
  }

  /**
   * 接続の切断
   */
  disconnect(): void {
    this.isConnected = false;
    this.connectionErrors = [];
  }
}
