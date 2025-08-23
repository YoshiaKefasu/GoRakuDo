// Auto Content Extractor
// Automatically extracts content, keywords, and search data from markdown files
// Processes content at build time for optimal performance
// Enhanced multi-language support: English, Japanese, Indonesian

import type { CollectionEntry } from "astro:content";

export interface ExtractedContent {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  content: string;
  keywords: string[];
  searchableText: string;
  wordCount: number;
  readingTime: number;
  language: "id" | "en" | "jp" | "mixed";
  contentType: string;
  complexity: "beginner" | "intermediate" | "advanced";
}

/**
 * Automated Content Extractor
 * Processes markdown content and generates search data automatically
 * Enhanced multi-language support for English, Japanese, and Indonesian
 */
export class AutoContentExtractor {
  private stopWords: Set<string> = new Set();
  private technicalTerms: Set<string> = new Set();

  constructor() {
    this.initializeLanguageData();
  }

  /**
   * Initialize language-specific data for content analysis
   */
  private initializeLanguageData(): void {
    // Multi-language stop words
    this.stopWords = new Set([
      // Indonesian stop words
      "yang",
      "dan",
      "atau",
      "dengan",
      "untuk",
      "dari",
      "ke",
      "di",
      "pada",
      "oleh",
      "sebagai",
      "dalam",
      "adalah",
      "akan",
      "sudah",
      "belum",
      "tidak",
      "bukan",
      "ini",
      "itu",
      "saya",
      "anda",
      "mereka",
      "kami",
      "kita",
      "dia",
      "mereka",
      "ada",
      "juga",
      "saja",
      "lagi",
      "sudah",
      "masih",
      "pernah",
      "belum",
      "akan",
      "bisa",
      "dapat",
      "harus",
      "perlu",
      "mau",
      "ingin",
      "suka",
      "tidak",
      "jangan",

      // English stop words
      "the",
      "and",
      "or",
      "with",
      "for",
      "from",
      "to",
      "in",
      "on",
      "by",
      "as",
      "is",
      "are",
      "was",
      "were",
      "will",
      "would",
      "can",
      "could",
      "this",
      "that",
      "these",
      "those",
      "i",
      "you",
      "he",
      "she",
      "it",
      "we",
      "they",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "be",
      "been",
      "being",
      "am",

      // Japanese stop words
      "は",
      "が",
      "を",
      "に",
      "へ",
      "で",
      "から",
      "まで",
      "の",
      "と",
      "や",
      "も",
      "か",
      "ね",
      "よ",
      "です",
      "ます",
      "だ",
      "である",
      "いる",
      "ある",
      "する",
      "なる",
      "できる",
      "わかる",
      "これ",
      "それ",
      "あれ",
      "この",
      "その",
      "あの",
      "ここ",
      "そこ",
      "あそこ",
    ]);

    // Technical terms for language learning (multi-language)
    this.technicalTerms = new Set([
      // English terms
      "immersion",
      "anki",
      "srs",
      "spaced repetition",
      "flashcards",
      "comprehensible input",
      "input hypothesis",
      "krashen",
      "natural approach",
      "hiragana",
      "katakana",
      "kanji",
      "jlpt",
      "n5",
      "n4",
      "n3",
      "n2",
      "n1",
      "vocabulary",
      "grammar",
      "pronunciation",
      "listening",
      "speaking",
      "reading",
      "writing",
      "acquisition",
      "learning",
      "monitor hypothesis",
      "affective filter",
      "natural order",
      "acquisition learning",

      // Indonesian terms
      "pembelajaran",
      "metodologi",
      "filosofi",
      "pendekatan",
      "teknik",
      "kosakata",
      "tata bahasa",
      "pelafalan",
      "mendengarkan",
      "berbicara",
      "membaca",
      "menulis",
      "pemerolehan",
      "belajar",
      "hipotesis monitor",
      "filter afektif",
      "urutan alami",
      "pembelajaran pemerolehan",
      "secara alami",
      "pemahaman kontekstual",
      "penggunaan bahasa",
      "landasan metodologi",
      "prinsip dasar",
      "paparan konstan",
      "fokus makna",
      "lima hipotesis",
      "pemerolehan bahasa",
      "tidak sadar",
      "pembelajaran sadar",
      "aturan tata bahasa",
      "input yang dapat dipahami",
      "sedikit di atas level",
      "pemahaman konteks",
      "pengulangan alami",
      "indikator kemajuan",

      // Japanese terms
      "イマージョン",
      "アンキ",
      "間隔反復",
      "フラッシュカード",
      "理解可能な入力",
      "入力仮説",
      "クラッシェン",
      "自然アプローチ",
      "ひらがな",
      "カタカナ",
      "漢字",
      "語彙",
      "文法",
      "発音",
      "リスニング",
      "スピーキング",
      "リーディング",
      "ライティング",
      "習得",
      "学習",
      "モニター仮説",
      "情意フィルター",
      "自然順序",
      "習得学習",
    ]);
  }

