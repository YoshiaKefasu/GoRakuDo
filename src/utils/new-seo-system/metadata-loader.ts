// ========== NEW SEO METADATA LOADER ==========
import * as fs from 'fs/promises';
import * as path from 'path';

export interface MetadataContent {
  metaDescription?: string;
  keywords?: string;
  recommendations?: string;
}

export interface LoadedMetadata {
  exists: boolean;
  data: MetadataContent | null;
  filePath: string;
}

/**
 * Load metadata for a specific content file
 * @param contentFilePath - Path to the markdown content file
 * @returns Metadata content if available
 */
export async function loadMetadata(
  contentFilePath: string
): Promise<LoadedMetadata> {
  try {
    const contentDir = path.dirname(contentFilePath);
    const fileName = path.basename(contentFilePath, '.md');
    const metadataPath = path.join(contentDir, `${fileName}-metadata.json`);

    // Check if metadata file exists
    try {
      await fs.access(metadataPath);
    } catch {
      return {
        exists: false,
        data: null,
        filePath: metadataPath,
      };
    }

    // Load and parse metadata
    const metadataContent = await fs.readFile(metadataPath, 'utf-8');
    const metadata: MetadataContent = JSON.parse(metadataContent);

    return {
      exists: true,
      data: metadata,
      filePath: metadataPath,
    };
  } catch (error) {
    console.warn(`Failed to load metadata for ${contentFilePath}:`, error);
    return {
      exists: false,
      data: null,
      filePath: '',
    };
  }
}

/**
 * Get SEO data from metadata
 * @param metadata - Loaded metadata object
 * @param fallbackDescription - Fallback description if metadata doesn't have one
 * @returns SEO data object
 */
export function getSEOFromMetadata(
  metadata: LoadedMetadata,
  fallbackDescription: string
): {
  description: string;
  keywords: string[];
  hasMetadata: boolean;
} {
  if (!metadata.exists || !metadata.data) {
    return {
      description: fallbackDescription,
      keywords: [],
      hasMetadata: false,
    };
  }

  const { metaDescription, keywords } = metadata.data;

  // Use metadata description if available, otherwise fallback
  const description = metaDescription || fallbackDescription;

  // Parse keywords from metadata
  let keywordArray: string[] = [];
  if (keywords) {
    // Handle both comma-separated and array formats
    if (typeof keywords === 'string') {
      keywordArray = keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);
    } else if (Array.isArray(keywords)) {
      keywordArray = keywords;
    }
  }

  return {
    description,
    keywords: keywordArray,
    hasMetadata: true,
  };
}

/**
 * Get content recommendations from metadata
 * @param metadata - Loaded metadata object
 * @returns Array of recommended content titles
 */
export function getRecommendationsFromMetadata(
  metadata: LoadedMetadata
): string[] {
  if (!metadata.exists || !metadata.data?.recommendations) {
    return [];
  }

  const { recommendations } = metadata.data;

  if (typeof recommendations === 'string') {
    // Parse comma-separated recommendations
    return recommendations
      .split(',')
      .map(rec => rec.trim())
      .filter(rec => rec.length > 0);
  } else if (Array.isArray(recommendations)) {
    return recommendations;
  }

  return [];
}

/**
 * Load metadata for multiple content files
 * @param contentFilePaths - Array of content file paths
 * @returns Map of file paths to metadata
 */
export async function loadMultipleMetadata(
  contentFilePaths: string[]
): Promise<Map<string, LoadedMetadata>> {
  const metadataMap = new Map<string, LoadedMetadata>();

  for (const filePath of contentFilePaths) {
    const metadata = await loadMetadata(filePath);
    metadataMap.set(filePath, metadata);
  }

  return metadataMap;
}
