/**
 * Inline Internal Linking System for Astro SSG
 *
 * This utility injects internal links directly within paragraphs at strategic positions
 * without disrupting reading flow. Links are placed inline within natural content breaks.
 *
 * Features:
 * - Adaptive link density (1 link per 3-6 paragraphs)
 * - Inline link injection within paragraphs
 * - Content filtering (excludes code blocks, blockquotes, etc.)
 * - Strategic positioning that respects reading flow
 * - Integration with existing mind map and content analysis system
 *
 * @author GoRakuDo Engineering Team 2025
 * @version 1.0.0
 * @framework Astro SSG with Vue and Tailwind v4.1
 */

import type { CollectionEntry } from "astro:content";
import {
  generateInternalLinks,
  type InternalLinkSuggestion,
} from "./content-analysis";
import { resolveContentPath } from "../content-path-resolver";

// ========== CONFIGURATION INTERFACES ==========

/**
 * Inline linking configuration interface
 * Provides comprehensive control over link density, filtering, and positioning
 */
export interface InlineLinkingConfig {
  // Link density settings
  /** Minimum paragraphs between links (maintains reading flow) */
  minParagraphsBetweenLinks: number;
  /** Maximum links per article (prevents oversaturation) */
  maxLinksPerArticle: number;
  /** Enable adaptive density based on content length */
  adaptiveDensity: boolean;

  // Content filtering settings
  /** CSS selectors to exclude from linking */
  excludeSelectors: string[];
  /** Regex patterns to exclude from linking */
  excludePatterns: RegExp[];
  /** Minimum paragraph length in characters */
  minParagraphLength: number;

  // Positioning strategy
  /** Where to place links within paragraphs */
  positionStrategy: "mid-paragraph" | "end-paragraph" | "smart";
  /** Respect natural reading flow patterns */
  respectReadingFlow: boolean;

  // Display settings
  /** Visual style of the links */
  linkStyle: "subtle" | "prominent" | "contextual";
  /** Show icon before link text */
  showIcon: boolean;
  /** Show reason tooltip */
  showReason: boolean;
}

/**
 * Default configuration optimized for inline linking
 * Based on UX research and readability best practices
 */
export const DEFAULT_INLINE_CONFIG: InlineLinkingConfig = {
  // Link density - ensures non-intrusive experience
  minParagraphsBetweenLinks: 3,
  maxLinksPerArticle: 4,
  adaptiveDensity: true,

  // Content filtering - excludes inappropriate content types
  excludeSelectors: [
    "code",
    "pre",
    "blockquote",
    ".no-links",
    ".syntax-highlight",
    ".code-block",
    ".example",
  ],
  excludePatterns: [
    /^```[\s\S]*?```$/gm, // Code blocks
    /^>\s+/gm, // Blockquotes
    /^\d+\.\s+/gm, // Numbered lists
    /^[-*+]\s+/gm, // Bullet lists
    /^#{1,6}\s+/gm, // Headers (additional safety)
  ],
  minParagraphLength: 50,

  // Positioning - smart placement for natural reading flow
  positionStrategy: "smart",
  respectReadingFlow: true,

  // Display - contextual styling that blends with content
  linkStyle: "contextual",
  showIcon: true,
  showReason: false,
};

// ========== ANALYSIS INTERFACES ==========

/**
 * Paragraph analysis for inline linking opportunities
 * Provides detailed analysis of each paragraph's linking potential
 */
export interface ParagraphAnalysis {
  /** Paragraph index in content */
  index: number;
  /** Full paragraph content */
  content: string;
  /** Word count for density calculation */
  wordCount: number;
  /** Whether paragraph is suitable for linking */
  isLinkable: boolean;
  /** Optimal position within paragraph for link placement */
  optimalPosition: number;
  /** Context keywords extracted from paragraph */
  contextKeywords: string[];
  /** Relevance score for link placement priority */
  relevanceScore: number;
  /** Character position in full content */
  startPosition: number;
  /** Character position end in full content */
  endPosition: number;
}

/**
 * Inline linking result with comprehensive statistics
 * Provides full transparency of the linking process
 */