  /**
   * Extract content from a markdown post
   */
  public extractContent(post: CollectionEntry<"blog">): ExtractedContent {
    const { slug, data, body } = post;

    // Extract basic metadata
    const title = data.title || "";
    const description = data.description || "";
    const tags = data.tags || [];

    // Process markdown body content
    const rawContent = this.extractMarkdownContent(body);
    const processedContent = this.processContent(rawContent);

    // Generate keywords automatically (multi-language)
    const keywords = this.generateKeywords(
      processedContent,
      title,
      description,
      tags,
    );

    // Determine language with enhanced detection
    const language = this.detectLanguage(processedContent, title, description);

    // Calculate metrics
    const wordCount = this.calculateWordCount(processedContent);
    const readingTime = this.calculateReadingTime(wordCount, language);

    // Generate searchable text
    const searchableText = this.generateSearchableText(
      title,
      description,
      tags,
      processedContent,
      keywords,
    );

    return {
      slug,
      title: title.toLowerCase(),
      description: description.toLowerCase(),
      tags: tags.map((tag: string) => tag.toLowerCase()),
      content: processedContent.toLowerCase(),
      keywords: keywords.map((k) => k.toLowerCase()),
      searchableText: searchableText.toLowerCase(),
      wordCount,
      readingTime,
      language,
      contentType: this.detectContentType(
        title,
        description,
        tags,
        processedContent,
      ),
      complexity: this.detectComplexity(processedContent, wordCount, language),
    };
  }

