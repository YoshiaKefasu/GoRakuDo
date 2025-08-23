// SearchEngine.ts - Modular Search Engine Implementation
// Google Engineering Team 2025: Modern TypeScript + Performance Optimization

export interface SearchResult {
  post: any;
  score: number;
  matchDetails?: any;
  relevancePercentage: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  searchStrategy: string;
}

export interface SearchData {
  title: string;
  description: string;
  fullContent?: string;
  tags?: string[];
  category?: string;
  difficulty?: string;
  learningStage?: string;
  contentType?: string;
  slug: string;
  url: string;
  searchableText?: string;
  wordCount?: number;
  semanticKeywords?: string[];
  learningObjectives?: string[];
  aiRecommendations?: string[];
  learningPath?: string[];
  contentComplexity?: string;
  hasCodeBlocks?: boolean;
  hasImages?: boolean;
  isRecommended?: boolean;
  isBeginner?: boolean;
  isTool?: boolean;
  indonesianContentRatio?: number;
  hasIndonesianImages?: boolean;
  hasIndonesianSections?: boolean;
}

export interface MatchInfo {
  exactMatches: string[];
  phraseMatches: any[];
  sectionMatches: any[];
  contentMatches: any[];
  metadataMatches: any[];
}

export class IndonesianDocsSearch {
  private posts: any[] = [];
  private searchIndex: Map<string, Map<number, number>> = new Map();
  private currentQuery: string = "";
  private searchResults: SearchResult[] = [];
  private isInitialized: boolean = false;
  private searchTimeout: NodeJS.Timeout | null = null;
  private enhancedSearchData: SearchData[] = [];
  private indonesianStopWords: Set<string>;

  constructor() {
    // Indonesian stop words (minimize to preserve content words)
    this.indonesianStopWords = new Set([
      "dan",
      "atau",
      "dengan",
      "di",
      "ke",
      "dari",
      "untuk",
      "dalam",
      "pada",
      "oleh",
      "karena",
      "adalah",
      "akan",
      "sudah",
      "belum",
      "tidak",
      "bukan",
      "juga",
      "saja",
      "hanya",
      "masih",
      "pernah",
      "kadang",
      "sering",
      "jarang",
      "segera",
      "nanti",
      "kemarin",
      "hari",
      "ini",
      "itu",
      "sana",
      "sini",
      "mana",
      "apa",
      "siapa",
      "kapan",
      "bagaimana",
      "mengapa",
      "berapa",
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
    ]);
  }

  async initialize(): Promise<boolean> {
    try {
      console.log("🇮🇩 Initializing Indonesian Docs Search System...");

      // Load Indonesian search data from build-time generation
      await this.loadIndonesianSearchData();

      // Fallback: Load posts data from the page if enhanced data not available
      if (this.enhancedSearchData.length === 0) {
        await this.loadPostsData();
      }

      // Build Indonesian-optimized search index
      this.buildIndonesianSearchIndex();

      this.isInitialized = true;
      console.log("✅ Indonesian search system ready! 🎯");
      console.log(
        `📊 Indexed ${this.searchIndex.size} Indonesian terms for ${this.posts.length} posts`,
      );

      return true;
    } catch (error) {
      console.error("❌ Failed to initialize Indonesian search:", error);
      return false;
    }
  }

  private async loadIndonesianSearchData(): Promise<void> {
    try {
      // Load search data from build-time generation
      if (typeof window !== "undefined" && (window as any).enhancedSearchData) {
        this.enhancedSearchData = (window as any).enhancedSearchData;
        this.posts = (window as any).enhancedSearchData;
        console.log(
          `🇮🇩 Loaded ${this.enhancedSearchData.length} Indonesian posts for search`,
        );
        return;
      }

      // Fallback: Load posts data from page elements
      await this.loadPostsData();
    } catch (error) {
      console.error("❌ Error loading Indonesian search data:", error);
      await this.loadPostsData();
    }
  }

  private async loadPostsData(): Promise<void> {
    try {
      // Extract posts from the page elements
      const postCards = document.querySelectorAll(".post-card");
      this.posts = Array.from(postCards).map((card) => {
        const titleElement = card.querySelector(".post-title a");
        const descriptionElement = card.querySelector(".post-description");
        const tagsElements = card.querySelectorAll(".post-tag");
        const dateElement = card.querySelector(".post-date");

        return {
          title: titleElement?.textContent || "",
          description: descriptionElement?.textContent || "",
          tags: Array.from(tagsElements).map((tag) => tag.textContent || ""),
          date: dateElement?.textContent || "",
          slug: card.getAttribute("data-post-slug") || "",
          url: `/docs/${card.getAttribute("data-post-slug")}`,
          learningStage: card.getAttribute("data-learning-stage") || "",
          contentType: card.getAttribute("data-content-type") || "",
          isRecommended: card.getAttribute("data-is-recommended") === "true",
          isBeginner: card.getAttribute("data-is-beginner") === "true",
          isTool: card.getAttribute("data-is-tool") === "true",
        };
      });

      console.log(`📚 Loaded ${this.posts.length} posts for search`);
    } catch (error) {
      console.error("❌ Error loading posts data:", error);
      this.posts = [];
    }
  }

