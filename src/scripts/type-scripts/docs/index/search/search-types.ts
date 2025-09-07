// Search-related type definitions for docs page
import type { SearchDataItem } from '../global';

export interface SearchResult {
  results: SearchDataItem[];
  total: number;
  query: string;
  searchStrategy: 'fuzzy' | 'simple';
}

export interface FuseSearchResult<T> {
  item: T;
  score?: number;
  matches?: FuseMatch[];
}

export interface FuseMatch {
  indices: [number, number][];
  key: string;
  value: string;
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
