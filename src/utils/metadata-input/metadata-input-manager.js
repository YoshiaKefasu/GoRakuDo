// ========== METADATA INPUT MANAGER ==========
// ES Modules compliant metadata input management system
// Integrates with existing performance monitoring and content management
// Follows DRY + KISS principles by leveraging existing infrastructure

import { createMetadataReader } from './metadata-reader.js';
import { createKeywordManager } from './keyword-manager.js';

/**
 * Metadata input manager for comprehensive metadata handling
 * Provides unified interface for metadata operations with performance optimization
 */
export class MetadataInputManager {
  constructor() {
    this.metadataReader = createMetadataReader();
    this.keywordManager = createKeywordManager();
    this.autoSaveTimer = null;
    this.performanceMetrics = {
      readTime: 0,
      validationTime: 0,
      saveTime: 0,
      totalOperations: 0
    };
    this.cache = new Map();
    this.autoSaveEnabled = true;
    this.autoSaveInterval = 5000; // 5 seconds
  }

  /**
   * Initialize metadata input system
   * @param {Object} config - Configuration options
   */
  initialize(config = {}) {
    try {
      // Load existing content and build keyword cache
      this.loadExistingContent();
      
      // Apply configuration
      this.autoSaveEnabled = config.autoSaveEnabled !== false;
      this.autoSaveInterval = config.autoSaveInterval || 5000;
      
      // Initialize performance monitoring
      this.initializePerformanceMonitoring();
      
      console.log('✅ Metadata input system initialized successfully');
      
    } catch (error) {
      console.error('❌ Error initializing metadata input system:', error);
      throw error;
    }
  }

  /**
   * Load existing content and build keyword cache
   */
  async loadExistingContent() {
    const startTime = performance.now();
    
    try {
      // This would integrate with existing content loading system
      // For now, we'll simulate loading existing content
      const existingContent = await this.getExistingContentFiles();
      
      if (existingContent.length > 0) {
        // Extract keywords from existing content
        const keywords = this.keywordManager.extractKeywordsFromContent(existingContent);
        console.log(`📚 Loaded ${keywords.length} keywords from existing content`);
      }
      
      this.updatePerformanceMetrics('readTime', performance.now() - startTime);
      
    } catch (error) {
      console.error('Error loading existing content:', error);
    }
  }

  /**
   * Get existing content files (placeholder for integration)
   * @returns {Promise<Array>} Array of content file objects
   */
  async getExistingContentFiles() {
    // This would integrate with existing content management system
    // For now, return empty array as placeholder
    return [];
  }

  /**
   * Initialize performance monitoring
   */
  initializePerformanceMonitoring() {
    // Log performance metrics periodically
    setInterval(() => {
      this.logPerformanceMetrics();
    }, 30000); // Every 30 seconds
  }

  /**
   * Update performance metrics
   * @param {string} metric - Metric name
   * @param {number} value - Metric value
   */
  updatePerformanceMetrics(metric, value) {
    this.performanceMetrics[metric] = value;
    this.performanceMetrics.totalOperations++;
  }

  /**
   * Log performance metrics
   */
  logPerformanceMetrics() {
    const { readTime, validationTime, saveTime, totalOperations } = this.performanceMetrics;
    
    console.log('📊 Metadata Input Performance Metrics:');
    console.log(`  📖 Read Time: ${readTime.toFixed(2)}ms`);
    console.log(`  ✅ Validation Time: ${validationTime.toFixed(2)}ms`);
    console.log(`  💾 Save Time: ${saveTime.toFixed(2)}ms`);
    console.log(`  🔄 Total Operations: ${totalOperations}`);
    
    // Reset metrics after logging
    this.performanceMetrics = {
      readTime: 0,
      validationTime: 0,
      saveTime: 0,
      totalOperations: 0
    };
  }

  /**
   * Read metadata from markdown file
   * @param {string} filePath - Path to markdown file
   * @param {string} content - File content
   * @returns {Object} MetadataReadResult with performance tracking
   */
  readMetadata(filePath, content) {
    const startTime = performance.now();
    
    try {
      const result = this.metadataReader.readMetadata(filePath, content);
      
      // Cache successful results
      if (result.success) {
        this.cache.set(filePath, {
          metadata: result.metadata,
          timestamp: Date.now(),
          contentHash: this.hashContent(content)
        });
      }
      
      this.updatePerformanceMetrics('readTime', performance.now() - startTime);
      return result;
      
    } catch (error) {
      console.error(`Error reading metadata from ${filePath}:`, error);
      this.updatePerformanceMetrics('readTime', performance.now() - startTime);
      return {
        success: false,
        error: error.message,
        filePath
      };
    }
  }

  /**
   * Simple content hashing for cache invalidation
   * @param {string} content - Content to hash
   * @returns {string} Content hash
   */
  hashContent(content) {
    let hash = 0;
    if (content.length === 0) return hash.toString();
    
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return hash.toString();
  }

  /**
   * Validate metadata with performance tracking
   * @param {Object} metadata - Metadata to validate
   * @returns {Object} Validation result
   */
  validateMetadata(metadata) {
    const startTime = performance.now();
    
    try {
      const result = this.metadataReader.validateMetadata(metadata);
      this.updatePerformanceMetrics('validationTime', performance.now() - startTime);
      return result;
      
    } catch (error) {
      console.error('Error validating metadata:', error);
      this.updatePerformanceMetrics('validationTime', performance.now() - startTime);
      return {
        isValid: false,
        errors: [{ field: 'unknown', message: error.message, code: 'VALIDATION_ERROR' }],
        warnings: []
      };
    }
  }

