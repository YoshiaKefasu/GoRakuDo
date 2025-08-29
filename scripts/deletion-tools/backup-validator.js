#!/usr/bin/env node

/**
 * 自動バックアップ検証スクリプト
 * 作成されたバックアップの完全性を検証します
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * ファイルのハッシュ値を計算
 */
function calculateFileHash(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  } catch (error) {
    return null;
  }
}

/**
 * ディレクトリのハッシュ値を計算（再帰的）
 */
function calculateDirectoryHash(dirPath) {
  const hashes = {};

  function processDirectory(currentPath, relativePath = '') {
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
      const itemPath = path.join(currentPath, item);
      const itemRelativePath = path.join(relativePath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isFile()) {
        const hash = calculateFileHash(itemPath);
        if (hash) {
          hashes[itemRelativePath] = hash;
        }
      } else if (stat.isDirectory()) {
        processDirectory(itemPath, itemRelativePath);
      }
    }
  }

  processDirectory(dirPath);
  return hashes;
}

/**
 * バックアップの完全性を検証
 */
function validateBackup(backupDir, originalFiles) {
  const validation = {
    timestamp: new Date().toISOString(),
    backupDirectory: backupDir,
    results: {},
    summary: {
      totalFiles: 0,
      validFiles: 0,
      invalidFiles: 0,
      missingFiles: 0
    }
  };

  console.log(`🔍 バックアップ検証を開始: ${backupDir}\n`);

  for (const [category, files] of Object.entries(originalFiles)) {
    validation.results[category] = {};

    for (const file of files) {
      validation.summary.totalFiles++;
      const backupPath = path.join(backupDir, path.relative(process.cwd(), file));

      if (!fs.existsSync(backupPath)) {
        validation.results[category][file] = {
          status: 'MISSING',
          error: 'バックアップファイルが存在しません'
        };
        validation.summary.missingFiles++;
        console.log(`❌ ${file} - バックアップファイルが見つかりません`);
        continue;
      }

      const originalHash = calculateFileHash(file);
      const backupHash = calculateFileHash(backupPath);

      if (originalHash === backupHash) {
        validation.results[category][file] = {
          status: 'VALID',
          hash: originalHash
        };
        validation.summary.validFiles++;
        console.log(`✅ ${file} - バックアップ検証成功`);
      } else {
        validation.results[category][file] = {
          status: 'INVALID',
          originalHash: originalHash,
          backupHash: backupHash,
          error: 'ハッシュ値が一致しません'
        };
        validation.summary.invalidFiles++;
        console.log(`❌ ${file} - ハッシュ値が一致しません`);
      }
    }
  }

  return validation;
}

/**
 * バックアップ統計を生成
 */
function generateBackupStatistics(validation) {
  const stats = {
    timestamp: validation.timestamp,
    backupDirectory: validation.backupDirectory,
    fileCount: {
      total: validation.summary.totalFiles,
      valid: validation.summary.validFiles,
      invalid: validation.summary.invalidFiles,
      missing: validation.summary.missingFiles
    },
    integrity: {
      percentage: validation.summary.totalFiles > 0 ?
        ((validation.summary.validFiles / validation.summary.totalFiles) * 100).toFixed(2) : '0.00',
      status: validation.summary.invalidFiles === 0 && validation.summary.missingFiles === 0 ?
        'COMPLETE' : 'INCOMPLETE'
    },
    categories: {}
  };

  // カテゴリ別の統計
  for (const [category, files] of Object.entries(validation.results)) {
    const categoryStats = {
      total: Object.keys(files).length,
      valid: 0,
      invalid: 0,
      missing: 0
    };

    for (const fileResult of Object.values(files)) {
      if (fileResult.status === 'VALID') categoryStats.valid++;
      else if (fileResult.status === 'INVALID') categoryStats.invalid++;
      else if (fileResult.status === 'MISSING') categoryStats.missing++;
    }

    stats.categories[category] = categoryStats;
  }

  return stats;
}

/**
 * 最新のバックアップディレクトリを検索
 */
function findLatestBackup() {
  const backupBaseDir = 'backups/mindmap-deletion';

  if (!fs.existsSync(backupBaseDir)) {
    return null;
  }

  const items = fs.readdirSync(backupBaseDir)
    .map(item => path.join(backupBaseDir, item))
    .filter(item => fs.statSync(item).isDirectory())
    .sort((a, b) => fs.statSync(b).mtime - fs.statSync(a).mtime);

  return items.length > 0 ? items[0] : null;
}

/**
 * メイン実行関数
 */
function main() {
  console.log('🔐 自動バックアップ検証スクリプトを開始します...\n');

  // 最新のバックアップディレクトリを検索
  const latestBackup = findLatestBackup();
  if (!latestBackup) {
    console.error('❌ バックアップディレクトリが見つかりません。');
    process.exit(1);
  }

  console.log(`📁 検証対象バックアップ: ${latestBackup}\n`);

  // 元ファイルの定義
  const originalFiles = {
    phase1: [
      'src/components/mind-map/MindMapDisplay.astro',
      'src/components/mind-map/mind-map-config.ts',
      'src/components/mind-map/index.ts',
      'src/components/mind-map/README.md',
      'src/pages/mind-map.astro',
      'src/utils/content-structure/mind-map-structure.ts',
      'src/utils/ai-content/mind-map-integration.ts'
    ],
    phase2: [
      'src/content/content-config.ts',
      'src/content/config.ts',
      'src/pages/docs-new.astro',
      'src/utils/ai-content/content-analysis.ts',
      'src/utils/ai-content/semantic-relationships.ts',
      'src/utils/ai-content/optimized-post-processor.ts'
    ]
  };

  // バックアップ検証を実行
  const validation = validateBackup(latestBackup, originalFiles);
  const statistics = generateBackupStatistics(validation);

  // 結果の表示
  console.log('\n📊 バックアップ検証結果:');
  console.log(`   総ファイル数: ${statistics.fileCount.total}`);
  console.log(`   検証成功: ${statistics.fileCount.valid}`);
  console.log(`   検証失敗: ${statistics.fileCount.invalid}`);
  console.log(`   ファイル欠損: ${statistics.fileCount.missing}`);
  console.log(`   完全性: ${statistics.integrity.percentage}%`);
  console.log(`   ステータス: ${statistics.integrity.status}\n`);

  // カテゴリ別の結果
  console.log('📋 カテゴリ別結果:');
  for (const [category, stats] of Object.entries(statistics.categories)) {
    console.log(`   ${category}: ${stats.valid}/${stats.total} 成功`);
  }

  // 詳細レポートの保存
  const reportPath = path.join(latestBackup, 'backup-validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    validation: validation,
    statistics: statistics
  }, null, 2));

  console.log(`\n💾 検証レポートを保存しました: ${reportPath}`);

  // 最終判定
  if (statistics.integrity.status === 'COMPLETE') {
    console.log('\n🎯 検証結果: ✅ COMPLETE - バックアップは完全に検証されました');
  } else {
    console.log('\n🎯 検証結果: ❌ INCOMPLETE - バックアップに問題があります');
    process.exit(1);
  }
}

main();
