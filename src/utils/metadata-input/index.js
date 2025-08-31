// ========== METADATA INPUT SYSTEM MAIN EXPORT ==========
// ES Modules compliant main export for metadata input system
// Provides unified interface for all metadata input functionality
// Follows DRY + KISS principles by centralizing exports

// Core metadata reading functionality
export { 
  MetadataReader, 
  createMetadataReader, 
  readFileMetadata, 
  validateMetadata, 
  extractKeywords 
} from './metadata-reader.js';

// Enhanced keyword management functionality
export { 
  KeywordManager, 
  createKeywordManager, 
  extractKeywordsFromContent, 
  getKeywordSuggestions, 
  checkDuplicateKeyword 
} from './keyword-manager.js';

// Comprehensive metadata input management
export { 
  MetadataInputManager, 
  createMetadataInputManager, 
  initializeMetadataInputSystem, 
  saveMetadata 
} from './metadata-input-manager.js';

// ========== SYSTEM INITIALIZATION ==========
// Convenience function for initializing the entire system

/**
 * Initialize the complete metadata input system
 * @param {Object} config - Configuration options
 * @returns {Promise<Object>} Initialized system with all components
 */
export async function initializeMetadataInputSystem(config = {}) {
  try {
    console.log('🚀 Initializing Metadata Input System...');
    
    // Import and initialize all components
    const { createMetadataInputManager } = await import('./metadata-input-manager.js');
    const { createKeywordManager } = await import('./keyword-manager.js');
    const { createMetadataReader } = await import('./metadata-reader.js');
    
    // Create component instances
    const metadataReader = createMetadataReader();
    const keywordManager = createKeywordManager();
    const inputManager = createMetadataInputManager();
    
    // Initialize the main manager
    await inputManager.initialize(config);
    
    console.log('✅ Metadata Input System initialized successfully');
    
    return {
      metadataReader,
      keywordManager,
      inputManager,
      
      // Convenience methods
      readMetadata: (filePath, content) => inputManager.readMetadata(filePath, content),
      saveMetadata: (filePath, metadata, immediate) => inputManager.saveMetadata(filePath, metadata, immediate),
      getKeywordSuggestions: (input, limit) => inputManager.getKeywordSuggestions(input, limit),
      validateMetadata: (metadata) => inputManager.validateMetadata(metadata),
      getSystemStats: () => inputManager.getSystemStats(),
      cleanup: () => inputManager.cleanup()
    };
    
  } catch (error) {
    console.error('❌ Failed to initialize Metadata Input System:', error);
    throw error;
  }
}

// ========== QUICK ACCESS FUNCTIONS ==========
// Standalone functions for common operations

/**
 * Quick metadata reading from file
 * @param {string} filePath - File path
 * @param {string} content - File content
 * @returns {Object} Metadata read result
 */
export async function quickReadMetadata(filePath, content) {
  const { createMetadataReader } = await import('./metadata-reader.js');
  const reader = createMetadataReader();
  return reader.readMetadata(filePath, content);
}

/**
 * Quick keyword suggestions
 * @param {string} input - User input
 * @param {number} limit - Maximum suggestions
 * @returns {Array} Keyword suggestions
 */
export async function quickKeywordSuggestions(input, limit = 10) {
  const { createKeywordManager } = await import('./keyword-manager.js');
  const manager = createKeywordManager();
  return manager.getKeywordSuggestions(input, limit);
}

/**
 * Quick metadata validation
 * @param {Object} metadata - Metadata to validate
 * @returns {Object} Validation result
 */
export async function quickValidateMetadata(metadata) {
  const { createMetadataReader } = await import('./metadata-reader.js');
  const reader = createMetadataReader();
  return reader.validateMetadata(metadata);
}

// ========== SYSTEM STATUS ==========
// Utility functions for system monitoring

/**
 * Get system status and health information
 * @returns {Object} System status information
 */
export async function getSystemStatus() {
  try {
    const { createMetadataInputManager } = await import('./metadata-input-manager.js');
    const manager = createMetadataInputManager();
    
    return {
      status: 'ready',
      components: {
        metadataReader: 'available',
        keywordManager: 'available',
        inputManager: 'available'
      },
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
    
  } catch (error) {
    return {
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  }
}

/**
 * Check if system is ready for use
 * @returns {boolean} System readiness status
 */
export async function isSystemReady() {
  try {
    const status = await getSystemStatus();
    return status.status === 'ready';
  } catch (error) {
    return false;
  }
}

// ========== DEFAULT EXPORT ==========
// Default export for convenience

export default {
  initializeMetadataInputSystem,
  quickReadMetadata,
  quickKeywordSuggestions,
  quickValidateMetadata,
  getSystemStatus,
  isSystemReady
};
