// AI Recommendation Data Types
export interface AIRecommendation {
  targetSlug: string;
  targetTitle: string;
  reason: string;
  score: number;
  type: 'similar' | 'contextual';
  label: string;
  icon: any; // Astro JSX element
}

export interface RelatedContent {
  similarContent?: Array<{
    targetSlug: string;
    targetTitle: string;
    reason: string;
    score: number;
  }>;
  contextualRelevance?: Array<{
    targetSlug: string;
    targetTitle: string;
    reason: string;
    score: number;
  }>;
}

export interface AIRecommendationsProps {
  relatedContent: RelatedContent;
  maxRecommendations?: number;
  showHeader?: boolean;
  className?: string;
  showFallback?: boolean;
}
