import { NewSEOKeywordValidator } from "../new-seo-system/keyword-validator";
import type {
  AIProcessingResult,
  SEOOptimizedMeta,
  ContentRecommendation,
} from "./types";

export class AISystem {
  private keywordValidator: NewSEOKeywordValidator;

  constructor(_config?: any) {
    // AI processing disabled for security
    // Config parameter kept for compatibility but not used
    this.keywordValidator = new NewSEOKeywordValidator();
  }

  async processContent(
    _title: string,
    _content: string,
    _availablePosts: any[],
    _language: "id" | "ja" = "id",
  ): Promise<AIProcessingResult> {
    // AI processing disabled for security
    throw new Error("AI processing disabled for security");
  }

  async generateMetaDescriptionOnly(
    title: string,
    content: string,
    language: "id" | "ja" = "id",
  ): Promise<SEOOptimizedMeta> {
    // AI processing disabled for security
    return this.generateFallbackMetaDescription(title, content, language);
  }

  async generateRecommendationsOnly(
    _currentPost: any,
    availablePosts: any[],
  ): Promise<ContentRecommendation[]> {
    // AI processing disabled for security
    return this.generateFallbackRecommendations(availablePosts);
  }

  getRateLimitStats() {
    return { rpd: 0, rpm: 0 }; // AI processing disabled
  }

  clearAllCaches() {
    // AI processing disabled
  }

  getCacheStats() {
    return {
      metaDescriptionCache: 0,
      recommendationsCache: 0,
      aiCache: 0,
    };
  }

  private generateFallbackMetaDescription(
    title: string,
    content: string,
    language: "id" | "ja",
  ): SEOOptimizedMeta {
    // 新しいシステムでの簡易抜粋生成
    const excerpt = content.length > 120 ? content.substring(0, 117) + "..." : content;

    // キーワード検証
    const validationResult = this.keywordValidator.validateAll({
      primary: [title],
      article: [excerpt]
    });

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
      hasKeywords: validationResult.optimizedKeywords.length > 0,
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
