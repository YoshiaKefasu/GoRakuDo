/**
 * TypeScript型定義 - [slug].astro分離スクリプト
 * Astroネイティブ + Strict TypeScript + ES Modules
 * DRY・KISS原則に従った型定義
 */

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

// 波アニメーション関連の型定義
export interface WaveConfig {
  amplitude: number;
  frequency: number;
  speed: number;
  offset: number;
  color: string;
  y: number;
  yPos: number;
}

// グローバルウィンドウオブジェクトの拡張
declare global {
  interface Window {
    enhancedContent?: string;
    marked?: {
      setOptions: (options: ContentRenderConfig) => void;
      parse: (content: string) => string;
    };
  }
}

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
