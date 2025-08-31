// ========== METADATA READER UTILITY ==========
// ES Modules compliant metadata reading utility for .md files
// Follows DRY + KISS principles by leveraging existing content patterns

/**
 * Metadata reader utility for extracting metadata from .md files
 * Reads frontmatter and converts to structured metadata format
 */
export class MetadataReader {
  constructor() {
    this.supportedExtensions = ['.md', '.mdx'];
    this.frontmatterDelimiter = '---';
  }

  /**
   * Read metadata from a markdown file
   * @param {string} filePath - Path to the markdown file
   * @param {string} content - File content as string
   * @returns {Object} MetadataReadResult with success status and metadata
   */
  readMetadata(filePath, content) {
    try {
      // Validate input parameters
      if (!filePath || !content) {
        return {
          success: false,
          error: 'Invalid file path or content',
          filePath: filePath || 'unknown'
        };
      }

      // Extract frontmatter from content
      const frontmatter = this.extractFrontmatter(content);
      
      if (!frontmatter) {
        return {
          success: false,
          error: 'No frontmatter found in file',
          filePath,
          frontmatter: {}
        };
      }

      // Parse and validate frontmatter
      const metadata = this.parseFrontmatter(frontmatter);
      
      return {
        success: true,
        metadata,
        filePath,
        frontmatter
      };

    } catch (error) {
      return {
        success: false,
        error: `Error reading metadata: ${error.message}`,
        filePath
      };
    }
  }

  /**
   * Extract frontmatter from markdown content
   * @param {string} content - Markdown file content
   * @returns {Object|null} Parsed frontmatter object or null if not found
   */
  extractFrontmatter(content) {
    try {
      const lines = content.split('\n');
      const startIndex = lines.findIndex(line => line.trim() === this.frontmatterDelimiter);
      
      if (startIndex === -1) {
        return null; // No frontmatter found
      }

      const endIndex = lines.findIndex((line, index) => 
        index > startIndex && line.trim() === this.frontmatterDelimiter
      );

      if (endIndex === -1) {
        return null; // Incomplete frontmatter
      }

      // Extract frontmatter content between delimiters
      const frontmatterLines = lines.slice(startIndex + 1, endIndex);
      const frontmatterText = frontmatterLines.join('\n');

      // Parse YAML-like frontmatter
      return this.parseYamlLike(frontmatterText);

    } catch (error) {
      console.error('Error extracting frontmatter:', error);
      return null;
    }
  }

  /**
   * Parse YAML-like frontmatter content
   * @param {string} frontmatterText - Frontmatter text content
   * @returns {Object} Parsed frontmatter object
   */
  parseYamlLike(frontmatterText) {
    const result = {};
    const lines = frontmatterText.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue;
      }

      // Parse key-value pairs
      const colonIndex = trimmedLine.indexOf(':');
      if (colonIndex > 0) {
        const key = trimmedLine.substring(0, colonIndex).trim();
        let value = trimmedLine.substring(colonIndex + 1).trim();

        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }

        // Parse array values
        if (value.startsWith('[') && value.endsWith(']')) {
          value = this.parseArrayValue(value);
        }

        // Parse boolean values
        if (value === 'true' || value === 'false') {
          value = value === 'true';
        }

        // Parse numeric values
        if (!isNaN(value) && value !== '') {
          value = Number(value);
        }

