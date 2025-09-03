// ========== KEYWORD VALIDATION SYSTEM ==========
// Keyword validation and optimization system

import type {
  ValidationResult,
  ValidationError,
  ValidationWarning,
  KeywordType,
} from '../../types/new-seo-system';

// 不足している型を定義
interface KeywordValidationConfig {
  minLength: number;
  maxLength: number;
  maxKeywords: number;
  allowDuplicates: boolean;
  language: string;
}

/**
 * New SEO Keyword Validator Class
 * Provides comprehensive keyword validation and optimization
 */
export class NewSEOKeywordValidator {
  private config: KeywordValidationConfig;

  constructor(config?: Partial<KeywordValidationConfig>) {
    this.config = {
      minLength: 2,
      maxLength: 50,
      maxKeywords: 20,
      allowDuplicates: false,
      language: 'ja',
      ...config,
    };
  }

  /**
   * Validate all keyword types
   * @param keywords - Object containing different keyword types
   * @returns ValidationResult with validation details
   */
  validateAll(keywords: {
    primary?: string[];
    longTail?: string[];
    article?: string[];
    category?: string[];
  }): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: [],
      optimizedKeywords: [],
      validationTimestamp: new Date(),
      validatorVersion: '1.0.0',
    };

    // Validate each keyword type
    if (keywords.primary) {
      this.validateKeywordArray(
        keywords.primary,
        'PRIMARY' as KeywordType,
        result
      );
    }

    if (keywords.longTail) {
      this.validateKeywordArray(
        keywords.longTail,
        'LONG_TAIL' as KeywordType,
        result
      );
    }

    if (keywords.article) {
      this.validateKeywordArray(
        keywords.article,
        'SECONDARY' as KeywordType,
        result
      );
    }

    if (keywords.category) {
      this.validateKeywordArray(
        keywords.category,
        'SECONDARY' as KeywordType,
        result
      );
    }

    // Check for duplicates across all types
    if (!this.config.allowDuplicates) {
      this.checkDuplicateKeywords(keywords, result);
    }

    // Generate optimization suggestions
    this.generateOptimizationSuggestions(result);

    // Update overall validity
    result.isValid = result.errors.length === 0;

    return result;
  }

  /**
   * Validate a single keyword array
   * @param keywordArray - Array of keywords to validate
   * @param type - Type of keywords being validated
   * @param result - ValidationResult to update
   */
  private validateKeywordArray(
    keywordArray: string[],
    type: string,
    result: ValidationResult
  ): void {
    // Check array length
    if (keywordArray.length > this.config.maxKeywords) {
      result.errors.push({
        code: 'TOO_MANY_KEYWORDS',
        message: `${type}キーワードが多すぎます（最大${this.config.maxKeywords}個まで）`,
        field: type,
        severity: 'HIGH',
      });
      result.isValid = false;
    }

    // Validate individual keywords
    keywordArray.forEach((keyword: string, index: number) => {
      const keywordResult = this.validateSingleKeyword(keyword, type, index);

      if (keywordResult.isValid) {
        result.optimizedKeywords.push(keyword);
      } else {
        result.errors.push(...keywordResult.errors);
        result.warnings.push(...keywordResult.warnings);
      }
    });
  }

  /**
   * Validate a single keyword
   * @param keyword - Single keyword to validate
   * @param type - Type of keyword
   * @param index - Index in the array
   * @returns Validation result for the keyword
   */
  private validateSingleKeyword(
    keyword: string,
    type: string,
    index: number
  ): {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
  } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check length
    if (keyword.length < this.config.minLength) {
      errors.push({
        code: 'KEYWORD_TOO_SHORT',
        message: `${type}キーワード[${index}]: "${keyword}" が短すぎます（${this.config.minLength}文字以上必要）`,
        field: type,
        severity: 'HIGH',
      });
    } else if (keyword.length > this.config.maxLength) {
      warnings.push({
        code: 'KEYWORD_TOO_LONG',
        message: `${type}キーワード[${index}]: "${keyword}" が長すぎます（${this.config.maxLength}文字以下推奨）`,
        field: type,
        impact: 'SEO',
      });
    }

    // Check for empty or whitespace-only keywords
    if (!keyword.trim()) {
      errors.push({
        code: 'EMPTY_KEYWORD',
        message: `${type}キーワード[${index}]: 空のキーワードは無効です`,
        field: type,
        severity: 'CRITICAL',
      });
    }

    // Check for special characters (basic validation)
    if (/[<>"&]/.test(keyword)) {
      warnings.push({
        code: 'SPECIAL_CHARACTERS',
        message: `${type}キーワード[${index}]: "${keyword}" に特殊文字が含まれています`,
        field: type,
        impact: 'SEO',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Check for duplicate keywords across all types
   * @param keywords - All keyword types
   * @param result - ValidationResult to update
   */
  private checkDuplicateKeywords(
    keywords: {
      primary?: string[];
      longTail?: string[];
      article?: string[];
      category?: string[];
    },
    result: ValidationResult
  ): void {
    const allKeywords: string[] = [];
    const keywordTypes: Record<string, string[]> = {};

    // Collect all keywords with their types
    if (keywords.primary) {
      allKeywords.push(...keywords.primary);
      keywordTypes['PRIMARY'] = keywords.primary;
    }
    if (keywords.longTail) {
      allKeywords.push(...keywords.longTail);
      keywordTypes['LONG_TAIL'] = keywords.longTail;
    }
    if (keywords.article) {
      allKeywords.push(...keywords.article);
      keywordTypes['SECONDARY'] = keywords.article;
    }
    if (keywords.category) {
      allKeywords.push(...keywords.category);
      keywordTypes['SECONDARY'] = keywords.category;
    }

    // Find duplicates
    const duplicates = this.findDuplicates(allKeywords);

    duplicates.forEach(duplicate => {
      const types = this.findKeywordTypes(duplicate, keywordTypes);
      if (types.length > 1) {
        result.warnings.push({
          code: 'DUPLICATE_KEYWORD',
          message: `重複キーワード "${duplicate}" が複数のタイプ（${types.join(', ')}）で使用されています`,
          field: 'keywords',
          impact: 'SEO',
        });
      }
    });
  }

  /**
   * Find duplicate values in an array
   * @param array - Array to check for duplicates
   * @returns Array of duplicate values
   */
  private findDuplicates(array: string[]): string[] {
    const seen = new Set<string>();
    const duplicates = new Set<string>();

    array.forEach(item => {
      if (seen.has(item)) {
        duplicates.add(item);
      } else {
        seen.add(item);
      }
    });

    return Array.from(duplicates);
  }

  /**
   * Find which types contain a specific keyword
   * @param keyword - Keyword to search for
   * @param keywordTypes - Object mapping types to keyword arrays
   * @returns Array of types containing the keyword
   */
  private findKeywordTypes(
    keyword: string,
    keywordTypes: Record<string, string[]>
  ): string[] {
    const types: string[] = [];

    Object.entries(keywordTypes).forEach(([type, keywords]) => {
      if (keywords.includes(keyword)) {
        types.push(type);
      }
    });

    return types;
  }

  /**
   * Generate optimization suggestions
   * @param result - ValidationResult to update
   */
  private generateOptimizationSuggestions(result: ValidationResult): void {
    // Suggest keyword optimization based on validation results
    if (result.warnings.length > 0) {
      result.suggestions.push({
        code: 'OPTIMIZE_WARNINGS',
        message: '警告のあるキーワードを最適化することをお勧めします',
        field: 'keywords',
        priority: 'MEDIUM',
        expectedBenefit: 'SEO品質の向上',
      });
    }

    if (result.optimizedKeywords.length < 3) {
      result.suggestions.push({
        code: 'ADD_MORE_KEYWORDS',
        message: 'より多くのキーワードを追加することでSEO効果が向上します',
        field: 'keywords',
        priority: 'HIGH',
        expectedBenefit: 'SEO効果の向上',
      });
    }

    if (result.optimizedKeywords.length > 15) {
      result.suggestions.push({
        code: 'REDUCE_KEYWORDS',
        message:
          'キーワードが多すぎる場合、関連性の高いものに絞り込むことをお勧めします',
        field: 'keywords',
        priority: 'MEDIUM',
        expectedBenefit: 'SEO品質の向上',
      });
    }
  }

  /**
   * Get validation configuration
   * @returns Current validation configuration
   */
  getConfig(): KeywordValidationConfig {
    return { ...this.config };
  }

  /**
   * Update validation configuration
   * @param newConfig - New configuration to merge
   */
  updateConfig(newConfig: Partial<KeywordValidationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}
