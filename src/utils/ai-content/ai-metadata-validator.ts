// AI Metadata Validation Utility
// Phase 1: Basic validation for current implementation
// Phase 2+: Comprehensive validation for full schema
// Ensures data quality and provides debugging feedback

import type { CollectionEntry } from "astro:content";
import type { SimpleAIMetadata } from "./auto-ai-metadata";

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
}

export interface ValidationError {
  type:
    | "missing_field"
    | "invalid_value"
    | "type_mismatch"
    | "constraint_violation";
  field: string;
  message: string;
  severity: "critical" | "error" | "warning";
}

export interface ValidationWarning {
  type: "performance" | "quality" | "consistency";
  field: string;
  message: string;
  suggestion: string;
}

/**
 * Validate AI metadata for a single post
 * Phase 1: Basic validation for current SimpleAIMetadata
 */
export function validateAIMetadata(
  post: CollectionEntry<"docs">,
  metadata: SimpleAIMetadata,
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const suggestions: string[] = [];

  // Phase 1: Core field validation
  try {
    // Validate contentType
    if (!metadata.contentType) {
      errors.push({
        type: "missing_field",
        field: "contentType",
        message: "Content type is required",
        severity: "critical",
      });
    } else if (
      ![
        "guide",
        "methodology",
        "tool",
        "theory",
        "practice",
        "review",
        "case-study",
        "faq",
      ].includes(metadata.contentType)
    ) {
      errors.push({
        type: "invalid_value",
        field: "contentType",
        message: `Invalid content type: ${metadata.contentType}`,
        severity: "error",
      });
    }

    // Validate learningStage
    if (!metadata.learningStage) {
      errors.push({
        type: "missing_field",
        field: "learningStage",
        message: "Learning stage is required",
        severity: "critical",
      });
    } else if (
      ![
        "alphabet",
        "basic-grammar",
        "kanji-intro",
        "intermediate",
        "advanced",
        "fluency",
      ].includes(metadata.learningStage)
    ) {
      errors.push({
        type: "invalid_value",
        field: "learningStage",
        message: `Invalid learning stage: ${metadata.learningStage}`,
        severity: "error",
      });
    }

    // Validate complexityScore
    if (typeof metadata.complexityScore !== "number") {
      errors.push({
        type: "type_mismatch",
        field: "complexityScore",
        message: "Complexity score must be a number",
        severity: "error",
      });
    } else if (metadata.complexityScore < 1 || metadata.complexityScore > 10) {
      errors.push({
        type: "constraint_violation",
        field: "complexityScore",
        message: `Complexity score must be between 1-10, got: ${metadata.complexityScore}`,
        severity: "warning",
      });
    }

    // Validate estimatedStudyTime
    if (typeof metadata.estimatedStudyTime !== "number") {
      errors.push({
        type: "type_mismatch",
        field: "estimatedStudyTime",
        message: "Estimated study time must be a number",
        severity: "error",
      });
    } else if (metadata.estimatedStudyTime <= 0) {
      errors.push({
        type: "constraint_violation",
        field: "estimatedStudyTime",
        message: "Estimated study time must be positive",
        severity: "warning",
      });
    }

    // Validate primaryKeywords
    if (!Array.isArray(metadata.primaryKeywords)) {
      errors.push({
        type: "type_mismatch",
        field: "primaryKeywords",
        message: "Primary keywords must be an array",
        severity: "error",
      });
    } else if (metadata.primaryKeywords.length === 0) {
      warnings.push({
        type: "quality",
        field: "primaryKeywords",
        message: "No primary keywords detected",
        suggestion: "Consider adding relevant keywords for better SEO",
      });
    }

    // Validate searchIntent
    if (!metadata.searchIntent) {
      errors.push({
        type: "missing_field",
        field: "searchIntent",
        message: "Search intent is required",
        severity: "critical",
      });
    } else if (
      ![
        "informational",
        "navigational",
        "transactional",
        "commercial",
      ].includes(metadata.searchIntent)
    ) {
      errors.push({
        type: "invalid_value",
        field: "searchIntent",
        message: `Invalid search intent: ${metadata.searchIntent}`,
        severity: "error",
      });
    }

    // Phase 1: Content-specific validation
    validateContentSpecificMetadata(
      post,
      metadata,
      errors,
      warnings,
      suggestions,
    );
  } catch (error) {
    errors.push({
      type: "type_mismatch",
      field: "validation",
      message: `Validation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      severity: "critical",
    });
  }

  // Generate suggestions based on validation results
  if (errors.length === 0 && warnings.length === 0) {
    suggestions.push("✅ AI metadata validation passed successfully");
  }

  if (warnings.length > 0) {
    suggestions.push(
      "💡 Consider addressing warnings to improve metadata quality",
    );
  }

  return {
    isValid:
      errors.filter((e) => e.severity === "critical" || e.severity === "error")
        .length === 0,
    errors,
    warnings,
    suggestions,
  };
}

/**
 * Validate content-specific metadata based on post content
 */
function validateContentSpecificMetadata(
  post: CollectionEntry<"docs">,
  metadata: SimpleAIMetadata,
  _errors: ValidationError[],
  warnings: ValidationWarning[],
  _suggestions: string[],
): void {
  const { title, description, difficulty, tags } = post.data;
  const text = `${title} ${description} ${tags.join(" ")}`.toLowerCase();

  // Validate content type matches actual content
  if (
    metadata.contentType === "tool" &&
    !text.includes("anki") &&
    !text.includes("tool") &&
    !text.includes("alat")
  ) {
    warnings.push({
      type: "consistency",
      field: "contentType",
      message:
        "Content type 'tool' detected but no tool-related keywords found",
      suggestion:
        "Review content type detection logic or add tool-related keywords",
    });
  }

  if (
    metadata.contentType === "guide" &&
    !text.includes("panduan") &&
    !text.includes("cara") &&
    !text.includes("langkah")
  ) {
    warnings.push({
      type: "consistency",
      field: "contentType",
      message:
        "Content type 'guide' detected but no guide-related keywords found",
      suggestion:
        "Review content type detection logic or add guide-related keywords",
    });
  }

  // Validate learning stage matches difficulty
  if (difficulty === "beginner" && metadata.learningStage === "advanced") {
    warnings.push({
      type: "consistency",
      field: "learningStage",
      message: "Beginner difficulty but advanced learning stage detected",
      suggestion: "Review learning stage detection logic for consistency",
    });
  }

  if (difficulty === "advanced" && metadata.learningStage === "alphabet") {
    warnings.push({
      type: "consistency",
      field: "learningStage",
      message: "Advanced difficulty but alphabet learning stage detected",
      suggestion: "Review learning stage detection logic for consistency",
    });
  }

  // Validate keywords relevance
  if (metadata.primaryKeywords.length > 0) {
    const hasRelevantKeywords = metadata.primaryKeywords.some((keyword) =>
      text.includes(keyword.toLowerCase()),
    );

    if (!hasRelevantKeywords) {
      warnings.push({
        type: "quality",
        field: "primaryKeywords",
        message: "Primary keywords don't appear in content",
        suggestion:
          "Review keyword generation logic or add relevant keywords to content",
      });
    }
  }
}

/**
 * Validate AI metadata for multiple posts
 * Provides batch validation with summary
 */
export function validateAIMetadataBatch(
  posts: Array<
    CollectionEntry<"docs"> & { simpleAIMetadata: SimpleAIMetadata }
  >,
): {
  summary: {
    totalPosts: number;
    validPosts: number;
    invalidPosts: number;
    totalErrors: number;
    totalWarnings: number;
  };
  results: Array<{
    post: CollectionEntry<"docs">;
    validation: ValidationResult;
  }>;
} {
  const results = posts.map((post) => ({
    post,
    validation: validateAIMetadata(post, post.simpleAIMetadata),
  }));

  const summary = {
    totalPosts: posts.length,
    validPosts: results.filter((r) => r.validation.isValid).length,
    invalidPosts: results.filter((r) => !r.validation.isValid).length,
    totalErrors: results.reduce(
      (sum, r) => sum + r.validation.errors.length,
      0,
    ),
    totalWarnings: results.reduce(
      (sum, r) => sum + r.validation.warnings.length,
      0,
    ),
  };

  return { summary, results };
}

/**
 * Generate validation report for debugging
 */
export function generateValidationReport(
  validationResult: ValidationResult,
  postSlug?: string,
): string {
  const lines: string[] = [];

  lines.push(
    `🔍 AI Metadata Validation Report${postSlug ? ` for ${postSlug}` : ""}`,
  );
  lines.push("=".repeat(50));

  if (validationResult.isValid) {
    lines.push("✅ Validation Status: PASSED");
  } else {
    lines.push("❌ Validation Status: FAILED");
  }

  if (validationResult.errors.length > 0) {
    lines.push("\n🚨 ERRORS:");
    validationResult.errors.forEach((error) => {
      lines.push(`  • ${error.field}: ${error.message} (${error.severity})`);
    });
  }

  if (validationResult.warnings.length > 0) {
    lines.push("\n⚠️ WARNINGS:");
    validationResult.warnings.forEach((warning) => {
      lines.push(`  • ${warning.field}: ${warning.message}`);
      lines.push(`    💡 Suggestion: ${warning.suggestion}`);
    });
  }

  if (validationResult.suggestions.length > 0) {
    lines.push("\n💡 SUGGESTIONS:");
    validationResult.suggestions.forEach((suggestion) => {
      lines.push(`  • ${suggestion}`);
    });
  }

  return lines.join("\n");
}

// Phase 2+ placeholder functions for future expansion
export function validateFullAIMetadata(
  post: CollectionEntry<"docs">,
  metadata: any, // Will be typed properly in Phase 2
): ValidationResult {
  // Phase 2+: Will implement full schema validation
  // For now, return basic validation
  return validateAIMetadata(post, metadata as SimpleAIMetadata);
}

export function validateSchemaCompliance(): ValidationResult {
// Will be typed properly in Phase 2
  // Phase 2+: Will implement Zod schema validation
  // For now, return empty result
  return {
    isValid: true,
    errors: [],
    warnings: [],
    suggestions: ["Schema validation will be implemented in Phase 2"],
  };
}
