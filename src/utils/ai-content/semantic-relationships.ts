// Simplified Semantic Content Relationships Utility
// Build-time processing for immersion-based Japanese learning
// Reduced complexity while maintaining core AI functionality

import type { CollectionEntry } from "astro:content";
// import { MIND_MAP_BRANCHES } from "./content-analysis"; // Removed - MindMap functionality deprecated

// Simplified relationship types
export interface ContentRelationship {
  type: "related" | "next-step" | "category" | "similar-content";
  targetSlug: string;
  targetTitle: string;
  strength: number; // 0-1, how strong the relationship is
  reason: string; // Why this relationship exists
}

export interface SemanticRelationships {
  relatedContent: ContentRelationship[];
  nextSteps: ContentRelationship[];
  categoryRelations: ContentRelationship[];
  similarContent: ContentRelationship[];
}

// Export the interface as RelationshipAnalysis for backward compatibility
export type RelationshipAnalysis = SemanticRelationships;

/**
 * Generate simplified semantic relationships for content
 */
export function getRelatedContent(
  currentPost: CollectionEntry<"docs">,
  allPosts: CollectionEntry<"docs">[],
): SemanticRelationships {
  const relationships: SemanticRelationships = {
    relatedContent: [],
    nextSteps: [],
    categoryRelations: [],
    similarContent: [],
  };

  try {
    // Safety check: ensure allPosts is an array
    if (!Array.isArray(allPosts)) {
      console.warn("allPosts is not an array:", allPosts);
      return relationships;
    }

    // Get current post analysis
    const currentAnalysis = analyzePost(currentPost);

    // Find related posts with improved logic to ensure 3 recommendations
    const relatedPosts = allPosts
      .filter((post) => post.slug !== currentPost.slug)
      .map((post) => {
        const analysis = analyzePost(post);
        const relevance = calculateRelevance(currentAnalysis, analysis);
        return { post, analysis, relevance };
      })
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5); // Limit to 5 related posts, but don't filter by relevance threshold

    // Generate relationships with improved logic
    relatedPosts.forEach(({ post, analysis, relevance }) => {
      const relationship: ContentRelationship = {
        type: "related",
        targetSlug: post.slug,
        targetTitle: post.data.title,
        strength: relevance,
        reason: `Related content`, // MIND_MAP_BRANCHES reference removed - MindMap functionality deprecated
      };

      relationships.relatedContent.push(relationship);

      // Add to similar content if same branch (high relevance) - REMOVED: MindMap functionality deprecated
      // if (analysis.mindMapBranch === currentAnalysis.mindMapBranch) {
      //   relationships.similarContent.push({
      //     ...relationship,
      //     type: "similar-content",
      //   });
      // }

      // Add to next steps if higher difficulty
      if (
        analysis.difficulty === "advanced" &&
        currentAnalysis.difficulty === "beginner"
      ) {
        relationships.nextSteps.push({
          ...relationship,
          type: "next-step",
        });
      }

      // Add to category relations
      relationships.categoryRelations.push({
        ...relationship,
        type: "category",
      });
    });

    // Ensure we have at least some similar content by adding high-relevance posts
    if (
      relationships.similarContent.length === 0 &&
      relationships.relatedContent.length > 0
    ) {
      // Add the highest relevance post as similar content
      const highestRelevance = relationships.relatedContent.sort(
        (a, b) => b.strength - a.strength,
      )[0];

      if (highestRelevance) {
        relationships.similarContent.push({
          ...highestRelevance,
          type: "similar-content",
        });
      }
    }
  } catch (error) {
    console.error("Error generating semantic relationships:", error);
  }

  return relationships;
}

/**
 * Simplified post analysis
 */
