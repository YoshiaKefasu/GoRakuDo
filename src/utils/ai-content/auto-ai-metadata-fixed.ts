// FIX #130: Collection type errors - Updated CollectionEntry<"docs"> to "docs"
// ROOT CAUSE: Old collection name references causing TypeScript errors
// SOLUTION: Updated all function signatures and return types to use "docs"
// STATUS: ✅ RESOLVED

// Auto AI Metadata Generation Utility - Fixed Version
// Enhanced AI metadata generation with improved content analysis
// Provides advanced metadata generation and content analysis capabilities

import type { CollectionEntry } from 'astro:content';
import type { SimpleAIMetadata } from './auto-ai-metadata';
import { generateSimpleAIMetadata } from './auto-ai-metadata';

// Enhanced AI Metadata Interface (Fixed Version)
export interface EnhancedAIMetadata extends SimpleAIMetadata {
  // Additional fields for enhanced analysis
  targetAudience: string[];
  learningObjectives: string[];
  hasPracticeExercises: boolean;
  hasAudioContent: boolean;
  hasVisualContent: boolean;
  contentFreshness: 'evergreen' | 'seasonal' | 'trending' | 'reference';
  jlptLevel?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  prerequisites: string[];
  relatedContent: string[];
  nextSteps: string[];
  series?: string;
  seriesOrder?: number;
}

/**
 * Generate enhanced AI metadata for a post
 * Fixed version with improved content analysis
 */
export async function generateAIMetadata(
  post: CollectionEntry<'docs'>
): Promise<EnhancedAIMetadata> {
  // Start with simple metadata (now using static import)
  const simpleMetadata = generateSimpleAIMetadata(post);

  // Enhanced metadata with additional analysis
  const enhancedMetadata: EnhancedAIMetadata = {
    ...simpleMetadata,
    targetAudience: ['complete-beginner', 'self-learner'],
    learningObjectives: [],
    hasPracticeExercises: false,
    hasAudioContent: false,
    hasVisualContent: false,
    contentFreshness: 'evergreen',
    prerequisites: [],
    relatedContent: [],
    nextSteps: [],
  };

  // Analyze content for enhanced features
  const content = (post.body || '').toLowerCase();
  const title = (post.data?.title || '').toLowerCase();

  // Detect practice exercises
  if (
    content.includes('exercise') ||
    content.includes('practice') ||
    content.includes('quiz') ||
    content.includes('test')
  ) {
    enhancedMetadata.hasPracticeExercises = true;
  }

  // Detect audio content
  if (
    content.includes('audio') ||
    content.includes('pronunciation') ||
    content.includes('sound') ||
    content.includes('listen')
  ) {
    enhancedMetadata.hasAudioContent = true;
  }

  // Detect visual content
  if (
    content.includes('image') ||
    content.includes('chart') ||
    content.includes('diagram') ||
    content.includes('visual')
  ) {
    enhancedMetadata.hasVisualContent = true;
  }

  // Determine JLPT level based on content
  if (
    title.includes('n5') ||
    content.includes('basic') ||
    content.includes('beginner')
  ) {
    enhancedMetadata.jlptLevel = 'N5';
  } else if (title.includes('n4') || content.includes('elementary')) {
    enhancedMetadata.jlptLevel = 'N4';
  } else if (title.includes('n3') || content.includes('intermediate')) {
    enhancedMetadata.jlptLevel = 'N3';
  } else if (title.includes('n2') || content.includes('advanced')) {
    enhancedMetadata.jlptLevel = 'N2';
  } else if (title.includes('n1') || content.includes('fluency')) {
    enhancedMetadata.jlptLevel = 'N1';
  }

  // Determine content freshness
  if (
    title.includes('new') ||
    title.includes('latest') ||
    title.includes('2024')
  ) {
    enhancedMetadata.contentFreshness = 'trending';
  } else if (title.includes('seasonal') || title.includes('festival')) {
    enhancedMetadata.contentFreshness = 'seasonal';
  } else if (title.includes('reference') || title.includes('guide')) {
    enhancedMetadata.contentFreshness = 'reference';
  } else {
    enhancedMetadata.contentFreshness = 'evergreen';
  }

  // Extract learning objectives
  const objectives = [];
  if (content.includes('learn') || content.includes('understand')) {
    objectives.push('Understand core concepts');
  }
  if (content.includes('practice') || content.includes('apply')) {
    objectives.push('Apply knowledge in practice');
  }
  if (content.includes('master') || content.includes('fluent')) {
    objectives.push('Achieve fluency');
  }
  enhancedMetadata.learningObjectives = objectives;

  return enhancedMetadata;
}

