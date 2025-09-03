// Search Data Generator
// Integrates with Astro build process to generate search data automatically
// Processes content at build time and generates optimized search data

import { getCollection } from 'astro:content';
import {
  contentExtractor,
  type ExtractedContent,
} from './auto-content-extractor';

export interface SearchData {
  posts: Map<string, ExtractedContent>;
  keywords: Set<string>;
  topics: Set<string>;
  languages: Set<string>;
  contentTypes: Set<string>;
  complexityLevels: Set<string>;
  totalPosts: number;
  totalWords: number;
  averageReadingTime: number;
}

/**
 * Search Data Generator
 * Processes all content and generates comprehensive search data
 */
export class SearchDataGenerator {
  private searchData: SearchData | null = null;

  /**
   * Generate search data from all blog posts
   */
  public async generateSearchData(): Promise<SearchData> {
    if (this.searchData) {
      return this.searchData; // Return cached data
    }

    try {
      // Get all blog posts from Astro content collection
      const posts = await getCollection('docs');

      // Extract content from all posts
      const extractedPosts = contentExtractor.processAllPosts(posts);

      // Generate comprehensive search data
      const searchData = this.buildSearchData(extractedPosts);

      this.searchData = searchData;

      return searchData;
    } catch (error) {
      console.error('Error generating search data:', error);
      throw error;
    }
  }

  /**
   * Build comprehensive search data from extracted posts
   */
  private buildSearchData(posts: Map<string, ExtractedContent>): SearchData {
    const keywords = new Set<string>();
    const topics = new Set<string>();
    const languages = new Set<string>();
    const contentTypes = new Set<string>();
    const complexityLevels = new Set<string>();

    let totalWords = 0;
    let totalReadingTime = 0;

    // Process each post
    posts.forEach(post => {
      // Collect keywords
      post.keywords.forEach(keyword => keywords.add(keyword));

      // Collect topics from content analysis
      if (post.content.includes('immersion')) topics.add('immersion');
      if (post.content.includes('anki')) topics.add('anki');
      if (post.content.includes('srs')) topics.add('srs');
      if (post.content.includes('hiragana')) topics.add('hiragana');
      if (post.content.includes('katakana')) topics.add('katakana');
      if (post.content.includes('kanji')) topics.add('kanji');
      if (post.content.includes('pembelajaran')) topics.add('pembelajaran');
      if (post.content.includes('metodologi')) topics.add('metodologi');
      if (post.content.includes('filosofi')) topics.add('filosofi');

      // Collect languages
      languages.add(post.language);

      // Collect content types
      contentTypes.add(post.contentType);

      // Collect complexity levels
      complexityLevels.add(post.complexity);

      // Sum up metrics
      totalWords += post.wordCount;
      totalReadingTime += post.readingTime;
    });

    const averageReadingTime = Math.round(totalReadingTime / posts.size);

    return {
      posts,
      keywords,
      topics,
      languages,
      contentTypes,
      complexityLevels,
      totalPosts: posts.size,
      totalWords,
      averageReadingTime,
    };
  }

  /**
   * Get search data for a specific post
   */
  public getPostSearchData(slug: string): ExtractedContent | null {
    if (!this.searchData) {
      console.warn(
        '⚠️ Search data not generated yet. Call generateSearchData() first.'
      );
      return null;
    }

    return this.searchData.posts.get(slug) || null;
  }

  /**
   * Get all search data
   */
  public getSearchData(): SearchData | null {
    return this.searchData;
  }

