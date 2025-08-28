/**
 * Enhanced Content Analysis Utility with Simplified Mind Map System
 *
 * This utility provides build-time content analysis for:
 * - Keyword extraction and concept detection
 * - Mind map branch classification (A-E) with simplified configuration
 * - Semantic similarity detection
 * - Content segmentation for optimal link placement
 * - Text-editor based mind map customization
 *
 * All processing is done at build-time with no API costs.
 * SIMPLIFIED VERSION: Text-editor based configuration system
 */

import type { CollectionEntry } from "astro:content";
import {
  MIND_MAP_CONFIG,
} from "../../components/mind-map/mind-map-config";

// Use the simplified mind map configuration
export const MIND_MAP_BRANCHES = MIND_MAP_CONFIG.branches;

// Enhanced content analysis interface with simplified mind map system
export interface ContentAnalysisResult {
  mindMapBranch: string;
  mindMapBranchData: import("../../components/mind-map/mind-map-config").MindMapBranch;
  keywords: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  contentType: "guide" | "tutorial" | "theory" | "practice" | "tool" | "review";
}

// Export the interface as ContentAnalysis for backward compatibility
export type ContentAnalysis = ContentAnalysisResult;

// Enhanced internal link suggestion with mind map context
export interface InternalLinkSuggestion {
  targetSlug: string;
  targetTitle: string;
  reason: string;
  relevance: number;
  position: number;
  // Mind map context for better user understanding
  mindMapContext?: {
    sourceBranch: string;
    targetBranch: string;
    relationshipType:
      | "same-branch"
      | "related-branch"
      | "progression"
      | "complementary";
    visualConnection?: {
      color: string;
      style: "solid" | "dashed" | "dotted";
      thickness: "thin" | "medium" | "thick";
    };
  };
}

// Export the interface as LinkSuggestion for backward compatibility
export type LinkSuggestion = InternalLinkSuggestion;

// NOTE: Old internal linking interfaces have been removed in favor of word-to-link conversion

// Mind map customization interface for user modifications
export interface MindMapCustomization {
  branchId: string;
  customizations: {
    name?: string;
    color?: string;
    icon?: string;
    keywords?: string[];
    description?: string;
  };
  metadata: {
    customizedBy: string;
    customizedAt: Date;
    version: string;
  };
}

// User-friendly mind map configuration interface
export interface MindMapConfig {
  // Visual settings
  visual: {
    layout: "radial" | "hierarchical" | "organic" | "flow";
    theme: "dark" | "light" | "auto";
    animation: "smooth" | "bounce" | "fade" | "none";
    connectionStyle: "curved" | "straight" | "stepped";
  };
  // Interaction settings
  interaction: {
    allowDragging: boolean;
    allowZooming: boolean;
    allowPanning: boolean;
    allowEditing: boolean;
    allowCustomization: boolean;
  };
  // Content settings
  content: {
    showKeywords: boolean;
    showDescriptions: boolean;
    showIcons: boolean;
    showConnections: boolean;
    maxKeywordsPerBranch: number;
  };
}

// Default mind map configuration - now using simplified system
export const DEFAULT_MIND_MAP_CONFIG = MIND_MAP_CONFIG;

/**
 * Enhanced content analysis with mind map customization support
 */
