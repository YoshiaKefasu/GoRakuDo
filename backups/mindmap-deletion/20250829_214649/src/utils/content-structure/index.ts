// Content Structure Utilities - Index File
// Centralized exports for all content structure and navigation utilities

export {
  MIND_MAP_BRANCHES,
  UNDERSTANDING_LEVELS,
  LEARNING_STAGES,
  getMindMapBranch,
  getUnderstandingLevel,
  getLearningStage,
  getSubBranch,
  getPostsByMindMapBranch,
  getPostsByUnderstandingLevel,
  getPostsByLearningStage,
  generateBreadcrumbPath,
  getNextUnderstandingLevel,
  getPreviousUnderstandingLevel,
  getNextLearningStage,
  getPreviousLearningStage,
} from "./mind-map-structure";

export type {
  MindMapBranch,
  MindMapSubBranch,
  UnderstandingLevel,
  LearningStage,
} from "./mind-map-structure";

export {
  generateSkeletonPostCard,
  generateSkeletonSearchResult,
  generateSkeletonPagination,
  generateSkeletonContent,
  generateSkeletonRelationshipCard,
  generateSkeletonItems,
  generateSkeletonCSS,
  showSkeleton,
  hideSkeleton,
  initializeSkeletonSystem,
  SkeletonManager,
} from "./skeleton-loader";

export type {
  SkeletonConfig,
  SkeletonPostCard,
  SkeletonContent,
  SkeletonRelationshipCard,
} from "./skeleton-loader";
