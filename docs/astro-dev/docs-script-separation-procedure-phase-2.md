# docs.astro スクリプト分離手順書 - Phase 2

## 📋 Phase 2: コンテンツ処理システム分離

### 概要
**目的**: `src/pages/docs.astro`のコンテンツ処理ロジック（行41-415）を2つのモジュールに分離
- `content-processor.ts`: コンテンツの取得、フィルタリング、ソート処理
- `search-data-generator.ts`: 検索データ生成とメタデータ処理

**対象範囲**: 行41-415のコンテンツ処理ロジック
**分離ファイル数**: 2ファイル
**技術要件**: Strict TypeScript Mode、ES Modules

## 🎯 Phase 2の目標

- **コンテンツ処理の分離**: getCollection、フィルタリング、ソート処理の独立化
- **検索データ生成の分離**: 検索用データ生成とメタデータ処理の独立化
- **型安全性の確保**: コンテンツ関連の型定義の明確化
- **再利用性の向上**: 他のページでも使用可能なモジュール化

## 📊 分離対象の詳細分析

### コンテンツ処理部分（行41-120）
```typescript
// Content Collection取得
let posts: any[] = []
let error: string | null = null

try {
  posts = await getCollection("docs")
  logger.log(`Posts loaded: ${posts.length}`, "success")
} catch (err: any) {
  logger.log(`Error loading posts: ${err.message}`, "error")
  error = err.message
}

// ソート処理
const sortedPosts = posts.sort(
  (a, b) =>
    new Date(b.data.publishedDate).getTime() - new Date(a.data.publishedDate).getTime()
)

// ページネーション設定
const POSTS_PER_PAGE = 6
const totalPosts = sortedPosts.length
const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)

// コンテンツフィルタリング
const beginnerContent = sortedPosts.filter(
  (post) => post.data.learningStage === "pemanasan" || post.data.difficulty === "beginner"
)

const toolContent = sortedPosts.filter((post) => {
  const isTool =
    post.data.category === "tools" ||
    post.data.title.toLowerCase().includes("anki") ||
    post.data.description.toLowerCase().includes("anki") ||
    post.data.tags.some((tag) => tag.toLowerCase().includes("tool"))
  return isTool
})
```

### 検索データ生成部分（行128-415）
```typescript
// コンテンツ処理関数
function processArticleContent(content: string) {
  // コードブロック抽出
  // 画像抽出
  // セクション抽出
  // テキストクリーニング
}

// 検索データ生成
const enhancedSearchData = sortedPosts.map((post) => {
  const fullContent = post.body || ""
  const processedContent = processArticleContent(fullContent)
  
  // メタデータ抽出
  // 検索可能フィールド生成
  // 構造化データ作成
})
```

## 🏗️ Phase 2実装手順

### 2.1 ディレクトリ構造の確認・作成

```bash
# contentディレクトリの確認
ls -la src/scripts/type-scripts/docs/index/content/

# ディレクトリが存在しない場合は作成
mkdir -p src/scripts/type-scripts/docs/index/content
```

### 2.2 content-processor.ts の作成

**ファイル**: `src/scripts/type-scripts/docs/index/content/content-processor.ts`

