import { GeminiAIService } from "./gemini-api";
import { MetaDescriptionGenerator } from "./meta-description-generator";
import { ContentRecommendationSystem } from "./content-recommendations";
import { SEOOptimizer } from "./seo-optimizer";
import type {
  GeminiConfig,
  MetaDescriptionRequest,
  ContentRecommendationRequest,
  AIProcessingResult,
  SEOOptimizedMeta,
  ContentRecommendation,
} from "./types";

export class AISystem {
  private geminiService: GeminiAIService;
  private metaDescriptionGenerator: MetaDescriptionGenerator;
  private contentRecommendationSystem: ContentRecommendationSystem;

  constructor(config: GeminiConfig) {
    this.geminiService = new GeminiAIService(config);
    this.metaDescriptionGenerator = new MetaDescriptionGenerator(
      this.geminiService,
    );
    this.contentRecommendationSystem = new ContentRecommendationSystem(
      this.geminiService,
    );
  }

  async processContent(
    title: string,
    content: string,
    availablePosts: any[],
    language: "id" | "ja" = "id",
  ): Promise<AIProcessingResult> {
    const startTime = Date.now();
    let apiCallsUsed = 0;

    try {
      // Extract keywords
      const keywords = await this.geminiService.generateKeywords(
        content,
        title,
      );
      apiCallsUsed++;

      // Generate meta description
      const metaDescriptionRequest: MetaDescriptionRequest = {
        title,
        content,
        keywords,
        language,
      };
      const metaDescription =
        await this.metaDescriptionGenerator.generateOptimizedMetaDescription(
          metaDescriptionRequest,
        );
      apiCallsUsed++;

      // Generate content recommendations
      const recommendationRequest: ContentRecommendationRequest = {
        currentPost: {
          id: title.toLowerCase().replace(/\s+/g, "-"),
          title,
          content,
          tags: keywords,
        },
        availablePosts: availablePosts.map((post) => ({
          id: post.slug || post.id,
          title: post.title,
          description: post.description || post.excerpt || "",
          tags: post.tags || [],
        })),
      };
      const recommendations =
        await this.contentRecommendationSystem.generateRecommendations(
          recommendationRequest,
        );
      apiCallsUsed++;

      // Calculate SEO score
      const seoScore = SEOOptimizer.calculateSEOScore(
        title,
        metaDescription.description,
        keywords,
      );

      const processingTime = Date.now() - startTime;

      return {
        metaDescription,
        recommendations,
        keywords,
        seoScore,
        processingTime,
        apiCallsUsed,
      };
    } catch (error) {
      console.error("AI processing failed:", error);

      // Return fallback results
      return {
        metaDescription: this.generateFallbackMetaDescription(
          title,
          content,
          language,
        ),
        recommendations: this.generateFallbackRecommendations(availablePosts),
        keywords: SEOOptimizer.extractKeywords(content, title),
        seoScore: 50, // Default fallback score
        processingTime: Date.now() - startTime,
        apiCallsUsed,
      };
    }
  }

  async generateMetaDescriptionOnly(
    title: string,
    content: string,
    language: "id" | "ja" = "id",
  ): Promise<SEOOptimizedMeta> {
    const keywords = SEOOptimizer.extractKeywords(content, title);

    const request: MetaDescriptionRequest = {
      title,
      content,
      keywords,
      language,
    };

    return await this.metaDescriptionGenerator.generateOptimizedMetaDescription(
      request,
    );
  }

  async generateRecommendationsOnly(
    currentPost: any,
    availablePosts: any[],
  ): Promise<ContentRecommendation[]> {
    const request: ContentRecommendationRequest = {
      currentPost: {
        id: currentPost.slug || currentPost.id,
        title: currentPost.title,
        content: currentPost.content || currentPost.body || "",
        tags: currentPost.tags || [],
      },
      availablePosts: availablePosts.map((post) => ({
        id: post.slug || post.id,
        title: post.title,
        description: post.description || post.excerpt || "",
        tags: post.tags || [],
      })),
    };

    return await this.contentRecommendationSystem.generateRecommendations(
      request,
    );
  }

  getRateLimitStats() {
    return this.geminiService.getRateLimitStats();
  }

  clearAllCaches() {
    this.metaDescriptionGenerator.clearCache();
    this.contentRecommendationSystem.clearCache();
    this.geminiService.clearCache();
  }

  getCacheStats() {
    return {
      metaDescriptionCache: this.metaDescriptionGenerator.getCacheSize(),
      recommendationsCache: this.contentRecommendationSystem.getCacheSize(),
      geminiCache: this.geminiService.getCacheSize(),
    };
  }

  private generateFallbackMetaDescription(
    title: string,
    content: string,
    language: "id" | "ja",
  ): SEOOptimizedMeta {
    const excerpt = SEOOptimizer.generateExcerpt(content, 120);
    const description =
      language === "ja"
        ? `${title} - ${excerpt} イマージョン法による日本語学習。`
        : `${title} - ${excerpt} Belajar bahasa Jepang dengan metode immersion.`;

    return {
      description:
        description.length > 160
          ? description.substring(0, 157) + "..."
          : description,
      length: Math.min(description.length, 160),
      hasKeywords: true,
      hasCTA: true,
      language,
      generatedAt: new Date().toISOString(),
    };
  }

  private generateFallbackRecommendations(
    availablePosts: any[],
  ): ContentRecommendation[] {
    return availablePosts.slice(0, 3).map((post, index) => ({
      postId: post.slug || post.id,
      title: post.title,
      relevanceScore: 0.8 - index * 0.1,
      reason: "Artikel terkait tentang pembelajaran bahasa Jepang",
      tags: post.tags || [],
    }));
  }
}
