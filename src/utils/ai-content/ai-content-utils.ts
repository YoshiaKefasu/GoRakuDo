// AI-Ready Content Utility Functions
// Build-time processing for entity-based metadata and content relationships

import type { CollectionEntry } from "astro:content";

// Types for AI metadata
export interface AIMetadata {
  contentType:
    | "guide"
    | "methodology"
    | "tool"
    | "theory"
    | "practice"
    | "review"
    | "case-study"
    | "faq";
  languageEntities: {
    grammarPoints: string[];
    vocabularyCategories: string[];
    jlptLevel?: "N5" | "N4" | "N3" | "N2" | "N1";
    learningStage:
      | "alphabet"
      | "basic-grammar"
      | "kanji-intro"
      | "intermediate"
      | "advanced"
      | "fluency";
  };
  relationships: {
    prerequisites: string[];
    relatedContent: string[];
    nextSteps: string[];
    series?: string;
    seriesOrder?: number;
  };
  contentAnalysis: {
    targetAudience: string[];
    learningObjectives: string[];
    complexityScore: number;
    estimatedStudyTime: number;
    hasPracticeExercises: boolean;
    hasAudioContent: boolean;
    hasVisualContent: boolean;
  };
  seoMetadata: {
    primaryKeywords: string[];
    longTailKeywords: string[];
    searchIntent:
      | "informational"
      | "navigational"
      | "transactional"
      | "commercial";
    contentFreshness: "evergreen" | "seasonal" | "trending" | "reference";
  };
  technicalMetadata: {
    format: "text" | "video" | "audio" | "interactive" | "mixed";
    accessibility: {
      hasAltText: boolean;
      hasCaptions: boolean;
      hasTranscript: boolean;
      screenReaderFriendly: boolean;
    };
    performance: {
      imageOptimized: boolean;
      mobileFriendly: boolean;
      loadTimeOptimized: boolean;
    };
  };
}

// Content relationship mapping
export interface ContentRelationship {
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  contentType: string;
  learningStage: string;
  complexityScore: number;
  estimatedStudyTime: number;
}

/**
 * Get content by learning stage for progressive learning paths
 */
export function getContentByLearningStage(
  posts: CollectionEntry<"blog">[],
  stage: string,
): CollectionEntry<"blog">[] {
  return posts
    .filter(
      (post) =>
        (post.data.aiMetadata?.languageEntities as any)?.learningStage ===
        stage,
    )
    .sort(
      (a, b) =>
        ((a.data.aiMetadata?.contentAnalysis as any)?.complexityScore || 1) -
        ((b.data.aiMetadata?.contentAnalysis as any)?.complexityScore || 1),
    );
}

/**
 * Get content by JLPT level for exam preparation
 */
export function getContentByJLPTLevel(
  posts: CollectionEntry<"blog">[],
  level: string,
): CollectionEntry<"blog">[] {
  return posts
    .filter(
      (post) => post.data.aiMetadata?.languageEntities?.jlptLevel === level,
    )
    .sort(
      (a, b) =>
        ((a.data.aiMetadata?.contentAnalysis as any)?.complexityScore || 1) -
        ((b.data.aiMetadata?.contentAnalysis as any)?.complexityScore || 1),
    );
}

/**
 * Get content by content type for specific learning needs
 */
export function getContentByType(
  posts: CollectionEntry<"blog">[],
  contentType: string,
): CollectionEntry<"blog">[] {
  return posts.filter(
    (post) => post.data.aiMetadata?.contentType === contentType,
  );
}

/**
 * Get related content based on relationships metadata
 */
export function getRelatedContent(
  posts: CollectionEntry<"blog">[],
  currentSlug: string,
): CollectionEntry<"blog">[] {
  const currentPost = posts.find((post) => post.slug === currentSlug);
  if (!currentPost?.data.aiMetadata?.relationships?.relatedContent) {
    return [];
  }

  return posts.filter((post) =>
    currentPost.data.aiMetadata?.relationships?.relatedContent?.includes(
      post.slug,
    ),
  );
}