  /**
   * Extract content from markdown body, removing markdown syntax
   * Enhanced to preserve Japanese characters
   */
  private extractMarkdownContent(body: string): string {
    return (
      body
        // Remove markdown headers
        .replace(/^#{1,6}\s+.*$/gm, "")
        // Remove code blocks
        .replace(/```[\s\S]*?```/g, "")
        // Remove inline code
        .replace(/`([^`]+)`/g, "$1")
        // Remove links but keep text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        // Remove bold/italic
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/\*([^*]+)\*/g, "$1")
        // Remove list markers
        .replace(/^[\s]*[-*+]\s+/gm, "")
        // Remove numbered lists
        .replace(/^[\s]*\d+\.\s+/gm, "")
        // Remove blockquotes
        .replace(/^>\s+/gm, "")
        // Remove horizontal rules
        .replace(/^---$/gm, "")
        // Clean up extra whitespace but preserve Japanese characters
        .replace(/\s+/g, " ")
        .trim()
    );
  }

  /**
   * Process and clean content while preserving multi-language characters
   */
  private processContent(content: string): string {
    return (
      content
        // Remove special characters but keep spaces and multi-language characters
        .replace(
          /[^\w\s\u00C0-\u017F\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g,
          " ",
        )
        // Normalize whitespace
        .replace(/\s+/g, " ")
        .trim()
    );
  }

  /**
   * Generate keywords automatically from content (multi-language)
   */
  private generateKeywords(
    content: string,
    title: string,
    description: string,
    tags: string[],
  ): string[] {
    const allText = `${title} ${description} ${content}`.toLowerCase();
    const words = allText.split(/\s+/);

    // Create word frequency map
    const wordFreq = new Map<string, number>();

    words.forEach((word) => {
      const cleanWord = this.cleanWord(word);
      if (cleanWord.length > 2 && !this.stopWords.has(cleanWord)) {
        wordFreq.set(cleanWord, (wordFreq.get(cleanWord) || 0) + 1);
      }
    });

    // Extract phrases (2-3 word combinations)
    const phrases = this.extractPhrases(allText);

    // Combine single words and phrases
    const keywords = new Set<string>();

    // Add tags first (highest priority)
    tags.forEach((tag) => keywords.add(tag));

    // Add technical terms
    this.technicalTerms.forEach((term) => {
      if (allText.includes(term.toLowerCase())) {
        keywords.add(term);
      }
    });

    // Add high-frequency words
    const sortedWords = Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word]) => word);

    sortedWords.forEach((word) => keywords.add(word));

    // Add meaningful phrases
    phrases.forEach((phrase) => keywords.add(phrase));

    return Array.from(keywords).slice(0, 50);
  }

  /**
   * Clean word while preserving multi-language characters
   */
  private cleanWord(word: string): string {
    return word.replace(
      /[^\w\u00C0-\u017F\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g,
      "",
    );
  }

  /**
   * Extract meaningful phrases from multi-language text
   */
  private extractPhrases(text: string): string[] {
    const phrases: string[] = [];
    const words = text.split(/\s+/);

    // Extract 2-word phrases
    for (let i = 0; i < words.length - 1; i++) {
      const phrase = `${words[i]} ${words[i + 1]}`;
      if (
        phrase.length > 5 &&
        !this.stopWords.has(words[i]) &&
        !this.stopWords.has(words[i + 1])
      ) {
        phrases.push(phrase);
      }
    }

    // Extract 3-word phrases
    for (let i = 0; i < words.length - 2; i++) {
      const phrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
      if (
        phrase.length > 8 &&
        !this.stopWords.has(words[i]) &&
        !this.stopWords.has(words[i + 1]) &&
        !this.stopWords.has(words[i + 2])
      ) {
        phrases.push(phrase);
      }
    }

    return phrases.slice(0, 20);
  }

  /**
   * Detect language of content
   */
  private detectLanguage(
    content: string,
    title: string,
    description: string,
  ): "id" | "en" | "jp" | "mixed" {
    const allText = `${title} ${description} ${content}`;

    const indonesianWords = allText.match(/[a-z]+(?:[^a-z]*[a-z]+)*/gi) || [];
    const englishWords = allText.match(/\b[a-zA-Z]+\b/g) || [];
    const japaneseChars =
      allText.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g) || [];

    const indonesianCount = indonesianWords.length;
    const englishCount = englishWords.length;
    const japaneseCount = japaneseChars.length;

    const totalWords = indonesianCount + englishCount + japaneseCount;

    if (totalWords === 0) return "en"; // Default fallback

    const idPercentage = (indonesianCount / totalWords) * 100;
    const enPercentage = (englishCount / totalWords) * 100;
    const jpPercentage = (japaneseCount / totalWords) * 100;

    // Check for dominant language
    if (jpPercentage > 30) {
      if (jpPercentage > 60) return "jp";
      return "mixed";
    }

    if (idPercentage > 50) return "id";
    if (enPercentage > 50) return "en";

    // Mixed language content
    if (idPercentage > 20 && enPercentage > 20) return "mixed";
    if (jpPercentage > 10) return "mixed";

    return "en"; // Default fallback
  }

  /**
   * Detect content type with multi-language support
   */
  private detectContentType(
    title: string,
    description: string,
    tags: string[],
    content: string,
  ): string {
    const text =
      `${title} ${description} ${tags.join(" ")} ${content}`.toLowerCase();

    // Multi-language content type detection
    if (
      text.includes("anki") ||
      text.includes("flashcard") ||
      text.includes("srs") ||
      text.includes("アンキ") ||
      text.includes("フラッシュカード")
    )
      return "tool";

    if (
      text.includes("immersion") ||
      text.includes("metodologi") ||
      text.includes("filosofi") ||
      text.includes("イマージョン") ||
      text.includes("方法論")
    )
      return "methodology";

    if (
      text.includes("memulai") ||
      text.includes("beginner") ||
      text.includes("pemula") ||
      text.includes("始める") ||
      text.includes("初心者")
    )
      return "guide";

    if (
      text.includes("konten") ||
      text.includes("content") ||
      text.includes("selection") ||
      text.includes("コンテンツ") ||
      text.includes("選択")
    )
      return "guide";

    return "guide"; // default
  }

  /**
   * Detect content complexity
   */
  private detectComplexity(
    content: string,
    wordCount: number,
    language: string,
  ): "beginner" | "intermediate" | "advanced" {
    const technicalTermCount = Array.from(this.technicalTerms).filter((term) =>
      content.includes(term.toLowerCase()),
    ).length;

    // Adjust complexity based on language
    let complexityMultiplier = 1;
    if (language === "jp") complexityMultiplier = 1.2; // Japanese content tends to be more complex
    if (language === "mixed") complexityMultiplier = 1.1; // Mixed language content

    const adjustedTechnicalTerms = technicalTermCount * complexityMultiplier;

    if (adjustedTechnicalTerms > 8 || wordCount > 2000) return "advanced";
    if (adjustedTechnicalTerms > 4 || wordCount > 1000) return "intermediate";
    return "beginner";
  }

  /**
   * Calculate word count for multi-language content
   */
  private calculateWordCount(content: string): number {
    return content.split(/\s+/).filter((word) => word.length > 0).length;
  }

  /**
   * Calculate reading time with language-specific adjustments
   */
  private calculateReadingTime(wordCount: number, language: string): number {
    let wordsPerMinute = 200; // Default English reading speed

    // Adjust reading speed based on language
    switch (language) {
      case "jp":
        wordsPerMinute = 150; // Japanese is slower to read
        break;
      case "id":
        wordsPerMinute = 180; // Indonesian is slightly slower
        break;
      case "mixed":
        wordsPerMinute = 160; // Mixed language content
        break;
      default:
        wordsPerMinute = 200; // English
    }

    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * Generate searchable text combining all content
   */
  private generateSearchableText(
    title: string,
    description: string,
    tags: string[],
    content: string,
    keywords: string[],
  ): string {
    return `${title} ${description} ${tags.join(" ")} ${content} ${keywords.join(" ")}`;
  }

  /**
   * Process all posts and generate search data
   */
  public processAllPosts(
    posts: CollectionEntry<"blog">[],
  ): Map<string, ExtractedContent> {
    const extractedData = new Map<string, ExtractedContent>();

    posts.forEach((post) => {
      try {
        const extracted = this.extractContent(post);
        extractedData.set(post.slug, extracted);
      } catch (error) {
        console.error(`Error extracting content for "${post.slug}":`, error);
      }
    });

    return extractedData;
  }
}

// Export singleton instance
export const contentExtractor = new AutoContentExtractor();
