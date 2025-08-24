// AI Content Utilities - Index File
// Centralized exports for all AI content analysis and metadata utilities

// Core AI Content Analysis - Explicit exports only
export {
  analyzeContent,
  generateInternalLinks,
  MIND_MAP_BRANCHES,
} from "./content-analysis";

export type { ContentAnalysis, LinkSuggestion } from "./content-analysis";

export {
  getRelatedContent,
  getLearningPathRecommendations,
  getPostsWithSemanticRelationships,
  analyzeSemanticRelationships,
} from "./semantic-relationships";

export type {
  SemanticRelationships,
  ContentRelationship,
  RelationshipAnalysis,
} from "./semantic-relationships";

// AI Metadata Management - Explicit exports only
export {
  getContentByLearningStage,
  getContentByJLPTLevel,
  getContentByType,
  getRelatedContent as getRelatedContentFromUtils,
  getPrerequisites,
  getNextSteps,
  getContentSeries,
  getContentByAudience,
  getContentByComplexity,
  getContentByStudyTime,
  getContentWithFeatures,
  getContentBySearchIntent,
  getContentByFreshness,
  generateLearningPath,
  getContentRecommendations,
} from "./ai-content-utils";

export type {
  AIMetadata,
  ContentRelationship as ContentRelationshipFromUtils,
} from "./ai-content-utils";

export {
  validateAIMetadata,
  validateAIMetadataBatch,
  generateValidationReport,
} from "./ai-metadata-validator";

export type {
  ValidationResult,
  ValidationError,
  ValidationWarning,
} from "./ai-metadata-validator";

export {
  generateSimpleAIMetadata,
  getContentWithSimpleAIMetadata,
  getContentByLearningStage as getContentByLearningStageSimple,
  getContentByType as getContentByTypeSimple,
  getContentRecommendations as getContentRecommendationsSimple,
} from "./auto-ai-metadata";

export type { SimpleAIMetadata } from "./auto-ai-metadata";

export {
  generateAIMetadata,
  getContentWithAIMetadata,
  getContentByLearningStageWithAI,
  getContentByJLPTLevelWithAI,
  getContentByTypeWithAI,
  getContentRecommendationsWithAI,
} from "./auto-ai-metadata-fixed";

// API-Driven Recommendations
export {
  generateAPIRecommendations,
  loadAndEnhanceRecommendations,
  convertPostsToPostInfo,
} from "./api-recommendations";

export type {
  APIGeneratedRecommendation,
  APIGeneratedRecommendations,
  PostInfo,
} from "./api-recommendations";

// Optimized Build Processing
export {
  OptimizedBuildProcessor,
  runOptimizedBuildProcessing,
  shouldEnableOptimizedProcessing,
} from "./optimized-build-processor";

export type { BuildProcessingStats } from "./optimized-build-processor";

// Optimized Post Processing
export {
  OptimizedPostProcessor,
  processPostWithOptimization,
  processMultiplePostsWithOptimization,
} from "./optimized-post-processor";

export type { PostProcessingResult } from "./optimized-post-processor";

// Clean AI Generation
export { CleanAIGenerator, generateCleanAIContent } from "./clean-ai-generator";

export type { CleanAIGenerationResult } from "./clean-ai-generator";
