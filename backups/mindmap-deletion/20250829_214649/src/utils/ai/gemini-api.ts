import { GoogleGenAI } from "@google/genai";
import { RateLimiter } from "./rate-limiter";
import type {
  GeminiConfig,
  AIResponse,
  MetaDescriptionRequest,
  ContentRecommendationRequest,
} from "./types";

export class GeminiAIService {
  private genAI: GoogleGenAI;
  private modelName: string;
  private rateLimiter: RateLimiter;
  private cache: Map<string, AIResponse>;

  constructor(config: GeminiConfig) {
    this.genAI = new GoogleGenAI({ apiKey: config.apiKey });
    this.modelName = config.model || "gemini-2.5-flash";
    this.rateLimiter = new RateLimiter(
      config.rateLimitRPD,
      config.rateLimitRPM,
    );
    this.cache = new Map();
  }

  async generateMetaDescription(
    request: MetaDescriptionRequest,
  ): Promise<string> {
    const cacheKey = `meta_${request.title}_${request.content.substring(0, 100)}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!.content!;
    }

    await this.rateLimiter.checkLimit();

    const prompt = `Generate a compelling meta description for this article about Japanese language learning:

Title: ${request.title}
Content: ${request.content.substring(0, 500)}...

Requirements:
- Maximum 160 characters
- Include primary keywords naturally
- Compelling and click-worthy
- Optimized for search engines
- Focus on value proposition
- Language: ${request.language === "ja" ? "Japanese" : "Indonesian"}

Meta Description:`;

    try {
      const result = await this.genAI.models.generateContent({
        model: this.modelName,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      const response =
        result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "No response generated";

      this.cache.set(cacheKey, {
        response: response,
        content: response,
        timestamp: Date.now(),
        apiCallsUsed: 1,
      });
      return response;
    } catch (error) {
      console.warn("Gemini API error, using fallback:", error);
      return this.generateFallbackMetaDescription(request);
    }
  }

  async generateContentRecommendations(
    request: ContentRecommendationRequest,
  ): Promise<string[]> {
    const cacheKey = `rec_${request.currentPost.id}_${request.availablePosts.length}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!.recommendations!;
    }

    await this.rateLimiter.checkLimit();

    const prompt = `Based on this Japanese language learning article, recommend 3 related articles from the available list:

Current Article:
Title: ${request.currentPost.title}
Content: ${request.currentPost.content.substring(0, 300)}...
Tags: ${request.currentPost.tags?.join(", ") || "none"}

Available Articles:
${request.availablePosts
  .map(
    (post, index) =>
      `${index + 1}. ${post.title} - ${post.description} (Tags: ${post.tags?.join(", ") || "none"})`,
  )
  .join("\n")}

Select the 3 most relevant articles for readers of the current article. Consider:
- Topic similarity
- Learning progression
- Tag overlap
- Content type relevance

Return only the article titles separated by commas.`;

    try {
      const result = await this.genAI.models.generateContent({
        model: this.modelName,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      const response =
        result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "No recommendations generated";
      const recommendations = response
        .split(",")
        .map((r: string) => r.trim())
        .slice(0, 3);

      this.cache.set(cacheKey, {
        response: response,
        recommendations,
        timestamp: Date.now(),
        apiCallsUsed: 1,
      });
      return recommendations;
    } catch (error) {
      console.warn("Gemini API error, using fallback:", error);
      return this.generateFallbackRecommendations(request);
    }
  }

  async generateKeywords(content: string, title: string): Promise<string[]> {
    const cacheKey = `keywords_${title.substring(0, 50)}_${content.substring(0, 100)}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!.recommendations!;
    }

    await this.rateLimiter.checkLimit();

    const prompt = `Extract 5-8 relevant keywords for this Japanese language learning content:

Title: ${title}
Content: ${content.substring(0, 500)}...

Requirements:
- Focus on Japanese learning terms
- Include both Indonesian and Japanese keywords
- Prioritize educational and immersion-related terms
- Consider search intent and user queries

Keywords (comma-separated):`;

    try {
      const result = await this.genAI.models.generateContent({
        model: this.modelName,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      const response =
        result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "No keywords generated";
      const keywords = response
        .split(",")
        .map((k: string) => k.trim())
        .slice(0, 8);

      this.cache.set(cacheKey, {
        response: response,
        recommendations: keywords,
        timestamp: Date.now(),
        apiCallsUsed: 1,
      });
      return keywords;
    } catch (error) {
      console.warn("Gemini API error, using fallback keywords:", error);
      return this.generateFallbackKeywords(content, title);
    }
  }

  private generateFallbackMetaDescription(
    request: MetaDescriptionRequest,
  ): string {
    const words = request.title.split(" ").slice(0, 8);
    const baseDescription = `${words.join(" ")} - Belajar bahasa Jepang dengan metode immersion yang terbukti efektif.`;

    if (request.language === "ja") {
      return `${words.join(" ")} - イマージョン法による効果的な日本語学習。`;
    }

    return baseDescription;
  }

  private generateFallbackRecommendations(
    request: ContentRecommendationRequest,
  ): string[] {
    return request.availablePosts
      .filter((post) => post.id !== request.currentPost.id)
      .slice(0, 3)
      .map((post) => post.title);
  }

  private generateFallbackKeywords(content: string, title: string): string[] {
    const baseKeywords = [
      "belajar bahasa jepang",
      "immersion",
      "日本語学習",
      "イマージョン",
    ];
    const contentKeywords = content.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const titleKeywords = title.toLowerCase().match(/\b\w{4,}\b/g) || [];

    const allKeywords = [...baseKeywords, ...contentKeywords, ...titleKeywords];
    const uniqueKeywords = Array.from(new Set(allKeywords));

    return uniqueKeywords.slice(0, 8);
  }

  getRateLimitStats() {
    return this.rateLimiter.getUsageStats();
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheSize() {
    return this.cache.size;
  }
}
