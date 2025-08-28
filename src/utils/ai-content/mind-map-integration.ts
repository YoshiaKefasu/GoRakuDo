/**
 * Enhanced Mind Map Integration System
 *
 * This module provides deep integration between the mind map system and:
 * - AI recommendations
 * - Internal linking
 * - Content analysis
 * - User customizations
 *
 * Features:
 * - Mind map context in AI recommendations
 * - Visual relationship indicators in internal links
 * - Dynamic content classification based on mind map
 * - User customization persistence
 */

import type { CollectionEntry } from "astro:content";
import type {
  ContentAnalysisResult,
  InternalLinkSuggestion,
  MindMapCustomization,
} from "./content-analysis";
import {
  MIND_MAP_BRANCHES,
  DEFAULT_MIND_MAP_CONFIG,
  MindMapUtils,
} from "./content-analysis";
import type { MindMapConfig } from "../../components/mind-map/mind-map-config";

// Enhanced mind map integration interface
export interface MindMapIntegration {
  // AI Recommendations with mind map context
  enhanceAIRecommendations: (
    recommendations: any[],
    sourcePost: CollectionEntry<"docs">,
    customizations?: MindMapCustomization[],
  ) => EnhancedRecommendation[];

  // Internal links with visual relationship indicators
  enhanceInternalLinks: (
    links: InternalLinkSuggestion[],
    sourcePost: CollectionEntry<"docs">,
    customizations?: MindMapCustomization[],
  ) => EnhancedInternalLink[];

  // Content analysis with mind map classification
  enhanceContentAnalysis: (
    analysis: ContentAnalysisResult,
    customizations?: MindMapCustomization[],
  ) => EnhancedContentAnalysis;

  // User customization management
  saveUserCustomizations: (customizations: MindMapCustomization[]) => void;
  loadUserCustomizations: () => MindMapCustomization[];
  exportUserSettings: () => UserMindMapSettings;
  importUserSettings: (settings: UserMindMapSettings) => void;
}

// Enhanced recommendation with mind map context
export interface EnhancedRecommendation {
  // Original recommendation data
  targetSlug: string;
  targetTitle: string;
  reason: string;
  score: number;

  // Mind map context
  mindMapContext: {
    sourceBranch: string;
    targetBranch: string;
    relationshipType: string;
    visualConnection: {
      color: string;
      style: string;
      thickness: string;
    };
    branchData: {
      source: any;
      target: any;
    };
  };

  // Enhanced UI data
  ui?: {
    badgeText: string;
    badgeColor: string;
    tooltipText: string;
    icon: string;
  };
}

// Enhanced internal link with visual indicators
export interface EnhancedInternalLink {
  // Original link data
  targetSlug: string;
  targetTitle: string;
  reason: string;
  relevance: number;
  position: number;

  // Mind map context
  mindMapContext: {
    sourceBranch: string;
    targetBranch: string;
    relationshipType: string;
    visualConnection: {
      color: string;
      style: string;
      thickness: string;
    };
  };

  // Enhanced styling
  styling: {
    borderColor: string;
    backgroundColor: string;
    icon: string;
    badgeText: string;
  };
}

// Enhanced content analysis with mind map data
export interface EnhancedContentAnalysis extends ContentAnalysisResult {
  mindMapVisualization: {
    branchColor: string;
    branchIcon: string;
    branchGradient: string;
    connectionStyle: string;
    position: {
      x: number;
      y: number;
    };
  };

  relatedBranches: {
    branchId: string;
    relationshipType: string;
    strength: number;
  }[];

  learningPath: {
    previousBranch?: string;
    currentBranch: string;
    nextBranch?: string;
    progress: number;
  };
}

// User mind map settings
export interface UserMindMapSettings {
  customizations: MindMapCustomization[];
  config: MindMapConfig;
  preferences: {
    showMindMapContext: boolean;
    showRelationshipIndicators: boolean;
    autoApplyCustomizations: boolean;
    saveHistory: boolean;
  };
  metadata: {
    lastUpdated: Date;
    version: string;
    userId?: string;
  };
}

/**
 * Enhanced Mind Map Integration Implementation
 */
