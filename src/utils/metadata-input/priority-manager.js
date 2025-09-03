// ========== PRIORITY MANAGER UTILITY ==========
// ES Modules compliant priority management utility for fallback system
// Follows KISS principle with simple priority rules

/**
 * Priority manager for fallback metadata sources
 * Manages priority levels between manual, auto, and fallback sources
 */
export class PriorityManager {
  constructor() {
    this.priorityLevels = {
      manual: 100, // Highest priority
      auto: 80, // Medium-high priority
      fallback: 60, // Medium priority
      default: 40, // Lowest priority
    };

    this.fieldPriorities = {
      title: 'critical',
      description: 'high',
      tags: 'medium',
      category: 'medium',
      difficulty: 'low',
      author: 'low',
      publishedDate: 'low',
    };
  }

  /**
   * Get priority level for a source
   * @param {string} source - Source type
   * @returns {number} Priority level
   */
  getSourcePriority(source) {
    return this.priorityLevels[source] || this.priorityLevels.default;
  }

  /**
   * Get field priority level
   * @param {string} field - Field name
   * @returns {string} Priority level
   */
  getFieldPriority(field) {
    return this.fieldPriorities[field] || 'low';
  }

  /**
   * Compare two sources by priority
   * @param {string} source1 - First source
   * @param {string} source2 - Second source
   * @returns {number} Comparison result (-1, 0, 1)
   */
  compareSources(source1, source2) {
    const priority1 = this.getSourcePriority(source1);
    const priority2 = this.getSourcePriority(source2);

    if (priority1 > priority2) return -1;
    if (priority1 < priority2) return 1;
    return 0;
  }

  /**
   * Determine which source should be used
   * @param {Array} sources - Array of source objects with priority
   * @returns {Object} Highest priority source
   */
  selectHighestPrioritySource(sources) {
    if (!sources || sources.length === 0) {
      return null;
    }

    return sources.reduce((highest, current) => {
      const currentPriority = this.getSourcePriority(current.source);
      const highestPriority = this.getSourcePriority(highest.source);

      return currentPriority > highestPriority ? current : highest;
    });
  }

  /**
   * Merge metadata from multiple sources based on priority
   * @param {Array} sourceMetadata - Array of metadata objects with source info
   * @returns {Object} Merged metadata with highest priority values
   */
  mergeMetadataByPriority(sourceMetadata) {
    if (!sourceMetadata || sourceMetadata.length === 0) {
      return {};
    }

    const merged = {};
    const fieldSources = {};

    // Group metadata by field
    sourceMetadata.forEach(metadata => {
      Object.keys(metadata).forEach(field => {
        if (field === 'source' || field === 'confidence') return;

        if (!fieldSources[field]) {
          fieldSources[field] = [];
        }

        fieldSources[field].push({
          value: metadata[field],
          source: metadata.source,
          priority: this.getSourcePriority(metadata.source),
        });
      });
    });

    // Select highest priority value for each field
    Object.keys(fieldSources).forEach(field => {
      const sources = fieldSources[field];
      const highestPriority = sources.reduce((highest, current) => {
        return current.priority > highest.priority ? current : highest;
      });

      merged[field] = highestPriority.value;
    });

    return merged;
  }

  /**
   * Calculate overall confidence based on source priorities
   * @param {Array} sources - Array of source objects
   * @returns {number} Overall confidence (0-1)
   */
  calculateOverallConfidence(sources) {
    if (!sources || sources.length === 0) {
      return 0;
    }

    const totalWeight = sources.reduce((sum, source) => {
      return sum + this.getSourcePriority(source.source);
    }, 0);

    const weightedConfidence = sources.reduce((sum, source) => {
      return sum + source.confidence * this.getSourcePriority(source.source);
    }, 0);

    return Math.min(1, weightedConfidence / totalWeight);
  }

