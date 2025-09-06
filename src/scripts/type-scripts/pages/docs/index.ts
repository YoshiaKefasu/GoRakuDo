/**
 * docs.astro分離スクリプト - メインエクスポート
 * Astroネイティブ + DRY・KISS原則 + Strict TypeScript + ES Modules
 */

// 型定義のエクスポート
export type {
  SearchData,
  SearchResult,
  SearchResultSet,
  PerformanceMetrics,
  FuseOptions,
  FilterConfig,
} from './types.js';

// クラスのエクスポート
export { SearchLoadingManager } from './SearchLoadingManager.js';
export { ModernSearchEngine } from './ModernSearchEngine.js';

// クラスのインポート（初期化関数で使用）
import { SearchLoadingManager } from './SearchLoadingManager.js';
import { ModernSearchEngine } from './ModernSearchEngine.js';
import { WaveStarsAnimationManager } from './WaveStarsAnimationManager.js';
import { PostsManager } from './posts-manager.js';

/**
 * 初期化関数
 * KISS原則: シンプルな初期化処理
 */
export function initializeDocsScripts(): void {
  // グローバル変数の初期化
  if (typeof window !== 'undefined') {
    // 検索ローディングマネージャーの初期化
    const searchLoadingManager = new SearchLoadingManager();
    window.searchLoadingManager = searchLoadingManager;

    // 検索エンジンの初期化
    const searchEngine = new ModernSearchEngine();
    window.searchEngine = searchEngine;

    // 波アニメーション + 星背景マネージャーの初期化
    const waveStarsAnimationManager = new WaveStarsAnimationManager();
    const waveStarsAnimation = waveStarsAnimationManager.init();
    window.waveAnimation = waveStarsAnimation;

    // 投稿管理の初期化
    const postsManager = new PostsManager();
    (window as unknown as { postsManager: PostsManager }).postsManager = postsManager;

    // コンテンツ設定の初期化
    window.contentConfig = {
      getCategories: () => [],
      getTags: () => [],
      categories: {},
      tags: {},
      filters: {},
      mindMap: {},
      search: {},
    };

    // 投稿データの初期化
    window.allPosts = [];

    // 投稿の初期化
    postsManager.initializePosts();

    // ページアンロード時のクリーンアップ
    window.addEventListener('beforeunload', () => {
      if (waveStarsAnimation) {
        waveStarsAnimation.cleanup();
      }
    });
  }
}

/**
 * 自動初期化（DOM読み込み完了時）
 * DRY原則: 初期化処理の共通化
 */
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDocsScripts);
  } else {
    initializeDocsScripts();
  }
}
