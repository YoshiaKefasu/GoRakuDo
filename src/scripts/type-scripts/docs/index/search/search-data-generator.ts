import type { SearchDataItem } from '../global';

/**
 * Raw post data interface for processing
 */
interface RawPostData {
  slug?: string;
  title?: string;
  description?: string;
  content?: string;
  pubDate?: string;
  readTime?: string;
  emoji?: string;
  tags?: string[];
  category?: string;
  difficulty?: string;
  learningStage?: string;
  url?: string;
}

/**
 * Processed content interface
 */
interface ProcessedContent {
  cleanedText: string;
  wordCount: number;
  contentLength: number;
  hasCodeBlocks: boolean;
  hasImages: boolean;
}

/**
 * Simplified Search Data Generator for Docs Page
 * 軽量化された検索データ生成（AI機能無効化、不要機能削除）
 */
export class SearchDataGenerator {
  private searchData: SearchDataItem[] = [];

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    try {
      if (window.clientLogger && window.clientLogger.log) {
        window.clientLogger.log('Initializing Search Data Generator...', 'info');
      }

      // 検索データの生成
      await this.generateSearchData();

      if (window.clientLogger && window.clientLogger.log) {
        window.clientLogger.log('Search Data Generator initialized successfully', 'success');
      }
    } catch (error) {
      if (window.clientLogger && window.clientLogger.log) {
        window.clientLogger.log(`Search Data Generator initialization failed: ${error}`, 'error');
      }
    }
  }

  /**
   * 検索データの生成（簡素化版）
   */
  private async generateSearchData(): Promise<void> {
    try {
      // search.jsonからデータを取得
      const response = await fetch('/search.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();
      
      // 簡素化された検索データの生成
      this.searchData = rawData.map((post: RawPostData) => this.processPostForSearch(post));

      if (window.clientLogger && window.clientLogger.log) {
        window.clientLogger.log(
          `Generated search data for ${this.searchData.length} posts`,
          'success'
        );
      }
    } catch (error) {
      if (window.clientLogger && window.clientLogger.log) {
        window.clientLogger.log(`Error generating search data: ${error}`, 'error');
      }
      throw error;
    }
  }

  /**
   * 投稿の検索用処理（簡素化版）
   */
  private processPostForSearch(post: RawPostData): SearchDataItem {
    // 基本的なコンテンツ処理のみ
    const processedContent = this.processContent(post.content || '');
    
    return {
      // 基本情報
      slug: post.slug || '',
      title: post.title || 'Untitled',
      description: post.description || '',
      pubDate: post.pubDate || '',
      readTime: post.readTime || '5 min read',
      emoji: post.emoji || '📄',

      // コンテンツ
      content: processedContent.cleanedText,
      fullContent: post.content || '',

      // メタデータ（簡素化）
      tags: post.tags || [],
      category: post.category || 'general',
      difficulty: post.difficulty || 'medium',
      learningStage: post.learningStage || 'intermediate',

      // AI メタデータ（完全削除 - 空オブジェクトで統一）
      aiMetadata: {},
      contentType: post.category || 'general',

      // 検索用テキスト（簡素化）
      searchableText: this.generateSearchableText(post, processedContent),

      // コンテンツ分析（簡素化）
      wordCount: processedContent.wordCount,
      contentLength: processedContent.contentLength,

      // 機能フラグ（簡素化）
      isRecommended: false,
      isBeginner: post.difficulty === 'beginner',
      isTool: post.category === 'tool',
      hasCodeBlocks: processedContent.hasCodeBlocks,
      hasImages: processedContent.hasImages,

      // URL
      url: post.url || `/docs/${post.slug}`,
    };
  }

  /**
   * コンテンツ処理（簡素化版）
   * 
   * 実装詳細:
   * - Markdown記法の基本的なクリーニング
   * - コードブロックと画像の検出
   * - リンクテキストの抽出
   * - 単語数と文字数の計算
   * - 正規表現を使用した効率的な処理
   */
  private processContent(content: string): ProcessedContent {
    if (!content || typeof content !== 'string') {
      return {
        cleanedText: '',
        wordCount: 0,
        contentLength: 0,
        hasCodeBlocks: false,
        hasImages: false,
      };
    }

    // 基本的なテキストクリーニング
    const cleanedText = content
      .replace(/```[\s\S]*?```/g, '') // コードブロック削除
      .replace(/!\[.*?\]\(.*?\)/g, '') // 画像削除
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // リンクテキストのみ抽出
      .replace(/[#*_`]/g, '') // Markdown記法削除
      .replace(/\s+/g, ' ') // 複数スペースを単一スペースに
      .trim();

    // 単語数の計算（空文字列を除外）
    const words = cleanedText.split(/\s+/).filter(word => word.length > 0);

    return {
      cleanedText,
      wordCount: words.length,
      contentLength: cleanedText.length,
      hasCodeBlocks: /```[\s\S]*?```/.test(content),
      hasImages: /!\[.*?\]\(.*?\)/.test(content),
    };
  }

  /**
   * 検索用テキスト生成（簡素化版）
   */
  private generateSearchableText(post: RawPostData, processedContent: ProcessedContent): string {
    const searchableParts = [
      post.title || '',
      post.description || '',
      processedContent.cleanedText,
      (post.tags || []).join(' '),
      post.category || '',
      post.difficulty || '',
    ];

    return searchableParts
      .filter(part => part && part.trim())
      .join(' ')
      .toLowerCase();
  }

  /**
   * 検索データの取得
   */
  public getSearchData(): SearchDataItem[] {
    return this.searchData;
  }

  /**
   * 特定の投稿の検索データ取得
   */
  public getPostSearchData(slug: string): SearchDataItem | undefined {
    return this.searchData.find(post => post.slug === slug);
  }

  /**
   * 検索データの更新
   */
  public async refreshSearchData(): Promise<void> {
    await this.generateSearchData();
  }
}
