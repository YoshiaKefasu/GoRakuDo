// Search System Index - Core Search System
// Exports all search functionality for easy integration

import { SimpleSearch } from './simple-search';
import type {
  SearchPost,
  SearchFilters,
  SearchResult,
  SearchOptions,
  SearchMetrics,
} from './types';

export { SimpleSearch };
export type {
  SearchPost,
  SearchFilters,
  SearchResult,
  SearchOptions,
  SearchMetrics,
};

// Enhanced type definition for Astro content with aiMetadata
interface AstroContentPost {
  id?: string;
  slug: string;
  data: {
    title?: string;
    description?: string;
    tags?: string[];
    aiMetadata?: {
      contentType?: 'guide' | 'tool' | 'methodology' | 'practice';
      learningStage?: 'beginner' | 'intermediate' | 'advanced';
      isRecommended?: boolean;
      complexity?: string;
      keywords?: string[];
      semanticKeywords?: string[];
      learningObjectives?: string[];
      learningPath?: string[];
      recommendations?: string[];
    };
  };
}

// Helper function to convert Astro content to SearchPost format
export function convertToSearchPost(astroPost: AstroContentPost): SearchPost {
  return {
    id: astroPost.id || astroPost.slug,
    title: astroPost.data.title || '',
    description: astroPost.data.description || '',
    tags: astroPost.data.tags || [],
    slug: astroPost.slug || '',
    contentType: astroPost.data.aiMetadata?.contentType || 'guide',
    learningStage: astroPost.data.aiMetadata?.learningStage || 'beginner',
    isRecommended: astroPost.data.aiMetadata?.isRecommended || false,
  };
}

// Helper function to initialize search with Astro content
export function initializeSearchWithAstroContent(posts: AstroContentPost[]): SimpleSearch {
  const searchPosts = posts.map(convertToSearchPost);
  return new SimpleSearch(searchPosts);
}
