// Search Data JSON Endpoint
// Provides comprehensive search data for client-side Fuse.js search
import { getCollection } from 'astro:content';
import {
  resolvePath,
} from '../utils/collections';
import { logger } from '../utils/logging/console-logger';

export async function GET() {
  try {
    logger.startGroup('Search Data Generation');
    logger.log('Generating search data JSON endpoint...', 'info');

    // Get all blog posts
    const posts = await getCollection('docs');
    logger.log(`Found ${posts.length} posts for search indexing`, 'success');

    // Process posts for search data
    const searchData = posts.map(post => {
      // Extract full markdown content for comprehensive search
      const fullContent = post.body || '';

      // AstroネイティブMarkdown処理済みコンテンツの最適化
      // post.bodyは既にHTML形式で提供されているため、HTMLタグを除去してテキスト抽出
      const cleanedContent = fullContent
        .replace(/<[^>]*>/g, ' ') // Remove HTML tags
        .replace(/&[^;]+;/g, ' ') // Remove HTML entities
        .replace(/\n+/g, ' ') // Replace newlines with spaces
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim();

      // Create comprehensive search data structure
      const searchItem = {
        // Core post data
        slug: post.slug,
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.publishedDate,
        readTime: post.data.readTime,
        emoji: post.data.emoji,

        // Content for search
        content: cleanedContent,
        fullContent: cleanedContent,

        // Metadata for filtering
        tags: post.data.tags || [],
        category: post.data.category,
        difficulty: post.data.difficulty,
        learningStage: post.data.learningStage,

        // AI metadata（完全削除 - 空オブジェクトで統一）
        aiMetadata: {},
        contentType: post.data.category || 'general',

        // Searchable text (simplified - AI fields removed)
        searchableText: [
          post.data.title,
          post.data.description,
          cleanedContent,
          ...(post.data.tags || []),
          post.data.category,
          post.data.difficulty,
          post.data.learningStage,
          // AI関連フィールドを完全削除
        ]
          .filter(Boolean)
          .join(' '),

        // Content analysis
        wordCount: cleanedContent.split(/\s+/).filter(word => word.length > 0)
          .length,
        contentLength: cleanedContent.length,

        // Feature flags (simplified - AI recommendations removed)
        isRecommended: false,  // AI推奨機能を無効化
        isBeginner:
          post.data.difficulty === 'beginner' ||
          post.data.learningStage === 'pemanasan',
        isTool:
          post.data.category === 'tools' ||
          post.data.title.toLowerCase().includes('anki'),
        hasCodeBlocks: fullContent.includes('```'),
        hasImages: fullContent.includes('![') || fullContent.includes('!['),

        // URL for navigation with dynamic path resolution
        url: (() => {
          try {
            return resolvePath("docs", post.slug);
          } catch (error) {
            logger.log(
              `Failed to resolve path for ${post.slug}: ${error.message}`,
              'warning'
            );
            return `/docs/${post.slug}`;
          }
        })(),
      };

      return searchItem;
    });

    logger.log(
      `Generated search data for ${searchData.length} posts`,
      'success'
    );
    logger.logSummary('Search Data Summary', {
      'Total posts': searchData.length,
      'Total words': searchData.reduce((sum, item) => sum + item.wordCount, 0),
      'Total content length': searchData.reduce(
        (sum, item) => sum + item.contentLength,
        0
      ),
    });

    // Log sample search data structure for troubleshooting
    if (searchData.length > 0) {
      logger.logContentPreview(
        'Sample search data structure',
        JSON.stringify({
          slug: searchData[0].slug,
          title: searchData[0].title,
          url: searchData[0].url,
          hasContent: !!searchData[0].content,
          contentLength: searchData[0].content?.length || 0,
          hasKrashen:
            searchData[0].content?.toLowerCase().includes('krashen') || false,
        })
      );
    }

    // Return JSON response with proper headers
    logger.endGroup();
    return new Response(JSON.stringify(searchData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    logger.log(`Error generating search data: ${error.message}`, 'error');

    return new Response(
      JSON.stringify({
        error: 'Failed to generate search data',
        message: error.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
