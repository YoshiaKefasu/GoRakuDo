import { defineCollection, z } from "astro:content";

// AI-Ready Entity-Based Metadata Schema with Progressive Implementation
// Phase 1: Aligned with current SimpleAIMetadata implementation
// Phase 2+: Will expand to full comprehensive schema
const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    // Core Content Metadata
    title: z.string(),
    description: z.string(),
    publishedDate: z.string(),
    author: z.string().default("Tim GoRakuDo"),

    // Sticky Note Design Support
    emoji: z.string().optional(), // Optional emoji for sticky note design

    // AI-Ready Entity Classification
    difficulty: z
      .enum(["beginner", "intermediate", "advanced"])
      .default("beginner"),
    category: z.string().default("general"),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),

    // Mind Map Structure Classification (AI-Friendly Content Structure)
    mindMapBranch: z
      .enum([
        "landasan-filosofi", // A. Landasan & Filosofi (Foundation & Philosophy)
        "tahap-pembelajaran", // B. Tahap Pembelajaran (Learning Stages)
        "kerangka-pemahaman", // C. Kerangka Pemahaman 7 Tingkat (7 Levels Framework)
        "tools-resource", // D. Tools & Resource (Tools & Resources)
        "strategi-tips", // E. Strategi & Tips (Strategies & Tips)
      ])
      .default("landasan-filosofi"),

    // 7-Level Understanding Framework
    understandingLevel: z
      .enum([
        "tingkat-0", // Tingkat 0 (Level 0)
        "tingkat-1", // Tingkat 1 (Level 1)
        "tingkat-2", // Tingkat 2 (Level 2)
        "tingkat-3", // Tingkat 3 (Level 3)
        "tingkat-4", // Tingkat 4 (Level 4)
        "tingkat-5", // Tingkat 5 (Level 5)
        "tingkat-6", // Tingkat 6 (Level 6)
      ])
      .default("tingkat-0"),

    // Learning Stage Progression (Immersion-based)
    learningStage: z
      .enum([
        "pemanasan", // 1. Tahap Pemanasan (1 Bulan) - Warm-up Stage
        "starter", // 2. Tahap Starter (3-6 Bulan) - Starter Stage
        "normalisasi", // 3. Tahap Normalisasi (6-12 Bulan) - Normalization Stage
        "kompeten", // 4. Tahap Kompeten (Seumur Hidup) - Competent Stage
      ])
      .default("pemanasan"),

    // AI Entity-Based Metadata (Build-time only) - OPTIONAL for manual override
    // Phase 1: Simple implementation aligned with current detection capabilities
    // Phase 2+: Will expand to full comprehensive schema
    aiMetadata: z
      .object({
        // Content Type Classification (Phase 1 - Current Implementation)
        contentType: z
          .enum([
            "guide", // Step-by-step guides
            "methodology", // Learning methods
            "tool", // Tool tutorials
            "theory", // Linguistic theory
            "practice", // Practice exercises
            "review", // Content reviews
            "case-study", // Success stories
            "faq", // Frequently asked questions
          ])
          .default("guide"),

        // Learning Stage (Phase 1 - Current Implementation)
        learningStage: z
          .enum([
            "alphabet", // Hiragana/Katakana
            "basic-grammar", // Basic sentence structure
            "kanji-intro", // Kanji introduction
            "intermediate", // Intermediate concepts
            "advanced", // Advanced concepts
            "fluency", // Near-native level
          ])
          .default("alphabet"),

        // Content Complexity (Phase 1 - Current Implementation)
        complexityScore: z.number().min(1).max(10).default(1),

        // Estimated Study Time (Phase 1 - Current Implementation)
        estimatedStudyTime: z.number().default(10),

        // Primary Keywords (Phase 1 - Current Implementation)
        primaryKeywords: z.array(z.string()).default([]),

        // Search Intent (Phase 1 - Current Implementation)
        searchIntent: z
          .enum([
            "informational", // How to, what is, guide
            "navigational", // Specific tool, method
            "transactional", // Download, purchase
            "commercial", // Reviews, comparisons
          ])
          .default("informational"),

        // Phase 2+ Placeholder Fields (Optional for future expansion)
        // These will be implemented in future phases for enhanced AI capabilities
        languageEntities: z
          .object({
            grammarPoints: z.array(z.string()).default([]),
            vocabularyCategories: z
              .array(
                z.enum([
                  "basic",
                  "intermediate",
                  "advanced",
                  "kanji",
                  "hiragana",
                  "katakana",
                  "particles",
                  "verbs",
                  "adjectives",
                  "nouns",
                  "adverbs",
                  "conjunctions",
                ]),
              )
              .default([]),
            jlptLevel: z.enum(["N5", "N4", "N3", "N2", "N1"]).optional(),
          })
          .optional(), // Optional for Phase 2+

        relationships: z
          .object({
            prerequisites: z.array(z.string()).default([]),
            relatedContent: z.array(z.string()).default([]),
            nextSteps: z.array(z.string()).default([]),
            series: z.string().optional(),
            seriesOrder: z.number().optional(),
          })
          .optional(), // Optional for Phase 2+

        contentAnalysis: z
          .object({
            targetAudience: z
              .array(
                z.enum([
                  "complete-beginner",
                  "self-learner",
                  "classroom-student",
                  "heritage-speaker",
                  "business-learner",
                  "academic-learner",
                ]),
              )
              .default(["complete-beginner"]),
            learningObjectives: z.array(z.string()).default([]),
            hasPracticeExercises: z.boolean().default(false),
            hasAudioContent: z.boolean().default(false),
            hasVisualContent: z.boolean().default(false),
          })
          .optional(), // Optional for Phase 2+

        seoMetadata: z
          .object({
            longTailKeywords: z.array(z.string()).default([]),
            contentFreshness: z
              .enum([
                "evergreen", // Always relevant
                "seasonal", // Time-sensitive
                "trending", // Current hot topic
                "reference", // Reference material
              ])
              .default("evergreen"),
          })
          .optional(), // Optional for Phase 2+

        technicalMetadata: z
          .object({
            format: z
              .enum(["text", "video", "audio", "interactive", "mixed"])
              .default("text"),
            accessibility: z
              .object({
                hasAltText: z.boolean().default(false),
                hasCaptions: z.boolean().default(false),
                hasTranscript: z.boolean().default(false),
                screenReaderFriendly: z.boolean().default(true),
              })
              .default({}),
            performance: z
              .object({
                imageOptimized: z.boolean().default(true),
                mobileFriendly: z.boolean().default(true),
                loadTimeOptimized: z.boolean().default(true),
              })
              .default({}),
          })
          .optional(), // Optional for Phase 2+
      })
      .optional(), // Make it optional for automatic detection
  }),
});

// Template Collection for Content Creation Management
// Purpose: Store reusable templates for content creation workflow
// Type: "content" - Templates are markdown files that can be queried and processed
const templatesCollection = defineCollection({
  type: "content", // Content collection - supports markdown files
  schema: z.object({
    // Template Metadata
    templateName: z.string(),
    templateType: z.enum(["post", "guide", "tutorial", "review", "case-study"]),
    description: z.string(),
    version: z.string().default("1.0.0"),
    lastUpdated: z.string(),

    // Template Configuration
    isActive: z.boolean().default(true),
    category: z.string().default("general"),

    // Template Structure
    requiredFields: z.array(z.string()).default([]),
    optionalFields: z.array(z.string()).default([]),

    // Usage Instructions
    instructions: z.string().default(""),
    examples: z.array(z.string()).default([]),

    // Template Content (the actual template)
    templateContent: z.string(),

    // Metadata for template management
    author: z.string().default("Tim GoRakuDo"),
    tags: z.array(z.string()).default([]),
  }),
});

// Export the collections
export const collections = {
  blog: blogCollection,
  templates: templatesCollection,
};
