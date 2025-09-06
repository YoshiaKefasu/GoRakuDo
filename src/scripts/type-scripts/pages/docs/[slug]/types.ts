/**
 * TypeScript型定義 - [slug].astro分離スクリプト
 * Astroネイティブ + Strict TypeScript + ES Modules
 * DRY原則: 共通型定義をshared-types.tsからインポート
 */

// 共通型定義のインポート
export type { WaveConfig, LogLevel, ILogger, IAnimationManager } from '../shared-types.js';

// ============================================================================
// [slug]専用の型定義
// ============================================================================

// 投稿データの型定義
export interface PostData {
  title: string;
  description: string;
  publishedDate: string;
  author: string;
  readTime?: string;
  difficulty?: string;
  body: string;
  slug: string;
  resolvedPath: string;
  collectionMetadata: {
    displayName: string;
    icon: string;
    basePath: string;
  };
}

// 共有機能の型定義
export interface ShareData {
  title: string;
  description: string;
  url: string;
}

// 読書進捗の型定義
export interface ReadingProgress {
  element: HTMLElement;
  updateProgress: (scrollPercent: number) => void;
  cleanup: () => void;
}

// エンハンスメント設定の型定義
export interface EnhancementConfig {
  aggressiveLoading: boolean;
  syntaxHighlighting: number;
  readingProgress: number;
  errorHandling: number;
}

// コンテンツレンダリング設定の型定義
export interface ContentRenderConfig {
  highlight: (code: string, lang: string) => string;
  breaks: boolean;
  gfm: boolean;
}

// スケルトンローディングの型定義
export interface SkeletonConfig {
  enabled: boolean;
  container: HTMLElement | null;
}

// ============================================================================
// インターフェース定義（実装クラス用）
// ============================================================================

// ユーティリティ関数の型定義
export interface PostUtilities {
  sharePost: (postData: PostData) => Promise<void>;
  addReadingProgress: () => ReadingProgress;
  loadEnhancements: () => Promise<void>;
  renderPostContent: (postData: PostData, enhancedContent?: string) => void;
  showPostSkeleton: (container: HTMLElement) => void;
  hidePostSkeleton: (container: HTMLElement) => void;
  initializePost: (postData: PostData, enhancedContent?: string) => void;
}

// エラーハンドリングの型定義
export interface ErrorHandler {
  handleError: (error: Error, context: string) => void;
  handleUnhandledRejection: (event: PromiseRejectionEvent) => void;
}

// パフォーマンス最適化の型定義
export interface PerformanceOptimizer {
  requestIdleCallback: (callback: () => void) => void;
  optimizeForIdle: () => void;
}
