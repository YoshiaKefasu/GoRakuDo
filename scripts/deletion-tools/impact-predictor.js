#!/usr/bin/env node

/**
 * 影響予測ツール
 * MindMap削除による影響を予測・分析します
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 参照レポートと依存関係レポートを読み込む
 */
function loadReports() {
  const reports = {};

  try {
    if (fs.existsSync('mindmap-references-report.json')) {
      reports.references = JSON.parse(fs.readFileSync('mindmap-references-report.json', 'utf8'));
    }
  } catch (error) {
    console.error('参照レポートの読み込みに失敗しました:', error.message);
  }

  try {
    if (fs.existsSync('mindmap-dependency-report.json')) {
      reports.dependencies = JSON.parse(fs.readFileSync('mindmap-dependency-report.json', 'utf8'));
    }
  } catch (error) {
    console.error('依存関係レポートの読み込みに失敗しました:', error.message);
  }

  return reports;
}

/**
 * 削除による影響を予測
 */
function predictDeletionImpact(reports) {
  const impact = {
    phases: {
      phase1: { files: [], risk: 'LOW', impact: 'NONE' },
      phase2: { files: [], risk: 'MEDIUM', impact: 'MODERATE' },
      phase3: { files: [], risk: 'LOW', impact: 'NONE' }
    },
    overall: {
      risk: 'MEDIUM',
      impact: 'MODERATE',
      confidence: 'HIGH'
    },
    recommendations: [],
    mitigation: []
  };

  if (!reports.references || !reports.dependencies) {
    console.error('必要なレポートが見つかりません');
    return impact;
  }

  // Phase 1: 完全削除ファイルの影響予測
  const phase1Files = Object.keys(reports.dependencies.dependencies.critical);
  impact.phases.phase1.files = phase1Files;

  if (phase1Files.length > 0) {
    impact.phases.phase1.risk = 'HIGH';
    impact.phases.phase1.impact = 'HIGH';

    impact.recommendations.push('Phase 1ファイルの削除前に、必ず完全バックアップを作成してください');
    impact.recommendations.push('各削除ステップ後にビルド検証を実行してください');
    impact.mitigation.push('Gitコミットベースのバージョン管理バックアップを準備');
    impact.mitigation.push('ファイルシステムレベルの完全バックアップを作成');
  }

  // Phase 2: 参照除去ファイルの影響予測
  const phase2Files = Object.keys(reports.dependencies.dependencies.high);
  impact.phases.phase2.files = phase2Files;

  if (phase2Files.length > 0) {
    // 各ファイルの参照数を分析
    phase2Files.forEach(file => {
      const fileRefs = reports.references.find(ref => ref.file.replace(/\\/g, '/') === file);
      if (fileRefs && fileRefs.references.length > 5) {
        impact.phases.phase2.risk = 'HIGH';
        impact.phases.phase2.impact = 'HIGH';
      }
    });

    impact.recommendations.push('Phase 2ファイルの参照除去は慎重に行ってください');
    impact.recommendations.push('各参照の除去後に構文チェックを実行してください');
    impact.mitigation.push('自動参照検出ツールを使用した完全性検証');
    impact.mitigation.push('複数手法によるクロス検証');
  }

  // 全体的なリスク評価
  if (impact.phases.phase1.risk === 'HIGH' || impact.phases.phase2.risk === 'HIGH') {
    impact.overall.risk = 'HIGH';
    impact.overall.impact = 'HIGH';
  }

  // 具体的な影響予測
  impact.specificImpacts = {
    build: predictBuildImpact(reports),
    functionality: predictFunctionalityImpact(reports),
    performance: predictPerformanceImpact(reports),
    maintenance: predictMaintenanceImpact(reports)
  };

  return impact;
}

/**
 * ビルドへの影響を予測
 */
