/**
 * TypeScript型定義 - docs.astro分離スクリプト
 * Astroネイティブ + Strict TypeScript + ES Modules
 */

// 検索結果の型定義
export interface SearchResult {
  slug: string;
  title: string;
  description: string;
  url: string;
  relevancePercentage: number;
  score: number;
  pubDate?: string;
  tags?: string[];
}

// 検索データの型定義
export interface SearchData {
  slug: string;
  title: string;
  description: string;
  content: string;
  fullContent: string;
  tags: string[];
  category: string;
  difficulty: string;
  learningStage: string;
  url: string;
  pubDate: string;
  readTime?: string;
  emoji?: string;
  aiMetadata?: {
    contentType?: string;
    learningPath?: string[];
    aiRecommendations?: string[];
    contentComplexity?: string;
    semanticKeywords?: string[];
    learningObjectives?: string[];
    isRecommended?: boolean;
    keywords?: string[];
  };
  searchableText: string;
  wordCount: number;
  contentLength: number;
  isRecommended: boolean;
  isBeginner: boolean;
  isTool: boolean;
  hasCodeBlocks: boolean;
  hasImages: boolean;
}

// パフォーマンスメトリクスの型定義
export interface PerformanceMetrics {
  searchCount: number;
  cacheHits: number;
  avgSearchTime: number;
  totalSearchTime: number;
}

// Fuse.jsオプションの型定義
export interface FuseOptions {
  keys: Array<{ name: string; weight: number }>;
  includeScore: boolean;
  threshold: number;
  minMatchCharLength: number;
  shouldSort: boolean;
  findAllMatches: boolean;
  useExtendedSearch: boolean;
  ignoreLocation: boolean;
  distance: number;
}

// 検索結果セットの型定義
export interface SearchResultSet {
  results: SearchResult[];
  total: number;
  query: string;
  searchStrategy: 'fuzzy' | 'simple';
}

// フィルター設定の型定義
export interface FilterConfig {
  type: 'category' | 'tag' | 'custom';
  target: string;
  name?: string;
  displayName?: string;
  description?: string;
}

// グローバルウィンドウオブジェクトの拡張
declare global {
  interface Window {
    clientLogger: {
      log: (message: string, level?: 'info' | 'success' | 'warning' | 'error') => void;
      startGroup: (title: string) => void;
      endGroup: (title: string) => void;
    };
    searchLoadingManager?: ISearchLoadingManager;
    searchEngine?: IModernSearchEngine;
    waveAnimation?: { cleanup: () => void } | null;
    contentConfig?: {
      getCategories?: () => unknown[];
      getTags?: () => unknown[];
      categories?: Record<string, FilterConfig>;
      tags?: Record<string, FilterConfig>;
      filters?: Record<string, FilterConfig>;
      mindMap?: Record<string, { customFilters?: FilterConfig[] }>;
      search?: Record<string, unknown>;
    } | {
      getCategories: () => unknown[];
      getTags: () => unknown[];
      categories: Record<string, FilterConfig>;
      tags: Record<string, FilterConfig>;
      filters: Record<string, FilterConfig>;
      mindMap: Record<string, { customFilters?: FilterConfig[] }>;
      search: Record<string, unknown>;
    };
    allPosts?: SearchData[];
    Fuse?: unknown;
  }
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

export interface WaveStarsAnimationManager {
  cleanup: () => void;
}

export interface IWaveStarsAnimationManager {
  init(): { cleanup: () => void } | null;
  cleanup(): void;
  logMessage(message: string, level?: 'info' | 'success' | 'warning' | 'error'): void;
}

// インターフェース定義（実装クラス用）
export interface ISearchLoadingManager {
  searchInput: HTMLInputElement | null;
  filterButtons: NodeListOf<HTMLButtonElement>;
  loadingIndicator: HTMLElement | null;
  isReady: boolean;
  isLoading: boolean;
  
  init(): void;
  setLoadingState(): void;
  setReadyState(): void;
  setErrorState(errorMessage?: string): void;
  setLoading(loading: boolean): void;
}

export interface IModernSearchEngine {
  initialize(): Promise<boolean>;
  loadSearchData(): Promise<void>;
  initializeFuse(): Promise<void>;
  setupEventListeners(): void;
  performSearch(query: string): Promise<void>;
  simpleSearch(query: string): SearchResult[];
  displaySearchResults(searchResult: SearchResultSet): void;
  displayAllPosts(): void;
  clearSearch(): void;
  handleFilter(filterType: string | null): void;
  getFilterConfig(filterType: string | null): FilterConfig | null;
  applyContentFilter(filterConfig: FilterConfig): void;
  filterByCategory(posts: SearchData[], categoryId: string): SearchData[];
  filterByTag(posts: SearchData[], tagId: string): SearchData[];
  displayFilteredPosts(posts: SearchData[], filterConfig: FilterConfig): void;
  displayError(message: string): void;
  cacheResult(key: string, result: SearchResultSet): void;
  getPerformanceReport(): PerformanceMetrics & { cacheSize: number; searchDataSize: number };
  search(query: string): Promise<unknown[]>;
  filter(filters: Record<string, unknown>): unknown[];
}
