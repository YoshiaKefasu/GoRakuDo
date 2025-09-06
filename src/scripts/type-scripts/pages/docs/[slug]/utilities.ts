/**
 * ユーティリティ関数 - [slug].astro分離スクリプト
 * Astroネイティブ + Strict TypeScript + ES Modules
 * DRY・KISS原則に従った実装
 */

import type { 
  PostData, 
  ShareData, 
  ReadingProgress, 
  EnhancementConfig,
  ErrorHandler,
  PerformanceOptimizer
} from './types.js';

/**
 * 共有機能の実装
 * KISS原則: シンプルな共有機能
 */
export async function sharePost(postData: PostData): Promise<void> {
  const shareUrl = postData?.resolvedPath
    ? `${window.location.origin}${postData.resolvedPath}`
    : window.location.href;

  const shareData: ShareData = {
    title: postData?.title || "GoRakuDo Post",
    description: postData?.description || "Check out this post from GoRakuDo",
    url: shareUrl,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      alert("Link berhasil disalin ke clipboard!");
    }
  } catch (error) {
    console.error('Share failed:', error);
    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link berhasil disalin ke clipboard!");
    } catch (clipboardError) {
      console.error('Clipboard fallback failed:', clipboardError);
    }
  }
}

/**
 * 読書進捗バーの実装
 * DRY原則: 再利用可能な進捗バー機能
 */
export function addReadingProgress(): ReadingProgress {
  const progressBar = document.createElement("div");
  progressBar.className = "reading-progress";
  progressBar.setAttribute("role", "progressbar");
  progressBar.setAttribute("aria-label", "Reading progress");
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #8b5dff, #7b4def);
    z-index: 1000;
    transition: width 0.1s ease;
  `;
  
  document.body.appendChild(progressBar);

  const updateProgress = (scrollPercent: number): void => {
    progressBar.style.width = scrollPercent + "%";
    progressBar.setAttribute("aria-valuenow", Math.round(scrollPercent).toString());
  };

  const cleanup = (): void => {
    progressBar.remove();
  };

  // スクロールイベントリスナーを追加
  const handleScroll = (): void => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    updateProgress(scrollPercent);
  };

  window.addEventListener("scroll", handleScroll);

  return {
    element: progressBar,
    updateProgress,
    cleanup: () => {
      cleanup();
      window.removeEventListener("scroll", handleScroll);
    }
  };
}

/**
 * エラーハンドリングの実装
 * KISS原則: シンプルなエラーハンドリング
 */
export function setupErrorHandling(): ErrorHandler {
  const handleError = (error: Error, context: string): void => {
    console.error(`Content load error in ${context}:`, error);
  };

  const handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    console.error("Unhandled promise rejection:", event.reason);
  };

  // グローバルエラーハンドラーを設定
  window.addEventListener("error", (e) => {
    handleError(e.error, "global");
  });

  window.addEventListener("unhandledrejection", handleUnhandledRejection);

  return {
    handleError,
    handleUnhandledRejection
  };
}

/**
 * パフォーマンス最適化の実装
 * DRY原則: 再利用可能な最適化機能
 */
export function setupPerformanceOptimization(): PerformanceOptimizer {
  const requestIdleCallback = (callback: () => void): void => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(callback);
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(callback, 1);
    }
  };

  const optimizeForIdle = (): void => {
    requestIdleCallback(() => {
      console.log("⚡ Idle time optimizations applied");
    });
  };

  return {
    requestIdleCallback,
    optimizeForIdle
  };
}

/**
 * エンハンスメント読み込みの実装
 * KISS原則: シンプルなエンハンスメント管理
 */
export async function loadEnhancements(): Promise<void> {
  try {
    console.log("⚡ Loading enhancements...");

    // エラーハンドリングを設定
    setupErrorHandling();

    // パフォーマンス最適化を設定
    const performanceOptimizer = setupPerformanceOptimization();
    performanceOptimizer.optimizeForIdle();

    console.log("✅ Enhancements loaded successfully");
  } catch (error) {
    console.error("Failed to load enhancements:", error);
  }
}

/**
 * ローカルストレージ設定の初期化
 * DRY原則: 設定の一元管理
 */
export function initializeLocalStorageSettings(): EnhancementConfig {
  const defaultSettings: EnhancementConfig = {
    aggressiveLoading: true,
    syntaxHighlighting: 500,
    readingProgress: 300,
    errorHandling: 1000
  };

  if (typeof localStorage !== "undefined") {
    const settings: EnhancementConfig = {
      aggressiveLoading: localStorage.getItem("setting_aggressiveLoading") !== "false",
      syntaxHighlighting: parseInt(localStorage.getItem("threshold_syntaxHighlighting") || "500"),
      readingProgress: parseInt(localStorage.getItem("threshold_readingProgress") || "300"),
      errorHandling: parseInt(localStorage.getItem("threshold_errorHandling") || "1000")
    };

    // デフォルト値を設定（存在しない場合）
    Object.entries(defaultSettings).forEach(([key, defaultValue]) => {
      const storageKey = key === 'aggressiveLoading' ? 'setting_aggressiveLoading' : `threshold_${key}`;
      if (!localStorage.getItem(storageKey)) {
        localStorage.setItem(storageKey, defaultValue.toString());
      }
    });

    return settings;
  }

  return defaultSettings;
}
