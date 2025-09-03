import { logger } from '../logging/console-logger';

export interface APIGeneratedRecommendation {
  targetSlug: string;
  targetTitle: string;
  score: number; // 0-100
  reason: string;
  type: 'similar' | 'contextual';
}

export interface APIGeneratedRecommendations {
  similarContent: APIGeneratedRecommendation[];
  contextualRelevance: APIGeneratedRecommendation[];
}

export interface PostInfo {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  content: string;
}

/**
 * Generate API-driven recommendations with scores
 * @param currentPost - Current post information
 * @param availablePosts - List of available posts
 * @returns Generated recommendations with scores
 */
export async function generateAPIRecommendations(
  _currentPost: PostInfo,
  _availablePosts: PostInfo[]
): Promise<APIGeneratedRecommendations> {
  // AI processing disabled for security
  logger.log('API recommendation generation disabled for security', 'warning');
  return {
    similarContent: [],
    contextualRelevance: [],
  };
}

/**
 * Generate similar content recommendations
 * Note: AI processing disabled for security
 */

/**
 * Generate contextual relevance recommendations
 */
// async function generateContextualRelevanceRecommendations(
//   genAI: any,
//   model: string,
//   currentPost: PostInfo,
//   availablePosts: PostInfo[],
// ): Promise<APIGeneratedRecommendation[]> {
//   const prompt = `Analyze the contextual relevance between the current article and ALL available posts. Select ONLY the 3 posts with the HIGHEST contextual relevance scores.

// Current Article:
// Title: ${currentPost.title}
// Description: ${currentPost.description}
// Tags: ${currentPost.tags.join(", ")}

// Available Posts (${availablePosts.length} total):
// ${availablePosts
//   .map(
//     (post, index) =>
//       `${index + 1}. ${post.title} (${post.slug})
//    Description: ${post.description}
//    Tags: ${post.tags.join(", ")}`,
//   )
//   .join("\n\n")}

// CRITICAL INSTRUCTIONS:
// 1. Analyze ALL ${availablePosts.length} available posts for contextual relevance
// 2. Find articles that are contextually relevant (complementary, next steps, prerequisites, related concepts, logical progression)
// 3. Assign a relevance score from 0-100 (100 = most contextually relevant)
// 4. Select ONLY the 3 posts with the HIGHEST contextual relevance scores
// 5. Provide a brief reason for the contextual relevance
// 6. DO NOT include posts with low contextual relevance scores

// Format your response as JSON with exactly 3 recommendations:
// {
//   "recommendations": [
//     {
//       "targetSlug": "post-slug",
//       "targetTitle": "Post Title",
//       "score": 95,
//       "reason": "Natural next step in the learning progression"
//     },
//     {
//       "targetSlug": "post-slug-2",
//       "targetTitle": "Post Title 2",
//       "score": 88,
//       "reason": "Complementary concept that builds upon current topic"
//     },
//     {
//       "targetSlug": "post-slug-3",
//       "targetTitle": "Post Title 3",
//       "score": 82,
//       "reason": "Related prerequisite knowledge for understanding current topic"
//     }
//   ]
// }`;

//   try {
//     const result = await genAI.models.generateContent({
//       model: model,
//       contents: prompt,
//     });

//     const response = result.text || "{}";

//     // Clean up the response to extract JSON from markdown code blocks
//     let cleanResponse = response;
//     if (response.includes("```json")) {
//       const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
//       if (jsonMatch) {
//         cleanResponse = jsonMatch[1];
//       }
//     } else if (response.includes("```")) {
//       const jsonMatch = response.match(/```\s*([\s\S]*?)\s*```/);
//       if (jsonMatch) {
//         cleanResponse = jsonMatch[1];
//       }
//     }

//     const parsed = JSON.parse(cleanResponse);

//     if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
//       return parsed.recommendations.map((rec: any) => ({
//         ...rec,
//         type: "contextual" as const,
//       }));
//     }

//     return [];
//   } catch (error) {
//     logger.log(`Contextual relevance generation failed: ${error}`, "error");
//     return [];
//   }
// }

/**
 * Load recommendations from metadata files and enhance with API scores
 * AI automatically selects top 3 posts with highest scores from all available posts
 */
export async function loadAndEnhanceRecommendations(
  currentPostSlug: string,
  availablePosts: PostInfo[]
): Promise<APIGeneratedRecommendations> {
  try {
    // Get current post info
    const currentPost = availablePosts.find(
      post => post.slug === currentPostSlug
    );
    if (!currentPost) {
      return {
        similarContent: [],
        contextualRelevance: [],
      };
    }

    // Filter out the current post from available posts
    const otherPosts = availablePosts.filter(
      post => post.slug !== currentPostSlug
    );

    if (otherPosts.length === 0) {
      return {
        similarContent: [],
        contextualRelevance: [],
      };
    }

    // Generate API-driven recommendations with scores from ALL available posts
    // AI will automatically select only the top 3 posts with highest scores
    const apiRecommendations = await generateAPIRecommendations(
      currentPost,
      otherPosts
    );

    return apiRecommendations;
  } catch (error) {
    logger.log(`Failed to load and enhance recommendations: ${error}`, 'error');
    return {
      similarContent: [],
      contextualRelevance: [],
    };
  }
}

/**
 * Convert post collection to PostInfo format
 */
export function convertPostsToPostInfo(posts: any[]): PostInfo[] {
  return posts.map(post => ({
    slug: post.slug,
    title: post.data.title,
    description: post.data.description || '',
    tags: Array.isArray(post.data.tags) ? post.data.tags : [],
    content: post.body || '',
  }));
}
