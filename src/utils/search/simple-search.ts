// Core Search System - Simple & Fast Implementation
// Performance target: <50ms search response, <30ms filter response
// Zero dependencies, optimized for Astro + Vue integration

import type {
  SearchPost,
  SearchFilters,
  SearchResult,
  SearchOptions,
  SearchMetrics,
} from "./types";

export class SimpleSearch {
  private posts: SearchPost[] = [];
  private searchCache = new Map<string, SearchPost[]>();
  private performanceMetrics: SearchMetrics = {
    searchTime: 0,
    filterTime: 0,
    totalTime: 0,
    resultCount: 0,
  };

  constructor(posts: SearchPost[] = []) {
    this.posts = posts;
    this.initializeCache();
  }

  /**
   * Initialize search cache for better performance
   * Pre-processes posts for faster searching
   */
  private initializeCache(): void {
    // Pre-process posts for faster searching
    this.posts.forEach((post) => {
      // Create searchable text for each post
      this.createSearchableText(post);
      post.element = this.findPostElement(post.slug);
    });
  }

  /**
   * Create searchable text from post data
   * Optimized for fast text matching
   */
  private createSearchableText(post: SearchPost): string {
    return `${post.title} ${post.description} ${post.tags.join(" ")}`.toLowerCase();
  }

  /**
   * Find post element in DOM by slug
   * Used for showing/hiding posts during search
   */
  private findPostElement(slug: string): HTMLElement | undefined {
    return document.querySelector(`[data-post-slug="${slug}"]`) as HTMLElement;
  }

  /**
   * Fast text search with performance optimization
   * Target: <50ms response time
   */
  search(query: string, options: SearchOptions = {}): SearchResult {
    const startTime = performance.now();

    if (!query.trim()) {
      const result: SearchResult = {
        posts: this.posts,
        totalCount: this.posts.length,
        filteredCount: this.posts.length,
        searchTime: performance.now() - startTime,
      };
      this.updateMetrics(result.searchTime, 0, result.posts.length);
      return result;
    }

    // Check cache first for better performance
    const cacheKey = `${query}-${JSON.stringify(options)}`;
    if (this.searchCache.has(cacheKey)) {
      const cachedPosts = this.searchCache.get(cacheKey)!;
      const result: SearchResult = {
        posts: cachedPosts,
        totalCount: this.posts.length,
        filteredCount: cachedPosts.length,
        searchTime: performance.now() - startTime,
      };
      this.updateMetrics(result.searchTime, 0, result.posts.length);
      return result;
    }

    const searchQuery = options.caseSensitive ? query : query.toLowerCase();
    const searchFields = options.searchFields || [
      "title",
      "description",
      "tags",
    ];

    // Fast filtering with optimized algorithm
    const matchedPosts = this.posts.filter((post) => {
      // Search in title (highest priority)
      if (
        searchFields.includes("title") &&
        this.matchesField(post.title, searchQuery, options)
      ) {
        return true;
      }

      // Search in description
      if (
        searchFields.includes("description") &&
        this.matchesField(post.description, searchQuery, options)
      ) {
        return true;
      }

      // Search in tags
      if (
        searchFields.includes("tags") &&
        post.tags.some((tag) => this.matchesField(tag, searchQuery, options))
      ) {
        return true;
      }

      return false;
    });

    // Apply result limit if specified
    const limitedPosts = options.maxResults
      ? matchedPosts.slice(0, options.maxResults)
      : matchedPosts;

    // Cache the result for future searches
    this.searchCache.set(cacheKey, limitedPosts);

    const result: SearchResult = {
      posts: limitedPosts,
      totalCount: this.posts.length,
      filteredCount: limitedPosts.length,
      searchTime: performance.now() - startTime,
    };

    this.updateMetrics(result.searchTime, 0, result.posts.length);
    return result;
  }

  /**
   * Fast field matching with fuzzy search support
   * Optimized for performance and accuracy
   */
  private matchesField(
    field: string,
    query: string,
    options: SearchOptions,
  ): boolean {
    const fieldText = options.caseSensitive ? field : field.toLowerCase();

    if (options.fuzzyMatch) {
      return this.fuzzyMatch(fieldText, query);
    }

    return fieldText.includes(query);
  }