```typescript
import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { logger } from "../../../../utils/logging/console-logger";

// ========== TYPE DEFINITIONS ==========

export interface ProcessedPost extends CollectionEntry<"docs"> {
  resolvedPath?: string;
  collectionMetadata?: any;
}

export interface ContentProcessingResult {
  posts: ProcessedPost[];
  sortedPosts: ProcessedPost[];
  beginnerContent: ProcessedPost[];
  toolContent: ProcessedPost[];
  recommendations: ProcessedPost[];
  error: string | null;
  pagination: {
    postsPerPage: number;
    totalPosts: number;
    totalPages: number;
    currentPage: number;
    startIndex: number;
    endIndex: number;
    currentPosts: ProcessedPost[];
  };
}

export interface ContentFilter {
  type: 'learningStage' | 'difficulty' | 'category' | 'custom';
  value: string;
  condition: 'equals' | 'includes' | 'startsWith' | 'endsWith';
}

// ========== CONTENT PROCESSOR CLASS ==========

/**
 * Content Processor for Docs Page
 * Handles content collection, filtering, sorting, and pagination
 */
export class ContentProcessor {
  private posts: ProcessedPost[] = [];
  private error: string | null = null;
  private readonly POSTS_PER_PAGE = 6;

  /**
   * Load and process content from Astro Content Collections
   */
  async loadContent(): Promise<ContentProcessingResult> {
    try {
      // Load posts from content collection
      await this.loadPosts();
      
      // Process and sort posts
      const sortedPosts = this.sortPosts();
      
      // Apply content filters
      const filteredContent = this.applyFilters(sortedPosts);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(sortedPosts);
      
      // Calculate pagination
      const pagination = this.calculatePagination(sortedPosts);
      
      if (logger && logger.log) {
        logger.log(`Content processing completed: ${this.posts.length} posts`, "success");
      }

      return {
        posts: this.posts,
        sortedPosts,
        beginnerContent: filteredContent.beginner,
        toolContent: filteredContent.tools,
        recommendations,
        error: this.error,
        pagination
      };
    } catch (error) {
      const errorMessage = `Content processing failed: ${error}`;
      if (logger && logger.log) {
        logger.log(errorMessage, "error");
      }
      
      return {
        posts: [],
        sortedPosts: [],
        beginnerContent: [],
        toolContent: [],
        recommendations: [],
        error: errorMessage,
        pagination: this.getEmptyPagination()
      };
    }
  }

  /**
   * Load posts from Astro Content Collection
   */
  private async loadPosts(): Promise<void> {
    try {
      const rawPosts = await getCollection("docs");
      this.posts = rawPosts.map((post) => ({
        ...post,
        resolvedPath: this.resolvePostPath(post)
      }));
      
      if (logger && logger.log) {
        logger.log(`Posts loaded: ${this.posts.length}`, "success");
      }
    } catch (err: any) {
      this.error = err.message;
      if (logger && logger.log) {
        logger.log(`Error loading posts: ${err.message}`, "error");
      }
      throw err;
    }
  }

  /**
   * Sort posts by published date (newest first)
   */
  private sortPosts(): ProcessedPost[] {
    return this.posts.sort(
      (a, b) =>
        new Date(b.data.publishedDate).getTime() - new Date(a.data.publishedDate).getTime()
    );
  }

  /**
   * Apply content filters
   */
  private applyFilters(sortedPosts: ProcessedPost[]) {
    const beginnerContent = sortedPosts.filter(
      (post) => post.data.learningStage === "pemanasan" || post.data.difficulty === "beginner"
    );

    const toolContent = sortedPosts.filter((post) => {
      const isTool =
        post.data.category === "tools" ||
        post.data.title.toLowerCase().includes("anki") ||
        post.data.description.toLowerCase().includes("anki") ||
        post.data.tags.some((tag) => tag.toLowerCase().includes("tool"));
      return isTool;
    });

    if (logger && logger.log) {
      logger.log(`Beginner content found: ${beginnerContent.length}`, "info");
      logger.log(`Tool content found: ${toolContent.length}`, "info");
    }

    return {
      beginner: beginnerContent,
      tools: toolContent
    };
  }

  /**
   * Generate content recommendations
   */
  private generateRecommendations(sortedPosts: ProcessedPost[]): ProcessedPost[] {
    // Simple recommendation logic - take first 3 posts
    const recommendations = sortedPosts.slice(0, 3);
    
    if (logger && logger.log) {
      logger.log(`Generated ${recommendations.length} recommendations`, "info");
    }
    
    return recommendations;
  }

  /**
   * Calculate pagination information
   */
  private calculatePagination(sortedPosts: ProcessedPost[]) {
    const totalPosts = sortedPosts.length;
    const totalPages = Math.ceil(totalPosts / this.POSTS_PER_PAGE);
    const currentPage = 1; // For static generation, we'll handle pagination client-side
    const startIndex = 0;
    const endIndex = Math.min(this.POSTS_PER_PAGE, totalPosts);
    const currentPosts = sortedPosts.slice(startIndex, endIndex);

    // Log pagination info
    if (logger && logger.logPaginationInfo) {
      logger.logPaginationInfo(totalPosts, this.POSTS_PER_PAGE, currentPage);
    }

    return {
      postsPerPage: this.POSTS_PER_PAGE,
      totalPosts,
      totalPages,
      currentPage,
      startIndex,
      endIndex,
      currentPosts
    };
  }

  /**
   * Resolve post path for navigation
   */
  private resolvePostPath(post: CollectionEntry<"docs">): string {
    // Simple path resolution - can be enhanced with more complex logic
    return `/docs/${post.slug}`;
  }

  /**
   * Get empty pagination object for error cases
   */
  private getEmptyPagination() {
    return {
      postsPerPage: this.POSTS_PER_PAGE,
      totalPosts: 0,
      totalPages: 0,
      currentPage: 1,
      startIndex: 0,
      endIndex: 0,
      currentPosts: []
    };
  }

  /**
   * Apply custom content filter
   */
  applyCustomFilter(posts: ProcessedPost[], filter: ContentFilter): ProcessedPost[] {
    return posts.filter((post) => {
      const fieldValue = this.getFieldValue(post, filter.type);
      
      switch (filter.condition) {
        case 'equals':
          return fieldValue === filter.value;
        case 'includes':
          return fieldValue.toLowerCase().includes(filter.value.toLowerCase());
        case 'startsWith':
          return fieldValue.toLowerCase().startsWith(filter.value.toLowerCase());
        case 'endsWith':
          return fieldValue.toLowerCase().endsWith(filter.value.toLowerCase());
        default:
          return false;
      }
    });
  }

  /**
   * Get field value from post data
   */
  private getFieldValue(post: ProcessedPost, fieldType: ContentFilter['type']): string {
    switch (fieldType) {
      case 'learningStage':
        return post.data.learningStage || '';
      case 'difficulty':
        return post.data.difficulty || '';
      case 'category':
        return post.data.category || '';
      case 'custom':
        return post.data.title || '';
      default:
        return '';
    }
  }
}

// ========== UTILITY FUNCTIONS ==========

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  if (!dateString || typeof dateString !== "string") {
    if (logger && logger.log) {
      logger.log(`Invalid date string provided: ${dateString}`, "warning");
    }
    return "Invalid Date";
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      if (logger && logger.log) {
        logger.log(`Invalid date format: ${dateString}`, "warning");
      }
      return "Invalid Date";
    }

    return date.toLocaleDateString("id-ID", options);
  } catch (error) {
    if (logger && logger.log) {
      logger.log(`Date formatting error: ${error}`, "error");
    }
    return "Invalid Date";
  }
}

/**
 * Format numbers with K, M, B suffixes
 */
export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B";
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}
```

