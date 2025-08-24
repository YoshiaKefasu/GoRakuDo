/**
 * Content Configuration System
 *
 * This system provides a simple, text-editor-friendly way to manage:
 * - Categories and tags for content organization
 * - Filter buttons and their behavior
 * - Mind map integration
 * - Content recommendations
 * - Search suggestions
 *
 * Edit this file to customize your content organization - no complex UI needed!
 */

export interface ContentCategory {
  id: string;
  name: string;
  displayName: string;
  description: string;
  color: string;
  icon: string;
  keywords: string[];
  priority: number;
  isActive: boolean;
}

export interface ContentTag {
  id: string;
  name: string;
  displayName: string;
  description: string;
  color: string;
  category: string; // Links to a category
  isActive: boolean;
}

export interface ContentFilter {
  id: string;
  name: string;
  displayName: string;
  type: "category" | "tag" | "mind-map" | "custom";
  target: string; // category ID, tag ID, mind map branch ID, or custom logic
  color: string;
  icon: string;
  description: string;
  isActive: boolean;
  showCount: boolean;
  priority: number;
}

export interface MindMapIntegration {
  enabled: boolean;
  branches: string[]; // Array of mind map branch IDs to include
  autoGenerateFilters: boolean;
  customFilters: ContentFilter[];
}

export interface SearchSuggestions {
  enabled: boolean;
  suggestions: string[];
  maxSuggestions: number;
  autoGenerate: boolean;
}

export interface ContentConfig {
  version: string;
  categories: Record<string, ContentCategory>;
  tags: Record<string, ContentTag>;
  filters: Record<string, ContentFilter>;
  mindMap: MindMapIntegration;
  search: SearchSuggestions;
  metadata: {
    lastUpdated: string;
    totalCategories: number;
    totalTags: number;
    totalFilters: number;
  };
}

