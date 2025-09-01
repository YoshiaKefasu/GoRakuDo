// ========== TITLE ANALYZER UTILITY ==========
// ES Modules compliant title analysis utility for keyword extraction
// Follows DRY principle by leveraging existing text processing utilities

/**
 * Title analyzer for keyword extraction
 * Extracts meaningful keywords from article titles using simple rules
 */
export class TitleAnalyzer {
  constructor() {
    this.keywordPatterns = {
      // Noun patterns (highest priority)
      nouns: /[\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/g,
      // Adjective patterns
      adjectives: /[\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/g,
      // Technical terms
      technical: /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g,
      // Acronyms
      acronyms: /\b[A-Z]{2,}\b/g
    };
    
    this.minKeywordLength = 2;
    this.maxKeywordLength = 20;
    this.maxKeywordsPerTitle = 8;
  }

  /**
   * Extract keywords from title
   * @param {string} title - Article title
   * @param {string} language - Language for processing
   * @returns {Promise<Array>} Extracted keywords
   */
  async extractKeywords(title, language = 'id') {
    if (!title || typeof title !== 'string') {
      return [];
    }

    // Normalize title
    const normalizedTitle = this.normalizeTitle(title);
    
    // Extract different types of keywords
    const nounKeywords = this.extractNounKeywords(normalizedTitle);
    const technicalKeywords = this.extractTechnicalKeywords(normalizedTitle);
    const acronymKeywords = this.extractAcronymKeywords(normalizedTitle);
    
    // Combine and filter keywords
    const allKeywords = [...nounKeywords, ...technicalKeywords, ...acronymKeywords];
    const filteredKeywords = await this.filterKeywords(allKeywords, language);
    
    // Rank and limit keywords
    return this.rankKeywords(filteredKeywords, title).slice(0, this.maxKeywordsPerTitle);
  }

  /**
   * Normalize title for processing
   * @param {string} title - Raw title
   * @returns {string} Normalized title
   */
  normalizeTitle(title) {
    return title
      .trim()
      .toLowerCase()
      .replace(/[^\w\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, ' ')
      .replace(/\s+/g, ' ');
  }

  /**
   * Extract noun-like keywords
   * @param {string} title - Normalized title
   * @returns {Array} Noun keywords
   */
  extractNounKeywords(title) {
    const words = title.split(/\s+/);
    const nouns = [];
    
    words.forEach(word => {
      if (this.isValidKeyword(word)) {
        // Simple noun detection (avoid complex NLP)
        if (word.length >= this.minKeywordLength && 
            word.length <= this.maxKeywordLength &&
            !this.isCommonWord(word)) {
          nouns.push(word);
        }
      }
    });
    
    return nouns;
  }

  /**
   * Extract technical keywords
   * @param {string} title - Normalized title
   * @returns {Array} Technical keywords
   */
  extractTechnicalKeywords(title) {
    const matches = title.match(this.keywordPatterns.technical);
    if (!matches) return [];
    
    return matches
      .map(match => match.toLowerCase())
      .filter(word => this.isValidKeyword(word));
  }

  /**
   * Extract acronym keywords
   * @param {string} title - Normalized title
   * @returns {Array} Acronym keywords
   */
  extractAcronymKeywords(title) {
    const matches = title.match(this.keywordPatterns.acronyms);
    if (!matches) return [];
    
    return matches.filter(acronym => {
      // Filter out very short or very long acronyms
      return acronym.length >= 2 && acronym.length <= 6;
    });
  }

  /**
   * Check if a word is a valid keyword
   * @param {string} word - Word to check
   * @returns {boolean} True if valid keyword
   */
  isValidKeyword(word) {
    if (!word || typeof word !== 'string') return false;
    
    const length = word.length;
    return length >= this.minKeywordLength && length <= this.maxKeywordLength;
  }

  /**
   * Check if a word is a common word
   * @param {string} word - Word to check
   * @returns {boolean} True if common word
   */
  isCommonWord(word) {
    const commonWords = [
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'yang', 'dan', 'atau', 'dengan', 'ke', 'dari', 'di', 'untuk', 'pada',
      'の', 'に', 'は', 'を', 'が', 'と', 'で', 'から', 'まで', 'より'
    ];
    
    return commonWords.includes(word.toLowerCase());
  }

  /**
   * Filter keywords using stopwords
   * @param {Array} keywords - Keywords to filter
   * @param {string} language - Language for stopwords
   * @returns {Promise<Array>} Filtered keywords
   */
  async filterKeywords(keywords, language) {
    const filtered = [];
    
    for (const keyword of keywords) {
      if (!(await this.isStopWord(keyword, language))) {
        filtered.push(keyword);
      }
    }
    
    return filtered;
  }

  /**
   * Check if a word is a stopword
   * @param {string} word - Word to check
   * @param {string} language - Language code
   * @returns {Promise<boolean>} True if stopword
   */
  async isStopWord(word, language) {
    try {
      const stopWordsPath = `src/data/stopwords/${language}.json`;
      const response = await fetch(stopWordsPath);
      if (!response.ok) {
        return this.isCommonWord(word); // Fallback to common words
      }
      
      const stopWordsData = await response.json();
      const stopWords = new Set(stopWordsData.words || []);
      
      return stopWords.has(word.toLowerCase());
    } catch (error) {
      console.warn(`Using fallback stopword check for ${language}:`, error);
      return this.isCommonWord(word);
    }
  }

  /**
   * Rank keywords by relevance to title
   * @param {Array} keywords - Keywords to rank
   * @param {string} title - Original title
   * @returns {Array} Ranked keywords
   */
  rankKeywords(keywords, title) {
    const titleWords = title.toLowerCase().split(/\s+/);
    
    return keywords
      .map(keyword => {
        const relevance = this.calculateKeywordRelevance(keyword, titleWords);
        return { keyword, relevance };
      })
      .sort((a, b) => b.relevance - a.relevance)
      .map(item => item.keyword);
  }

  /**
   * Calculate keyword relevance to title
   * @param {string} keyword - Keyword to evaluate
   * @param {Array} titleWords - Words in title
   * @returns {number} Relevance score
   */
  calculateKeywordRelevance(keyword, titleWords) {
    let relevance = 0;
    
    // Exact match gets highest score
    if (titleWords.includes(keyword.toLowerCase())) {
      relevance += 100;
    }
    
    // Partial match gets medium score
    titleWords.forEach(titleWord => {
      if (titleWord.includes(keyword.toLowerCase()) || 
          keyword.toLowerCase().includes(titleWord)) {
        relevance += 50;
      }
    });
    
    // Length bonus (optimal length gets bonus)
    const length = keyword.length;
    if (length >= 4 && length <= 8) {
      relevance += 20;
    } else if (length >= 3 && length <= 10) {
      relevance += 10;
    }
    
    // Technical term bonus
    if (this.keywordPatterns.acronyms.test(keyword)) {
      relevance += 30;
    }
    
    return relevance;
  }

  /**
   * Get keyword suggestions based on title
   * @param {string} title - Article title
   * @param {string} language - Language for processing
   * @returns {Promise<Object>} Keyword analysis result
   */
  async analyzeTitle(title, language = 'id') {
    const keywords = await this.extractKeywords(title, language);
    const analysis = {
      title,
      language,
      keywords,
      keywordCount: keywords.length,
      extractionQuality: this.assessExtractionQuality(keywords, title),
      suggestions: this.generateKeywordSuggestions(keywords, title)
    };
    
    return analysis;
  }

  /**
   * Assess quality of keyword extraction
   * @param {Array} keywords - Extracted keywords
   * @param {string} title - Original title
   * @returns {Object} Quality assessment
   */
  assessExtractionQuality(keywords, title) {
    const titleWords = title.split(/\s+/).length;
    const keywordRatio = keywords.length / Math.max(titleWords, 1);
    
    let quality = 'good';
    if (keywordRatio < 0.3) quality = 'poor';
    else if (keywordRatio < 0.6) quality = 'fair';
    
    return {
      quality,
      score: Math.min(100, keywordRatio * 100),
      keywordRatio,
      recommendations: this.getQualityRecommendations(keywords, title)
    };
  }

  /**
   * Generate keyword suggestions
   * @param {Array} keywords - Current keywords
   * @param {string} title - Article title
   * @returns {Array} Keyword suggestions
   */
  generateKeywordSuggestions(keywords, title) {
    const suggestions = [];
    const titleWords = title.toLowerCase().split(/\s+/);
    
    // Suggest missing important words
    titleWords.forEach(word => {
      if (word.length >= 3 && 
          !keywords.includes(word) && 
          !this.isCommonWord(word)) {
        suggestions.push({
          word,
          reason: 'タイトルに含まれる重要な単語',
          priority: 'high'
        });
      }
    });
    
    // Suggest related terms
    if (keywords.length < this.maxKeywordsPerTitle) {
      const relatedTerms = this.getRelatedTerms(keywords);
      relatedTerms.forEach(term => {
        if (!keywords.includes(term) && suggestions.length < 3) {
          suggestions.push({
            word: term,
            reason: '関連キーワード',
            priority: 'medium'
          });
        }
      });
    }
    
    return suggestions;
  }

  /**
   * Get related terms for keywords
   * @param {Array} keywords - Base keywords
   * @returns {Array} Related terms
   */
  getRelatedTerms(keywords) {
    // Simple related terms (avoid complex semantic analysis)
    const relatedTerms = [];
    
    keywords.forEach(keyword => {
      // Add variations
      if (keyword.endsWith('ing')) {
        relatedTerms.push(keyword.slice(0, -3));
      }
      if (keyword.endsWith('s')) {
        relatedTerms.push(keyword.slice(0, -1));
      }
    });
    
    return relatedTerms.filter(term => this.isValidKeyword(term));
  }

  /**
   * Get quality improvement recommendations
   * @param {Array} keywords - Current keywords
   * @param {string} title - Article title
   * @returns {Array} Recommendations
   */
  getQualityRecommendations(keywords, title) {
    const recommendations = [];
    
    if (keywords.length === 0) {
      recommendations.push('タイトルからキーワードが抽出できませんでした。タイトルの内容を確認してください。');
    }
    
    if (keywords.length < 3) {
      recommendations.push('より多くのキーワードを抽出するため、タイトルを具体的にしてください。');
    }
    
    if (keywords.length > this.maxKeywordsPerTitle) {
      recommendations.push('キーワードが多すぎます。重要なものに絞り込んでください。');
    }
    
    return recommendations;
  }
}

// ========== UTILITY FUNCTIONS ==========
// Standalone utility functions for title analysis

/**
 * Create a new title analyzer instance
 * @returns {TitleAnalyzer} New title analyzer instance
 */
export function createTitleAnalyzer() {
  return new TitleAnalyzer();
}

/**
 * Extract keywords from title
 * @param {string} title - Article title
 * @param {string} language - Language for processing
 * @returns {Promise<Array>} Extracted keywords
 */
export async function extractTitleKeywords(title, language = 'id') {
  const analyzer = createTitleAnalyzer();
  return analyzer.extractKeywords(title, language);
}

/**
 * Analyze title for keywords
 * @param {string} title - Article title
 * @param {string} language - Language for processing
 * @returns {Promise<Object>} Title analysis result
 */
export async function analyzeTitle(title, language = 'id') {
  const analyzer = createTitleAnalyzer();
  return analyzer.analyzeTitle(title, language);
}
