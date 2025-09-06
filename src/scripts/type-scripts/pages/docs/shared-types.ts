/**
 * 共通型定義 - docs/[slug]共通
 * Astroネイティブ + Strict TypeScript + ES Modules
 * DRY原則: 重複を排除した共通型定義
 */

// ============================================================================
// 共通インターフェース
// ============================================================================

/**
 * 波アニメーション設定
 * DRY原則: 波アニメーション関連の型を一元化
 */
export interface WaveConfig {
  amplitude: number;
  frequency: number;
  speed: number;
  offset: number;
  color: string;
  y: number;
  yPos: number;
}

/**
 * ログレベル
 * KISS原則: シンプルなログレベル定義
 */
export type LogLevel = 'info' | 'success' | 'warning' | 'error';

/**
 * ログ機能インターフェース
 * DRY原則: ログ機能の共通化
 */
export interface ILogger {
  log(message: string, level?: LogLevel): void;
  startGroup?(title: string): void;
  endGroup?(title: string): void;
}

/**
 * アニメーション管理インターフェース
 * DRY原則: アニメーション機能の共通化
 */
export interface IAnimationManager {
  init(): { cleanup: () => void } | null;
  cleanup(): void;
  logMessage(message: string, level?: LogLevel): void;
}

// ============================================================================
// グローバル型定義
// ============================================================================

/**
 * グローバルウィンドウオブジェクトの拡張
 * DRY原則: グローバル型定義の一元化
 */
declare global {
  interface Window {
    // ログ機能
    clientLogger?: {
      log: (message: string, level?: 'info' | 'success' | 'warning' | 'error') => void;
      startGroup?: (title: string) => void;
      endGroup?: (title: string) => void;
    };
    
    // 検索関連
    searchLoadingManager?: unknown;
    searchEngine?: unknown;
    allPosts?: unknown[];
    Fuse?: unknown;
    
    // アニメーション関連
    waveAnimation?: { cleanup: () => void } | null;
    
    // コンテンツ設定
    contentConfig?: {
      getCategories?: () => unknown[];
      getTags?: () => unknown[];
      categories?: Record<string, unknown>;
      tags?: Record<string, unknown>;
      filters?: Record<string, unknown>;
      mindMap?: Record<string, { customFilters?: unknown[] }>;
      search?: Record<string, unknown>;
    };

    // ナビゲーション関数
    goHome?: () => void;
    goToPosts?: () => void;
    goToInvitation?: () => void;
    
    // Marked.js
    marked?: {
      setOptions: (options: unknown) => void;
      parse: (content: string) => string;
    };
    
    // Prism.js
    Prism?: {
      languages: Record<string, unknown>;
      highlight: (code: string, lang: unknown, language: string) => string;
      highlightAll: () => void;
    };
    
    // エンハンスドコンテンツ
    enhancedContent?: string;
  }
}

// ============================================================================
// ユーティリティ型
// ============================================================================

/**
 * オプショナルプロパティの型
 * KISS原則: シンプルなユーティリティ型
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * 必須プロパティの型
 * KISS原則: シンプルなユーティリティ型
 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * ディープリードオンリー型
 * KISS原則: シンプルなユーティリティ型
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// ============================================================================
// エクスポート
// ============================================================================

// 型の再エクスポートは不要（既に上で定義済み）