export function analyzeContent(
  post: CollectionEntry<"docs">,
): ContentAnalysisResult {
  // Content analysis started for post: "${post.data.title}"

  // Add safety checks for post data
  if (!post || !post.data) {
    // Post data missing, using default analysis
    return {
      mindMapBranch: "A",
      mindMapBranchData: MIND_MAP_BRANCHES.A,
      keywords: ["immersion", "filosofi", "teori", "konsep", "metodologi"],
      difficulty: "beginner",
      contentType: "guide",
    };
  }

  const { title, description, tags } = post.data;
  const content = post.body || "";
  const text =
    `${title || ""} ${description || ""} ${(tags || []).join(" ")} ${content}`.toLowerCase();

  // Use simplified mind map system - no customizations needed
  const branches = MIND_MAP_BRANCHES;

  // Enhanced branch detection with simplified system
  let bestBranch = "A";
  let maxScore = 0;

  for (const [branchId, config] of Object.entries(branches)) {
    const score = config.keywords.filter((keyword) =>
      text.includes(keyword.toLowerCase()),
    ).length;

    if (score > maxScore) {
      maxScore = score;
      bestBranch = branchId;
    }
  }

  // Get branch data
  const branchData = branches[bestBranch as keyof typeof MIND_MAP_BRANCHES];

  // Enhanced difficulty detection
  const difficulty =
    content.length > 5000
      ? "advanced"
      : content.length > 2000
        ? "intermediate"
        : "beginner";

  // Enhanced content type detection - check both tags and category with priority for tools
  let contentType:
    | "guide"
    | "tutorial"
    | "theory"
    | "practice"
    | "tool"
    | "review" = "review"; // default

  // Priority 1: Check for tool-related content first (highest priority)
  if (
    (tags || []).includes("tool") ||
    post.data.category === "tools" ||
    text.includes("anki") ||
    text.includes("flashcard") ||
    text.includes("srs") ||
    text.includes("spaced-repetition")
  ) {
    contentType = "tool";
  }
  // Priority 2: Check for other content types
  else if ((tags || []).includes("guide") || text.includes("panduan")) {
    contentType = "guide";
  } else if ((tags || []).includes("tutorial")) {
    contentType = "tutorial";
  } else if ((tags || []).includes("theory")) {
    contentType = "theory";
  } else if ((tags || []).includes("practice")) {
    contentType = "practice";
  }

  // Content type detection completed for "${post.data.title}"

  return {
    mindMapBranch: bestBranch,
    mindMapBranchData: branchData,
    keywords: branchData.keywords.slice(0, 5),
    difficulty,
    contentType,
  };
}



// NOTE: generateReinventedInternalLinks function has been removed in favor of word-to-link conversion

// NOTE: Legacy helper functions have been removed in favor of word-to-link conversion

// NOTE: Legacy helper functions have been removed in favor of word-to-link conversion

// NOTE: All remaining legacy helper functions have been removed in favor of word-to-link conversion

// NOTE: All remaining legacy helper functions have been removed in favor of word-to-link conversion

/**
 * Enhanced internal link generation with mind map context and adaptive count
 */
export function generateInternalLinks(
  currentPost: CollectionEntry<"docs">,
  allPosts: CollectionEntry<"docs">[],
  maxLinks: number = 3,
): InternalLinkSuggestion[] {
  const currentAnalysis = analyzeContent(currentPost);
  const suggestions: InternalLinkSuggestion[] = [];

  // Safety check for post body
  if (!currentPost.body) {
    console.warn(`Post ${currentPost.slug} has no body content`);
    return suggestions;
  }

  // Adaptive link count based on content length
  const contentLength = currentPost.body.length;
  const adaptiveMaxLinks = calculateAdaptiveLinkCount(contentLength, maxLinks);

  console.log(
    `📏 Content length: ${contentLength} chars, adaptive links: ${adaptiveMaxLinks}`,
  );

  // Find related posts with enhanced scoring and mind map context
  const relatedPosts = allPosts
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => {
      const analysis = analyzeContent(post);
      const relevance =
        analysis.mindMapBranch === currentAnalysis.mindMapBranch ? 0.8 : 0.4;

      // Determine relationship type for mind map context
      const relationshipType = determineRelationshipType(
        currentAnalysis.mindMapBranch,
        analysis.mindMapBranch,
      );

      return { post, relevance, analysis, relationshipType };
    })
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, adaptiveMaxLinks);

  // Intelligent positioning strategy
  const optimalSpacing = Math.max(
    800,
    Math.floor(contentLength / (adaptiveMaxLinks + 1)),
  ); // Minimum 800 chars between links

  // Find optimal insertion points based on content structure
  const insertionPoints = findOptimalInsertionPoints(
    currentPost.body,
    adaptiveMaxLinks,
    optimalSpacing,
  );

  // Generate suggestions with intelligent positioning and mind map context
  relatedPosts.forEach(
    ({ post, relevance, analysis, relationshipType }, index) => {
      const insertPosition = insertionPoints[index] || currentPost.body.length;

      // Create mind map context for better user understanding
      const mindMapContext = {
        sourceBranch: currentAnalysis.mindMapBranch,
        targetBranch: analysis.mindMapBranch,
        relationshipType,
        visualConnection: generateVisualConnection(
          relationshipType,
          currentAnalysis,
        ),
      };

      suggestions.push({
        targetSlug: post.slug,
        targetTitle: post.data.title,
        reason: `Related ${analysis.mindMapBranchData.displayName} content`,
        relevance,
        position: insertPosition,
        mindMapContext,
      });
    },
  );

  return suggestions;
}

