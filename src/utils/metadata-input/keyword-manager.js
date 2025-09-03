// ========== KEYWORD MANAGER UTILITY ==========
// ES Modules compliant keyword management utility
// Integrates with existing search infrastructure (Fuse.js + SimpleSearch)
// Follows DRY + KISS principles by leveraging existing patterns

import { createMetadataReader } from './metadata-reader.js';

/**
 * Keyword manager for enhanced metadata input functionality
 * Provides keyword suggestions, duplicate checking, and priority management
 */
export class KeywordManager {
  constructor() {
    this.metadataReader = createMetadataReader();
    this.keywordCache = new Map();
    this.relatedKeywordsMap = new Map();
    this.usageStats = new Map();
  }

  /**
   * Extract keywords from existing content files
   * @param {Array} contentFiles - Array of content file paths and content
   * @returns {Array} Array of KeywordData objects
   */
  extractKeywordsFromContent(contentFiles) {
    const allKeywords = [];
    const keywordFrequency = new Map();

    for (const file of contentFiles) {
      try {
        const result = this.metadataReader.readMetadata(
          file.path,
          file.content
        );

        if (result.success && result.metadata && result.metadata.tags) {
          result.metadata.tags.forEach(tag => {
            // Count frequency
            keywordFrequency.set(tag, (keywordFrequency.get(tag) || 0) + 1);

            // Create keyword data
            const keywordData = {
              value: tag,
              priority: this.calculatePriority(tag, result.metadata),
              relatedKeywords: this.findRelatedKeywords(tag, result.metadata),
              usageCount: 1,
            };

            allKeywords.push(keywordData);
          });
        }
      } catch (error) {
        console.error(`Error processing file ${file.path}:`, error);
      }
    }

    // Update usage counts and cache
    this.updateKeywordCache(allKeywords, keywordFrequency);

    return allKeywords;
  }

  /**
   * Calculate keyword priority based on content metadata
   * @param {string} keyword - Keyword value
   * @param {Object} metadata - Content metadata
   * @returns {number} Priority value (1-5)
   */
  calculatePriority(keyword, metadata) {
    let priority = 3; // Default priority

    // Boost priority for featured content
    if (metadata.featured) {
      priority += 1;
    }

    // Boost priority for higher difficulty content
    if (metadata.difficulty === 'advanced') {
      priority += 1;
    } else if (metadata.difficulty === 'intermediate') {
      priority += 0.5;
    }

    // Boost priority for tutorial content
    if (metadata.contentType === 'tutorial') {
      priority += 0.5;
    }

    // Ensure priority is within 1-5 range
    return Math.min(5, Math.max(1, Math.round(priority)));
  }

  /**
   * Find related keywords based on content context
   * @param {string} keyword - Current keyword
   * @param {Object} metadata - Content metadata
   * @returns {Array} Array of related keywords
   */
  findRelatedKeywords(keyword, metadata) {
    const related = [];

    // Add other tags from the same content
    if (metadata.tags) {
      related.push(...metadata.tags.filter(tag => tag !== keyword));
    }

    // Add category as related keyword
    if (metadata.category && metadata.category !== keyword) {
      related.push(metadata.category);
    }

    // Add content type as related keyword
    if (metadata.contentType && metadata.contentType !== keyword) {
      related.push(metadata.contentType);
    }

    return [...new Set(related)]; // Remove duplicates
  }

  /**
   * Update keyword cache with new data
   * @param {Array} keywords - Array of KeywordData objects
   * @param {Map} frequency - Keyword frequency map
   */
  updateKeywordCache(keywords, frequency) {
    for (const keyword of keywords) {
      const existing = this.keywordCache.get(keyword.value);

      if (existing) {
        // Update existing keyword
        existing.usageCount =
          frequency.get(keyword.value) || existing.usageCount;
        existing.priority = Math.max(existing.priority, keyword.priority);
        existing.relatedKeywords = [
          ...new Set([...existing.relatedKeywords, ...keyword.relatedKeywords]),
        ];
      } else {
        // Add new keyword
        keyword.usageCount = frequency.get(keyword.value) || 1;
        this.keywordCache.set(keyword.value, keyword);
      }
    }

    // Update related keywords map
    this.buildRelatedKeywordsMap();
  }

  /**
   * Build related keywords mapping for fast lookups
   */
  buildRelatedKeywordsMap() {
    this.relatedKeywordsMap.clear();

    for (const [keyword, data] of this.keywordCache) {
      for (const related of data.relatedKeywords) {
        if (!this.relatedKeywordsMap.has(related)) {
          this.relatedKeywordsMap.set(related, []);
        }
        this.relatedKeywordsMap.get(related).push(keyword);
      }
    }
  }

  /**
   * Get keyword suggestions based on input
   * @param {string} input - User input for keyword suggestions
   * @param {number} limit - Maximum number of suggestions
   * @returns {Array} Array of keyword suggestions
   */
  getKeywordSuggestions(input, limit = 10) {
    if (!input || input.trim().length === 0) {
      return this.getPopularKeywords(limit);
    }

    const suggestions = [];
    const inputLower = input.toLowerCase();

    // Find exact matches first
    for (const [keyword, data] of this.keywordCache) {
      if (keyword.toLowerCase().includes(inputLower)) {
        suggestions.push({
          ...data,
          matchType: 'exact',
          relevance: this.calculateRelevance(input, keyword, data),
        });
      }
    }

    // Find related keywords
    for (const [keyword, data] of this.keywordCache) {
      if (
        data.relatedKeywords.some(related =>
          related.toLowerCase().includes(inputLower)
        )
      ) {
        suggestions.push({
          ...data,
          matchType: 'related',
          relevance: this.calculateRelevance(input, keyword, data) * 0.8,
        });
      }
    }

    // Sort by relevance and priority
    suggestions.sort((a, b) => {
      if (a.relevance !== b.relevance) {
        return b.relevance - a.relevance;
      }
      return b.priority - a.priority;
    });

    return suggestions.slice(0, limit);
  }

