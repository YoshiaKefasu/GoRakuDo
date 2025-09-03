// Optimized Post Processor Utility
// Provides optimized post processing capabilities for AI content generation
// Handles individual post analysis and enhancement

import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

// Import RelatedContent type for consistency
import type { RelatedContent } from "../../components/docs/ai-recommendations/types";
import { getRelatedContent } from "./semantic-relationships";
import { generateInternalLinks } from "./content-analysis";
import {
  convertWordsToInternalLinks,
  createWordToLinkConfig,
} from "./word-to-link-converter";
import { logger } from "../logging/console-logger";

// Post processing result interface
export interface PostProcessingResult {
  post: CollectionEntry<"docs">;
  enhanced: boolean;
  processingTime: number;
  errors: string[];
  warnings: string[];
  usedExistingMetadata: boolean;
  relatedContent: RelatedContent;
  internalLinks: Array<{
    slug: string;
    title: string;
    anchor?: string;
  }>;
  enhancedContent: string;
  metadata: {
    wordCount: number;
    readingTime: number;
    complexityScore: number;
    hasImages: boolean;
    hasCodeBlocks: boolean;
    hasLinks: boolean;
  };
}

// Optimized Post Processor Class
export class OptimizedPostProcessor {
  private processingTime: number = 0;
  private errors: string[] = [];
  private warnings: string[] = [];

  /**
   * Process a single post with optimization
   */
  async processPost(
    post: CollectionEntry<"docs">,
  ): Promise<PostProcessingResult> {
    const startTime = Date.now();
    this.reset();

    try {
      const enhancedPost = await this.enhancePost(post);
      const metadata = this.analyzePostMetadata(post);

      this.processingTime = Date.now() - startTime;

      return {
        post: enhancedPost,
        enhanced: true,
        processingTime: this.processingTime,
        errors: this.errors,
        warnings: this.warnings,
        usedExistingMetadata: false,
        relatedContent: await this.generateRelatedContent(enhancedPost),
        internalLinks: this.extractInternalLinks(enhancedPost),
        enhancedContent: enhancedPost.body || "",
        metadata,
      };
    } catch (error) {
      this.errors.push(`Post processing failed: ${error}`);
      this.processingTime = Date.now() - startTime;

      return {
        post,
        enhanced: false,
        processingTime: this.processingTime,
        errors: this.errors,
        warnings: this.warnings,
        usedExistingMetadata: false,
        relatedContent: await this.generateRelatedContent(post),
        internalLinks: this.extractInternalLinks(post),
        enhancedContent: post.body || "",
        metadata: this.analyzePostMetadata(post),
      };
    }
  }

  /**
   * Process multiple posts with optimization
   */
  async processMultiplePosts(
    posts: CollectionEntry<"docs">[],
  ): Promise<PostProcessingResult[]> {
    const results: PostProcessingResult[] = [];

    for (const post of posts) {
      try {
        const result = await this.processPost(post);
        results.push(result);
      } catch (error) {
        // Continue processing other posts even if one fails
        results.push({
          post,
          enhanced: false,
          processingTime: 0,
          errors: [`Processing failed: ${error}`],
          warnings: [],
          usedExistingMetadata: false,
          relatedContent: await this.generateRelatedContent(post),
          internalLinks: this.extractInternalLinks(post),
          enhancedContent: post.body || "",
          metadata: this.analyzePostMetadata(post),
        });
      }
    }

    return results;
  }

