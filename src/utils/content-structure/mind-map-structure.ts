// Mind Map Structure Utility for AI-Friendly Content Organization
// Phase 1, Step 2: Add AI-friendly content structure
// Based on "Japanese Immersion Mastery" mind map with 5 branches and 7-level framework
// 100% safe implementation with graceful fallbacks

import type { CollectionEntry } from "astro:content";

// Mind Map Branch Definitions
export interface MindMapBranch {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  subBranches: MindMapSubBranch[];
}

export interface MindMapSubBranch {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// 7-Level Understanding Framework
export interface UnderstandingLevel {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  progression: string;
}

// Learning Stage Progression
export interface LearningStage {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: string;
  color: string;
}

// Mind Map Structure Configuration
export const MIND_MAP_BRANCHES: MindMapBranch[] = [
  {
    id: "landasan-filosofi",
    title: "A. Landasan & Filosofi",
    description: "Foundation & Philosophy of Japanese Immersion Learning",
    icon: "🏛️",
    color: "orange",
    subBranches: [
      {
        id: "apa-itu-immersion",
        title: "Apa itu Immersion",
        description: "Understanding what immersion learning means",
        icon: "🌊",
      },
      {
        id: "mengapa-tanpa-terjemahan",
        title: "Mengapa tanpa terjemahan",
        description: "Why we avoid translation in immersion",
        icon: "🚫",
      },
      {
        id: "i-plus-1-comprehensible-input",
        title: "I+1 Comprehensible Input",
        description: "Krashen's Input Hypothesis in practice",
        icon: "📈",
      },
      {
        id: "silent-period-intuisi-native",
        title: "Silent Period & Intuisi Native",
        description: "Silent period and native intuition development",
        icon: "🤫",
      },
      {
        id: "kesalahan-umum",
        title: "Kesalahan Umum",
        description: "Common mistakes in immersion learning",
        icon: "⚠️",
      },
    ],
  },
  {
    id: "tahap-pembelajaran",
    title: "B. Tahap Pembelajaran",
    description: "Learning Stages and Progression",
    icon: "📚",
    color: "green",
    subBranches: [
      {
        id: "tahap-pemanasan",
        title: "1. Tahap Pemanasan (1 Bulan)",
        description: "Warm-up stage for beginners",
        icon: "🔥",
      },
      {
        id: "tahap-starter",
        title: "2. Tahap Starter (3-6 Bulan)",
        description: "Starter stage with basic immersion",
        icon: "🚀",
      },
      {
        id: "tahap-normalisasi",
        title: "3. Tahap Normalisasi (6-12 Bulan)",
        description: "Normalization stage with consistent immersion",
        icon: "⚖️",
      },
      {
        id: "tahap-kompeten",
        title: "4. Tahap Kompeten (Seumur Hidup)",
        description: "Competent stage for lifelong learning",
        icon: "🎯",
      },
    ],
  },
  {
    id: "kerangka-pemahaman",
    title: "C. Kerangka Pemahaman 7 Tingkat",
    description: "7 Levels of Understanding Framework",
    icon: "🏗️",
    color: "blue",
    subBranches: [
      {
        id: "tingkat-0",
        title: "Tingkat 0",
        description: "Complete beginner level",
        icon: "0️⃣",
      },
      {
        id: "tingkat-1",
        title: "Tingkat 1",
        description: "Basic understanding level",
        icon: "1️⃣",
      },
      {
        id: "tingkat-2",
        title: "Tingkat 2",
        description: "Elementary understanding level",
        icon: "2️⃣",
      },
      {
        id: "tingkat-3",
        title: "Tingkat 3",
        description: "Intermediate understanding level",
        icon: "3️⃣",
      },
      {
        id: "tingkat-4",
        title: "Tingkat 4",
        description: "Advanced understanding level",
        icon: "4️⃣",
      },
      {
        id: "tingkat-5",
        title: "Tingkat 5",
        description: "Expert understanding level",
        icon: "5️⃣",
      },
      {
        id: "tingkat-6",
        title: "Tingkat 6",
        description: "Master understanding level",
        icon: "6️⃣",
      },
    ],
  },
  {
    id: "tools-resource",
    title: "D. Tools & Resource",
    description: "Tools and Resources for Immersion Learning",
    icon: "🛠️",
    color: "grey",
    subBranches: [
      {
        id: "anki-leaderboard",
        title: "Anki & Leaderboard",
        description: "Spaced repetition and community features",
        icon: "📊",
      },
      {
        id: "kamus-monolingual",
        title: "Kamus Monolingual",
        description: "Japanese-only dictionaries",
        icon: "📖",
      },
      {
        id: "jpdb-natively-animelon",
        title: "JPDB, Natively, Animelon",
        description: "Advanced learning platforms",
        icon: "🎮",
      },
      {
        id: "youtube-podcast-manga",
        title: "YouTube, Podcast, Manga",
        description: "Multimedia immersion content",
        icon: "📺",
      },
    ],
  },
  {
    id: "strategi-tips",
    title: "E. Strategi & Tips",
    description: "Strategies and Tips for Effective Learning",
    icon: "💡",
    color: "yellow",
    subBranches: [
      {
        id: "daily-routine-checklist",
        title: "Daily Routine Checklist",
        description: "Structured daily learning routine",
        icon: "✅",
      },
      {
        id: "passive-listening",
        title: "Passive Listening",
        description: "Background immersion techniques",
        icon: "🎧",
      },
      {
        id: "sentence-mining",
        title: "Sentence Mining",
        description: "Extracting and learning from context",
        icon: "⛏️",
      },
      {
        id: "genre-fokus-slice-of-life",
        title: "Genre Fokus: Slice of Life",
        description: "Focus on slice-of-life content",
        icon: "🏠",
      },
      {
        id: "hindari-early-output",
        title: "Hindari Early Output",
        description: "Avoiding premature speaking practice",
        icon: "🚫",
      },
    ],
  },
];

// 7-Level Understanding Framework Configuration
export const UNDERSTANDING_LEVELS: UnderstandingLevel[] = [
  {
    id: "tingkat-0",
    title: "Tingkat 0",
    description: "Complete beginner - No prior Japanese knowledge",
    icon: "0️⃣",
    color: "red",
    progression: "Starting point for immersion journey",
  },
  {
    id: "tingkat-1",
    title: "Tingkat 1",
    description: "Basic understanding - Can recognize hiragana/katakana",
    icon: "1️⃣",
    color: "orange",
    progression: "Building foundation with basic scripts",
  },
  {
    id: "tingkat-2",
    title: "Tingkat 2",
    description:
      "Elementary understanding - Basic vocabulary and simple sentences",
    icon: "2️⃣",
    color: "yellow",
    progression: "Expanding vocabulary and simple grammar",
  },
  {
    id: "tingkat-3",
    title: "Tingkat 3",
    description: "Intermediate understanding - Can follow basic conversations",
    icon: "3️⃣",
    color: "lightgreen",
    progression: "Understanding natural speech patterns",
  },
  {
    id: "tingkat-4",
    title: "Tingkat 4",
    description: "Advanced understanding - Can understand most daily content",
    icon: "4️⃣",
    color: "green",
    progression: "Comprehending complex content",
  },
  {
    id: "tingkat-5",
    title: "Tingkat 5",
    description: "Expert understanding - Near-native comprehension",
    icon: "5️⃣",
    color: "blue",
    progression: "Achieving expert-level comprehension",
  },
  {
    id: "tingkat-6",
    title: "Tingkat 6",
    description: "Master understanding - Native-level comprehension",
    icon: "6️⃣",
    color: "purple",
    progression: "Mastery of Japanese comprehension",
  },
];

// Learning Stage Progression Configuration
export const LEARNING_STAGES: LearningStage[] = [
  {
    id: "pemanasan",
    title: "1. Tahap Pemanasan",
    description: "Warm-up stage for complete beginners",
    duration: "1 Bulan",
    icon: "🔥",
    color: "red",
  },
  {
    id: "starter",
    title: "2. Tahap Starter",
    description: "Starter stage with basic immersion setup",
    duration: "3-6 Bulan",
    icon: "🚀",
    color: "orange",
  },
  {
    id: "normalisasi",
    title: "3. Tahap Normalisasi",
    description: "Normalization stage with consistent immersion",
    duration: "6-12 Bulan",
    icon: "⚖️",
    color: "yellow",
  },
  {
    id: "kompeten",
    title: "4. Tahap Kompeten",
    description: "Competent stage for lifelong learning",
    duration: "Seumur Hidup",
    icon: "🎯",
    color: "green",
  },
];

// Utility Functions

/**
 * Get mind map branch by ID
 */
export function getMindMapBranch(branchId: string): MindMapBranch | null {
  try {
    return MIND_MAP_BRANCHES.find((branch) => branch.id === branchId) || null;
  } catch (error) {
    console.warn(
      `⚠️ Error getting mind map branch for ID "${branchId}":`,
      error,
    );
    return null;
  }
}

/**
 * Get understanding level by ID
 */
export function getUnderstandingLevel(
  levelId: string,
): UnderstandingLevel | null {
  try {
    return UNDERSTANDING_LEVELS.find((level) => level.id === levelId) || null;
  } catch (error) {
    console.warn(
      `⚠️ Error getting understanding level for ID "${levelId}":`,
      error,
    );
    return null;
  }
}

/**
 * Get learning stage by ID
 */
export function getLearningStage(stageId: string): LearningStage | null {
  try {
    return LEARNING_STAGES.find((stage) => stage.id === stageId) || null;
  } catch (error) {
    console.warn(`⚠️ Error getting learning stage for ID "${stageId}":`, error);
    return null;
  }
}

/**
 * Get sub-branch by ID
 */
export function getSubBranch(
  branchId: string,
  subBranchId: string,
): MindMapSubBranch | null {
  try {
    const branch = getMindMapBranch(branchId);
    if (!branch) return null;
    return branch.subBranches.find((sub) => sub.id === subBranchId) || null;
  } catch (error) {
    console.warn(
      `⚠️ Error getting sub-branch "${subBranchId}" from branch "${branchId}":`,
      error,
    );
    return null;
  }
}

/**
 * Get posts by mind map branch
 */
export function getPostsByMindMapBranch(
  posts: CollectionEntry<"blog">[],
  branchId: string,
): CollectionEntry<"blog">[] {
  try {
    return posts.filter((post) => post.data.mindMapBranch === branchId);
  } catch (error) {
    console.warn(
      `⚠️ Error filtering posts by mind map branch "${branchId}":`,
      error,
    );
    return [];
  }
}

/**
 * Get posts by understanding level
 */
export function getPostsByUnderstandingLevel(
  posts: CollectionEntry<"blog">[],
  levelId: string,
): CollectionEntry<"blog">[] {
  try {
    return posts.filter((post) => post.data.understandingLevel === levelId);
  } catch (error) {
    console.warn(
      `⚠️ Error filtering posts by understanding level "${levelId}":`,
      error,
    );
    return [];
  }
}

/**
 * Get posts by learning stage
 */
export function getPostsByLearningStage(
  posts: CollectionEntry<"blog">[],
  stageId: string,
): CollectionEntry<"blog">[] {
  try {
    return posts.filter((post) => post.data.learningStage === stageId);
  } catch (error) {
    console.warn(
      `⚠️ Error filtering posts by learning stage "${stageId}":`,
      error,
    );
    return [];
  }
}

/**
 * Generate breadcrumb path for a post
 */
export function generateBreadcrumbPath(
  post: CollectionEntry<"blog">,
): string[] {
  try {
    const breadcrumbs: string[] = ["Home"];

    // Add mind map branch
    const branch = getMindMapBranch(post.data.mindMapBranch);
    if (branch) {
      breadcrumbs.push(branch.title);
    }

    // Add understanding level
    const level = getUnderstandingLevel(post.data.understandingLevel);
    if (level) {
      breadcrumbs.push(level.title);
    }

    // Add post title
    breadcrumbs.push(post.data.title);

    return breadcrumbs;
  } catch (error) {
    console.warn(
      `⚠️ Error generating breadcrumb path for post "${post.slug}":`,
      error,
    );
    return ["Home", post.data.title];
  }
}

/**
 * Get next level in understanding progression
 */
export function getNextUnderstandingLevel(
  currentLevelId: string,
): UnderstandingLevel | null {
  try {
    const currentIndex = UNDERSTANDING_LEVELS.findIndex(
      (level) => level.id === currentLevelId,
    );
    if (
      currentIndex === -1 ||
      currentIndex === UNDERSTANDING_LEVELS.length - 1
    ) {
      return null;
    }
    return UNDERSTANDING_LEVELS[currentIndex + 1];
  } catch (error) {
    console.warn(
      `⚠️ Error getting next understanding level for "${currentLevelId}":`,
      error,
    );
    return null;
  }
}

/**
 * Get previous level in understanding progression
 */
export function getPreviousUnderstandingLevel(
  currentLevelId: string,
): UnderstandingLevel | null {
  try {
    const currentIndex = UNDERSTANDING_LEVELS.findIndex(
      (level) => level.id === currentLevelId,
    );
    if (currentIndex <= 0) {
      return null;
    }
    return UNDERSTANDING_LEVELS[currentIndex - 1];
  } catch (error) {
    console.warn(
      `⚠️ Error getting previous understanding level for "${currentLevelId}":`,
      error,
    );
    return null;
  }
}

/**
 * Get next stage in learning progression
 */
export function getNextLearningStage(
  currentStageId: string,
): LearningStage | null {
  try {
    const currentIndex = LEARNING_STAGES.findIndex(
      (stage) => stage.id === currentStageId,
    );
    if (currentIndex === -1 || currentIndex === LEARNING_STAGES.length - 1) {
      return null;
    }
    return LEARNING_STAGES[currentIndex + 1];
  } catch (error) {
    console.warn(
      `⚠️ Error getting next learning stage for "${currentStageId}":`,
      error,
    );
    return null;
  }
}

/**
 * Get previous stage in learning progression
 */
export function getPreviousLearningStage(
  currentStageId: string,
): LearningStage | null {
  try {
    const currentIndex = LEARNING_STAGES.findIndex(
      (stage) => stage.id === currentStageId,
    );
    if (currentIndex <= 0) {
      return null;
    }
    return LEARNING_STAGES[currentIndex - 1];
  } catch (error) {
    console.warn(
      `⚠️ Error getting previous learning stage for "${currentStageId}":`,
      error,
    );
    return null;
  }
}
