// ========== CONTENT EXTRACTOR UTILITY ==========
// ES Modules compliant content extraction utility for fallback system
// Follows KISS principle with simple rule-based extraction

/**
 * Content extractor for fallback metadata generation
 * Extracts title, description, and tags from markdown content
 */
export class ContentExtractor {
  constructor() {
    this.stopWordsCache = new Map();
    this.extractionRules = [
      // Title extraction rule (highest priority)
      {
        pattern: /^#\s+(.+)$/m,
        priority: 100,
        maxLength: 100,
        qualityThreshold: 80,
        field: 'title',
      },
      // Description extraction rule (first paragraph)
      {
        pattern: /^([^#\n]+)$/m,
        priority: 90,
        maxLength: 200,
        qualityThreshold: 70,
        field: 'description',
      },
      // Subheading extraction rule
      {
        pattern: /^##\s+(.+)$/m,
        priority: 80,
        maxLength: 150,
        qualityThreshold: 75,
        field: 'description',
      },
    ];
  }

  /**
   * Extract title from markdown content
   * @param {string} content - Markdown content
   * @returns {string} Extracted title
   */
  extractTitle(content) {
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      return this.cleanText(titleMatch[1], 100);
    }

    // Fallback: extract from filename or first line
    const firstLine = content.split('\n')[0].trim();
    return firstLine.length > 0
      ? this.cleanText(firstLine, 100)
      : 'Untitled Article';
  }

  /**
   * Extract description from markdown content
   * @param {string} content - Markdown content
   * @param {string} title - Article title
   * @returns {string} Extracted description
   */
  extractDescription(content, title) {
    // Remove title from content for description extraction
    const contentWithoutTitle = content.replace(/^#\s+.+$/m, '');

    // Extract from first valid paragraph
    const paragraphs = contentWithoutTitle
      .split('\n\n')
      .filter(p => p.trim().length > 0 && !p.startsWith('#'))
      .map(p => p.trim());

    if (paragraphs.length > 0) {
      const firstParagraph = paragraphs[0];
      return this.cleanText(firstParagraph, 200);
    }

    // Fallback: title-based description
    return `${title}に関する詳細情報です。`;
  }

  /**
   * Extract tags from markdown content
   * @param {string} content - Markdown content
   * @param {string} title - Article title
   * @param {string} category - Article category
   * @param {string} language - Language for stopwords
   * @returns {Promise<Array>} Extracted tags
   */
  async extractTags(content, title, category, language = 'id') {
    const tags = new Set();

    // Add category as tag
    if (category && category !== 'general') {
      tags.add(category);
    }

    // Extract keywords from title
    const titleKeywords = await this.extractKeywordsFromText(title, language);
    titleKeywords.forEach(keyword => tags.add(keyword));

    // Extract keywords from content
    const contentKeywords = await this.extractKeywordsFromText(
      content,
      language
    );
    contentKeywords.forEach(keyword => tags.add(keyword));

    // Limit tag count (KISS principle)
    return Array.from(tags).slice(0, 8);
  }

  /**
   * Extract keywords from text using simple rules
   * @param {string} text - Text to extract keywords from
   * @param {string} language - Language for stopwords
   * @returns {Promise<Array>} Extracted keywords
   */
  async extractKeywordsFromText(text, language = 'id') {
    // Simple keyword extraction (avoid complex NLP)
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && word.length < 20);

    // Filter stopwords asynchronously
    const filteredWords = [];
    for (const word of words) {
      if (!(await this.isStopWord(word, language))) {
        filteredWords.push(word);
      }
    }

    // Count word frequency and sort
    const wordCount = new Map();
    filteredWords.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });

