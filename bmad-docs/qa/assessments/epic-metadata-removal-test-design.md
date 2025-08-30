<!-- Powered by BMAD™ Core -->

# Test Design: Metadata Management Refactoring - Manual Input Replacement

## Executive Summary

このテスト設計は、Gemini APIによる自動メタデータ生成機能を手動入力システムに置き換えるエピックの包括的なテスト戦略を定義します。段階的テストアプローチにより、既存機能の保護と新機能の品質保証を両立させます。

## Test Strategy Overview

### テストアプローチ
- **段階的テスト**: 各ストーリー完了後の継続的テスト
- **回帰テスト重視**: 既存機能の動作保証
- **統合テスト中心**: システム全体の整合性確認
- **パフォーマンステスト**: 変更による影響の測定

### テストレベル
1. **単体テスト**: 個別コンポーネントの動作確認
2. **統合テスト**: システム間の連携確認
3. **システムテスト**: エンドツーエンドの動作確認
4. **パフォーマンステスト**: 性能指標の測定
5. **ユーザビリティテスト**: 実際の使用環境での検証

## Test Environment Setup

### 開発環境
- **Node.js**: 18.x以上
- **Astro**: 5.13.0
- **Vue.js**: 3.5.18
- **テストフレームワーク**: Jest + Playwright

### テストデータ
- **既存MDファイル**: 現在のシステムで使用されているサンプルファイル
- **メタデータサンプル**: 様々なパターンのメタデータ
- **エッジケース**: 特殊な文字や長いテキストを含むデータ

### モック・スタブ
- **Gemini API**: 外部APIのモック化
- **ファイルシステム**: テスト用の一時ファイルシステム
- **環境変数**: テスト用の設定値

## Detailed Test Cases

### 1. Gemini API統合削除のテスト

#### 1.1 依存関係の完全性テスト
```typescript
describe('Gemini API Dependencies Removal', () => {
  test('should not have any remaining Gemini API imports', () => {
    const files = getAllProjectFiles();
    const geminiReferences = findGeminiReferences(files);
    expect(geminiReferences).toHaveLength(0);
  });

  test('should not have any Gemini API environment variables', () => {
    const envVars = getEnvironmentVariables();
    expect(envVars).not.toContain('GEMINI_API_KEY');
    expect(envVars).not.toContain('GEMINI_MODEL');
  });
});
```

#### 1.2 ビルドプロセスの検証
```typescript
describe('Build Process Validation', () => {
  test('should build successfully without Gemini API', async () => {
    const buildResult = await runBuildProcess();
    expect(buildResult.exitCode).toBe(0);
    expect(buildResult.errors).toHaveLength(0);
  });

  test('should not include Gemini API in bundle', () => {
    const bundle = analyzeBuildOutput();
    expect(bundle).not.toContain('@google/genai');
  });
});
```

### 2. メタデータ処理パイプラインのテスト

#### 2.1 既存メタデータの保持
```typescript
describe('Existing Metadata Preservation', () => {
  test('should preserve all existing metadata fields', () => {
    const originalFiles = loadOriginalMetadata();
    const processedFiles = processMetadataFiles();
    
    originalFiles.forEach(file => {
      const processed = processedFiles.find(p => p.path === file.path);
      expect(processed.metadata).toMatchObject(file.metadata);
    });
  });

  test('should maintain metadata structure integrity', () => {
    const files = loadAllContentFiles();
    files.forEach(file => {
      expect(file.metadata).toHaveProperty('title');
      expect(file.metadata).toHaveProperty('description');
      expect(file.metadata).toHaveProperty('keywords');
    });
  });
});
```

#### 2.2 手動入力の検証
```typescript
describe('Manual Input Validation', () => {
  test('should accept valid metadata input', () => {
    const validInput = {
      title: 'Test Title',
      description: 'Test Description',
      keywords: ['test', 'metadata']
    };
    
    const result = validateMetadataInput(validInput);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should reject invalid metadata input', () => {
    const invalidInput = {
      title: '', // 空のタイトル
      description: 'A'.repeat(1000), // 長すぎる説明
      keywords: [] // 空のキーワード
    };
    
    const result = validateMetadataInput(invalidInput);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
```

### 3. 統合テスト

#### 3.1 MDファイル処理の統合
```typescript
describe('MD File Processing Integration', () => {
  test('should process MD files end-to-end', async () => {
    const testFile = createTestMDFile();
    const result = await processMDFile(testFile);
    
    expect(result.success).toBe(true);
    expect(result.metadata).toBeDefined();
    expect(result.html).toBeDefined();
  });

  test('should handle metadata injection correctly', () => {
    const file = loadTestMDFile();
    const processed = injectMetadata(file, sampleMetadata);
    
    expect(processed.frontmatter.title).toBe(sampleMetadata.title);
    expect(processed.frontmatter.description).toBe(sampleMetadata.description);
  });
});
```

#### 3.2 検索機能の統合
```typescript
describe('Search Function Integration', () => {
  test('should generate search data correctly', () => {
    const content = loadAllContent();
    const searchData = generateSearchData(content);
    
    expect(searchData).toHaveProperty('index');
    expect(searchData).toHaveProperty('metadata');
    expect(searchData.index.length).toBeGreaterThan(0);
  });

  test('should maintain search relevance', () => {
    const searchQuery = 'metadata';
    const results = performSearch(searchQuery);
    
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].relevance).toBeGreaterThan(0.5);
  });
});
```

