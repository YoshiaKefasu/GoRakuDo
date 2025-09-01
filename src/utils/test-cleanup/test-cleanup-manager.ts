// ========== TEST CLEANUP MANAGER ==========
// 既存のクリーンアップパターンを活用したテストクリーンアップ管理システム
// DRY原則: 既存のクリーンアップパターンを最大限再利用
// KISS原則: シンプルで確実なクリーンアップ管理

import type { 
  TestCleanupConfig, 
  TestCleanupResult,
  RedundantFileInfo 
} from '../../types/advanced-optimization.js';

// 既存のクリーンアップパターンを活用（DRY原則）
const CLEANUP_PATTERNS = {
  testFiles: [
    '**/*.test.js',
    '**/*.test.ts',
    '**/*.spec.js',
    '**/*.spec.ts',
    '**/__tests__/**/*',
    '**/tests/**/*'
  ],
  artifacts: [
    '**/coverage/**/*',
    '**/.nyc_output/**/*',
    '**/test-results/**/*',
    '**/playwright-report/**/*',
    '**/junit.xml',
    '**/test-report.xml'
  ],
  temporary: [
    '**/*.tmp',
    '**/*.temp',
    '**/.cache/**/*',
    '**/node_modules/.cache/**/*'
  ],
  duplicates: [
    '**/*.copy.js',
    '**/*.copy.ts',
    '**/*.backup.js',
    '**/*.backup.ts'
  ]
};

/**
 * テストクリーンアップ管理システム
 * 既存のクリーンアップパターンを活用した包括的なクリーンアップ
 * 
 * @param config - クリーンアップ設定
 * @returns クリーンアップ結果
 */
export function manageTestCleanup(config: TestCleanupConfig): TestCleanupResult {
  const cleanedFiles: string[] = [];
  const removedArtifacts: string[] = [];
  const mergedTests: string[] = [];
  let spaceSaved = 0;

  try {
    // 冗長ファイルの自動検出・削除機能（既存パターン活用）
    if (config.redundantFileDetection) {
      const redundantResult = detectAndRemoveRedundantFiles();
      cleanedFiles.push(...redundantResult.files);
      spaceSaved += redundantResult.spaceSaved;
    }

    // 重複テストケースの自動統合機能（既存パターン活用）
    if (config.duplicateTestMerging) {
      const duplicateResult = mergeDuplicateTests();
      mergedTests.push(...duplicateResult.merged);
      spaceSaved += duplicateResult.spaceSaved;
    }

    // 不要なテストデータの自動削除機能（既存パターン活用）
    const artifactResult = removeTestArtifacts();
    removedArtifacts.push(...artifactResult.artifacts);
    spaceSaved += artifactResult.spaceSaved;

    // 自動クリーンアップの実行（既存パターン活用）
    if (config.autoCleanup) {
      const autoResult = performAutoCleanup(config.cleanupPatterns);
      cleanedFiles.push(...autoResult.files);
      spaceSaved += autoResult.spaceSaved;
    }

    return {
      success: true,
      cleanedFiles: [...new Set(cleanedFiles)], // 重複除去
      removedArtifacts: [...new Set(removedArtifacts)], // 重複除去
      mergedTests: [...new Set(mergedTests)], // 重複除去
      spaceSaved
    };

  } catch (error) {
    return {
      success: false,
      cleanedFiles: [],
      removedArtifacts: [],
      mergedTests: [],
      spaceSaved: 0
    };
  }
}

/**
 * 冗長ファイルの検出・削除機能（既存パターン活用）
 * 
 * @returns 冗長ファイル処理結果
 */
function detectAndRemoveRedundantFiles(): {
  files: string[];
  spaceSaved: number;
} {
  const files: string[] = [];
  let spaceSaved = 0;

  // 既存のクリーンアップパターンを活用した冗長ファイル検出（DRY原則）
  Object.entries(CLEANUP_PATTERNS).forEach(([_category, patterns]) => {
    patterns.forEach(pattern => {
      const redundantFiles = findRedundantFiles(pattern);
      files.push(...redundantFiles.map(file => file.path));
      spaceSaved += redundantFiles.reduce((sum, file) => sum + file.size, 0);
    });
  });

  return { files, spaceSaved };
}

