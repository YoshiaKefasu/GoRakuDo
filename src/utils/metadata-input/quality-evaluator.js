// ========== QUALITY EVALUATOR UTILITY ==========
// ES Modules compliant quality evaluation utility for fallback system
// Follows DRY principle by leveraging existing quality patterns

/**
 * Quality evaluator for extracted content
 * Provides 3-dimensional quality assessment (length, readability, relevance)
 */
export class QualityEvaluator {
  constructor() {
    this.qualityThresholds = {
      minLength: 50,
      maxLength: 200,
      minOverall: 70,
      readabilityWeight: 0.4,
      lengthWeight: 0.3,
      relevanceWeight: 0.3
    };
  }

  /**
   * Evaluate quality of extracted content
   * @param {string} text - Text to evaluate
   * @param {string} context - Context for relevance assessment
   * @returns {Object} Quality score object
   */
  evaluateQuality(text, context) {
    const length = this.evaluateLength(text);
    const readability = this.evaluateReadability(text);
    const relevance = this.evaluateRelevance(text, context);
  
    // 3-dimensional evaluation with weighted average (KISS principle)
    const overall = Math.round(
      length * this.qualityThresholds.lengthWeight +
      readability * this.qualityThresholds.readabilityWeight +
      relevance * this.qualityThresholds.relevanceWeight
    );
    
    const confidence = this.calculateConfidence(length, readability, relevance);
  
    return {
      overall: Math.max(0, Math.min(100, overall)),
      length: Math.max(0, Math.min(100, length)),
      readability: Math.max(0, Math.min(100, readability)),
      relevance: Math.max(0, Math.min(100, relevance)),
      confidence: Math.max(0, Math.min(1, confidence))
    };
  }

  /**
   * Evaluate length appropriateness
   * @param {string} text - Text to evaluate
   * @returns {number} Length score (0-100)
   */
  evaluateLength(text) {
    const length = text.length;
    
    if (length >= this.qualityThresholds.minLength && length <= this.qualityThresholds.maxLength) {
      return 100;
    }
    
    if (length >= 30 && length <= 300) {
      return 80;
    }
    
    if (length >= 20 && length <= 500) {
      return 60;
    }
    
    return 40;
  }

  /**
   * Evaluate readability
   * @param {string} text - Text to evaluate
   * @returns {number} Readability score (0-100)
   */
  evaluateReadability(text) {
    // Simple readability evaluation (avoid complex formulas)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.trim().length > 0);
    
    if (sentences.length === 0 || words.length === 0) {
      return 0;
    }
    
    const avgWordsPerSentence = words.length / sentences.length;
    
    // Optimal sentence length (10-25 words)
    if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 25) {
      return 100;
    }
    
    if (avgWordsPerSentence >= 5 && avgWordsPerSentence <= 35) {
      return 80;
    }
    
    if (avgWordsPerSentence >= 3 && avgWordsPerSentence <= 50) {
      return 60;
    }
    