export interface InlineLinkingResult {
  /** Content with injected inline links */
  enhancedContent: string;
  /** Details of each injected link */
  injectedLinks: Array<{
    paragraphIndex: number;
    link: InternalLinkSuggestion;
    position: number;
    context: string;
    wordPosition: number;
  }>;
  /** Processing statistics for optimization */
  statistics: {
    totalParagraphs: number;
    linkableParagraphs: number;
    injectedLinks: number;
    processingTime: number;
    averageWordsPerParagraph: number;
    linkDensityRatio: number;
  };
}

// ========== MAIN FUNCTIONALITY ==========

/**
 * Main function: Inject inline internal links within paragraphs
 *
 * This function replaces the old block-level linking system with seamless
 * inline links that appear naturally within paragraph content.
 *
 * @param content - Markdown content to process
 * @param currentPost - Current blog post entry
 * @param allPosts - All blog posts for link generation
 * @param config - Configuration options
 * @returns Enhanced content with inline links and statistics
 */
export async function injectInlineInternalLinks(
  content: string,
  currentPost: CollectionEntry<"docs">,
  allPosts: CollectionEntry<"docs">[],
  config: Partial<InlineLinkingConfig> = {},
): Promise<InlineLinkingResult> {
  const startTime = performance.now();
  const finalConfig = { ...DEFAULT_INLINE_CONFIG, ...config };

  console.log(`🔄 Starting inline linking for "${currentPost.slug}"`);

  // Step 1: Analyze content structure and find linkable paragraphs
  const paragraphAnalysis = analyzeParagraphsForInlineLinking(
    content,
    finalConfig,
  );

  if (paragraphAnalysis.length === 0) {
    console.log(`⚠️  No linkable paragraphs found in "${currentPost.slug}"`);
    return createEmptyResult(content, startTime);
  }

  // Step 2: Calculate adaptive link count based on content length
  const adaptiveLinkCount = calculateAdaptiveLinkCount(
    paragraphAnalysis.length,
    finalConfig,
  );

  console.log(
    `📊 Analysis: ${paragraphAnalysis.length} paragraphs, target ${adaptiveLinkCount} links`,
  );

  // Step 3: Generate internal link suggestions using existing system
  const linkSuggestions = generateInternalLinks(
    currentPost,
    allPosts,
    adaptiveLinkCount,
  );

  if (linkSuggestions.length === 0) {
    console.log(`⚠️  No link suggestions generated for "${currentPost.slug}"`);
    return createEmptyResult(content, startTime);
  }

  // Step 4: Match links to optimal paragraph positions
  const linkPlacements = matchLinksToParagraphs(
    paragraphAnalysis,
    linkSuggestions,
    finalConfig,
  );

  // Step 5: Inject links inline within paragraphs
  const enhancedContent = injectLinksInline(
    content,
    linkPlacements,
    finalConfig,
  );

  const processingTime = performance.now() - startTime;

  // Calculate statistics
  const statistics = {
    totalParagraphs: paragraphAnalysis.length,
    linkableParagraphs: paragraphAnalysis.filter((p) => p.isLinkable).length,
    injectedLinks: linkPlacements.length,
    processingTime,
    averageWordsPerParagraph:
      paragraphAnalysis.reduce((sum, p) => sum + p.wordCount, 0) /
      paragraphAnalysis.length,
    linkDensityRatio: linkPlacements.length / paragraphAnalysis.length,
  };

  console.log(
    `✅ Inline linking complete: ${statistics.injectedLinks} links in ${statistics.processingTime.toFixed(2)}ms`,
  );

  return {
    enhancedContent,
    injectedLinks: linkPlacements.map((placement) => ({
      paragraphIndex: placement.paragraphIndex,
      link: placement.link,
      position: placement.absolutePosition,
      context: placement.context,
      wordPosition: placement.wordPosition,
    })),
    statistics,
  };
}

/**
 * Create empty result for error cases
 */
