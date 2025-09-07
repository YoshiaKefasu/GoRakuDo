// npmパッケージのFuse.jsを使用（簡素化戦略）
import type { 
  SearchDataItem, 
  SearchResult, 
  SearchPerformanceMetrics,
  FilterConfig,
  CategoryConfig,
  TagConfig,
  ContentConfig
} from '../global';
// SearchLoadingManager is used via window.searchLoadingManager

/**
 * Enhanced Search Engine for Docs Page
 * Fuse.js Integration with search.json.js
 * Fixed: "Krashen" search issue by using unified search system
 */
export class ModernSearchEngine {
  private fuse: import('fuse.js').default<SearchDataItem> | null = null; // npmパッケージのFuse.js
  public searchData: SearchDataItem[] = [];
  public searchCache = new Map<string, SearchResult>();
  public maxCacheSize = 100;
  public performanceMetrics: SearchPerformanceMetrics = {
    searchCount: 0,
    cacheHits: 0,
    avgSearchTime: 0,
    totalSearchTime: 0,
    cacheSize: 0,
    searchDataSize: 0
  };

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
      // Safety check for clientLogger
      if (window.clientLogger && window.clientLogger.log) {
        window.clientLogger.log(
          'Initializing Modern Search Engine with Fuse.js...',
          'info'
        );
      }

      // Load search data from search.json.js endpoint
      await this.loadSearchData();

      // Initialize Fuse.js with search data
      await this.initializeFuse();

      // Set up event listeners
      this.setupEventListeners();

      if (window.clientLogger && window.clientLogger.log) {
        window.clientLogger.log('Modern search engine ready!', 'success');
        window.clientLogger.log(
          `Loaded ${this.searchData.length} posts for search`,
          'success'
        );
      }

      // Notify loading manager that search is ready
      if (window.searchLoadingManager) {
        window.searchLoadingManager.setReadyState();
      }