  private buildIndonesianSearchIndex(): void {
    this.searchIndex.clear();
    console.log("🔨 Building Indonesian search index...");

    this.posts.forEach((post, index) => {
      const searchData = this.enhancedSearchData[index] || post;

      // Indonesian content priority indexing
      // 1. Title (weight: 5 - highest priority for Indonesian users)
      if (searchData.title) {
        this.indexIndonesianText(searchData.title, index, 5);
      }

      // 2. Description (weight: 4 - very important)
      if (searchData.description) {
        this.indexIndonesianText(searchData.description, index, 4);
      }

      // 3. Tags (weight: 4 - very important for categorization)
      if (searchData.tags && Array.isArray(searchData.tags)) {
        searchData.tags.forEach((tag) => {
          this.indexIndonesianText(tag, index, 4);
        });
      }

      // 4. Category and difficulty (weight: 3 - important for filtering)
      if (searchData.category) {
        this.indexIndonesianText(searchData.category, index, 3);
      }
      if (searchData.difficulty) {
        this.indexIndonesianText(searchData.difficulty, index, 3);
      }
      if (searchData.learningStage) {
        this.indexIndonesianText(searchData.learningStage, index, 3);
      }

      // 5. Full content (weight: 2 - comprehensive search)
      if (searchData.fullContent) {
        this.indexIndonesianText(searchData.fullContent, index, 2);
      }

      // Index by keywords (weight: 2)
      if (
        searchData.semanticKeywords &&
        Array.isArray(searchData.semanticKeywords)
      ) {
        searchData.semanticKeywords.forEach((keyword) => {
          this.indexText(keyword, index, 2);
        });
      }

      // Index by learning objectives (weight: 3)
      if (
        searchData.learningObjectives &&
        Array.isArray(searchData.learningObjectives)
      ) {
        searchData.learningObjectives.forEach((objective) => {
          this.indexText(objective, index, 3);
        });
      }

      // Index by AI recommendations (weight: 2)
      if (
        searchData.aiRecommendations &&
        Array.isArray(searchData.aiRecommendations)
      ) {
        searchData.aiRecommendations.forEach((recommendation) => {
          this.indexText(recommendation, index, 2);
        });
      }

      // Index by learning path (weight: 2)
      if (searchData.learningPath && Array.isArray(searchData.learningPath)) {
        searchData.learningPath.forEach((path) => {
          this.indexText(path, index, 2);
        });
      }

      // Index by metadata fields (weight: 2)
      if (searchData.category) {
        this.indexText(searchData.category, index, 2);
      }
      if (searchData.difficulty) {
        this.indexText(searchData.difficulty, index, 2);
      }
      if (searchData.learningStage) {
        this.indexText(searchData.learningStage, index, 2);
      }
      if (searchData.contentType) {
        this.indexText(searchData.contentType, index, 2);
      }
      if (searchData.contentComplexity) {
        this.indexText(searchData.contentComplexity, index, 2);
      }

      // Index by content features (weight: 1)
      if (searchData.hasCodeBlocks) {
        this.indexText("code blocks", index, 1);
        this.indexText("programming", index, 1);
      }
      if (searchData.hasImages) {
        this.indexText("images", index, 1);
        this.indexText("visual", index, 1);
      }
      if (searchData.isRecommended) {
        this.indexText("recommended", index, 1);
        this.indexText("top", index, 1);
      }
      if (searchData.isBeginner) {
        this.indexText("beginner", index, 1);
        this.indexText("basic", index, 1);
        this.indexText("pemanasan", index, 1);
      }
      if (searchData.isTool) {
        this.indexText("tool", index, 1);
        this.indexText("utility", index, 1);
        this.indexText("anki", index, 1);
      }

      // Index by searchable text (weight: 1)
      if (searchData.searchableText) {
        this.indexText(searchData.searchableText, index, 1);
      }
    });

    console.log(
      `🔍 Built comprehensive search index with ${this.searchIndex.size} terms`,
    );
  }