  /**
   * Save metadata with auto-save functionality
   * @param {string} filePath - File path
   * @param {Object} metadata - Metadata to save
   * @param {boolean} immediate - Whether to save immediately
   * @returns {Promise<Object>} Save result
   */
  async saveMetadata(filePath, metadata, immediate = false) {
    const startTime = performance.now();
    
    try {
      // Validate metadata before saving
      const validation = this.validateMetadata(metadata);
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Metadata validation failed',
          validation
        };
      }

      if (immediate) {
        // Save immediately
        const result = await this.performSave(filePath, metadata);
        this.updatePerformanceMetrics('saveTime', performance.now() - startTime);
        return result;
      } else {
        // Schedule auto-save
        this.scheduleAutoSave(filePath, metadata);
        return {
          success: true,
          message: 'Auto-save scheduled',
          scheduled: true
        };
      }
      
    } catch (error) {
      console.error(`Error saving metadata for ${filePath}:`, error);
      this.updatePerformanceMetrics('saveTime', performance.now() - startTime);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Schedule auto-save for metadata
   * @param {string} filePath - File path
   * @param {Object} metadata - Metadata to save
   */
  scheduleAutoSave(filePath, metadata) {
    // Clear existing timer
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer);
    }

    // Schedule new auto-save
    this.autoSaveTimer = setTimeout(async () => {
      try {
        await this.performSave(filePath, metadata);
        console.log(`💾 Auto-saved metadata for ${filePath}`);
      } catch (error) {
        console.error(`❌ Auto-save failed for ${filePath}:`, error);
      }
    }, this.autoSaveInterval);
  }

  /**
   * Perform actual save operation
   * @param {string} filePath - File path
   * @param {Object} metadata - Metadata to save
   * @returns {Promise<Object>} Save result
   */
  async performSave(filePath, metadata) {
    try {
      // This would integrate with existing content management system
      // For now, we'll simulate saving by updating cache
      this.cache.set(filePath, {
        metadata,
        timestamp: Date.now(),
        contentHash: this.hashContent(JSON.stringify(metadata))
      });

      // Update keyword cache if tags changed
      if (metadata.tags && metadata.tags.length > 0) {
        this.keywordManager.extractKeywordsFromContent([{
          path: filePath,
          content: JSON.stringify(metadata)
        }]);
      }

      return {
        success: true,
        message: 'Metadata saved successfully',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      throw new Error(`Save operation failed: ${error.message}`);
    }
  }

  /**
   * Get keyword suggestions with performance optimization
   * @param {string} input - User input
   * @param {number} limit - Maximum suggestions
   * @returns {Array} Keyword suggestions
   */
  getKeywordSuggestions(input, limit = 10) {
    try {
      return this.keywordManager.getKeywordSuggestions(input, limit);
    } catch (error) {
      console.error('Error getting keyword suggestions:', error);
      return [];
    }
  }

  /**
   * Check for duplicate keywords
   * @param {string} keyword - Keyword to check
   * @param {Array} existingKeywords - Existing keywords
   * @returns {Object} Duplicate check result
   */
  checkDuplicateKeyword(keyword, existingKeywords) {
    try {
      return this.keywordManager.checkDuplicateKeyword(keyword, existingKeywords);
    } catch (error) {
      console.error('Error checking duplicate keywords:', error);
      return {
        isDuplicate: false,
        type: 'error',
        existing: null,
        suggestion: null,
        error: error.message
      };
    }
  }

  /**
   * Get metadata from cache if available
   * @param {string} filePath - File path
   * @returns {Object|null} Cached metadata or null
   */
  getCachedMetadata(filePath) {
    const cached = this.cache.get(filePath);
    if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes
      return cached.metadata;
    }
    return null;
  }

  /**
   * Clear cache for specific file or all files
   * @param {string} filePath - Optional file path to clear
   */
  clearCache(filePath = null) {
    if (filePath) {
      this.cache.delete(filePath);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get system statistics
   * @returns {Object} System statistics
   */
  getSystemStats() {
    return {
      cacheSize: this.cache.size,
      keywordStats: this.keywordManager.getKeywordStats(),
      performanceMetrics: { ...this.performanceMetrics },
      autoSaveEnabled: this.autoSaveEnabled,
      autoSaveInterval: this.autoSaveInterval
    };
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
    
    this.clearCache();
    this.keywordManager.clearCache();
    
    console.log('🧹 Metadata input system cleaned up');
  }
}

// ========== UTILITY FUNCTIONS ==========
// Standalone utility functions for metadata input management

/**
 * Create a new metadata input manager instance
 * @returns {MetadataInputManager} New manager instance
 */
export function createMetadataInputManager() {
  return new MetadataInputManager();
}

/**
 * Initialize metadata input system
 * @param {Object} config - Configuration options
 * @returns {MetadataInputManager} Initialized manager instance
 */
export async function initializeMetadataInputSystem(config = {}) {
  const manager = createMetadataInputManager();
  await manager.initialize(config);
  return manager;
}

/**
 * Read metadata from file with performance tracking
 * @param {string} filePath - File path
 * @param {string} content - File content
 * @returns {Object} Metadata read result
 */
export function readFileMetadata(filePath, content) {
  const manager = createMetadataInputManager();
  return manager.readMetadata(filePath, content);
}

/**
 * Save metadata with auto-save
 * @param {string} filePath - File path
 * @param {Object} metadata - Metadata to save
 * @param {boolean} immediate - Whether to save immediately
 * @returns {Promise<Object>} Save result
 */
export async function saveMetadata(filePath, metadata, immediate = false) {
  const manager = createMetadataInputManager();
  return manager.saveMetadata(filePath, metadata, immediate);
}
