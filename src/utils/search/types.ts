// Simplified Search Types - Core Search System
// Essential types only for optimal performance and maintainability

export interface SearchPost {
  id: string;
  title: string;
  description: string;
  tags: string[];
  slug: string;
  contentType: 'guide' | 'tool' | 'methodology' | 'practice';
  learningStage: 'beginner' | 'intermediate' | 'advanced';
  isRecommended?: boolean;
  element?: HTMLElement; // For DOM manipulation
}

export interface SearchFilters {
  contentType?: string;
  learningStage?: string;
  isRecommended?: boolean;
}

export interface SearchResult {
  posts: SearchPost[];
  totalCount: number;
  filteredCount: number;
  searchTime: number; // Performance tracking
}

export interface SearchOptions {
  caseSensitive?: boolean;
  fuzzyMatch?: boolean;
  maxResults?: number;
  searchFields?: ('title' | 'description' | 'tags')[];
}

// Performance tracking interface
export interface SearchMetrics {
  searchTime: number;
  filterTime: number;
  totalTime: number;
  resultCount: number;
}
