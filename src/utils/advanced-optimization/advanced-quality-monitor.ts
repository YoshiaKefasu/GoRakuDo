// ========== ADVANCED QUALITY MONITOR ==========
// シンプルで確実な高度品質監視システム
// KISS原則: シンプルな監視ルールで確実な品質監視
// DRY原則: 既存の品質監視パターンを活用

import type {
  AdvancedQualityMonitoringConfig,
  AdvancedQualityMonitoringResult,
} from '../../types/new-seo-system';

// 既存の品質監視パターンを活用（DRY原則）
const QUALITY_METRICS = {
  seo: {
    titleLength: { min: 30, max: 60, weight: 20 },
    descriptionLength: { min: 120, max: 160, weight: 20 },
    keywordDensity: { min: 1, max: 3, weight: 15 },
    headingStructure: { min: 1, max: 6, weight: 15 },
    imageAltText: { min: 0, max: 100, weight: 10 },
    internalLinks: { min: 1, max: 10, weight: 10 },
    loadSpeed: { min: 0, max: 3000, weight: 10 },
  },
  content: {
    readability: { min: 60, max: 100, weight: 25 },
    contentLength: { min: 300, max: 2000, weight: 20 },
    grammarCheck: { min: 90, max: 100, weight: 20 },
    uniqueness: { min: 80, max: 100, weight: 15 },
    relevance: { min: 70, max: 100, weight: 20 },
  },
  technical: {
    mobileFriendly: { min: 80, max: 100, weight: 20 },
    accessibility: { min: 80, max: 100, weight: 20 },
    performance: { min: 80, max: 100, weight: 20 },
    security: { min: 90, max: 100, weight: 20 },
    compatibility: { min: 80, max: 100, weight: 20 },
  },
};

/**
 * 高度な品質監視システム
 * シンプルで確実な監視ルールによる品質監視
 *
 * @param config - 品質監視設定
 * @param currentMetrics - 現在のメトリクス値
 * @returns 品質監視結果
 */