  /**
   * Enhance a single post with internal links
   */
  private async enhancePost(
    post: CollectionEntry<"docs">,
  ): Promise<CollectionEntry<"docs">> {
    try {
      // Get all posts for internal link generation
      const allPosts = await getCollection("docs");

      logger.startGroup(`Post Enhancement: ${post.slug}`);
      logger.log(`Starting post enhancement`);
      logger.log(`Total posts available for linking: ${allPosts.length}`);

      // Generate word-to-link conversion for natural internal linking
      logger.log(`Starting word-to-link conversion`);

      const wordLinkResult = await convertWordsToInternalLinks(
        post.body,
        post,
        allPosts,
        createWordToLinkConfig({
          maxConversionsPerArticle: 5, // Increased from 3 for better coverage
          minWordLength: 3,
          maxWordLength: 50,
          caseSensitive: false,
          exactMatch: false,
          allowPartialMatch: true,
          showTooltip: true,
          tooltipStyle: "simple",
          linkStyle: "invisible", // Words look exactly like normal text
          excludeSelectors: [
            "code",
            "pre",
            "blockquote",
            ".no-links",
            ".syntax-highlight",
            ".code-block",
            "a",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6", // Exclude headers
          ],
          excludePatterns: [
            /^```[\s\S]*?```$/gm, // Code blocks
            /^>\s+/gm, // Blockquotes
            /^\d+\.\s+/gm, // Numbered lists
            /^[-*+]\s+/gm, // Bullet lists
            /^#{1,6}\s+/gm, // Headers (NEW)
          ],
          preserveFormatting: true,
          respectIndonesianWords: true, // NEW: Respect Indonesian word boundaries
          excludeHeaders: true, // NEW: Exclude headers from processing
          excludeConjunctions: true, // FIXED: Re-enable Indonesian conjunction exclusion
        }),
      );

      // Clean word-to-link conversion results logging
      logger.logWordToLinkResults(
        post.slug,
        wordLinkResult.statistics,
        wordLinkResult.conversions,
      );

      if (wordLinkResult.conversions.length === 0) {
        // Debug: Check if generateInternalLinks returns suggestions
        const linkSuggestions = generateInternalLinks(post, allPosts, 5);
        logger.verbose(`Link suggestions generated: ${linkSuggestions.length}`);
        if (linkSuggestions.length > 0) {
          logger.verbose(
            `Available link suggestions: ${linkSuggestions.length}`,
          );
        } else {
          logger.log(
            `No link suggestions generated - this needs investigation`,
            "warning",
          );
        }
      }

      const enhancedBody = wordLinkResult.enhancedContent;

      // Debug: Check if content was actually enhanced
      if (enhancedBody !== post.body) {
        logger.log(`Content enhanced successfully`, "success");
        logger.logContentPreview("Enhanced content preview", enhancedBody, 200);
      } else {
        logger.log(`Content not enhanced - using original body`, "warning");
      }

      const enhancedPost = {
        ...post,
        body: enhancedBody, // Use enhanced body with internal links
        data: {
          ...post.data,
          // Ensure required fields with defaults
          title: post.data.title || "Untitled Post",
          description:
            post.data.description || this.generateDescription(enhancedBody),
          publishedDate: post.data.publishedDate || new Date().toISOString(),
          author: post.data.author || "Tim GoRakuDo",
          difficulty: post.data.difficulty || "beginner",
          category: post.data.category || "general",
          tags: post.data.tags || [],
          featured: post.data.featured || false,
          // mindMapBranch: post.data.mindMapBranch || "landasan-filosofi", // Removed - MindMap functionality deprecated
          // understandingLevel: post.data.understandingLevel || "tingkat-0", // Property doesn't exist in docs schema
          // learningStage: post.data.learningStage || "pemanasan", // Property doesn't exist in docs schema
        },
      };

      // Add warnings for missing optional fields
      if (!post.data.emoji) {
        this.warnings.push(
          `Post ${post.id} missing emoji for sticky note design`,
        );
      }

      if (!post.data.tags || post.data.tags.length === 0) {
        this.warnings.push(
          `Post ${post.id} missing tags for better categorization`,
        );
      }

      // Log word-to-link conversion results
      if (wordLinkResult.statistics.convertedWords > 0) {
        logger.log(
          `Generated ${wordLinkResult.statistics.convertedWords} word-to-link conversions`,
          "success",
        );
      } else {
        logger.log(
          `No word-to-link conversions generated - this needs investigation`,
          "warning",
        );
      }

      logger.endGroup();
      return enhancedPost;
    } catch (error) {
      logger.log(`Error enhancing post: ${error}`, "error");
      logger.endGroup();
      // Return original post if enhancement fails
      return post;
    }
  }

  /**
   * Analyze post metadata
   */
  private analyzePostMetadata(post: CollectionEntry<"docs">) {
    const content = post.body || "";
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // 200 words per minute

    // Calculate complexity score based on content analysis
    let complexityScore = 1;
    if (wordCount > 1000) complexityScore++;
    if (content.includes("```")) complexityScore++; // Code blocks
    if (content.includes("![") || content.includes("<img")) complexityScore++; // Images
    if (content.includes("http")) complexityScore++; // External links
    if (content.includes("##") || content.includes("###")) complexityScore++; // Headers

    return {
      wordCount,
      readingTime,
      complexityScore: Math.min(complexityScore, 10),
      hasImages: content.includes("![") || content.includes("<img"),
      hasCodeBlocks: content.includes("```"),
      hasLinks: content.includes("http"),
    };
  }

