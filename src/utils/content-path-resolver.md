# Content Path Resolver - Dynamic Collection Path Management

## Overview

The Content Path Resolver is a utility system that provides dynamic, auto-detectable content collection paths for the GoRakuDo project. It replaces hardcoded paths with a flexible, future-proof solution that supports multiple content collections.

## Features

- **Dynamic Path Detection**: Auto-detects collection types and resolves appropriate paths
- **Configurable Collections**: Easy to add, modify, or rename content collections
- **Fallback Mechanisms**: Comprehensive error handling with graceful degradation
- **Type Safety**: Full TypeScript support with proper interfaces
- **SEO Friendly**: Maintains proper URL structure for search engines

## Usage

### Basic Usage

```typescript
import {
  resolveContentPath,
  getCollectionMetadata,
} from "./content-path-resolver";

// Resolve path for any collection entry
const path = resolveContentPath(post);
console.log(path.path); // "/blog/my-post" or "/articles/my-article"

// Get collection metadata
const metadata = getCollectionMetadata("blog");
console.log(metadata.displayName); // "Blog"
console.log(metadata.icon); // "📝"
```

### Adding New Collections

Simply add to the `CONTENT_PATH_CONFIG` array in `content-path-resolver.ts`:

```typescript
{
  collectionName: "news",
  basePath: "/news",
  displayName: "News",
  icon: "📰",
  priority: 6,
}
```

### Changing Collection Paths

Update the configuration to change paths without code modifications:

```typescript
// Change blog to articles
{
  collectionName: "blog",
  basePath: "/articles", // Changed from "/blog"
  displayName: "Articles", // Updated display name
  icon: "📄",
  priority: 1,
}
```

## Configuration

### ContentPathConfig Interface

```typescript
interface ContentPathConfig {
  collectionName: string; // Internal collection name
  basePath: string; // URL path (e.g., "/blog")
  displayName: string; // Human-readable name
  icon: string; // Emoji or icon
  priority: number; // Display order priority
}
```

### Default Collections

- **blog**: `/blog` - Blog posts
- **articles**: `/articles` - Articles
- **guides**: `/guides` - Guides and tutorials
- **tutorials**: `/tutorials` - Step-by-step tutorials
- **posts**: `/posts` - General posts

## API Reference

### resolveContentPath(post, collectionName?)

Resolves the full path for a content entry.

**Parameters:**

- `post`: Collection entry object
- `collectionName?`: Optional explicit collection name override

**Returns:**

```typescript
{
  path: string; // Full resolved path
  displayName: string; // Collection display name
  icon: string; // Collection icon
  collectionName: string; // Collection name
  isFallback: boolean; // Whether fallback was used
}
```

### getCollectionMetadata(collectionName)

Gets metadata for a specific collection.

**Parameters:**

- `collectionName`: Name of the collection

**Returns:**

```typescript
{
  displayName: string; // Human-readable name
  icon: string; // Collection icon
  basePath: string; // Base URL path
}
```

### getCollectionBasePath(collectionName)

Gets the base path for a collection (without slug).

**Parameters:**

- `collectionName`: Name of the collection

**Returns:** `string` - Base path (e.g., "/blog")

### addCollectionConfig(config)

Adds or updates a collection configuration.

**Parameters:**

- `config`: ContentPathConfig object

### getAllCollectionConfigs()

Gets all available collection configurations.

**Returns:** `ContentPathConfig[]` - Array of all configurations

## Error Handling

The system includes comprehensive error handling:

1. **Primary Fallback**: Uses collection name as path (`/collection-name/slug`)
2. **Ultimate Fallback**: Maintains current "/blog" behavior
3. **Error Logging**: Comprehensive warning system for debugging
4. **Graceful Degradation**: Never breaks user experience

## Migration Guide

### From Hardcoded Paths

**Before:**

```typescript
url: `/blog/${post.slug}`;
```

**After:**

```typescript
const resolvedPath = resolveContentPath(post);
url: resolvedPath.path;
```

### From Static Collection Names

**Before:**

```typescript
title: "Blog";
icon: "📝";
```

**After:**

```typescript
const metadata = getCollectionMetadata("blog");
title: metadata.displayName;
icon: metadata.icon;
```

## Best Practices

1. **Always use the resolver**: Never hardcode collection paths
2. **Handle fallbacks**: Check `isFallback` flag when needed
3. **Update configuration**: Modify `CONTENT_PATH_CONFIG` for changes
4. **Test thoroughly**: Verify paths work after configuration changes
5. **Maintain consistency**: Use consistent naming conventions

## Future Enhancements

- **Dynamic Detection**: Enhanced collection type detection from content
- **Caching**: Performance optimization with path caching
- **Validation**: Enhanced configuration validation
- **Migration Tools**: Automated path migration utilities
- **Analytics**: Path usage tracking and analytics

## Support

For issues or questions about the Content Path Resolver:

1. Check the configuration in `content-path-resolver.ts`
2. Verify collection names match your content structure
3. Test with the provided utility functions
4. Review error logs for debugging information
