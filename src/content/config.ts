import { defineCollection, z } from 'astro:content';

// Simplified Content Schema for Indonesian Immersion Learning
// AI metadata handled by separate files (e.g., anki-guide-metadata.json)
const docsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Core Content Metadata
    title: z.string(),
    description: z.string(),
    publishedDate: z.string(),
    author: z.string().default('Tim GoRakuDo'),

    // Sticky Note Design Support
    emoji: z.string().optional(), // Optional emoji for sticky note design

    // Basic Content Classification
    difficulty: z
      .enum(['beginner', 'intermediate', 'advanced'])
      .default('beginner'),
    category: z.string().default('general'),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),

    // Simplified Content Type Classification
    contentType: z
      .enum([
        'metodologi', // Learning methodology and theory
        'tutorial', // Step-by-step guides and tutorials
        'resource', // Tools, references, and materials
      ])
      .default('tutorial'),

    // Read Time Estimation
    readTime: z.number().optional(), // Estimated reading time in minutes
  }),
});

// Template Collection for Content Creation Management
// Purpose: Store reusable templates for content creation workflow
const templatesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Template Metadata
    templateName: z.string(),
    templateType: z.enum(['post', 'guide', 'tutorial', 'review', 'case-study']),
    description: z.string(),
    version: z.string().default('1.0.0'),
    lastUpdated: z.string(),

    // Template Configuration
    isActive: z.boolean().default(true),
    category: z.string().default('general'),

    // Template Structure
    requiredFields: z.array(z.string()).default([]),
    optionalFields: z.array(z.string()).default([]),

    // Usage Instructions
    instructions: z.string().default(''),
    examples: z.array(z.string()).default([]),

    // Template Content (the actual template)
    templateContent: z.string(),

    // Metadata for template management
    author: z.string().default('Tim GoRakuDo'),
    tags: z.array(z.string()).default([]),
  }),
});

// Pages Collection for Static Page Content
// Purpose: Store static page content like support-us, about, etc.
const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Core Content Metadata
    title: z.string(),
    description: z.string(),
    publishedDate: z.string(),
    author: z.string().default('Tim GoRakuDo'),

    // Basic Content Classification
    category: z.string().default('general'),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),

    // Content Type Classification
    contentType: z
      .enum([
        'resource', // Static resource pages
        'info', // Information pages
        'legal', // Legal pages like privacy policy
      ])
      .default('resource'),

    // Read Time Estimation
    readTime: z.number().optional(),
  }),
});

// Tool Articles Collection for Tool Documentation Content
// Updated to match existing tool content structure from Epic 2.0
const toolArticlesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedDate: z.string(), // Changed from z.date() to z.string() to match existing content
    updatedDate: z.string().optional(), // Changed from z.date() to z.string()
    author: z.string().default('Tim GoRakuDo'),

    // Tool-Specific Metadata
    toolName: z.string(),
    toolVersion: z.string().optional(),
    toolWebsite: z.string().url().optional(),
    toolCategory: z.enum([
      'flashcard',
      'reading',
      'listening',
      'writing',
      'suite',
      'video',
      'browser-extension',
      'mobile-app',
      'desktop-app',
    ]),

    // Difficulty and Setup Information
    difficulty: z
      .enum(['beginner', 'intermediate', 'advanced'])
      .default('beginner'),
    setupTime: z.string().optional(),
    cost: z.enum(['free', 'freemium', 'paid', 'subscription']).default('free'),

    // Visual Elements
    emoji: z.string().optional(),
    icon: z.string().optional(),

    // Content Classification
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),

    // Content Type
    contentType: z
      .enum(['tool-guide', 'setup-tutorial', 'usage-guide', 'review'])
      .default('tool-guide'),

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

// Export the collections
export const collections = {
  docs: docsCollection,
  templates: templatesCollection,
  pages: pagesCollection,
  'tool-articles': toolArticlesCollection,
};
