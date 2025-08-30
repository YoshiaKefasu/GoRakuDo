#!/usr/bin/env node

/**
 * 依存関係マッピングツール
 * MindMap参照の依存関係を分析してマッピングします
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 参照レポートを読み込む
 */
function loadReferenceReport() {
  try {
    const reportPath = 'mindmap-references-report.json';
    if (!fs.existsSync(reportPath)) {
      console.error('❌ 参照レポートが見つかりません。まず参照検出ツールを実行してください。');
      process.exit(1);
    }
    return JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  } catch (error) {
    console.error('❌ 参照レポートの読み込みに失敗しました:', error.message);
    process.exit(1);
  }
}

/**
 * ファイル間の依存関係を分析
 */
function analyzeDependencies(references) {
  const dependencies = {
    // 削除対象ファイル（Phase 1）
    critical: {
      'src/components/mind-map/MindMapDisplay.astro': [],
      'src/components/mind-map/mind-map-config.ts': [],
      'src/components/mind-map/index.ts': [],
      'src/pages/mind-map.astro': [],
      'src/utils/content-structure/mind-map-structure.ts': [],
      'src/utils/ai-content/mind-map-integration.ts': []
    },
    // 参照除去対象ファイル（Phase 2）
    high: {
      'src/content/content-config.ts': [],
      'src/content/config.ts': [],
      'src/pages/docs-new.astro': [],
      'src/utils/ai-content/content-analysis.ts': [],
      'src/utils/ai-content/semantic-relationships.ts': [],
      'src/utils/ai-content/optimized-post-processor.ts': []
    },
    // その他の依存ファイル
    other: {}
  };

  // 各ファイルの参照を分析
  references.forEach(file => {
    const filePath = file.file.replace(/\\/g, '/'); // Windowsパスの正規化
    const fileRefs = new Set();

    file.references.forEach(ref => {
      // 参照されているファイルを特定
      let referencedFile = null;

      if (ref.match.includes('mind-map/') || ref.match.includes('MindMapDisplay.astro')) {
        referencedFile = 'src/components/mind-map/MindMapDisplay.astro';
      } else if (ref.match.includes('mind-map-config.ts')) {
        referencedFile = 'src/components/mind-map/mind-map-config.ts';
      } else if (ref.match.includes('mind-map-structure.ts')) {
        referencedFile = 'src/utils/content-structure/mind-map-structure.ts';
      } else if (ref.match.includes('mind-map-integration.ts')) {
        referencedFile = 'src/utils/ai-content/mind-map-integration.ts';
      } else if (ref.match.includes('mind-map.astro')) {
        referencedFile = 'src/pages/mind-map.astro';
      } else if (ref.match.includes('MindMapIntegration') || ref.match.includes('getMindMapFilters') ||
                 ref.match.includes('countPostsByMindMapBranch') || ref.match.includes('filterPostsByMindMapBranch')) {
        referencedFile = 'src/content/content-config.ts';
      } else if (ref.match.includes('mindMapBranch')) {
        referencedFile = 'src/content/config.ts';
      } else if (ref.match.includes('filterByMindMap')) {
        if (filePath.includes('docs-new.astro')) {
          referencedFile = 'src/pages/docs-new.astro';
        } else if (filePath.includes('docs.astro')) {
          referencedFile = 'src/pages/docs.astro';
        }
      } else if (ref.match.includes('MIND_MAP_BRANCHES') || ref.match.includes('MindMapCustomization') ||
                 ref.match.includes('MindMapConfig')) {
        if (filePath.includes('content-analysis.ts')) {
          referencedFile = 'src/utils/ai-content/content-analysis.ts';
        } else if (filePath.includes('semantic-relationships.ts')) {
          referencedFile = 'src/utils/ai-content/semantic-relationships.ts';
        } else if (filePath.includes('optimized-post-processor.ts')) {
          referencedFile = 'src/utils/ai-content/optimized-post-processor.ts';
        } else if (filePath.includes('mind-map-integration.ts')) {
          referencedFile = 'src/utils/ai-content/mind-map-integration.ts';
        }
      }

      if (referencedFile && !fileRefs.has(referencedFile)) {
        fileRefs.add(referencedFile);
      }
    });

    // 依存関係を分類
    if (dependencies.critical[filePath]) {
      dependencies.critical[filePath] = Array.from(fileRefs);
    } else if (dependencies.high[filePath]) {
      dependencies.high[filePath] = Array.from(fileRefs);
    } else {
      dependencies.other[filePath] = Array.from(fileRefs);
    }
  });

  return dependencies;
}