### 2.3 search-data-generator.ts の作成

**ファイル**: `src/scripts/type-scripts/docs/index/content/search-data-generator.ts`

```typescript
import type { ProcessedPost } from './content-processor';
import type { SearchPost, ProcessedContent, ContentSection, CodeBlock, ContentImage } from '../search/search-types';
import { logger } from "../../../../utils/logging/console-logger";

// ========== TYPE DEFINITIONS ==========

export interface SearchDataGenerationResult {
  enhancedSearchData: SearchPost[];
  aiMetadataMap: Map<string, any>;
  postsWithRelationships: any[];
  learningPathRecommendations: any[];
  error: string | null;
}

export interface ContentAnalysisResult {
  cleanedText: string;
  sections: ContentSection[];
  codeBlocks: CodeBlock[];
  images: ContentImage[];
  hasCode: boolean;
  hasImages: boolean;
  hasSections: boolean;
  indonesianContentRatio: number;
  hasIndonesianImages: boolean;
  hasIndonesianSections: boolean;
}

// ========== SEARCH DATA GENERATOR CLASS ==========

/**
 * Search Data Generator for Docs Page
 * Handles search data generation, content analysis, and metadata processing
 */
export class SearchDataGenerator {
  private aiMetadataMap = new Map<string, any>();
  private postsWithRelationships: any[] = [];
  private learningPathRecommendations: any[] = [];

  /**
   * Generate comprehensive search data from processed posts
   */
  async generateSearchData(sortedPosts: ProcessedPost[]): Promise<SearchDataGenerationResult> {
    try {
      if (logger && logger.log) {
        logger.log("Starting search data generation...", "info");
      }

      // Generate enhanced search data
      const enhancedSearchData = this.generateEnhancedSearchData(sortedPosts);
      
      // Generate AI metadata map
      this.generateAIMetadataMap(sortedPosts);
      
      // Generate relationships and recommendations
      this.generateRelationshipsAndRecommendations(sortedPosts);

      if (logger && logger.log) {
        logger.log(
          `Enhanced search data generated for ${enhancedSearchData.length} posts`,
          "success"
        );
      }

      return {
        enhancedSearchData,
        aiMetadataMap: this.aiMetadataMap,
        postsWithRelationships: this.postsWithRelationships,
        learningPathRecommendations: this.learningPathRecommendations,
        error: null
      };
    } catch (error) {
      const errorMessage = `Search data generation failed: ${error}`;
      if (logger && logger.log) {
        logger.log(errorMessage, "error");
      }
      
      return {
        enhancedSearchData: [],
        aiMetadataMap: new Map(),
        postsWithRelationships: [],
        learningPathRecommendations: [],
        error: errorMessage
      };
    }
  }

  /**
   * Generate enhanced search data with comprehensive content analysis
   */
  private generateEnhancedSearchData(sortedPosts: ProcessedPost[]): SearchPost[] {
    return sortedPosts.map((post) => {
      // Extract FULL article content for comprehensive search (no character limit)
      const fullContent = post.body || "";

      // Process full article content for comprehensive search
      const processedContent = this.processArticleContent(fullContent);

      // Extract comprehensive metadata for Indonesian-focused search
      const searchMetadata = this.extractSearchMetadata(post, processedContent);

      return {
        slug: post.slug,
        url: post.resolvedPath || `/docs/${post.slug}`,
        publishedDate: post.data.publishedDate,
        readTime: post.data.readTime,
        emoji: post.data.emoji,
        ...searchMetadata,
      };
    });
  }

  /**
   * Process article content for search optimization
   */
  private processArticleContent(content: string): ContentAnalysisResult {
    if (!content) {
      return this.getEmptyContentAnalysis();
    }

    // Extract different content types for specialized search
    const codeBlocks = this.extractCodeBlocks(content);
    const images = this.extractImages(content);
    const sections = this.extractSections(content);

    // Clean text for search (focus on text content and images, remove markdown)
    const cleanedText = this.cleanTextForSearch(content);

    return {
      cleanedText,
      sections,
      codeBlocks,
      images,
      hasCode: codeBlocks.length > 0,
      hasImages: images.length > 0,
      hasSections: sections.length > 0,
      indonesianContentRatio: this.calculateIndonesianContentRatio(cleanedText),
      hasIndonesianImages: images.some((img) => img.priority === "high"),
      hasIndonesianSections: sections.some((sec) => sec.isIndonesian),
    };
  }

  /**
   * Extract code blocks from content
   */
  private extractCodeBlocks(content: string): CodeBlock[] {
    const codeBlocks: CodeBlock[] = [];
    const codeBlockRegex = /```[\s\S]*?```/g;
    let codeMatch;

    while ((codeMatch = codeBlockRegex.exec(content)) !== null) {
      codeBlocks.push({
        content: codeMatch[0],
        type: "code",
        position: codeMatch.index,
      });
    }

    return codeBlocks;
  }

  /**
   * Extract images from content with Indonesian priority
   */
  private extractImages(content: string): ContentImage[] {
    const images: ContentImage[] = [];
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let imageMatch;

    while ((imageMatch = imageRegex.exec(content)) !== null) {
      const altText = imageMatch[1];
      
      // Prioritize Indonesian alt text for search
      if (
        altText &&
        (altText.includes("gambar") ||
          altText.includes("foto") ||
          altText.includes("ilustrasi"))
      ) {
        images.push({
          alt: altText,
          src: imageMatch[2],
          type: "image",
          position: imageMatch.index,
          priority: "high", // Indonesian alt text gets higher priority
        });
      } else {
        images.push({
          alt: altText,
          src: imageMatch[2],
          type: "image",
          position: imageMatch.index,
          priority: "normal",
        });
      }
    }

    return images;
  }

  /**
   * Extract sections (headers) from content
   */
  private extractSections(content: string): ContentSection[] {
    const sections: ContentSection[] = [];
    const sectionRegex = /^(#{1,6})\s+(.+)$/gm;
    let sectionMatch;

    while ((sectionMatch = sectionRegex.exec(content)) !== null) {
      const title = sectionMatch[2];
      sections.push({
        level: sectionMatch[1].length,
        title: title,
        type: "section",
        position: sectionMatch.index,
        // Prioritize Indonesian section titles
        isIndonesian: /[a-z]/.test(title) && !/[a-z]{3,}/.test(title), // Simple Indonesian detection
      });
    }

    return sections;
  }

  /**
   * Clean text for search optimization
   */
  private cleanTextForSearch(content: string): string {
    return content
      .replace(/---[\s\S]*?---/, "") // Remove frontmatter
      .replace(/```[\s\S]*?```/g, " [kode] ") // Replace code blocks with [kode]
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, " [gambar: $1] ") // Replace images with [gambar: alt]
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1") // Remove links, keep text
      .replace(/#{1,6}\s+/g, "") // Remove header markers
      .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove bold formatting
      .replace(/\*([^*]+)\*/g, "$1") // Remove italic formatting
      .replace(/`([^`]+)`/g, "$1") // Remove inline code formatting
      .replace(/\n+/g, " ") // Replace newlines with spaces
      .replace(/\s+/g, " ") // Normalize spaces
      .trim();
  }

  /**
   * Calculate Indonesian content ratio for better search prioritization
   */
  private calculateIndonesianContentRatio(text: string): number {
    if (!text) return 0;

    const words = text.toLowerCase().split(/\s+/);
    const indonesianWords = words.filter(
      (word) =>
        // Common Indonesian words and patterns
        /^(yang|dan|atau|dengan|di|ke|dari|untuk|dalam|pada|oleh|karena|adalah|akan|sudah|belum|tidak|bukan|juga|saja|hanya|masih|pernah|selalu|kadang|sering|jarang|segera|nanti|kemarin|hari|ini|itu|sana|sini|mana|apa|siapa|kapan|bagaimana|mengapa|berapa|belajar|pembelajaran|bahasa|jepang|immersion|metodologi|filosofi|praktik|latihan|konten|anime|manga|grammar|vocabulary|kanji|hiragana|katakana)$/.test(
          word
        ) ||
        // Indonesian word patterns
        /^(mem|men|meng|meny|pe|per|ber|ter|se|ke|di|ke|dari|untuk|dalam|pada|oleh|karena|adalah|akan|sudah|belum|tidak|bukan|juga|saja|hanya|masih|pernah|selalu|kadang|sering|jarang|segera|nanti|kemarin|hari|ini|itu|sana|sini|mana|apa|siapa|kapan|bagaimana|mengapa|berapa)$/.test(
          word
        ) ||
        // Japanese words
        /^(hiragana|katakana|kanji|nihongo|japanese|anime|manga|srs|anki|immersion|grammar|vocabulary|reading|writing|listening|speaking)$/.test(
          word
        )
    );

    return indonesianWords.length / words.length;
  }

  /**
   * Extract search metadata from post and processed content
   */
  private extractSearchMetadata(post: ProcessedPost, processedContent: ContentAnalysisResult) {
    return {
      // Core post data
      title: post.data.title,
      description: post.data.description,
      tags: post.data.tags || [],
      category: post.data.category,
      difficulty: post.data.difficulty,
      learningStage: post.data.learningStage,

      // Full article content processing
      fullContent: processedContent.cleanedText,
      rawContent: post.body || "", // Keep original for exact matching
      contentPreview: processedContent.cleanedText.substring(0, 500),
      contentLength: (post.body || "").length,
      processedLength: processedContent.cleanedText.length,

      // Comprehensive AI metadata
      aiMetadata: post.data.aiMetadata || {},
      contentType: post.data.aiMetadata?.contentType || post.data.category,
      learningPath: post.data.aiMetadata?.learningPath || [],
      aiRecommendations: post.data.aiMetadata?.recommendations || [],
      contentComplexity: post.data.aiMetadata?.complexity || "medium",
      semanticKeywords: post.data.aiMetadata?.semanticKeywords || [],
      learningObjectives: post.data.aiMetadata?.learningObjectives || [],

      // Enhanced searchable fields
      keywords: [
        ...(post.data.tags || []),
        post.data.category,
        post.data.difficulty,
        post.data.learningStage,
        post.data.aiMetadata?.contentType,
        ...(post.data.aiMetadata?.keywords || []),
        ...(post.data.aiMetadata?.semanticKeywords || []),
        ...(post.data.aiMetadata?.learningObjectives || []),
        post.data.aiMetadata?.complexity,
      ].filter(Boolean),

      // Enhanced searchable text with full article content
      searchableText: [
        post.data.title,
        post.data.description,
        processedContent.cleanedText,
        ...(post.data.tags || []),
        post.data.category,
        post.data.difficulty,
        post.data.learningStage,
        post.data.aiMetadata?.contentType,
        ...(post.data.aiMetadata?.keywords || []),
        ...(post.data.aiMetadata?.semanticKeywords || []),
        ...(post.data.aiMetadata?.learningObjectives || []),
        post.data.aiMetadata?.complexity,
        ...(post.data.aiMetadata?.learningPath || []),
        // Add section titles for better search
        ...processedContent.sections.map((section) => section.title),
        // Add image alt texts for visual content search
        ...processedContent.images.map((img) => img.alt),
      ]
        .join(" ")
        .toLowerCase(),

      // Content analysis metadata
      isRecommended: post.data.aiMetadata?.isRecommended || false,
      isBeginner:
        post.data.difficulty === "beginner" || post.data.learningStage === "pemanasan",
      isTool:
        post.data.category === "tools" || post.data.title.toLowerCase().includes("anki"),
      hasCodeBlocks: processedContent.hasCode,
      hasImages: processedContent.hasImages,
      hasSections: processedContent.hasSections,
      wordCount: processedContent.cleanedText.split(/\s+/).filter((word) => word.length > 0)
        .length,

      // Processed content for advanced search
      processedContent: {
        sections: processedContent.sections,
        codeBlocks: processedContent.codeBlocks,
        images: processedContent.images,
        hasCode: processedContent.hasCode,
        hasImages: processedContent.hasImages,
        hasSections: processedContent.hasSections,
      },
    };
  }

  /**
   * Generate AI metadata map
   */
  private generateAIMetadataMap(sortedPosts: ProcessedPost[]): void {
    this.aiMetadataMap = new Map(
      sortedPosts.map((post) => [
        post.slug,
        { contentType: "guide", learningStage: "alphabet" },
      ])
    );
  }

  /**
   * Generate relationships and recommendations
   */
  private generateRelationshipsAndRecommendations(sortedPosts: ProcessedPost[]): void {
    // Semantic relationships removed - functionality no longer needed
    this.postsWithRelationships = [];
    this.learningPathRecommendations = [];
  }

  /**
   * Get empty content analysis result
   */
  private getEmptyContentAnalysis(): ContentAnalysisResult {
    return {
      cleanedText: "",
      sections: [],
      codeBlocks: [],
      images: [],
      hasCode: false,
      hasImages: false,
      hasSections: false,
      indonesianContentRatio: 0,
      hasIndonesianImages: false,
      hasIndonesianSections: false,
    };
  }
}

