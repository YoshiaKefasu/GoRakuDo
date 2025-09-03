// ========== CONFIG MANAGER UTILITY ==========
// ES Modules compliant configuration management utility for fallback system
// Follows DRY principle by leveraging existing configuration patterns

/**
 * Configuration manager for fallback system
 * Manages user preferences and system configuration
 */
export class ConfigManager {
  constructor() {
    this.storageKey = 'fallback-system-config';
    this.defaultConfig = {
      enableAutoExtraction: true,
      enableKeywordSuggestions: true,
      qualityThresholds: {
        minLength: 50,
        maxLength: 200,
        minOverall: 70,
      },
      extractionRules: [
        {
          pattern: 'title',
          priority: 100,
          maxLength: 100,
          qualityThreshold: 80,
          field: 'title',
        },
        {
          pattern: 'content',
          priority: 90,
          maxLength: 200,
          qualityThreshold: 70,
          field: 'description',
        },
        {
          pattern: 'keywords',
          priority: 80,
          maxLength: 150,
          qualityThreshold: 75,
          field: 'tags',
        },
      ],
      priorityConfig: {
        manual: 100,
        auto: 80,
        fallback: 60,
        default: 40,
      },
      language: 'id',
      autoSave: true,
      autoSaveInterval: 30000, // 30 seconds
      showQualityScores: true,
      enableNotifications: true,
    };

    this.config = this.loadConfig();
  }