function createEmptyResult(
  content: string,
  startTime: number,
): InlineLinkingResult {
  return {
    enhancedContent: content,
    injectedLinks: [],
    statistics: {
      totalParagraphs: 0,
      linkableParagraphs: 0,
      injectedLinks: 0,
      processingTime: performance.now() - startTime,
      averageWordsPerParagraph: 0,
      linkDensityRatio: 0,
    },
  };
}

// ========== CONTENT ANALYSIS ==========

/**
 * Analyze paragraphs for inline linking opportunities
 *
 * This function intelligently parses content to identify suitable paragraphs
 * for link placement while respecting content structure and reading flow.
 *
 * @param content - Full markdown content
 * @param config - Inline linking configuration
 * @returns Array of paragraph analyses
 */
function analyzeParagraphsForInlineLinking(
  content: string,
  config: InlineLinkingConfig,
): ParagraphAnalysis[] {
  const paragraphs: ParagraphAnalysis[] = [];
  const lines = content.split("\n");
  let currentParagraph = "";
  let paragraphIndex = 0;
  let currentPosition = 0;
  let lineIndex = 0;

  while (lineIndex < lines.length) {
    const line = lines[lineIndex];
    const lineLength = line.length + 1; // +1 for newline

    // Check if line starts a new paragraph (empty line)
    if (line.trim() === "" && currentParagraph.trim() !== "") {
      // Process completed paragraph
      if (currentParagraph.trim()) {
        const startPosition = currentPosition - currentParagraph.length;
        const endPosition = currentPosition;

        const analysis = analyzeSingleParagraph(
          currentParagraph.trim(),
          paragraphIndex,
          startPosition,
          endPosition,
          config,
        );

        if (analysis) {
          paragraphs.push(analysis);
          paragraphIndex++;
        }
      }
      currentParagraph = "";
    } else if (line.trim() !== "") {
      // Continue building current paragraph
      currentParagraph += (currentParagraph ? "\n" : "") + line;
    }

    currentPosition += lineLength;
    lineIndex++;
  }

  // Process final paragraph if exists
  if (currentParagraph.trim()) {
    const startPosition = currentPosition - currentParagraph.length;
    const endPosition = currentPosition;

    const analysis = analyzeSingleParagraph(
      currentParagraph.trim(),
      paragraphIndex,
      startPosition,
      endPosition,
      config,
    );

    if (analysis) {
      paragraphs.push(analysis);
    }
  }

  console.log(
    `📋 Analyzed ${paragraphs.length} paragraphs (${paragraphs.filter((p) => p.isLinkable).length} linkable)`,
  );

  return paragraphs;
}

/**
 * Analyze a single paragraph for linking potential
 *
 * Comprehensive analysis of paragraph suitability including content filtering,
 * length validation, and relevance scoring.
 *
 * @param paragraph - Paragraph content
 * @param index - Paragraph index
 * @param startPosition - Start position in full content
 * @param endPosition - End position in full content
 * @param config - Configuration options
 * @returns Paragraph analysis or null if excluded
 */
function analyzeSingleParagraph(
  paragraph: string,
  index: number,
  startPosition: number,
  endPosition: number,
  config: InlineLinkingConfig,
): ParagraphAnalysis | null {
  const wordCount = paragraph
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  // Check if paragraph should be excluded
  if (shouldExcludeParagraph(paragraph, config)) {
    return null;
  }

  // Check minimum length requirement
  if (wordCount < config.minParagraphLength / 5) {
    // Rough words estimate
    return null;
  }

  // Determine if paragraph is linkable
  const isLinkable = wordCount >= 10; // Minimum viable paragraph for linking

  // Calculate optimal position within paragraph
  const optimalPosition = calculateOptimalInlinePosition(paragraph, config);

  // Extract context keywords
  const contextKeywords = extractContextKeywords(paragraph);

  // Calculate relevance score
  const relevanceScore = calculateParagraphRelevance(paragraph, wordCount);

  return {
    index,
    content: paragraph,
    wordCount,
    isLinkable,
    optimalPosition,
    contextKeywords,
    relevanceScore,
    startPosition,
    endPosition,
  };
}

/**
 * Check if paragraph should be excluded from linking
 *
 * Comprehensive filtering system to avoid inappropriate content types
 * and maintain content quality.
 *
 * @param paragraph - Paragraph content to check
 * @param config - Configuration with exclusion rules
 * @returns True if paragraph should be excluded
 */