  /**
   * Search posts by query
   */
  public searchPosts(
    query: string,
    options: {
      searchFields?: string[];
      caseSensitive?: boolean;
      fuzzyMatch?: boolean;
      maxResults?: number;
    } = {}
  ): ExtractedContent[] {
    if (!this.searchData) {
      console.warn(
        '⚠️ Search data not generated yet. Call generateSearchData() first.'
      );
      return [];
    }

    const {
      searchFields = ['title', 'description', 'tags', 'content', 'keywords'],
      caseSensitive = false,
      fuzzyMatch = false,
      maxResults = 50,
    } = options;

    const searchQuery = caseSensitive ? query : query.toLowerCase();
    const results: ExtractedContent[] = [];

    this.searchData.posts.forEach(post => {
      let isMatch = false;

      // Search in title
      if (searchFields.includes('title')) {
        const titleText = caseSensitive ? post.title : post.title.toLowerCase();
        if (
          fuzzyMatch
            ? this.fuzzyMatch(titleText, searchQuery)
            : titleText.includes(searchQuery)
        ) {
          isMatch = true;
        }
      }

      // Search in description
      if (!isMatch && searchFields.includes('description')) {
        const descText = caseSensitive
          ? post.description
          : post.description.toLowerCase();
        if (
          fuzzyMatch
            ? this.fuzzyMatch(descText, searchQuery)
            : descText.includes(searchQuery)
        ) {
          isMatch = true;
        }
      }

      // Search in tags
      if (!isMatch && searchFields.includes('tags')) {
        const tagText = caseSensitive
          ? post.tags.join(' ')
          : post.tags.join(' ').toLowerCase();
        if (
          fuzzyMatch
            ? this.fuzzyMatch(tagText, searchQuery)
            : tagText.includes(searchQuery)
        ) {
          isMatch = true;
        }
      }

      // Search in content
      if (!isMatch && searchFields.includes('content')) {
        const contentText = caseSensitive
          ? post.content
          : post.content.toLowerCase();
        if (
          fuzzyMatch
            ? this.fuzzyMatch(contentText, searchQuery)
            : contentText.includes(searchQuery)
        ) {
          isMatch = true;
        }
      }

      // Search in keywords
      if (!isMatch && searchFields.includes('keywords')) {
        const keywordText = caseSensitive
          ? post.keywords.join(' ')
          : post.keywords.join(' ').toLowerCase();
        if (
          fuzzyMatch
            ? this.fuzzyMatch(keywordText, searchQuery)
            : keywordText.includes(searchQuery)
        ) {
          isMatch = true;
        }
      }

      if (isMatch) {
        results.push(post);
      }
    });

    return results.slice(0, maxResults);
  }

  /**
   * Get suggestions based on query
   */
  public getSuggestions(query: string, maxSuggestions: number = 10): string[] {
    if (!this.searchData) {
      return [];
    }

    const suggestions = new Set<string>();
    const queryLower = query.toLowerCase();

    this.searchData.posts.forEach(post => {
      // Add matching keywords
      post.keywords.forEach(keyword => {
        if (keyword.toLowerCase().includes(queryLower)) {
          suggestions.add(keyword);
        }
      });

      // Add matching tags
      post.tags.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower)) {
          suggestions.add(tag);
        }
      });
    });

    return Array.from(suggestions).slice(0, maxSuggestions);
  }

  /**
   * Filter posts by various criteria
   */
  public filterPosts(filters: {
    language?: string;
    contentType?: string;
    complexity?: string;
    minWordCount?: number;
    maxWordCount?: number;
    topics?: string[];
  }): ExtractedContent[] {
    if (!this.searchData) {
      return [];
    }

    const results: ExtractedContent[] = [];

    this.searchData.posts.forEach(post => {
      let matches = true;

      // Filter by language
      if (filters.language && post.language !== filters.language) {
        matches = false;
      }

      // Filter by content type
      if (filters.contentType && post.contentType !== filters.contentType) {
        matches = false;
      }

      // Filter by complexity
      if (filters.complexity && post.complexity !== filters.complexity) {
        matches = false;
      }

      // Filter by word count
      if (filters.minWordCount && post.wordCount < filters.minWordCount) {
        matches = false;
      }
      if (filters.maxWordCount && post.wordCount > filters.maxWordCount) {
        matches = false;
      }

      // Filter by topics
      if (filters.topics && filters.topics.length > 0) {
        const hasTopic = filters.topics.some(
          topic =>
            post.content.includes(topic) ||
            post.keywords.includes(topic) ||
            post.tags.includes(topic)
        );
        if (!hasTopic) {
          matches = false;
        }
      }

      if (matches) {
        results.push(post);
      }
    });

    return results;
  }

  /**
   * Simple fuzzy matching
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
   * Clear cached search data
   */
  public clearCache(): void {
    this.searchData = null;
  }

  /**
   * Export search data for client-side use
   */
  public exportForClient(): any {
    if (!this.searchData) {
      return null;
    }

    const clientData: any = {
      totalPosts: this.searchData.totalPosts,
      totalWords: this.searchData.totalWords,
      averageReadingTime: this.searchData.averageReadingTime,
      keywords: Array.from(this.searchData.keywords),
      topics: Array.from(this.searchData.topics),
      languages: Array.from(this.searchData.languages),
      contentTypes: Array.from(this.searchData.contentTypes),
      complexityLevels: Array.from(this.searchData.complexityLevels),
      posts: {},
    };

    // Convert posts to client-friendly format
    this.searchData.posts.forEach((post, slug) => {
      clientData.posts[slug] = {
        slug: post.slug,
        title: post.title,
        description: post.description,
        tags: post.tags,
        content: post.content, // Add content for search
        keywords: post.keywords,
        searchableText: post.searchableText,
        wordCount: post.wordCount,
        readingTime: post.readingTime,
        language: post.language,
        contentType: post.contentType,
        complexity: post.complexity,
      };
    });

    return clientData;
  }
}

// Export singleton instance
export const searchDataGenerator = new SearchDataGenerator();
