/**
 * GenAI Post Metadata Gemini - Main Index
 * Centralized exports for all GenAI metadata generation functionality
 */

// Core GenAI API exports
export { GeminiAIServiceNew } from "./core/gemini-api-new";
export { GeminiAIService } from "./core/gemini-api";
export { nodeEnvSetup } from "./core/node-env-setup";
export { RateLimiter } from "./core/rate-limiter";

// Type definitions
export type {
  GoogleGenAIConfig,
  MetaDescriptionRequest,
  KeywordsRequest,
  ContentGenerationRequest,
  AIResponse,
} from "./types/types";

// Metadata generation exports
export { generateAIMetadata } from "./metadata/auto-ai-metadata-fixed";
export { generateSimpleAIMetadata } from "./metadata/auto-ai-metadata";
export { generateRecommendations } from "./metadata/api-recommendations";

// Re-export commonly used types
export type { RelatedContent } from "../../src/components/docs/ai-recommendations/types";