function shouldExcludeParagraph(
  paragraph: string,
  config: InlineLinkingConfig,
): boolean {
  // Check exclusion patterns
  for (const pattern of config.excludePatterns) {
    if (pattern.test(paragraph)) {
      return true;
    }
  }

  // Check for code-like content
  if (paragraph.includes("```") || paragraph.includes("`")) {
    return true;
  }

  // Check for list-like content (more comprehensive)
  if (/^[\s]*[-*+]\s+/.test(paragraph) || /^[\s]*\d+\.\s+/.test(paragraph)) {
    return true;
  }

  // Check for blockquote-like content
  if (/^[\s]*>\s+/.test(paragraph)) {
    return true;
  }

  // Check for headers (safety check)
  if (/^#{1,6}\s+/.test(paragraph)) {
    return true;
  }

  // Check for very short content
  if (paragraph.trim().length < 30) {
    return true;
  }

  return false;
}

/**
 * Calculate optimal position within paragraph for inline link
 *
 * CRITICAL FIX: Enhanced positioning that respects sentence boundaries
 * and natural reading flow to prevent text disruption.
 *
 * @param paragraph - Paragraph content
 * @param config - Position strategy configuration
 * @returns Word position within paragraph
 */
function calculateOptimalInlinePosition(
  paragraph: string,
  config: InlineLinkingConfig,
): number {
  const words = paragraph.split(/\s+/).filter((word) => word.length > 0);
  const wordCount = words.length;

  if (wordCount < 5) {
    return Math.max(1, wordCount - 1); // Near end for very short paragraphs
  }

  switch (config.positionStrategy) {
    case "mid-paragraph":
      return findSentenceBoundaryPosition(
        paragraph,
        Math.floor(wordCount * 0.6),
      );

    case "end-paragraph":
      return findSentenceBoundaryPosition(
        paragraph,
        Math.max(wordCount - 3, Math.floor(wordCount * 0.8)),
      );

    case "smart":
    default:
      return findOptimalSentenceBoundaryPosition(paragraph, wordCount);
  }
}

/**
 * Find position at sentence boundary near target position
 *
 * CRITICAL: This prevents breaking sentences in the middle
 */
function findSentenceBoundaryPosition(
  paragraph: string,
  targetPosition: number,
): number {
  const sentences = paragraph.split(/([.!?]+)/);
  let currentWordCount = 0;
  let bestPosition = targetPosition;
  let minDistance = Infinity;

  // Find the sentence boundary closest to target position
  for (let i = 0; i < sentences.length; i += 2) {
    // Skip punctuation
    const sentence = sentences[i];
    const sentenceWords = sentence
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const sentenceEndPosition = currentWordCount + sentenceWords.length;

    // Check if this sentence boundary is close to target
    const distance = Math.abs(sentenceEndPosition - targetPosition);
    if (distance < minDistance && sentenceEndPosition > 5) {
      // Ensure minimum distance from start
      minDistance = distance;
      bestPosition = sentenceEndPosition;
    }

    currentWordCount += sentenceWords.length;
  }

  return Math.max(1, Math.min(bestPosition, paragraph.split(/\s+/).length - 1));
}

/**
 * Find optimal sentence boundary position for smart placement
 *
 * Prioritizes end of sentences and natural break points
 */
function findOptimalSentenceBoundaryPosition(
  paragraph: string,
  wordCount: number,
): number {
  const sentences = paragraph.split(/([.!?]+)/);
  let currentWordCount = 0;

  // Strategy 1: Try to place after first complete sentence
  for (let i = 0; i < sentences.length; i += 2) {
    const sentence = sentences[i];
    const sentenceWords = sentence
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const sentenceEndPosition = currentWordCount + sentenceWords.length;

    // Only place after first sentence if it's substantial (at least 10 words)
    if (sentenceWords.length >= 10 && sentenceEndPosition > 5) {
      return sentenceEndPosition;
    }

    currentWordCount += sentenceWords.length;
  }

  // Strategy 2: Place at last sentence boundary before 70% of content
  const targetPosition = Math.floor(wordCount * 0.7);
  currentWordCount = 0;

  for (let i = 0; i < sentences.length; i += 2) {
    const sentence = sentences[i];
    const sentenceWords = sentence
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const sentenceEndPosition = currentWordCount + sentenceWords.length;

    if (sentenceEndPosition > targetPosition && sentenceEndPosition > 5) {
      return sentenceEndPosition;
    }

    currentWordCount += sentenceWords.length;
  }

  // Strategy 3: Fallback to near end of paragraph
  return Math.max(1, wordCount - 2);
}

