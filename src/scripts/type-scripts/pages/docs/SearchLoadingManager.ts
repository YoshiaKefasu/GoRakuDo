/**
 * SearchLoadingManager - 検索エンジンのローディング状態管理
 * Astroネイティブ + DRY・KISS原則 + Strict TypeScript
 */

import type { ISearchLoadingManager } from './types.js';

export class SearchLoadingManager implements ISearchLoadingManager {
  public searchInput: HTMLInputElement | null = null;
  public filterButtons: NodeListOf<HTMLButtonElement>;
  public loadingIndicator: HTMLElement | null = null;
  public isReady = false;
  public isLoading = false;

  constructor() {
    this.filterButtons = document.querySelectorAll(
      ".filter-button"
    ) as NodeListOf<HTMLButtonElement>;
    this.init();
  }

  /**
   * 初期化処理
   * DRY原則: 共通の初期化ロジックを集約
   */
  public init(): void {
    this.searchInput = document.getElementById("searchInput") as HTMLInputElement;
    this.filterButtons = document.querySelectorAll(
      ".filter-button"
    ) as NodeListOf<HTMLButtonElement>;
    this.loadingIndicator = document.getElementById("searchLoadingIndicator");

    // 初期状態をローディングに設定
    this.setLoadingState();
  }

  /**
   * ローディング状態を設定
   * KISS原則: シンプルで明確な状態管理
   */
  public setLoadingState(): void {
    if (this.searchInput) {
      this.searchInput.disabled = true;
      this.searchInput.classList.add("search-input-loading");
      this.searchInput.classList.remove("search-input-ready");
      this.searchInput.placeholder = "Memuat sistem pencarian...";
    }

    // フィルターボタンを無効化
    this.filterButtons.forEach((button) => {
      button.disabled = true;
      button.classList.add("filter-button-loading");
    });

    // ローディングインジケーターを表示
    if (this.loadingIndicator) {
      this.loadingIndicator.style.display = "flex";
    }
  }

  /**
   * 準備完了状態を設定
   * KISS原則: 状態変更のロジックを明確に分離
   */
  public setReadyState(): void {
    if (this.searchInput) {
      this.searchInput.disabled = false;
      this.searchInput.classList.remove("search-input-loading");
      this.searchInput.classList.add("search-input-ready");
      this.searchInput.placeholder = "Cari konten Indonesian (min 2 karakter)";
    }

    // フィルターボタンを有効化
    this.filterButtons.forEach((button) => {
      button.disabled = false;
      button.classList.remove("filter-button-loading");
    });

    // ローディングインジケーターを非表示
    if (this.loadingIndicator) {
      this.loadingIndicator.style.display = "none";
    }

    this.isReady = true;
    
    // ログ出力（DRY原則: 共通のログ処理）
    this.logMessage("Search engine ready for use", "success");
  }

  /**
   * エラー状態を設定
   * DRY原則: エラーハンドリングの共通化
   */
  public setErrorState(errorMessage = "Search temporarily unavailable"): void {
    if (this.searchInput) {
      this.searchInput.disabled = true;
      this.searchInput.classList.add("search-input-loading");
      this.searchInput.classList.remove("search-input-ready");
      this.searchInput.placeholder = errorMessage;
    }

    // フィルターボタンを無効化のまま維持
    this.filterButtons.forEach((button) => {
      button.disabled = true;
      button.classList.add("filter-button-loading");
    });

    // エラー表示用のローディングインジケーター
    if (this.loadingIndicator) {
      this.loadingIndicator.innerHTML = `
        <div class="relative inline-flex items-center justify-center size-2.5">
          <div class="absolute inset-0 rounded-full border border-red-400/20"></div>
          <div class="absolute inset-0 rounded-full border border-transparent border-t-red-500 animate-spin"></div>
        </div>
        <span class="loading-text text-xs font-normal tracking-normal" style="color: #ef4444;">${errorMessage}</span>
      `;
    }
  }

  /**
   * ローディング状態の設定
   * DRY原則: 状態管理の共通化
   */
  public setLoading(loading: boolean): void {
    this.isLoading = loading;
    if (loading) {
      this.setLoadingState();
    } else {
      this.setReadyState();
    }
  }

  /**
   * ログメッセージの出力
   * DRY原則: ログ処理の共通化
   */
  private logMessage(message: string, level: 'info' | 'success' | 'warning' | 'error' = 'info'): void {
    if (window.clientLogger?.log) {
      window.clientLogger.log(message, level);
    }
  }
}