function predictBuildImpact(reports) {
  const buildImpact = {
    risk: 'LOW',
    expectedChanges: [],
    recommendations: []
  };

  // Phase 1ファイルの削除によるビルド影響
  const phase1Files = Object.keys(reports.dependencies.dependencies.critical);
  if (phase1Files.some(file => file.includes('.astro') || file.includes('.ts'))) {
    buildImpact.risk = 'MEDIUM';
    buildImpact.expectedChanges.push('TypeScriptコンパイルエラーの可能性');
    buildImpact.expectedChanges.push('未解決のインポートエラーの可能性');
    buildImpact.recommendations.push('Phase 1削除後に必ずビルド検証を実行');
  }

  // Phase 2参照除去によるビルド影響
  const phase2Files = Object.keys(reports.dependencies.dependencies.high);
  if (phase2Files.length > 0) {
    buildImpact.risk = 'HIGH';
    buildImpact.expectedChanges.push('参照除去によるコンパイルエラーの可能性');
    buildImpact.expectedChanges.push('条件分岐や関数呼び出しの失敗');
    buildImpact.recommendations.push('各参照除去後に構文チェックを実行');
  }

  return buildImpact;
}

/**
 * 機能への影響を予測
 */
function predictFunctionalityImpact(reports) {
  const functionalityImpact = {
    risk: 'MEDIUM',
    affectedFeatures: [],
    criticalPaths: [],
    recommendations: []
  };

  // docsページ機能への影響
  const docsFiles = reports.references.filter(ref =>
    ref.file.includes('docs.astro') || ref.file.includes('docs-new.astro')
  );

  if (docsFiles.length > 0) {
    functionalityImpact.affectedFeatures.push('ドキュメントページのフィルタリング機能');
    functionalityImpact.affectedFeatures.push('MindMap関連コンテンツの表示');
    functionalityImpact.criticalPaths.push('docsページの正常動作');
  }

  // AI機能への影響
  const aiFiles = reports.references.filter(ref =>
    ref.file.includes('ai-content') && ref.references.some(r =>
      r.match.includes('MIND_MAP_BRANCHES') || r.match.includes('mindMapBranch')
    )
  );

  if (aiFiles.length > 0) {
    functionalityImpact.affectedFeatures.push('AIコンテンツ分析機能');
    functionalityImpact.affectedFeatures.push('セマンティック関連性分析');
    functionalityImpact.criticalPaths.push('AI推奨機能の動作');
  }

  functionalityImpact.recommendations.push('削除後にdocsページとAI機能を重点的にテスト');
  functionalityImpact.recommendations.push('既存機能の回帰テストを実行');

  return functionalityImpact;
}

/**
 * パフォーマンスへの影響を予測
 */
function predictPerformanceImpact(reports) {
  const performanceImpact = {
    risk: 'LOW',
    expectedChanges: [],
    benefits: [],
    recommendations: []
  };

  // バンドルサイズ削減の予測
  const phase1Files = Object.keys(reports.dependencies.dependencies.critical);
  const astroFiles = phase1Files.filter(file => file.includes('.astro'));
  const tsFiles = phase1Files.filter(file => file.includes('.ts'));

  if (astroFiles.length > 0 || tsFiles.length > 0) {
    performanceImpact.expectedChanges.push('バンドルサイズの削減（推定5-10%）');
    performanceImpact.benefits.push('ページ読み込み時間の改善');
    performanceImpact.benefits.push('ビルド時間の短縮');
  }

  performanceImpact.recommendations.push('削除前後のパフォーマンス測定を実施');
  performanceImpact.recommendations.push('Core Web Vitalsの監視を継続');

  return performanceImpact;
}

/**
 * 保守性への影響を予測
 */
function predictMaintenanceImpact(reports) {
  const maintenanceImpact = {
    risk: 'LOW',
    expectedChanges: [],
    benefits: [],
    recommendations: []
  };

  // コードベースの簡素化効果
  const totalRefs = reports.references.reduce((sum, file) => sum + file.references.length, 0);
  if (totalRefs > 50) {
    maintenanceImpact.expectedChanges.push('コードベースの大幅な簡素化');
    maintenanceImpact.benefits.push('保守コストの削減');
    maintenanceImpact.benefits.push('技術的負債の解消');
  }

  maintenanceImpact.recommendations.push('削除完了後にコードベース全体のレビューを実施');
  maintenanceImpact.recommendations.push('ドキュメントの更新を忘れずに行う');

  return maintenanceImpact;
}

