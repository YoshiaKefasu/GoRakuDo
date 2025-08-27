import { defineCollection, z } from "astro:content";

// Simplified Content Schema for Indonesian Immersion Learning
// Aligned with mind-map-config.ts branch structure
// AI metadata handled by separate files (e.g., anki-guide-metadata.json)
const docsCollection = defineCollection({
  type: "content",
  schema: z.object({
    // Core Content Metadata
    title: z.string(),
    description: z.string(),
    publishedDate: z.string(),
    author: z.string().default("Tim GoRakuDo"),

    // Sticky Note Design Support
    emoji: z.string().optional(), // Optional emoji for sticky note design

    // Basic Content Classification
    difficulty: z
      .enum(["beginner", "intermediate", "advanced"])
      .default("beginner"),
    category: z.string().default("general"),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),

    // Mind Map Integration - Using actual branch IDs from mind-map-config.ts
    mindMapBranch: z
      .enum([
        "A", // Landasan & Filosofi (Foundation & Philosophy)
        "B", // Tahap Pembelajaran (Learning Stages)
        "C", // Kerangka Pemahaman 7 Tingkat (7 Levels Framework)
        "D", // Tools & Resource (Tools & Resources)
        "E", // Praktik & Aplikasi (Practical Application)
      ])
      .default("A"),

    // Simplified Content Type Classification
    contentType: z
      .enum([
        "metodologi", // Learning methodology and theory
        "tutorial", // Step-by-step guides and tutorials
        "resource", // Tools, references, and materials
      ])
      .default("tutorial"),

    // Read Time Estimation
    readTime: z.number().optional(), // Estimated reading time in minutes
  }),
});

// Template Collection for Content Creation Management
// Purpose: Store reusable templates for content creation workflow
const templatesCollection = defineCollection({
  type: "content",
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

// Tools Collection for Tool Documentation
// Purpose: Store detailed documentation for immersion learning tools
const toolsCollection = defineCollection({
  type: "content",
  schema: z.object({
    // Core Content Metadata
    title: z.string(),
    description: z.string(),
    publishedDate: z.string(),
    author: z.string().default("Tim GoRakuDo"),

    // Tool-Specific Metadata
    toolName: z.string(),
    toolVersion: z.string().optional(),
    toolWebsite: z.string().url().optional(),
    toolCategory: z.enum([
      "flashcard",
      "reading",
      "listening",
      "writing",
      "suite",
      "video",
      "browser-extension",
      "mobile-app",
      "desktop-app",
    ]),

    // Difficulty and Setup Information
    difficulty: z
      .enum(["beginner", "intermediate", "advanced"])
      .default("beginner"),
    setupTime: z.string().optional(), // e.g., "5-10 minutes"
    cost: z.enum(["free", "freemium", "paid", "subscription"]).default("free"),

    // Visual Elements
    emoji: z.string().optional(),
    icon: z.string().optional(), // URL or path to tool icon

    // Content Classification
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),

    // Mind Map Integration
    mindMapBranch: z.enum(["D"]).default("D"), // Tools & Resource branch

    // Content Type
    contentType: z
      .enum(["tool-guide", "setup-tutorial", "usage-guide", "review"])
      .default("tool-guide"),

    // Read Time Estimation
    readTime: z.number().optional(),

    // Tool Features
    features: z.array(z.string()).default([]),
    requirements: z.array(z.string()).default([]),

    // SEO and Discovery
    keywords: z.array(z.string()).default([]),
    relatedTools: z.array(z.string()).default([]),
  }),
});

// Tool Articles Collection for Documentation Content
const toolArticlesCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedDate: z.date(),
    updatedDate: z.date().optional(),
    tags: z.array(z.string()),
    heroImage: z.string().optional(),
    author: z.string().optional(),
  }),
});

// Export the collections
export const collections = {
  docs: docsCollection,
  templates: templatesCollection,
  tools: toolsCollection,
  "tool-articles": toolArticlesCollection,
};
