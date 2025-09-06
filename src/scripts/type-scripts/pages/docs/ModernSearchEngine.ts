/**
 * ModernSearchEngine - 検索エンジンのメイン実装
 * Astroネイティブ + DRY・KISS原則 + Strict TypeScript
 */

import type { 
  SearchData, 
  SearchResult, 
  SearchResultSet, 
  PerformanceMetrics, 
  FuseOptions, 
  FilterConfig,
  IModernSearchEngine
} from './types.js';

export class ModernSearchEngine implements IModernSearchEngine {
  private fuse: { search: (query: string) => Array<{ item: SearchData; score: number }> } | null = null;
  private searchData: SearchData[] = [];
  private searchCache = new Map<string, SearchResultSet>();
  private maxCacheSize = 100;
  private performanceMetrics: PerformanceMetrics = {
    searchCount: 0,
    cacheHits: 0,
    avgSearchTime: 0,
    totalSearchTime: 0,
  };

  constructor() {
    // DOM読み込み完了を待って初期化
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.initialize());
    } else {
      this.initialize();
    }
  }

  /**
   * 初期化処理
   * KISS原則: 初期化の流れを明確に分離
   */
  public async initialize(): Promise<boolean> {
    try {
      this.logMessage("Initializing Modern Search Engine with Fuse.js...", "info");

      // 検索データの読み込み
      await this.loadSearchData();

      // Fuse.jsの初期化
      await this.initializeFuse();

      // イベントリスナーの設定
      this.setupEventListeners();

      this.logMessage("Modern search engine ready!", "success");
      this.logMessage(`Loaded ${this.searchData.length} posts for search`, "success");

      // ローディングマネージャーに準備完了を通知
      if (window.searchLoadingManager && typeof window.searchLoadingManager === 'object' && window.searchLoadingManager !== null && 'setReadyState' in window.searchLoadingManager) {
        (window.searchLoadingManager as { setReadyState: () => void }).setReadyState();
      }

      return true;
    } catch (error) {
      this.logMessage(`Failed to initialize search engine: ${error}`, "error");

      // エラー状態を設定
      if (window.searchLoadingManager && typeof window.searchLoadingManager === 'object' && window.searchLoadingManager !== null && 'setErrorState' in window.searchLoadingManager) {
        (window.searchLoadingManager as { setErrorState: (message: string) => void }).setErrorState("Sistem pencarian gagal dimuat");
      }

      return false;
    }
  }

  /**
   * 検索データの読み込み
   * DRY原則: データ取得の共通化
   */
  public async loadSearchData(): Promise<void> {
    try {
      this.logMessage("Loading search data from /search.json...", "info");

      const response = await fetch("/search.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.searchData = await response.json();
      this.logMessage(`Loaded ${this.searchData.length} posts from search.json`, "success");

      // デバッグ: "Krashen"コンテンツの確認
      const krashenPosts = this.searchData.filter(
        (post) =>
          post.content?.toLowerCase().includes("krashen") ||
          post.title?.toLowerCase().includes("krashen") ||
          post.description?.toLowerCase().includes("krashen")
      );

      this.logMessage(
        `Found ${krashenPosts.length} posts containing "Krashen": ${krashenPosts.map((p) => p.title).join(", ")}`,
        "info"
      );
    } catch (error) {
      this.logMessage(`Error loading search data: ${error}`, "error");
      throw error;
    }
  }

  /**
   * Fuse.jsの初期化
   * KISS原則: 設定を明確に分離
   */
  public async initializeFuse(): Promise<void> {
        try {
          if (typeof window !== "undefined" && window.Fuse) {
            const Fuse = window.Fuse as new (data: SearchData[], options: FuseOptions) => { search: (query: string) => Array<{ item: SearchData; score: number }> };

            // Fuse.jsの最適化設定
            const fuseOptions: FuseOptions = {
              keys: [
                { name: "title", weight: 0.7 },
                { name: "description", weight: 0.3 },
                { name: "content", weight: 0.2 },
                { name: "tags", weight: 0.1 },
              ],
              includeScore: true,
              threshold: 0.4,
              minMatchCharLength: 2,
              shouldSort: true,
              findAllMatches: true,
              useExtendedSearch: false,
              ignoreLocation: true,
              distance: 100,
            };

            this.fuse = new Fuse(this.searchData, fuseOptions);
        this.logMessage("Fuse.js initialized with search data", "success");
      } else {
        this.logMessage("Fuse.js not available, using simple search fallback", "warning");
        this.fuse = null;
      }
    } catch (error) {
      this.logMessage(`Error initializing Fuse.js: ${error}`, "error");
      this.logMessage("Falling back to simple search", "warning");
      this.fuse = null;
    }
  }

  /**
   * イベントリスナーの設定
   * DRY原則: イベント処理の共通化
   */
  public setupEventListeners(): void {
    // 検索入力のイベントリスナー
    const searchInput = document.getElementById("searchInput") as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const query = (e.target as HTMLInputElement).value;
        this.performSearch(query);
      });

      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const query = (e.target as HTMLInputElement).value;
          this.performSearch(query);
        }
      });
    }

    // フィルターボタンのイベントリスナー
    const filterButtons = document.querySelectorAll(".filter-button");
    filterButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const filterType = (e.target as HTMLElement).getAttribute("data-filter");
        this.handleFilter(filterType);
      });
    });

    // クリア検索ボタン（イベント委譲）
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target?.closest('[data-action="clear-search"]')) {
        this.logMessage("Clear search button clicked", "info");
        this.clearSearch();
      }
    });
  }

  /**
   * 検索の実行
   * DRY原則: 検索ロジックの共通化
   */
  public async performSearch(query: string): Promise<void> {
    const startTime = performance.now();

    if (!query || query.trim().length < 2) {
      this.displayAllPosts();
      return;
    }

    try {
      this.logMessage(`Searching for: "${query}"`, "info");

      // キャッシュチェック
      const cacheKey = query.toLowerCase();
      if (this.searchCache.has(cacheKey)) {
        this.performanceMetrics.cacheHits++;
        const cachedResults = this.searchCache.get(cacheKey)!;
        this.displaySearchResults(cachedResults);
        return;
      }

      let results: SearchResult[] = [];
      let searchStrategy: 'fuzzy' | 'simple' = 'simple';

      // Fuse.jsまたはシンプル検索の実行
      if (this.fuse) {
        try {
          const fuseResults = this.fuse.search(query);
          results = fuseResults.slice(0, 20).map((result) => ({
            ...result.item,
            score: result.score,
            relevancePercentage: Math.round((1 - result.score) * 100),
          }));
          searchStrategy = 'fuzzy';
        } catch (fuseError) {
          this.logMessage(`Fuse.js search failed, falling back to simple search: ${fuseError}`, "warning");
          results = this.simpleSearch(query);
        }
      } else {
        results = this.simpleSearch(query);
      }

      const searchResult: SearchResultSet = {
        results: results,
        total: results.length,
        query: query,
        searchStrategy: searchStrategy,
      };

      // 結果をキャッシュ
      this.cacheResult(cacheKey, searchResult);

      // パフォーマンスメトリクスの更新
      const searchTime = performance.now() - startTime;
      this.performanceMetrics.searchCount++;
      this.performanceMetrics.totalSearchTime += searchTime;
      this.performanceMetrics.avgSearchTime =
        this.performanceMetrics.totalSearchTime / this.performanceMetrics.searchCount;

      this.logMessage(`Search completed in ${searchTime.toFixed(2)}ms`, "success");
      this.logMessage(`Found ${results.length} results for "${query}" using ${searchStrategy} search`, "success");

      // 結果の表示
      this.displaySearchResults(searchResult);
    } catch (error) {
      this.logMessage(`Search error: ${error}`, "error");
      this.displayError("Terjadi kesalahan dalam pencarian");
    }
  }

  /**
   * シンプル検索（フォールバック）
   * KISS原則: シンプルで確実な検索ロジック
   */
  public simpleSearch(query: string): SearchResult[] {
    const searchQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    this.searchData.forEach((post) => {
      let score = 0;
      let relevancePercentage = 0;

      // タイトル検索（最高優先度）
      if (post.title?.toLowerCase().includes(searchQuery)) {
        score += 100;
      }

      // 説明検索
      if (post.description?.toLowerCase().includes(searchQuery)) {
        score += 50;
      }

      // コンテンツ検索
      if (post.content?.toLowerCase().includes(searchQuery)) {
        score += 25;
      }

      // タグ検索
      if (post.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery))) {
        score += 30;
      }

      if (score > 0) {
        relevancePercentage = Math.min(score, 100);
        results.push({
          ...post,
          score: 1 - relevancePercentage / 100,
          relevancePercentage: relevancePercentage,
        });
      }
    });

    // 関連度順でソートして上位20件を返す
    return results
      .sort((a, b) => b.relevancePercentage - a.relevancePercentage)
      .slice(0, 20);
  }

  /**
   * 検索結果の表示
   * DRY原則: 表示ロジックの共通化
   */
  public displaySearchResults(searchResult: SearchResultSet): void {
    const searchResults = document.getElementById("searchResults");
    const searchStats = document.getElementById("searchStats");
    const searchResultsContent = document.getElementById("searchResultsContent");
    const contentState = document.getElementById("contentState");

    if (!searchResults || !searchStats || !searchResultsContent) {
      this.logMessage("Search results elements not found", "error");
      return;
    }

    // メインコンテンツを非表示、検索結果を表示
    if (contentState) {
      contentState.classList.add("hidden");
    }
    searchResults.classList.remove("hidden");

    if (searchResult.total === 0) {
      // 結果なし
      searchStats.innerHTML = `
        <span class="search-results-count">
          Tidak ada hasil ditemukan untuk "${searchResult.query}"
        </span>
        <button class="clear-search-btn" data-action="clear-search">
          ✕ Hapus Pencarian
        </button>
      `;

      searchResultsContent.innerHTML = `
        <div class="search-no-results">
          <div class="no-results-icon">🔍</div>
          <h3>Tidak ada hasil ditemukan</h3>
          <p>Tidak ada dokumentasi yang cocok dengan pencarian "${searchResult.query}"</p>
          <div class="no-results-suggestions">
            <p>Saran pencarian:</p>
            <ul>
              <li>Periksa ejaan kata kunci</li>
              <li>Coba kata kunci yang lebih umum</li>
              <li>Gunakan kata kunci yang berbeda</li>
            </ul>
          </div>
        </div>
      `;
    } else {
      // 結果あり
      searchStats.innerHTML = `
        <span class="search-results-count">
          Ditemukan ${searchResult.total} hasil untuk "${searchResult.query}"
        </span>
        <button class="clear-search-btn" data-action="clear-search">
          ✕ Hapus Pencarian
        </button>
      `;

      // 検索結果HTMLの生成
      const resultsHTML = searchResult.results
        .map((result: SearchResult, index: number) => {
          const title = result.title || "Untitled";
          const description = result.description || "";
          const url = result.url || `/docs/${result.slug}`;
          const relevance = result.relevancePercentage || 0;
          const pubDate = result.pubDate ? new Date(result.pubDate) : null;
          const formattedDate = pubDate
            ? pubDate.toLocaleDateString("id-ID", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "";

          const emoji = "🔍"; // 検索結果用の絵文字
          const tags = result.tags || [];
          const displayTags = tags.slice(0, 3);
          const remainingTags = tags.length > 3 ? tags.length - 3 : 0;

          return `
            <article class="post-card post-card-${index % 4}" data-post-slug="${result.slug}" data-learning-stage data-content-type data-is-recommended="true" data-is-beginner="true" data-is-tool="false">
              <div class="post-emoji">${emoji}</div>
              <div class="post-card-container">
                <span class="search-relevance-compact place-self-center max-w-min min-h-auto mb-4!">${relevance}% relevan</span>
                <div class="post-header">
                  <h2 class="post-title">
                    <a href="${url}">${title}</a>
                  </h2>
                  <div class="post-meta">
                    <span class="post-date">${formattedDate}</span>
                  </div>
                </div>
                <p class="post-description">${description}</p>
                <div class="post-tags" data-all-tags='${JSON.stringify(tags)}'>
                  ${displayTags.map((tag: string) => `<span class="post-tag">${tag}</span>`).join("")}
                  ${remainingTags > 0 ? `<span class="post-tag-more" data-count="${remainingTags}">+${remainingTags}</span>` : ""}
                </div>
                <a class="read-more-btn" href="${url}">
                  Baca Selengkapnya →
                </a>
              </div>
            </article>
          `;
        })
        .join("");

      searchResultsContent.innerHTML = `
        <div class="posts-grid">
          ${resultsHTML}
        </div>
      `;
    }
  }

  /**
   * 全投稿の表示
   * KISS原則: シンプルな表示切り替え
   */
  public displayAllPosts(): void {
    const searchResults = document.getElementById("searchResults");
    const contentState = document.getElementById("contentState");

    if (searchResults) {
      searchResults.classList.add("hidden");
    }
    if (contentState) {
      contentState.classList.remove("hidden");
    }
  }

  /**
   * 検索のクリア
   * DRY原則: クリア処理の共通化
   */
  public clearSearch(): void {
    this.logMessage("Clearing search...", "info");

    // 検索入力をクリア
    const searchInput = document.getElementById("searchInput") as HTMLInputElement;
    if (searchInput) {
      searchInput.value = "";
      searchInput.dispatchEvent(new Event("input"));
    }

    // 全投稿を表示
    this.displayAllPosts();

    this.logMessage("Search cleared successfully", "success");
  }

  /**
   * フィルターの処理
   * DRY原則: フィルター処理の共通化
   */
  public handleFilter(filterType: string | null): void {
    this.logMessage(`Filter applied: ${filterType}`, "info");

    // アクティブフィルターボタンの更新
    const filterButtons = document.querySelectorAll(".filter-button");
    filterButtons.forEach((btn) => btn.classList.remove("active"));

    const activeButton = document.querySelector(`[data-filter="${filterType}"]`);
    if (activeButton) {
      activeButton.classList.add("active");
    }

    // フィルター設定の取得
    const filterConfig = this.getFilterConfig(filterType);
    if (!filterConfig) {
      this.logMessage(`No filter configuration found for: ${filterType}`, "warning");
      return;
    }

    // フィルターの適用
    this.applyContentFilter(filterConfig);
  }

  /**
   * フィルター設定の取得
   * KISS原則: 設定取得のロジックを明確に分離
   */
  public getFilterConfig(filterType: string | null): FilterConfig | null {
    if (!filterType || filterType === "all") {
      return { type: "custom", target: "all" };
    }

    // コンテンツ設定からフィルターを検索
    const filters = window.contentConfig?.filters || {};
    const filter = Object.values(filters).find((f: unknown): f is FilterConfig => 
      typeof f === 'object' && f !== null && 'name' in f && (f as FilterConfig).name === filterType
    );

    if (filter) {
      return filter;
    }

    // マインドマップフィルターをチェック
    const mindMapConfig = window.contentConfig?.mindMap;
    if (mindMapConfig && 'customFilters' in mindMapConfig && Array.isArray(mindMapConfig.customFilters)) {
      const mindMapFilter = mindMapConfig.customFilters.find((f: unknown): f is FilterConfig => 
        typeof f === 'object' && f !== null && 'name' in f && (f as FilterConfig).name === filterType
      );
      if (mindMapFilter) {
        return mindMapFilter;
      }
    }

    return null;
  }

  /**
   * コンテンツフィルターの適用
   * DRY原則: フィルター適用の共通化
   */
  public applyContentFilter(filterConfig: FilterConfig): void {
    const posts = (window.allPosts || []) as SearchData[];
    let filteredPosts: SearchData[] = [];

    switch (filterConfig.type) {
      case "category":
        filteredPosts = this.filterByCategory(posts, filterConfig.target);
        break;
      case "tag":
        filteredPosts = this.filterByTag(posts, filterConfig.target);
        break;
      case "custom":
        if (filterConfig.target === "all") {
          filteredPosts = posts;
        }
        break;
      default:
        filteredPosts = posts;
    }

    this.displayFilteredPosts(filteredPosts, filterConfig);
  }

  /**
   * カテゴリ別フィルター
   * KISS原則: フィルターロジックを明確に分離
   */
  public filterByCategory(posts: SearchData[], categoryId: string): SearchData[] {
    const category = window.contentConfig?.categories?.[categoryId];
    if (!category) return posts;

    return posts.filter((post) => {
      // FilterConfigの構造に合わせて調整
      return post.title?.toLowerCase().includes(categoryId.toLowerCase()) ||
        post.description?.toLowerCase().includes(categoryId.toLowerCase()) ||
        post.category === categoryId ||
        post.learningStage === categoryId;
    });
  }

  /**
   * タグ別フィルター
   * KISS原則: フィルターロジックを明確に分離
   */
  public filterByTag(posts: SearchData[], tagId: string): SearchData[] {
    const tag = window.contentConfig?.tags?.[tagId];
    if (!tag) return posts;

    return posts.filter((post) => {
      return (
        post.tags?.some(
          (postTag: string) => postTag.toLowerCase() === tagId.toLowerCase()
        ) || false
      );
    });
  }

  /**
   * フィルター結果の表示
   * DRY原則: 表示ロジックの共通化
   */
  public displayFilteredPosts(posts: SearchData[], filterConfig: FilterConfig): void {
    const contentState = document.getElementById("contentState");
    if (!contentState) return;

    if (posts.length === 0) {
      contentState.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">📚</div>
          <h3>Tidak Ada Konten</h3>
          <p>Tidak ada konten yang ditemukan untuk filter "${filterConfig.displayName || filterConfig.name}".</p>
        </div>
      `;
      return;
    }

    // フィルター結果の表示
    const postsHTML = posts
      .map(
        (post, index) => `
      <article class="post-card post-card-${index % 4}" data-post-slug="${post.slug}">
        ${post.emoji ? `<div class="post-emoji">${post.emoji}</div>` : ""}
        <div class="post-card-container">
          <div class="post-header">
            <h2 class="post-title">
              <a href="${post.url || `/docs/${post.slug}`}">${post.title}</a>
            </h2>
            <div class="post-meta">
              <span class="post-date">${new Date(post.pubDate).toLocaleDateString("id-ID")}</span>
              <span class="post-readtime">${post.readTime || "5 min read"}</span>
            </div>
          </div>
          <p class="post-description">${post.description}</p>
          <div class="post-tags">
            ${(post.tags || [])
              .slice(0, 3)
              .map((tag) => `<span class="post-tag">${tag}</span>`)
              .join("")}
            ${
              (post.tags || []).length > 3
                ? `<span class="post-tag-more">+${(post.tags || []).length - 3}</span>`
                : ""
            }
          </div>
        </div>
      </article>
    `
      )
      .join("");

    contentState.innerHTML = postsHTML;
  }

  /**
   * エラーの表示
   * DRY原則: エラー表示の共通化
   */
  public displayError(message: string): void {
    const searchResults = document.getElementById("searchResults");
    const searchStats = document.getElementById("searchStats");
    const searchResultsContent = document.getElementById("searchResultsContent");

    if (searchResults && searchStats && searchResultsContent) {
      searchResults.classList.remove("hidden");
      searchStats.innerHTML = `<span class="search-results-count">Error</span>`;
      searchResultsContent.innerHTML = `
        <div class="search-no-results">
          <div class="no-results-icon">⚠️</div>
          <h3>Terjadi Kesalahan</h3>
          <p>${message}</p>
        </div>
      `;
    }
  }

  /**
   * 結果のキャッシュ
   * DRY原則: キャッシュ処理の共通化
   */
  public cacheResult(key: string, result: SearchResultSet): void {
    if (this.searchCache.size >= this.maxCacheSize) {
      const firstKey = this.searchCache.keys().next().value;
      if (firstKey) {
        this.searchCache.delete(firstKey);
      }
    }
    this.searchCache.set(key, result);
  }

  /**
   * パフォーマンスレポートの取得
   * KISS原則: メトリクス取得のシンプル化
   */
  public getPerformanceReport(): PerformanceMetrics & { cacheSize: number; searchDataSize: number } {
    return {
      ...this.performanceMetrics,
      cacheSize: this.searchCache.size,
      searchDataSize: this.searchData.length,
    };
  }

  /**
   * 検索メソッド（インターフェース用）
   * DRY原則: 検索処理の共通化
   */
  public async search(query: string): Promise<unknown[]> {
    await this.performSearch(query);
    return this.searchData;
  }

  /**
   * フィルターメソッド（インターフェース用）
   * DRY原則: フィルター処理の共通化
   */
  public filter(filters: Record<string, unknown>): unknown[] {
    // 基本的なフィルター実装
    return this.searchData.filter((item) => {
      for (const [key, value] of Object.entries(filters)) {
        if (value && !String(item[key as keyof SearchData]).toLowerCase().includes(String(value).toLowerCase())) {
          return false;
        }
      }
      return true;
    });
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
