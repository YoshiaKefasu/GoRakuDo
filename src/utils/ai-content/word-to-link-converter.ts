/**
 * Word-to-Link Converter for Internal Linking
 *
 * This utility converts existing words/phrases in content into internal links
 * that look like normal text but provide internal navigation and hover tooltips.
 *
 * Features:
 * - Converts existing words into internal links
 * - No visual disruption (looks like normal text)
 * - Hover tooltips showing target post titles
 * - Intelligent word/phrase matching
 * - Integration with existing content analysis
 * - Performance optimized with caching and reduced processing
 *
 * @author Google 2025 Engineering Team
 * @version 1.1.0
 * @framework Astro SSG with Vue and Tailwind v4.1
 */

import type { CollectionEntry } from "astro:content";
import {
  generateInternalLinks,
  analyzeContent,
  type InternalLinkSuggestion,
} from "./content-analysis";

// ========== PERFORMANCE CACHING ==========

/**
 * Cache for expensive operations to improve build performance
 */
const performanceCache = {
  // Cache for word variations to avoid regenerating
  wordVariations: new Map<string, string[]>(),
  // Cache for header detection results
  headerDetection: new Map<string, boolean>(),
  // Cache for conjunction detection
  conjunctionDetection: new Map<string, boolean>(),
  // Cache for cleaned words
  cleanedWords: new Map<string, string>(),
};

/**
 * Clear performance cache (useful for testing)
 */
export function clearPerformanceCache(): void {
  performanceCache.wordVariations.clear();
  performanceCache.headerDetection.clear();
  performanceCache.conjunctionDetection.clear();
  performanceCache.cleanedWords.clear();
}

// ========== CONFIGURATION INTERFACES ==========

/**
 * Word-to-link conversion configuration
 * Provides comprehensive control over word matching and link generation
 */
export interface WordToLinkConfig {
  // Conversion settings
  /** Maximum number of word conversions per article */
  maxConversionsPerArticle: number;
  /** Minimum word length for conversion */
  minWordLength: number;
  /** Maximum word length for conversion */
  maxWordLength: number;

  // Matching settings
  /** Case sensitive matching */
  caseSensitive: boolean;
  /** Require exact word matches */
  exactMatch: boolean;
  /** Allow partial phrase matching */
  allowPartialMatch: boolean;

  // Display settings
  /** Show tooltip on hover */
  showTooltip: boolean;
  /** Tooltip display style */
  tooltipStyle: "simple" | "detailed" | "minimal";
  /** Link visual style */
  linkStyle: "invisible" | "subtle" | "minimal";

  // Content filtering
  /** CSS selectors to exclude from linking */
  excludeSelectors: string[];
  /** Regex patterns to exclude from linking */
  excludePatterns: RegExp[];
  /** Preserve original text formatting */
  preserveFormatting: boolean;

  // NEW: Indonesian language support
  /** Respect Indonesian word boundaries and grammar */
  respectIndonesianWords: boolean;
  /** Exclude headers from word conversion */
  excludeHeaders: boolean;
  /** Exclude Indonesian conjunctions from word conversion */
  excludeConjunctions: boolean;
}

/**
 * Default configuration for natural-looking links
 * Optimized for invisible internal linking with minimal disruption
 */
export const DEFAULT_WORD_TO_LINK_CONFIG: WordToLinkConfig = {
  // Conversion limits - conservative for natural experience
  maxConversionsPerArticle: 5,
  minWordLength: 3,
  maxWordLength: 50,

  // Matching strategy - flexible for better coverage
  caseSensitive: false,
  exactMatch: false,
  allowPartialMatch: true,

  // Display - invisible with informative tooltips
  showTooltip: true,
  tooltipStyle: "simple",
  linkStyle: "invisible",

  // Content filtering - exclude inappropriate elements
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

  // NEW: Indonesian language support
  respectIndonesianWords: true,
  excludeHeaders: true,
  excludeConjunctions: true,
};

// ========== INDONESIAN CONJUNCTION LIST ==========

/**
 * Comprehensive list of Indonesian conjunctions (kata sambung)
 * Excludes these words from being converted to internal links
 * to maintain natural Indonesian language flow
 */
