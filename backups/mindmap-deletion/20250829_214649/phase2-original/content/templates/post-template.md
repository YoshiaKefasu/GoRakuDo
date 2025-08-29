---
# Template Collection Item - Post Template for GoRakuDo Blog
templateName: "Post Template"
templateType: "post"
description: "Comprehensive template for creating new blog posts with AI-ready metadata and mind map integration"
version: "1.0.0"
lastUpdated: "2024-12-19T00:00:00.000Z"
isActive: true
category: "content-creation"
requiredFields: ["title", "description", "publishedDate", "readTime", "author", "difficulty", "category", "tags", "featured", "mindMapBranch", "understandingLevel", "learningStage"]
optionalFields: ["aiMetadata", "aiMetadata.contentType", "aiMetadata.learningStage", "aiMetadata.complexityScore", "aiMetadata.estimatedStudyTime", "aiMetadata.primaryKeywords", "aiMetadata.searchIntent", "aiMetadata.languageEntities", "aiMetadata.relationships", "aiMetadata.contentAnalysis", "aiMetadata.seoMetadata", "aiMetadata.technicalMetadata"]
instructions: "Copy this template to create new posts. Replace all placeholder values with actual content. Remove comment blocks when publishing. Ensure all required fields are filled. Test the post locally before publishing."
examples: ["anki-guide", "choosing-content", "getting-started", "immersion-philosophy"]
templateContent: |
  # ========================================
  # TEMPLATE: Post Template for GoRakuDo Blog
  # ========================================
  # 
  # INSTRUCTIONS:
  # 1. Copy this template to create new posts
  # 2. Replace all placeholder values with actual content
  # 3. Remove this comment block when publishing
  # 4. Ensure all required fields are filled
  # 5. Test the post locally before publishing
  #
  # MIND MAP BRANCHES:
  # - landasan-filosofi: Foundation & Philosophy
  # - tahap-pembelajaran: Learning Stages  
  # - kerangka-pemahaman: 7-Level Understanding Framework
  # - tools-resource: Tools & Resources
  # - strategi-tips: Strategies & Tips
  #
  # UNDERSTANDING LEVELS:
  # - tingkat-0: Level 0 (Complete Beginner)
  # - tingkat-1: Level 1 (Basic Understanding)
  # - tingkat-2: Level 2 (Elementary)
  # - tingkat-3: Level 3 (Intermediate)
  # - tingkat-4: Level 4 (Upper Intermediate)
  # - tingkat-5: Level 5 (Advanced)
  # - tingkat-6: Level 6 (Near Native)
  #
  # LEARNING STAGES:
  # - pemanasan: Warm-up Stage (1 Month)
  # - starter: Starter Stage (3-6 Months)
  # - normalisasi: Normalization Stage (6-12 Months)
  # - kompeten: Competent Stage (Lifetime)
  # ========================================

  # ========================================
  # REQUIRED FIELDS (Must be filled)
  # ========================================
  title: "TITLE_PLACEHOLDER - Replace with actual title"
  description: "DESCRIPTION_PLACEHOLDER - Replace with compelling description (150-160 characters)"
  publishedDate: "YYYY-MM-DDTHH:MM:SS.000Z"
  readTime: 15
  author: "Tim GoRakuDo"
  difficulty: "beginner" # beginner, intermediate, advanced
  category: "category-name"
  tags: ["tag1", "tag2", "tag3", "tag4", "tag5"]
  featured: false # true for featured posts
  mindMapBranch: "landasan-filosofi" # Choose appropriate branch
  understandingLevel: "tingkat-1" # Choose appropriate level
  learningStage: "pemanasan" # Choose appropriate stage

  # ========================================
  # AI METADATA (Optional - Auto-generated if not provided)
  # ========================================
  aiMetadata:
    # Content Type Classification
    contentType: "guide" # guide, methodology, tool, theory, practice, review, case-study, faq
    
    # Learning Stage
    learningStage: "alphabet" # alphabet, basic-grammar, kanji-intro, intermediate, advanced, fluency
    
    # Content Complexity (1-10 scale)
    complexityScore: 3
    
    # Estimated Study Time (minutes)
    estimatedStudyTime: 15
    
    # Primary Keywords for SEO
    primaryKeywords: ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
    
    # Search Intent
    searchIntent: "informational" # informational, navigational, transactional, commercial
    
    # Language Entities (Optional - Phase 2+)
    languageEntities:
      grammarPoints: ["grammar-point-1", "grammar-point-2"]
      vocabularyCategories: ["basic", "nouns", "verbs"] # Choose from: basic, intermediate, advanced, kanji, hiragana, katakana, particles, verbs, adjectives, nouns, adverbs, conjunctions
      jlptLevel: "N5" # N5, N4, N3, N2, N1 (optional)
    
    # Content Relationships (Optional - Phase 2+)
    relationships:
      prerequisites: ["post-slug-1", "post-slug-2"] # Posts that should be read first
      relatedContent: ["post-slug-3", "post-slug-4"] # Related posts
      nextSteps: ["post-slug-5", "post-slug-6"] # Posts to read next
      series: "series-name" # If part of a series
      seriesOrder: 1 # Order in series
    
    # Content Analysis (Optional - Phase 2+)
    contentAnalysis:
      targetAudience: ["complete-beginner", "self-learner"] # Choose from: complete-beginner, self-learner, classroom-student, heritage-speaker, business-learner, academic-learner
      learningObjectives: 
        - "Objective 1"
        - "Objective 2"
        - "Objective 3"
      hasPracticeExercises: false
      hasAudioContent: false
      hasVisualContent: true
    
    # SEO Metadata (Optional - Phase 2+)
    seoMetadata:
      longTailKeywords: ["long-tail-keyword-1", "long-tail-keyword-2", "long-tail-keyword-3"]
      contentFreshness: "evergreen" # evergreen, seasonal, trending, reference
    
    # Technical Metadata (Optional - Phase 2+)
    technicalMetadata:
      format: "text" # text, video, audio, interactive, mixed
      accessibility:
        hasAltText: false
        hasCaptions: false
        hasTranscript: false
        screenReaderFriendly: true
      performance:
        imageOptimized: true
        mobileFriendly: true
        loadTimeOptimized: true

  # ========================================
  # CONTENT BODY (Replace with actual content)
  # ========================================

  # Your content goes here...
  # Use markdown formatting
  # Include headings, paragraphs, lists, code blocks, etc.
  # Example structure:

  ## Introduction

  Start with an engaging introduction that hooks the reader and explains what they'll learn.

  ## Main Content

  Break your content into logical sections with clear headings.

  ### Subsection 1

  Detailed content with examples and explanations.

  ### Subsection 2

  More content with practical applications.

  ## Conclusion

  Summarize key points and provide next steps for the reader.

  ## Additional Resources

  - [Related post 1](/docs/related-post-1)
  - [Related post 2](/docs/related-post-2)
  - [External resource](https://example.com)

author: "Tim GoRakuDo"
tags: ["template", "content-creation", "blog-post", "ai-metadata", "mind-map"]
---

# Post Template Content

This is the actual template content that will be used for creating new posts. The content above shows the frontmatter structure and instructions for using this template.

## Template Usage

1. Copy this template file
2. Rename it to your desired post slug
3. Update all placeholder values
4. Add your actual content
5. Test locally before publishing

## Template Features

- **AI-Ready Metadata**: Comprehensive metadata structure for AI optimization
- **Mind Map Integration**: Proper categorization within the 5-branch mind map
- **SEO Optimization**: Built-in SEO metadata and keyword structure
- **Accessibility**: Technical metadata for accessibility compliance
- **Performance**: Performance optimization metadata included