  /**
   * Generate description from content if missing
   */
  private generateDescription(content: string): string {
    // Extract first paragraph or sentence
    const firstParagraph = content.split("\n\n")[0];
    const firstSentence = firstParagraph.split(".")[0];

    // Clean up markdown and limit length
    const cleanDescription = firstSentence
      .replace(/[#*`]/g, "") // Remove markdown formatting
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();

    return cleanDescription.length > 160
      ? cleanDescription.substring(0, 157) + "..."
      : cleanDescription;
  }

  /**
   * Reset processor state
   */
  private reset(): void {
    this.processingTime = 0;
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Generate related content for AI recommendations
   */
  private async generateRelatedContent(
    post: CollectionEntry<"docs">,
  ): Promise<RelatedContent> {
    try {
      // Get all posts for comparison
      const allPosts = await getCollection("docs");

      // Get semantic relationships
      const relationships = getRelatedContent(post, allPosts);

      // Convert to AI-Recommendations format with improved logic
      const similarContent = relationships.similarContent.map((rel) => ({
        targetSlug: rel.targetSlug,
        targetTitle: rel.targetTitle,
        reason: rel.reason,
        score: Math.round(rel.strength * 100),
      }));

      const contextualRelevance = relationships.relatedContent
        .filter(
          (rel) =>
            !relationships.similarContent.some(
              (sim) => sim.targetSlug === rel.targetSlug,
            ),
        )
        .map((rel) => ({
          targetSlug: rel.targetSlug,
          targetTitle: rel.targetTitle,
          reason: rel.reason,
          score: Math.round(rel.strength * 100),
        }));

      // Ensure we have enough recommendations by adding fallback content
      const totalRecommendations =
        similarContent.length + contextualRelevance.length;
      if (totalRecommendations < 3 && relationships.relatedContent.length > 0) {
        // Add more contextual relevance to reach 3 recommendations
        const remainingPosts = relationships.relatedContent
          .filter(
            (rel) =>
              !similarContent.some(
                (sim) => sim.targetSlug === rel.targetSlug,
              ) &&
              !contextualRelevance.some(
                (ctx) => ctx.targetSlug === rel.targetSlug,
              ),
          )
          .slice(0, 3 - totalRecommendations)
          .map((rel) => ({
            targetSlug: rel.targetSlug,
            targetTitle: rel.targetTitle,
            reason: rel.reason,
            score: Math.round(rel.strength * 100),
          }));

        contextualRelevance.push(...remainingPosts);
      }

      return {
        similarContent,
        contextualRelevance,
      };
    } catch (error) {
      console.error("Error generating related content:", error);
      return {
        similarContent: [],
        contextualRelevance: [],
      };
    }
  }

  /**
   * Extract internal links from post content
   */
  private extractInternalLinks(post: CollectionEntry<"docs">): Array<{
    slug: string;
    title: string;
    anchor?: string;
  }> {
    const content = post.body || "";
    const links: Array<{ slug: string; title: string; anchor?: string }> = [];

    // Extract markdown links that point to internal docs
    const linkRegex = /\[([^\]]+)\]\(\/docs\/([^#)]+)(?:#([^)]+))?\)/g;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      links.push({
        title: match[1],
        slug: match[2],
        anchor: match[3],
      });
    }

    return links;
  }
}

/**
 * Process post with optimization
 * Convenience function for single post processing
 */
export async function processPostWithOptimization(
  post: CollectionEntry<"docs">,
): Promise<PostProcessingResult> {
  const processor = new OptimizedPostProcessor();
  return await processor.processPost(post);
}

/**
 * Process multiple posts with optimization
 * Convenience function for batch processing
 */
export async function processMultiplePostsWithOptimization(
  posts: CollectionEntry<"docs">[],
): Promise<PostProcessingResult[]> {
  const processor = new OptimizedPostProcessor();
  return await processor.processMultiplePosts(posts);
}