  /**
   * Get priority recommendations for metadata fields
   * @param {Object} metadata - Current metadata
   * @param {Array} gaps - Metadata gaps
   * @returns {Array} Priority recommendations
   */
  getPriorityRecommendations(metadata, gaps) {
    const recommendations = [];

    gaps.forEach(gap => {
      const fieldPriority = this.getFieldPriority(gap.field);
      const sourcePriority = this.getSourcePriority(
        gap.fallbackSource || 'fallback'
      );

      if (
        fieldPriority === 'critical' &&
        sourcePriority < this.priorityLevels.auto
      ) {
        recommendations.push({
          field: gap.field,
          priority: 'critical',
          message: `${gap.field}フィールドは重要度が高いため、手動入力または自動抽出を推奨します`,
          suggestedAction: 'manual_or_auto',
        });
      } else if (
        fieldPriority === 'high' &&
        sourcePriority < this.priorityLevels.fallback
      ) {
        recommendations.push({
          field: gap.field,
          priority: 'high',
          message: `${gap.field}フィールドは中程度の重要度のため、自動抽出を推奨します`,
          suggestedAction: 'auto_extraction',
        });
      } else {
        recommendations.push({
          field: gap.field,
          priority: fieldPriority,
          message: `${gap.field}フィールドは現在の優先度で適切です`,
          suggestedAction: 'current_priority_ok',
        });
      }
    });

    return recommendations;
  }

  /**
   * Adjust priority levels based on user preferences
   * @param {Object} preferences - User priority preferences
   */
  adjustPriorityLevels(preferences) {
    if (preferences.manualPriority !== undefined) {
      this.priorityLevels.manual = Math.max(
        0,
        Math.min(100, preferences.manualPriority)
      );
    }

    if (preferences.autoPriority !== undefined) {
      this.priorityLevels.auto = Math.max(
        0,
        Math.min(100, preferences.autoPriority)
      );
    }

    if (preferences.fallbackPriority !== undefined) {
      this.priorityLevels.fallback = Math.max(
        0,
        Math.min(100, preferences.fallbackPriority)
      );
    }

    if (preferences.defaultPriority !== undefined) {
      this.priorityLevels.default = Math.max(
        0,
        Math.min(100, preferences.defaultPriority)
      );
    }
  }

  /**
   * Get current priority configuration
   * @returns {Object} Current priority configuration
   */
  getPriorityConfiguration() {
    return {
      levels: { ...this.priorityLevels },
      fieldPriorities: { ...this.fieldPriorities },
    };
  }

  /**
   * Validate priority configuration
   * @returns {Object} Validation result
   */
  validatePriorityConfiguration() {
    const errors = [];
    const warnings = [];

    // Check for duplicate priority levels
    const uniquePriorities = new Set(Object.values(this.priorityLevels));
    if (uniquePriorities.size !== Object.keys(this.priorityLevels).length) {
      errors.push('重複した優先度レベルが設定されています');
    }

    // Check for extreme priority values
    Object.entries(this.priorityLevels).forEach(([source, priority]) => {
      if (priority < 0 || priority > 100) {
        errors.push(`${source}の優先度が無効な値です: ${priority}`);
      }

      if (priority === 0) {
        warnings.push(`${source}の優先度が0に設定されています`);
      }
    });

    // Validate field priorities
    const validFieldPriorities = ['critical', 'high', 'medium', 'low'];
    Object.entries(this.fieldPriorities).forEach(([field, priority]) => {
      if (!validFieldPriorities.includes(priority)) {
        errors.push(`${field}のフィールド優先度が無効です: ${priority}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Reset priority levels to defaults
   */
  resetToDefaults() {
    this.priorityLevels = {
      manual: 100,
      auto: 80,
      fallback: 60,
      default: 40,
    };
  }
}

// ========== UTILITY FUNCTIONS ==========
// Standalone utility functions for priority management

/**
 * Create a new priority manager instance
 * @returns {PriorityManager} New priority manager instance
 */
export function createPriorityManager() {
  return new PriorityManager();
}

/**
 * Compare two sources by priority
 * @param {string} source1 - First source
 * @param {string} source2 - Second source
 * @returns {number} Comparison result
 */
export function compareSourcePriorities(source1, source2) {
  const manager = createPriorityManager();
  return manager.compareSources(source1, source2);
}

/**
 * Select highest priority source from array
 * @param {Array} sources - Array of source objects
 * @returns {Object} Highest priority source
 */
export function selectHighestPrioritySource(sources) {
  const manager = createPriorityManager();
  return manager.selectHighestPrioritySource(sources);
}

/**
 * Merge metadata by priority
 * @param {Array} sourceMetadata - Array of metadata objects
 * @returns {Object} Merged metadata
 */
export function mergeMetadataByPriority(sourceMetadata) {
  const manager = createPriorityManager();
  return manager.mergeMetadataByPriority(sourceMetadata);
}