/**
 * Determine the type of relationship between two mind map branches
 */
function determineRelationshipType(
  sourceBranch: string,
  targetBranch: string,
): "same-branch" | "related-branch" | "progression" | "complementary" {
  if (sourceBranch === targetBranch) {
    return "same-branch";
  }

  // Define progression relationships
  const progressionMap: Record<string, string[]> = {
    A: ["B", "C"], // Foundation leads to learning stages and understanding
    B: ["C", "E"], // Learning stages lead to understanding and practice
    C: ["D", "E"], // Understanding leads to tools and practice
    D: ["E"], // Tools lead to practice
    E: [], // Practice is the final stage
  };

  if (progressionMap[sourceBranch]?.includes(targetBranch)) {
    return "progression";
  }

  // Define complementary relationships
  const complementaryMap: Record<string, string[]> = {
    A: ["D"], // Foundation complements tools
    B: ["D"], // Learning stages complement tools
    C: ["A"], // Understanding complements foundation
    D: ["B"], // Tools complement learning stages
    E: ["A", "B", "C"], // Practice complements all other areas
  };

  if (complementaryMap[sourceBranch]?.includes(targetBranch)) {
    return "complementary";
  }

  return "related-branch";
}

/**
 * Generate visual connection properties based on relationship type
 */
function generateVisualConnection(
  relationshipType: string,
  sourceAnalysis: ContentAnalysisResult,
) {
  const baseConnection = {
    style: "solid" as const,
    thickness: "medium" as const,
  };

  switch (relationshipType) {
    case "same-branch":
      return {
        ...baseConnection,
        color: sourceAnalysis.mindMapBranchData.visual.color,
        style: "solid" as const,
        thickness: "thick" as const,
      };
    case "progression":
      return {
        ...baseConnection,
        color: "#10B981", // Green for progression
        style: "solid" as const,
        thickness: "medium" as const,
      };
    case "complementary":
      return {
        ...baseConnection,
        color: "#F59E0B", // Amber for complementary
        style: "dashed" as const,
        thickness: "medium" as const,
      };
    default:
      return {
        ...baseConnection,
        color: "#6B7280", // Gray for related
        style: "dotted" as const,
        thickness: "thin" as const,
      };
  }
}

/**
 * Calculate adaptive link count based on content length
 * - Posts under 2568 characters: 1 link
 * - Posts 2568-5000 characters: 2 links
 * - Posts over 5000 characters: 3 links
 */
function calculateAdaptiveLinkCount(
  contentLength: number,
  maxLinks: number,
): number {
  // Content length thresholds
  const SHORT_CONTENT_THRESHOLD = 2568;
  const MEDIUM_CONTENT_THRESHOLD = 5000;

  if (contentLength < SHORT_CONTENT_THRESHOLD) {
    return 1; // Short content: single well-placed link
  } else if (contentLength < MEDIUM_CONTENT_THRESHOLD) {
    return Math.min(2, maxLinks); // Medium content: up to 2 links
  } else {
    return maxLinks; // Long content: full link count
  }
}

/**
 * Simplified mind map utility functions - re-exported from new system
 */
export { MindMapUtils } from "../../components/mind-map/mind-map-config";

/**
 * Find optimal insertion points for internal links
 * COMPLETELY AVOIDING header positions to prevent reading flow disruption
 */
