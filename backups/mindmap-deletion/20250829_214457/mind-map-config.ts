/**
 * Simplified Mind Map Configuration
 *
 * This file contains the mind map structure in a simple, text-editor-friendly format.
 * Edit this file to customize your mind map - no complex UI needed!
 *
 * Structure:
 * - Each branch (A-E) represents a learning area
 * - Visual properties define colors and icons
 * - Keywords help with content classification
 * - Description explains the branch purpose
 */

export interface MindMapBranch {
  id: string;
  name: string;
  displayName: string;
  description: string;
  keywords: string[];
  visual: {
    color: string;
    icon: string;
    gradient: string;
    borderColor: string;
    backgroundColor: string;
  };
  content: {
    difficulty: "beginner" | "intermediate" | "advanced";
    type: "guide" | "tutorial" | "theory" | "practice" | "tool" | "review";
  };
}

export interface MindMapConfig {
  version: string;
  title: string;
  description: string;
  branches: Record<string, MindMapBranch>;
  connections: MindMapConnection[];
}

export interface MindMapConnection {
  from: string;
  to: string;
  type: "progression" | "related" | "complementary";
  description: string;
}

// Main Mind Map Configuration
export const MIND_MAP_CONFIG: MindMapConfig = {
  version: "3.0.0",
  title: "Japanese Immersion Learning Mind Map",
  description:
    "Visual representation of Japanese immersion learning methodology",

  branches: {
    A: {
      id: "A",
      name: "Landasan & Filosofi",
      displayName: "Landasan & Filosofi",
      description: "Foundation & Philosophy of Japanese immersion learning",
      keywords: [
        "immersion",
        "filosofi",
        "teori",
        "konsep",
        "metodologi",
        "prinsip",
      ],
      visual: {
        color: "#8B5DFF",
        icon: "🏛️",
        gradient: "linear-gradient(135deg, #8B5DFF 0%, #7B4DEF 100%)",
        borderColor: "#7B4DEF",
        backgroundColor: "rgba(139, 93, 255, 0.1)",
      },
      content: {
        difficulty: "beginner",
        type: "theory",
      },
    },

    B: {
      id: "B",
      name: "Tahap Pembelajaran",
      displayName: "Tahap Pembelajaran",
      description: "Learning stages and progression framework",
      keywords: [
        "tahap",
        "pembelajaran",
        "pemanasan",
        "starter",
        "normalisasi",
        "kompeten",
        "progresi",
      ],
      visual: {
        color: "#E4B43B",
        icon: "📚",
        gradient: "linear-gradient(135deg, #E4B43B 0%, #D4A42B 100%)",
        borderColor: "#D4A42B",
        backgroundColor: "rgba(228, 180, 59, 0.1)",
      },
      content: {
        difficulty: "beginner",
        type: "guide",
      },
    },

    C: {
      id: "C",
      name: "Kerangka Pemahaman 7 Tingkat",
      displayName: "Kerangka Pemahaman 7 Tingkat",
      description: "7-level understanding framework for language acquisition",
      keywords: [
        "tingkat",
        "level",
        "pemahaman",
        "kerangka",
        "understanding",
        "framework",
        "7-level",
      ],
      visual: {
        color: "#10B981",
        icon: "🎯",
        gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
        borderColor: "#059669",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
      },
      content: {
        difficulty: "intermediate",
        type: "theory",
      },
    },

    D: {
      id: "D",
      name: "Tools & Resource",
      displayName: "Tools & Resource",
      description: "Tools and resources for Japanese learning",
      keywords: [
        "tools",
        "resource",
        "anki",
        "kamus",
        "aplikasi",
        "platform",
        "software",
      ],
      visual: {
        color: "#F59E0B",
        icon: "🛠️",
        gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
        borderColor: "#D97706",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
      },
      content: {
        difficulty: "beginner",
        type: "tool",
      },
    },

    E: {
      id: "E",
      name: "Praktik & Aplikasi",
      displayName: "Praktik & Aplikasi",
      description: "Practical application and real-world usage",
      keywords: [
        "praktik",
        "aplikasi",
        "latihan",
        "contoh",
        "implementasi",
        "real-world",
        "practice",
      ],
      visual: {
        color: "#EF4444",
        icon: "🔥",
        gradient: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
        borderColor: "#DC2626",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
      },
      content: {
        difficulty: "advanced",
        type: "practice",
      },
    },
  },

  connections: [
    {
      from: "A",
      to: "B",
      type: "progression",
      description: "Foundation leads to learning stages",
    },
    {
      from: "B",
      to: "C",
      type: "progression",
      description: "Stages build understanding framework",
    },
    {
      from: "C",
      to: "D",
      type: "related",
      description: "Understanding guides tool selection",
    },
    {
      from: "D",
      to: "E",
      type: "progression",
      description: "Tools enable practical application",
    },
    {
      from: "A",
      to: "E",
      type: "complementary",
      description: "Philosophy guides practice",
    },
    {
      from: "B",
      to: "D",
      type: "related",
      description: "Stages inform resource needs",
    },
  ],
};