// Main Configuration - EDIT THIS FILE TO CUSTOMIZE YOUR CONTENT!
export const CONTENT_CONFIG: ContentConfig = {
  version: "1.0.0",

  // Categories - Main content organization
  categories: {
    beginner: {
      id: "beginner",
      name: "beginner",
      displayName: "Dokumentasi Pemula",
      description:
        "Content for beginners starting their Japanese learning journey",
      color: "#10B981",
      icon: "🌱",
      keywords: ["pemula", "beginner", "awal", "dasar", "pemanasan"],
      priority: 1,
      isActive: true,
    },

    getting_started: {
      id: "getting_started",
      name: "getting-started",
      displayName: "Memulai",
      description: "Getting started guides and tutorials",
      color: "#3B82F6",
      icon: "🚀",
      keywords: ["memulai", "getting started", "tutorial", "guide", "awal"],
      priority: 2,
      isActive: true,
    },

    methodology: {
      id: "methodology",
      name: "methodology",
      displayName: "Metodologi",
      description: "Learning methodology and theory",
      color: "#8B5CF6",
      icon: "📚",
      keywords: ["metodologi", "methodology", "teori", "theory", "filosofi"],
      priority: 3,
      isActive: true,
    },

    tools: {
      id: "tools",
      name: "tools",
      displayName: "Tools",
      description: "Tools and resources for Japanese learning",
      color: "#F59E0B",
      icon: "🛠️",
      keywords: ["tools", "anki", "aplikasi", "software", "resource"],
      priority: 4,
      isActive: true,
    },

    advanced: {
      id: "advanced",
      name: "advanced",
      displayName: "Lanjutan",
      description: "Advanced topics and techniques",
      color: "#EF4444",
      icon: "🔥",
      keywords: ["lanjutan", "advanced", "mahir", "expert", "tingkat tinggi"],
      priority: 5,
      isActive: true,
    },
  },

  // Tags - Specific content labels
  tags: {
    immersion: {
      id: "immersion",
      name: "immersion",
      displayName: "Immersion",
      description: "Immersion learning techniques",
      color: "#8B5CF6",
      category: "methodology",
      isActive: true,
    },

    anki: {
      id: "anki",
      name: "anki",
      displayName: "Anki",
      description: "Anki flashcard system",
      color: "#F59E0B",
      category: "tools",
      isActive: true,
    },

    manga: {
      id: "manga",
      name: "manga",
      displayName: "Manga",
      description: "Manga reading and comprehension",
      color: "#EF4444",
      category: "advanced",
      isActive: true,
    },

    anime: {
      id: "anime",
      name: "anime",
      displayName: "Anime",
      description: "Anime watching and listening",
      color: "#EC4899",
      category: "advanced",
      isActive: true,
    },

    grammar: {
      id: "grammar",
      name: "grammar",
      displayName: "Grammar",
      description: "Japanese grammar concepts",
      color: "#10B981",
      category: "methodology",
      isActive: true,
    },

    vocabulary: {
      id: "vocabulary",
      name: "vocabulary",
      displayName: "Vocabulary",
      description: "Vocabulary building techniques",
      color: "#3B82F6",
      category: "methodology",
      isActive: true,
    },

    pronunciation: {
      id: "pronunciation",
      name: "pronunciation",
      displayName: "Pronunciation",
      description: "Japanese pronunciation and pitch accent",
      color: "#06B6D4",
      category: "beginner",
      isActive: true,
    },

    kanji: {
      id: "kanji",
      name: "kanji",
      displayName: "Kanji",
      description: "Kanji learning methods",
      color: "#DC2626",
      category: "advanced",
      isActive: true,
    },
  },

  // Filters - What appears in the filter buttons
  filters: {
    all: {
      id: "all",
      name: "all",
      displayName: "Semua",
      type: "custom",
      target: "all",
      color: "#6B7280",
      icon: "📚",
      description: "Show all content",
      isActive: true,
      showCount: true,
      priority: 1,
    },

    beginner_filter: {
      id: "beginner_filter",
      name: "beginner",
      displayName: "Dokumentasi Pemula",
      type: "category",
      target: "beginner",
      color: "#10B981",
      icon: "🌱",
      description: "Beginner-friendly content",
      isActive: true,
      showCount: true,
      priority: 2,
    },

    getting_started_filter: {
      id: "getting_started_filter",
      name: "getting-started",
      displayName: "Memulai",
      type: "category",
      target: "getting_started",
      color: "#3B82F6",
      icon: "🚀",
      description: "Getting started guides",
      isActive: true,
      showCount: true,
      priority: 3,
    },

    methodology_filter: {
      id: "methodology_filter",
      name: "methodology",
      displayName: "Metodologi",
      type: "category",
      target: "methodology",
      color: "#8B5CF6",
      icon: "📚",
      description: "Learning methodology",
      isActive: true,
      showCount: true,
      priority: 4,
    },

    tools_filter: {
      id: "tools_filter",
      name: "tools",
      displayName: "Tools",
      type: "category",
      target: "tools",
      color: "#F59E0B",
      icon: "🛠️",
      description: "Tools and resources",
      isActive: true,
      showCount: true,
      priority: 5,
    },

    advanced_filter: {
      id: "advanced_filter",
      name: "advanced",
      displayName: "Lanjutan",
      type: "category",
      target: "advanced",
      color: "#EF4444",
      icon: "🔥",
      description: "Advanced topics",
      isActive: true,
      showCount: true,
      priority: 6,
    },
  },

  // Mind Map Integration
  mindMap: {
    enabled: true,
    branches: ["A", "B", "C", "D", "E"], // All mind map branches
    autoGenerateFilters: true,
    customFilters: [
      {
        id: "mind_map_foundation",
        name: "mind-map-foundation",
        displayName: "Landasan & Filosofi",
        type: "mind-map",
        target: "A",
        color: "#8B5DFF",
        icon: "🏛️",
        description: "Foundation & Philosophy content",
        isActive: true,
        showCount: true,
        priority: 8,
      },
      {
        id: "mind_map_learning_stages",
        name: "mind-map-learning-stages",
        displayName: "Tahap Pembelajaran",
        type: "mind-map",
        target: "B",
        color: "#E4B43B",
        icon: "📚",
        description: "Learning stages content",
        isActive: true,
        showCount: true,
        priority: 9,
      },
      {
        id: "mind_map_understanding_framework",
        name: "mind-map-understanding-framework",
        displayName: "Kerangka Pemahaman",
        type: "mind-map",
        target: "C",
        color: "#10B981",
        icon: "🎯",
        description: "Understanding framework content",
        isActive: true,
        showCount: true,
        priority: 10,
      },
      {
        id: "mind_map_tools_resources",
        name: "mind-map-tools-resources",
        displayName: "Tools & Resources",
        type: "mind-map",
        target: "D",
        color: "#F59E0B",
        icon: "🛠️",
        description: "Tools and resources content",
        isActive: true,
        showCount: true,
        priority: 11,
      },
      {
        id: "mind_map_practice_application",
        name: "mind-map-practice-application",
        displayName: "Praktik & Aplikasi",
        type: "mind-map",
        target: "E",
        color: "#EF4444",
        icon: "🔥",
        description: "Practical application content",
        isActive: true,
        showCount: true,
        priority: 12,
      },
    ],
  },

  // Search Suggestions
  search: {
    enabled: true,
    suggestions: [
      "immersion",
      "anki",
      "manga",
      "anime",
      "grammar",
      "vocabulary",
      "pronunciation",
      "kanji",
      "pemula",
      "lanjutan",
      "metodologi",
      "tools",
    ],
    maxSuggestions: 6,
    autoGenerate: true,
  },

  // Metadata - Will be calculated automatically
  metadata: {
    lastUpdated: new Date().toISOString(),
    totalCategories: 0, // Will be calculated automatically
    totalTags: 0, // Will be calculated automatically
    totalFilters: 0, // Will be calculated automatically
  },
};

