import type {
  ContentRecommendationRequest,
  ContentRecommendation,
} from "./types";

export class ContentRecommendationSystem {
  private cache: Map<string, ContentRecommendation[]>;

  constructor() {
    this.cache = new Map();
  }

  async generateRecommendations(
    request: ContentRecommendationRequest,
  ): Promise<ContentRecommendation[]> {
    // AI processing disabled for security
    return this.generateFallbackRecommendations(request);
  }

  private structureRecommendations(
    recommendedTitles: string[],
    request: ContentRecommendationRequest,
  ): ContentRecommendation[] {
    return recommendedTitles
      .map((title, index) => {
        const matchingPost = request.availablePosts.find(
          (post) =>
            post.title.toLowerCase().includes(title.toLowerCase()) ||
            title.toLowerCase().includes(post.title.toLowerCase()),
        );

        if (matchingPost) {
          return {
            postId: matchingPost.id,
            title: matchingPost.title,
            relevanceScore: this.calculateRelevanceScore(
              matchingPost,
              request.currentPost,
            ),
            reason: this.generateRecommendationReason(matchingPost, index),
            tags: matchingPost.tags || [],
          };
        }

        // Fallback if exact match not found
        return {
          postId: request.availablePosts[index]?.id || "",
          title: title,
          relevanceScore: 0.7 - index * 0.1,
          reason: `Artikel terkait tentang pembelajaran bahasa Jepang`,
          tags: request.availablePosts[index]?.tags || [],
        };
      })
      .filter((rec) => rec.postId && rec.postId !== request.currentPost.id);
  }

  private calculateRelevanceScore(
    recommendedPost: any,
    currentPost: any,
  ): number {
    let score = 0.5; // Base score

    // Tag overlap (0.3 points)
    const currentTags = currentPost.tags || [];
    const recommendedTags = recommendedPost.tags || [];
    const tagOverlap = currentTags.filter((tag: string) =>
      recommendedTags.includes(tag),
    ).length;
    score += Math.min(0.3, tagOverlap * 0.1);

    // Title similarity (0.2 points)
    const titleSimilarity = this.calculateTitleSimilarity(
      currentPost.title,
      recommendedPost.title,
    );
    score += titleSimilarity * 0.2;

    return Math.min(1.0, score);
  }

  private calculateTitleSimilarity(title1: string, title2: string): number {
    const words1 = title1.toLowerCase().split(/\s+/);
    const words2 = title2.toLowerCase().split(/\s+/);

    const commonWords = words1.filter((word) => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
  }

  private generateRecommendationReason(
    recommendedPost: any,
    index: number,
  ): string {
    const reasons = [
      "Artikel terkait tentang pembelajaran bahasa Jepang",
      "Materi lanjutan untuk memperdalam pemahaman",
      "Konten pelengkap untuk metode immersion",
      "Panduan praktis bahasa Jepang",
      "Tips dan teknik belajar yang efektif",
    ];

    // Check for specific content types
    if (recommendedPost.title.toLowerCase().includes("anki")) {
      return "Panduan lengkap penggunaan Anki untuk belajar bahasa Jepang";
    }
    if (recommendedPost.title.toLowerCase().includes("grammar")) {
      return "Penjelasan tata bahasa Jepang yang mudah dipahami";
    }
    if (recommendedPost.title.toLowerCase().includes("immersion")) {
      return "Metode immersion untuk belajar bahasa Jepang secara alami";
    }

    return reasons[index] || reasons[0];
  }

  private generateFallbackRecommendations(
    request: ContentRecommendationRequest,
  ): ContentRecommendation[] {
    const availablePosts = request.availablePosts.filter(
      (post) => post.id !== request.currentPost.id,
    );

    return availablePosts.slice(0, 3).map((post, index) => ({
      postId: post.id,
      title: post.title,
      relevanceScore: 0.8 - index * 0.1,
      reason: this.generateFallbackReason(index),
      tags: post.tags || [],
    }));
  }

  private generateFallbackReason(index: number): string {
    const reasons = [
      "Artikel terkait tentang pembelajaran bahasa Jepang",
      "Materi lanjutan untuk memperdalam pemahaman",
      "Konten pelengkap untuk metode immersion",
    ];
    return reasons[index] || reasons[0];
  }

  private generateCacheKey(request: ContentRecommendationRequest): string {
    return `rec_${request.currentPost.id}_${request.availablePosts.length}`;
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheSize() {
    return this.cache.size;
  }
}