// Utility functions for mind map operations
export const MindMapUtils = {
  /**
   * Get all branches as an array
   */
  getBranches(): MindMapBranch[] {
    return Object.values(MIND_MAP_CONFIG.branches);
  },

  /**
   * Get a specific branch by ID
   */
  getBranch(id: string): MindMapBranch | undefined {
    return MIND_MAP_CONFIG.branches[id];
  },

  /**
   * Get connections for a specific branch
   */
  getBranchConnections(branchId: string): MindMapConnection[] {
    return MIND_MAP_CONFIG.connections.filter(
      (conn) => conn.from === branchId || conn.to === branchId,
    );
  },

  /**
   * Find related branches
   */
  getRelatedBranches(branchId: string): string[] {
    const connections = this.getBranchConnections(branchId);
    return connections.map((conn) =>
      conn.from === branchId ? conn.to : conn.from,
    );
  },

  /**
   * Export mind map data for external use
   */
  exportData() {
    return {
      ...MIND_MAP_CONFIG,
      metadata: {
        totalBranches: Object.keys(MIND_MAP_CONFIG.branches).length,
        totalConnections: MIND_MAP_CONFIG.connections.length,
        lastUpdated: new Date().toISOString(),
      },
    };
  },

  /**
   * Apply mind map customizations to branches
   */
  applyMindMapCustomizations(
    branches: Record<string, MindMapBranch>,
    customizations?: any[],
  ): Record<string, MindMapBranch> {
    if (!customizations || customizations.length === 0) {
      return branches;
    }

    const customizedBranches = { ...branches };

    customizations.forEach((customization) => {
      const branchId = customization.branchId;
      if (customizedBranches[branchId]) {
        const branch = customizedBranches[branchId];

        // Apply customizations (name, color, icon, keywords, description)
        if (customization.customizations?.name) {
          branch.displayName = customization.customizations.name;
        }
        if (customization.customizations?.color) {
          branch.visual.color = customization.customizations.color;
        }
        if (customization.customizations?.icon) {
          branch.visual.icon = customization.customizations.icon;
        }
        if (customization.customizations?.keywords) {
          branch.keywords = customization.customizations.keywords;
        }
        if (customization.customizations?.description) {
          branch.description = customization.customizations.description;
        }
      }
    });

    return customizedBranches;
  },

  /**
   * Validate mind map configuration
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check if all branches exist
    Object.keys(MIND_MAP_CONFIG.branches).forEach((branchId) => {
      if (!MIND_MAP_CONFIG.branches[branchId]) {
        errors.push(`Branch ${branchId} is missing`);
      }
    });

    // Check if all connections reference valid branches
    MIND_MAP_CONFIG.connections.forEach((conn, index) => {
      if (!MIND_MAP_CONFIG.branches[conn.from]) {
        errors.push(
          `Connection ${index + 1}: Invalid 'from' branch '${conn.from}'`,
        );
      }
      if (!MIND_MAP_CONFIG.branches[conn.to]) {
        errors.push(
          `Connection ${index + 1}: Invalid 'to' branch '${conn.to}'`,
        );
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

// Export for use in other files
export default MIND_MAP_CONFIG;
