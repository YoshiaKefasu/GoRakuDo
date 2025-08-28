import { EnvironmentManager } from "./environment";
import { DataPersistence } from "./data-persistence";
import { AISystem } from "./ai-system";
import type { AIProcessingResult } from "./types";
import { logger } from "../logging/console-logger";

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
    logger.log(`Build Processor: ${envInfo}`);

    if (!this.environment.isAIAvailable()) {
      logger.log("Loading pre-processed data for production build", "info");
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
      logger.log(`Content already processed and unchanged: ${title}`, "info");
      return await this.loadPreProcessedData(title);
    }

    if (hasChanged) {
      logger.log(`Content changed, regenerating AI data: ${title}`, "warning");
    } else {
      logger.log(`New content detected, processing with AI: ${title}`, "info");
    }

    logger.log("Processing content with AI for development build");
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

      logger.log(
        `AI processing completed and data saved for: ${title}`,
        "success",
      );
      return result;
    } catch (error) {
      logger.log(`AI processing failed: ${error}`, "error");
      return await this.loadPreProcessedData(title);
    }
  }

  private async loadPreProcessedData(
    title: string,
  ): Promise<AIProcessingResult | null> {
    try {
      const data = await this.dataPersistence.loadProcessedData(title);
      if (data) {
        logger.log(`Loaded pre-processed data for: ${title}`, "success");
        return data;
      }
    } catch (error) {
      logger.log(`Failed to load pre-processed data: ${error}`, "warning");
    }

    // Return fallback data if no pre-processed data available
    return this.generateFallbackData(title);
  }

  private generateFallbackData(title: string): AIProcessingResult {
    logger.log(`Generating fallback data for: ${title}`, "warning");

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
      logger.log("AI not available, skipping content processing", "warning");
      return;
    }

    const unprocessed =
      await this.dataPersistence.getUnprocessedContent(availablePosts);

    if (unprocessed.length === 0) {
      logger.log("All content already processed", "success");
      return;
    }

    logger.startGroup(`Batch Content Processing`);
    logger.log(`Processing ${unprocessed.length} unprocessed posts...`);

    for (const post of unprocessed) {
      try {
        await this.processContentForBuild(
          post.title,
          post.body || post.content || "",
          availablePosts,
          language,
        );
        logger.log(`Processed: ${post.title}`, "success");
      } catch (error) {
        logger.log(`Failed to process: ${post.title} - ${error}`, "error");
      }
    }

    logger.endGroup();
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
