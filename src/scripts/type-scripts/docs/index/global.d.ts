// 実際のsearch.json.jsの出力構造に基づく正確な型定義
// search.json.jsの38-113行の実際のデータ構造を完全に反映
// 実際のファイル構造: src/pages/search.json.js (38-113行)

declare global {
  interface Window {
    clientLogger: {
      log: (message: string, level?: "info" | "success" | "warning" | "error") => void;
      startGroup: (title: string) => void;
      endGroup: (title: string) => void;
    };
    searchLoadingManager?: SearchLoadingManager;
    searchEngine?: ModernSearchEngine;
    searchData?: SearchDataItem[]; // 0-Script最適化: サーバーサイド検索データ
    contentConfig?: ContentConfig;
    allPosts?: SearchDataItem[];
    Fuse?: import('fuse.js').default; // npmパッケージ版（型安全性向上）
    contentProcessor?: ContentProcessor; // ContentProcessor instance
    searchDataGenerator?: SearchDataGenerator; // SearchDataGenerator instance
    // Animation and UI functions
    initializeTagPopups?: () => void;
    simpleTagPopup?: import('./ui/simple-tag-popup').SimpleTagPopup;
  }
}

// 実際のsearch.json.jsの出力構造（38-113行）に基づく正確な型定義
export interface SearchDataItem {
  // Core post data (38-45行)
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  emoji?: string;

  // Content for search (47-49行)
  content: string;
  fullContent: string;

  // Metadata for filtering (51-55行)
  tags: string[];
  category: string;

  // Searchable text (66-83行)
  searchableText: string;

  // Content analysis (85-88行)
  wordCount: number;
  contentLength: number;

  // Feature flags (90-99行)
  isRecommended: boolean;
  isBeginner: boolean;
  isTool: boolean;
  hasCodeBlocks: boolean;
  hasImages: boolean;

  // URL for navigation (101-112行)
  url: string;

  // 検索結果用の追加プロパティ（検索エンジンで追加）
  score?: number;
  relevancePercentage?: number;
}

export interface ContentConfig {
  categories: Record<string, CategoryConfig>;
  tags: Record<string, TagConfig>;
  filters: Record<string, FilterConfig>;
  search: Record<string, SearchConfig>;
}

export interface CategoryConfig {
  name: string;
  displayName: string;
  keywords: string[];
  icon?: string;
  description?: string;
}

export interface TagConfig {
  name: string;
  displayName: string;
  color?: string;
  description?: string;
}

// MindMap機能は完全削除されました

export interface SearchConfig {
  defaultThreshold: number;
  maxResults: number;
  enableFuzzy: boolean;
}

export interface SearchLoadingManager {
  searchInput: HTMLInputElement | null;
  filterButtons: NodeListOf<HTMLButtonElement>;
  loadingIndicator: HTMLElement | null;
  isReady: boolean;
  setLoadingState(): void;
  setReadyState(): void;
  setErrorState(errorMessage?: string): void;
}

export interface ModernSearchEngine {
  searchData: SearchDataItem[];
  initialize(): Promise<boolean>;
  performSearch(query: string): Promise<void>;
  clearSearch(): void;
  handleFilter(filterType: string | null): void;
}

export interface FuseSearchResult<T> {
  item: T;
  score?: number;
  matches?: FuseMatch[];
  refIndex?: number; // 追加: 参照インデックス
}

export interface FuseMatch {
  indices: [number, number][];
  key: string;
  value: string;
}

export interface FuseOptions {
  keys: Array<string | { name: string; weight?: number }>;
  threshold?: number;
  minMatchCharLength?: number;
  shouldSort?: boolean;
  findAllMatches?: boolean;
  useExtendedSearch?: boolean;
  ignoreLocation?: boolean;
  distance?: number;
  includeScore?: boolean;
  includeMatches?: boolean;
}

export interface SearchResult {
  results: SearchDataItem[];
  total: number;
  query: string;
  searchStrategy: 'fuzzy' | 'simple';
}

export interface SearchPerformanceMetrics {
  searchCount: number;
  cacheHits: number;
  avgSearchTime: number;
  totalSearchTime: number;
  cacheSize: number;
  searchDataSize: number;
}

export interface FilterConfig {
  type: 'category' | 'tag' | 'custom';
  target: string;
  name: string;
  displayName: string;
  description?: string;
  icon?: string;
}

// ContentProcessor and SearchDataGenerator interfaces
export interface ContentProcessor {
  changePage(page: number): void;
  getTotalPages(): number;
  getCurrentPage(): number;
  isReady(): boolean;
  updateDisplay(): void;
  updatePaginationUI(): void;
  updateContentDisplay(): void;
}

export interface SearchDataGenerator {
  getSearchData(): SearchDataItem[];
  getPostSearchData(slug: string): SearchDataItem | undefined;
  refreshSearchData(): Promise<void>;
}

export {};
