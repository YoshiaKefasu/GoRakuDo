// Google Engineering Team 2025: Search Data JSON Endpoint
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

      // Clean markdown content for search indexing
      const cleanedContent = fullContent
        .replace(/---[\s\S]*?---/, '') // Remove frontmatter
        .replace(/```[\s\S]*?```/g, ' ') // Remove code blocks
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, ' $1 ') // Replace images with alt text
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1') // Remove links, keep text
        .replace(/#{1,6}\s+/g, '') // Remove header markers
        .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold formatting
        .replace(/\*([^*]+)\*/g, '$1') // Remove italic formatting
        .replace(/`([^`]+)`/g, '$1') // Remove inline code formatting
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

        // AI metadata
        aiMetadata: post.data.aiMetadata || {},
        contentType: post.data.aiMetadata?.contentType || post.data.category,
        learningPath: post.data.aiMetadata?.learningPath || [],
        aiRecommendations: post.data.aiMetadata?.recommendations || [],
        contentComplexity: post.data.aiMetadata?.complexity || 'medium',
        semanticKeywords: post.data.aiMetadata?.semanticKeywords || [],
        learningObjectives: post.data.aiMetadata?.learningObjectives || [],

        // Searchable text (comprehensive)
        searchableText: [
          post.data.title,
          post.data.description,
          cleanedContent,
          ...(post.data.tags || []),
          post.data.category,
          post.data.difficulty,
          post.data.learningStage,
          post.data.aiMetadata?.contentType,
          ...(post.data.aiMetadata?.keywords || []),
          ...(post.data.aiMetadata?.semanticKeywords || []),
          ...(post.data.aiMetadata?.learningObjectives || []),
          post.data.aiMetadata?.complexity,
          ...(post.data.aiMetadata?.learningPath || []),
        ]
          .filter(Boolean)
          .join(' '),

        // Content analysis
        wordCount: cleanedContent.split(/\s+/).filter(word => word.length > 0)
          .length,
        contentLength: cleanedContent.length,

        // Feature flags for specialized searches
        isRecommended: post.data.aiMetadata?.isRecommended || false,
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