// ========== UTILITY FUNCTIONS ==========

/**
 * Generate search data for a single post
 */
export function generateSinglePostSearchData(post: ProcessedPost): SearchPost {
  const generator = new SearchDataGenerator();
  const processedContent = generator['processArticleContent'](post.body || "");
  const searchMetadata = generator['extractSearchMetadata'](post, processedContent);

  return {
    slug: post.slug,
    url: post.resolvedPath || `/docs/${post.slug}`,
    publishedDate: post.data.publishedDate,
    readTime: post.data.readTime,
    emoji: post.data.emoji,
    ...searchMetadata,
  };
}

/**
 * Validate search data structure
 */
export function validateSearchData(searchData: SearchPost[]): boolean {
  return searchData.every((post) => 
    post.slug && 
    post.title && 
    post.description && 
    Array.isArray(post.tags)
  );
}
```

### 2.4 docs.astro の更新

**更新箇所**: `src/pages/docs.astro`

```astro
---
// Import the separated content processing modules
import { ContentProcessor, formatDate, formatNumber } from '../scripts/type-scripts/docs/index/content/content-processor';
import { SearchDataGenerator } from '../scripts/type-scripts/docs/index/content/search-data-generator';

// ... existing imports ...

// Initialize content processor
const contentProcessor = new ContentProcessor();
const searchDataGenerator = new SearchDataGenerator();