/**
 * 削除順序を最適化
 */
function optimizeDeletionOrder(dependencies) {
  const order = {
    phase1: [], // 完全に削除するファイル
    phase2: [], // 参照を除去するファイル
    phase3: []  // 検証対象ファイル
  };

  // Phase 1: 完全に削除するファイル（依存関係が最も少ないものから）
  const criticalFiles = Object.keys(dependencies.critical);
  const criticalDepsCount = criticalFiles.map(file => ({
    file,
    deps: dependencies.critical[file].length
  })).sort((a, b) => a.deps - b.deps);

  order.phase1 = criticalDepsCount.map(item => item.file);

  // Phase 2: 参照除去対象ファイル
  order.phase2 = Object.keys(dependencies.high);

  // Phase 3: その他のファイル（検証用）
  order.phase3 = Object.keys(dependencies.other);

  return order;
}

/**
 * 依存関係レポートを生成
 */
function generateDependencyReport(dependencies, order) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: Object.keys(dependencies.other).length +
                  Object.keys(dependencies.high).length +
                  Object.keys(dependencies.critical).length,
      criticalFiles: Object.keys(dependencies.critical).length,
      highPriorityFiles: Object.keys(dependencies.high).length,
      otherFiles: Object.keys(dependencies.other).length,
      totalDependencies: 0
    },
    dependencies: dependencies,
    deletionOrder: order,
    riskAssessment: {}
  };

  // 依存関係数を計算
  Object.values(dependencies).forEach(category => {
    Object.values(category).forEach(deps => {
      report.summary.totalDependencies += deps.length;
    });
  });

  // リスク評価
  report.riskAssessment = {
    phase1: order.phase1.length > 0 ? 'HIGH' : 'LOW',
    phase2: order.phase2.length > 0 ? 'HIGH' : 'LOW',
    phase3: 'LOW',
    overall: (order.phase1.length > 0 || order.phase2.length > 0) ? 'HIGH' : 'LOW'
  };

  return report;
}

/**
 * メイン実行関数
 */
function main() {
  console.log('🔗 依存関係マッピングツールを開始します...\n');

  const references = loadReferenceReport();
  console.log(`📊 ${references.length}個の参照ファイルから依存関係を分析します...\n`);

  const dependencies = analyzeDependencies(references);
  const order = optimizeDeletionOrder(dependencies);
  const report = generateDependencyReport(dependencies, order);

  // 結果を表示
  console.log('📋 依存関係分析結果:');
  console.log(`   総ファイル数: ${report.summary.totalFiles}`);
  console.log(`   完全削除対象: ${report.summary.criticalFiles}`);
  console.log(`   参照除去対象: ${report.summary.highPriorityFiles}`);
  console.log(`   その他依存ファイル: ${report.summary.otherFiles}`);
  console.log(`   総依存関係数: ${report.summary.totalDependencies}\n`);

  console.log('🔴 Phase 1 - 完全削除対象ファイル（実行順序）:');
  order.phase1.forEach((file, index) => {
    const deps = dependencies.critical[file] || [];
    console.log(`   ${index + 1}. ${file} (${deps.length}依存)`);
  });

  console.log('\n🟡 Phase 2 - 参照除去対象ファイル:');
  order.phase2.forEach((file, index) => {
    const deps = dependencies.high[file] || [];
    console.log(`   ${index + 1}. ${file} (${deps.length}依存)`);
  });

  console.log('\n🟢 Phase 3 - 検証対象ファイル:');
  order.phase3.forEach((file, index) => {
    const deps = dependencies.other[file] || [];
    console.log(`   ${index + 1}. ${file} (${deps.length}依存)`);
  });

  console.log(`\n⚠️  リスク評価: ${report.riskAssessment.overall}`);

  // レポートを保存
  const outputPath = 'mindmap-dependency-report.json';
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  console.log(`\n💾 依存関係レポートを保存しました: ${outputPath}`);
}

main();
