/**
 * メインエントリーポイント - [slug].astro分離スクリプト
 * Astroネイティブ + Strict TypeScript + ES Modules
 * DRY・KISS原則に従った実装
 */

import type { PostData, PostUtilities } from './types.js';
import { sharePost, addReadingProgress, loadEnhancements, initializeLocalStorageSettings } from './utilities.js';
import { initializeContentRendering } from './content-renderer.js';
import { initializeWaveAnimation } from './wave-animation.js';
import { setupGlobalNavigationFunctions, setupScrollAnimations, handleNavbarScroll } from './navigation-utils.js';

/**
 * 投稿ユーティリティの実装
 * DRY原則: すべての機能を一つのオブジェクトにまとめる
 */
export class PostUtilitiesImpl implements PostUtilities {
  private readingProgress: ReturnType<typeof addReadingProgress> | null = null;

  async sharePost(postData: PostData): Promise<void> {
    return sharePost(postData);
  }

  addReadingProgress() {
    this.readingProgress = addReadingProgress();
    return this.readingProgress;
  }

  async loadEnhancements(): Promise<void> {
    return loadEnhancements();
  }

  renderPostContent(postData: PostData, enhancedContent?: string): void {
    initializeContentRendering(postData, enhancedContent);
  }

  showPostSkeleton(_container: HTMLElement): void {
    // スケルトン機能は無効化されている
    console.log("🚫 Post skeleton disabled");
  }

  hidePostSkeleton(_container: HTMLElement): void {
    // スケルトン機能は無効化されている
    console.log("🚫 Post skeleton hiding disabled");
  }

  initializePost(postData: PostData, enhancedContent?: string): void {
    // ローカルストレージ設定を初期化
    initializeLocalStorageSettings();
    
    // コンテンツレンダリングを初期化
    this.renderPostContent(postData, enhancedContent);
  }

  cleanup(): void {
    if (this.readingProgress) {
      this.readingProgress.cleanup();
      this.readingProgress = null;
    }
  }
}

/**
 * グローバル共有機能の設定
 * KISS原則: シンプルなグローバル関数
 */
export function setupGlobalShareFunction(postData: PostData): void {
  // グローバル関数として共有機能を設定
  (window as unknown as { sharePost: () => Promise<void> }).sharePost = () => sharePost(postData);
}

/**
 * 投稿ページの完全な初期化
 * DRY原則: 初期化処理の一元化
 */
export function initializePostPage(postData: PostData, enhancedContent?: string): PostUtilities {
  const utilities = new PostUtilitiesImpl();
  
  // グローバル共有機能を設定
  setupGlobalShareFunction(postData);
  
  // 投稿を初期化
  utilities.initializePost(postData, enhancedContent);
  
  return utilities;
}

/**
 * DOM準備完了時の初期化
 * KISS原則: シンプルなDOM初期化
 */
export function setupDOMInitialization(postData: PostData, enhancedContent?: string): void {
  document.addEventListener("DOMContentLoaded", () => {
    // グローバルナビゲーション関数の設定
    setupGlobalNavigationFunctions();
    
    // 波アニメーションの初期化
    const waveAnimation = initializeWaveAnimation();
    
    // 投稿ページの初期化
    initializePostPage(postData, enhancedContent);
    
    // スクロールアニメーションの設定
    setupScrollAnimations();
    
    // ナビバースクロール効果の設定
    let scrollTimeout: number | null = null;
    window.addEventListener("scroll", function () {
      if (scrollTimeout) return;
      
      scrollTimeout = window.setTimeout(() => {
        handleNavbarScroll();
        scrollTimeout = null;
      }, 16);
    });
    
    // ページアンロード時のクリーンアップ
    window.addEventListener("beforeunload", function () {
      if (waveAnimation) {
        waveAnimation.destroy();
      }
    });
    
    console.log("✅ [slug] page initialized successfully");
  });
}

// デフォルトエクスポート
export default {
  PostUtilitiesImpl,
  setupGlobalShareFunction,
  initializePostPage,
  setupDOMInitialization
};
