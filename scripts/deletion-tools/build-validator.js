#!/usr/bin/env node

/**
 * ビルド検証自動化スクリプト
 * 削除プロセスの各ステップでビルドが成功することを検証します
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * ビルドを実行して結果を検証
 */
function runBuild() {
  try {
    console.log('🔨 ビルドを開始します...');
    const startTime = Date.now();

    const result = execSync('npm run build', {
      encoding: 'utf8',
      stdio: 'pipe'
    });

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log(`✅ ビルド成功 (${duration}s)`);
    return {
      success: true,
      duration: duration,
      output: result
    };
  } catch (error) {
    console.log('❌ ビルド失敗');
    return {
      success: false,
      duration: 'N/A',
      error: error.message,
      output: error.stdout || '',
      errorOutput: error.stderr || ''
    };
  }
}

/**
 * ビルドログを分析して重要な情報を抽出
 */
function analyzeBuildLog(buildResult) {
  const analysis = {
    warnings: [],
    errors: [],
    buildStats: {},
    generatedFiles: [],
    performance: {}
  };

  if (buildResult.success) {
    const output = buildResult.output;

    // 警告の検出
    const warningMatches = output.match(/warning/gi) || [];
    analysis.warnings = warningMatches.length;

    // 生成されたファイル数の検出
    const fileMatches = output.match(/(\d+)\s+page\(s\)\s+built/g);
    if (fileMatches) {
      analysis.buildStats.pagesBuilt = parseInt(fileMatches[1]);
    }

    // ビルド時間の検出
    const timeMatches = output.match(/Completed in ([\d.]+)s/g);
    if (timeMatches) {
      analysis.buildStats.buildTime = timeMatches[timeMatches.length - 1];
    }

    // パフォーマンス情報の検出
    const perfMatches = output.match(/Enhanced Performance Metrics: ({[\s\S]*?})/);
    if (perfMatches) {
      try {
        analysis.performance = JSON.parse(perfMatches[1]);
      } catch (e) {
        analysis.performance = { error: 'Failed to parse performance metrics' };
      }
    }
  } else {
    // エラーの分析
    analysis.errors = buildResult.error.split('\n').filter(line =>
      line.trim() && !line.includes('node_modules')
    );
  }

  return analysis;
}

/**
 * ビルド結果を比較
 */
function compareBuildResults(baseline, current) {
  const comparison = {
    status: 'unknown',
    changes: {},
    recommendations: []
  };

  if (!baseline || !current) {
    return comparison;
  }

  // ビルド成功状態の比較
  if (baseline.success !== current.success) {
    comparison.status = current.success ? 'improved' : 'degraded';
    comparison.changes.buildStatus = {
      from: baseline.success,
      to: current.success
    };

    if (!current.success) {
      comparison.recommendations.push('ビルド失敗を修正してください');
    }
  } else if (baseline.success && current.success) {
    comparison.status = 'stable';

    // ビルド時間の比較
    const baselineTime = parseFloat(baseline.duration);
    const currentTime = parseFloat(current.duration);

    if (Math.abs(currentTime - baselineTime) > 1.0) {
      comparison.changes.buildTime = {
        from: baselineTime,
        to: currentTime,
        change: currentTime - baselineTime
      };

      if (currentTime > baselineTime) {
        comparison.recommendations.push('ビルド時間が遅くなっています');
      } else {
        comparison.recommendations.push('ビルド時間が改善されました');
      }
    }

    // ページ数の比較
    if (baseline.analysis?.buildStats?.pagesBuilt !== current.analysis?.buildStats?.pagesBuilt) {
      comparison.changes.pagesBuilt = {
        from: baseline.analysis?.buildStats?.pagesBuilt || 0,
        to: current.analysis?.buildStats?.pagesBuilt || 0
      };

      if (current.analysis?.buildStats?.pagesBuilt < baseline.analysis?.buildStats?.pagesBuilt) {
        comparison.recommendations.push('ページ数が減少しました - 削除が成功した可能性があります');
      }
    }

    // パフォーマンスの比較
    if (baseline.analysis?.performance?.totalBuildTime && current.analysis?.performance?.totalBuildTime) {
      const perfChange = current.analysis.performance.totalBuildTime - baseline.analysis.performance.totalBuildTime;
      if (Math.abs(perfChange) > 0.1) {
        comparison.changes.performance = {
          buildTimeChange: perfChange
        };
      }
    }
  }

  return comparison;
}