function analyzePost(post: CollectionEntry<"docs">) {
  // Add safety checks for post data
  if (!post || !post.data) {
    return {
      // mindMapBranch: "A", // Removed - MindMap functionality deprecated
      difficulty: "beginner",
    };
  }

  // const { title, description, tags } = post.data; // Removed - not used after MindMap cleanup
  const content = post.body || "";
  // const text = `${title || ""} ${description || ""} ${(tags || []).join(" ")} ${content}`.toLowerCase(); // Removed - not used after MindMap cleanup

  // MindMap branch detection removed - functionality deprecated
  // let bestBranch = "A";
  // let maxScore = 0;

  // for (const [branch, config] of Object.entries(MIND_MAP_BRANCHES)) {
  //   const score = config.keywords.filter((keyword: string) =>
  //     text.includes(keyword.toLowerCase()),
  //   ).length;

  //   if (score > maxScore) {
  //     maxScore = score;
  //     bestBranch = branch;
  //   }
  // }

  // Simplified difficulty detection
  const difficulty =
    content.length > 5000
      ? "advanced"
      : content.length > 2000
        ? "intermediate"
        : "beginner";

  return {
    // mindMapBranch: bestBranch, // Removed - MindMap functionality deprecated
    difficulty,
  };
}

/**
 * Improved relevance calculation to ensure better coverage
 */
function calculateRelevance(current: any, target: any): number {
  let score = 0;

  // Same mind map branch (high weight) - REMOVED: MindMap functionality deprecated
  // if (current.mindMapBranch === target.mindMapBranch) {
  //   score += 0.7;
  // }

  // Similar difficulty level
  if (current.difficulty === target.difficulty) {
    score += 0.2;
  }

  // Different difficulty (progression) - more inclusive
  if (target.difficulty === "advanced" && current.difficulty === "beginner") {
    score += 0.15;
  } else if (
    target.difficulty === "intermediate" &&
    current.difficulty === "beginner"
  ) {
    score += 0.1;
  }

  // Base score for any related content (ensures minimum relevance)
  score += 0.1;

  return Math.min(score, 1);
}

/**
 * Get learning path recommendations (simplified)
 */
export function getLearningPathRecommendations(
  currentPost: CollectionEntry<"docs">,
  allPosts: CollectionEntry<"docs">[],
): ContentRelationship[] {
  // Safety check: ensure allPosts is an array
  if (!Array.isArray(allPosts)) {
    console.warn(
      "allPosts is not an array in getLearningPathRecommendations:",
      allPosts,
    );
    return [];
  }

  const currentAnalysis = analyzePost(currentPost);

  return allPosts
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => {
      const analysis = analyzePost(post);
      const relevance = calculateRelevance(currentAnalysis, analysis);
      return { post, relevance };
    })
    .filter((item) => item.relevance > 0.5)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 3)
    .map(({ post, relevance }) => ({
      type: "next-step" as const,
      targetSlug: post.slug,
      targetTitle: post.data.title,
      strength: relevance,
      reason: `Recommended next step in learning path`, // MIND_MAP_BRANCHES reference removed - MindMap functionality deprecated
    }));
}

/**
 * Get posts with semantic relationships (simplified)
 */
export function getPostsWithSemanticRelationships(
  currentPost: CollectionEntry<"docs">,
  allPosts: CollectionEntry<"docs">[],
): CollectionEntry<"docs">[] {
  // Safety check: ensure allPosts is an array
  if (!Array.isArray(allPosts)) {
    console.warn(
      "allPosts is not an array in getPostsWithSemanticRelationships:",
      allPosts,
    );
    return [];
  }

  const relationships = getRelatedContent(currentPost, allPosts);

  return allPosts.filter((post) =>
    relationships.relatedContent.some((rel) => rel.targetSlug === post.slug),
  );
}

/**
 * Analyze semantic relationships (simplified)
 */
export function analyzeSemanticRelationships(
  currentPost: CollectionEntry<"docs">,
  allPosts: CollectionEntry<"docs">[],
): SemanticRelationships {
  return getRelatedContent(currentPost, allPosts);
}