  /**
   * Simple fuzzy matching for better search results
   * Optimized for performance
   */
  private fuzzyMatch(text: string, query: string): boolean {
    let queryIndex = 0;
    for (let i = 0; i < text.length && queryIndex < query.length; i++) {
      if (text[i] === query[queryIndex]) {
        queryIndex++;
      }
    }
    return queryIndex === query.length;
  }

  /**
   * Fast filtering by content type, learning stage, etc.
   * Target: <30ms response time
   */
  filter(filters: SearchFilters): SearchResult {
    const startTime = performance.now();

    const filteredPosts = this.posts.filter((post) => {
      // Filter by content type
      if (filters.contentType && post.contentType !== filters.contentType) {
        return false;
      }

      // Filter by learning stage
      if (
        filters.learningStage &&
        post.learningStage !== filters.learningStage
      ) {
        return false;
      }

      // Filter by recommended status
      if (
        filters.isRecommended !== undefined &&
        post.isRecommended !== filters.isRecommended
      ) {
        return false;
      }

      return true;
    });

    const result: SearchResult = {
      posts: filteredPosts,
      totalCount: this.posts.length,
      filteredCount: filteredPosts.length,
      searchTime: performance.now() - startTime,
    };

    this.updateMetrics(0, result.searchTime, result.posts.length);
    return result;
  }

  /**
   * Combined search and filter operation
   * Optimized for single-pass processing
   */
  searchAndFilter(
    query: string,
    filters: SearchFilters,
    options: SearchOptions = {},
  ): SearchResult {
    const startTime = performance.now();

    // First apply filters (usually faster than search)
    const filteredResult = this.filter(filters);

    // Then apply search to filtered results
    const searchResult = this.search(query, options);

    // Combine results efficiently
    const combinedPosts = searchResult.posts.filter((post) =>
      filteredResult.posts.some((filteredPost) => filteredPost.id === post.id),
    );

    const result: SearchResult = {
      posts: combinedPosts,
      totalCount: this.posts.length,
      filteredCount: combinedPosts.length,
      searchTime: performance.now() - startTime,
    };

    this.updateMetrics(
      searchResult.searchTime,
      filteredResult.searchTime,
      result.posts.length,
    );
    return result;
  }

  /**
   * Get search suggestions based on current posts
   * Optimized for fast suggestion generation
   */
  getSuggestions(query: string, maxSuggestions: number = 5): string[] {
    if (!query.trim()) return [];

    const suggestions = new Set<string>();
    const queryLower = query.toLowerCase();

    // Extract suggestions from titles and tags
    this.posts.forEach((post) => {
      // Add matching words from title
      const titleWords = post.title.toLowerCase().split(/\s+/);
      titleWords.forEach((word) => {
        if (word.includes(queryLower) && word.length > 2) {
          suggestions.add(word);
        }
      });

      // Add matching tags
      post.tags.forEach((tag) => {
        if (tag.toLowerCase().includes(queryLower)) {
          suggestions.add(tag);
        }
      });
    });

    return Array.from(suggestions).slice(0, maxSuggestions);
  }

  /**
   * Update performance metrics for monitoring
   */
  private updateMetrics(
    searchTime: number,
    filterTime: number,
    resultCount: number,
  ): void {
    this.performanceMetrics = {
      searchTime,
      filterTime,
      totalTime: searchTime + filterTime,
      resultCount,
    };
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): SearchMetrics {
    return { ...this.performanceMetrics };
  }

  /**
   * Clear search cache to free memory
   */
  clearCache(): void {
    this.searchCache.clear();
  }

  /**
   * Update posts data (useful for dynamic content)
   */
  updatePosts(newPosts: SearchPost[]): void {
    this.posts = newPosts;
    this.clearCache();
    this.initializeCache();
  }

  /**
   * Get all posts (useful for debugging)
   */
  getAllPosts(): SearchPost[] {
    return [...this.posts];
  }
}