export class MindMapIntegrationSystem implements MindMapIntegration {
  /**
   * Enhance AI recommendations with mind map context
   */
  enhanceAIRecommendations(
    recommendations: any[],
    sourcePost: CollectionEntry<"docs">,
    customizations?: MindMapCustomization[],
  ): EnhancedRecommendation[] {
    const customizedBranches = MindMapUtils.applyMindMapCustomizations(
      MIND_MAP_BRANCHES,
      customizations,
    );

    return recommendations.map((recommendation) => {
      const sourceAnalysis = this.analyzePostWithCustomizations(
        sourcePost,
        customizations,
      );
      const targetAnalysis = this.analyzePostWithCustomizations(
        { slug: recommendation.targetSlug } as CollectionEntry<"docs">,
        customizations,
      );

      const relationshipType = this.determineRelationshipType(
        sourceAnalysis.mindMapBranch,
        targetAnalysis.mindMapBranch,
      );

      const visualConnection = this.generateVisualConnection(
        relationshipType,
        sourceAnalysis,
        targetAnalysis,
      );

      const ui = this.generateRecommendationUI(
        relationshipType,
        sourceAnalysis,
        targetAnalysis,
        recommendation.score,
      );

      return {
        ...recommendation,
        mindMapContext: {
          sourceBranch: sourceAnalysis.mindMapBranch,
          targetBranch: targetAnalysis.mindMapBranch,
          relationshipType,
          visualConnection,
          branchData: {
            source: customizedBranches[sourceAnalysis.mindMapBranch],
            target: customizedBranches[targetAnalysis.mindMapBranch],
          },
        },
        ui,
      };
    });
  }

  /**
   * Enhance internal links with visual relationship indicators
   */
  enhanceInternalLinks(
    links: InternalLinkSuggestion[],
    sourcePost: CollectionEntry<"docs">,
    customizations?: MindMapCustomization[],
  ): EnhancedInternalLink[] {
    const customizedBranches = MindMapUtils.applyMindMapCustomizations(
      MIND_MAP_BRANCHES,
      customizations,
    );

    return links.map((link) => {
      const sourceAnalysis = this.analyzePostWithCustomizations(
        sourcePost,
        customizations,
      );
      const targetAnalysis = this.analyzePostWithCustomizations(
        { slug: link.targetSlug } as CollectionEntry<"docs">,
        customizations,
      );

      const relationshipType = this.determineRelationshipType(
        sourceAnalysis.mindMapBranch,
        targetAnalysis.mindMapBranch,
      );

      const visualConnection = this.generateVisualConnection(
        relationshipType,
        sourceAnalysis,
        targetAnalysis,
      );

      const styling = this.generateLinkStyling(
        relationshipType,
        sourceAnalysis,
        targetAnalysis,
        link.relevance,
      );

      return {
        ...link,
        mindMapContext: {
          sourceBranch: sourceAnalysis.mindMapBranch,
          targetBranch: targetAnalysis.mindMapBranch,
          relationshipType,
          visualConnection,
        },
        styling,
      };
    });
  }

  /**
   * Enhance content analysis with mind map visualization data
   */
  enhanceContentAnalysis(
    analysis: ContentAnalysisResult,
    customizations?: MindMapCustomization[],
  ): EnhancedContentAnalysis {
    const customizedBranches = MindMapUtils.applyMindMapCustomizations(
      MIND_MAP_BRANCHES,
      customizations,
    );

    const branchData =
      customizedBranches[
        analysis.mindMapBranch as keyof typeof MIND_MAP_BRANCHES
      ];

    const mindMapVisualization = {
      branchColor: branchData.visual.color,
      branchIcon: branchData.visual.icon,
      branchGradient: branchData.visual.gradient,
      connectionStyle: "solid",
      position: this.calculateBranchPosition(analysis.mindMapBranch),
    };

    const relatedBranches = this.findRelatedBranches(
      analysis.mindMapBranch,
      customizedBranches,
    );

    const learningPath = this.calculateLearningPath(
      analysis.mindMapBranch,
      customizedBranches,
    );

    return {
      ...analysis,
      mindMapVisualization,
      relatedBranches,
      learningPath,
    };
  }

  /**
   * Save user customizations to localStorage
   */
  saveUserCustomizations(customizations: MindMapCustomization[]): void {
    if (typeof window !== "undefined") {
      const settings: UserMindMapSettings = {
        customizations,
        config: DEFAULT_MIND_MAP_CONFIG,
        preferences: {
          showMindMapContext: true,
          showRelationshipIndicators: true,
          autoApplyCustomizations: true,
          saveHistory: true,
        },
        metadata: {
          lastUpdated: new Date(),
          version: "2.0.0",
        },
      };

      localStorage.setItem("mindMapSettings", JSON.stringify(settings));
    }
  }