      return true;
    } catch (error) {
      if (window.clientLogger && window.clientLogger.log) {
        window.clientLogger.log(
          `Failed to initialize search engine: ${error}`,
          'error'
        );
      }

      // Set error state
      if (window.searchLoadingManager) {
        window.searchLoadingManager.setErrorState('Sistem pencarian gagal dimuat');
      }

      return false;
    }
  }

  private async loadSearchData(): Promise<void> {
    try {
      if (window.clientLogger && window.clientLogger.log) {
        window.clientLogger.log('Loading search data from /search.json...', 'info');
      }

      // Fetch search data from the JSON endpoint
      const response = await fetch('/search.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.searchData = await response.json();
      if (window.clientLogger && window.clientLogger.log) {
        window.clientLogger.log(
          `Loaded ${this.searchData.length} posts from search.json`,
          'success'
        );
      }

      // Debug: Check if "Keyword" content is in the search data
      const krashenPosts = this.searchData.filter(
        (post) =>
          post.content?.toLowerCase().includes('krashen') ||
          post.title?.toLowerCase().includes('krashen') ||
          post.description?.toLowerCase().includes('krashen') ||
          post.searchableText?.toLowerCase().includes('krashen')
      );

      if (window.clientLogger && window.clientLogger.log) {
        window.clientLogger.log(
          `Found ${krashenPosts.length} posts containing "Krashen": ${krashenPosts.map((p) => p.title).join(', ')}`,
          'info'
        );
      }
    } catch (error) {
      if (window.clientLogger && window.clientLogger.log) {
        window.clientLogger.log(`Error loading search data: ${error}`, 'error');
      }
      throw error;
    }
  }

  private async initializeFuse(): Promise<void> {
    try {
      // npmパッケージのFuse.jsを使用
      const { default: Fuse } = await import('fuse.js');
        
        // search.json.jsの実際のデータ構造に合わせた設定（AI機能無効化）
        const fuseOptions = {
          keys: [
            { name: 'title', weight: 0.7 },
            { name: 'description', weight: 0.3 },
            { name: 'content', weight: 0.2 },
            { name: 'tags', weight: 0.1 },
            { name: 'searchableText', weight: 0.15 },
            { name: 'category', weight: 0.05 },
            { name: 'difficulty', weight: 0.05 },
            { name: 'learningStage', weight: 0.05 },
          ],
          includeScore: true,
          threshold: 0.4, // 0 is perfect match, 1 is all results
          minMatchCharLength: 2,
          shouldSort: true,
          findAllMatches: true,
          useExtendedSearch: false,
          ignoreLocation: true,
          distance: 100,
        };

        this.fuse = new Fuse(this.searchData, fuseOptions);
        if (window.clientLogger && window.clientLogger.log) {
          window.clientLogger.log('Fuse.js initialized with search data (npm package)', 'success');
        }
    } catch (error) {
      if (window.clientLogger && window.clientLogger.log) {
        window.clientLogger.log(`Error initializing Fuse.js: ${error}`, 'error');
        window.clientLogger.log('Falling back to simple search', 'warning');
      }
      this.fuse = null;
    }
  }

  private setupEventListeners(): void {
    // Search input event listener
    const searchInput: HTMLInputElement | null = document.getElementById('searchInput') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', (e: Event) => {
        const query: string = (e.target as HTMLInputElement).value;
        this.performSearch(query);
      });

      searchInput.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          const query: string = (e.target as HTMLInputElement).value;
          this.performSearch(query);
        }
      });
    }

    // Filter buttons event listeners
    const filterButtons: NodeListOf<Element> = document.querySelectorAll('.filter-button');
    filterButtons.forEach((button: Element) => {
      button.addEventListener('click', (e: Event) => {
        const filterType: string | null = (e.target as HTMLElement).getAttribute('data-filter');
        this.handleFilter(filterType);
      });
    });

    // Clear search button - Use event delegation for dynamically created buttons
    document.addEventListener('click', (e: Event) => {
      const target: HTMLElement | null = e.target as HTMLElement;
      if (target && target.closest('[data-action="clear-search"]')) {
        if (window.clientLogger && window.clientLogger.log) {
          window.clientLogger.log('Clear search button clicked', 'info');
        }
        this.clearSearch();
      }
    });
  }

  async performSearch(query: string): Promise<void> {
    const startTime: number = performance.now();

    if (!query || query.trim().length < 2) {
      this.displayAllPosts();
      return;
    }

    try {
      if (window.clientLogger && window.clientLogger.log) {
        window.clientLogger.log(`Searching for: "${query}"`, 'info');
      }

      // Check cache first
      const cacheKey: string = query.toLowerCase();
      if (this.searchCache.has(cacheKey)) {
        this.performanceMetrics.cacheHits++;
        const cachedResults: SearchResult | undefined = this.searchCache.get(cacheKey);
        if (cachedResults) {
          this.displaySearchResults(cachedResults);
        }
        return;
      }

      let results: SearchDataItem[] = [];
      let searchStrategy: 'fuzzy' | 'simple' = 'simple';

      // Perform search with Fuse.js if available, otherwise use simple search
      if (this.fuse) {
        try {
          const fuseResults = this.fuse.search(query);
          results = fuseResults.slice(0, 20).map((result: { item: SearchDataItem; score?: number }) => ({
            ...result.item,
            score: result.score || 0,
            relevancePercentage: Math.round((1 - (result.score || 0)) * 100),
          }));
          searchStrategy = 'fuzzy';
        } catch (fuseError) {
          if (window.clientLogger && window.clientLogger.log) {
            window.clientLogger.log(
              `Fuse.js search failed, falling back to simple search: ${fuseError}`,
              'warning'
            );
          }
          results = this.simpleSearch(query);
        }
      } else {
        results = this.simpleSearch(query);
      }

      const searchResult: SearchResult = {
        results: results,
        total: results.length,
        query: query,
        searchStrategy: searchStrategy,
      };

      // Cache the result
      this.cacheResult(cacheKey, searchResult);

      // Update performance metrics
      const searchTime: number = performance.now() - startTime;
      this.performanceMetrics.searchCount++;
      this.performanceMetrics.totalSearchTime += searchTime;
      this.performanceMetrics.avgSearchTime =
        this.performanceMetrics.totalSearchTime /
        this.performanceMetrics.searchCount;

      if (window.clientLogger && window.clientLogger.log) {
        window.clientLogger.log(
          `Search completed in ${searchTime.toFixed(2)}ms`,
          'success'
        );
        window.clientLogger.log(
          `Found ${results.length} results for "${query}" using ${searchStrategy} search`,
          'success'
        );
      }

      // Display results
      this.displaySearchResults(searchResult);
    } catch (error) {
      if (window.clientLogger && window.clientLogger.log) {
        window.clientLogger.log(`Search error: ${error}`, 'error');
      }
      this.displayError('Terjadi kesalahan dalam pencarian');
    }
  }

  // Simple search fallback when Fuse.js is not available
  private simpleSearch(query: string): SearchDataItem[] {
    const searchQuery: string = query.toLowerCase();
    const results: SearchDataItem[] = [];

    this.searchData.forEach((post: SearchDataItem) => {
      let score = 0;
      let relevancePercentage = 0;

      // Search in title (highest priority)
      if (post.title?.toLowerCase().includes(searchQuery)) {
        score += 100;
      }

      // Search in description
      if (post.description?.toLowerCase().includes(searchQuery)) {
        score += 50;
      }

      // Search in content
      if (post.content?.toLowerCase().includes(searchQuery)) {
        score += 25;
      }

      // Search in tags
      if (
        post.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery))
      ) {
        score += 30;
      }

      // Search in searchableText
      if (post.searchableText?.toLowerCase().includes(searchQuery)) {
        score += 15;
      }

      // AI metadata fields are disabled

      // Search in category and learning stage
      if (post.category?.toLowerCase().includes(searchQuery)) {
        score += 25;
      }

      if (post.learningStage?.toLowerCase().includes(searchQuery)) {
        score += 25;
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

    // Sort by relevance and return top 20
    return results
      .sort((a: SearchDataItem, b: SearchDataItem) => (b.relevancePercentage || 0) - (a.relevancePercentage || 0))
      .slice(0, 20);
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
    if (window.clientLogger && window.clientLogger.log) {
      window.clientLogger.log('Clearing search...', 'info');
    }

    // Clear search input
    const searchInput: HTMLInputElement | null = document.getElementById('searchInput') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
      // Trigger input event to ensure search is cleared
      searchInput.dispatchEvent(new Event('input'));
    }

    // Show all posts
    this.displayAllPosts();

    // Provide user feedback
    if (window.clientLogger && window.clientLogger.log) {
      window.clientLogger.log('Search cleared successfully', 'success');
    }
  }

  handleFilter(filterType: string | null): void {
    if (window.clientLogger && window.clientLogger.log) {
      window.clientLogger.log(`Filter applied: ${filterType}`, 'info');
    }

    // Update active filter button
    const filterButtons: NodeListOf<Element> = document.querySelectorAll('.filter-button');
    filterButtons.forEach((btn: Element) => btn.classList.remove('active'));

    const activeButton: Element | null = document.querySelector(`[data-filter="${filterType}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
    }

    // Get filter configuration from content config
    const filterConfig = this.getFilterConfig(filterType);
    if (!filterConfig) {
      if (window.clientLogger && window.clientLogger.log) {
        window.clientLogger.log(
          `No filter configuration found for: ${filterType}`,
          'warning'
        );
      }
      return;
    }

    // Apply filter based on configuration
    this.applyContentFilter(filterConfig);
  }

  private getFilterConfig(filterType: string | null): FilterConfig | null {
    if (!filterType || filterType === 'all') {
      return { type: 'custom', target: 'all', name: 'all', displayName: 'All' };
    }

    // Find filter in content configuration
    const windowWithConfig = window as Window & { contentConfig?: ContentConfig };
    const filters: Record<string, FilterConfig> = windowWithConfig.contentConfig?.filters || {};
    const filter: FilterConfig | undefined = Object.values(filters).find((f: FilterConfig) => f.name === filterType);

    if (filter) {
      return filter;
    }

    // MindMap機能は無効化されました
    return null;
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
          post.description?.toLowerCase().includes(keyword.toLowerCase()) ||
          post.contentType === category.name ||
          post.learningStage === category.name
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
              <span class="post-readtime">${post.readTime || '5 min read'}</span>
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
  }

  private displayError(message: string): void {
    const searchResults: HTMLElement | null = document.getElementById('searchResults');
    const searchStats: HTMLElement | null = document.getElementById('searchStats');
    const searchResultsContent: HTMLElement | null = document.getElementById('searchResultsContent');

    if (searchResults && searchStats && searchResultsContent) {
      searchResults.classList.remove('hidden');
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

  private cacheResult(key: string, result: SearchResult): void {
    if (this.searchCache.size >= this.maxCacheSize) {
      const firstKey: string | undefined = this.searchCache.keys().next().value;
      if (firstKey) {
        this.searchCache.delete(firstKey);
      }
    }
    this.searchCache.set(key, result);
  }

  getPerformanceReport(): SearchPerformanceMetrics {
    return {
      ...this.performanceMetrics,
      cacheSize: this.searchCache.size,
      searchDataSize: this.searchData.length,
    };
  }
}
