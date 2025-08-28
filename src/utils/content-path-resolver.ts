// Content Path Resolver - Dynamic Collection Path Detection
// Google 2025 Engineering Team - Astro + Vue + Tailwind v4.1
// Purpose: Auto-detect and resolve content collection paths dynamically

import type { CollectionEntry } from "astro:content";

// ========== TYPE DEFINITIONS ==========
export interface ContentPathConfig {
  collectionName: string;
  basePath: string;
  displayName: string;
  icon: string;
  priority: number;
}

export interface PathResolutionResult {
  path: string;
  displayName: string;
  icon: string;
  collectionName: string;
  isFallback: boolean;
}

// ========== CONTENT PATH CONFIGURATION ==========
// Centralized configuration for all content collections
// Easy to modify for future collection additions or name changes
const CONTENT_PATH_CONFIG: ContentPathConfig[] = [
  {
    collectionName: "docs",
    basePath: "/docs",
    displayName: "Docs",
    icon: "📚",
    priority: 1,
  },
  {
    collectionName: "articles",
    basePath: "/articles",
    displayName: "Articles",
    icon: "📄",
    priority: 2,
  },
  {
    collectionName: "guides",
    basePath: "/guides",
    displayName: "Guides",
    icon: "📚",
    priority: 3,
  },
  {
    collectionName: "tutorials",
    basePath: "/tutorials",
    displayName: "Tutorials",
    icon: "🎓",
    priority: 4,
  },
  {
    collectionName: "posts",
    basePath: "/posts",
    displayName: "Posts",
    icon: "📮",
    priority: 5,
  },
  {
    collectionName: "tool-articles",
    basePath: "/tools",
    displayName: "Tools",
    icon: "🛠️",
    priority: 6,
    // Note: This collection uses nested routing: /tools/{tool-name}/{article-slug}
    // The basePath is /tools, but individual articles are at /tools/{tool}/{slug}
  },
];

// ========== PATH RESOLUTION UTILITIES ==========

/**
 * Resolve content path based on collection entry
 * Auto-detects the appropriate path for any content collection
 *
 * @param post - Collection entry (blog, articles, etc.)
 * @param collectionName - Optional explicit collection name override
 * @returns PathResolutionResult with resolved path and metadata
 */
export function resolveContentPath(
  post: CollectionEntry<any> & {
    slug: string;
    data?: any;
    collection?: string;
  },
  collectionName?: string,
): PathResolutionResult {
  try {
    // Determine collection name from post or parameter
    const detectedCollectionName =
      collectionName || detectCollectionFromEntry(post);

    // Find matching configuration
    const config = CONTENT_PATH_CONFIG.find(
      (c) => c.collectionName === detectedCollectionName,
    );

    if (config) {
      return {
        path: `${config.basePath}/${post.slug}`,
        displayName: config.displayName,
        icon: config.icon,
        collectionName: config.collectionName,
        isFallback: false,
      };
    }

    // Fallback: Use collection name as path
    const fallbackPath = `/${detectedCollectionName}/${post.slug}`;
    return {
      path: fallbackPath,
      displayName: formatDisplayName(detectedCollectionName),
      icon: "📄", // Default icon
      collectionName: detectedCollectionName,
      isFallback: true,
    };
  } catch (error) {
    console.warn("Content path resolution failed:", error);

    // Ultimate fallback
    return {
      path: `/docs/${post.slug}`, // Updated to docs
      displayName: "Docs",
      icon: "📚",
      collectionName: "docs",
      isFallback: true,
    };
  }
}

/**
 * Get collection base path without slug
 * Useful for breadcrumb navigation to collection index
 *
 * @param collectionName - Name of the collection
 * @returns Base path for the collection
 */
export function getCollectionBasePath(collectionName: string): string {
  try {
    const config = CONTENT_PATH_CONFIG.find(
      (c) => c.collectionName === collectionName,
    );

    return config?.basePath || `/${collectionName}`;
  } catch (error) {
    console.warn("Collection base path resolution failed:", error);
    return "/docs"; // Fallback to docs default
  }
}