  private indexIndonesianText(
    text: string,
    postIndex: number,
    weight: number,
  ): void {
    if (!text) return;

    const words = this.tokenizeIndonesian(text);
    words.forEach((word) => {
      if (!this.searchIndex.has(word)) {
        this.searchIndex.set(word, new Map());
      }

      const postWeights = this.searchIndex.get(word)!;
      const currentWeight = postWeights.get(postIndex) || 0;
      postWeights.set(postIndex, currentWeight + weight);
    });
  }

  private indexText(text: string, postIndex: number, weight: number): void {
    // Legacy method redirects to Indonesian indexing
    this.indexIndonesianText(text, postIndex, weight);
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length >= 2)
      .filter((word) => !this.isStopWord(word))
      .map((word) => this.normalizeWord(word));
  }

  private normalizeWord(word: string): string {
    const englishToIndonesian: Record<string, string> = {
      popular: "populer",
      recommend: "rekomen",
      recommendation: "rekomendasi",
      method: "metode",
      strategy: "strategi",
      technology: "teknologi",
      grammar: "tata bahasa",
      vocabulary: "kosakata",
      practice: "latihan",
      exercise: "latihan",
      beginner: "pemula",
      intermediate: "menengah",
      advanced: "lanjutan",
      content: "konten",
      material: "materi",
      guide: "panduan",
      tutorial: "tutorial",
      study: "belajar",
      learning: "pembelajaran",
      immersion: "immersion",
      review: "review",
      daily: "harian",
      always: "selalu",
      complete: "selesaikan",
      finish: "selesaikan",
      learn: "belajar",
      card: "kartu",
      flashcard: "flashcard",
      repetition: "pengulangan",
      spaced: "berjarak",
      system: "sistem",
    };

    return englishToIndonesian[word.toLowerCase()] || word;
  }

  private tokenizeIndonesian(text: string): string[] {
    if (!text) return [];

    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .replace(/\d+/g, " ")
      .split(/\s+/)
      .filter((word) => word.length >= 2)
      .filter((word) => !this.indonesianStopWords.has(word))
      .map((word) => this.normalizeWord(word))
      .filter((word) => word.length >= 2);
  }

  private isStopWord(word: string): boolean {
    return this.indonesianStopWords.has(word.toLowerCase());
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1,
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  private findFuzzyMatches(queryWord: string, searchData: SearchData): any[] {
    const matches: any[] = [];
    const maxDistance = 2;

    if (!searchData.searchableText) {
      return matches;
    }

    const allWords = searchData.searchableText.split(/\s+/);

    allWords.forEach((word) => {
      const distance = this.levenshteinDistance(queryWord, word);
      if (distance <= maxDistance && distance > 0) {
        matches.push({
          word: word,
          score: Math.max(1, 5 - distance),
        });
      }
    });

    return matches;
  }

  performSearch(query: string): SearchResponse {
    if (!query || query.trim().length < 2) {
      return { results: [], total: 0, query: "", searchStrategy: "No query" };
    }

    const queryWords = this.tokenizeIndonesian(query);
    const scores = new Map<number, number>();
    const matchDetails = new Map<number, MatchInfo>();

    // Advanced Indonesian-focused search with multiple matching strategies
    this.posts.forEach((post, postIndex) => {
      let score = 0;
      const searchData = this.enhancedSearchData[postIndex] || post;
      const matchInfo: MatchInfo = {
        exactMatches: [],
        phraseMatches: [],
        sectionMatches: [],
        contentMatches: [],
        metadataMatches: [],
      };

      // Strategy 1: Word-based scoring with Indonesian optimization
      queryWords.forEach((word) => {
        const postWeights = this.searchIndex.get(word);
        if (postWeights && postWeights.has(postIndex)) {
          const wordScore = postWeights.get(postIndex)!;
          score += wordScore;
          matchInfo.contentMatches.push({ word, score: wordScore });
        }
      });

      // Strategy 2: Exact phrase matching (highest priority)
      if (queryWords.length > 1) {
        const queryPhrase = query.toLowerCase();
        const contentText =
          searchData.fullContent || searchData.searchableText || "";
        const rawContent = (searchData as any).rawContent || contentText;

        if (contentText.includes(queryPhrase)) {
          score += 20;
          matchInfo.phraseMatches.push({
            type: "exact",
            phrase: queryPhrase,
            score: 20,
          });
        }

        if (rawContent.includes(queryPhrase)) {
          score += 15;
          matchInfo.phraseMatches.push({
            type: "raw",
            phrase: queryPhrase,
            score: 15,
          });
        }

        // Strategy 3: Consecutive word matching
        let consecutiveMatches = 0;
        for (let i = 0; i < queryWords.length - 1; i++) {
          const wordPair = `${queryWords[i]} ${queryWords[i + 1]}`;
          if (contentText.includes(wordPair)) {
            consecutiveMatches++;
            matchInfo.phraseMatches.push({
              type: "consecutive",
              phrase: wordPair,
              score: 5,
            });
          }
        }
        score += consecutiveMatches * 5;
      }

      // Strategy 4: Section title matching
      if (
        (searchData as any).processedContent &&
        (searchData as any).processedContent.sections
      ) {
        (searchData as any).processedContent.sections.forEach(
          (section: any) => {
            const sectionTitle = section.title.toLowerCase();
            queryWords.forEach((word) => {
              if (sectionTitle.includes(word)) {
                score += 8;
                matchInfo.sectionMatches.push({
                  section: section.title,
                  word,
                  score: 8,
                });
              }
            });
          },
        );
      }

      // Strategy 5: Metadata matching
      const metadataFields = [
        { field: "tags", weight: 6 },
        { field: "category", weight: 5 },
        { field: "difficulty", weight: 4 },
        { field: "learningStage", weight: 4 },
      ];

      metadataFields.forEach(({ field, weight }) => {
        const fieldValue = (searchData as any)[field];
        if (fieldValue) {
          const fieldText = Array.isArray(fieldValue)
            ? fieldValue.join(" ")
            : fieldValue;
          queryWords.forEach((word) => {
            if (fieldText.toLowerCase().includes(word)) {
              score += weight;
              matchInfo.metadataMatches.push({
                field,
                value: fieldValue,
                word,
                score: weight,
              });
            }
          });
        }
      });

      if (score > 0) {
        scores.set(postIndex, score);
        matchDetails.set(postIndex, matchInfo);
      }
    });

    // Convert scores to results with detailed matching information
    const results: SearchResult[] = Array.from(scores.entries())
      .map(([postIndex, score]) => ({
        post: this.posts[postIndex],
        score: score,
        matchDetails: matchDetails.get(postIndex),
        relevancePercentage: Math.min(100, Math.round((score / 50) * 100)),
      }))
      .sort((a, b) => b.score - a.score);

    return {
      results: results,
      total: results.length,
      query: query,
      searchStrategy: "Indonesian-focused multi-strategy matching",
    };
  }

  generateContentSnippet(searchData: SearchData, query: string): string {
    if (!searchData.fullContent) return "";

    const queryWords = this.tokenize(query);
    const content = searchData.fullContent.toLowerCase();

    let bestSnippet = "";
    let bestScore = 0;

    queryWords.forEach((word) => {
      const index = content.indexOf(word);
      if (index !== -1) {
        const start = Math.max(0, index - 150);
        const end = Math.min(content.length, index + 300);
        const snippet = content.substring(start, end);

        const wordCount = queryWords.filter((w) => snippet.includes(w)).length;
        if (wordCount > bestScore) {
          bestScore = wordCount;
          bestSnippet = snippet;
        }
      }
    });

    if (bestSnippet) {
      bestSnippet = bestSnippet.replace(/^\s+|\s+$/g, "");

      if (bestSnippet.length > 300) {
        bestSnippet = bestSnippet.substring(0, 300) + "...";
      }

      const contentStart = searchData.fullContent
        .toLowerCase()
        .substring(0, 100);
      const contentEnd = searchData.fullContent
        .toLowerCase()
        .substring(searchData.fullContent.length - 100);

      if (
        !contentStart.includes(bestSnippet.substring(0, 50)) &&
        !contentEnd.includes(bestSnippet.substring(bestSnippet.length - 50))
      ) {
        bestSnippet = "..." + bestSnippet;
      }

      return this.highlightText(bestSnippet, query);
    }

    return "";
  }

  highlightText(text: string, query: string): string {
    if (!text || !query) return text;

    const queryWords = this.tokenize(query);
    let highlightedText = text;

    queryWords.forEach((word) => {
      const regex = new RegExp(`(${word})`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        '<mark class="search-highlight">$1</mark>',
      );
    });

    return highlightedText;
  }

  // Integration methods for pagination system
  notifySearchModeChange(isSearchActive: boolean): void {
    console.log(`🔍 Search mode changed: ${isSearchActive}`);
  }

  notifyDOMUpdated(): void {
    console.log("🔍 DOM updated, search engine notified");
  }
}

// Export singleton instance
export const searchEngine = new IndonesianDocsSearch();