/**
 * Extract context keywords from paragraph
 *
 * Intelligent keyword extraction for better link matching and relevance.
 * Focuses on Japanese learning and immersion-specific terminology.
 *
 * @param paragraph - Paragraph content
 * @returns Array of relevant keywords
 */
function extractContextKeywords(paragraph: string): string[] {
  const keywords: string[] = [];
  const lowerParagraph = paragraph.toLowerCase();

  // Japanese learning specific keywords
  const japaneseKeywords = [
    "immersion",
    "bahasa jepang",
    "pembelajaran",
    "metodologi",
    "anki",
    "flashcard",
    "srs",
    "spaced repetition",
    "grammar",
    "vocabulary",
    "reading",
    "listening",
    "krashen",
    "input hypothesis",
    "natural approach",
    "contoh",
    "example",
    "prinsip",
    "principle",
    "teori",
    "theory",
    "praktik",
    "practice",
  ];

  japaneseKeywords.forEach((keyword) => {
    if (lowerParagraph.includes(keyword)) {
      keywords.push(keyword);
    }
  });

  return keywords;
}

/**
 * Calculate paragraph relevance for link placement
 *
 * Sophisticated scoring system that considers content quality,
 * length, structure, and educational value.
 *
 * @param paragraph - Paragraph content
 * @param wordCount - Word count for efficiency
 * @returns Relevance score (0-1)
 */
function calculateParagraphRelevance(
  paragraph: string,
  wordCount: number,
): number {
  let score = 0;

  // Base score from word count (optimal range: 20-60 words for inline links)
  if (wordCount >= 20 && wordCount <= 60) {
    score += 0.4;
  } else if (wordCount >= 15 && wordCount <= 80) {
    score += 0.2;
  }

  // Content quality indicators
  if (paragraph.includes(".")) score += 0.1; // Complete sentences
  if (paragraph.includes(":")) score += 0.1; // Explanatory content
  if (paragraph.includes("contoh") || paragraph.includes("example"))
    score += 0.2;
  if (paragraph.includes("prinsip") || paragraph.includes("principle"))
    score += 0.2;
  if (paragraph.includes("penting") || paragraph.includes("important"))
    score += 0.15;

  // Educational content bonus
  if (paragraph.includes("pembelajaran") || paragraph.includes("learn"))
    score += 0.1;
  if (paragraph.includes("metode") || paragraph.includes("method"))
    score += 0.1;

  // Avoid very short or very long paragraphs for inline links
  if (wordCount < 10 || wordCount > 100) score -= 0.3;

  return Math.max(0, Math.min(1, score));
}

// ========== ADAPTIVE DENSITY CALCULATION ==========

/**
 * Calculate adaptive link count based on content length
 *
 * Intelligent density calculation that ensures optimal link distribution
 * without oversaturating the content or disrupting reading flow.
 *
 * @param paragraphCount - Total number of paragraphs
 * @param config - Configuration options
 * @returns Optimal number of links
 */
function calculateAdaptiveLinkCount(
  paragraphCount: number,
  config: InlineLinkingConfig,
): number {
  if (!config.adaptiveDensity) {
    return Math.min(config.maxLinksPerArticle, paragraphCount);
  }

  // Adaptive density: 1 link per 3-6 paragraphs based on content length
  let density: number;

  if (paragraphCount <= 6) {
    density = 6; // 1 link per 6 paragraphs for short content
  } else if (paragraphCount <= 12) {
    density = 4; // 1 link per 4 paragraphs for medium content
  } else {
    density = 3; // 1 link per 3 paragraphs for long content
  }

  const baseDensity = Math.floor(paragraphCount / density);
  const maxLinks = Math.min(config.maxLinksPerArticle, paragraphCount);
  const minLinks = Math.max(1, Math.floor(paragraphCount / 8)); // Never less than 1 per 8 paragraphs

  return Math.max(minLinks, Math.min(maxLinks, baseDensity));
}