    return Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }

  /**
   * Load stopwords for a specific language
   * @param {string} language - Language code
   * @returns {Promise<Set>} Set of stopwords
   */
  async loadStopWords(language) {
    try {
      const stopWordsPath = `src/data/stopwords/${language}.json`;
      const response = await fetch(stopWordsPath);
      if (!response.ok) {
        throw new Error(`Failed to load stopwords for ${language}`);
      }
      const stopWordsData = await response.json();
      return new Set(stopWordsData.words || []);
    } catch (error) {
      console.warn(`Using fallback stopwords for ${language}:`, error);
      return this.getFallbackStopWords(language);
    }
  }

  /**
   * Get fallback stopwords if loading fails
   * @param {string} language - Language code
   * @returns {Set} Fallback stopwords
   */
  getFallbackStopWords(language) {
    const fallbackStopWords = {
      id: [
        'yang',
        'dan',
        'atau',
        'dengan',
        'ke',
        'dari',
        'di',
        'untuk',
        'pada',
        'sebagai',
        'adalah',
        'akan',
        'sudah',
        'bisa',
        'harus',
        'boleh',
        'mungkin',
        'ini',
        'itu',
        'mereka',
      ],
      ja: [
        'の',
        'に',
        'は',
        'を',
        'が',
        'と',
        'で',
        'から',
        'まで',
        'より',
        'です',
        'ます',
        'である',
        'いる',
        'ある',
        'なる',
        'する',
        'この',
        'その',
        'あの',
      ],
    };
    return new Set(fallbackStopWords[language] || fallbackStopWords.id);
  }

  /**
   * Check if a word is a stopword
   * @param {string} word - Word to check
   * @param {string} language - Language code
   * @returns {Promise<boolean>} True if word is a stopword
   */
  async isStopWord(word, language = 'id') {
    if (!this.stopWordsCache.has(language)) {
      const stopWords = await this.loadStopWords(language);
      this.stopWordsCache.set(language, stopWords);
    }
    return this.stopWordsCache.get(language).has(word.toLowerCase());
  }

  /**
   * Clean and normalize extracted text
   * @param {string} text - Text to clean
   * @param {number} maxLength - Maximum length
   * @returns {string} Cleaned text
   */
  cleanText(text, maxLength) {
    let cleaned = text.trim();

    // Remove HTML tags
    cleaned = cleaned.replace(/<[^>]*>/g, '');

    // Normalize special characters
    cleaned = cleaned.replace(/[^\w\s\-.,!?]/g, ' ');

    // Limit length
    if (cleaned.length > maxLength) {
      cleaned = cleaned.substring(0, maxLength - 3) + '...';
    }

    return cleaned;
  }

  /**
   * Extract content using configured rules
   * @param {string} content - Markdown content
   * @param {string} field - Field to extract
   * @returns {Object|null} Extraction result or null
   */
  extractContentByRule(content, field) {
    const rule = this.extractionRules.find(r => r.field === field);
    if (!rule) return null;

    const match = content.match(rule.pattern);
    if (!match) return null;

    const extractedContent = this.cleanText(match[1], rule.maxLength);
    return {
      content: extractedContent,
      rule,
      quality: this.assessQuality(extractedContent, rule.qualityThreshold),
    };
  }

  /**
   * Assess quality of extracted content
   * @param {string} content - Extracted content
   * @param {number} threshold - Quality threshold
   * @returns {boolean} True if quality meets threshold
   */
  assessQuality(content, threshold) {
    const length = content.length;
    const readability = this.calculateReadability(content);

    // Simple quality calculation (KISS principle)
    const quality = (length / 100) * 0.4 + (readability / 100) * 0.6;
    return quality >= threshold / 100;
  }

  /**
   * Calculate readability score
   * @param {string} text - Text to analyze
   * @returns {number} Readability score (0-100)
   */
  calculateReadability(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.trim().length > 0);

    if (sentences.length === 0 || words.length === 0) {
      return 0;
    }

    const avgWordsPerSentence = words.length / sentences.length;

    // Optimal sentence length (10-25 words)
    if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 25) {
      return 100;
    }

    if (avgWordsPerSentence >= 5 && avgWordsPerSentence <= 35) {
      return 80;
    }

    if (avgWordsPerSentence >= 3 && avgWordsPerSentence <= 50) {
      return 60;
    }

    return 40;
  }
}

// ========== UTILITY FUNCTIONS ==========
// Standalone utility functions for content extraction

/**
 * Create a new content extractor instance
 * @returns {ContentExtractor} New content extractor instance
 */
export function createContentExtractor() {
  return new ContentExtractor();
}

/**
 * Extract title from markdown content
 * @param {string} content - Markdown content
 * @returns {string} Extracted title
 */
export function extractTitle(content) {
  const extractor = createContentExtractor();
  return extractor.extractTitle(content);
}

/**
 * Extract description from markdown content
 * @param {string} content - Markdown content
 * @param {string} title - Article title
 * @returns {string} Extracted description
 */
export function extractDescription(content, title) {
  const extractor = createContentExtractor();
  return extractor.extractDescription(content, title);
}

/**
 * Extract tags from markdown content
 * @param {string} content - Markdown content
 * @param {string} title - Article title
 * @param {string} category - Article category
 * @param {string} language - Language for stopwords
 * @returns {Promise<Array>} Extracted tags
 */
export async function extractTags(content, title, category, language = 'id') {
  const extractor = createContentExtractor();
  return extractor.extractTags(content, title, category, language);
}
