/**
 * Mind Map System - Simplified Text-Editor Based Configuration
 *
 * This system provides a simple, text-editor-friendly way to manage mind maps.
 * No complex UI needed - just edit the configuration file!
 */

// Import the main configuration and utilities
import {
  MIND_MAP_CONFIG,
  MindMapUtils,
  type MindMapBranch,
  type MindMapConfig,
  type MindMapConnection,
} from "./mind-map-config";

// Export the main configuration and utilities
export {
  MIND_MAP_CONFIG,
  MindMapUtils,
  type MindMapBranch,
  type MindMapConfig,
  type MindMapConnection,
};

// Re-export for backward compatibility
export default {
  config: MIND_MAP_CONFIG,
  utils: MindMapUtils,
};