/**
 * Get content with enhanced AI metadata
 */
export async function getContentWithAIMetadata(
  posts: CollectionEntry<'docs'>[]
): Promise<(CollectionEntry<'docs'> & { aiMetadata: EnhancedAIMetadata })[]> {
  const results = await Promise.all(
    posts.map(async post => ({
      ...post,
      aiMetadata: await generateAIMetadata(post),
    }))
  );
  return results;
}

/**
 * Get content by learning stage with enhanced AI analysis
 */
export async function getContentByLearningStageWithAI(
  posts: CollectionEntry<'docs'>[],
  stage: SimpleAIMetadata['learningStage']
): Promise<CollectionEntry<'docs'>[]> {
  const results = await Promise.all(
    posts.map(async post => {
      const metadata = await generateAIMetadata(post);
      return { post, metadata };
    })
  );

  return results
    .filter(result => result.metadata.learningStage === stage)
    .map(result => result.post);
}

/**
 * Get content by JLPT level with enhanced AI analysis
 */
export async function getContentByJLPTLevelWithAI(
  posts: CollectionEntry<'docs'>[],
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
): Promise<CollectionEntry<'docs'>[]> {
  const results = await Promise.all(
    posts.map(async post => {
      const metadata = await generateAIMetadata(post);
      return { post, metadata };
    })
  );

  return results
    .filter(result => result.metadata.jlptLevel === level)
    .map(result => result.post);
}

/**
 * Get content by type with enhanced AI analysis
 */
export async function getContentByTypeWithAI(
  posts: CollectionEntry<'docs'>[],
  type: SimpleAIMetadata['contentType']
): Promise<CollectionEntry<'docs'>[]> {
  const results = await Promise.all(
    posts.map(async post => {
      const metadata = await generateAIMetadata(post);
      return { post, metadata };
    })
  );

  return results
    .filter(result => result.metadata.contentType === type)
    .map(result => result.post);
}

/**
 * Get content recommendations with enhanced AI analysis
 */
export async function getContentRecommendationsWithAI(
  posts: CollectionEntry<'docs'>[],
  currentPost: CollectionEntry<'docs'>,
  maxRecommendations: number = 3
): Promise<CollectionEntry<'docs'>[]> {
  const currentMetadata = await generateAIMetadata(currentPost);

  // Enhanced recommendation algorithm
  const recommendations = await Promise.all(
    posts
      .filter(post => post.id !== currentPost.id)
      .map(async post => {
        const metadata = await generateAIMetadata(post);
        let score = 0;

        // Score based on learning stage match
        if (metadata.learningStage === currentMetadata.learningStage)
          score += 3;

        // Score based on content type match
        if (metadata.contentType === currentMetadata.contentType) score += 2;

        // Score based on JLPT level proximity
        if (metadata.jlptLevel && currentMetadata.jlptLevel) {
          const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
          const currentIndex = levels.indexOf(currentMetadata.jlptLevel);
          const postIndex = levels.indexOf(metadata.jlptLevel);
          const distance = Math.abs(currentIndex - postIndex);
          if (distance <= 1) score += 2;
          else if (distance <= 2) score += 1;
        }

        // Score based on complexity match
        const complexityDiff = Math.abs(
          metadata.complexityScore - currentMetadata.complexityScore
        );
        if (complexityDiff <= 1) score += 1;

        return { post, score };
      })
  );

  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, maxRecommendations)
    .map(item => item.post);
}