const INDONESIAN_CONJUNCTIONS = [
  // Coordinating conjunctions (kata penghubung koordinatif)
  "dan",
  "yang",
  "atau",
  "tetapi",
  "namun",
  "melainkan",
  "sedangkan",
  "padahal",

  // Subordinating conjunctions (kata penghubung subordinatif)
  "karena",
  "sebab",
  "oleh karena",
  "karena itu",
  "oleh sebab itu",
  "jika",
  "kalau",
  "apabila",
  "bila",
  "manakala",
  "asalkan",
  "sehingga",
  "sampai",
  "hingga",
  "agar",
  "supaya",
  "untuk",
  "ketika",
  "saat",
  "waktu",
  "selama",
  "sementara",
  "sebelum",
  "sesudah",
  "setelah",
  "sejak",
  "hingga",
  "sampai",
  "selama",
  "meskipun",
  "walaupun",
  "biarpun",
  "kendatipun",
  "sekalipun",
  "seperti",
  "sebagai",
  "laksana",
  "bagaikan",
  "umpama",
  "ibarat",
  "bahwa",
  "agar",
  "supaya",
  "untuk",
  "guna",

  // Correlative conjunctions (kata penghubung korelatif)
  "baik...maupun",
  "tidak hanya...tetapi juga",
  "entah...entah",
  "bukan hanya...melainkan juga",
  "demikian...sehingga",

  // Common conjunctions
  "serta",
  "dengan",
  "tanpa",
  "kecuali",
  "selain",
  "termasuk",
  "seperti",
  "sebagai",
  "dalam",
  "pada",
  "di",
  "ke",
  "dari",
  "untuk",
  "kepada",
  "terhadap",
  "oleh",
  "dengan",
  "tanpa",
  "sejak",
  "hingga",
  "sampai",
  "selama",
  "sementara",
  "ketika",
  "saat",
  "waktu",
  "sebelum",
  "sesudah",
  "setelah",
  "karena",
  "sebab",
  "oleh karena",
  "karena itu",
  "jika",
  "kalau",
  "apabila",
  "bila",
  "asalkan",
  "meskipun",
  "walaupun",
  "biarpun",
  "kendatipun",
  "sehingga",
  "sampai",
  "hingga",
  "agar",
  "supaya",
  "seperti",
  "sebagai",
  "laksana",
  "bagaikan",
  "bahwa",
  "agar",
  "supaya",
  "untuk",
  "guna",

  // Additional common conjunctions
  "atau",
  "dan",
  "tetapi",
  "namun",
  "melainkan",
  "sedangkan",
  "padahal",
  "serta",
  "dengan",
  "tanpa",
  "kecuali",
  "selain",
  "termasuk",
  "dalam",
  "pada",
  "di",
  "ke",
  "dari",
  "kepada",
  "terhadap",
  "oleh",
  "sejak",
  "hingga",
  "sampai",
  "selama",
  "sementara",
  "ketika",
  "saat",
  "waktu",
  "sebelum",
  "sesudah",
  "setelah",
  "karena",
  "sebab",
  "jika",
  "kalau",
  "apabila",
  "bila",
  "asalkan",
  "meskipun",
  "walaupun",
  "biarpun",
  "kendatipun",
  "sehingga",
  "agar",
  "supaya",
  "seperti",
  "sebagai",
  "laksana",
  "bagaikan",
  "bahwa",
  "guna",
];

// ========== RESULT INTERFACES ==========

/**
 * Word-to-link conversion result
 * Provides enhanced content and comprehensive conversion statistics
 */
export interface WordToLinkResult {
  /** Content with words converted to internal links */
  enhancedContent: string;
  /** Details of each word conversion */
  conversions: Array<{
    originalWord: string;
    targetSlug: string;
    targetTitle: string;
    position: number;
    context: string;
  }>;
  /** Processing statistics */
  statistics: {
    totalWords: number;
    convertedWords: number;
    processingTime: number;
  };
}

/**
 * Word matching candidate
 * Represents a potential word-to-link conversion
 */
export interface WordMatch {
  /** Original word from content */
  word: string;
  /** Position in content */
  position: number;
  /** Surrounding context */
  context: string;
  /** Relevance score (0-1) */
  relevance: number;
  /** Target link information */
  targetLink: InternalLinkSuggestion;
}

// ========== MAIN FUNCTIONALITY ==========

/**
 * Main function: Convert words to internal links
 *
 * This function identifies words in content that match post titles and converts
 * them into internal links that look like normal text but provide navigation.
 *
 * @param content - Original content to process
 * @param currentPost - Current blog post entry
 * @param allPosts - All blog posts for link generation
 * @param config - Configuration options
 * @returns Enhanced content with word-to-link conversions
 */