export function monitorAdvancedQuality(
  config: AdvancedQualityMonitoringConfig,
  currentMetrics: Record<string, number>
): AdvancedQualityMonitoringResult {
  const issues: string[] = [];
  const recommendations: string[] = [];
  const monitoredMetrics: Record<string, number> = {};

  try {
    // リアルタイム監視の実装（シンプルで確実、KISS原則）
    if (config.realTime) {
      const realTimeResult = performRealTimeMonitoring(currentMetrics);
      monitoredMetrics.realTimeScore = realTimeResult.score;

      if (realTimeResult.issues.length > 0) {
        issues.push(...realTimeResult.issues);
      }

      if (realTimeResult.recommendations.length > 0) {
        recommendations.push(...realTimeResult.recommendations);
      }
    }

    // 自動問題検出の実装（シンプルで確実、KISS原則）
    if (config.autoDetection) {
      const detectionResult = performAutoProblemDetection(
        currentMetrics,
        config.thresholds
      );
      monitoredMetrics.autoDetectionScore = detectionResult.score;

      if (detectionResult.issues.length > 0) {
        issues.push(...detectionResult.issues);
      }

      if (detectionResult.recommendations.length > 0) {
        recommendations.push(...detectionResult.recommendations);
      }
    }

    // 包括的な品質指標の監視（シンプルな監視ルール）
    const comprehensiveResult = performComprehensiveMonitoring(currentMetrics);
    monitoredMetrics.comprehensiveScore = comprehensiveResult.score;

    if (comprehensiveResult.issues.length > 0) {
      issues.push(...comprehensiveResult.issues);
    }

    if (comprehensiveResult.recommendations.length > 0) {
      recommendations.push(...comprehensiveResult.recommendations);
    }

    // 監視状態の決定
    const status = determineMonitoringStatus(issues, monitoredMetrics);

    return {
      status,
      metrics: monitoredMetrics,
      issues: [...new Set(issues)], // 重複除去
      recommendations: [...new Set(recommendations)], // 重複除去
    };
  } catch (error) {
    return {
      status: 'error',
      metrics: {},
      issues: [
        `Monitoring error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ],
      recommendations: ['Check monitoring configuration and try again'],
    };
  }
}

/**
 * リアルタイム監視の実行（シンプルで確実）
 *
 * @param currentMetrics - 現在のメトリクス値
 * @returns リアルタイム監視結果
 */
function performRealTimeMonitoring(currentMetrics: Record<string, number>): {
  score: number;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 0;

  // シンプルなリアルタイム監視ルール（KISS原則）
  Object.entries(currentMetrics).forEach(([metric, value]) => {
    if (QUALITY_METRICS.seo[metric as keyof typeof QUALITY_METRICS.seo]) {
      const threshold =
        QUALITY_METRICS.seo[metric as keyof typeof QUALITY_METRICS.seo];
      const metricScore = calculateMetricScore(value, threshold);
      score += (metricScore * threshold.weight) / 100;

      if (metricScore < 60) {
        issues.push(`${metric} is below acceptable threshold (${value})`);
        recommendations.push(`Improve ${metric} to meet quality standards`);
      }
    }
  });

  return {
    score: Math.min(score, 100),
    issues,
    recommendations,
  };
}

/**
 * 自動問題検出の実行（シンプルで確実）
 *
 * @param currentMetrics - 現在のメトリクス値
 * @param thresholds - 品質閾値
 * @returns 自動問題検出結果
 */
function performAutoProblemDetection(
  currentMetrics: Record<string, number>,
  thresholds: Record<string, number>
): {
  score: number;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 0;

  // シンプルな自動問題検出ルール（KISS原則）
  Object.entries(currentMetrics).forEach(([metric, value]) => {
    const threshold = thresholds[metric] || 80;

    if (value < threshold) {
      issues.push(`${metric} below threshold: ${value} < ${threshold}`);
      recommendations.push(`Increase ${metric} to at least ${threshold}`);
      score += (value / threshold) * 100;
    } else {
      score += 100;
    }
  });

  return {
    score: Math.min(score / Object.keys(currentMetrics).length, 100),
    issues,
    recommendations,
  };
}

/**
 * 包括的な品質監視の実行（シンプルな監視ルール）
 *
 * @param currentMetrics - 現在のメトリクス値
 * @returns 包括的監視結果
 */
function performComprehensiveMonitoring(
  currentMetrics: Record<string, number>
): {
  score: number;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let totalScore = 0;
  let metricCount = 0;

  // 包括的な品質監視（シンプルなルール）
  Object.entries(QUALITY_METRICS).forEach(([category, metrics]) => {
    Object.entries(metrics).forEach(([metric, threshold]) => {
      const value = currentMetrics[metric] || 0;
      const metricScore = calculateMetricScore(value, threshold);
      totalScore += metricScore;
      metricCount++;

      if (metricScore < 60) {
        issues.push(`${category}.${metric} needs improvement (${value})`);
        recommendations.push(`Focus on improving ${category} quality metrics`);
      }
    });
  });

  return {
    score: metricCount > 0 ? Math.min(totalScore / metricCount, 100) : 0,
    issues,
    recommendations,
  };
}

/**
 * メトリクススコアの計算（シンプルで確実）
 *
 * @param value - 現在の値
 * @param threshold - 閾値設定
 * @returns 計算されたスコア
 */
function calculateMetricScore(
  value: number,
  threshold: { min: number; max: number; weight: number }
): number {
  if (value >= threshold.min && value <= threshold.max) {
    return 100; // 理想範囲内
  } else if (value < threshold.min) {
    return Math.max(0, (value / threshold.min) * 100); // 最小値未満
  } else {
    return Math.max(0, 100 - ((value - threshold.max) / threshold.max) * 100); // 最大値超過
  }
}

/**
 * 監視状態の決定（シンプルで確実）
 *
 * @param issues - 検出された問題
 * @param metrics - 監視メトリクス
 * @returns 監視状態
 */
function determineMonitoringStatus(
  issues: string[],
  _metrics: Record<string, number>
): 'active' | 'inactive' | 'error' {
  if (issues.length === 0) {
    return 'active';
  } else if (issues.length > 0) {
    return 'inactive';
  } else {
    return 'error';
  }
}

/**
 * 品質向上のための改善提案機能
 *
 * @param issues - 検出された問題
 * @param metrics - 現在のメトリクス
 * @returns 改善提案
 */
export function generateQualityImprovements(
  issues: string[],
  metrics: Record<string, number>
): string[] {
  const improvements: string[] = [];

  // シンプルな改善提案ルール（KISS原則）
  issues.forEach(issue => {
    if (issue.includes('titleLength')) {
      improvements.push('Optimize title length to 30-60 characters');
    } else if (issue.includes('descriptionLength')) {
      improvements.push('Optimize description length to 120-160 characters');
    } else if (issue.includes('keywordDensity')) {
      improvements.push('Adjust keyword density to 1-3%');
    } else if (issue.includes('loadSpeed')) {
      improvements.push('Optimize page load speed to under 3 seconds');
    } else if (issue.includes('mobileFriendly')) {
      improvements.push('Improve mobile responsiveness');
    } else if (issue.includes('accessibility')) {
      improvements.push('Enhance accessibility features');
    } else {
      improvements.push(`Address ${issue.split(' ')[0]} quality issue`);
    }
  });

  // メトリクスベースの改善提案（DRY原則）
  Object.entries(metrics).forEach(([metricName, metricValue]) => {
    if (metricValue < 50) {
      improvements.push(
        `Critical: ${metricName} needs immediate attention (current: ${metricValue})`
      );
    } else if (metricValue < 80) {
      improvements.push(
        `Warning: ${metricName} could be improved (current: ${metricValue})`
      );
    }
  });

  return improvements;
}

/**
 * 品質監視システムの健全性チェック
 *
 * @param config - 監視設定
 * @returns 健全性チェック結果
 */
export function checkMonitoringHealth(
  config: AdvancedQualityMonitoringConfig
): {
  healthy: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // シンプルな健全性チェック（KISS原則）
  if (!config.realTime && !config.autoDetection) {
    issues.push('No monitoring features enabled');
    recommendations.push('Enable at least one monitoring feature');
  }

  if (config.metrics.length === 0) {
    issues.push('No metrics configured for monitoring');
    recommendations.push('Configure monitoring metrics');
  }

  if (Object.keys(config.thresholds).length === 0) {
    issues.push('No quality thresholds configured');
    recommendations.push('Configure quality thresholds');
  }

  return {
    healthy: issues.length === 0,
    issues,
    recommendations,
  };
}