function findOptimalInsertionPoints(
  content: string,
  maxLinks: number,
  optimalSpacing: number,
): number[] {
  const insertionPoints: number[] = [];
  const contentLength = content.length;

  // Find ALL header positions to avoid them completely
  const headerMatches = [...content.matchAll(/^#{1,6}\s+.+$/gm)];
  const headerPositions = headerMatches.map((match) => {
    const endOfHeader = content.indexOf("\n", match.index!);
    return endOfHeader > 0 ? endOfHeader : match.index! + match[0].length;
  });

  // Strategy 1: Place after paragraph breaks with minimum spacing - AVOIDING headers
  const paragraphBreaks = [...content.matchAll(/\n\n+/g)];
  const safePositions: number[] = [];

  paragraphBreaks.forEach((match) => {
    const position = match.index! + match[0].length;

    // Check if this position is too close to any header
    const isTooCloseToHeader = headerPositions.some(
      (headerPos) => Math.abs(position - headerPos) < 500, // Minimum 500 characters from any header
    );

    if (!isTooCloseToHeader) {
      safePositions.push(position);
    }
  });

  // Strategy 2: If not enough safe positions, use content-based positions
  if (safePositions.length < maxLinks) {
    for (let i = 1; i <= maxLinks; i++) {
      const candidatePosition = Math.floor(
        (contentLength * i) / (maxLinks + 1),
      );

      // Check if this candidate is safe from headers
      const isTooCloseToHeader = headerPositions.some(
        (headerPos) => Math.abs(candidatePosition - headerPos) < 500,
      );

      if (!isTooCloseToHeader && !safePositions.includes(candidatePosition)) {
        safePositions.push(candidatePosition);
      }
    }
  }

  // Strategy 3: Select best positions from safe candidates
  let currentPosition = 0;
  const usedPositions = new Set<number>();

  // Sort safe positions by their location in content
  safePositions.sort((a, b) => a - b);

  // Special handling for single link placement
  if (maxLinks === 1) {
    const midContentPosition = Math.floor(contentLength * 0.6);
    let bestPosition = safePositions.reduce(
      (best, pos) => {
        const distanceFromIdeal = Math.abs(pos - midContentPosition);
        const bestDistance = Math.abs(best - midContentPosition);
        return distanceFromIdeal < bestDistance ? pos : best;
      },
      safePositions[0] || Math.floor(contentLength * 0.6),
    );

    // Final safety check
    const finalCheck = headerPositions.some(
      (headerPos) => Math.abs(bestPosition - headerPos) < 500,
    );

    if (!finalCheck && bestPosition) {
      insertionPoints.push(bestPosition);
    }
    return insertionPoints;
  }

  // Multi-link placement with optimal spacing
  for (let i = 0; i < maxLinks && i < safePositions.length; i++) {
    let bestPosition = -1;
    let bestScore = -1;

    for (const position of safePositions) {
      if (
        position > currentPosition + Math.min(optimalSpacing, 400) &&
        !usedPositions.has(position)
      ) {
        const score = calculateSafePositionScore(
          position,
          currentPosition,
          optimalSpacing,
          contentLength,
        );
        if (score > bestScore) {
          bestScore = score;
          bestPosition = position;
        }
      }
    }

    if (bestPosition !== -1) {
      insertionPoints.push(bestPosition);
      usedPositions.add(bestPosition);
      currentPosition = bestPosition;
    }
  }

  return insertionPoints.sort((a, b) => a - b);
}

/**
 * Calculate score for safe position (avoiding headers)
 */
function calculateSafePositionScore(
  position: number,
  lastPosition: number,
  optimalSpacing: number,
  contentLength: number,
): number {
  const spacing = position - lastPosition;
  const spacingScore = Math.max(
    0,
    100 - Math.abs(spacing - optimalSpacing) / 10,
  );

  // Bonus for positions in the middle sections of content
  const contentPercent = position / contentLength;
  const middleBonus = contentPercent >= 0.3 && contentPercent <= 0.8 ? 20 : 0;

  // Penalty for positions too close to beginning or end
  const edgePenalty = contentPercent < 0.15 || contentPercent > 0.9 ? -30 : 0;

  return spacingScore + middleBonus + edgePenalty;
}







// NOTE: insertInternalLinks function has been removed in favor of word-to-link conversion
