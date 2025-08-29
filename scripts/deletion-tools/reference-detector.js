#!/usr/bin/env node

/**
 * MindMap参照検出自動化ツール
 * 指定されたファイルからMindMap関連の参照を検出します
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MindMap関連の検索パターン
const MINDMAP_PATTERNS = [
  // インポートパターン
  /import\s+.*from\s+['"`]@\/components\/mind-map['"`]/g,
  /import\s+.*from\s+['"`]\.\.\/mind-map['"`]/g,
  /import\s+.*from\s+['"`]\.\/mind-map['"`]/g,
  /import\s+.*from\s+['"`]@\/utils\/content-structure\/mind-map-structure['"`]/g,

  // 関数呼び出しパターン
  /mindMapBranch/g,
  /MIND_MAP_BRANCHES/g,
  /MindMapCustomization/g,
  /MindMapConfig/g,
  /MindMapIntegration/g,
  /filterByMindMap/g,
  /getMindMapFilters/g,
  /countPostsByMindMapBranch/g,
  /filterPostsByMindMapBranch/g,

  // ファイルパス参照
  /mind-map\//g,
  /mind-map\.astro/g,
  /mind-map-config\.ts/g,
  /MindMapDisplay\.astro/g,
  /mind-map-structure\.ts/g,
  /mind-map-integration\.ts/g,

  // 条件分岐パターン
  /case\s+['"`]mind-map['"`]/g,
  /['"`]mind-map['"`]\s*:/g,
];

/**
 * ファイルを解析してMindMap参照を検出
 */
function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const references = [];

    MINDMAP_PATTERNS.forEach((pattern, index) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        references.push({
          pattern: pattern.toString(),
          match: match[0],
          line: content.substring(0, match.index).split('\n').length,
          column: match.index - content.lastIndexOf('\n', match.index) + 1
        });
      }
    });

    return references;
  } catch (error) {
    return [];
  }
}

/**
 * ディレクトリを再帰的にスキャン
 */
function scanDirectory(dirPath, results = []) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // 除外ディレクトリをスキップ
      if (['node_modules', '.git', 'dist', '.astro'].includes(item)) {
        continue;
      }
      scanDirectory(fullPath, results);
    } else if (stat.isFile()) {
      // 対象ファイル拡張子をチェック
      const ext = path.extname(item);
      if (['.ts', '.js', '.astro', '.vue'].includes(ext)) {
        const references = analyzeFile(fullPath);
        if (references.length > 0) {
          results.push({
            file: path.relative(process.cwd(), fullPath),
            references: references
          });
        }
      }
    }
  }

  return results;
}

/**
 * メイン実行関数
 */
function main() {
  console.log('🔍 MindMap参照検出自動化ツールを開始します...\n');

  const targetDir = process.argv[2] || 'src';

  if (!fs.existsSync(targetDir)) {
    console.error(`❌ 対象ディレクトリが見つかりません: ${targetDir}`);
    process.exit(1);
  }

  console.log(`📁 スキャン対象ディレクトリ: ${targetDir}`);
  console.log('⏳ ファイルをスキャン中...\n');

  const results = scanDirectory(targetDir);

  if (results.length === 0) {
    console.log('✅ MindMap参照が見つかりませんでした。');
    return;
  }

  console.log(`⚠️  ${results.length}個のファイルでMindMap参照が見つかりました:\n`);

  results.forEach((result, index) => {
    console.log(`${index + 1}. 📄 ${result.file}`);
    result.references.forEach(ref => {
      console.log(`   📍 行${ref.line}: ${ref.match.trim()}`);
    });
    console.log('');
  });

  // 結果をJSONファイルに出力
  const outputPath = 'mindmap-references-report.json';
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`💾 詳細レポートを保存しました: ${outputPath}`);

  // 統計情報
  const totalReferences = results.reduce((sum, result) => sum + result.references.length, 0);
  console.log(`\n📊 検出統計:`);
  console.log(`   参照を含むファイル数: ${results.length}`);
  console.log(`   総参照数: ${totalReferences}`);
}

main();
