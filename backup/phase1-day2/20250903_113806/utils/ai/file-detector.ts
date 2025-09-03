import * as fs from "fs/promises";
import * as path from "path";
import * as crypto from "crypto";

export interface FileInfo {
  path: string;
  contentHash: string;
  modTime: string;
  size: number;
}

export class FileDetector {
  private dataDir: string;

  constructor() {
    this.dataDir = path.join(process.cwd(), "src", "data", "ai-generated");
  }

  async checkDataFileExists(title: string): Promise<boolean> {
    try {
      const filename = this.generateFilename(title);
      const filepath = path.join(this.dataDir, filename);
      await fs.access(filepath);
      return true;
    } catch {
      return false;
    }
  }

  async getDataFileInfo(title: string): Promise<FileInfo | null> {
    try {
      const filename = this.generateFilename(title);
      const filepath = path.join(this.dataDir, filename);
      const stats = await fs.stat(filepath);
      const content = await fs.readFile(filepath, "utf-8");

      return {
        path: filepath,
        contentHash: this.generateContentHash(content),
        modTime: stats.mtime.toISOString(),
        size: stats.size,
      };
    } catch {
      return null;
    }
  }

  async validateDataFile(title: string): Promise<boolean> {
    try {
      const filename = this.generateFilename(title);
      const filepath = path.join(this.dataDir, filename);
      const content = await fs.readFile(filepath, "utf-8");
      const data = JSON.parse(content);

      // Validate data structure
      return this.isValidAIProcessingResult(data);
    } catch {
      return false;
    }
  }

  async listProcessedFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.dataDir);
      return files.filter(
        (file) =>
          file.endsWith("-ai-data.json") &&
          file !== "manifest.json" &&
          file !== ".gitkeep",
      );
    } catch {
      return [];
    }
  }

  async cleanupInvalidFiles(): Promise<void> {
    try {
      const files = await this.listProcessedFiles();
      const invalidFiles: string[] = [];

      for (const file of files) {
        const filepath = path.join(this.dataDir, file);
        const isValid = await this.validateDataFile(
          file.replace("-ai-data.json", ""),
        );

        if (!isValid) {
          invalidFiles.push(file);
          await fs.unlink(filepath);
          console.log(`🗑️ Cleaned up invalid file: ${file}`);
        }
      }

      if (invalidFiles.length > 0) {
        console.log(`🧹 Cleaned up ${invalidFiles.length} invalid files`);
      }
    } catch (error) {
      console.warn("⚠️ Failed to cleanup invalid files:", error);
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

  private generateContentHash(content: string): string {
    return crypto.createHash("sha256").update(content).digest("hex");
  }

  private isValidAIProcessingResult(data: any): boolean {
    return (
      data &&
      typeof data.metaDescription === "object" &&
      typeof data.recommendations === "object" &&
      Array.isArray(data.keywords) &&
      typeof data.seoScore === "number"
    );
  }
}
