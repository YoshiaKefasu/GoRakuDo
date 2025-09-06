// ========== SEO SYSTEM CONNECTOR ==========
// Connects to existing SEO optimization system following DRY principle
// Integrates with existing SEOOptimizer class

import type { SEOIntegrationConfig, SEOIntegrationResult } from '../../types/base-integration.js';
import type { SEOAnalysis, AIProcessingResult } from '../ai/types.js';

// 既存のSEO最適化システムをインポート（DRY原則）
import { SEOOptimizer } from '../ai/seo-optimizer.js';

/**
 * SEOシステム連携モジュール
 * 既存のSEO最適化システムとの基盤連携を実現
 */
export class SEOConnector {
  private config: SEOIntegrationConfig;
  private isConnected: boolean = false;
  private lastConnectionAttempt?: Date;
  private connectionErrors: string[] = [];

  constructor(config: SEOIntegrationConfig) {
    this.config = config;
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
        
        return {
          status: 'connected',
          endpoint: this.config.apiEndpoint,
          timeout: this.config.timeout,
          lastConnected: new Date()
        };
      } else {
        this.isConnected = false;
        this.connectionErrors.push(connectionTest.error || 'Connection test failed');
        
        return {
          status: 'error',
          endpoint: this.config.apiEndpoint,
          errorMessage: connectionTest.error || 'Connection test failed'
        };
      }
    } catch (error) {
      this.isConnected = false;
      const errorMessage = error instanceof Error ? error.message : 'Unknown connection error';
      this.connectionErrors.push(errorMessage);
      
      return {
        status: 'error',
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
      // 既存のSEOOptimizerクラスの基本機能テスト
      const testTitle = "Test Title for SEO Optimization";
      const testContent = "This is a test content for SEO optimization testing.";
      
      // キーワード抽出テスト
      const keywords = SEOOptimizer.extractKeywords(testContent, testTitle);
      if (!Array.isArray(keywords) || keywords.length === 0) {
        return { success: false, error: 'Keyword extraction failed' };
      }
      
      // タイトル最適化テスト
      const optimizedTitle = SEOOptimizer.optimizeTitle(testTitle, 60);
      if (!optimizedTitle || optimizedTitle.length > 60) {
        return { success: false, error: 'Title optimization failed' };
      }
      
      // 構造化キーワード生成テスト
      const structuredKeywords = SEOOptimizer.generateStructuredKeywords(testContent);
      if (!Array.isArray(structuredKeywords)) {
        return { success: false, error: 'Structured keywords generation failed' };
      }
      
      // SEOスコア計算テスト
      const seoScore = SEOOptimizer.calculateSEOScore(
        testTitle,
        testContent.substring(0, 160),
        keywords
      );
      if (typeof seoScore !== 'number' || seoScore < 0 || seoScore > 100) {
        return { success: false, error: 'SEO score calculation failed' };
      }
      
      // 抜粋生成テスト
      const excerpt = SEOOptimizer.generateExcerpt(testContent, 160);
      if (!excerpt || excerpt.length > 160) {
        return { success: false, error: 'Excerpt generation failed' };
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
      // 既存のSEOOptimizerクラスを活用（DRY原則）
      const extractedKeywords = SEOOptimizer.extractKeywords(content, title);
      const optimizedTitle = SEOOptimizer.optimizeTitle(title, 60);
      const structuredKeywords = SEOOptimizer.generateStructuredKeywords(content);
      const seoScore = SEOOptimizer.calculateSEOScore(title, content.substring(0, 160), keywords);
      
      // 既存の型定義に準拠したSEO分析結果を生成
      const seoAnalysis: SEOAnalysis = {
        title: optimizedTitle,
        metaDescription: {
          description: content.substring(0, 160),
          length: Math.min(content.length, 160),
          hasKeywords: keywords.length > 0,
          hasCTA: this.hasCallToAction(content),
          language: this.detectLanguage(content),
          generatedAt: new Date().toISOString()
        },
        keywords: [...new Set([...extractedKeywords, ...keywords])],
        structuredKeywords,
        seoScore
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
      // 既存のSEO最適化システムを活用（DRY原則）
      const keywords = SEOOptimizer.extractKeywords(content, title);
      const seoScore = SEOOptimizer.calculateSEOScore(title, content.substring(0, 160), keywords);
      const excerpt = SEOOptimizer.generateExcerpt(content, 160);
      
      // 既存の型定義に準拠したAI処理結果を生成
      const processingResult: AIProcessingResult = {
        metaDescription: {
          description: excerpt,
          length: excerpt.length,
          hasKeywords: keywords.length > 0,
          hasCTA: this.hasCallToAction(excerpt),
          language: this.detectLanguage(content),
          generatedAt: new Date().toISOString()
        },
        recommendations: [],
        keywords,
        seoScore,
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
