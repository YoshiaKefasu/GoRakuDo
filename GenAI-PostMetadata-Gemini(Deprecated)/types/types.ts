export interface GeminiConfig {
  apiKey: string;
  model: string;
  rateLimitRPD: number;
  rateLimitRPM: number;
}

export interface AIResponse {
  response: string;
  timestamp: number;
  apiCallsUsed: number;
  content?: string;
  recommendations?: string[];
}

export interface MetaDescriptionRequest {
  title: string;
  content: string;
  keywords: string[];
  language: "id" | "ja";
}

export interface ContentRecommendationRequest {
  currentPost: {
    id: string;
    title: string;
    content: string;
    tags: string[];
  };
  availablePosts: Array<{
    id: string;
    title: string;
    description: string;
    tags: string[];
  }>;
}

export interface SEOOptimizedMeta {
  description: string;
  length: number;
  hasKeywords: boolean;
  hasCTA: boolean;
  language: "id" | "ja";
  generatedAt: string;
}

export interface SEOAnalysis {
  title: string;
  metaDescription: SEOOptimizedMeta;
  keywords: string[];
  structuredKeywords: string[];
  seoScore: number;
}

export interface ContentRecommendation {
  postId: string;
  title: string;
  relevanceScore: number;
  reason: string;
  tags: string[];
}

export interface AIProcessingResult {
  metaDescription: SEOOptimizedMeta;
  recommendations: ContentRecommendation[];
  keywords: string[];
  seoScore: number;
  processingTime: number;
  apiCallsUsed: number;
}

// New types for Google GenAI package
export interface GoogleGenAIConfig {
  apiKey: string;
  model: string;
  rateLimitRPD: number;
  rateLimitRPM: number;
}

export interface GenerationConfig {
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
  thinkingConfig?: {
    thinkingBudget?: number;
  };
}

export interface EnvironmentInfo {
  hasApiKey: boolean;
  model: string;
  rateLimits: { rpd: number; rpm: number };
  isInitialized: boolean;
}
