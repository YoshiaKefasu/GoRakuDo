import { EnvironmentManager } from "./environment";
import { DataPersistence } from "./data-persistence";
import { FileDetector } from "./file-detector";
import { AISystem } from "./index";
import type { AIProcessingResult } from "./types";
import { logger } from "../logging/console-logger";

export class SmartProcessor {
  private environment: EnvironmentManager;
  private dataPersistence: DataPersistence;
  private fileDetector: FileDetector;
  private aiSystem: AISystem | null = null;

  constructor() {
    this.environment = EnvironmentManager.getInstance();
    this.dataPersistence = new DataPersistence();
    this.fileDetector = new FileDetector();
  }

  async processContent(
    title: string,
    content: string,
    availablePosts: any[],
    language: "id" | "ja" = "id",
  ): Promise<AIProcessingResult | null> {
    logger.log(`Processing content: "${title}"`);

    // Check if we should process with AI
    if (!this.environment.isAIAvailable()) {
      logger.log("AI processing disabled - loading existing data", "warning");
      return await this.loadExistingData(title);
    }

    // Check if data file exists
    const fileExists = await this.fileDetector.checkDataFileExists(title);

    if (fileExists) {
      // Validate existing data
      const isValid = await this.fileDetector.validateDataFile(title);

      if (isValid) {
        logger.log("Using existing valid data file", "success");
        return await this.loadExistingData(title);
      } else {
        logger.log("Existing data file is invalid, regenerating", "warning");
      }
    }

    // Process with AI
    return await this.processWithAI(title, content, availablePosts, language);
  }

  async processAllContent(
    availablePosts: any[],
    language: "id" | "ja" = "id",
  ): Promise<void> {
    logger.startGroup(`Batch Content Processing`);
    logger.log(`Processing all content (${availablePosts.length} posts)`);

    if (!this.environment.isAIAvailable()) {
      logger.log(
        "AI processing disabled - skipping batch processing",
        "warning",
      );
      logger.endGroup();
      return;
    }

    const processedFiles = await this.fileDetector.listProcessedFiles();
    const processedTitles = processedFiles.map((file) =>
      file.replace("-ai-data.json", "").replace(/-/g, " "),
    );

    const unprocessedPosts = availablePosts.filter(
      (post) => !processedTitles.includes(post.title.toLowerCase()),
    );

    logger.log(`Found ${unprocessedPosts.length} unprocessed posts`);

    for (const post of unprocessedPosts) {
      try {
        await this.processContent(
          post.title,
          post.content || post.description || "",
          availablePosts,
          language,
        );
        logger.log(`Processed: ${post.title}`, "success");
      } catch (error) {
        logger.log(`Failed to process "${post.title}": ${error}`, "error");
      }
    }

    // Cleanup invalid files
    await this.fileDetector.cleanupInvalidFiles();
    logger.endGroup();
  }

  async validateAllData(): Promise<void> {
    logger.startGroup(`Data Validation`);
    logger.log("Validating all AI-generated data");

    const processedFiles = await this.fileDetector.listProcessedFiles();
    let validCount = 0;
    let invalidCount = 0;

    for (const file of processedFiles) {
      const title = file.replace("-ai-data.json", "").replace(/-/g, " ");
      const isValid = await this.fileDetector.validateDataFile(title);

      if (isValid) {
        validCount++;
      } else {
        invalidCount++;
        logger.log(`Invalid file: ${file}`, "warning");
      }
    }

    logger.logSummary("Validation Results", {
      "Valid files": validCount,
      "Invalid files": invalidCount,
      "Total files": processedFiles.length,
    });
    logger.endGroup();
  }

  async getProcessingStats(): Promise<{
    totalFiles: number;
    validFiles: number;
    invalidFiles: number;
    lastUpdated: string;
  }> {
    const processedFiles = await this.fileDetector.listProcessedFiles();
    let validCount = 0;

    for (const file of processedFiles) {
      const title = file.replace("-ai-data.json", "").replace(/-/g, " ");
      const isValid = await this.fileDetector.validateDataFile(title);
      if (isValid) validCount++;
    }

    const lastFile = processedFiles[processedFiles.length - 1];
    let lastUpdated = "Never";

    if (lastFile) {
      const fileInfo = await this.fileDetector.getDataFileInfo(
        lastFile.replace("-ai-data.json", "").replace(/-/g, " "),
      );
      if (fileInfo) {
        lastUpdated = fileInfo.modTime;
      }
    }

    return {
      totalFiles: processedFiles.length,
      validFiles: validCount,
      invalidFiles: processedFiles.length - validCount,
      lastUpdated,
    };
  }

  private async loadExistingData(
    title: string,
  ): Promise<AIProcessingResult | null> {
    try {
      const data = await this.dataPersistence.loadProcessedData(title);
      if (data) {
        logger.log("Loaded existing data successfully", "success");
        return data;
      }
    } catch (error) {
      logger.log(`Failed to load existing data: ${error}`, "warning");
    }

    return null;
  }

  private async processWithAI(
    title: string,
    content: string,
    availablePosts: any[],
    language: "id" | "ja",
  ): Promise<AIProcessingResult | null> {
    try {
      // Initialize AI system if needed
      if (!this.aiSystem) {
        // AI processing disabled for security
        this.aiSystem = new AISystem();
      }

      logger.log("Processing with AI system...");
      const result = await this.aiSystem.processContent(
        title,
        content,
        availablePosts,
        language,
      );

      if (result) {
        // Save the processed data
        await this.dataPersistence.saveProcessedData(title, content, result);
        logger.log("Saved processed data successfully", "success");
      }

      return result;
    } catch (error) {
      logger.log(`AI processing failed: ${error}`, "error");
      return null;
    }
  }
}