// ========== LINK MATCHING AND PLACEMENT ==========

/**
 * Link placement configuration
 */
interface LinkPlacement {
  paragraphIndex: number;
  link: InternalLinkSuggestion;
  wordPosition: number;
  absolutePosition: number;
  context: string;
}

/**
 * Match links to optimal paragraph positions
 *
 * Intelligent matching system that considers paragraph relevance,
 * spacing requirements, and content flow to ensure optimal placement.
 *
 * @param paragraphs - Analyzed paragraphs
 * @param linkSuggestions - Generated link suggestions
 * @param config - Configuration options
 * @returns Array of link placements
 */
function matchLinksToParagraphs(
  paragraphs: ParagraphAnalysis[],
  linkSuggestions: InternalLinkSuggestion[],
  config: InlineLinkingConfig,
): LinkPlacement[] {
  const linkableParagraphs = paragraphs.filter((p) => p.isLinkable);
  const placements: LinkPlacement[] = [];

  if (linkableParagraphs.length === 0 || linkSuggestions.length === 0) {
    return placements;
  }

  // Sort paragraphs by relevance score (highest first)
  const sortedParagraphs = [...linkableParagraphs].sort(
    (a, b) => b.relevanceScore - a.relevanceScore,
  );

  // Distribute links with minimum spacing
  let lastLinkedIndex = -1;

  for (
    let i = 0;
    i < linkSuggestions.length && placements.length < config.maxLinksPerArticle;
    i++
  ) {
    const link = linkSuggestions[i];

    // Find next suitable paragraph with minimum spacing
    const suitableParagraph = sortedParagraphs.find(
      (p) => p.index >= lastLinkedIndex + config.minParagraphsBetweenLinks,
    );

    if (suitableParagraph) {
      const wordPosition = suitableParagraph.optimalPosition;
      const absolutePosition = calculateAbsolutePosition(
        suitableParagraph,
        wordPosition,
      );

      placements.push({
        paragraphIndex: suitableParagraph.index,
        link,
        wordPosition,
        absolutePosition,
        context: suitableParagraph.content.substring(0, 50) + "...",
      });

      lastLinkedIndex = suitableParagraph.index;

      // Remove used paragraph from future consideration
      const usedIndex = sortedParagraphs.findIndex(
        (p) => p.index === suitableParagraph.index,
      );
      if (usedIndex > -1) {
        sortedParagraphs.splice(usedIndex, 1);
      }
    }
  }

  return placements.sort((a, b) => a.paragraphIndex - b.paragraphIndex);
}

/**
 * Calculate absolute character position for link placement
 *
 * @param paragraph - Target paragraph analysis
 * @param wordPosition - Word position within paragraph
 * @returns Absolute character position in content
 */
function calculateAbsolutePosition(
  paragraph: ParagraphAnalysis,
  wordPosition: number,
): number {
  const words = paragraph.content
    .split(/\s+/)
    .filter((word) => word.length > 0);

  if (wordPosition >= words.length) {
    return paragraph.endPosition;
  }

  // Calculate character position of the target word
  let characterPosition = paragraph.startPosition;
  for (let i = 0; i < wordPosition; i++) {
    characterPosition += words[i].length + 1; // +1 for space
  }

  return characterPosition;
}

// ========== CONTENT INJECTION ==========

/**
 * Inject links inline within paragraphs
 *
 * Final processing step that actually modifies the content by inserting
 * inline links at calculated positions while preserving content structure.
 *
 * @param content - Original content
 * @param linkPlacements - Calculated link placements
 * @param config - Configuration options
 * @returns Enhanced content with inline links
 */
