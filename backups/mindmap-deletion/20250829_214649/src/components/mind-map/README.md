# Simplified Mind Map System

## Overview

This is a **text-editor based mind map system** that replaces the complex Vue components with a simple, maintainable configuration approach. No complex UI needed - just edit the configuration file!

## 🎯 Key Features

- **Text-Editor Friendly**: Edit with any text editor (VSCode, Sublime, etc.)
- **Simple Configuration**: Single TypeScript file for all mind map settings
- **Static Generation**: Build-time mind map generation for optimal performance
- **Type Safe**: Full TypeScript support with proper interfaces
- **Responsive Design**: Works perfectly on all devices
- **Easy Customization**: Change colors, icons, keywords, and connections easily

## 📁 File Structure

```
src/components/mind-map/
├── mind-map-config.ts      # Main configuration file (EDIT THIS!)
├── MindMapDisplay.astro    # Simple display component
├── index.ts               # Centralized exports
└── README.md              # This file
```

## 🚀 Quick Start

### 1. Edit the Configuration

Open `src/components/mind-map/mind-map-config.ts` in your text editor:

```typescript
// Example: Change branch color and icon
A: {
  id: "A",
  name: "Landasan & Filosofi",
  displayName: "Landasan & Filosofi",
  description: "Foundation & Philosophy of Japanese immersion learning",
  keywords: ["immersion", "filosofi", "teori", "konsep", "metodologi"],
  visual: {
    color: "#FF6B6B",        // ← Change this color
    icon: "🎨",              // ← Change this icon
    gradient: "linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)",
    borderColor: "#FF5252",
    backgroundColor: "rgba(255, 107, 107, 0.1)",
  },
  content: {
    difficulty: "beginner",
    type: "theory",
  },
},
```

### 2. Add New Keywords

```typescript
keywords: [
  "immersion", 
  "filosofi", 
  "teori", 
  "konsep", 
  "metodologi",
  "new-keyword"  // ← Add your keyword here
],
```

### 3. Modify Connections

```typescript
connections: [
  {
    from: "A",
    to: "B",
    type: "progression",
    description: "Your custom description"  // ← Change this
  }
],
```

### 4. Save and Rebuild

```bash
npm run build
```

Your changes will appear automatically on the mind map page!

## 🎨 Customization Options

### Branch Properties

Each branch (A-E) can be customized with:

- **name**: Internal name (for code)
- **displayName**: User-facing name
- **description**: Branch description
- **keywords**: Array of keywords for content classification
- **visual.color**: Primary color (hex code)
- **visual.icon**: Emoji icon
- **visual.gradient**: CSS gradient
- **visual.borderColor**: Border color
- **visual.backgroundColor**: Background color
- **content.difficulty**: "beginner" | "intermediate" | "advanced"
- **content.type**: "guide" | "tutorial" | "theory" | "practice" | "tool" | "review"

### Connection Types

- **progression**: Sequential learning path
- **related**: Related concepts
- **complementary**: Supporting concepts

## 🔧 Configuration Structure

```typescript
export const MIND_MAP_CONFIG: MindMapConfig = {
  version: "3.0.0",
  title: "Japanese Immersion Learning Mind Map",
  description: "Visual representation of Japanese immersion learning methodology",
  
  branches: {
    A: { /* Branch A configuration */ },
    B: { /* Branch B configuration */ },
    C: { /* Branch C configuration */ },
    D: { /* Branch D configuration */ },
    E: { /* Branch E configuration */ },
  },
  
  connections: [
    { from: "A", to: "B", type: "progression", description: "..." },
    // ... more connections
  ],
};
```

## 🛠️ Utility Functions

The system provides utility functions for common operations:

```typescript
import { MindMapUtils } from "./mind-map-config";

// Get all branches
const branches = MindMapUtils.getBranches();

// Get specific branch
const branchA = MindMapUtils.getBranch("A");

// Get connections for a branch
const connections = MindMapUtils.getBranchConnections("A");

// Find related branches
const related = MindMapUtils.getRelatedBranches("A");

// Export data
const data = MindMapUtils.exportData();

// Validate configuration
const validation = MindMapUtils.validate();
```

## 📱 Usage in Pages

### Basic Usage

```astro
---
import MindMapDisplay from "../components/mind-map/MindMapDisplay.astro";
---

<MindMapDisplay />
```

### With Validation

```astro
---
import MindMapDisplay from "../components/mind-map/MindMapDisplay.astro";
import { MindMapUtils } from "../components/mind-map/mind-map-config";

const validation = MindMapUtils.validate();
---

{validation.isValid ? (
  <MindMapDisplay />
) : (
  <div class="error">Configuration errors found: {validation.errors.join(", ")}</div>
)}
```

## 🎯 Benefits Over Complex UI

| Feature | Complex Vue UI | Simple Text Config |
|---------|---------------|-------------------|
| **Setup Time** | 30+ minutes | 2 minutes |
| **Customization** | Complex UI interactions | Direct text editing |
| **Performance** | Heavy JavaScript | Static generation |
| **Maintenance** | Complex state management | Simple file editing |
| **Version Control** | Complex diffs | Clean, readable diffs |
| **Learning Curve** | Vue + TypeScript + UI patterns | Basic TypeScript |
| **Debugging** | Browser dev tools | Text editor + build logs |

## 🔍 Validation

The system automatically validates your configuration:

- ✅ All branches exist
- ✅ All connections reference valid branches
- ✅ Required properties are present
- ✅ Type safety enforced

## 🚀 Performance

- **Build Time**: ~5 seconds (including mind map generation)
- **Bundle Size**: Minimal (no heavy Vue components)
- **Runtime**: Static HTML (no JavaScript required)
- **SEO**: Fully crawlable and indexable

## 🎨 Design System

The mind map uses your project's design system:

- **Colors**: CSS custom properties from `src/styles/global.css`
- **Typography**: Project font stack
- **Spacing**: Consistent with other components
- **Responsive**: Mobile-first design

## 🔄 Migration from Old System

If you're migrating from the old complex Vue system:

1. **Backup**: Save your current mind map data
2. **Configure**: Transfer settings to `mind-map-config.ts`
3. **Test**: Run `npm run build` to verify
4. **Deploy**: Your new simplified system is ready!

## 📝 Best Practices

1. **Use Descriptive Names**: Make branch names clear and meaningful
2. **Organize Keywords**: Group related keywords together
3. **Consistent Colors**: Use a cohesive color palette
4. **Meaningful Connections**: Ensure connections have clear purposes
5. **Regular Updates**: Keep the mind map current with your content

## 🆘 Troubleshooting

### Build Errors

```bash
# Check for syntax errors
npm run build

# Look for validation errors in the output
```

### Common Issues

1. **Missing Properties**: Ensure all required properties are defined
2. **Invalid Colors**: Use valid hex color codes (#RRGGBB)
3. **Invalid Connections**: Ensure 'from' and 'to' branches exist
4. **Type Errors**: Check TypeScript compilation

### Getting Help

1. Check the validation output in the build logs
2. Verify your TypeScript syntax
3. Ensure all imports are correct
4. Check the configuration structure matches the interface

## 🎉 Success!

You now have a **simple, maintainable, and powerful mind map system** that you can customize with any text editor. No complex UI, no heavy JavaScript, just clean, efficient configuration!

---

**Remember**: Edit `src/components/mind-map/mind-map-config.ts` to customize your mind map!