    return 40;
  }

  /**
   * Evaluate relevance to context
   * @param {string} text - Text to evaluate
   * @param {string} context - Context for comparison
   * @returns {number} Relevance score (0-100)
   */
  evaluateRelevance(text, context) {
    if (!context) {
      return 70; // Medium score when no context available
    }
    
    // Simple relevance evaluation (keyword matching)
    const contextWords = context.toLowerCase().split(/\s+/);
    const textWords = text.toLowerCase().split(/\s+/);
    
    let matchCount = 0;
    contextWords.forEach(contextWord => {
      if (textWords.includes(contextWord) && contextWord.length > 2) {
        matchCount++;
      }
    });
    
    const relevanceRatio = matchCount / Math.max(contextWords.length, 1);
    
    if (relevanceRatio >= 0.3) return 100;
    if (relevanceRatio >= 0.2) return 80;
    if (relevanceRatio >= 0.1) return 60;
    
    return 40;
  }

  /**
   * Calculate confidence level
   * @param {number} length - Length score
   * @param {number} readability - Readability score
   * @param {number} relevance - Relevance score
   * @returns {number} Confidence score (0-1)
   */
  calculateConfidence(length, readability, relevance) {
    // Calculate confidence for each evaluation dimension
    const lengthConfidence = length >= 80 ? 1.0 : length / 100;
    const readabilityConfidence = readability >= 80 ? 1.0 : readability / 100;
    const relevanceConfidence = relevance >= 80 ? 1.0 : relevance / 100;
    
    // Weighted average for overall confidence
    return (
      lengthConfidence * this.qualityThresholds.lengthWeight +
      readabilityConfidence * this.qualityThresholds.readabilityWeight +
      relevanceConfidence * this.qualityThresholds.relevanceWeight
    );
  }

  /**
   * Check if quality meets minimum requirements
   * @param {Object} score - Quality score object
   * @returns {boolean} True if quality is acceptable
   */
  isQualityAcceptable(score) {
    return score.overall >= this.qualityThresholds.minOverall;
  }

  /**
   * Get quality improvement recommendations
   * @param {Object} score - Quality score object
   * @returns {Array} Array of improvement suggestions
   */
  getQualityRecommendations(score) {
    const recommendations = [];
    
    if (score.length < 70) {
      recommendations.push('テキストの長さを調整してください（50-200文字推奨）');
    }
    
    if (score.readability < 70) {
      recommendations.push('文章の可読性を向上させてください（短い文を推奨）');
    }
    
    if (score.relevance < 70) {
      recommendations.push('コンテキストとの関連性を高めてください');
    }
    
    return recommendations;
  }

  /**
   * Set custom quality thresholds
   * @param {Object} thresholds - Custom threshold values
   */
  setThresholds(thresholds) {
    this.qualityThresholds = { ...this.qualityThresholds, ...thresholds };
  }

  /**
   * Get current quality thresholds
   * @returns {Object} Current threshold values
   */
  getThresholds() {
    return { ...this.qualityThresholds };
  }

  /**
   * Evaluate multiple texts and rank by quality
   * @param {Array} texts - Array of text objects with content and context
   * @returns {Array} Ranked texts by quality score
   */
  evaluateMultipleTexts(texts) {
    return texts
      .map(text => ({
        ...text,
        qualityScore: this.evaluateQuality(text.content, text.context)
      }))
      .sort((a, b) => b.qualityScore.overall - a.qualityScore.overall);
  }

  /**
   * Get quality statistics for multiple evaluations
   * @param {Array} scores - Array of quality scores
   * @returns {Object} Quality statistics
   */
  getQualityStats(scores) {
    if (scores.length === 0) {
      return {
        count: 0,
        averageOverall: 0,
        averageLength: 0,
        averageReadability: 0,
        averageRelevance: 0,
        acceptableCount: 0,
        acceptableRate: 0
      };
    }

    const totalOverall = scores.reduce((sum, score) => sum + score.overall, 0);
    const totalLength = scores.reduce((sum, score) => sum + score.length, 0);
    const totalReadability = scores.reduce((sum, score) => sum + score.readability, 0);
    const totalRelevance = scores.reduce((sum, score) => sum + score.relevance, 0);
    const acceptableCount = scores.filter(score => this.isQualityAcceptable(score)).length;

    return {
      count: scores.length,
      averageOverall: Math.round(totalOverall / scores.length),
      averageLength: Math.round(totalLength / scores.length),
      averageReadability: Math.round(totalReadability / scores.length),
      averageRelevance: Math.round(totalRelevance / scores.length),
      acceptableCount,
      acceptableRate: Math.round((acceptableCount / scores.length) * 100)
    };
  }
}

// ========== UTILITY FUNCTIONS ==========
// Standalone utility functions for quality evaluation

/**
 * Create a new quality evaluator instance
 * @returns {QualityEvaluator} New quality evaluator instance
 */
export function createQualityEvaluator() {
  return new QualityEvaluator();
}

/**
 * Evaluate quality of a single text
 * @param {string} text - Text to evaluate
 * @param {string} context - Context for relevance
 * @returns {Object} Quality score
 */
export function evaluateTextQuality(text, context) {
  const evaluator = createQualityEvaluator();
  return evaluator.evaluateQuality(text, context);
}

/**
 * Check if text quality is acceptable
 * @param {string} text - Text to check
 * @param {string} context - Context for relevance
 * @returns {boolean} True if quality is acceptable
 */
export function isTextQualityAcceptable(text, context) {
  const evaluator = createQualityEvaluator();
  const score = evaluator.evaluateQuality(text, context);
  return evaluator.isQualityAcceptable(score);
}

/**
 * Get quality recommendations for text
 * @param {string} text - Text to analyze
 * @param {string} context - Context for relevance
 * @returns {Array} Quality improvement recommendations
 */
export function getTextQualityRecommendations(text, context) {
  const evaluator = createQualityEvaluator();
  const score = evaluator.evaluateQuality(text, context);
  return evaluator.getQualityRecommendations(score);
}