function injectLinksInline(
  content: string,
  linkPlacements: LinkPlacement[],
  config: InlineLinkingConfig,
): string {
  if (linkPlacements.length === 0) {
    return content;
  }

  // Sort placements by position in reverse order to avoid position shifts
  const sortedPlacements = [...linkPlacements].sort(
    (a, b) => b.absolutePosition - a.absolutePosition,
  );

  let enhancedContent = content;

  sortedPlacements.forEach((placement) => {
    const linkHTML = generateInlineLinkHTML(placement.link, config);

    // CRITICAL FIX: Use safe insertion position to prevent sentence disruption
    const safePosition = findSafeInsertionPosition(
      enhancedContent,
      placement.absolutePosition,
    );

    // Insert link at safe position
    if (safePosition <= enhancedContent.length) {
      enhancedContent =
        enhancedContent.slice(0, safePosition) +
        " " +
        linkHTML +
        " " +
        enhancedContent.slice(safePosition);
    }

    console.log(
      `🔗 Injected inline link "${placement.link.targetTitle}" at safe position in paragraph ${placement.paragraphIndex}`,
    );
  });

  return enhancedContent;
}

/**
 * Find safe insertion position that doesn't break sentence flow
 *
 * CRITICAL: This prevents the text disruption issue
 */
function findSafeInsertionPosition(
  paragraph: string,
  targetPosition: number,
): number {
  const words = paragraph.split(/\s+/);
  const sentences = paragraph.split(/([.!?]+)/);

  let currentWordCount = 0;
  let safePosition = targetPosition;

  // Find the nearest sentence boundary
  for (let i = 0; i < sentences.length; i += 2) {
    const sentence = sentences[i];
    const sentenceWords = sentence
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const sentenceEndPosition = currentWordCount + sentenceWords.length;

    // If target is within this sentence, place at sentence end
    if (targetPosition <= sentenceEndPosition && sentenceEndPosition > 5) {
      safePosition = sentenceEndPosition;
      break;
    }

    currentWordCount += sentenceWords.length;
  }

  // Ensure minimum distance from start and end
  return Math.max(3, Math.min(safePosition, words.length - 2));
}

/**
 * Generate inline link HTML with improved spacing
 *
 * CRITICAL FIX: Enhanced HTML generation for better text flow
 */
function generateInlineLinkHTML(
  link: InternalLinkSuggestion,
  config: InlineLinkingConfig,
): string {
  // Use dynamic path resolution
  let linkUrl: string;
  try {
    const resolvedPath = resolveContentPath({ slug: link.targetSlug } as any);
    linkUrl = resolvedPath.path;
  } catch (error) {
    console.warn(`Failed to resolve path for ${link.targetSlug}:`, error);
    linkUrl = `/docs/${link.targetSlug}`;
  }
  const linkTitle = link.targetTitle;
  const linkReason = link.reason;

  let linkText = linkTitle;

  // Add icon if enabled
  if (config.showIcon) {
    linkText = `📘 ${linkText}`;
  }

  // Apply styling based on config
  let className = "inline-internal-link";
  switch (config.linkStyle) {
    case "subtle":
      className += " inline-link-subtle";
      break;
    case "prominent":
      className += " inline-link-prominent";
      break;
    case "contextual":
    default:
      className += " inline-link-contextual";
      break;
  }

  // CRITICAL FIX: Add proper spacing to prevent text disruption
  return `<a href="${linkUrl}" class="${className}" title="${linkReason}">${linkText}</a>`;
}

// ========== UTILITY EXPORTS ==========

/**
 * Quick utility function for simple inline linking
 * Uses default configuration for ease of use
 */
export async function addInlineLinks(
  content: string,
  currentPost: CollectionEntry<"docs">,
  allPosts: CollectionEntry<"docs">[],
): Promise<string> {
  const result = await injectInlineInternalLinks(
    content,
    currentPost,
    allPosts,
  );
  return result.enhancedContent;
}

/**
 * Configuration builder for custom setups
 */
export function createInlineLinkingConfig(
  overrides: Partial<InlineLinkingConfig>,
): InlineLinkingConfig {
  return { ...DEFAULT_INLINE_CONFIG, ...overrides };
}