// Process content using the separated modules
const contentResult = await contentProcessor.loadContent();
const searchDataResult = await searchDataGenerator.generateSearchData(contentResult.sortedPosts);

// Extract processed data
const {
  posts,
  sortedPosts,
  beginnerContent,
  toolContent,
  recommendations: finalRecommendations,
  error,
  pagination
} = contentResult;

const {
  enhancedSearchData,
  aiMetadataMap,
  postsWithRelationships,
  learningPathRecommendations
} = searchDataResult;

// Use processed data for rendering
const currentPosts = pagination.currentPosts;
const totalPosts = pagination.totalPosts;
const totalPages = pagination.totalPages;
const currentPage = pagination.currentPage;
const startIndex = pagination.startIndex;
const endIndex = pagination.endIndex;

// ... rest of the existing code ...
---

<!doctype html>
<html lang="id">
  <head>
    <!-- ... existing head content ... -->
  </head>
  <body>
    <!-- ... existing body content ... -->
  </body>
</html>
```

## 🧪 Phase 2 テスト手順

### 2.1 型チェック
```bash
npm run type-check
```

### 2.2 ビルドテスト
```bash
npm run build
```

### 2.3 機能テスト
- コンテンツ読み込み機能の確認
- フィルタリング機能の確認
- 検索データ生成の確認
- ページネーション機能の確認
- エラーハンドリングの確認

### 2.4 パフォーマンステスト
- コンテンツ処理速度の測定
- メモリ使用量の確認
- 検索データ生成速度の確認

## 📝 Phase 2 完了チェックリスト

- [ ] `content-processor.ts` の作成完了
- [ ] `search-data-generator.ts` の作成完了
- [ ] `docs.astro` の更新完了
- [ ] 型チェック通過
- [ ] ビルドテスト通過
- [ ] 機能テスト通過
- [ ] パフォーマンステスト通過
- [ ] 既存機能の保持確認

## 🔄 次のフェーズ準備

Phase 2完了後、以下の順序で進める：

1. **Phase 3**: アニメーションシステム分離
2. **Phase 4**: UI・ナビゲーション分離
3. **Phase 5**: 初期化・統合

---

**作成日**: 2024年12月19日
**作成者**: Astra (Astro SSG Developer)
**バージョン**: 1.0
**ステータス**: Phase 2実装準備完了
