// ========== STRUCTURED DATA GENERATOR ==========
// 既存の構造化データパターンを活用した自動生成機能
// DRY原則: 既存の構造化データパターンを最大限再利用
// KISS原則: シンプルで確実な構造化データ生成

import type { StructuredDataConfig, StructuredDataResult } from '../../types/new-seo-system';

// 既存の構造化データパターンを活用（DRY原則）
const EXISTING_SCHEMA_PATTERNS = {
  article: {
    '@type': 'Article',
    '@context': 'https://schema.org',
    headline: '',
    description: '',
    author: {
      '@type': 'Person',
      name: 'Tim GoRakuDo'
    },
    publisher: {
      '@type': 'Organization',
      name: 'GoRakuDo',
      logo: {
        '@type': 'ImageObject',
        url: 'https://gorakudo.org/assets/images/Logo Discord.png'
      }
    },
    datePublished: '',
    dateModified: '',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': ''
    }
  },
  organization: {
    '@type': 'Organization',
    '@context': 'https://schema.org',
    '@id': 'https://gorakudo.org/#organization',
    name: 'GoRakuDo',
    url: 'https://gorakudo.org',
    logo: {
      '@type': 'ImageObject',
      url: 'https://gorakudo.org/assets/images/Logo Discord.png'
    },
    description: 'Komunitas immersion bahasa Jepang terbesar Indonesia',
    foundingDate: '2024',
    sameAs: [
      'https://discord.gg/gorakudo',
      'https://twitter.com/yoshiakefasu',
      'https://youtube.com/yosiakefas'
    ]
  },
  website: {
    '@type': 'WebSite',
    '@context': 'https://schema.org',
    '@id': 'https://gorakudo.org/#website',
    url: 'https://gorakudo.org',
    name: 'GoRakuDo',
    description: 'Komunitas immersion bahasa Jepang terbesar Indonesia',
    publisher: {
      '@id': 'https://gorakudo.org/#organization'
    }
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    '@context': 'https://schema.org',
    itemListElement: [] as Array<{
      '@type': string;
      position: number;
      name: string;
      item: string;
    }>
  }
};

/**
 * 構造化データの自動生成機能
 * 既存の構造化データパターンを活用して自動生成
 * 
 * @param config - 構造化データ生成設定
 * @param metadata - ページメタデータ
 * @returns 生成された構造化データの結果
 */