/**
 * 影響予測レポートを生成
 */
function generateImpactReport(impact) {
  const report = {
    timestamp: new Date().toISOString(),
    impact: impact,
    summary: {
      overallRisk: impact.overall.risk,
      overallImpact: impact.overall.impact,
      confidence: impact.overall.confidence,
      totalRecommendations: impact.recommendations.length,
      totalMitigations: impact.mitigation.length
    }
  };

  return report;
}

/**
 * メイン実行関数
 */
function main() {
  console.log('🔮 影響予測ツールを開始します...\n');

  const reports = loadReports();

  if (!reports.references || !reports.dependencies) {
    console.error('❌ 必要なレポートが見つかりません。参照検出ツールと依存関係マッピングツールを先に実行してください。');
    process.exit(1);
  }

  const impact = predictDeletionImpact(reports);
  const report = generateImpactReport(impact);

  // 結果を表示
  console.log('📋 影響予測分析結果:');
  console.log(`⚠️  全体リスク: ${impact.overall.risk}`);
  console.log(`💥 全体影響度: ${impact.overall.impact}`);
  console.log(`🎯 予測信頼度: ${impact.overall.confidence}\n`);

  console.log('🔴 Phase 1 - 完全削除ファイル:');
  console.log(`   リスク: ${impact.phases.phase1.risk}`);
  console.log(`   影響度: ${impact.phases.phase1.impact}`);
  console.log(`   対象ファイル数: ${impact.phases.phase1.files.length}`);

  console.log('\n🟡 Phase 2 - 参照除去ファイル:');
  console.log(`   リスク: ${impact.phases.phase2.risk}`);
  console.log(`   影響度: ${impact.phases.phase2.impact}`);
  console.log(`   対象ファイル数: ${impact.phases.phase2.files.length}`);

  console.log('\n🟢 Phase 3 - 検証対象ファイル:');
  console.log(`   リスク: ${impact.phases.phase3.risk}`);
  console.log(`   影響度: ${impact.phases.phase3.impact}`);
  console.log(`   対象ファイル数: ${impact.phases.phase3.files.length}`);

  console.log('\n📊 特定領域別影響予測:');

  // ビルド影響
  console.log('\n🔨 ビルド影響:');
  console.log(`   リスク: ${impact.specificImpacts.build.risk}`);
  impact.specificImpacts.build.expectedChanges.forEach(change => {
    console.log(`   • ${change}`);
  });

  // 機能影響
  console.log('\n⚙️ 機能影響:');
  console.log(`   リスク: ${impact.specificImpacts.functionality.risk}`);
  impact.specificImpacts.functionality.affectedFeatures.forEach(feature => {
    console.log(`   • ${feature}`);
  });

  // パフォーマンス影響
  console.log('\n⚡ パフォーマンス影響:');
  console.log(`   リスク: ${impact.specificImpacts.performance.risk}`);
  impact.specificImpacts.performance.benefits.forEach(benefit => {
    console.log(`   • ${benefit}`);
  });

  // 推奨事項
  console.log('\n💡 推奨事項:');
  impact.recommendations.forEach(rec => {
    console.log(`   • ${rec}`);
  });

  console.log('\n🛡️ リスク軽減策:');
  impact.mitigation.forEach(mit => {
    console.log(`   • ${mit}`);
  });

  // レポート保存
  const outputPath = 'mindmap-impact-report.json';
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  console.log(`\n💾 影響予測レポートを保存しました: ${outputPath}`);

  console.log('\n🎯 結論:');
  console.log(`   この削除作業は${impact.overall.risk}リスク、${impact.overall.impact}影響度と予測されます。`);
  console.log(`   各Phaseでの検証を徹底し、問題発生時は即座にロールバックを実行してください。`);
}

main();
