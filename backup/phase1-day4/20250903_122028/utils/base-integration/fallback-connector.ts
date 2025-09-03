// ========== FALLBACK SYSTEM CONNECTOR ==========
// Connects to Story 4B Fallback system following DRY principle
// Integrates with existing fallback system patterns

import type { FallbackIntegrationConfig, FallbackIntegrationResult } from '../../types/new-seo-system/integration-types.js';
import type { FallbackResult, FallbackMetadata } from '../../types/new-seo-system/validation-types.js';

// 既存のFallbackシステムをインポート（DRY原則）
import { AISystem } from '../ai/ai-system.js';
import { MetaDescriptionGenerator } from '../ai/meta-description-generator.js';
import { BuildProcessor } from '../ai/build-processor.js';
import { ContentRecommendationSystem } from '../ai/content-recommendations.js';

/**
 * Fallbackシステム連携モジュール
 * Story 4B Fallbackシステムとの基盤連携を実現
 */
export class FallbackConnector {
  private config: FallbackIntegrationConfig;
  private isConnected: boolean = false;
  private lastConnectionAttempt?: Date;
  private connectionErrors: string[] = [];
  
  // 既存のFallbackシステムコンポーネント（DRY原則）
  private aiSystem: AISystem;
  private metaDescriptionGenerator: MetaDescriptionGenerator;
  private buildProcessor: BuildProcessor;
  private contentRecommendations: ContentRecommendationSystem;

  constructor(config: FallbackIntegrationConfig) {
    this.config = config;
    
    // 既存のFallbackシステムコンポーネントを初期化
    this.aiSystem = new AISystem();
    this.metaDescriptionGenerator = new MetaDescriptionGenerator();
    this.buildProcessor = new BuildProcessor();
    this.contentRecommendations = new ContentRecommendationSystem();
  }