  /**
   * Get popular keywords based on usage and priority
   * @param {number} limit - Maximum number of keywords
   * @returns {Array} Array of popular keywords
   */
  getPopularKeywords(limit = 10) {
    const keywords = Array.from(this.keywordCache.values());

    return keywords
      .sort((a, b) => {
        // Sort by usage count first, then by priority
        if (a.usageCount !== b.usageCount) {
          return b.usageCount - a.usageCount;
        }
        return b.priority - a.priority;
      })
      .slice(0, limit);
  }

  /**
   * Calculate relevance score for keyword suggestions
   * @param {string} input - User input
   * @param {string} keyword - Keyword to score
   * @param {Object} data - Keyword data
   * @returns {number} Relevance score
   */
  calculateRelevance(input, keyword, data) {
    let score = 0;
    const inputLower = input.toLowerCase();
    const keywordLower = keyword.toLowerCase();

    // Exact match gets highest score
    if (keywordLower === inputLower) {
      score += 100;
    }
    // Starts with input gets high score
    else if (keywordLower.startsWith(inputLower)) {
      score += 80;
    }
    // Contains input gets medium score
    else if (keywordLower.includes(inputLower)) {
      score += 60;
    }

    // Boost score based on priority and usage
    score += data.priority * 10;
    score += Math.min(data.usageCount * 5, 50); // Cap usage boost at 50

    return score;
  }

  /**
   * Check for duplicate keywords
   * @param {string} keyword - Keyword to check
   * @param {Array} existingKeywords - Array of existing keywords
   * @returns {Object} Duplicate check result
   */
  checkDuplicateKeyword(keyword, existingKeywords) {
    const normalizedKeyword = keyword.toLowerCase().trim();

    // Check exact duplicates
    const exactMatch = existingKeywords.find(
      k => k.toLowerCase().trim() === normalizedKeyword
    );

    if (exactMatch) {
      return {
        isDuplicate: true,
        type: 'exact',
        existing: exactMatch,
        suggestion: null,
      };
    }

    // Check similar keywords
    const similarKeywords = existingKeywords.filter(k => {
      const normalized = k.toLowerCase().trim();
      return this.calculateSimilarity(normalizedKeyword, normalized) > 0.8;
    });

    if (similarKeywords.length > 0) {
      return {
        isDuplicate: false,
        type: 'similar',
        existing: null,
        suggestion: similarKeywords[0],
      };
    }

    return {
      isDuplicate: false,
      type: 'unique',
      existing: null,
      suggestion: null,
    };
  }

  /**
   * Calculate similarity between two strings
   * @param {string} str1 - First string
   * @param {string} str2 - Second string
   * @returns {number} Similarity score (0-1)
   */
  calculateSimilarity(str1, str2) {
    if (str1 === str2) return 1;
    if (str1.length === 0) return 0;
    if (str2.length === 0) return 0;

    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1;

    const editDistance = this.calculateEditDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * Calculate edit distance between two strings
   * @param {string} str1 - First string
   * @param {string} str2 - Second string
   * @returns {number} Edit distance
   */
  calculateEditDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Get keyword statistics
   * @returns {Object} Keyword statistics
   */
  getKeywordStats() {
    const totalKeywords = this.keywordCache.size;
    const totalUsage = Array.from(this.keywordCache.values()).reduce(
      (sum, data) => sum + data.usageCount,
      0
    );

    const priorityDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const data of this.keywordCache.values()) {
      priorityDistribution[data.priority]++;
    }

    return {
      totalKeywords,
      totalUsage,
      averageUsage: totalKeywords > 0 ? totalUsage / totalKeywords : 0,
      priorityDistribution,
      mostUsedKeywords: this.getPopularKeywords(5),
      highestPriorityKeywords: Array.from(this.keywordCache.values())
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 5),
    };
  }

  /**
   * Clear keyword cache
   */
  clearCache() {
    this.keywordCache.clear();
    this.relatedKeywordsMap.clear();
    this.usageStats.clear();
  }
}

// ========== UTILITY FUNCTIONS ==========
// Standalone utility functions for keyword operations

/**
 * Create a new keyword manager instance
 * @returns {KeywordManager} New keyword manager instance
 */
export function createKeywordManager() {
  return new KeywordManager();
}

/**
 * Extract keywords from content files
 * @param {Array} contentFiles - Array of content file objects
 * @returns {Array} Array of extracted keywords
 */
export function extractKeywordsFromContent(contentFiles) {
  const manager = createKeywordManager();
  return manager.extractKeywordsFromContent(contentFiles);
}

/**
 * Get keyword suggestions
 * @param {string} input - User input
 * @param {number} limit - Maximum suggestions
 * @returns {Array} Array of suggestions
 */
export function getKeywordSuggestions(input, limit = 10) {
  const manager = createKeywordManager();
  return manager.getKeywordSuggestions(input, limit);
}

/**
 * Check for duplicate keywords
 * @param {string} keyword - Keyword to check
 * @param {Array} existingKeywords - Existing keywords
 * @returns {Object} Duplicate check result
 */
export function checkDuplicateKeyword(keyword, existingKeywords) {
  const manager = createKeywordManager();
  return manager.checkDuplicateKeyword(keyword, existingKeywords);
}
