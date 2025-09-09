import type { SearchLoadingManager as ISearchLoadingManager } from '../global';

/**
 * Search Engine Loading State Management
 * Manages the loading states of search input and filter buttons
 */
export class SearchLoadingManager implements ISearchLoadingManager {
  searchInput: HTMLInputElement | null = null;
  filterButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.filter-button');
  loadingIndicator: HTMLElement | null = null;
  isReady = false;

  constructor() {
    this.init();
  }

  private init(): void {
    // Get DOM elements
    this.searchInput = document.getElementById('searchInput') as HTMLInputElement;
    this.filterButtons = document.querySelectorAll('.filter-button') as NodeListOf<HTMLButtonElement>;
    this.loadingIndicator = document.getElementById('searchLoadingIndicator');

    // Ensure initial loading state
    this.setLoadingState();
  }

  setLoadingState(): void {
    if (this.searchInput) {
      this.searchInput.disabled = true;
      this.searchInput.classList.add('search-input-loading');
      this.searchInput.classList.remove('search-input-ready');
      this.searchInput.placeholder = 'Memuat sistem pencarian...';
    }

    // Disable filter buttons
    this.filterButtons.forEach((button) => {
      button.disabled = true;
      button.classList.add('filter-button-loading');
    });

    // Show loading indicator
    if (this.loadingIndicator) {
      this.loadingIndicator.style.display = 'flex';
    }
  }

  setReadyState(): void {
    if (this.searchInput) {
      this.searchInput.disabled = false;
      this.searchInput.classList.remove('search-input-loading');
      this.searchInput.classList.add('search-input-ready');
      this.searchInput.placeholder = 'Cari konten Indonesian (min 2 karakter)';
    }

    // Enable filter buttons
    this.filterButtons.forEach((button) => {
      button.disabled = false;
      button.classList.remove('filter-button-loading');
    });

    // Hide loading indicator
    if (this.loadingIndicator) {
      this.loadingIndicator.style.display = 'none';
    }

    this.isReady = true;
    if (window.clientLogger && window.clientLogger.log) {
      window.clientLogger.log('Search engine ready for use', 'success');
    }
  }

  setErrorState(errorMessage = 'Search temporarily unavailable'): void {
    if (this.searchInput) {
      this.searchInput.disabled = true;
      this.searchInput.classList.add('search-input-loading');
      this.searchInput.classList.remove('search-input-ready');
      this.searchInput.placeholder = errorMessage;
    }

    // Keep filter buttons disabled
    this.filterButtons.forEach((button) => {
      button.disabled = true;
      button.classList.add('filter-button-loading');
    });

    // Update loading indicator to show error
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
   * 統合: 検索システム初期化機能
   * 元のdocs.astro行514-536のinitializeSearchSystem()を統合
   * 
   * 統合の詳細:
   * 1. 動的インポートによるモジュール読み込み
   * 2. グローバル変数への適切な設定
   * 3. エラーハンドリングの実装
   * 4. ログ出力の統一
   * 
   * @returns Promise<void> 初期化の完了を表すPromise
   */
  async initializeSearchSystem(): Promise<void> {
    try {
      // 初期化開始のログ出力
      if (window.clientLogger && window.clientLogger.log) {
        window.clientLogger.log("Initializing search system...", "info");
      }

      // 動的インポートによるモジュール読み込み
      // 循環依存を避けるため、相対パスでインポート（自己参照を避ける）
      const { ModernSearchEngine } = await import('./modern-search-engine');
      
      // グローバル変数に設定
      // 型安全性を確保するため、適切な型キャストを実行
      window.searchLoadingManager = this; // 現在のインスタンスを使用
      window.searchEngine = new ModernSearchEngine();
      window.allPosts = [];

      // 初期化成功のログ出力
      if (window.clientLogger && window.clientLogger.log) {
        window.clientLogger.log("Search system initialized successfully", "success");
      }
    } catch (error) {
      // エラーログの出力
      if (window.clientLogger && window.clientLogger.log) {
        window.clientLogger.log(`Failed to initialize search system: ${error}`, "error");
      }
      
      // エラー状態の設定
      this.setErrorState('Sistem pencarian gagal dimuat');
      
      // エラーを再スローして上位で処理可能にする
      throw error;
    }
  }
}
