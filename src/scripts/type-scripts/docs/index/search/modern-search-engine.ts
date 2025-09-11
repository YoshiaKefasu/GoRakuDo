// 0-Script最適化対応のFuse.js検索エンジン
import type { 
  SearchDataItem, 
  SearchResult, 
  FilterConfig,
  CategoryConfig,
  TagConfig,
  ContentConfig
} from '../global';

/**
 * Enhanced Search Engine for Docs Page
 * 0-Script最適化対応: サーバーサイドデータ優先使用
 * Fuse.js Integration with fallback to simple search
 */
export class ModernSearchEngine {
  private fuse: import('fuse.js').default<SearchDataItem> | null = null; // npmパッケージのFuse.js（型安全性向上）
  public searchData: SearchDataItem[] = [];
  private searchCache = new Map<string, SearchResult>();
  private maxCacheSize = 50; // サイズ削減

  constructor() {
    // Defer initialization to ensure clientLogger is available
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initialize());
    } else {
      this.initialize();
    }
  }

  async initialize(): Promise<boolean> {
    try {
      // 簡素化: サーバーサイドデータを直接使用
      this.searchData = window.searchData || await this.loadSearchData();
      
      // Fuse.jsの簡素化された初期化
      const { default: Fuse } = await import('fuse.js');
      this.fuse = new Fuse(this.searchData, this.getFuseOptions());
      
      // イベントリスナーの簡素化
      this.setupSimpleEventListeners();
      
      // ローディング状態の更新
      if (window.searchLoadingManager) {
        window.searchLoadingManager.setReadyState();
      }
      
      return true;
    } catch (error) {
      console.error('Search initialization failed:', error);
      if (window.searchLoadingManager) {
        window.searchLoadingManager.setErrorState('Search temporarily unavailable');
      }
      return false;
    }
  }

  private async loadSearchData(): Promise<SearchDataItem[]> {
    try {
      const response = await fetch('/search.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading search data:', error);
      throw error;
    }
  }

  // 簡素化されたFuse.js設定
  private getFuseOptions() {
    return {
      keys: [
        { name: 'title', weight: 0.7 },
        { name: 'description', weight: 0.3 },
        { name: 'tags', weight: 0.1 },
        { name: 'searchableText', weight: 0.15 }
      ],
      threshold: 0.4,
      includeScore: true
    };
  }

  // 簡素化されたイベントリスナー設定
  private setupSimpleEventListeners(): void {
    // 検索入力のイベントリスナー
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.performSearch((e.target as HTMLInputElement).value);
      });
    }

    // フィルタボタンのイベントリスナー
    document.querySelectorAll('.filter-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const filterType = (e.target as HTMLElement).getAttribute('data-filter');
        this.handleFilter(filterType);
      });
    });

    // クリア検索ボタンのイベント委譲
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target?.closest('[data-action="clear-search"]')) {
        this.clearSearch();
      }
    });
  }

  async performSearch(query: string): Promise<void> {
    if (!query || query.trim().length < 2) {
      this.displayAllPosts();
      return;
    }

    // 簡素化されたキャッシュチェック
    const cacheKey = query.toLowerCase();
    const cached = this.getCachedResult(cacheKey);
    if (cached) {
      this.displaySearchResults(cached);
      return;
    }

    // Fuse.js検索の簡素化（スコア計算付き）
    const results = this.fuse ? this.fuse.search(query).slice(0, 20) : [];
    const searchResult = {
      results: results.map(r => ({
        ...r.item,
        relevancePercentage: this.calculateRelevancePercentage(r.score || 0)
      })),
      total: results.length,
      query: query,
      searchStrategy: 'fuzzy' as const
    };

    // 簡素化されたキャッシュ保存
    this.setCachedResult(cacheKey, searchResult);
    this.displaySearchResults(searchResult);
  }


  private displaySearchResults(searchResult: SearchResult): void {
    const searchResults: HTMLElement | null = document.getElementById('searchResults');
    const searchStats: HTMLElement | null = document.getElementById('searchStats');
    const searchResultsContent: HTMLElement | null = document.getElementById('searchResultsContent');
    const contentState: HTMLElement | null = document.getElementById('contentState');

    if (!searchResults || !searchStats || !searchResultsContent) {
      if (window.clientLogger && window.clientLogger.log) {
        window.clientLogger.log('Search results elements not found', 'error');
      }
      return;
    }

    // Hide main content and show search results
    if (contentState) {
      contentState.classList.add('hidden');
    }
    searchResults.classList.remove('hidden');

    if (searchResult.total === 0) {
      // No results found
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
      // Results found
      searchStats.innerHTML = `
        <span class="search-results-count">
          Ditemukan ${searchResult.total} hasil untuk "${searchResult.query}"
        </span>
        <button class="clear-search-btn" data-action="clear-search">
          ✕ Hapus Pencarian
        </button>
      `;

      // Generate search results HTML using same structure as main cards
      const resultsHTML: string = searchResult.results
        .map((result: SearchDataItem, index: number) => {
          const title: string = result.title || 'Untitled';
          const description: string = result.description || '';
          const url: string = result.url || `/docs/${result.slug}`;
          const relevance: number = result.relevancePercentage || 0;
          const pubDate: Date | null = result.pubDate ? new Date(result.pubDate) : null;
          const formattedDate: string = pubDate
            ? pubDate.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : '';

          // Get emoji from search data or use default
          const emoji: string = result.emoji || '🔍'; // Use post emoji or search emoji

          // Get tags for display
          const tags: string[] = result.tags || [];
          const displayTags: string[] = tags.slice(0, 3);
          const remainingTags: number = tags.length > 3 ? tags.length - 3 : 0;

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
                  ${displayTags.map((tag: string) => `<span class="post-tag">${tag}</span>`).join('')}
                  ${remainingTags > 0 ? `<span class="post-tag-more" data-count="${remainingTags}">+${remainingTags}</span>` : ''}
                </div>
                <a class="read-more-btn" href="${url}">
                  Baca Selengkapnya →
                </a>
              </div>
            </article>
          `;
        })
        .join('');

      searchResultsContent.innerHTML = `
        <div class="posts-grid">
          ${resultsHTML}
        </div>
      `;

      // 検索結果のタグポップアップ初期化
      this.initializeTagPopupsForResults();
    }
  }

  private displayAllPosts(): void {
    const searchResults: HTMLElement | null = document.getElementById('searchResults');
    const contentState: HTMLElement | null = document.getElementById('contentState');

    if (searchResults) {
      searchResults.classList.add('hidden');
    }
    if (contentState) {
      contentState.classList.remove('hidden');
    }
  }

  clearSearch(): void {
    // 検索入力のクリア
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
    }

    // 全投稿の表示
    this.displayAllPosts();
  }

  handleFilter(filterType: string | null): void {
    // アクティブフィルタボタンの更新
    document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
    const activeButton = document.querySelector(`[data-filter="${filterType}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
    }

    // フィルタ設定の取得と適用
    const filterConfig = this.getFilterConfig(filterType);
    if (filterConfig) {
      this.applyContentFilter(filterConfig);
    }
  }

  private getFilterConfig(filterType: string | null): FilterConfig | null {
    if (!filterType || filterType === 'all') {
      return { type: 'custom', target: 'all', name: 'all', displayName: 'All' };
    }

    // Find filter in content configuration
    const windowWithConfig = window as Window & { contentConfig?: ContentConfig };
    const filters: Record<string, FilterConfig> = windowWithConfig.contentConfig?.filters || {};
    const filter: FilterConfig | undefined = Object.values(filters).find((f: FilterConfig) => f.name === filterType);

    return filter || null;
  }

  private applyContentFilter(filterConfig: FilterConfig): void {
    const windowWithPosts = window as Window & { allPosts?: SearchDataItem[] };
    const posts: SearchDataItem[] = windowWithPosts.allPosts || [];
    let filteredPosts: SearchDataItem[] = [];

    switch (filterConfig.type) {
      case 'category':
        filteredPosts = this.filterByCategory(posts, filterConfig.target);
        break;
      case 'tag':
        filteredPosts = this.filterByTag(posts, filterConfig.target);
        break;
      case 'custom':
        if (filterConfig.target === 'all') {
          filteredPosts = posts;
        }
        break;
      default:
        filteredPosts = posts;
    }

    this.displayFilteredPosts(filteredPosts, filterConfig);
  }

  private filterByCategory(posts: SearchDataItem[], categoryId: string): SearchDataItem[] {
    const windowWithConfig = window as Window & { contentConfig?: ContentConfig };
    const category: CategoryConfig | undefined = windowWithConfig.contentConfig?.categories?.[categoryId];
    if (!category) return posts;

    return posts.filter((post: SearchDataItem) => {
      return category.keywords.some(
        (keyword: string) =>
          post.title?.toLowerCase().includes(keyword.toLowerCase()) ||
          post.description?.toLowerCase().includes(keyword.toLowerCase())
      );
    });
  }

  private filterByTag(posts: SearchDataItem[], tagId: string): SearchDataItem[] {
    const windowWithConfig = window as Window & { contentConfig?: ContentConfig };
    const tag: TagConfig | undefined = windowWithConfig.contentConfig?.tags?.[tagId];
    if (!tag) return posts;

    return posts.filter((post: SearchDataItem) => {
      return (
        post.tags?.some(
          (postTag: string) => postTag.toLowerCase() === tag.name.toLowerCase()
        ) || false
      );
    });
  }

  private displayFilteredPosts(posts: SearchDataItem[], filterConfig: FilterConfig): void {
    const contentState: HTMLElement | null = document.getElementById('contentState');
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

    // Display filtered posts
    const postsHTML: string = posts
      .map(
        (post: SearchDataItem, index: number) => `
      <article class="post-card post-card-${index % 4}" data-post-slug="${post.slug}">
        ${post.emoji ? `<div class="post-emoji">${post.emoji}</div>` : ''}
        <div class="post-card-container">
          <div class="post-header">
            <h2 class="post-title">
              <a href="${post.url || `/docs/${post.slug}`}">${post.title}</a>
            </h2>
            <div class="post-meta">
              <span class="post-date">${new Date(post.pubDate || '').toLocaleDateString('id-ID')}</span>
            </div>
          </div>
          <p class="post-description">${post.description}</p>
          <div class="post-tags">
            ${(post.tags || [])
              .slice(0, 3)
              .map((tag) => `<span class="post-tag">${tag}</span>`)
              .join('')}
            ${
              (post.tags || []).length > 3
                ? `<span class="post-tag-more">+${(post.tags || []).length - 3}</span>`
                : ''
            }
          </div>
        </div>
      </article>
    `
      )
      .join('');

    contentState.innerHTML = postsHTML;

    // フィルタ結果のタグポップアップ初期化
    this.initializeTagPopupsForResults();
  }


  // Fuse.jsスコアから関連度パーセンテージを計算
  private calculateRelevancePercentage(score: number): number {
    // Fuse.jsのスコアは0-1の範囲（0が完全一致、1が完全不一致）
    // 関連度パーセンテージに変換（0-100%）
    if (score === 0) return 100; // 完全一致
    if (score >= 1) return 0;    // 完全不一致
    
    // スコアを反転してパーセンテージに変換
    const relevance = Math.round((1 - score) * 100);
    return Math.max(0, Math.min(100, relevance)); // 0-100の範囲に制限
  }

  // 簡素化されたキャッシュ操作
  private getCachedResult(key: string): SearchResult | undefined {
    return this.searchCache.get(key);
  }

  private setCachedResult(key: string, result: SearchResult): void {
    // LRU方式の簡素化
    if (this.searchCache.size >= this.maxCacheSize) {
      const firstKey = this.searchCache.keys().next().value;
      if (firstKey) {
        this.searchCache.delete(firstKey);
      }
    }
    this.searchCache.set(key, result);
  }


  // 検索結果のタグポップアップ初期化（簡素化）
  private async initializeTagPopupsForResults(): Promise<void> {
    try {
      const { SimpleTagPopup } = await import('../ui/simple-tag-popup');
      const tagPopup = new SimpleTagPopup();
      
      const tagContainers = document.querySelectorAll('#searchResults .post-tags, #contentState .post-tags');
      tagContainers.forEach((container) => {
        tagPopup.setupContainer(container as HTMLElement);
      });
    } catch (error) {
      console.warn('Failed to initialize tag popups:', error);
    }
  }
}