/**
 * Get collection metadata for display purposes
 *
 * @param collectionName - Name of the collection
 * @returns Collection metadata for display
 */
export function getCollectionMetadata(collectionName: string): {
  displayName: string;
  icon: string;
  basePath: string;
} {
  try {
    const config = CONTENT_PATH_CONFIG.find(
      (c) => c.collectionName === collectionName,
    );

    if (config) {
      return {
        displayName: config.displayName,
        icon: config.icon,
        basePath: config.basePath,
      };
    }

    // Fallback metadata
    return {
      displayName: formatDisplayName(collectionName),
      icon: "📄",
      basePath: `/${collectionName}`,
    };
  } catch (error) {
    console.warn("Collection metadata resolution failed:", error);

    return {
      displayName: "Docs",
      icon: "📚",
      basePath: "/docs",
    };
  }
}

/**
 * Detect collection name from entry
 * Attempts to determine collection type from entry structure
 *
 * @param post - Collection entry
 * @returns Detected collection name
 */
function detectCollectionFromEntry(post: CollectionEntry<any>): string {
  try {
    // Add type assertion for better TypeScript inference
    const typedPost = post as CollectionEntry<any> & {
      collection?: string;
      data?: any;
    };

    // Check if entry has collection-specific properties
    if (typedPost.collection) {
      return typedPost.collection;
    }

    // Fallback: try to infer from entry structure
    // This can be enhanced based on your content schema
    if (typedPost.data?.category === "guide") {
      return "guides";
    }

    if (typedPost.data?.category === "tutorial") {
      return "tutorials";
    }

    // Default to docs for backward compatibility
    return "docs";
  } catch (error) {
    console.warn("Collection detection failed:", error);
    return "docs"; // Safe fallback
  }
}

/**
 * Format display name from collection name
 * Converts "my-collection" to "My Collection"
 *
 * @param collectionName - Raw collection name
 * @returns Formatted display name
 */
function formatDisplayName(collectionName: string): string {
  try {
    return collectionName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  } catch (error) {
    console.warn("Display name formatting failed:", error);
    return "Content";
  }
}

/**
 * Add new collection configuration
 * Utility function for future collection additions
 *
 * @param config - New collection configuration
 */
export function addCollectionConfig(config: ContentPathConfig): void {
  try {
    // Check if collection already exists
    const existingIndex = CONTENT_PATH_CONFIG.findIndex(
      (c) => c.collectionName === config.collectionName,
    );

    if (existingIndex >= 0) {
      // Update existing configuration
      CONTENT_PATH_CONFIG[existingIndex] = config;
    } else {
      // Add new configuration
      CONTENT_PATH_CONFIG.push(config);

      // Sort by priority
      CONTENT_PATH_CONFIG.sort((a, b) => a.priority - b.priority);
    }
  } catch (error) {
    console.error("Failed to add collection config:", error);
  }
}

/**
 * Get all available collection configurations
 * Useful for generating navigation menus
 *
 * @returns Array of all collection configurations
 */
export function getAllCollectionConfigs(): ContentPathConfig[] {
  return [...CONTENT_PATH_CONFIG].sort((a, b) => a.priority - b.priority);
}

/**
 * Validate collection configuration
 * Ensures all required fields are present
 *
 * @param config - Collection configuration to validate
 * @returns Validation result
 */
export function validateCollectionConfig(config: ContentPathConfig): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!config.collectionName) {
    errors.push("Collection name is required");
  }

  if (!config.basePath) {
    errors.push("Base path is required");
  }

  if (!config.displayName) {
    errors.push("Display name is required");
  }

  if (!config.icon) {
    errors.push("Icon is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ========== EXPORT UTILITIES ==========
export default {
  resolveContentPath,
  getCollectionBasePath,
  getCollectionMetadata,
  addCollectionConfig,
  getAllCollectionConfigs,
  validateCollectionConfig,
};
