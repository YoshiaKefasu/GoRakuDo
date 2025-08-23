// Utils Main Index File
// Centralized exports for all utility functions with backward compatibility

// AI Content Utilities
export * from "./ai-content";

// Performance Utilities
export * from "./performance";

// Error Handling Utilities
export * from "./error-handling";

// Content Structure Utilities
export * from "./content-structure";

// Testing Utilities (Note: Test files removed after successful testing)
// export * from "./testing"; // Removed - no test utilities currently available

// Legacy exports for backward compatibility
// These maintain the old import paths for existing code
export {
  analyzeContent,
  generateInternalLinks,
  insertInternalLinks,
  getRelatedContent,
  getLearningPathRecommendations,
  getPostsWithSemanticRelationships,
  analyzeSemanticRelationships,
} from "./ai-content";

export {
  generateAIPrefetchHints,
  generatePageSpecificAIOptimizations,
  // performanceLoader, // Removed to prevent 404 errors in development server
} from "./performance";

export { discordErrorReporter, errorHandler } from "./error-handling";

export {
  MIND_MAP_BRANCHES,
  UNDERSTANDING_LEVELS,
  LEARNING_STAGES,
  generateSkeletonPostCard,
  generateSkeletonSearchResult,
  generateSkeletonPagination,
  generateSkeletonContent,
  showSkeleton,
  hideSkeleton,
  SkeletonManager,
} from "./content-structure";
