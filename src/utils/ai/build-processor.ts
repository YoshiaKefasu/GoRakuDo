import { EnvironmentManager } from "./environment";
import { DataPersistence } from "./data-persistence";
import { AISystem } from "./ai-system";
import type { AIProcessingResult } from "./types";

export class BuildProcessor {
  private environment: EnvironmentManager;
  private dataPersistence: DataPersistence;

  constructor() {
    this.environment = EnvironmentManager.getInstance();
    this.dataPersistence = new DataPersistence();
  }

  async processContentForBuild(
    title: string,
    content: string,
    availablePosts: any[],
    language: "id" | "ja" = "id",
  ): Promise<AIProcessingResult | null> {
    const envInfo = this.environment.getEnvironmentInfo();
    console.log(`🔧 Build Processor: ${envInfo}`);

    if (!this.environment.isAIAvailable()) {
      console.log("📁 Loading pre-processed data for production build");
      return await this.loadPreProcessedData(title);
    }

    // Smart content detection
    const contentId = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    const isProcessed =
      await this.dataPersistence.isContentProcessed(contentId);
    const hasChanged = await this.dataPersistence.hasContentChanged(
      contentId,
      content,
    );

    if (isProcessed && !hasChanged) {
      console.log(`📁 Content already processed and unchanged: ${title}`);
      return await this.loadPreProcessedData(title);
    }

    if (hasChanged) {
      console.log(`🔄 Content changed, regenerating AI data: ${title}`);
    } else {
      console.log(`🆕 New content detected, processing with AI: ${title}`);
    }

    console.log("🤖 Processing content with AI for development build");
    return await this.processWithAI(title, content, availablePosts, language);
  }

  private async processWithAI(
    title: string,
    content: string,
    availablePosts: any[],
    language: "id" | "ja",
  ): Promise<AIProcessingResult | null> {
    try {
      const geminiConfig = this.environment.getGeminiConfig();
      if (!geminiConfig.apiKey) {
        throw new Error("No API key available for AI processing");
      }
      const aiSystem = new AISystem({
        ...geminiConfig,
        apiKey: geminiConfig.apiKey,
      });

      const result = await aiSystem.processContent(
        title,
        content,
        availablePosts,
        language,
      );

      // Save processed data for production builds
      await this.dataPersistence.saveProcessedData(title, content, result);

      console.log(`✅ AI processing completed and data saved for: ${title}`);
      return result;
    } catch (error) {
      console.error("❌ AI processing failed:", error);
      return await this.loadPreProcessedData(title);
    }
  }

  private async loadPreProcessedData(
    title: string,
  ): Promise<AIProcessingResult | null> {
    try {
      const data = await this.dataPersistence.loadProcessedData(title);
      if (data) {
        console.log(`📁 Loaded pre-processed data for: ${title}`);
        return data;
      }
    } catch (error) {
      console.warn("⚠️ Failed to load pre-processed data:", error);
    }

    // Return fallback data if no pre-processed data available
    return this.generateFallbackData(title);
  }

  private generateFallbackData(title: string): AIProcessingResult {
    console.log(`🔄 Generating fallback data for: ${title}`);

    return {
      metaDescription: {
        description: `${title} - Belajar bahasa Jepang dengan metode immersion yang terbukti efektif.`,
        length: 85,
        hasKeywords: true,
        hasCTA: true,
        language: "id",
        generatedAt: new Date().toISOString(),
      },
      recommendations: [],
      keywords: ["belajar", "bahasa", "jepang", "immersion"],
      seoScore: 75,
      processingTime: 0,
      apiCallsUsed: 0,
    };
  }

  async processAllUnprocessedContent(
    availablePosts: any[],
    language: "id" | "ja" = "id",
  ): Promise<void> {
    if (!this.environment.isAIAvailable()) {
      console.log("🔒 AI not available, skipping content processing");
      return;
    }

    const unprocessed =
      await this.dataPersistence.getUnprocessedContent(availablePosts);

    if (unprocessed.length === 0) {
      console.log("✅ All content already processed");
      return;
    }

    console.log(`🔄 Processing ${unprocessed.length} unprocessed posts...`);

    for (const post of unprocessed) {
      try {
        await this.processContentForBuild(
          post.title,
          post.body || post.content || "",
          availablePosts,
          language,
        );
        console.log(`✅ Processed: ${post.title}`);
      } catch (error) {
        console.error(`❌ Failed to process: ${post.title}`, error);
      }
    }
  }

  async cleanupOldData(): Promise<void> {
    if (this.environment.getConfig().isDevelopment) {
      await this.dataPersistence.cleanupOldData();
    }
  }

  async validateContent(): Promise<void> {
    await this.dataPersistence.validateAllContent();
  }

  getManifestStats() {
    return this.dataPersistence.getManifestStats();
  }
}