  /**
   * Fallbackシステムとの接続
   * Story 4B Fallbackシステムとの基盤連携を構築
   */
  async connect(): Promise<FallbackIntegrationResult> {
    try {
      this.lastConnectionAttempt = new Date();
      
      // 既存のFallbackシステムとの接続テスト
      const connectionTest = await this.testConnection();
      
      if (connectionTest.success) {
        this.isConnected = true;
        this.connectionErrors = [];
        
        const timestamp = new Date();
        return {
          success: true,
          status: 'connected',
          timestamp,
          endpoint: this.config.fallbackEndpoint,
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
          endpoint: this.config.fallbackEndpoint,
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
        endpoint: this.config.fallbackEndpoint,
        errorMessage
      };
    }
  }

  /**
   * 接続テスト
   * 既存のFallbackシステムの動作確認
   */
  private async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const testTitle = "Test Title for Fallback System";
      const testContent = "This is a test content for fallback system testing.";
      const testLanguage: 'id' | 'ja' = 'id';
      
      // 1. メタデータ生成器のテスト
      const metaDescriptionResult = await this.metaDescriptionGenerator.generateOptimizedMetaDescription({
        title: testTitle,
        content: testContent,
        keywords: ['test', 'fallback'],
        language: testLanguage
      });
      
      if (!metaDescriptionResult || !metaDescriptionResult.description) {
        return { success: false, error: 'Meta description generation failed' };
      }
      
      // 2. AIシステムのテスト
      const aiMetaDescription = await this.aiSystem.generateMetaDescriptionOnly(
        testTitle,
        testContent,
        testLanguage
      );
      
      if (!aiMetaDescription || !aiMetaDescription.description) {
        return { success: false, error: 'AI meta description generation failed' };
      }
      
      // 3. ビルドプロセッサーのテスト
      // 既存のBuildProcessorの公開メソッドを使用
      const buildResult = await this.buildProcessor.processContentForBuild(testTitle, "Test content for fallback system testing.", [], testLanguage);
      
      if (!buildResult || !buildResult.metaDescription) {
        return { success: false, error: 'Build processor fallback failed' };
      }
      
      // 4. コンテンツ推奨のテスト
      const testPosts = [
        { id: '1', title: 'Test Post 1', description: 'Test description 1', tags: ['test'] },
        { id: '2', title: 'Test Post 2', description: 'Test description 2', tags: ['test'] }
      ];
      
      const recommendations = this.contentRecommendations.generateRecommendations({
        currentPost: { id: '0', title: testTitle, content: testContent, tags: ['test'] },
        availablePosts: testPosts
      });
      
      if (!Array.isArray(recommendations) || recommendations.length === 0) {
        return { success: false, error: 'Content recommendations generation failed' };
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
   * Fallbackメタデータの生成
   * 既存のFallbackシステムを活用したメタデータ生成
   */
  async generateFallbackMetadata(
    title: string, 
    content: string, 
    language: 'id' | 'ja' = 'id'
  ): Promise<FallbackMetadata | null> {
    if (!this.isConnected) {
      throw new Error('Fallback system not connected');
    }

    try {
      // 既存のFallbackシステムを活用（DRY原則）
      const metaDescription = await this.aiSystem.generateMetaDescriptionOnly(title, content, language);
      
      // 既存の型定義に準拠したFallbackメタデータを生成
      const fallbackMetadata: FallbackMetadata = {
        title,
        description: metaDescription.description,
        tags: ['fallback-generated'],
        source: 'fallback',
        confidence: this.config.confidenceThreshold,
        extractionMethod: 'content',
        fallbackApplied: ['description', 'keywords'],
        // 既存のMetadataInputフィールド
        author: 'Fallback System',
        publishedDate: new Date().toISOString(),
        readTime: Math.ceil(content.split(/\s+/).length / 200), // 200語/分
        difficulty: 'beginner',
                category: 'general',
        featured: false,
        contentType: 'tutorial'
      };

      return fallbackMetadata;
    } catch (error) {
      console.error('Fallback metadata generation failed:', error);
      return null;
    }
  }

  /**
   * Fallback結果の生成
   * 既存のFallbackシステムを活用した結果生成
   */
  async generateFallbackResult(
    title: string, 
    content: string, 
    language: 'id' | 'ja' = 'id'
  ): Promise<FallbackResult | null> {
    if (!this.isConnected) {
      throw new Error('Fallback system not connected');
    }

    try {
      // 既存のFallbackシステムを活用（DRY原則）
      const metadata = await this.generateFallbackMetadata(title, content, language);
      
      if (!metadata) {
        return null;
      }

      // 既存の型定義に準拠したFallback結果を生成
      const fallbackResult: FallbackResult = {
        metadata,
        gaps: [], // フォールバック時はギャップなし
        needsFallback: false, // フォールバックが適用済み
        fallbackApplied: ['description', 'keywords', 'tags'],
        qualityScore: {
          overall: 75, // フォールバック時の固定スコア
          length: 80,
          readability: 70,
          relevance: 75,
          confidence: this.config.confidenceThreshold
        }
      };

      return fallbackResult;
    } catch (error) {
      console.error('Fallback result generation failed:', error);
      return null;
    }
  }

  /**
   * 推奨コンテンツの生成
   * 既存のFallbackシステムを活用した推奨コンテンツ生成
   */
  async generateFallbackRecommendations(availablePosts: any[]): Promise<any[]> {
    if (!this.isConnected) {
      throw new Error('Fallback system not connected');
    }

    try {
      // 既存のFallbackシステムを活用（DRY原則）
      const testPost = { id: '0', title: 'Test', content: 'Test content', description: 'Test description', tags: ['test'] };
      
      return this.contentRecommendations.generateRecommendations({
        currentPost: testPost,
        availablePosts: availablePosts.length > 0 ? availablePosts : [testPost]
      });
    } catch (error) {
      console.error('Fallback recommendations generation failed:', error);
      return [];
    }
  }

  /**
   * 接続状態の確認
   */
  isConnectedToFallbackSystem(): boolean {
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
  updateConfig(newConfig: FallbackIntegrationConfig): void {
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
