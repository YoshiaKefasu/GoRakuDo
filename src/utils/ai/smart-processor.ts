import { EnvironmentManager } from "./environment";
import { DataPersistence } from "./data-persistence";
import { FileDetector } from "./file-detector";
import { AISystem } from "./index";
import type { AIProcessingResult } from "./types";

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
    console.log(`🤖 Processing content: "${title}"`);

    // Check if we should process with AI
    if (!this.environment.isAIAvailable()) {
      console.log("🔒 AI processing disabled - loading existing data");
      return await this.loadExistingData(title);
    }

    // Check if data file exists
    const fileExists = await this.fileDetector.checkDataFileExists(title);

    if (fileExists) {
      // Validate existing data
      const isValid = await this.fileDetector.validateDataFile(title);

      if (isValid) {
        console.log("✅ Using existing valid data file");
        return await this.loadExistingData(title);
      } else {
        console.log("⚠️ Existing data file is invalid, regenerating");
      }
    }

    // Process with AI
    return await this.processWithAI(title, content, availablePosts, language);
  }

  async processAllContent(
    availablePosts: any[],
    language: "id" | "ja" = "id",
  ): Promise<void> {
    console.log(`🚀 Processing all content (${availablePosts.length} posts)`);

    if (!this.environment.isAIAvailable()) {
      console.log("🔒 AI processing disabled - skipping batch processing");
      return;
    }

    const processedFiles = await this.fileDetector.listProcessedFiles();
    const processedTitles = processedFiles.map((file) =>
      file.replace("-ai-data.json", "").replace(/-/g, " "),
    );

    const unprocessedPosts = availablePosts.filter(
      (post) => !processedTitles.includes(post.title.toLowerCase()),
    );

    console.log(`📊 Found ${unprocessedPosts.length} unprocessed posts`);

    for (const post of unprocessedPosts) {
      try {
        await this.processContent(
          post.title,
          post.content || post.description || "",
          availablePosts,
          language,
        );
        console.log(`✅ Processed: ${post.title}`);
      } catch (error) {
        console.error(`❌ Failed to process "${post.title}":`, error);
      }
    }

    // Cleanup invalid files
    await this.fileDetector.cleanupInvalidFiles();
  }

  async validateAllData(): Promise<void> {
    console.log("🔍 Validating all AI-generated data");

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
        console.log(`⚠️ Invalid file: ${file}`);
      }
    }

    console.log(
      `📊 Validation complete: ${validCount} valid, ${invalidCount} invalid files`,
    );
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
        console.log("📁 Loaded existing data successfully");
        return data;
      }
    } catch (error) {
      console.warn("⚠️ Failed to load existing data:", error);
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
        const geminiConfig = this.environment.getGeminiConfig();
        if (!geminiConfig.apiKey) {
          throw new Error("No Gemini API key available");
        }
        this.aiSystem = new AISystem({
          ...geminiConfig,
          apiKey: geminiConfig.apiKey,
        });
      }

      console.log("🤖 Processing with Gemini AI...");
      const result = await this.aiSystem.processContent(
        title,
        content,
        availablePosts,
        language,
      );

      if (result) {
        // Save the processed data
        await this.dataPersistence.saveProcessedData(title, content, result);
        console.log("💾 Saved processed data successfully");
      }

      return result;
    } catch (error) {
      console.error("❌ AI processing failed:", error);
      return null;
    }
  }
}