        result[key] = value;
      }
    }

    return result;
  }

  /**
   * Parse array values from frontmatter
   * @param {string} arrayText - Array text from frontmatter
   * @returns {Array} Parsed array
   */
  parseArrayValue(arrayText) {
    try {
      // Remove brackets and split by comma
      const content = arrayText.slice(1, -1);
      if (!content.trim()) {
        return [];
      }

      return content.split(',').map(item => {
        const trimmed = item.trim();
        // Remove quotes if present
        if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || 
            (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
          return trimmed.slice(1, -1);
        }
        return trimmed;
      }).filter(item => item.length > 0);

    } catch (error) {
      console.error('Error parsing array value:', error);
      return [];
    }
  }

  /**
   * Parse and validate frontmatter data
   * @param {Object} frontmatter - Raw frontmatter object
   * @returns {Object} Validated metadata object
   */
  parseFrontmatter(frontmatter) {
    // Apply default values and validation following existing schema patterns
    return {
      title: frontmatter.title || '',
      description: frontmatter.description || '',
      publishedDate: frontmatter.publishedDate || new Date().toISOString(),
      author: frontmatter.author || 'Tim GoRakuDo',
      emoji: frontmatter.emoji || undefined,
      difficulty: this.validateDifficulty(frontmatter.difficulty),
      category: frontmatter.category || 'general',
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      featured: Boolean(frontmatter.featured),
      contentType: this.validateContentType(frontmatter.contentType),
      readTime: typeof frontmatter.readTime === 'number' ? frontmatter.readTime : undefined
    };
  }

  /**
   * Validate difficulty level
   * @param {string} difficulty - Difficulty value from frontmatter
   * @returns {string} Validated difficulty level
   */
  validateDifficulty(difficulty) {
    const validDifficulties = ['beginner', 'intermediate', 'advanced'];
    return validDifficulties.includes(difficulty) ? difficulty : 'beginner';
  }

  /**
   * Validate content type
   * @param {string} contentType - Content type from frontmatter
   * @returns {string} Validated content type
   */
  validateContentType(contentType) {
    const validTypes = ['metodologi', 'tutorial', 'resource'];
    return validTypes.includes(contentType) ? contentType : 'tutorial';
  }

  /**
   * Extract keywords from metadata
   * @param {Object} metadata - Parsed metadata object
   * @returns {Array} Array of keyword objects with priority and usage data
   */
  extractKeywords(metadata) {
    if (!metadata.tags || !Array.isArray(metadata.tags)) {
      return [];
    }

    return metadata.tags.map(tag => ({
      value: tag,
      priority: 3, // Default priority
      relatedKeywords: [],
      usageCount: 1
    }));
  }

  /**
   * Validate metadata against schema requirements
   * @param {Object} metadata - Metadata object to validate
   * @returns {Object} Validation result with errors and warnings
   */
  validateMetadata(metadata) {
    const errors = [];
    const warnings = [];

    // Required field validation
    if (!metadata.title || metadata.title.trim().length === 0) {
      errors.push({
        field: 'title',
        message: 'Title is required',
        code: 'REQUIRED_FIELD'
      });
    }

    if (!metadata.description || metadata.description.trim().length === 0) {
      errors.push({
        field: 'description',
        message: 'Description is required',
        code: 'REQUIRED_FIELD'
      });
    }

    // Length validation
    if (metadata.title && metadata.title.length > 100) {
      errors.push({
        field: 'title',
        message: 'Title must be 100 characters or less',
        code: 'LENGTH_EXCEEDED'
      });
    }

    if (metadata.description && metadata.description.length > 300) {
      errors.push({
        field: 'description',
        message: 'Description must be 300 characters or less',
        code: 'LENGTH_EXCEEDED'
      });
    }

    // Tags validation
    if (metadata.tags && metadata.tags.length > 10) {
      warnings.push({
        field: 'tags',
        message: 'Too many tags (maximum 10 recommended)',
        code: 'TOO_MANY_TAGS'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get metadata statistics from multiple files
   * @param {Array} fileResults - Array of MetadataReadResult objects
   * @returns {Object} Statistics about metadata usage
   */
  getMetadataStats(fileResults) {
    const stats = {
      totalFiles: fileResults.length,
      successfulReads: 0,
      failedReads: 0,
      totalTags: 0,
      uniqueTags: new Set(),
      categories: new Set(),
      difficulties: { beginner: 0, intermediate: 0, advanced: 0 }
    };

    for (const result of fileResults) {
      if (result.success && result.metadata) {
        stats.successfulReads++;
        
        // Count tags
        if (result.metadata.tags) {
          stats.totalTags += result.metadata.tags.length;
          result.metadata.tags.forEach(tag => stats.uniqueTags.add(tag));
        }

        // Count categories and difficulties
        if (result.metadata.category) {
          stats.categories.add(result.metadata.category);
        }
        
        if (result.metadata.difficulty) {
          stats.difficulties[result.metadata.difficulty]++;
        }
      } else {
        stats.failedReads++;
      }
    }

    return {
      ...stats,
      uniqueTags: Array.from(stats.uniqueTags),
      categories: Array.from(stats.categories)
    };
  }
}

// ========== UTILITY FUNCTIONS ==========
// Standalone utility functions for metadata operations

/**
 * Create a new metadata reader instance
 * @returns {MetadataReader} New metadata reader instance
 */
export function createMetadataReader() {
  return new MetadataReader();
}

/**
 * Read metadata from a single file
 * @param {string} filePath - Path to the markdown file
 * @param {string} content - File content
 * @returns {Object} MetadataReadResult
 */
export function readFileMetadata(filePath, content) {
  const reader = createMetadataReader();
  return reader.readMetadata(filePath, content);
}

/**
 * Validate metadata object
 * @param {Object} metadata - Metadata object to validate
 * @returns {Object} Validation result
 */
export function validateMetadata(metadata) {
  const reader = createMetadataReader();
  return reader.validateMetadata(metadata);
}

/**
 * Extract keywords from metadata
 * @param {Object} metadata - Metadata object
 * @returns {Array} Array of keyword objects
 */
export function extractKeywords(metadata) {
  const reader = createMetadataReader();
  return reader.extractKeywords(metadata);
}
