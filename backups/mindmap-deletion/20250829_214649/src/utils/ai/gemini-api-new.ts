import { GoogleGenAI } from "@google/genai";
import { RateLimiter } from "./rate-limiter";
import { nodeEnvSetup } from "./node-env-setup";
import type {
  GoogleGenAIConfig,
  AIResponse,
  MetaDescriptionRequest,
  ContentRecommendationRequest,
} from "./types";

export class GeminiAIServiceNew {
  private ai: GoogleGenAI | null = null;
  private rateLimiter: RateLimiter;
  private cache: Map<string, AIResponse>;
  private config: GoogleGenAIConfig;

  constructor(config: GoogleGenAIConfig) {
    this.config = config;
    this.rateLimiter = new RateLimiter(
      config.rateLimitRPD,
      config.rateLimitRPM,
    );
    this.cache = new Map();
  }

  async initialize(): Promise<void> {
    try {
      this.ai = await nodeEnvSetup.initializeAI();
      console.log("✅ Google GenAI Service initialized with new package");
    } catch (error) {
      console.error("❌ Failed to initialize Google GenAI Service:", error);
      throw error;
    }
  }

  async generateMetaDescription(
    request: MetaDescriptionRequest,
  ): Promise<string> {
    const cacheKey = `meta_${request.title}_${request.language}`;

    if (this.cache.has(cacheKey)) {
      console.log("📋 Using cached meta description");
      return this.cache.get(cacheKey)!.response;
    }

    await this.rateLimiter.checkLimit();

    const prompt = this.buildMetaDescriptionPrompt(request);

    try {
      const response = await this.ai!.models.generateContent({
        model: this.config.model,
        contents: prompt,
        config: {
          temperature: 0.7,
          maxOutputTokens: 200,
          topP: 0.8,
          topK: 40,
        },
      });

      const result =
        response.text || this.generateFallbackMetaDescription(request);

      this.cache.set(cacheKey, {
        response: result,
        timestamp: Date.now(),
        apiCallsUsed: 1,
      });

      return result;
    } catch (error) {
      console.error("❌ Meta description generation failed:", error);
      return this.generateFallbackMetaDescription(request);
    }
  }

  async generateContentRecommendations(
    request: ContentRecommendationRequest,
  ): Promise<string[]> {
    const cacheKey = `rec_${request.currentPost.id}`;

    if (this.cache.has(cacheKey)) {
      console.log("📋 Using cached content recommendations");
      return JSON.parse(this.cache.get(cacheKey)!.response);
    }

    await this.rateLimiter.checkLimit();

    const prompt = this.buildRecommendationsPrompt(request);

    try {
      const response = await this.ai!.models.generateContent({
        model: this.config.model,
        contents: prompt,
        config: {
          temperature: 0.8,
          maxOutputTokens: 500,
          topP: 0.9,
          topK: 50,
        },
      });

      const result = this.parseRecommendationsResponse(response.text || "");

      this.cache.set(cacheKey, {
        response: JSON.stringify(result),
        timestamp: Date.now(),
        apiCallsUsed: 1,
      });

      return result;
    } catch (error) {
      console.error("❌ Content recommendations generation failed:", error);
      return this.generateFallbackRecommendations(request);
    }
  }

  async generateKeywords(content: string, title: string): Promise<string[]> {
    const cacheKey = `keywords_${title}`;

    if (this.cache.has(cacheKey)) {
      console.log("📋 Using cached keywords");
      return JSON.parse(this.cache.get(cacheKey)!.response);
    }

    await this.rateLimiter.checkLimit();

    const prompt = `Write 5-8 relevant keywords from this content for 2025 SEO purposes. Return only the keywords as a JSON array of strings.

Title: ${title}
Content: ${content.substring(0, 1000)}...`;

    try {
      const response = await this.ai!.models.generateContent({
        model: this.config.model,
        contents: prompt,
        config: {
          temperature: 0.3,
          maxOutputTokens: 200,
          topP: 0.7,
          topK: 30,
        },
      });

      const result = this.parseKeywordsResponse(response.text || "");

      this.cache.set(cacheKey, {
        response: JSON.stringify(result),
        timestamp: Date.now(),
        apiCallsUsed: 1,
      });

      return result;
    } catch (error) {
      console.error("❌ Keywords generation failed:", error);
      return this.generateFallbackKeywords(content, title);
    }
  }