/**
 * Get prerequisites for a specific content piece
 */
export function getPrerequisites(
  posts: CollectionEntry<"blog">[],
  currentSlug: string,
): CollectionEntry<"blog">[] {
  const currentPost = posts.find((post) => post.slug === currentSlug);
  if (!currentPost?.data.aiMetadata?.relationships?.prerequisites) {
    return [];
  }

  return posts.filter((post) =>
    currentPost.data.aiMetadata?.relationships?.prerequisites?.includes(
      post.slug,
    ),
  );
}

/**
 * Get next steps after completing a content piece
 */
export function getNextSteps(
  posts: CollectionEntry<"blog">[],
  currentSlug: string,
): CollectionEntry<"blog">[] {
  const currentPost = posts.find((post) => post.slug === currentSlug);
  if (!currentPost?.data.aiMetadata?.relationships?.nextSteps) {
    return [];
  }

  return posts.filter((post) =>
    currentPost.data.aiMetadata?.relationships?.nextSteps?.includes(post.slug),
  );
}

/**
 * Get content series in order
 */
export function getContentSeries(
  posts: CollectionEntry<"blog">[],
  seriesName: string,
): CollectionEntry<"blog">[] {
  return posts
    .filter(
      (post) => post.data.aiMetadata?.relationships?.series === seriesName,
    )
    .sort(
      (a, b) =>
        (a.data.aiMetadata?.relationships?.seriesOrder || 0) -
        (b.data.aiMetadata?.relationships?.seriesOrder || 0),
    );
}

/**
 * Get content by target audience
 */
export function getContentByAudience(
  posts: CollectionEntry<"blog">[],
  audience: string,
): CollectionEntry<"blog">[] {
  return posts.filter((post) =>
    (post.data.aiMetadata?.contentAnalysis?.targetAudience as any)?.includes(
      audience,
    ),
  );
}

/**
 * Get content by complexity score range
 */
export function getContentByComplexity(
  posts: CollectionEntry<"blog">[],
  minScore: number,
  maxScore: number,
): CollectionEntry<"blog">[] {
  return posts.filter((post) => {
    const score =
      (post.data.aiMetadata?.contentAnalysis as any)?.complexityScore || 1;
    return score >= minScore && score <= maxScore;
  });
}

/**
 * Get content by estimated study time
 */
export function getContentByStudyTime(
  posts: CollectionEntry<"blog">[],
  maxTime: number,
): CollectionEntry<"blog">[] {
  return posts.filter(
    (post) =>
      ((post.data.aiMetadata?.contentAnalysis as any)?.estimatedStudyTime ||
        10) <= maxTime,
  );
}

/**
 * Get content with specific features (audio, visual, exercises)
 */
export function getContentWithFeatures(
  posts: CollectionEntry<"blog">[],
  features: {
    hasAudioContent?: boolean;
    hasVisualContent?: boolean;
    hasPracticeExercises?: boolean;
  },
): CollectionEntry<"blog">[] {
  return posts.filter((post) => {
    const metadata = post.data.aiMetadata?.contentAnalysis;
    if (!metadata) return false;

    if (
      features.hasAudioContent !== undefined &&
      metadata.hasAudioContent !== features.hasAudioContent
    )
      return false;
    if (
      features.hasVisualContent !== undefined &&
      metadata.hasVisualContent !== features.hasVisualContent
    )
      return false;
    if (
      features.hasPracticeExercises !== undefined &&
      metadata.hasPracticeExercises !== features.hasPracticeExercises
    )
      return false;

    return true;
  });
}

/**
 * Get content by search intent for SEO optimization
 */
export function getContentBySearchIntent(
  posts: CollectionEntry<"blog">[],
  intent: string,
): CollectionEntry<"blog">[] {
  return posts.filter(
    (post) =>
      (post.data.aiMetadata?.seoMetadata as any)?.searchIntent === intent,
  );
}

