export class SEOOptimizer {
  static extractKeywords(content: string, title: string): string[] {
    const text = `${title} ${content}`.toLowerCase();
    const words = text.split(/\s+/);
    const wordCount = new Map<string, number>();

    // Count word frequency
    words.forEach((word) => {
      const cleanWord = word.replace(/[^\w]/g, "");
      if (cleanWord.length > 3) {
        wordCount.set(cleanWord, (wordCount.get(cleanWord) || 0) + 1);
      }
    });

    // Extract top keywords
    const sortedWords = Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);

    return sortedWords;
  }

  static optimizeTitle(title: string, maxLength: number = 60): string {
    if (title.length <= maxLength) return title;

    const words = title.split(" ");
    let optimized = "";

    for (const word of words) {
      if ((optimized + " " + word).length <= maxLength) {
        optimized += (optimized ? " " : "") + word;
      } else {
        break;
      }
    }

    return optimized || title.substring(0, maxLength);
  }

  static generateStructuredKeywords(content: string): string[] {
    const japaneseKeywords = [
      "日本語",
      "学習",
      "イマージョン",
      "文法",
      "語彙",
      "会話",
      "読解",
      "聴解",
      "ひらがな",
      "カタカナ",
      "漢字",
      "JLPT",
      "N5",
      "N4",
      "N3",
      "N2",
      "N1",
    ];

    const indonesianKeywords = [
      "belajar",
      "bahasa",
      "jepang",
      "immersion",
      "grammar",
      "vocabulary",
      "percakapan",
      "membaca",
      "mendengarkan",
      "metode",
      "teknik",
      "hiragana",
      "katakana",
      "kanji",
      "jlpt",
      "n5",
      "n4",
      "n3",
      "n2",
      "n1",
    ];

    const foundKeywords: string[] = [];

    // Check for Japanese keywords
    japaneseKeywords.forEach((keyword) => {
      if (content.includes(keyword)) {
        foundKeywords.push(keyword);
      }
    });

    // Check for Indonesian keywords
    indonesianKeywords.forEach((keyword) => {
      if (content.toLowerCase().includes(keyword)) {
        foundKeywords.push(keyword);
      }
    });

    return foundKeywords;
  }

  static calculateSEOScore(
    title: string,
    metaDescription: string,
    keywords: string[],
  ): number {
    let score = 0;

    // Title optimization (0-25 points)
    if (title.length >= 30 && title.length <= 60) score += 25;
    else if (title.length >= 20 && title.length <= 70) score += 15;
    else score += 5;

    // Meta description optimization (0-25 points)
    if (metaDescription.length >= 120 && metaDescription.length <= 160)
      score += 25;
    else if (metaDescription.length >= 100 && metaDescription.length <= 180)
      score += 15;
    else score += 5;

    // Keyword presence (0-25 points)
    const titleKeywords = keywords.filter((keyword) =>
      title.toLowerCase().includes(keyword.toLowerCase()),
    ).length;
    const descKeywords = keywords.filter((keyword) =>
      metaDescription.toLowerCase().includes(keyword.toLowerCase()),
    ).length;

    score += Math.min(25, (titleKeywords + descKeywords) * 5);

    // Call-to-action presence (0-15 points)
    const ctaWords = [
      "belajar",
      "pelajari",
      "mulai",
      "gabung",
      "daftar",
      "学び",
      "学習",
      "始め",
    ];
    const hasCTA = ctaWords.some((word) =>
      metaDescription.toLowerCase().includes(word.toLowerCase()),
    );
    if (hasCTA) score += 15;

    // Language-specific optimization (0-10 points)
    const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(
      title + metaDescription,
    );
    const hasIndonesian = /belajar|bahasa|jepang|immersion/.test(
      (title + metaDescription).toLowerCase(),
    );
    if (hasJapanese || hasIndonesian) score += 10;

    return Math.min(100, score);
  }

  static generateCanonicalUrl(baseUrl: string, slug: string): string {
    return `${baseUrl}/${slug}`.replace(/\/+/g, "/");
  }

  static generateAlternateUrls(
    baseUrl: string,
    slug: string,
  ): {
    id: string;
    ja: string;
  } {
    return {
      id: `${baseUrl}/${slug}`,
      ja: `${baseUrl}/ja/${slug}`,
    };
  }

  static extractReadingTime(content: string): number {
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  static generateExcerpt(content: string, maxLength: number = 160): string {
    const cleanContent = content.replace(/<[^>]*>/g, ""); // Remove HTML tags
    if (cleanContent.length <= maxLength) return cleanContent;

    const truncated = cleanContent.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");

    return lastSpace > 0
      ? truncated.substring(0, lastSpace) + "..."
      : truncated + "...";
  }
}
