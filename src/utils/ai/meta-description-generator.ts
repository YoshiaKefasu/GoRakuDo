import type { MetaDescriptionRequest, SEOOptimizedMeta } from './types';

export class MetaDescriptionGenerator {
  private cache: Map<string, SEOOptimizedMeta>;

  constructor() {
    this.cache = new Map();
  }

  async generateOptimizedMetaDescription(
    request: MetaDescriptionRequest
  ): Promise<SEOOptimizedMeta> {
    // AI processing disabled for security
    return this.generateFallbackMetaDescription(request);
  }

  // private optimizeForSEO(
  //   description: string,
  //   request: MetaDescriptionRequest,
  // ): SEOOptimizedMeta {
  //   // Ensure proper length (150-160 characters for optimal CTR)
  //   let optimized = description;
  //   if (optimized.length > 160) {
  //     optimized = optimized.substring(0, 157) + "...";
  //   }

  //   // Add primary keywords if missing
  //   if (request.keywords && request.keywords.length > 0) {
  //     const primaryKeyword = request.keywords[0];
  //     if (!optimized.toLowerCase().includes(primaryKeyword.toLowerCase())) {
  //       optimized = `${primaryKeyword} - ${optimized}`;
  //       optimized = optimized.substring(0, 157) + "...";
  //       }
  //     }
  //   }

  //   // Add call-to-action for better CTR
  //   if (
  //     !optimized.includes("Belajar") &&
  //     !optimized.includes("Pelajari") &&
  //     !optimized.includes("学習")
  //   ) {
  //     if (request.language === "ja") {
  //       optimized = `${optimized} 日本語を学びましょう。`;
  //     } else {
  //       optimized = `${optimized} Belajar bahasa Jepang sekarang.`;
  //     }
  //     if (optimized.length > 160) {
  //       optimized = optimized.substring(0, 157) + "...";
  //     }
  //   }

  //   return {
  //     description: optimized,
  //     length: optimized.length,
  //     hasKeywords: this.checkKeywordPresence(optimized, request.keywords || []),
  //     hasCTA: this.checkCTAPresence(optimized, request.language),
  //     language: request.language || "id",
  //     generatedAt: new Date().toISOString(),
  //   };
  // }

  private generateFallbackMetaDescription(
    request: MetaDescriptionRequest
  ): SEOOptimizedMeta {
    const title = request.title;
    const content = request.content.substring(0, 100);
    const keywords = request.keywords || [];

    let fallback = `${title} - ${content}`;

    if (keywords.length > 0) {
      fallback = `${keywords[0]} - ${fallback}`;
    }

    if (request.language === 'ja') {
      fallback = `${fallback} イマージョン法による日本語学習。`;
    } else {
      fallback = `${fallback} Belajar bahasa Jepang dengan metode immersion.`;
    }

    if (fallback.length > 160) {
      fallback = fallback.substring(0, 157) + '...';
    }

    return {
      description: fallback,
      length: fallback.length,
      hasKeywords: this.checkKeywordPresence(fallback, keywords),
      hasCTA: true,
      language: request.language || 'id',
      generatedAt: new Date().toISOString(),
    };
  }

  private checkKeywordPresence(
    description: string,
    keywords: string[]
  ): boolean {
    return keywords.some(keyword =>
      description.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // private checkCTAPresence(
  //   description: string,
  //   language?: "id" | "ja",
  // ): boolean {
  //   const ctaWords =
  //     language === "ja"
  //       ? ["学び", "学習", "始め", "参加", "登録"]
  //       : ["belajar", "pelajari", "mulai", "gabung", "daftar"];

  //   return ctaWords.some((word) =>
  //     description.toLowerCase().includes(word.toLowerCase()),
  //   );
  // }

  // private generateCacheKey(request: MetaDescriptionRequest): string {
  //   return `meta_${request.title.substring(0, 50)}_${request.content.substring(0, 100)}_${request.language || "id"}`;
  // }

  clearCache() {
    this.cache.clear();
  }

  getCacheSize() {
    return this.cache.size;
  }
}
