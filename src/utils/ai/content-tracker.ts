import * as fs from "fs/promises";
import * as path from "path";
import type { AIProcessingResult } from "./types";

export interface ContentManifest {
  version: string;
  lastUpdated: string;
  processedContent: {
    [contentId: string]: {
      title: string;
      processedAt: string;
      dataFile: string;
      checksum: string;
      version: string;
    };
  };
}

export class ContentTracker {
  private manifestPath: string;
  private manifest: ContentManifest;

  constructor() {
    this.manifestPath = path.join(
      process.cwd(),
      "src",
      "data",
      "ai-generated",
      "manifest.json",
    );
    this.manifest = this.getDefaultManifest();
  }

  async loadManifest(): Promise<ContentManifest> {
    try {
      const data = await fs.readFile(this.manifestPath, "utf-8");
      this.manifest = JSON.parse(data);
      console.log(
        `📋 Loaded content manifest with ${Object.keys(this.manifest.processedContent).length} entries`,
      );
      return this.manifest;
    } catch (error) {
      console.log("📋 No existing manifest found, creating new one");
      await this.saveManifest();
      return this.manifest;
    }
  }

  async saveManifest(): Promise<void> {
    try {
      await fs.mkdir(path.dirname(this.manifestPath), { recursive: true });
      await fs.writeFile(
        this.manifestPath,
        JSON.stringify(this.manifest, null, 2),
      );
      console.log("💾 Content manifest saved");
    } catch (error) {
      console.error("❌ Failed to save content manifest:", error);
    }
  }

  async isContentProcessed(contentId: string): Promise<boolean> {
    await this.loadManifest();
    return !!this.manifest.processedContent[contentId];
  }

  async markContentAsProcessed(
    contentId: string,
    title: string,
    dataFile: string,
    checksum: string,
  ): Promise<void> {
    this.manifest.processedContent[contentId] = {
      title,
      processedAt: new Date().toISOString(),
      dataFile,
      checksum,
      version: "1.0",
    };
    this.manifest.lastUpdated = new Date().toISOString();
    await this.saveManifest();
    console.log(`✅ Marked content as processed: ${title}`);
  }

  async getUnprocessedContent(availablePosts: any[]): Promise<any[]> {
    await this.loadManifest();
    const unprocessed: any[] = [];

    for (const post of availablePosts) {
      const contentId = this.generateContentId(post);
      if (!this.manifest.processedContent[contentId]) {
        unprocessed.push(post);
      }
    }

    console.log(
      `🔍 Found ${unprocessed.length} unprocessed posts out of ${availablePosts.length} total`,
    );
    return unprocessed;
  }

  async validateProcessedContent(): Promise<void> {
    await this.loadManifest();
    const invalidEntries: string[] = [];

    for (const [contentId, entry] of Object.entries(
      this.manifest.processedContent,
    )) {
      const dataFilePath = path.join(
        process.cwd(),
        "src",
        "data",
        "ai-generated",
        entry.dataFile,
      );
      try {
        await fs.access(dataFilePath);
      } catch {
        invalidEntries.push(contentId);
        console.warn(`⚠️ Data file missing for: ${entry.title}`);
      }
    }

    // Remove invalid entries
    for (const contentId of invalidEntries) {
      delete this.manifest.processedContent[contentId];
    }

    if (invalidEntries.length > 0) {
      this.manifest.lastUpdated = new Date().toISOString();
      await this.saveManifest();
      console.log(
        `🧹 Cleaned up ${invalidEntries.length} invalid manifest entries`,
      );
    }
  }

  generateContentId(post: any): string {
    const title = post.title || post.slug || "unknown";
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  generateChecksum(content: string): string {
    // Simple checksum for content changes detection
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  async hasContentChanged(
    contentId: string,
    content: string,
  ): Promise<boolean> {
    await this.loadManifest();
    const entry = this.manifest.processedContent[contentId];
    if (!entry) return true; // New content

    const currentChecksum = this.generateChecksum(content);
    return entry.checksum !== currentChecksum;
  }

  getManifestStats(): { total: number; lastUpdated: string } {
    return {
      total: Object.keys(this.manifest.processedContent).length,
      lastUpdated: this.manifest.lastUpdated,
    };
  }

  private getDefaultManifest(): ContentManifest {
    return {
      version: "1.0",
      lastUpdated: new Date().toISOString(),
      processedContent: {},
    };
  }
}