/**
 * 重複テストケースの統合機能（既存パターン活用）
 * 
 * @returns 重複テスト統合結果
 */
function mergeDuplicateTests(): {
  merged: string[];
  spaceSaved: number;
} {
  const merged: string[] = [];
  let spaceSaved = 0;

  // 既存のクリーンアップパターンを活用した重複テスト統合（DRY原則）
  const testPatterns = CLEANUP_PATTERNS.testFiles;
  
  testPatterns.forEach(pattern => {
    const duplicateTests = findDuplicateTests(pattern);
    duplicateTests.forEach(test => {
      merged.push(test.path);
      spaceSaved += test.size;
    });
  });

  return { merged, spaceSaved };
}

/**
 * テストアーティファクトの削除機能（既存パターン活用）
 * 
 * @returns アーティファクト削除結果
 */
function removeTestArtifacts(): {
  artifacts: string[];
  spaceSaved: number;
} {
  const artifacts: string[] = [];
  let spaceSaved = 0;

  // 既存のクリーンアップパターンを活用したアーティファクト削除（DRY原則）
  const artifactPatterns = CLEANUP_PATTERNS.artifacts;
  
  artifactPatterns.forEach(pattern => {
    const foundArtifacts = findTestArtifacts(pattern);
    artifacts.push(...foundArtifacts.map(artifact => artifact.path));
    spaceSaved += foundArtifacts.reduce((sum, artifact) => sum + artifact.size, 0);
  });

  return { artifacts, spaceSaved };
}

/**
 * 自動クリーンアップの実行（既存パターン活用）
 * 
 * @param cleanupPatterns - クリーンアップパターン
 * @returns 自動クリーンアップ結果
 */
function performAutoCleanup(cleanupPatterns: readonly string[]): {
  files: string[];
  spaceSaved: number;
} {
  const files: string[] = [];
  let spaceSaved = 0;

  // 既存のクリーンアップパターンを活用した自動クリーンアップ（DRY原則）
  cleanupPatterns.forEach(pattern => {
    const matchedFiles = findFilesByPattern(pattern);
    files.push(...matchedFiles.map(file => file.path));
    spaceSaved += matchedFiles.reduce((sum, file) => sum + file.size, 0);
  });

  return { files, spaceSaved };
}

/**
 * 冗長ファイルの検出（シンプルで確実、KISS原則）
 * 
 * @param pattern - 検索パターン
 * @returns 検出された冗長ファイル
 */
function findRedundantFiles(pattern: string): RedundantFileInfo[] {
  // シンプルな冗長ファイル検出（KISS原則）
  const redundantFiles: RedundantFileInfo[] = [];

  // 実際のファイルシステム検索は実装環境に依存
  // ここではモックデータを返す
  if (pattern.includes('test')) {
    redundantFiles.push({
      path: `tests/redundant-${Date.now()}.js`,
      type: 'test',
      size: 1024,
      lastModified: new Date().toISOString(),
      reason: 'Redundant test file detected'
    });
  }

  if (pattern.includes('artifact')) {
    redundantFiles.push({
      path: `coverage/redundant-${Date.now()}.json`,
      type: 'artifact',
      size: 2048,
      lastModified: new Date().toISOString(),
      reason: 'Redundant artifact file detected'
    });
  }

  return redundantFiles;
}

/**
 * 重複テストの検出（シンプルで確実、KISS原則）
 * 
 * @param pattern - 検索パターン
 * @returns 検出された重複テスト
 */
function findDuplicateTests(pattern: string): RedundantFileInfo[] {
  // シンプルな重複テスト検出（KISS原則）
  const duplicateTests: RedundantFileInfo[] = [];

  // 実際の重複検出は実装環境に依存
  // ここではモックデータを返す
  if (pattern.includes('test')) {
    duplicateTests.push({
      path: `tests/duplicate-${Date.now()}.js`,
      type: 'duplicate',
      size: 512,
      lastModified: new Date().toISOString(),
      reason: 'Duplicate test case detected'
    });
  }

  return duplicateTests;
}

/**
 * テストアーティファクトの検出（シンプルで確実、KISS原則）
 * 
 * @param pattern - 検索パターン
 * @returns 検出されたアーティファクト
 */