  /**
   * Load user customizations from localStorage
   */
  loadUserCustomizations(): MindMapCustomization[] {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mindMapSettings");
      if (stored) {
        try {
          const settings: UserMindMapSettings = JSON.parse(stored);
          return settings.customizations || [];
        } catch (error) {
          console.warn("Failed to load mind map customizations:", error);
        }
      }
    }
    return [];
  }

  /**
   * Export user settings
   */
  exportUserSettings(): UserMindMapSettings {
    const customizations = this.loadUserCustomizations();
    return {
      customizations,
      config: DEFAULT_MIND_MAP_CONFIG,
      preferences: {
        showMindMapContext: true,
        showRelationshipIndicators: true,
        autoApplyCustomizations: true,
        saveHistory: true,
      },
      metadata: {
        lastUpdated: new Date(),
        version: "2.0.0",
      },
    };
  }

  /**
   * Import user settings
   */
  importUserSettings(settings: UserMindMapSettings): void {
    this.saveUserCustomizations(settings.customizations);
  }

  // Private helper methods

  private analyzePostWithCustomizations(
    post: CollectionEntry<"docs">,
    customizations?: MindMapCustomization[],
  ): ContentAnalysisResult {
    // This would integrate with the existing analyzeContent function
    // For now, return a basic analysis
    return {
      mindMapBranch: "A",
      mindMapBranchData: MIND_MAP_BRANCHES.A,
      keywords: ["immersion", "filosofi"],
      difficulty: "beginner",
      contentType: "guide",
    };
  }

  private determineRelationshipType(
    sourceBranch: string,
    targetBranch: string,
  ): "same-branch" | "related-branch" | "progression" | "complementary" {
    if (sourceBranch === targetBranch) {
      return "same-branch";
    }

    // Define progression relationships
    const progressionMap: Record<string, string[]> = {
      A: ["B", "C"],
      B: ["C", "E"],
      C: ["D", "E"],
      D: ["E"],
      E: [],
    };

    if (progressionMap[sourceBranch]?.includes(targetBranch)) {
      return "progression";
    }

    // Define complementary relationships
    const complementaryMap: Record<string, string[]> = {
      A: ["D"],
      B: ["D"],
      C: ["A"],
      D: ["B"],
      E: ["A", "B", "C"],
    };

    if (complementaryMap[sourceBranch]?.includes(targetBranch)) {
      return "complementary";
    }

    return "related-branch";
  }

  private generateVisualConnection(
    relationshipType: string,
    sourceAnalysis: ContentAnalysisResult,
    targetAnalysis: ContentAnalysisResult,
  ) {
    const baseConnection = {
      style: "solid" as const,
      thickness: "medium" as const,
    };

    switch (relationshipType) {
      case "same-branch":
        return {
          ...baseConnection,
          color: sourceAnalysis.mindMapBranchData.visual.color,
          style: "solid" as const,
          thickness: "thick" as const,
        };
      case "progression":
        return {
          ...baseConnection,
          color: "#10B981",
          style: "solid" as const,
          thickness: "medium" as const,
        };
      case "complementary":
        return {
          ...baseConnection,
          color: "#F59E0B",
          style: "dashed" as const,
          thickness: "medium" as const,
        };
      default:
        return {
          ...baseConnection,
          color: "#6B7280",
          style: "dotted" as const,
          thickness: "thin" as const,
        };
    }
  }

  private generateRecommendationUI(
    relationshipType: string,
    sourceAnalysis: ContentAnalysisResult,
    targetAnalysis: ContentAnalysisResult,
    score: number,
  ) {
    const relationshipLabels = {
      "same-branch": "Same Topic",
      progression: "Next Step",
      complementary: "Related",
      "related-branch": "Connected",
    };

    const relationshipIcons = {
      "same-branch": "🔄",
      progression: "➡️",
      complementary: "🔗",
      "related-branch": "📎",
    };

    const relationshipColors = {
      "same-branch": sourceAnalysis.mindMapBranchData.visual.color,
      progression: "#10B981",
      complementary: "#F59E0B",
      "related-branch": "#6B7280",
    };

    return {
      badgeText:
        relationshipLabels[relationshipType as keyof typeof relationshipLabels],
      badgeColor:
        relationshipColors[relationshipType as keyof typeof relationshipColors],
      tooltipText: `${relationshipLabels[relationshipType as keyof typeof relationshipLabels]} content from ${targetAnalysis.mindMapBranchData.displayName}`,
      icon: relationshipIcons[
        relationshipType as keyof typeof relationshipIcons
      ],
    };
  }

  private generateLinkStyling(
    relationshipType: string,
    sourceAnalysis: ContentAnalysisResult,
    targetAnalysis: ContentAnalysisResult,
    relevance: number,
  ) {
    const baseStyling = {
      borderColor: "#E5E7EB",
      backgroundColor: "#F9FAFB",
      icon: "🔗",
      badgeText: "Related",
    };

    switch (relationshipType) {
      case "same-branch":
        return {
          ...baseStyling,
          borderColor: sourceAnalysis.mindMapBranchData.visual.color,
          backgroundColor: `${sourceAnalysis.mindMapBranchData.visual.color}10`,
          icon: "🔄",
          badgeText: "Same Topic",
        };
      case "progression":
        return {
          ...baseStyling,
          borderColor: "#10B981",
          backgroundColor: "#10B98110",
          icon: "➡️",
          badgeText: "Next Step",
        };
      case "complementary":
        return {
          ...baseStyling,
          borderColor: "#F59E0B",
          backgroundColor: "#F59E0B10",
          icon: "🔗",
          badgeText: "Related",
        };
      default:
        return baseStyling;
    }
  }

  private calculateBranchPosition(branchId: string) {
    // Calculate position in mind map layout
    const positions = {
      A: { x: 50, y: 20 }, // Center top
      B: { x: 20, y: 50 }, // Left center
      C: { x: 80, y: 50 }, // Right center
      D: { x: 35, y: 80 }, // Bottom left
      E: { x: 65, y: 80 }, // Bottom right
    };

    return positions[branchId as keyof typeof positions] || { x: 50, y: 50 };
  }

  private findRelatedBranches(
    sourceBranch: string,
    branches: typeof MIND_MAP_BRANCHES,
  ) {
    const related = [];

    for (const [branchId, branch] of Object.entries(branches)) {
      if (branchId !== sourceBranch) {
        const relationshipType = this.determineRelationshipType(
          sourceBranch,
          branchId,
        );
        const strength = this.calculateRelationshipStrength(relationshipType);

        related.push({
          branchId,
          relationshipType,
          strength,
        });
      }
    }

    return related.sort((a, b) => b.strength - a.strength);
  }

  private calculateRelationshipStrength(relationshipType: string): number {
    const strengths = {
      "same-branch": 1.0,
      progression: 0.8,
      complementary: 0.6,
      "related-branch": 0.4,
    };

    return strengths[relationshipType as keyof typeof strengths] || 0.3;
  }

  private calculateLearningPath(
    currentBranch: string,
    branches: typeof MIND_MAP_BRANCHES,
  ) {
    const progressionMap: Record<string, string[]> = {
      A: ["B", "C"],
      B: ["C", "E"],
      C: ["D", "E"],
      D: ["E"],
      E: [],
    };

    const previousBranches = Object.entries(progressionMap)
      .filter(([_, nextBranches]) => nextBranches.includes(currentBranch))
      .map(([branchId]) => branchId);

    const nextBranches = progressionMap[currentBranch] || [];

    const totalBranches = Object.keys(branches).length;
    const currentIndex = Object.keys(branches).indexOf(currentBranch);
    const progress = ((currentIndex + 1) / totalBranches) * 100;

    return {
      previousBranch: previousBranches[0],
      currentBranch,
      nextBranch: nextBranches[0],
      progress: Math.round(progress),
    };
  }
}

// Export singleton instance
export const mindMapIntegration = new MindMapIntegrationSystem();

// Export utility functions for easy integration
export const MindMapIntegrationUtils = {
  /**
   * Quick integration for AI recommendations
   */
  enhanceRecommendations: (
    recommendations: any[],
    sourcePost: CollectionEntry<"docs">,
  ) => mindMapIntegration.enhanceAIRecommendations(recommendations, sourcePost),

  /**
   * Quick integration for internal links
   */
  enhanceLinks: (
    links: InternalLinkSuggestion[],
    sourcePost: CollectionEntry<"docs">,
  ) => mindMapIntegration.enhanceInternalLinks(links, sourcePost),

  /**
   * Quick integration for content analysis
   */
  enhanceAnalysis: (analysis: ContentAnalysisResult) =>
    mindMapIntegration.enhanceContentAnalysis(analysis),

  /**
   * Get user customizations
   */
  getUserCustomizations: () => mindMapIntegration.loadUserCustomizations(),

  /**
   * Save user customizations
   */
  saveCustomizations: (customizations: MindMapCustomization[]) =>
    mindMapIntegration.saveUserCustomizations(customizations),
};
