// Optimized Build Processor Utility
// Provides optimized build processing capabilities for AI content generation
// Handles build-time content analysis and optimization

import type { CollectionEntry } from "astro:content";

// Build processing statistics interface
export interface BuildProcessingStats {
  totalPosts: number;
  processedPosts: number;
  skippedPosts: number;
  errors: string[];
  warnings: string[];
  processingTime: number;
  memoryUsage: number;
  startTime: number;
}

// Optimized Build Processor Class
export class OptimizedBuildProcessor {
  private stats: BuildProcessingStats;
  private startTime: number;

  constructor() {
    this.stats = {
      totalPosts: 0,
      processedPosts: 0,
      skippedPosts: 0,
      errors: [],
      warnings: [],
      processingTime: 0,
      memoryUsage: 0,
      startTime: 0,
    };
    this.startTime = Date.now();
  }

  /**
   * Check if optimized processing should be enabled
   * Based on environment and content size
   */
  static shouldEnableOptimizedProcessing(): boolean {
    // Enable in production builds
    if (process.env.NODE_ENV === "production") {
      return true;
    }

    // Enable if content size is large
    if (process.env.CONTENT_SIZE === "large") {
      return true;
    }

    // Enable if explicitly requested
    if (process.env.ENABLE_OPTIMIZED_PROCESSING === "true") {
      return true;
    }

    return false;
  }

  /**
   * Process posts with optimization
   */
  async processPosts(
    posts: CollectionEntry<"blog">[],
  ): Promise<CollectionEntry<"blog">[]> {
    this.stats.totalPosts = posts.length;
    this.stats.startTime = Date.now();

    try {
      const processedPosts = await Promise.all(
        posts.map(async (post) => {
          try {
            const processedPost = await this.processSinglePost(post);
            this.stats.processedPosts++;
            return processedPost;
          } catch (error) {
            this.stats.errors.push(
              `Error processing post ${post.id}: ${error}`,
            );
            this.stats.skippedPosts++;
            return post; // Return original post on error
          }
        }),
      );

      this.stats.processingTime = Date.now() - this.startTime;
      this.stats.memoryUsage = this.getMemoryUsage();

      return processedPosts;
    } catch (error) {
      this.stats.errors.push(`Build processing failed: ${error}`);
      throw error;
    }
  }

  /**
   * Process a single post with optimization
   */
  private async processSinglePost(
    post: CollectionEntry<"blog">,
  ): Promise<CollectionEntry<"blog">> {
    // Basic optimization: validate and enhance metadata
    const enhancedPost = {
      ...post,
      data: {
        ...post.data,
        // Ensure required fields are present
        title: post.data.title || "Untitled",
        description: post.data.description || "",
        publishedDate: post.data.publishedDate || new Date().toISOString(),
        author: post.data.author || "Tim GoRakuDo",
      },
    };

    // Add warnings for missing optional fields
    if (!post.data.emoji) {
      this.stats.warnings.push(`Post ${post.id} missing emoji`);
    }

    if (!post.data.tags || post.data.tags.length === 0) {
      this.stats.warnings.push(`Post ${post.id} missing tags`);
    }

    return enhancedPost;
  }

  /**
   * Get current memory usage
   */
  private getMemoryUsage(): number {
    if (typeof process !== "undefined" && process.memoryUsage) {
      return process.memoryUsage().heapUsed / 1024 / 1024; // MB
    }
    return 0;
  }

  /**
   * Get processing statistics
   */
  getStats(): BuildProcessingStats {
    return { ...this.stats };
  }

  /**
   * Reset processor state
   */
  reset(): void {
    this.stats = {
      totalPosts: 0,
      processedPosts: 0,
      skippedPosts: 0,
      errors: [],
      warnings: [],
      processingTime: 0,
      memoryUsage: 0,
      startTime: 0,
    };
    this.startTime = Date.now();
  }
}

/**
 * Run optimized build processing
 * Convenience function for processing posts with optimization
 */
export async function runOptimizedBuildProcessing(
  posts: CollectionEntry<"blog">[],
): Promise<{ posts: CollectionEntry<"blog">[]; stats: BuildProcessingStats }> {
  const processor = new OptimizedBuildProcessor();
  const processedPosts = await processor.processPosts(posts);
  const stats = processor.getStats();

  return { posts: processedPosts, stats };
}

/**
 * Check if optimized processing should be enabled
 * Static utility function
 */
export function shouldEnableOptimizedProcessing(): boolean {
  return OptimizedBuildProcessor.shouldEnableOptimizedProcessing();
}