/**
 * Get content by freshness type
 */
export function getContentByFreshness(
  posts: CollectionEntry<"blog">[],
  freshness: string,
): CollectionEntry<"blog">[] {
  return posts.filter(
    (post) => post.data.aiMetadata?.seoMetadata?.contentFreshness === freshness,
  );
}

/**
 * Generate learning path based on user level and goals
 */
export function generateLearningPath(
  posts: CollectionEntry<"blog">[],
  userLevel: string,
  targetLevel: string,
  maxTimePerDay: number,
): CollectionEntry<"blog">[] {
  // Filter content by user's current level
  let availableContent = getContentByLearningStage(posts, userLevel);

  // Add content from next level if user is ready
  if (userLevel !== targetLevel) {
    const nextLevelContent = getContentByLearningStage(
      posts,
      getNextLevel(userLevel),
    );
    availableContent = [...availableContent, ...nextLevelContent];
  }

  // Filter by study time constraints
  availableContent = getContentByStudyTime(availableContent, maxTimePerDay);

  // Sort by complexity and estimated study time
  return availableContent.sort((a, b) => {
    const aScore =
      (a.data.aiMetadata?.contentAnalysis as any)?.complexityScore || 1;
    const bScore =
      (b.data.aiMetadata?.contentAnalysis as any)?.complexityScore || 1;
    const aTime =
      (a.data.aiMetadata?.contentAnalysis as any)?.estimatedStudyTime || 10;
    const bTime =
      (b.data.aiMetadata?.contentAnalysis as any)?.estimatedStudyTime || 10;

    return aScore - bScore || aTime - bTime;
  });
}

/**
 * Helper function to get next learning level
 */
function getNextLevel(currentLevel: string): string {
  const levels = [
    "alphabet",
    "basic-grammar",
    "kanji-intro",
    "intermediate",
    "advanced",
    "fluency",
  ];
  const currentIndex = levels.indexOf(currentLevel);
  return currentIndex < levels.length - 1
    ? levels[currentIndex + 1]
    : currentLevel;
}

/**
 * Get content recommendations based on user preferences
 */
export function getContentRecommendations(
  posts: CollectionEntry<"blog">[],
  preferences: {
    contentType?: string;
    maxComplexity?: number;
    maxStudyTime?: number;
    hasAudio?: boolean;
    hasVisual?: boolean;
    hasExercises?: boolean;
  },
): CollectionEntry<"blog">[] {
  let recommendations = posts;

  if (preferences.contentType) {
    recommendations = getContentByType(
      recommendations,
      preferences.contentType,
    );
  }

  if (preferences.maxComplexity) {
    recommendations = getContentByComplexity(
      recommendations,
      1,
      preferences.maxComplexity,
    );
  }

  if (preferences.maxStudyTime) {
    recommendations = getContentByStudyTime(
      recommendations,
      preferences.maxStudyTime,
    );
  }

  if (
    preferences.hasAudio !== undefined ||
    preferences.hasVisual !== undefined ||
    preferences.hasExercises !== undefined
  ) {
    recommendations = getContentWithFeatures(recommendations, {
      hasAudioContent: preferences.hasAudio,
      hasVisualContent: preferences.hasVisual,
      hasPracticeExercises: preferences.hasExercises,
    });
  }

  // Sort by relevance (complexity and study time)
  return recommendations.sort((a, b) => {
    const aScore =
      (a.data.aiMetadata?.contentAnalysis as any)?.complexityScore || 1;
    const bScore =
      (b.data.aiMetadata?.contentAnalysis as any)?.complexityScore || 1;
    const aTime =
      (a.data.aiMetadata?.contentAnalysis as any)?.estimatedStudyTime || 10;
    const bTime =
      (b.data.aiMetadata?.contentAnalysis as any)?.estimatedStudyTime || 10;

    return aScore - bScore || aTime - bTime;
  });
}