export async function convertWordsToInternalLinks(
  content: string,
  currentPost: CollectionEntry<"blog">,
  allPosts: CollectionEntry<"blog">[],
  config: Partial<WordToLinkConfig> = {},
): Promise<WordToLinkResult> {
  const startTime = performance.now();
  const finalConfig = { ...DEFAULT_WORD_TO_LINK_CONFIG, ...config };

  // Essential logging for functionality tracking
  console.log(
    `🔄 Processing word-to-link conversion for "${currentPost.slug}"`,
  );

  // Step 1: Generate internal link suggestions using existing system
  const linkSuggestions = generateInternalLinks(
    currentPost,
    allPosts,
    finalConfig.maxConversionsPerArticle,
  );

  if (linkSuggestions.length === 0) {
    console.log(`⚠️  No link suggestions found for "${currentPost.slug}"`);
    return createEmptyResult(content, startTime);
  }

  // Step 2: Find word matches in content
  console.log(`🔍 Finding word matches in content...`);

  // Create target variations map for word matching
  const targetVariations = new Map<string, InternalLinkSuggestion>();
  linkSuggestions.forEach((link) => {
    const title = link.targetTitle;
    const variations = generateWordVariations(title, finalConfig);

    // Add variations to the map
    variations.forEach((variation) => {
      if (
        variation.length >= finalConfig.minWordLength &&
        variation.length <= finalConfig.maxWordLength
      ) {
        targetVariations.set(variation.toLowerCase(), link);
      }
    });

    // Also add individual words from the title for better matching
    const titleWords = title.split(/\s+/);
    titleWords.forEach((word) => {
      const cleanWord = cleanWordForMatching(word, finalConfig);
      if (
        cleanWord.length >= finalConfig.minWordLength &&
        cleanWord.length <= finalConfig.maxWordLength
      ) {
        targetVariations.set(cleanWord.toLowerCase(), link);
      }
    });
  });

  // Split content into sections to avoid headers
  const sections = splitContentIntoSections(content, finalConfig);
  const wordMatches: WordMatch[] = [];
  let matchCount = 0;
  let currentPosition = 0;

  // NEW: Track already converted words to prevent duplicates
  const convertedWords = new Set<string>();

  // Process each section
  sections.forEach((section, sectionIndex) => {
    if (section.isHeader) {
      // SIMPLE APPROACH: Skip headers completely - no word matching at all
      currentPosition += section.content.length;
      return;
    }

    // Only process non-header sections for word matching
    const words = extractWordsFromContent(section.content, finalConfig);

    words.forEach((word, wordIndex) => {
      if (matchCount >= finalConfig.maxConversionsPerArticle) {
        return; // Stop if we've reached the limit
      }

      const cleanWord = cleanWordForMatching(word, finalConfig);

      // Skip words that are too short or too long
      if (
        cleanWord.length < finalConfig.minWordLength ||
        cleanWord.length > finalConfig.maxWordLength
      ) {
        return;
      }

      // Skip Indonesian conjunctions if configured
      if (
        finalConfig.excludeConjunctions &&
        isIndonesianConjunction(cleanWord)
      ) {
        return;
      }

      // NEW: Skip if this word has already been converted
      if (convertedWords.has(cleanWord.toLowerCase())) {
        return;
      }

      // Check for exact matches first
      const exactMatch = targetVariations.get(cleanWord.toLowerCase());
      if (exactMatch) {
        const position = currentPosition + section.content.indexOf(word);
        const context = extractContext(section.content, word, finalConfig);

        wordMatches.push({
          word,
          targetLink: exactMatch,
          position,
          context,
          matchType: "exact",
        });

        // NEW: Mark this word as converted
        convertedWords.add(cleanWord.toLowerCase());

        matchCount++;
        console.log(
          `✅ Found exact match: "${word}" → "${exactMatch.targetTitle}"`,
        );
        return;
      }

      // Check for partial matches
      for (const [targetWord, targetLink] of targetVariations) {
        if (matchCount >= finalConfig.maxConversionsPerArticle) break;

        const relevance = calculateRelevance(
          cleanWord,
          targetWord,
          finalConfig,
        );
        if (relevance >= finalConfig.minRelevanceScore) {
          const position = currentPosition + section.content.indexOf(word);
          const context = extractContext(section.content, word, finalConfig);

          wordMatches.push({
            word,
            targetLink,
            position,
            context,
            matchType: "partial",
            relevance,
          });

          // NEW: Mark this word as converted
          convertedWords.add(cleanWord.toLowerCase());

          matchCount++;
          console.log(
            `✅ Found partial match: "${word}" → "${targetLink.targetTitle}" (relevance: ${relevance.toFixed(2)})`,
          );
          break;
        }
      }
    });

    currentPosition += section.content.length;
  });

  console.log(`📊 Word matches found: ${wordMatches.length}`);

  if (wordMatches.length === 0) {
    console.log(
      `⚠️  No word matches found for conversion in "${currentPost.slug}"`,
    );
    return createEmptyResult(content, startTime);
  }

  // Step 3: Convert words to links
  const enhancedContent = convertWordsToLinks(
    content,
    wordMatches,
    finalConfig,
  );

  const processingTime = performance.now() - startTime;

  console.log(
    `✅ Word-to-link conversion complete: ${wordMatches.length} words converted in ${processingTime.toFixed(2)}ms`,
  );

  return {
    enhancedContent,
    conversions: wordMatches.map((match) => ({
      originalWord: match.word,
      targetSlug: match.targetLink.targetSlug,
      targetTitle: match.targetLink.targetTitle,
      position: match.position,
      context: match.context,
    })),
    statistics: {
      totalWords: content.split(/\s+/).length,
      convertedWords: wordMatches.length,
      processingTime,
    },
  };
}

/**
 * NEW: Convert words to internal links in HTML content
 *
 * This function processes already-rendered HTML content to add internal links
 * while preserving the HTML structure and avoiding headers.
 */
export async function convertWordsToInternalLinksInHTML(
  htmlContent: string,
  currentPost: CollectionEntry<"blog">,
  allPosts: CollectionEntry<"blog">[],
  config: Partial<WordToLinkConfig> = {},
): Promise<WordToLinkResult> {
  const startTime = performance.now();
  const finalConfig = { ...DEFAULT_WORD_TO_LINK_CONFIG, ...config };

  // Step 1: Generate internal link suggestions
  const linkSuggestions = generateInternalLinks(
    currentPost,
    allPosts,
    finalConfig.maxConversionsPerArticle,
  );

  if (linkSuggestions.length === 0) {
    return createEmptyResult(htmlContent, startTime);
  }

  // Step 2: Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;

  // Step 3: Find and convert words in text nodes (excluding headers)
  const conversions = await processHTMLNodes(
    tempDiv,
    linkSuggestions,
    finalConfig,
  );

  // Step 4: Get the processed HTML
  const enhancedContent = tempDiv.innerHTML;

  const processingTime = performance.now() - startTime;

  return {
    enhancedContent,
    conversions,
    statistics: {
      totalWords: htmlContent.split(/\s+/).length,
      convertedWords: conversions.length,
      processingTime,
    },
  };
}

/**
 * Process HTML nodes to find and convert words to links
 */
async function processHTMLNodes(
  element: HTMLElement,
  linkSuggestions: InternalLinkSuggestion[],
  config: WordToLinkConfig,
): Promise<
  Array<{
    originalWord: string;
    targetSlug: string;
    targetTitle: string;
    position: number;
    context: string;
  }>
