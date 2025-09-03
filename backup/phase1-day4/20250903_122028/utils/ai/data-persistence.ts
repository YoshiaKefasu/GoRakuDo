import * as fs from "fs/promises";
import * as path from "path";
import type { AIProcessingResult } from "./types";
import { ContentTracker } from "./content-tracker";

export class DataPersistence {
  private dataDir: string;
  private contentTracker: ContentTracker;

  constructor() {
    this.dataDir = path.join(process.cwd(), "src", "data", "ai-generated");
    this.contentTracker = new ContentTracker();
  }

  async saveProcessedData(
    title: string,
    content: string,
    data: AIProcessingResult,
  ): Promise<void> {
    try {
      await this.ensureDataDirectory();

      const filename = this.generateFilename(title);
      const filepath = path.join(this.dataDir, filename);
      const contentId = this.contentTracker.generateContentId({ title });
      const checksum = this.contentTracker.generateChecksum(content);

      const dataToSave = {
        ...data,
        title,
        contentId,
        checksum,
        savedAt: new Date().toISOString(),
        version: "1.0",
      };

      await fs.writeFile(filepath, JSON.stringify(dataToSave, null, 2));

      // Update content manifest
      await this.contentTracker.markContentAsProcessed(
        contentId,
        title,
        filename,
        checksum,
      );

      console.log(`💾 Saved AI data to: ${filepath}`);
    } catch (error) {
      console.error("❌ Failed to save AI data:", error);
    }
  }

  async loadProcessedData(title: string): Promise<AIProcessingResult | null> {
    try {
      const filename = this.generateFilename(title);
      const filepath = path.join(this.dataDir, filename);

      const data = await fs.readFile(filepath, "utf-8");
      const parsed = JSON.parse(data);

      // Validate data structure
      if (this.isValidAIProcessingResult(parsed)) {
        return parsed;
      }

      console.warn("⚠️ Invalid data structure in pre-processed file");
      return null;
    } catch (error) {
      return null; // File doesn't exist or can't be read
    }
  }

  async getUnprocessedContent(availablePosts: any[]): Promise<any[]> {
    return await this.contentTracker.getUnprocessedContent(availablePosts);
  }

  async isContentProcessed(contentId: string): Promise<boolean> {
    return await this.contentTracker.isContentProcessed(contentId);
  }

  async hasContentChanged(
    contentId: string,
    content: string,
  ): Promise<boolean> {
    return await this.contentTracker.hasContentChanged(contentId, content);
  }

  async validateAllContent(): Promise<void> {
    await this.contentTracker.validateProcessedContent();
  }

  async cleanupOldData(): Promise<void> {
    try {
      const files = await fs.readdir(this.dataDir);
      const now = Date.now();
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

      for (const file of files) {
        if (file === "manifest.json" || file === ".gitkeep") continue;

        const filepath = path.join(this.dataDir, file);
        const stats = await fs.stat(filepath);

        if (now - stats.mtime.getTime() > maxAge) {
          await fs.unlink(filepath);
          console.log(`🗑️ Cleaned up old data file: ${file}`);
        }
      }

      // Validate manifest after cleanup
      await this.validateAllContent();
    } catch (error) {
      console.warn("⚠️ Failed to cleanup old data:", error);
    }
  }

  private async ensureDataDirectory(): Promise<void> {
    try {
      await fs.access(this.dataDir);
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true });
    }
  }

  private generateFilename(title: string): string {
    const sanitized = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50);

    return `${sanitized}-ai-data.json`;
  }

  private isValidAIProcessingResult(data: any): data is AIProcessingResult {
    return (
      data &&
      typeof data.metaDescription === "object" &&
      typeof data.recommendations === "object" &&
      Array.isArray(data.keywords) &&
      typeof data.seoScore === "number"
    );
  }

  getDataDirectory(): string {
    return this.dataDir;
  }

  getManifestStats() {
    return this.contentTracker.getManifestStats();
  }
}
