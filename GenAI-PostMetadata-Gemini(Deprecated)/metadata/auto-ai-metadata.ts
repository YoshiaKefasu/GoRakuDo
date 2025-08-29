// Auto AI Metadata Generation Utility
// Phase 1: Simple AI metadata generation for current implementation
// Provides basic metadata generation and content analysis capabilities

import type { CollectionEntry } from "astro:content";

// Simple AI Metadata Interface (Phase 1)
export interface SimpleAIMetadata {
  contentType:
    | "guide"
    | "methodology"
    | "tool"
    | "theory"
    | "practice"
    | "review"
    | "case-study"
    | "faq";
  learningStage:
    | "alphabet"
    | "basic-grammar"
    | "kanji-intro"
    | "intermediate"
    | "advanced"
    | "fluency";
  complexityScore: number; // 1-10 scale
  estimatedStudyTime: number; // in minutes
  primaryKeywords: string[];
  searchIntent:
    | "informational"
    | "navigational"
    | "transactional"
    | "commercial";
}

/**
 * Generate simple AI metadata for a post
 * Phase 1: Basic metadata generation based on content analysis
 */
export function generateSimpleAIMetadata(
  post: CollectionEntry<"blog">,
): SimpleAIMetadata {
  // Default metadata based on post content analysis
  const defaultMetadata: SimpleAIMetadata = {
    contentType: "guide",
    learningStage: "alphabet",
    complexityScore: 1,
    estimatedStudyTime: 10,
    primaryKeywords: [],
    searchIntent: "informational",
  };

  // Basic content analysis based on title and description
  const title = (post.data?.title || "").toLowerCase();
  const description = (post.data?.description || "").toLowerCase();

  // Determine content type based on keywords
  if (
    title.includes("guide") ||
    title.includes("how to") ||
    description.includes("step")
  ) {
    defaultMetadata.contentType = "guide";
  } else if (
    title.includes("method") ||
    title.includes("approach") ||
    description.includes("method")
  ) {
    defaultMetadata.contentType = "methodology";
  } else if (
    title.includes("tool") ||
    title.includes("app") ||
    description.includes("tool")
  ) {
    defaultMetadata.contentType = "tool";
  } else if (
    title.includes("theory") ||
    title.includes("concept") ||
    description.includes("theory")
  ) {
    defaultMetadata.contentType = "theory";
  } else if (
    title.includes("practice") ||
    title.includes("exercise") ||
    description.includes("practice")
  ) {
    defaultMetadata.contentType = "practice";
  } else if (
    title.includes("review") ||
    title.includes("comparison") ||
    description.includes("review")
  ) {
    defaultMetadata.contentType = "review";
  } else if (
    title.includes("case") ||
    title.includes("story") ||
    description.includes("experience")
  ) {
    defaultMetadata.contentType = "case-study";
  } else if (
    title.includes("faq") ||
    title.includes("question") ||
    description.includes("question")
  ) {
    defaultMetadata.contentType = "faq";
  }

  // Determine learning stage based on content
  if (
    title.includes("hiragana") ||
    title.includes("katakana") ||
    title.includes("alphabet")
  ) {
    defaultMetadata.learningStage = "alphabet";
  } else if (
    title.includes("grammar") ||
    title.includes("sentence") ||
    description.includes("grammar")
  ) {
    defaultMetadata.learningStage = "basic-grammar";
  } else if (title.includes("kanji") || description.includes("kanji")) {
    defaultMetadata.learningStage = "kanji-intro";
  } else if (
    title.includes("intermediate") ||
    description.includes("intermediate")
  ) {
    defaultMetadata.learningStage = "intermediate";
  } else if (title.includes("advanced") || description.includes("advanced")) {
    defaultMetadata.learningStage = "advanced";
  } else if (
    title.includes("fluency") ||
    title.includes("native") ||
    description.includes("fluency")
  ) {
    defaultMetadata.learningStage = "fluency";
  }

  // Estimate complexity score based on content length and keywords
  const contentLength = (post.body || "").length;
  if (contentLength < 1000) {
    defaultMetadata.complexityScore = 1;
  } else if (contentLength < 2000) {
    defaultMetadata.complexityScore = 2;
  } else if (contentLength < 4000) {
    defaultMetadata.complexityScore = 3;
  } else if (contentLength < 6000) {
    defaultMetadata.complexityScore = 4;
  } else {
    defaultMetadata.complexityScore = 5;
  }

  // Estimate study time (rough calculation: 200 words per minute reading)
  defaultMetadata.estimatedStudyTime = Math.max(
    5,
    Math.ceil(contentLength / 200),
  );

  // Extract primary keywords from title and description
  const keywords = [
    ...new Set([
      ...title.split(/\s+/).filter((word: string) => word.length > 3),
      ...description.split(/\s+/).filter((word: string) => word.length > 3),
    ]),
  ].slice(0, 5);
  defaultMetadata.primaryKeywords = keywords;

  // Determine search intent
  if (
    title.includes("how") ||
    title.includes("what") ||
    title.includes("why")
  ) {
    defaultMetadata.searchIntent = "informational";
  } else if (
    title.includes("download") ||
    title.includes("buy") ||
    title.includes("purchase")
  ) {
    defaultMetadata.searchIntent = "transactional";
  } else if (
    title.includes("review") ||
    title.includes("compare") ||
    title.includes("best")
  ) {
    defaultMetadata.searchIntent = "commercial";
  } else {
    defaultMetadata.searchIntent = "navigational";
  }

  return defaultMetadata;
}

/**
 * Get content with simple AI metadata
 * Returns posts with generated metadata
 */
export function getContentWithSimpleAIMetadata(
  posts: CollectionEntry<"blog">[],
): (CollectionEntry<"blog"> & { simpleAIMetadata: SimpleAIMetadata })[] {
  return posts.map((post) => ({
    ...post,
    simpleAIMetadata: generateSimpleAIMetadata(post),
  }));
}

/**
 * Get content by learning stage (simple version)
 */
export function getContentByLearningStage(
  posts: CollectionEntry<"blog">[],
  stage: SimpleAIMetadata["learningStage"],
): CollectionEntry<"blog">[] {
  return posts.filter((post) => {
    const metadata = generateSimpleAIMetadata(post);
    return metadata.learningStage === stage;
  });
}

/**
 * Get content by type (simple version)
 */
export function getContentByType(
  posts: CollectionEntry<"blog">[],
  type: SimpleAIMetadata["contentType"],
): CollectionEntry<"blog">[] {
  return posts.filter((post) => {
    const metadata = generateSimpleAIMetadata(post);
    return metadata.contentType === type;
  });
}

/**
 * Get content recommendations (simple version)
 */
export function getContentRecommendations(
  posts: CollectionEntry<"blog">[],
  currentPost: CollectionEntry<"blog">,
  maxRecommendations: number = 3,
): CollectionEntry<"blog">[] {
  const currentMetadata = generateSimpleAIMetadata(currentPost);

  // Filter out current post and get similar content
  const recommendations = posts
    .filter((post) => post.id !== currentPost.id)
    .filter((post) => {
      const metadata = generateSimpleAIMetadata(post);
      return (
        metadata.learningStage === currentMetadata.learningStage ||
        metadata.contentType === currentMetadata.contentType
      );
    })
    .slice(0, maxRecommendations);

  return recommendations;
}