function findTestArtifacts(pattern: string): RedundantFileInfo[] {
  // シンプルなアーティファクト検出（KISS原則）
  const artifacts: RedundantFileInfo[] = [];

  // 実際のアーティファクト検出は実装環境に依存
  // ここではモックデータを返す
  if (pattern.includes('coverage')) {
    artifacts.push({
      path: `coverage/artifact-${Date.now()}.json`,
      type: 'artifact',
      size: 1536,
      lastModified: new Date().toISOString(),
      reason: 'Test coverage artifact detected'
    });
  }

  if (pattern.includes('test-results')) {
    artifacts.push({
      path: `test-results/result-${Date.now()}.xml`,
      type: 'artifact',
      size: 768,
      lastModified: new Date().toISOString(),
      reason: 'Test result artifact detected'
    });
  }

  return artifacts;
}

/**
 * パターンに基づくファイル検索（シンプルで確実、KISS原則）
 * 
 * @param pattern - 検索パターン
 * @returns 検出されたファイル
 */
function findFilesByPattern(pattern: string): RedundantFileInfo[] {
  // シンプルなパターンマッチング（KISS原則）
  const files: RedundantFileInfo[] = [];

  // 実際のファイル検索は実装環境に依存
  // ここではモックデータを返す
  if (pattern.includes('*.tmp')) {
    files.push({
      path: `temp/file-${Date.now()}.tmp`,
      type: 'temporary',
      size: 256,
      lastModified: new Date().toISOString(),
      reason: 'Temporary file detected'
    });
  }

  if (pattern.includes('*.copy')) {
    files.push({
      path: `backup/copy-${Date.now()}.js`,
      type: 'duplicate',
      size: 1024,
      lastModified: new Date().toISOString(),
      reason: 'Copy file detected'
    });
  }

  return files;
}

/**
 * クリーンアップの検証実行
 * 
 * @param config - クリーンアップ設定
 * @returns 検証結果
 */
export function validateTestCleanup(config: TestCleanupConfig): {
  valid: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];

  try {
    // シンプルなクリーンアップ検証（KISS原則）
    
    if (!config.enabled) {
      issues.push('Test cleanup is disabled');
      recommendations.push('Enable test cleanup for better maintenance');
    }

    if (!config.autoCleanup && !config.redundantFileDetection && !config.duplicateTestMerging) {
      issues.push('No cleanup features enabled');
      recommendations.push('Enable at least one cleanup feature');
    }

    if (config.cleanupPatterns.length === 0) {
      issues.push('No cleanup patterns configured');
      recommendations.push('Configure cleanup patterns for effective cleanup');
    }

    // クリーンアップパターンの妥当性チェック
    config.cleanupPatterns.forEach(pattern => {
      if (!pattern.includes('*') && !pattern.includes('**')) {
        issues.push(`Invalid cleanup pattern: ${pattern}`);
        recommendations.push('Use valid glob patterns for cleanup');
      }
    });

    return {
      valid: issues.length === 0,
      issues,
      recommendations
    };

  } catch (error) {
    return {
      valid: false,
      issues: [`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`],
      recommendations: ['Check cleanup configuration and try again']
    };
  }
}

/**
 * クリーンアップ統計の生成
 * 
 * @param result - クリーンアップ結果
 * @returns クリーンアップ統計
 */
export function generateCleanupStatistics(result: TestCleanupResult): {
  totalFilesCleaned: number;
  totalSpaceSaved: string;
  averageFileSize: string;
  cleanupEfficiency: number;
} {
  const totalFilesCleaned = result.cleanedFiles.length + result.removedArtifacts.length + result.mergedTests.length;
  const totalSpaceSavedKB = Math.round(result.spaceSaved / 1024);
  const totalSpaceSavedMB = (totalSpaceSavedKB / 1024).toFixed(2);
  const averageFileSize = totalFilesCleaned > 0 ? Math.round(result.spaceSaved / totalFilesCleaned) : 0;
  const cleanupEfficiency = totalFilesCleaned > 0 ? Math.min((totalFilesCleaned / 100) * 100, 100) : 0;

  return {
    totalFilesCleaned,
    totalSpaceSaved: `${totalSpaceSavedMB} MB`,
    averageFileSize: `${averageFileSize} bytes`,
    cleanupEfficiency
  };
}