  private buildMetaDescriptionPrompt(request: MetaDescriptionRequest): string {
    const language = request.language === "ja" ? "Japanese" : "Indonesian";

    return `Write an SEO-optimized 2025 meta description in ${language} for this content. 
Requirements:
- Length: 150-160 characters
- Include relevant keywords naturally
- Include a call-to-action
- Be engaging and descriptive
- Language: ${language}

Title: ${request.title}
Keywords: ${request.keywords.join(", ")}
Content: ${request.content.substring(0, 500)}...

Meta Description:`;
  }

  private buildRecommendationsPrompt(
    request: ContentRecommendationRequest,
  ): string {
    const availablePosts = request.availablePosts
      .map((post) => `- ${post.title}: ${post.description}`)
      .join("\n");

    return `Based on the current post, recommend 3 related articles from the available posts. 
Consider relevance, topic similarity, and user interest.

Current Post:
Title: ${request.currentPost.title}
Tags: ${request.currentPost.tags.join(", ")}

Available Posts:
${availablePosts}

Return only the titles of the 3 most relevant posts as a JSON array of strings.`;
  }

  private parseRecommendationsResponse(response: string): string[] {
    try {
      // Try to extract JSON array from response
      const jsonMatch = response.match(/\[.*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback: extract titles from text
      const titles = response
        .split("\n")
        .filter(
          (line) => line.trim().startsWith("-") || line.trim().startsWith("*"),
        )
        .map((line) => line.replace(/^[-*]\s*/, "").trim())
        .filter((title) => title.length > 0)
        .slice(0, 3);

      return titles;
    } catch (error) {
      console.warn("⚠️ Failed to parse recommendations response:", error);
      return [];
    }
  }

  private parseKeywordsResponse(response: string): string[] {
    try {
      // Try to extract JSON array from response
      const jsonMatch = response.match(/\[.*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback: extract keywords from text
      const keywords = response
        .split(/[,\n]/)
        .map((keyword) => keyword.trim().replace(/["\[\]]/g, ""))
        .filter((keyword) => keyword.length > 0 && keyword.length < 50)
        .slice(0, 8);

      return keywords;
    } catch (error) {
      console.warn("⚠️ Failed to parse keywords response:", error);
      return [];
    }
  }

  private generateFallbackMetaDescription(
    request: MetaDescriptionRequest,
  ): string {
    const excerpt = request.content.substring(0, 120);
    const language =
      request.language === "ja"
        ? "イマージョン法による日本語学習。"
        : "Belajar bahasa Jepang dengan metode immersion.";

    return `${request.title} - ${excerpt} ${language}`;
  }

  private generateFallbackRecommendations(
    request: ContentRecommendationRequest,
  ): string[] {
    return request.availablePosts.slice(0, 3).map((post) => post.title);
  }

  private generateFallbackKeywords(content: string, title: string): string[] {
    const words = `${title} ${content}`
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 3)
      .filter(
        (word) =>
          ![
            "yang",
            "dengan",
            "untuk",
            "dari",
            "pada",
            "oleh",
            "sebagai",
            "dalam",
            "ke",
            "di",
            "dan",
            "atau",
            "tapi",
            "jika",
            "karena",
            "ketika",
            "sebelum",
            "sesudah",
            "sambil",
            "sementara",
          ].includes(word),
      );

    return Array.from(new Set(words)).slice(0, 8);
  }

  getRateLimitStats() {
    return this.rateLimiter.getUsageStats();
  }

  clearCache() {
    this.cache.clear();
    console.log("🗑️ AI service cache cleared");
  }

  getCacheSize() {
    return this.cache.size;
  }
}
