# Content Configuration System - Complete Guide

## 🎯 Overview

This system provides a **simple, text-editor-friendly way** to manage your content organization without touching any components. Just edit the configuration file and everything updates automatically!

## 📁 What You Can Customize

### ✅ Categories

- Add/remove content categories
- Change colors, icons, and names
- Set keywords for automatic content matching
- Control priority and visibility

### ✅ Tags

- Add/remove content tags
- Link tags to categories
- Customize colors and descriptions
- Enable/disable specific tags

### ✅ Filters

- Add/remove filter buttons
- Link filters to categories, tags, or mind maps
- Control which filters show counts
- Set filter priority and order

### ✅ Mind Map Integration

- Enable/disable mind map filters
- Choose which mind map branches to include
- Auto-generate filters from mind map
- Custom mind map filter configurations

### ✅ Search Suggestions

- Add/remove search suggestions
- Auto-generate from active tags/categories
- Control maximum number of suggestions

## 🚀 Quick Start

### 1. Open the Configuration File

Open `src/utils/content-config.ts` in your text editor (VSCode, Sublime, Notepad++, etc.)

### 2. Edit Categories

```typescript
categories: {
  // Add a new category
  new_category: {
    id: "new_category",
    name: "new-category",
    displayName: "My New Category",
    description: "Description of my new category",
    color: "#FF6B6B",
    icon: "🎨",
    keywords: ["keyword1", "keyword2", "keyword3"],
    priority: 7,
    isActive: true,
  },

  // Modify existing category
  beginner: {
    id: "beginner",
    name: "beginner",
    displayName: "Custom Beginner Name", // ← Change this
    description: "Custom description",   // ← Change this
    color: "#00FF00",                   // ← Change this color
    icon: "🌟",                         // ← Change this icon
    keywords: ["custom", "keywords"],    // ← Change these keywords
    priority: 1,
    isActive: true,
  },
}
```

### 3. Edit Tags

```typescript
tags: {
  // Add a new tag
  new_tag: {
    id: "new_tag",
    name: "new-tag",
    displayName: "My New Tag",
    description: "Description of my new tag",
    color: "#FF6B6B",
    category: "beginner", // Must match a category ID
    isActive: true,
  },

  // Modify existing tag
  immersion: {
    id: "immersion",
    name: "immersion",
    displayName: "Custom Immersion", // ← Change this
    description: "Custom description", // ← Change this
    color: "#FF0000",                // ← Change this color
    category: "methodology",
    isActive: true,
  },
}
```

### 4. Edit Filters

```typescript
filters: {
  // Add a new filter
  new_filter: {
    id: "new_filter",
    name: "new-filter",
    displayName: "My New Filter",
    type: "category", // "category", "tag", "mind-map", or "custom"
    target: "new_category", // Category ID, tag ID, mind map branch ID, or "all"
    color: "#FF6B6B",
    icon: "🎨",
    description: "Description of my new filter",
    isActive: true,
    showCount: true, // Show post count in button
    priority: 8,     // Order in filter list
  },

  // Modify existing filter
  beginner_filter: {
    id: "beginner_filter",
    name: "beginner",
    displayName: "Custom Beginner Filter", // ← Change this
    type: "category",
    target: "beginner",
    color: "#00FF00",                      // ← Change this color
    icon: "🌟",                            // ← Change this icon
    description: "Custom description",     // ← Change this
    isActive: true,
    showCount: false,                      // ← Change this
    priority: 2,
  },
}
```

### 5. Edit Mind Map Integration

```typescript
mindMap: {
  enabled: true, // Enable/disable mind map integration
  branches: ["A", "B", "C", "D", "E"], // Which mind map branches to include
  autoGenerateFilters: true, // Auto-generate filters from mind map
  customFilters: [
    // Add custom mind map filter
    {
      id: "custom_mind_map_filter",
      name: "custom-mind-map-filter",
      displayName: "Custom Mind Map Filter",
      type: "mind-map",
      target: "A", // Mind map branch ID
      color: "#FF6B6B",
      icon: "🎨",
      description: "Custom mind map filter description",
      isActive: true,
      showCount: false,
      priority: 13,
    },
  ],
},
```

### 6. Edit Search Suggestions

```typescript
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
    "new-suggestion", // ← Add your suggestion here
  ],
  maxSuggestions: 6, // Maximum number of suggestions to show
  autoGenerate: true, // Auto-generate from active tags/categories
},
```

## 🎨 Customization Examples

### Example 1: Add a New Category

```typescript
// Add this to the categories object
intermediate: {
  id: "intermediate",
  name: "intermediate",
  displayName: "Tingkat Menengah",
  description: "Content for intermediate learners",
  color: "#F97316",
  icon: "⭐",
  keywords: ["menengah", "intermediate", "lanjutan", "tingkat tengah"],
  priority: 3,
  isActive: true,
},
```

### Example 2: Add a New Tag

```typescript
// Add this to the tags object
listening: {
  id: "listening",
  name: "listening",
  displayName: "Listening",
  description: "Listening comprehension skills",
  color: "#8B5CF6",
  category: "methodology",
  isActive: true,
},
```

