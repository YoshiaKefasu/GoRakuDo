// ========== SEO HELPER FUNCTIONS ==========
// SEO-specific utility functions

/**
 * Generate Open Graph meta tags
 * @param config - Open Graph configuration
 * @returns Array of HTML strings for Open Graph tags
 */
export const generateOpenGraphTags = (config: any): string[] => {
  const tags: string[] = [];

  if (config.title) {
    tags.push(`<meta property="og:title" content="${config.title}" />`);
  }

  if (config.description) {
    tags.push(
      `<meta property="og:description" content="${config.description}" />`
    );
  }

  if (config.type) {
    tags.push(`<meta property="og:type" content="${config.type}" />`);
  }

  if (config.image) {
    tags.push(`<meta property="og:image" content="${config.image}" />`);
  }

  if (config.url) {
    tags.push(`<meta property="og:url" content="${config.url}" />`);
  }

  if (config.siteName) {
    tags.push(`<meta property="og:site_name" content="${config.siteName}" />`);
  }

  if (config.locale) {
    tags.push(`<meta property="og:locale" content="${config.locale}" />`);
  }

  return tags;
};

/**
 * Generate Twitter Card meta tags
 * @param config - Twitter Card configuration
 * @returns Array of HTML strings for Twitter Card tags
 */
export const generateTwitterCardTags = (config: any): string[] => {
  const tags: string[] = [];

  if (config.card) {
    tags.push(`<meta name="twitter:card" content="${config.card}" />`);
  }

  if (config.title) {
    tags.push(`<meta name="twitter:title" content="${config.title}" />`);
  }

  if (config.description) {
    tags.push(
      `<meta name="twitter:description" content="${config.description}" />`
    );
  }

  if (config.image) {
    tags.push(`<meta name="twitter:image" content="${config.image}" />`);
  }

  if (config.creator) {
    tags.push(`<meta name="twitter:creator" content="${config.creator}" />`);
  }

  if (config.site) {
    tags.push(`<meta name="twitter:site" content="${config.site}" />`);
  }

  return tags;
};

/**
 * Generate structured data for search engines
 * @param config - Structured data configuration
 * @returns JSON-LD structured data string
 */
export const generateStructuredData = (config: any): string => {
  const structuredData: any = {
    '@context': 'https://schema.org',
    '@type': config.type || 'WebPage',
    name: config.title,
    description: config.description,
    url: config.url,
    keywords: config.keywords?.join(', '),
    author: {
      '@type': 'Organization',
      name: 'GoRakuDo',
      url: 'https://gorakudo.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GoRakuDo',
      url: 'https://gorakudo.com',
    },
    datePublished: config.datePublished || new Date().toISOString(),
    dateModified: config.dateModified || new Date().toISOString(),
  };

  // Add article-specific properties if available
  if (config.seoProperties?.articleType) {
    structuredData['@type'] = 'Article';
    structuredData['articleSection'] = config.seoProperties.articleType;

    if (config.seoProperties.learningStage) {
      structuredData['educationalLevel'] = config.seoProperties.learningStage;
    }

    if (config.seoProperties.searchIntent) {
      structuredData['audience'] = {
        '@type': 'Audience',
        audienceType: config.seoProperties.searchIntent,
      };
    }
  }

  return JSON.stringify(structuredData, null, 2);
};

/**
 * Generate meta keywords tag from keyword arrays
 * @param keywords - Array of keyword arrays
 * @returns HTML string for meta keywords tag
 */
export const generateKeywordsTag = (keywords: {
  primary?: string[];
  longTail?: string[];
  article?: string[];
  category?: string[];
}): string => {
  const allKeywords: string[] = [];

  // Combine all keyword types
  if (keywords.primary) allKeywords.push(...keywords.primary);
  if (keywords.longTail) allKeywords.push(...keywords.longTail);
  if (keywords.article) allKeywords.push(...keywords.article);
  if (keywords.category) allKeywords.push(...keywords.category);

  // Remove duplicates and join
  const uniqueKeywords = [...new Set(allKeywords)];
  const keywordsString = uniqueKeywords.join(', ');

  return `<meta name="keywords" content="${keywordsString}" />`;
};

/**
 * Generate robots meta tag
 * @param config - Robots configuration
 * @returns HTML string for robots meta tag
 */
export const generateRobotsTag = (config: {
  index?: boolean;
  follow?: boolean;
  noarchive?: boolean;
  nosnippet?: boolean;
}): string => {
  const directives: string[] = [];

  if (config.index !== false) directives.push('index');
  if (config.follow !== false) directives.push('follow');
  if (config.noarchive) directives.push('noarchive');
  if (config.nosnippet) directives.push('nosnippet');

  const content = directives.join(', ');
  return `<meta name="robots" content="${content}" />`;
};
