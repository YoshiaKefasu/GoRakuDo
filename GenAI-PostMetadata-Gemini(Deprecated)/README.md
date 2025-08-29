# GenAI Post Metadata Gemini

## Overview
Centralized GenAI API system for generating metadata.json files for blog posts. This system uses Google's GenAI API to create intelligent metadata including descriptions, keywords, and content recommendations.

## Structure

```
GenAI-PostMetadata-Gemini/
├── core/                    # Core GenAI API functionality
│   ├── gemini-api-new.ts    # Main GenAI API wrapper (new package)
│   ├── gemini-api.ts        # Legacy GenAI API wrapper
│   ├── node-env-setup.ts    # Environment setup and configuration
│   ├── rate-limiter.ts      # API rate limiting for GenAI calls
│   └── index.ts             # Core exports
├── metadata/                # Metadata generation utilities
│   ├── auto-ai-metadata.ts  # Simple AI metadata generation
│   ├── auto-ai-metadata-fixed.ts  # Enhanced AI metadata generation
│   ├── api-recommendations.ts     # AI-powered content recommendations
│   └── index.ts             # Metadata exports
├── types/                   # TypeScript type definitions
│   └── types.ts             # GenAI API types and interfaces
├── index.ts                 # Main exports
└── README.md                # This file
```

## Core Components

### Core GenAI API (`core/`)
- **gemini-api-new.ts**: Main GenAI API wrapper using `@google/genai` package
- **gemini-api.ts**: Legacy GenAI API wrapper for backward compatibility
- **node-env-setup.ts**: Environment configuration and AI service initialization
- **rate-limiter.ts**: API rate limiting for GenAI calls to respect Google's quotas
- **index.ts**: Centralized exports for core functionality

### Metadata Generation (`metadata/`)
- **auto-ai-metadata.ts**: Basic metadata generation with simple analysis
- **auto-ai-metadata-fixed.ts**: Enhanced metadata generation with advanced analysis
- **api-recommendations.ts**: AI-powered content recommendations using GenAI
- **index.ts**: Centralized exports for metadata functionality

### Type Definitions (`types/`)
- **types.ts**: TypeScript interfaces for GenAI API configuration and responses

## Usage

### Basic Import
```typescript
import { 
  GeminiAIServiceNew, 
  generateAIMetadata,
  generateRecommendations,
  RateLimiter 
} from "./GenAI-PostMetadata-Gemini";
```

### Generate Metadata for a Post
```typescript
import { generateAIMetadata } from "./GenAI-PostMetadata-Gemini";

const metadata = await generateAIMetadata(post);
// Returns: { metaDescription, keywords, recommendations, ... }
```

### Use GenAI Service Directly
```typescript
import { GeminiAIServiceNew } from "./GenAI-PostMetadata-Gemini";

const service = new GeminiAIServiceNew(config);
await service.initialize();

const description = await service.generateMetaDescription({
  title: "Post Title",
  content: "Post content...",
  keywords: ["keyword1", "keyword2"],
  language: "id"
});
```

### Generate Content Recommendations
```typescript
import { generateRecommendations } from "./GenAI-PostMetadata-Gemini";

const recommendations = await generateRecommendations(currentPost, availablePosts);
// Returns: { similarContent: [...], contextualRelevance: [...] }
```

## Environment Setup

Required environment variables:
```env
GOOGLE_API_KEY=your_google_genai_api_key
GOOGLE_MODEL=gemini-2.5-flash
```

## Generated Metadata Structure

The system generates metadata files like `anki-guide-metadata.json`:

```json
{
  "metaDescription": "Setup dan strategi optimal untuk menggunakan Anki...",
  "keywords": "anki, srs, flashcards, spaced-repetition, vocabulary...",
  "recommendations": "Filosofi Immersion: Landasan Metodologi..., Memulai Perjalanan Immersion...",
  "generatedAt": "2025-08-23T03:56:50.721Z",
  "success": true
}
```

## Features

- **Intelligent Metadata Generation**: Uses GenAI to create contextual meta descriptions
- **Content Recommendations**: AI-powered suggestions for related content
- **Keyword Optimization**: Smart keyword extraction and optimization
- **Rate Limiting**: Built-in API rate limiting to respect Google's quotas
- **Caching**: Intelligent caching to reduce API calls
- **Error Handling**: Robust error handling with fallback mechanisms
- **Type Safety**: Full TypeScript support with comprehensive type definitions

## Integration

This system is designed to integrate with:
- Astro content collections
- Blog post processing pipelines
- SEO optimization workflows
- Content recommendation systems

## Dependencies

- `@google/genai`: Google's official GenAI API package
- `astro:content`: Astro content collection types
- Node.js built-in modules (fs, path, etc.)