### Example 3: Add a New Filter

```typescript
// Add this to the filters object
intermediate_filter: {
  id: "intermediate_filter",
  name: "intermediate",
  displayName: "Tingkat Menengah",
  type: "category",
  target: "intermediate",
  color: "#F97316",
  icon: "⭐",
  description: "Intermediate level content",
  isActive: true,
  showCount: true,
  priority: 4,
},
```

### Example 4: Disable a Category

```typescript
// Change isActive to false
ai_recommendations: {
  id: "ai_recommendations",
  name: "ai-recommendations",
  displayName: "Rekomendasi AI",
  description: "AI-powered content recommendations",
  color: "#06B6D4",
  icon: "🤖",
  keywords: ["ai", "rekomendasi", "recommendations", "machine learning"],
  priority: 6,
  isActive: false, // ← Change this to false to disable
},
```

### Example 5: Change Colors and Icons

```typescript
// Modify existing category
tools: {
  id: "tools",
  name: "tools",
  displayName: "Tools",
  description: "Tools and resources for Japanese learning",
  color: "#FF6B6B", // ← Change from #F59E0B to #FF6B6B
  icon: "⚡",        // ← Change from 🛠️ to ⚡
  keywords: ["tools", "anki", "aplikasi", "software", "resource"],
  priority: 4,
  isActive: true,
},
```

## 🔧 Advanced Configuration

### Priority System

Filters are displayed in order of priority (lowest number first):

```typescript
priority: 1,  // Shows first
priority: 2,  // Shows second
priority: 3,  // Shows third
// etc.
```

### Filter Types

- **"category"**: Filters by content category
- **"tag"**: Filters by content tags
- **"mind-map"**: Filters by mind map branches
- **"custom"**: Custom filtering logic (like "all")

### Keywords System

Categories use keywords to automatically match content:

```typescript
keywords: ["pemula", "beginner", "awal", "dasar", "pemanasan"];
```

Content is matched if:

- Title contains any keyword
- Description contains any keyword
- Category matches category name
- Learning stage matches category name

### Auto-Generation

When `autoGenerate: true` is set for search suggestions, the system automatically generates suggestions from:

- Active tag names
- Active category names

## 🚨 Important Notes

### 1. Category References

When adding tags, make sure the `category` field references a valid category ID:

```typescript
// ✅ Correct - category exists
category: "beginner",

// ❌ Wrong - category doesn't exist
category: "non_existent_category",
```

### 2. Filter Targets

When adding filters, make sure the `target` field references valid IDs:

```typescript
// ✅ Correct - category exists
type: "category",
target: "beginner",

// ✅ Correct - tag exists
type: "tag",
target: "immersion",

// ✅ Correct - mind map branch exists
type: "mind-map",
target: "A",

// ✅ Correct - custom logic
type: "custom",
target: "all",
```

### 3. Mind Map Branches

Available mind map branches: `["A", "B", "C", "D", "E"]`

### 4. Color Format

Use hex color codes: `"#RRGGBB"`

### 5. Icons

Use emoji icons: `"🎨"`, `"🌟"`, `"⚡"`, etc.

## 🔍 Validation

The system automatically validates your configuration. If there are errors, they will appear in the build logs:

```bash
npm run build
```

Common validation errors:

- Missing required fields
- Invalid category references
- Invalid filter targets
- Invalid mind map branch references

## 📱 Usage in Components

The configuration is automatically used in:

- `src/pages/docs.astro` - Filter buttons and content organization
- `src/components/content/ContentCard.astro` - Tag display
- Search functionality - Search suggestions
- Mind map integration - Mind map filters

## 🎉 Benefits

| Feature              | Before                    | After                 |
| -------------------- | ------------------------- | --------------------- |
| **Setup Time**       | 30+ minutes               | 2 minutes             |
| **Customization**    | Complex component editing | Simple text editing   |
| **Maintenance**      | Multiple files            | Single file           |
| **Version Control**  | Complex diffs             | Clean, readable diffs |
| **Learning Curve**   | Component knowledge       | Basic TypeScript      |
| **Error Prevention** | Runtime errors            | Build-time validation |

## 🆘 Troubleshooting

### Build Errors

1. Check for syntax errors in the configuration file
2. Verify all references are valid
3. Ensure all required fields are present

### Filters Not Appearing

1. Check `isActive: true`
2. Verify `priority` is set correctly
3. Ensure `target` references valid IDs

### Content Not Matching

1. Check category `keywords` array
2. Verify content has correct `category` or `tags`
3. Ensure content `learningStage` matches

### Mind Map Integration Issues

1. Check `mindMap.enabled: true`
2. Verify branch IDs in `mindMap.branches`
3. Ensure mind map configuration exists

## 🎯 Success!

You now have a **fully customizable content organization system** that you can edit with any text editor. No complex UI, no component editing, just clean, efficient configuration!

---

**Remember**: Edit `src/utils/content-config.ts` to customize your content organization!