### 4. パフォーマンステスト

#### 4.1 ビルド時間の測定
```typescript
describe('Build Performance', () => {
  test('should maintain build performance within acceptable limits', async () => {
    const baseline = loadPerformanceBaseline();
    const startTime = Date.now();
    
    await runBuildProcess();
    
    const buildTime = Date.now() - startTime;
    const acceptableIncrease = baseline.buildTime * 1.2; // 20%以内の増加
    
    expect(buildTime).toBeLessThan(acceptableIncrease);
  });
});
```

#### 4.2 メタデータ処理速度
```typescript
describe('Metadata Processing Performance', () => {
  test('should process metadata within acceptable time', () => {
    const files = generateTestFiles(100); // 100ファイル
    const startTime = performance.now();
    
    const results = processMetadataBatch(files);
    
    const processingTime = performance.now() - startTime;
    const acceptableTime = 5000; // 5秒以内
    
    expect(processingTime).toBeLessThan(acceptableTime);
    expect(results.length).toBe(100);
  });
});
```

### 5. ユーザビリティテスト

#### 5.1 手動入力の使いやすさ
```typescript
describe('Manual Input Usability', () => {
  test('should provide intuitive input interface', async () => {
    const page = await browser.newPage();
    await page.goto('/admin/metadata-input');
    
    // 入力フィールドの存在確認
    await expect(page.locator('input[name="title"]')).toBeVisible();
    await expect(page.locator('textarea[name="description"]')).toBeVisible();
    await expect(page.locator('input[name="keywords"]')).toBeVisible();
    
    // ヘルプテキストの確認
    await expect(page.locator('.help-text')).toBeVisible();
  });

  test('should provide real-time validation feedback', async () => {
    const page = await browser.newPage();
    await page.goto('/admin/metadata-input');
    
    // 無効な入力をテスト
    await page.fill('input[name="title"]', '');
    await page.fill('textarea[name="description"]', 'A'.repeat(1000));
    
    // エラーメッセージの表示確認
    await expect(page.locator('.error-message')).toBeVisible();
  });
});
```

## Test Execution Plan

### Phase 1: 準備・分析フェーズ
- **期間**: 1-2週間
- **テスト内容**: 既存システムのベースライン測定
- **成果物**: パフォーマンスベースライン、既存機能の動作確認

### Phase 2: 段階的実装テスト
- **期間**: 各ストーリー完了後
- **テスト内容**: 個別機能の動作確認
- **成果物**: 単体テスト結果、統合テスト結果

### Phase 3: システム統合テスト
- **期間**: 全ストーリー完了後
- **テスト内容**: システム全体の動作確認
- **成果物**: システムテスト結果、パフォーマンステスト結果

### Phase 4: ユーザビリティ・受け入れテスト
- **期間**: 1-2週間
- **テスト内容**: 実際の使用環境での検証
- **成果物**: ユーザビリティテスト結果、受け入れテスト結果

## Quality Gates

### 単体テスト
- **カバレッジ**: 80%以上
- **成功率**: 95%以上
- **実行時間**: 5分以内

### 統合テスト
- **成功率**: 90%以上
- **実行時間**: 15分以内
- **エラー率**: 5%以下

### パフォーマンステスト
- **ビルド時間**: ベースライン比20%以内の増加
- **メタデータ処理**: 100ファイル5秒以内
- **メモリ使用量**: ベースライン比30%以内の増加

### システムテスト
- **成功率**: 95%以上
- **実行時間**: 30分以内
- **クリティカルエラー**: 0件

## Test Data Management

### テストデータの準備
- **既存コンテンツ**: 現在のシステムで使用されている実際のファイル
- **サンプルデータ**: 様々なパターンのメタデータ
- **エッジケース**: 特殊な文字、長いテキスト、空の値

### データクリーンアップ
- **テスト実行後**: 一時ファイルの自動削除
- **データベース**: テスト用データの自動クリーンアップ
- **ファイルシステム**: テスト生成ファイルの自動削除

## Reporting & Metrics

### テスト結果レポート
- **日次**: テスト実行状況のサマリー
- **週次**: 詳細なテスト結果とメトリクス
- **完了時**: 包括的なテスト完了レポート

### 主要メトリクス
- **テストカバレッジ**: コードカバレッジの測定
- **成功率**: テスト実行の成功率
- **実行時間**: 各テストの実行時間
- **エラー分析**: エラーの種類と頻度

## Risk Mitigation in Testing

### テストリスクの特定
1. **テスト環境の不安定性**: 環境の自動化と再現性の確保
2. **テストデータの不足**: 包括的なテストデータの準備
3. **テスト実行時間の増加**: 並列実行と効率化

### 軽減策
1. **CI/CD統合**: 自動化されたテスト実行
2. **テスト環境のコンテナ化**: 一貫した環境の提供
3. **テストデータの自動生成**: 効率的なテストデータ管理

## Conclusion

このテスト設計により、Gemini API統合の削除と手動入力システムの導入を安全かつ確実に実行できます。段階的アプローチと包括的なテスト戦略により、既存機能の保護と新機能の品質保証を両立させます。

**次のステップ**:
1. テスト環境の構築
2. ベースライン測定の実施
3. テストケースの詳細化
4. 自動化テストの実装

---

*作成日: 2024年12月*
*QA担当: QAエージェント*
*次回レビュー: テスト環境構築完了後*
