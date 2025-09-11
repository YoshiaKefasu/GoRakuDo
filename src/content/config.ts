import { defineCollection, z } from 'astro:content';

// Optimized Content Schema for Indonesian Immersion Learning
const docsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Core Content Metadata
    title: z.string(),
    description: z.string(),
    publishedDate: z.string(),
    author: z.string().default('Tim GoRakuDo'),
    emoji: z.string().optional(),

    // Content Classification (Simplified)
    categories: z.array(z.string()).default(['general']), // Main classification
    tags: z.array(z.string()).default([]), // Content labels
    
    // Optional Fields
    status: z.enum(['published', 'draft', 'archived']).default('published'),
    isRecommended: z.boolean().default(false),
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
    
    // Content Classification (Simplified)
    categories: z.array(z.string()).default(['content-creation']),

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

    // Setup Information
    setupTime: z.string().optional(),
    cost: z.enum(['free', 'freemium', 'paid', 'subscription']).default('free'),

    // Visual Elements
    emoji: z.string().optional(),
    icon: z.string().optional(),

    // Content Classification (Simplified)
    categories: z.array(z.string()).default(['tools']),
    tags: z.array(z.string()).default([]),


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
  'tool-articles': toolArticlesCollection,
};
