#!/usr/bin/env node

/**
 * システム検証診断ツール
 * MindMap削除後のシステム安定性を診断し、問題発生時の回復手順を提供
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ValidationDiagnostic {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.passed = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
    console.log(formattedMessage);

    if (type === 'error') {
      this.issues.push(formattedMessage);
    } else if (type === 'warning') {
      this.warnings.push(formattedMessage);
    } else if (type === 'success') {
      this.passed.push(formattedMessage);
    }
  }

  // 1. ファイル構造の検証
  validateFileStructure() {
    this.log('ファイル構造の検証を開始...', 'info');

    const requiredFiles = [
      'src/pages/index.astro',
      'src/pages/docs.astro',
      'src/pages/docs-new.astro',
      'src/pages/tools.astro',
      'package.json',
      'astro.config.mjs',
      'tsconfig.json'
    ];

    requiredFiles.forEach(file => {
      if (fs.existsSync(file)) {
        this.log(`${file} - 存在確認 ✓`, 'success');
      } else {
        this.log(`${file} - ファイルが存在しません`, 'error');
      }
    });
  }

  // 2. MindMap参照のクリーンアップ検証
  validateMindMapCleanup() {
    this.log('MindMap参照のクリーンアップ検証を開始...', 'info');

    const mindMapPatterns = [
      /mind-map|MIND_MAP|MINDMAP/i,
      /mindMapBranch|MIND_MAP_BRANCH/i,
      /MindMapIntegration|MIND_MAP_INTEGRATION/i
    ];

    const excludePatterns = [
      /mindmap-deletion|mindmap-removal/,
      /README\.md$/,
      /\.backup$/
    ];

    const searchFiles = [
      'src/components/public-components/Breadcrumb.astro',
      'src/utils/ai-content/content-analysis.ts',
      'src/components/docs/ai-recommendations/AI-Recommendations.astro'
    ];

    searchFiles.forEach(file => {
      if (!fs.existsSync(file)) {
        this.log(`${file} - ファイルが存在しません`, 'warning');
        return;
      }

      const content = fs.readFileSync(file, 'utf8');
      let hasActiveReferences = false;

      mindMapPatterns.forEach(pattern => {
        if (pattern.test(content)) {
          // 除外パターンをチェック
          const shouldExclude = excludePatterns.some(exclude => exclude.test(file));
          if (!shouldExclude) {
            hasActiveReferences = true;
            this.log(`${file} - MindMap参照を検出: ${pattern}`, 'warning');
          }
        }
      });

      if (!hasActiveReferences) {
        this.log(`${file} - MindMap参照クリーンアップ済み ✓`, 'success');
      }
    });
  }

  // 3. ビルドプロセスの検証
  validateBuildProcess() {
    this.log('ビルドプロセスの検証を開始...', 'info');

    try {
      // package.jsonの存在確認
      if (!fs.existsSync('package.json')) {
        this.log('package.jsonが見つかりません', 'error');
        return;
      }

      // npm installの実行（依存関係チェック）
      this.log('依存関係の検証を実行中...', 'info');
      execSync('npm install --dry-run', { stdio: 'pipe' });
      this.log('依存関係の検証 - 成功 ✓', 'success');

    } catch (error) {
      this.log(`ビルドプロセス検証エラー: ${error.message}`, 'error');
    }
  }

  // 4. テストインフラの検証
  validateTestInfrastructure() {
    this.log('テストインフラの検証を開始...', 'info');

    const testFiles = [
      'tests/run-tests.js',
      'tests/jest.config.js',
      'tests/setup.js'
    ];

    testFiles.forEach(file => {
      if (fs.existsSync(file)) {
        this.log(`${file} - 存在確認 ✓`, 'success');
      } else {
        this.log(`${file} - テストファイルが存在しません`, 'warning');
      }
    });
  }

  // 5. パフォーマンスベースラインの確立
  establishPerformanceBaseline() {
    this.log('パフォーマンスベースラインの確立を開始...', 'info');

    try {
      // ビルド時間の測定
      const buildStart = Date.now();
      execSync('npm run build', { stdio: 'pipe' });
      const buildTime = Date.now() - buildStart;

      this.log(`ビルド時間: ${buildTime}ms`, 'info');

      if (buildTime < 10000) { // 10秒以内
        this.log('ビルドパフォーマンス - 良好 ✓', 'success');
      } else {
        this.log('ビルドパフォーマンス - 要注意', 'warning');
      }

    } catch (error) {
      this.log(`パフォーマンス測定エラー: ${error.message}`, 'error');
    }
  }

  // 回復手順の生成
  generateRecoverySteps() {
    this.log('回復手順を生成中...', 'info');

    const recoverySteps = [];

    if (this.issues.length > 0) {
      recoverySteps.push('🚨 クリティカル問題の解決:');
      this.issues.forEach((issue, index) => {
        recoverySteps.push(`  ${index + 1}. ${issue}`);
      });
      recoverySteps.push('');
    }

    if (this.warnings.length > 0) {
      recoverySteps.push('⚠️ 警告事項の対応:');
      this.warnings.forEach((warning, index) => {
        recoverySteps.push(`  ${index + 1}. ${warning}`);
      });
      recoverySteps.push('');
    }

    recoverySteps.push('🔧 一般的な回復手順:');
    recoverySteps.push('  1. git status で変更状態を確認');
    recoverySteps.push('  2. 問題のあるファイルを特定');
    recoverySteps.push('  3. git checkout で変更を破棄（必要な場合）');
    recoverySteps.push('  4. npm install で依存関係を再インストール');
    recoverySteps.push('  5. npm run build でビルドを再実行');
    recoverySteps.push('');

    recoverySteps.push('📞 緊急時の連絡先:');
    recoverySteps.push('  - システム管理者までご連絡ください');
    recoverySteps.push('  - ログファイルを確認してください');

    return recoverySteps.join('\n');
  }

  // 診断レポートの生成
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalIssues: this.issues.length,
        totalWarnings: this.warnings.length,
        totalPassed: this.passed.length,
        status: this.issues.length === 0 ? 'PASS' : 'FAIL'
      },
      issues: this.issues,
      warnings: this.warnings,
      passed: this.passed,
      recoverySteps: this.generateRecoverySteps()
    };

    // レポートをファイルに保存
    const reportPath = 'validation-diagnostic-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    this.log(`診断レポートを保存しました: ${reportPath}`, 'info');

    return report;
  }

  // メイン診断実行
  async runDiagnostic() {
    this.log('=== システム検証診断を開始 ===', 'info');

    try {
      this.validateFileStructure();
      this.validateMindMapCleanup();
      this.validateBuildProcess();
      this.validateTestInfrastructure();
      this.establishPerformanceBaseline();

      const report = this.generateReport();

      this.log('=== 診断完了 ===', 'info');
      this.log(`ステータス: ${report.summary.status}`, report.summary.status === 'PASS' ? 'success' : 'error');
      this.log(`問題数: ${report.summary.totalIssues}`, 'info');
      this.log(`警告数: ${report.summary.totalWarnings}`, 'info');

      if (report.summary.totalIssues > 0) {
        this.log('回復手順:', 'info');
        console.log(report.recoverySteps);
      }

      return report;

    } catch (error) {
      this.log(`診断実行エラー: ${error.message}`, 'error');
      return this.generateReport();
    }
  }
}

// CLI実行
if (require.main === module) {
  const diagnostic = new ValidationDiagnostic();
  diagnostic.runDiagnostic().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('診断実行中に予期しないエラーが発生しました:', error);
    process.exit(1);
  });
}

module.exports = ValidationDiagnostic;