// Utility functions for content configuration
export const ContentConfigUtils = {
  /**
   * Get all active categories
   */
  getActiveCategories(): ContentCategory[] {
    return Object.values(CONTENT_CONFIG.categories).filter(
      (cat) => cat.isActive,
    );
  },

  /**
   * Get all active tags
   */
  getActiveTags(): ContentTag[] {
    return Object.values(CONTENT_CONFIG.tags).filter((tag) => tag.isActive);
  },

  /**
   * Get all active filters
   */
  getActiveFilters(): ContentFilter[] {
    return Object.values(CONTENT_CONFIG.filters).filter(
      (filter) => filter.isActive,
    );
  },

  /**
   * Get filters sorted by priority
   */
  getSortedFilters(): ContentFilter[] {
    return this.getActiveFilters().sort((a, b) => a.priority - b.priority);
  },

  /**
   * Get category by ID
   */
  getCategory(id: string): ContentCategory | undefined {
    return CONTENT_CONFIG.categories[id];
  },

  /**
   * Get tag by ID
   */
  getTag(id: string): ContentTag | undefined {
    return CONTENT_CONFIG.tags[id];
  },

  /**
   * Get filter by ID
   */
  getFilter(id: string): ContentFilter | undefined {
    return CONTENT_CONFIG.filters[id];
  },

  /**
   * Get tags by category
   */
  getTagsByCategory(categoryId: string): ContentTag[] {
    return this.getActiveTags().filter((tag) => tag.category === categoryId);
  },

  /**
   * Get mind map filters
   */
  getMindMapFilters(): ContentFilter[] {
    return CONTENT_CONFIG.mindMap.customFilters.filter(
      (filter) => filter.isActive,
    );
  },

  /**
   * Get search suggestions
   */
  getSearchSuggestions(): string[] {
    if (!CONTENT_CONFIG.search.enabled) return [];

    if (CONTENT_CONFIG.search.autoGenerate) {
      // Auto-generate from active tags and categories
      const tagNames = this.getActiveTags().map((tag) => tag.name);
      const categoryNames = this.getActiveCategories().map((cat) => cat.name);
      return [...tagNames, ...categoryNames].slice(
        0,
        CONTENT_CONFIG.search.maxSuggestions,
      );
    }

    return CONTENT_CONFIG.search.suggestions.slice(
      0,
      CONTENT_CONFIG.search.maxSuggestions,
    );
  },

  /**
   * Count posts by category
   */
  countPostsByCategory(posts: any[], categoryId: string): number {
    return posts.filter((post) => {
      const category = this.getCategory(categoryId);
      if (!category) return false;

      // Check if post matches category keywords
      return category.keywords.some(
        (keyword) =>
          post.data.title?.toLowerCase().includes(keyword.toLowerCase()) ||
          post.data.description
            ?.toLowerCase()
            .includes(keyword.toLowerCase()) ||
          post.data.category === category.name ||
          post.data.learningStage === category.name,
      );
    }).length;
  },

  /**
   * Count posts by tag
   */
  countPostsByTag(posts: any[], tagId: string): number {
    return posts.filter((post) => {
      const tag = this.getTag(tagId);
      if (!tag) return false;

      return (
        post.data.tags?.some(
          (postTag: string) => postTag.toLowerCase() === tag.name.toLowerCase(),
        ) || false
      );
    }).length;
  },

  /**
   * Count posts by mind map branch
   */
  countPostsByMindMapBranch(posts: any[], branchId: string): number {
    // This would integrate with your mind map system
    // For now, return a placeholder count
    return Math.floor(Math.random() * 5) + 1;
  },

  /**
   * Filter posts by category
   */
  filterPostsByCategory(posts: any[], categoryId: string): any[] {
    const category = this.getCategory(categoryId);
    if (!category) return [];

    return posts.filter((post) =>
      category.keywords.some(
        (keyword) =>
          post.data.title?.toLowerCase().includes(keyword.toLowerCase()) ||
          post.data.description
            ?.toLowerCase()
            .includes(keyword.toLowerCase()) ||
          post.data.category === category.name ||
          post.data.learningStage === category.name,
      ),
    );
  },

  /**
   * Filter posts by tag
   */
  filterPostsByTag(posts: any[], tagId: string): any[] {
    const tag = this.getTag(tagId);
    if (!tag) return [];

    return posts.filter(
      (post) =>
        post.data.tags?.some(
          (postTag: string) => postTag.toLowerCase() === tag.name.toLowerCase(),
        ) || false,
    );
  },

  /**
   * Filter posts by mind map branch
   */
  filterPostsByMindMapBranch(posts: any[], branchId: string): any[] {
    // This would integrate with your mind map system
    // For now, return a subset of posts
    return posts.slice(0, Math.floor(posts.length / 2));
  },

  /**
   * Get filter count for display
   */
  getFilterCount(posts: any[], filter: ContentFilter): number {
    switch (filter.type) {
      case "category":
        return this.countPostsByCategory(posts, filter.target);
      case "tag":
        return this.countPostsByTag(posts, filter.target);
      case "mind-map":
        return this.countPostsByMindMapBranch(posts, filter.target);
      case "custom":
        if (filter.target === "all") return posts.length;
        return 0;
      default:
        return 0;
    }
  },

  /**
   * Apply filter to posts
   */
  applyFilter(posts: any[], filter: ContentFilter): any[] {
    switch (filter.type) {
      case "category":
        return this.filterPostsByCategory(posts, filter.target);
      case "tag":
        return this.filterPostsByTag(posts, filter.target);
      case "mind-map":
        return this.filterPostsByMindMapBranch(posts, filter.target);
      case "custom":
        if (filter.target === "all") return posts;
        return [];
      default:
        return [];
    }
  },

  /**
   * Validate configuration
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check categories
    Object.entries(CONTENT_CONFIG.categories).forEach(([id, category]) => {
      if (!category.name || !category.displayName) {
        errors.push(`Category ${id}: Missing required fields`);
      }
    });

    // Check tags
    Object.entries(CONTENT_CONFIG.tags).forEach(([id, tag]) => {
      if (!tag.name || !tag.displayName) {
        errors.push(`Tag ${id}: Missing required fields`);
      }
      if (!CONTENT_CONFIG.categories[tag.category]) {
        errors.push(`Tag ${id}: Invalid category reference '${tag.category}'`);
      }
    });

    // Check filters
    Object.entries(CONTENT_CONFIG.filters).forEach(([id, filter]) => {
      if (!filter.name || !filter.displayName) {
        errors.push(`Filter ${id}: Missing required fields`);
      }

      // Validate filter targets
      switch (filter.type) {
        case "category":
          if (!CONTENT_CONFIG.categories[filter.target]) {
            errors.push(
              `Filter ${id}: Invalid category target '${filter.target}'`,
            );
          }
          break;
        case "tag":
          if (!CONTENT_CONFIG.tags[filter.target]) {
            errors.push(`Filter ${id}: Invalid tag target '${filter.target}'`);
          }
          break;
        case "mind-map":
          // Validate mind map branch exists
          if (!CONTENT_CONFIG.mindMap.branches.includes(filter.target)) {
            errors.push(
              `Filter ${id}: Invalid mind map branch target '${filter.target}'`,
            );
          }
          break;
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Export configuration for external use
   */
  exportConfig() {
    return {
      ...CONTENT_CONFIG,
      metadata: {
        lastUpdated: new Date().toISOString(),
        totalCategories: Object.keys(CONTENT_CONFIG.categories).length,
        totalTags: Object.keys(CONTENT_CONFIG.tags).length,
        totalFilters: Object.keys(CONTENT_CONFIG.filters).length,
      },
    };
  },

  /**
   * Get current metadata with automatic counting
   */
  getMetadata() {
    return {
      lastUpdated: new Date().toISOString(),
      totalCategories: Object.keys(CONTENT_CONFIG.categories).length,
      totalTags: Object.keys(CONTENT_CONFIG.tags).length,
      totalFilters: Object.keys(CONTENT_CONFIG.filters).length,
    };
  },
};

// Export for use in other files
export default CONTENT_CONFIG;