  /**
   * Load configuration from localStorage
   * @returns {Object} Configuration object
   */
  loadConfig() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.mergeConfig(this.defaultConfig, parsed);
      }
    } catch (error) {
      console.warn('Failed to load configuration:', error);
    }

    return { ...this.defaultConfig };
  }

  /**
   * Save configuration to localStorage
   * @param {Object} config - Configuration to save
   */
  saveConfig(config) {
    try {
      const mergedConfig = this.mergeConfig(this.config, config);
      this.config = mergedConfig;
      localStorage.setItem(this.storageKey, JSON.stringify(mergedConfig));
      this.notifyConfigChange(mergedConfig);
    } catch (error) {
      console.error('Failed to save configuration:', error);
    }
  }

  /**
   * Merge configuration objects
   * @param {Object} base - Base configuration
   * @param {Object} override - Override configuration
   * @returns {Object} Merged configuration
   */
  mergeConfig(base, override) {
    const merged = { ...base };

    Object.keys(override).forEach(key => {
      if (override[key] !== undefined) {
        if (
          typeof override[key] === 'object' &&
          !Array.isArray(override[key])
        ) {
          merged[key] = this.mergeConfig(merged[key] || {}, override[key]);
        } else {
          merged[key] = override[key];
        }
      }
    });

    return merged;
  }

  /**
   * Get configuration value
   * @param {string} key - Configuration key (dot notation supported)
   * @returns {*} Configuration value
   */
  get(key) {
    const keys = key.split('.');
    let value = this.config;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return undefined;
      }
    }

    return value;
  }

  /**
   * Set configuration value
   * @param {string} key - Configuration key (dot notation supported)
   * @param {*} value - Configuration value
   */
  set(key, value) {
    const keys = key.split('.');
    const lastKey = keys.pop();
    let target = this.config;

    // Navigate to the target object
    for (const k of keys) {
      if (!target[k] || typeof target[k] !== 'object') {
        target[k] = {};
      }
      target = target[k];
    }

    // Set the value
    target[lastKey] = value;

    // Save the updated configuration
    this.saveConfig(this.config);
  }

  /**
   * Reset configuration to defaults
   */
  resetToDefaults() {
    this.config = { ...this.defaultConfig };
    this.saveConfig(this.config);
  }

  /**
   * Export configuration
   * @returns {Object} Configuration export object
   */
  exportConfig() {
    return {
      config: { ...this.config },
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      description: 'Fallback System Configuration Export',
    };
  }

  /**
   * Import configuration
   * @param {Object} importData - Configuration import data
   * @returns {boolean} Success status
   */
  importConfig(importData) {
    try {
      if (!importData.config) {
        throw new Error('Invalid configuration format');
      }

      // Validate imported configuration
      const validation = this.validateConfig(importData.config);
      if (!validation.isValid) {
        throw new Error(
          `Configuration validation failed: ${validation.errors.join(', ')}`
        );
      }

      this.config = this.mergeConfig(this.defaultConfig, importData.config);
      this.saveConfig(this.config);

      return true;
    } catch (error) {
      console.error('Failed to import configuration:', error);
      return false;
    }
  }

  /**
   * Validate configuration
   * @param {Object} config - Configuration to validate
   * @returns {Object} Validation result
   */
  validateConfig(config) {
    const errors = [];
    const warnings = [];

    // Check required fields
    if (typeof config.enableAutoExtraction !== 'boolean') {
      errors.push('enableAutoExtraction must be a boolean');
    }

    if (typeof config.enableKeywordSuggestions !== 'boolean') {
      errors.push('enableKeywordSuggestions must be a boolean');
    }

    // Validate quality thresholds
    if (config.qualityThresholds) {
      const { minLength, maxLength, minOverall } = config.qualityThresholds;

      if (typeof minLength !== 'number' || minLength < 0) {
        errors.push('minLength must be a positive number');
      }

      if (typeof maxLength !== 'number' || maxLength < minLength) {
        errors.push('maxLength must be greater than minLength');
      }

      if (
        typeof minOverall !== 'number' ||
        minOverall < 0 ||
        minOverall > 100
      ) {
        errors.push('minOverall must be between 0 and 100');
      }
    }

    // Validate priority configuration
    if (config.priorityConfig) {
      const priorities = Object.values(config.priorityConfig);
      const uniquePriorities = new Set(priorities);

      if (uniquePriorities.size !== priorities.length) {
        errors.push('Priority levels must be unique');
      }

      priorities.forEach(priority => {
        if (typeof priority !== 'number' || priority < 0 || priority > 100) {
          errors.push('Priority values must be between 0 and 100');
        }
      });
    }

    // Validate language
    if (config.language && !['id', 'ja', 'en'].includes(config.language)) {
      errors.push('Language must be one of: id, ja, en');
    }

    // Check for deprecated settings
    if (config.legacySettings) {
      warnings.push(
        'Legacy settings detected - consider updating to new format'
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Get configuration schema
   * @returns {Object} Configuration schema
   */
  getConfigSchema() {
    return {
      enableAutoExtraction: {
        type: 'boolean',
        description: 'Enable automatic content extraction',
        default: true,
      },
      enableKeywordSuggestions: {
        type: 'boolean',
        description: 'Enable keyword suggestions',
        default: true,
      },
      qualityThresholds: {
        type: 'object',
        description: 'Quality assessment thresholds',
        properties: {
          minLength: {
            type: 'number',
            description: 'Minimum text length',
            default: 50,
          },
          maxLength: {
            type: 'number',
            description: 'Maximum text length',
            default: 200,
          },
          minOverall: {
            type: 'number',
            description: 'Minimum overall quality score',
            default: 70,
          },
        },
      },
      language: {
        type: 'string',
        description: 'Default language for processing',
        enum: ['id', 'ja', 'en'],
        default: 'id',
      },
      autoSave: {
        type: 'boolean',
        description: 'Enable automatic saving',
        default: true,
      },
      autoSaveInterval: {
        type: 'number',
        description: 'Auto-save interval in milliseconds',
        default: 30000,
      },
    };
  }

  /**
   * Get configuration summary
   * @returns {Object} Configuration summary
   */
  getConfigSummary() {
    return {
      totalSettings: Object.keys(this.config).length,
      enabledFeatures: {
        autoExtraction: this.config.enableAutoExtraction,
        keywordSuggestions: this.config.enableKeywordSuggestions,
        autoSave: this.config.autoSave,
        qualityScores: this.config.showQualityScores,
        notifications: this.config.enableNotifications,
      },
      qualityThresholds: this.config.qualityThresholds,
      language: this.config.language,
      lastModified: this.getLastModified(),
      isValid: this.validateConfig(this.config).isValid,
    };
  }

  /**
   * Get last modification time
   * @returns {string} Last modification timestamp
   */
  getLastModified() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed._lastModified || 'Unknown';
      }
    } catch (error) {
      console.warn('Failed to get last modified time:', error);
    }

    return 'Unknown';
  }

  /**
   * Update last modification time
   */
  updateLastModified() {
    this.config._lastModified = new Date().toISOString();
    this.saveConfig(this.config);
  }

  /**
   * Notify configuration change
   * @param {Object} config - Updated configuration
   */
  notifyConfigChange(config) {
    if (config.enableNotifications) {
      // Dispatch custom event for configuration changes
      const event = new CustomEvent('fallbackConfigChanged', {
        detail: { config },
      });
      window.dispatchEvent(event);
    }
  }

  /**
   * Subscribe to configuration changes
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  subscribeToChanges(callback) {
    const handler = event => callback(event.detail.config);
    window.addEventListener('fallbackConfigChanged', handler);

    return () => {
      window.removeEventListener('fallbackConfigChanged', handler);
    };
  }
}

// ========== UTILITY FUNCTIONS ==========
// Standalone utility functions for configuration management

/**
 * Create a new configuration manager instance
 * @returns {ConfigManager} New configuration manager instance
 */
export function createConfigManager() {
  return new ConfigManager();
}

/**
 * Get configuration value
 * @param {string} key - Configuration key
 * @returns {*} Configuration value
 */
export function getConfig(key) {
  const manager = createConfigManager();
  return manager.get(key);
}

/**
 * Set configuration value
 * @param {string} key - Configuration key
 * @param {*} value - Configuration value
 */
export function setConfig(key, value) {
  const manager = createConfigManager();
  manager.set(key, value);
}

/**
 * Reset configuration to defaults
 */
export function resetConfig() {
  const manager = createConfigManager();
  manager.resetToDefaults();
}

/**
 * Export configuration
 * @returns {Object} Configuration export
 */
export function exportConfig() {
  const manager = createConfigManager();
  return manager.exportConfig();
}

/**
 * Import configuration
 * @param {Object} importData - Configuration import data
 * @returns {boolean} Success status
 */
export function importConfig(importData) {
  const manager = createConfigManager();
  return manager.importConfig(importData);
}