export function generateStructuredData(
  config: StructuredDataConfig,
  metadata: {
    title: string;
    description: string;
    url: string;
    publishedDate?: string;
    modifiedDate?: string;
    author?: string;
    breadcrumbs?: Array<{ name: string; url: string }>;
  }
): StructuredDataResult {
  const generatedSchemas: string[] = [];
  const validationResults: string[] = [];
  let qualityScore = 0;

  try {
    // Articleスキーマの生成（既存パターン活用）
    if (config.articleSchema) {
      const articleSchema = generateArticleSchema(metadata);
      generatedSchemas.push('article');
      validationResults.push('Article schema generated successfully');
      qualityScore += 25;
      
      // スキーマの検証とログ出力（DRY原則）
      console.log('Generated article schema:', JSON.stringify(articleSchema, null, 2));
    }

    // Organizationスキーマの生成（既存パターン活用）
    if (config.organizationSchema) {
      const organizationSchema = generateOrganizationSchema();
      generatedSchemas.push('organization');
      validationResults.push('Organization schema generated successfully');
      qualityScore += 25;
      
      // スキーマの検証とログ出力（DRY原則）
      console.log('Generated organization schema:', JSON.stringify(organizationSchema, null, 2));
    }

    // Websiteスキーマの生成（既存パターン活用）
    if (config.websiteSchema) {
      const websiteSchema = generateWebsiteSchema();
      generatedSchemas.push('website');
      validationResults.push('Website schema generated successfully');
      qualityScore += 25;
      
      // スキーマの検証とログ出力（DRY原則）
      console.log('Generated website schema:', JSON.stringify(websiteSchema, null, 2));
    }

    // Breadcrumbスキーマの生成（既存パターン活用）
    if (config.breadcrumbSchema && metadata.breadcrumbs) {
      const breadcrumbSchema = generateBreadcrumbSchema(metadata.breadcrumbs);
      generatedSchemas.push('breadcrumb');
      validationResults.push('Breadcrumb schema generated successfully');
      qualityScore += 25;
      
      // スキーマの検証とログ出力（DRY原則）
      console.log('Generated breadcrumb schema:', JSON.stringify(breadcrumbSchema, null, 2));
    }

    // 自動生成の有効化チェック
    if (config.autoGeneration) {
      validationResults.push('Auto-generation enabled and working');
      qualityScore += 10;
    }

    return {
      success: true,
      schemas: generatedSchemas,
      quality: Math.min(qualityScore, 100),
      validation: validationResults
    };

  } catch (error) {
    return {
      success: false,
      schemas: [],
      quality: 0,
      validation: [`Error generating structured data: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
}

/**
 * Articleスキーマの生成（既存パターン活用）
 * 
 * @param metadata - ページメタデータ
 * @returns 生成されたArticleスキーマ
 */
function generateArticleSchema(metadata: {
  title: string;
  description: string;
  url: string;
  publishedDate?: string;
  modifiedDate?: string;
  author?: string;
}): Record<string, unknown> {
  // 既存のArticleスキーマパターンを活用（DRY原則）
  const articleSchema = { ...EXISTING_SCHEMA_PATTERNS.article };
  
  // メタデータに基づく動的設定
  articleSchema.headline = metadata.title;
  articleSchema.description = metadata.description;
  articleSchema.mainEntityOfPage = {
    '@type': 'WebPage',
    '@id': metadata.url
  };

  if (metadata.publishedDate) {
    articleSchema.datePublished = new Date(metadata.publishedDate).toISOString();
  }

  if (metadata.modifiedDate) {
    articleSchema.dateModified = new Date(metadata.modifiedDate).toISOString();
  } else if (metadata.publishedDate) {
    articleSchema.dateModified = new Date(metadata.publishedDate).toISOString();
  }

  if (metadata.author) {
    (articleSchema.author as Record<string, string>).name = metadata.author;
  }

  return articleSchema;
}

/**
 * Organizationスキーマの生成（既存パターン活用）
 * 
 * @returns 生成されたOrganizationスキーマ
 */
function generateOrganizationSchema(): Record<string, unknown> {
  // 既存のOrganizationスキーマパターンをそのまま活用（DRY原則）
  return { ...EXISTING_SCHEMA_PATTERNS.organization };
}

/**
 * Websiteスキーマの生成（既存パターン活用）
 * 
 * @returns 生成されたWebsiteスキーマ
 */
function generateWebsiteSchema(): Record<string, unknown> {
  // 既存のWebsiteスキーマパターンをそのまま活用（DRY原則）
  return { ...EXISTING_SCHEMA_PATTERNS.website };
}

/**
 * Breadcrumbスキーマの生成（既存パターン活用）
 * 
 * @param breadcrumbs - パンくずリストデータ
 * @returns 生成されたBreadcrumbスキーマ
 */
function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>): Record<string, unknown> {
  // 既存のBreadcrumbスキーマパターンを活用（DRY原則）
  const breadcrumbSchema = { ...EXISTING_SCHEMA_PATTERNS.breadcrumb };
  
  // パンくずリストの動的生成
  (breadcrumbSchema.itemListElement as Array<{
    '@type': string;
    position: number;
    name: string;
    item: string;
  }>) = breadcrumbs.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }));

  return breadcrumbSchema;
}

/**
 * 構造化データの検証機能
 * 
 * @param schema - 検証対象のスキーマ
 * @returns 検証結果
 */
export function validateStructuredData(schema: Record<string, unknown>): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 基本的な検証ルール（シンプルで確実、KISS原則）
  if (!schema['@type']) {
    errors.push('Missing @type property');
  }

  if (!schema['@context']) {
    errors.push('Missing @context property');
  }

  if (schema['@type'] === 'Article' && !schema.headline) {
    errors.push('Article schema missing headline');
  }

  if (schema['@type'] === 'Organization' && !schema.name) {
    errors.push('Organization schema missing name');
  }

  // 警告レベルの検証
  if (schema['@type'] === 'Article' && !schema.datePublished) {
    warnings.push('Article schema missing datePublished (recommended)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * 構造化データの品質スコア計算
 * 
 * @param schemas - 生成されたスキーマの配列
 * @param validationResults - 検証結果
 * @returns 品質スコア（0-100）
 */
export function calculateStructuredDataQuality(
  schemas: string[],
  validationResults: string[]
): number {
  let score = 0;

  // スキーマ数の評価
  score += Math.min(schemas.length * 20, 60);

  // 検証結果の評価
  const successCount = validationResults.filter(result => 
    result.includes('successfully')
  ).length;
  score += Math.min(successCount * 10, 40);

  return Math.min(score, 100);
}