/**
 * 検証結果をレポート
 */
function generateValidationReport(phase, step, buildResult, comparison = null) {
  const report = {
    timestamp: new Date().toISOString(),
    phase: phase,
    step: step,
    buildResult: {
      success: buildResult.success,
      duration: buildResult.duration
    },
    analysis: analyzeBuildLog(buildResult),
    comparison: comparison
  };

  // レポートをファイルに保存
  const reportDir = 'build-validation-reports';
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const reportPath = path.join(reportDir, `phase-${phase}-step-${step}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  return report;
}

/**
 * メイン実行関数
 */
function main() {
  const args = process.argv.slice(2);
  const phase = args[0] || 'unknown';
  const step = args[1] || 'unknown';

  console.log(`🔍 ビルド検証を開始します - Phase: ${phase}, Step: ${step}\n`);

  // ベースラインビルド結果の読み込み（存在する場合）
  let baselineResult = null;
  const baselinePath = 'build-validation-reports/baseline.json';
  if (fs.existsSync(baselinePath)) {
    try {
      baselineResult = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
      console.log('📊 ベースラインビルド結果を読み込みました\n');
    } catch (error) {
      console.log('⚠️ ベースラインビルド結果の読み込みに失敗しました\n');
    }
  }

  // 現在のビルド実行
  const currentResult = runBuild();

  // ビルド結果の分析
  currentResult.analysis = analyzeBuildLog(currentResult);

  // 比較分析
  const comparison = baselineResult ? compareBuildResults(baselineResult, currentResult) : null;

  // 結果の表示
  console.log('\n📋 ビルド検証結果:');

  if (currentResult.success) {
    console.log('✅ ビルド状態: 成功');
    console.log(`⏱️  ビルド時間: ${currentResult.duration}s`);

    if (currentResult.analysis.buildStats.pagesBuilt) {
      console.log(`📄 生成ページ数: ${currentResult.analysis.buildStats.pagesBuilt}`);
    }

    if (currentResult.analysis.warnings > 0) {
      console.log(`⚠️  警告数: ${currentResult.analysis.warnings}`);
    }

    if (comparison) {
      console.log(`\n📊 比較結果: ${comparison.status}`);
      if (comparison.changes.buildTime) {
        const change = comparison.changes.buildTime.change > 0 ? '+' : '';
        console.log(`⏱️  ビルド時間変化: ${change}${comparison.changes.buildTime.change.toFixed(2)}s`);
      }
      if (comparison.changes.pagesBuilt) {
        console.log(`📄 ページ数変化: ${comparison.changes.pagesBuilt.from} → ${comparison.changes.pagesBuilt.to}`);
      }
    }
  } else {
    console.log('❌ ビルド状態: 失敗');
    console.log('🚨 エラー内容:');
    currentResult.analysis.errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error}`);
    });
  }

  // レポート生成
  const report = generateValidationReport(phase, step, currentResult, comparison);
  console.log(`\n💾 検証レポートを保存しました: build-validation-reports/phase-${phase}-step-${step}.json`);

  // 最終判定
  const finalStatus = currentResult.success ? '✅ PASS' : '❌ FAIL';
  console.log(`\n🎯 検証結果: ${finalStatus}`);

  if (!currentResult.success) {
    process.exit(1);
  }
}

// コマンドライン引数で実行する場合
if (process.argv.length > 2) {
  main();
}

export { runBuild, analyzeBuildLog, compareBuildResults, generateValidationReport };
