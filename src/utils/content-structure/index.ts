// Content Structure Utilities - Index File
// Centralized exports for all content structure and navigation utilities

// MindMap-related functions removed - MindMap functionality deprecated
// UNDERSTANDING_LEVELS and LEARNING_STAGES preserved for existing functionality
export const UNDERSTANDING_LEVELS = {
  beginner: { name: "Beginner", description: "Basic understanding level" },
  intermediate: { name: "Intermediate", description: "Intermediate understanding level" },
  advanced: { name: "Advanced", description: "Advanced understanding level" }
};

export const LEARNING_STAGES = {
  foundational: { name: "Foundational", description: "Basic learning stage" },
  developing: { name: "Developing", description: "Developing learning stage" },
  proficient: { name: "Proficient", description: "Proficient learning stage" }
};

// MindMap-related types removed - MindMap functionality deprecated
export type UnderstandingLevel = typeof UNDERSTANDING_LEVELS[keyof typeof UNDERSTANDING_LEVELS];
export type LearningStage = typeof LEARNING_STAGES[keyof typeof LEARNING_STAGES];

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
