#!/usr/bin/env node

/**
 * Silent Metadata Generation Script
 * Generates metadata files for all blog posts without test output
 * Run with: node geminiseo-metadata-cli-silent.js [post-slug]
 */

import * as dotenv from "dotenv";
import * as fs from "fs";
import * as fsPromises from "fs/promises";
import * as path from "path";

// Load environment variables silently
dotenv.config();

async function generateMetadataSilent(postSlug = null) {
  try {
    // Get all blog posts
    const blogDir = path.join("src", "content", "blog");
    const files = await fsPromises.readdir(blogDir);
    const mdFiles = files.filter((file) => file.endsWith(".md"));

    let generatedCount = 0;
    let skippedCount = 0;

    if (postSlug) {
      // Generate for specific post
      const targetFile = mdFiles.find((file) => file.startsWith(postSlug));
      if (!targetFile) {
        throw new Error(`Post with slug "${postSlug}" not found.`);
      }
      const result = await generateMetadataForFileSilent(
        path.join(blogDir, targetFile),
      );
      if (result === "generated") generatedCount++;
      else if (result === "skipped") skippedCount++;
    } else {
      // Generate for all posts
      for (const file of mdFiles) {
        const filePath = path.join(blogDir, file);
        const result = await generateMetadataForFileSilent(filePath);
        if (result === "generated") generatedCount++;
        else if (result === "skipped") skippedCount++;
      }
    }

    // Success verification
    if (generatedCount > 0) {
      console.log(
        `✅ Metadata generation completed: ${generatedCount} files generated`,
      );
    } else if (skippedCount > 0) {
      console.log(
        `⏭️  All metadata files already exist (${skippedCount} files skipped)`,
      );
    } else {
      console.log("ℹ️  No metadata files were processed");
    }
  } catch (error) {
    console.error("❌ Critical error in metadata generation:", error.message);
    process.exit(1);
  }
}

async function generateMetadataForFileSilent(filePath) {
  try {
    const fileName = path.basename(filePath, ".md");
    const metadataPath = path.join(
      path.dirname(filePath),
      `${fileName}-metadata.json`,
    );

    // Check if metadata already exists
    try {
      await fsPromises.access(metadataPath);
      return "skipped"; // Skip silently
    } catch {
      // File doesn't exist, proceed with generation
    }

    // Read markdown content
    const content = await fsPromises.readFile(filePath, "utf-8");

    // Extract frontmatter and content
    const parsed = parseMarkdownFrontmatter(content);
    const { title, description, tags = [] } = parsed;

    if (!title || !description) {
      return "skipped"; // Skip silently
    }

    // Generate metadata using AI (simplified approach)
    const metadata = await generateAIMetadataSilent(
      title,
      description,
      tags,
      fileName,
    );

    // Write metadata file
    await fsPromises.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    return "generated";
  } catch (error) {
    console.error(
      `❌ Error processing ${path.basename(filePath)}:`,
      error.message,
    );
    return "error";
  }
}

function parseMarkdownFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) {
    return {};
  }

  const frontmatter = frontmatterMatch[1];
  const lines = frontmatter.split(/\r?\n/);
  const result = {};

  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.substring(0, colonIndex).trim();
    const value = line.substring(colonIndex + 1).trim();

    if (key && value) {
      if (key === "tags") {
        result[key] = value
          .replace(/[\[\]"]/g, "")
          .split(",")
          .map((tag) => tag.trim());
      } else {
        result[key] = value.replace(/^["']|["']$/g, "");
      }
    }
  }

  return result;
}

async function generateAIMetadataSilent(title, description, tags, slug) {
  try {
    const metaDescription = generateBasicMetaDescription(title, description);
    const keywords = generateBasicKeywords(title, description, tags);
    const recommendations = await generateAIRecommendationsSilent(
      slug,
      title,
      description,
      tags,
    );

    return {
      metaDescription,
      keywords: keywords.join(", "),
      recommendations,
      generatedAt: new Date().toISOString(),
      success: true,
    };
  } catch (error) {
    return generateFallbackMetadata(title, description, tags);
  }
}

function generateBasicMetaDescription(title, description) {
  const baseDescription = description || title;
  if (baseDescription.length <= 160) {
    return baseDescription;
  }
  return baseDescription.substring(0, 157) + "...";
}

function generateBasicKeywords(title, description, tags) {
  const allText = `${title} ${description}`.toLowerCase();
  const words = allText.split(/\s+/).filter((word) => word.length > 3);
  const wordCounts = {};

  words.forEach((word) => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });

  const topWords = Object.entries(wordCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);

  return [...new Set([...tags, ...topWords])];
}

async function generateAIRecommendationsSilent(
  currentSlug,
  currentTitle,
  currentDescription,
  currentTags,
) {
  try {
    const blogDir = path.join("src", "content", "blog");
    const files = await fsPromises.readdir(blogDir);
    const mdFiles = files.filter((file) => file.endsWith(".md"));

    const availablePosts = [];
    for (const file of mdFiles) {
      if (file === `${currentSlug}.md`) continue;

      const filePath = path.join(blogDir, file);
      const content = await fsPromises.readFile(filePath, "utf-8");
      const {
        title,
        description,
        tags = [],
      } = parseMarkdownFrontmatter(content);

      if (title && description) {
        availablePosts.push({
          slug: path.basename(file, ".md"),
          title,
          description,
          tags,
        });
      }
    }

    const scoredPosts = availablePosts.map((post) => {
      const score = calculateRelevanceScore(
        {
          title: currentTitle,
          description: currentDescription,
          tags: currentTags,
        },
        { title: post.title, description: post.description, tags: post.tags },
      );
      return { ...post, score };
    });

    const topRecommendations = scoredPosts
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((post) => `${post.title}:${post.description}`)
      .join(", ");

    return topRecommendations;
  } catch (error) {
    return "";
  }
}

function calculateRelevanceScore(currentPost, candidatePost) {
  let score = 0;

  // AI-Powered Relevance Analysis
  const currentTags = new Set(currentPost.tags.map((tag) => tag.toLowerCase()));
  const candidateTags = new Set(
    candidatePost.tags.map((tag) => tag.toLowerCase()),
  );
  const tagOverlap = [...currentTags].filter((tag) =>
    candidateTags.has(tag),
  ).length;
  score += tagOverlap * 15;

  const categories = [
    "beginner",
    "intermediate",
    "advanced",
    "tools",
    "methodology",
    "philosophy",
  ];
  const currentCategory = currentPost.tags.find((tag) =>
    categories.includes(tag),
  );
  const candidateCategory = candidatePost.tags.find((tag) =>
    categories.includes(tag),
  );
  if (
    currentCategory &&
    candidateCategory &&
    currentCategory === candidateCategory
  ) {
    score += 20;
  }

  const learningStages = [
    "pemanasan",
    "starter",
    "basic-grammar",
    "intermediate",
    "advanced",
  ];
  const currentStage = currentPost.tags.find((tag) =>
    learningStages.includes(tag),
  );
  const candidateStage = candidatePost.tags.find((tag) =>
    learningStages.includes(tag),
  );

  if (currentStage && candidateStage) {
    const currentIndex = learningStages.indexOf(currentStage);
    const candidateIndex = learningStages.indexOf(candidateStage);
    const stageDiff = Math.abs(currentIndex - candidateIndex);

    if (stageDiff === 0) score += 15;
    else if (stageDiff === 1) score += 10;
    else if (stageDiff === 2) score += 5;
  }

  const currentTitleWords = new Set(
    currentPost.title.toLowerCase().split(/\s+/),
  );
  const candidateTitleWords = new Set(
    candidatePost.title.toLowerCase().split(/\s+/),
  );
  const titleOverlap = [...currentTitleWords].filter((word) =>
    candidateTitleWords.has(word),
  ).length;
  score += titleOverlap * 5;

  const currentDescWords = new Set(
    currentPost.description.toLowerCase().split(/\s+/),
  );
  const candidateDescWords = new Set(
    candidatePost.description.toLowerCase().split(/\s+/),
  );
  const descOverlap = [...currentDescWords].filter((word) =>
    candidateDescWords.has(word),
  ).length;
  score += descOverlap * 3;

  const topicKeywords = [
    "anki",
    "immersion",
    "japanese",
    "learning",
    "vocabulary",
    "grammar",
  ];
  const currentTopic = topicKeywords.find(
    (keyword) =>
      currentPost.title.toLowerCase().includes(keyword) ||
      currentPost.description.toLowerCase().includes(keyword),
  );
  const candidateTopic = topicKeywords.find(
    (keyword) =>
      candidatePost.title.toLowerCase().includes(keyword) ||
      candidatePost.description.toLowerCase().includes(keyword),
  );

  if (currentTopic && candidateTopic && currentTopic === candidateTopic) {
    score += 25;
  }

  const contentTypes = [
    "guide",
    "tutorial",
    "philosophy",
    "methodology",
    "tools",
  ];
  const currentType = contentTypes.find(
    (type) =>
      currentPost.title.toLowerCase().includes(type) ||
      currentPost.description.toLowerCase().includes(type),
  );
  const candidateType = contentTypes.find(
    (type) =>
      candidatePost.title.toLowerCase().includes(type) ||
      candidatePost.description.toLowerCase().includes(type),
  );

  if (currentType && candidateType && currentType === candidateType) {
    score += 12;
  }

  return score;
}

function generateFallbackMetadata(title, description, tags) {
  return {
    metaDescription: description || title,
    keywords: tags.join(", "),
    recommendations: "",
    generatedAt: new Date().toISOString(),
    success: false,
  };
}

// Main execution
const args = process.argv.slice(2);
const postSlug = args[0] || null;

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
📝 Silent AI Metadata Generation Script
=======================================

USAGE:
  node geminiseo-metadata-cli-silent.js [post-slug]

EXAMPLES:
  node geminiseo-metadata-cli-silent.js                    # Generate for all posts (silent)
  node geminiseo-metadata-cli-silent.js anki-guide         # Generate for specific post (silent)
  node geminiseo-metadata-cli-silent.js --help             # Show this help

DESCRIPTION:
  Generates metadata files silently without test output.
  Perfect for production usage and automation.
`);
  process.exit(0);
}

generateMetadataSilent(postSlug);