> {
  const conversions: Array<{
    originalWord: string;
    targetSlug: string;
    targetTitle: string;
    position: number;
    context: string;
  }> = [];

  // Create target variations map
  const targetVariations = new Map<string, InternalLinkSuggestion>();
  linkSuggestions.forEach((link) => {
    const title = link.targetTitle;
    const variations = generateWordVariations(title, config);
    variations.forEach((variation) => {
      if (
        variation.length >= config.minWordLength &&
        variation.length <= config.maxWordLength
      ) {
        targetVariations.set(variation.toLowerCase(), link);
      }
    });
  });

  // Process all text nodes in the element
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode: function (node) {
      // Skip text nodes in headers
      const parent = node.parentElement;
      if (parent && /^h[1-6]$/i.test(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }

      // Skip text nodes in excluded elements
      if (
        parent &&
        config.excludeSelectors.some((selector) => parent.matches(selector))
      ) {
        return NodeFilter.FILTER_REJECT;
      }

      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let node;
  while ((node = walker.nextNode())) {
    const textNode = node as Text;
    const text = textNode.textContent || "";

    // Find word matches in this text node
    const matches = findWordMatchesInText(text, targetVariations, config);

    if (matches.length > 0) {
      // Replace the text node with links
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;

      matches.forEach((match) => {
        // Add text before the match
        if (match.startIndex > lastIndex) {
          fragment.appendChild(
            document.createTextNode(
              text.substring(lastIndex, match.startIndex),
            ),
          );
        }

        // Create the link element
        const link = document.createElement("a");
        link.href = `/docs/${match.targetLink.targetSlug}`;
        link.className = "word-internal-link word-link-invisible";
        link.title = cleanTooltipText(match.targetLink.targetTitle);
        link.textContent = match.word;

        fragment.appendChild(link);
        lastIndex = match.endIndex;

        // Add to conversions
        conversions.push({
          originalWord: match.word,
          targetSlug: match.targetLink.targetSlug,
          targetTitle: match.targetLink.targetTitle,
          position: match.startIndex,
          context: text.substring(
            Math.max(0, match.startIndex - 20),
            match.endIndex + 20,
          ),
        });
      });

      // Add remaining text
      if (lastIndex < text.length) {
        fragment.appendChild(
          document.createTextNode(text.substring(lastIndex)),
        );
      }

      // Replace the text node with the fragment
      textNode.parentNode?.replaceChild(fragment, textNode);
    }
  }

  return conversions;
}

/**
 * Find word matches for conversion
 * Enhanced to be less restrictive and better at finding matches
 *
 * @param content - Content to search for matches
 * @param linkSuggestions - Available link suggestions
 * @param config - Configuration options
 * @returns Array of word matches for conversion
 */
function findWordMatches(
  content: string,
  linkSuggestions: InternalLinkSuggestion[],
  config: WordToLinkConfig,
): WordMatch[] {
  const matches: WordMatch[] = [];
  const targetVariations = new Map<string, InternalLinkSuggestion>();

  // Create target variations map with more flexible matching
  linkSuggestions.forEach((link) => {
    const title = link.targetTitle;
    const variations = generateWordVariations(title, config);

    // Add variations to the map
    variations.forEach((variation) => {
      if (
        variation.length >= config.minWordLength &&
        variation.length <= config.maxWordLength
      ) {
        targetVariations.set(variation.toLowerCase(), link);
      }
    });

    // Also add individual words from the title for better matching
    const titleWords = title.split(/\s+/);
    titleWords.forEach((word) => {
      const cleanWord = cleanWordForMatching(word, config);
      if (
        cleanWord.length >= config.minWordLength &&
        cleanWord.length <= config.maxWordLength
      ) {
        targetVariations.set(cleanWord.toLowerCase(), link);
      }
    });
  });

  // Split content into sections to avoid headers
  const sections = splitContentIntoSections(content, config);

  let currentPosition = 0;
  let matchCount = 0;

  // Process each section
  sections.forEach((section, sectionIndex) => {
    if (section.isHeader) {
      // SIMPLE APPROACH: Skip headers completely - no word matching at all
      currentPosition += section.content.length;
      return;
    }

    // Only process non-header sections for word matching
    const words = extractWordsFromContent(section.content, config);

    words.forEach((word, wordIndex) => {
      if (matchCount >= config.maxConversionsPerArticle) {
        return; // Stop if we've reached the limit
      }

      const cleanWord = cleanWordForMatching(word, config);

      // Skip words that are too short or too long
      if (
        cleanWord.length < config.minWordLength ||
        cleanWord.length > config.maxWordLength
      ) {
        return;
      }

      // Skip Indonesian conjunctions if configured
      if (config.excludeConjunctions && isIndonesianConjunction(cleanWord)) {
        return;
      }

      // Check for exact matches first
      const exactMatch = targetVariations.get(cleanWord.toLowerCase());
      if (exactMatch) {
        const position = currentPosition + section.content.indexOf(word);
        const context = extractContext(section.content, word, config);

        matches.push({
          word,
          targetLink: exactMatch,
          position,
          context,
          matchType: "exact",
        });

        matchCount++;
        console.log(
          `✅ Found exact match: "${word}" → "${exactMatch.targetTitle}"`,
        );
        return;
      }

      // Check for partial matches
      for (const [targetWord, targetLink] of targetVariations) {
        if (matchCount >= config.maxConversionsPerArticle) break;

        const relevance = calculateRelevance(cleanWord, targetWord, config);
        if (relevance >= config.minRelevanceScore) {
          const position = currentPosition + section.content.indexOf(word);
          const context = extractContext(section.content, word, config);

          matches.push({
            word,
            targetLink,
            position,
            context,
            matchType: "partial",
            relevance,
          });

          matchCount++;
          console.log(
            `✅ Found partial match: "${word}" → "${targetLink.targetTitle}" (relevance: ${relevance.toFixed(2)})`,
          );
          break;
        }
      }
    });

    currentPosition += section.content.length;
  });

  // Sort matches by relevance (highest first) and limit to maxConversionsPerArticle
  return matches
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, config.maxConversionsPerArticle);
}

/**
 * Find word matches in text content
 */
function findWordMatchesInText(
  text: string,
  targetVariations: Map<string, InternalLinkSuggestion>,
  config: WordToLinkConfig,
): Array<{
  word: string;
  startIndex: number;
  endIndex: number;
  targetLink: InternalLinkSuggestion;
}> {
  const matches: Array<{
    word: string;
    startIndex: number;
    endIndex: number;
    targetLink: InternalLinkSuggestion;
  }> = [];

  const words = text.split(/\s+/);
  let currentIndex = 0;

  words.forEach((word) => {
    const cleanWord = cleanWordForMatching(word, config);

    if (
      cleanWord.length < config.minWordLength ||
      cleanWord.length > config.maxWordLength
    ) {
      currentIndex += word.length + 1; // +1 for space
      return;
    }

    // Check if word is a conjunction
    if (config.excludeConjunctions && isIndonesianConjunction(cleanWord)) {
      currentIndex += word.length + 1;
      return;
    }

    // Check if word is a complete Indonesian word
    if (config.respectIndonesianWords && !isCompleteIndonesianWord(cleanWord)) {
      currentIndex += word.length + 1;
      return;
    }

    // Check for exact matches
    const exactMatch = targetVariations.get(cleanWord.toLowerCase());
    if (exactMatch) {
      matches.push({
        word: word,
        startIndex: currentIndex,
        endIndex: currentIndex + word.length,
        targetLink: exactMatch,
      });
    }

    currentIndex += word.length + 1; // +1 for space
  });

  return matches;
}

/**
 * NEW: Split content into sections and identify headers
 *
 * Enhanced to detect all possible header formats with more robust detection
 * CRITICAL FIX: Must exclude ALL header content completely
 *
 * @param content - Content to split into sections
 * @param config - Configuration options
 * @returns Array of content sections with header identification
 */
function splitContentIntoSections(
  content: string,
  config: WordToLinkConfig,
): Array<{
  content: string;
  isHeader: boolean;
  startPosition: number;
  endPosition: number;
}> {
  const sections: Array<{
    content: string;
    isHeader: boolean;
    startPosition: number;
    endPosition: number;
  }> = [];

  const lines = content.split("\n");
  let currentPosition = 0;

  lines.forEach((line, lineIndex) => {
    const lineLength = line.length + 1; // +1 for newline
    const trimmedLine = line.trim();

    // CRITICAL FIX: Use comprehensive header detection
    const isHeader = isComprehensiveHeader(
      line,
      lineIndex,
      lines.length,
      config,
    );

    if (!isHeader) {
      // Regular content line - process for links
      sections.push({
        content: line,
        isHeader: false,
        startPosition: currentPosition,
        endPosition: currentPosition + lineLength,
      });
    } else {
      // Header line - mark as header but don't process
      sections.push({
        content: line,
        isHeader: true,
        startPosition: currentPosition,
        endPosition: currentPosition + lineLength,
      });
    }

    currentPosition += lineLength;
  });

  return sections;
}

/**
 * NEW: Comprehensive header detection with multiple protection layers
 *
 * This function provides robust header detection using multiple strategies:
 * 1. Pattern-based detection for markdown headers
 * 2. Content-based detection for title-like content
 * 3. Position-based detection for first lines
 * 4. Keyword-based detection for specific content
 *
 * @param line - Line to check for header status
 * @param lineIndex - Index of the line in the content
 * @param totalLines - Total number of lines in content
 * @param config - Configuration options
 * @returns True if line should be treated as a header
 */
function isComprehensiveHeader(
  line: string,
  lineIndex: number,
  totalLines: number,
  config: WordToLinkConfig,
): boolean {
  if (!config.excludeHeaders) return false;

  const trimmedLine = line.trim();

  // Check cache first for performance (use line content as key)
  const cacheKey = `${trimmedLine}_${lineIndex}_${totalLines}`;
  if (performanceCache.headerDetection.has(cacheKey)) {
    return performanceCache.headerDetection.get(cacheKey)!;
  }

  // Layer 1: Markdown Header Patterns (Most Reliable)
  const markdownHeaderPatterns = [
    /^#{1,6}\s+/, // # ## ### #### ##### ######
    /^#{1,6}$/, // Standalone header markers
    /^[=\-]{3,}$/, // Underlined headers (=== or ---)
  ];

  for (const pattern of markdownHeaderPatterns) {
    if (pattern.test(trimmedLine)) {
      performanceCache.headerDetection.set(cacheKey, true);
      return true;
    }
  }

  // Layer 2: HTML Header Tags
  const htmlHeaderPatterns = [
    /<h[1-6][^>]*>.*<\/h[1-6]>/, // <h1> to <h6> tags
    /<h[1-6][^>]*\/>/, // Self-closing header tags
  ];

  for (const pattern of htmlHeaderPatterns) {
    if (pattern.test(trimmedLine)) {
      performanceCache.headerDetection.set(cacheKey, true);
      return true;
    }
  }

  // Layer 3: Position-Based Detection (First few lines are often headers)
  if (lineIndex < 5 && trimmedLine.length > 5 && trimmedLine.length < 100) {
    const isTitleLike =
      /^[A-Z]/.test(trimmedLine) &&
      !/[.!?]$/.test(trimmedLine) &&
      trimmedLine.split(/\s+/).length <= 15;

    if (isTitleLike) {
      performanceCache.headerDetection.set(cacheKey, true);
      return true;
    }
  }

  // Layer 4: Keyword-Based Detection (Specific content patterns)
  const headerKeywords = [
    "Filosofi",
    "Landasan",
    "Metodologi",
    "Pembelajaran",
    "Bahasa",
    "Introduction",
    "Pendahuluan",
    "Kesimpulan",
    "Conclusion",
    "Chapter",
    "Bab",
    "Section",
    "Bagian",
    "Part",
    "Bagian",
  ];

  const hasHeaderKeywords = headerKeywords.some(
    (keyword) => trimmedLine.includes(keyword) && trimmedLine.includes(":"),
  );

  if (hasHeaderKeywords && trimmedLine.length > 20) {
    performanceCache.headerDetection.set(cacheKey, true);
    return true;
  }

  // Layer 5: Content Structure Detection
  const isStructuredHeader =
    trimmedLine.includes(":") &&
    trimmedLine.length > 15 &&
    trimmedLine.length < 80 &&
    /^[A-Z]/.test(trimmedLine) &&
    trimmedLine.split(/\s+/).length <= 12;

  if (isStructuredHeader) {
    performanceCache.headerDetection.set(cacheKey, true);
    return true;
  }

  // Cache the result (not a header)
  performanceCache.headerDetection.set(cacheKey, false);
  return false;
}

/**
 * Extract words from content for processing
 *
 * @param content - Content to extract words from
 * @param config - Configuration options
 * @returns Array of words to process
 */
function extractWordsFromContent(
  content: string,
  config: WordToLinkConfig,
): string[] {
  return content.split(/\s+/).filter((word) => {
    const cleanWord = cleanWordForMatching(word, config);
    return (
      cleanWord.length >= config.minWordLength &&
      cleanWord.length <= config.maxWordLength
    );
  });
}

/**
 * Extract context around a word
 *
 * @param content - Content containing the word
 * @param word - Word to get context for
 * @param config - Configuration options
 * @returns Context string around the word
 */
function extractContext(
  content: string,
  word: string,
  config: WordToLinkConfig,
): string {
  const index = content.indexOf(word);
  if (index === -1) return word;

  const start = Math.max(0, index - 50);
  const end = Math.min(content.length, index + word.length + 50);
  return content.substring(start, end).trim();
}

/**
 * Calculate relevance between two words
 *
 * @param word1 - First word
 * @param word2 - Second word
 * @param config - Configuration options
 * @returns Relevance score between 0 and 1
 */
function calculateRelevance(
  word1: string,
  word2: string,
  config: WordToLinkConfig,
): number {
  const w1 = word1.toLowerCase();
  const w2 = word2.toLowerCase();

  // Exact match gets highest score
  if (w1 === w2) return 1.0;

  // Check if one contains the other
  if (w1.includes(w2) || w2.includes(w1)) {
    const longer = w1.length > w2.length ? w1 : w2;
    const shorter = w1.length > w2.length ? w2 : w1;
    return shorter.length / longer.length;
  }

  // Calculate similarity using simple character matching
  let matches = 0;
  const maxLength = Math.max(w1.length, w2.length);

  for (let i = 0; i < Math.min(w1.length, w2.length); i++) {
    if (w1[i] === w2[i]) matches++;
  }

  return matches / maxLength;
}

/**
 * NEW: Check if word appears to be in a header context
 * Additional safety check for header detection
 *
 * @param content - Content line containing the word
 * @param wordIndex - Index of the word in the line
 * @param words - Array of words in the line
 * @returns True if word appears to be in a header context
 */
function isWordInHeaderContext(
  content: string,
  wordIndex: number,
  words: string[],
): boolean {
  const line = content.trim();

  // Check for markdown header patterns
  if (/^#{1,6}\s+/.test(line)) {
    return true;
  }

  // Check for HTML header patterns
  if (/<h[1-6][^>]*>.*<\/h[1-6]>/.test(line)) {
    return true;
  }

  // Check if this is a short line that might be a header
  if (words.length <= 5 && wordIndex === 0) {
    // Very short lines are likely headers
    return true;
  }

  // Check for underlined headers (=== or ---)
  const nextLine = content.split("\n")[1] || "";
  if (/^[=\-]{3,}$/.test(nextLine.trim())) {
    return true;
  }

  return false;
}

/**
 * NEW: Check if word is an Indonesian conjunction
 * Excludes Indonesian conjunctions from being converted to links
 *
 * @param word - Word to check
 * @returns True if word is an Indonesian conjunction
 */
function isIndonesianConjunction(word: string): boolean {
  const cleanWord = word.toLowerCase().trim();

  // Check cache first for performance
  if (performanceCache.conjunctionDetection.has(cleanWord)) {
    return performanceCache.conjunctionDetection.get(cleanWord)!;
  }

  // Check against the comprehensive conjunction list
  const isConjunction = INDONESIAN_CONJUNCTIONS.includes(cleanWord);

  // Cache the result
  performanceCache.conjunctionDetection.set(cleanWord, isConjunction);

  if (isConjunction) {
    console.log(`🚫 Excluding Indonesian conjunction: "${word}"`);
  }

  return isConjunction;
}

/**
 * NEW: Check if word is a complete Indonesian word
 * Respects Indonesian word boundaries and grammar
 *
 * @param word - Word to check
 * @returns True if word is a complete Indonesian word
 */
function isCompleteIndonesianWord(word: string): boolean {
  // Remove common Indonesian prefixes and suffixes
  const prefixes = ["ber", "ter", "per", "se", "ke", "di", "me", "pe"];
  const suffixes = ["kan", "an", "i", "nya", "lah", "kah", "tah", "pun"];

  let baseWord = word.toLowerCase();

  // Check for prefixes
  for (const prefix of prefixes) {
    if (baseWord.startsWith(prefix) && baseWord.length > prefix.length + 2) {
      baseWord = baseWord.substring(prefix.length);
      break;
    }
  }

  // Check for suffixes
  for (const suffix of suffixes) {
    if (baseWord.endsWith(suffix) && baseWord.length > suffix.length + 2) {
      baseWord = baseWord.substring(0, baseWord.length - suffix.length);
      break;
    }
  }

  // Check if the base word is substantial (at least 3 characters)
  return baseWord.length >= 3;
}

/**
 * Generate word variations for matching
 * NEW: Respects Indonesian word structure
 *
 * Creates multiple variations of post titles to improve matching coverage
 * including full titles, individual words, and key phrases.
 *
 * @param title - Post title to generate variations from
 * @param config - Configuration options
 * @returns Array of word/phrase variations
 */
function generateWordVariations(
  title: string,
  config: WordToLinkConfig,
): string[] {
  // Check cache first for performance
  const cacheKey = `${title}_${config.minWordLength}_${config.maxWordLength}`;
  if (performanceCache.wordVariations.has(cacheKey)) {
    return performanceCache.wordVariations.get(cacheKey)!;
  }

  const variations: string[] = [];

  // Add the full title
  variations.push(title);

  // Add individual words from the title
  const words = title.split(/\s+/);
  words.forEach((word) => {
    const cleanWord = cleanWordForMatching(word, config);
    if (cleanWord.length >= config.minWordLength) {
      variations.push(cleanWord);
    }
  });

  // Add key phrases (2-word combinations)
  for (let i = 0; i < words.length - 1; i++) {
    const phrase = words.slice(i, i + 2).join(" ");
    if (
      phrase.length >= config.minWordLength &&
      phrase.length <= config.maxWordLength
    ) {
      variations.push(phrase);
    }
  }

  // Add 3-word phrases for longer titles
  if (words.length >= 3) {
    for (let i = 0; i < words.length - 2; i++) {
      const phrase = words.slice(i, i + 3).join(" ");
      if (
        phrase.length >= config.minWordLength &&
        phrase.length <= config.maxWordLength
      ) {
        variations.push(phrase);
      }
    }
  }

  // Cache the result
  performanceCache.wordVariations.set(cacheKey, variations);
  return variations;
}

/**
 * Clean word for matching (remove punctuation, etc.)
 * NEW: Better handling for Indonesian words
 *
 * @param word - Word to clean
 * @param config - Configuration options
 * @returns Cleaned word for matching
 */
function cleanWordForMatching(word: string, config: WordToLinkConfig): string {
  // Check cache first for performance
  const cacheKey = `${word}_${config.respectIndonesianWords}`;
  if (performanceCache.cleanedWords.has(cacheKey)) {
    return performanceCache.cleanedWords.get(cacheKey)!;
  }

  // Remove punctuation but preserve Indonesian characters
  const cleaned = word.replace(/[^\w\s\u00C0-\u017F]/g, "").trim();

  // If respecting Indonesian words, ensure it's a complete word
  if (config.respectIndonesianWords) {
    // Don't break Indonesian compound words
    if (cleaned.includes("-") || cleaned.includes("_")) {
      performanceCache.cleanedWords.set(cacheKey, cleaned);
      return cleaned;
    }
  }

  // Cache the result
  performanceCache.cleanedWords.set(cacheKey, cleaned);
  return cleaned;
}

/**
 * Get context around a word for relevance assessment
 *
 * @param words - All words in content
 * @param index - Index of target word
 * @returns Context string around the word
 */
function getWordContext(words: string[], index: number): string {
  const start = Math.max(0, index - 3);
  const end = Math.min(words.length, index + 4);
  return words.slice(start, end).join(" ");
}

/**
 * Calculate relevance score for partial matches
 *
 * @param word - Original word
 * @param variation - Matching variation
 * @returns Relevance score (0-1)
 */
function calculatePartialMatchRelevance(
  word: string,
  variation: string,
): number {
  const longer = word.length > variation.length ? word : variation;
  const shorter = word.length <= variation.length ? word : variation;

  // Simple relevance based on length ratio
  const ratio = shorter.length / longer.length;
  return Math.max(0.3, ratio * 0.8); // Minimum 0.3, maximum 0.8 for partial matches
}

// ========== CONTENT CONVERSION ==========

/**
 * Convert words to internal links
 *
 * CRITICAL FIX: This function now respects header boundaries by only processing
 * non-header sections, ensuring no links are created in headers.
 *
 * @param content - Original content
 * @param wordMatches - Words to convert
 * @param config - Configuration options
 * @returns Enhanced content with word-to-link conversions
 */
function convertWordsToLinks(
  content: string,
  wordMatches: WordMatch[],
  config: WordToLinkConfig,
): string {
  if (wordMatches.length === 0) return content;

  // CRITICAL FIX: Split content into sections and only process non-header sections
  const sections = splitContentIntoSections(content, config);
  let enhancedContent = content;
  let currentPosition = 0;

  // Process each section
  sections.forEach((section, sectionIndex) => {
    if (section.isHeader) {
      // Skip header sections completely - no word replacement
      currentPosition += section.content.length;
      return;
    }

    // Only process non-header sections for word replacement
    const sectionMatches = wordMatches.filter(
      (match) =>
        match.position >= currentPosition &&
        match.position < currentPosition + section.content.length,
    );

    if (sectionMatches.length > 0) {
      // Process matches from highest position to lowest to maintain text indices
      const sortedMatches = [...sectionMatches].sort(
        (a, b) => b.position - a.position,
      );

      let sectionContent = section.content;

      sortedMatches.forEach((match) => {
        const linkHTML = generateWordLinkHTML(
          match.word,
          match.targetLink,
          config,
        );

        // Find and replace the specific word occurrence within this section
        const wordRegex = createWordRegex(match.word);
        let replacementCount = 0;

        sectionContent = sectionContent.replace(wordRegex, (foundWord) => {
          replacementCount++;
          // Only replace the first occurrence to avoid over-linking
          return replacementCount === 1 ? linkHTML : foundWord;
        });
      });

      // Replace the section content in the enhanced content
      enhancedContent = enhancedContent.replace(
        section.content,
        sectionContent,
      );
    }

    currentPosition += section.content.length;
  });

  return enhancedContent;
}

/**
 * NEW: Final safety check to remove any links from headers
 *
 * This function provides a last layer of protection by removing any HTML links
 * that might have been created in header content. It uses multiple strategies:
 * 1. Remove links from markdown headers
 * 2. Remove links from HTML headers
 * 3. Remove links from title-like content
 *
 * @param content - Content to clean
 * @param config - Configuration options
 * @returns Cleaned content with no links in headers
 */
function removeLinksFromHeaders(
  content: string,
  config: WordToLinkConfig,
): string {
  if (!config.excludeHeaders) return content;

  let cleanedContent = content;
  const lines = content.split("\n");

  lines.forEach((line, lineIndex) => {
    const trimmedLine = line.trim();

    // Check if this line is a header
    const isHeader = isComprehensiveHeader(
      line,
      lineIndex,
      lines.length,
      config,
    );

    if (isHeader) {
      // Remove any HTML links from header content
      const originalLine = line;
      const cleanedLine = line.replace(/<a[^>]*>(.*?)<\/a>/g, "$1");

      // Replace the line in the content
      cleanedContent = cleanedContent.replace(originalLine, cleanedLine);
    }
  });

  return cleanedContent;
}

/**
 * Generate HTML for word-to-link conversion
 *
 * Creates properly formatted HTML that looks like normal text but functions
 * as an internal link with hover tooltips.
 *
 * @param originalWord - Original word from content
 * @param targetLink - Target link information
 * @param config - Configuration options
 * @returns HTML string for word link
 */
function generateWordLinkHTML(
  originalWord: string,
  targetLink: InternalLinkSuggestion,
  config: WordToLinkConfig,
): string {
  const linkUrl = `/docs/${targetLink.targetSlug}`;

  // NEW: Clean tooltip text to show only the post title
  const tooltipText = cleanTooltipText(targetLink.targetTitle);

  let className = "word-internal-link";

  // Apply styling based on config
  switch (config.linkStyle) {
    case "invisible":
      className += " word-link-invisible";
      break;
    case "subtle":
      className += " word-link-subtle";
      break;
    case "minimal":
      className += " word-link-minimal";
      break;
  }

  // Add tooltip if enabled
  let tooltipAttr = "";
  if (config.showTooltip) {
    tooltipAttr = `title="${tooltipText}"`;
  }

  return `<a href="${linkUrl}" class="${className}" ${tooltipAttr}>${originalWord}</a>`;
}

/**
 * Create regex for word matching with word boundaries
 *
 * @param word - Word to create regex for
 * @returns RegExp for word matching
 */
function createWordRegex(word: string): RegExp {
  const escapedWord = escapeRegex(word);
  return new RegExp(`\\b${escapedWord}\\b`, "g");
}

/**
 * NEW: Clean tooltip text to show only the post title
 * Removes prefixes like "Baca juga:" and other formatting
 *
 * @param title - Original title to clean
 * @returns Cleaned title without prefixes
 */
function cleanTooltipText(title: string): string {
  // Remove common prefixes
  const prefixesToRemove = [
    "Baca juga:",
    "Baca juga :",
    "Related:",
    "Related :",
    "Lihat juga:",
    "Lihat juga :",
    "📖",
    "🔗",
    "📘",
  ];

  let cleanTitle = title;

  // Remove prefixes
  prefixesToRemove.forEach((prefix) => {
    if (cleanTitle.startsWith(prefix)) {
      cleanTitle = cleanTitle.substring(prefix.length).trim();
    }
  });

  // Remove extra whitespace and normalize
  cleanTitle = cleanTitle.replace(/\s+/g, " ").trim();

  // If title is empty after cleaning, use original
  if (!cleanTitle) {
    return title;
  }

  return cleanTitle;
}

/**
 * Escape regex special characters
 *
 * @param string - String to escape
 * @returns Escaped string safe for regex
 */
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ========== UTILITY FUNCTIONS ==========

/**
 * Create empty result for error cases
 *
 * @param content - Original content
 * @param startTime - Processing start time
 * @returns Empty word-to-link result
 */
function createEmptyResult(
  content: string,
  startTime: number,
): WordToLinkResult {
  return {
    enhancedContent: content,
    conversions: [],
    statistics: {
      totalWords: content.split(/\s+/).length,
      convertedWords: 0,
      processingTime: performance.now() - startTime,
    },
  };
}

// ========== EXPORTS ==========

/**
 * Quick utility function for simple word-to-link conversion
 * Uses default configuration for ease of use
 */
export async function convertWords(
  content: string,
  currentPost: CollectionEntry<"blog">,
  allPosts: CollectionEntry<"blog">[],
): Promise<string> {
  const result = await convertWordsToInternalLinks(
    content,
    currentPost,
    allPosts,
  );
  return result.enhancedContent;
}

/**
 * Configuration builder for custom setups
 */
export function createWordToLinkConfig(
  overrides: Partial<WordToLinkConfig>,
): WordToLinkConfig {
  return { ...DEFAULT_WORD_TO_LINK_CONFIG, ...overrides };
}
