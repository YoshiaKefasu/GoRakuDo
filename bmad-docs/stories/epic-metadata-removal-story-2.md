<!-- Powered by BMAD™ Core -->

# Story: Gemini API統合の完全削除とセキュリティクリーンアップ

## Status

**Ready for Development**

*テンプレート準拠確認: YAMLテンプレートの必須セクション（status, story, acceptance-criteria, tasks-subtasks, dev-notes, change-log, dev-agent-record, qa-results）をすべて含んでいます。*

## Story

**As a** システムアーキテクト and セキュリティエンジニア,
**I want** Story 1の分析結果を基にGemini API統合を完全に削除し、セキュリティ要件を100%達成する,
**So that** 機密情報漏洩のリスクを完全に排除し、次のストーリーの実装準備が整う.

## Acceptance Criteria

**セキュリティ要件（最優先）:**

1. 全Gemini APIキーの完全削除確認（Story 1の分析結果に基づく）
2. 環境変数`GOOGLE_API_KEY`、`GOOGLE_MODEL`の完全クリーンアップ
3. CI/CD設定ファイルでのAPIキー参照の完全削除確認
4. セキュリティスキャンによる機密情報漏洩の確認なし
5. セキュリティ検証チェックリストの全項目完了

**機能削除要件:**

6. `GenAI-PostMetadata-Gemini(Deprecated)/`ディレクトリの完全削除
7. `@google/genai`パッケージの完全削除（package.json、node_modules）
8. 全ソースコードでの`@google/genai`参照の完全削除
9. Gemini API関連の型定義ファイルの完全削除

**品質保証要件:**

10. 削除後のビルドプロセスが正常動作することを確認
11. 既存機能の回帰がないことを確認
12. 削除完了後のセキュリティ状態を文書化

## Tasks / Subtasks

- [ ] セキュリティクリーンアップ（AC: #1-5）
  - [ ] Story 1の分析結果に基づくAPIキー削除確認
  - [ ] 環境変数の完全クリーンアップ
  - [ ] CI/CD設定でのAPIキー参照削除確認
  - [ ] セキュリティスキャンの実行
  - [ ] セキュリティ検証チェックリストの完了

- [ ] Gemini API統合の完全削除（AC: #6-9）
  - [ ] `GenAI-PostMetadata-Gemini(Deprecated)/`ディレクトリの削除
  - [ ] `@google/genai`パッケージの削除
  - [ ] 全ソースコードでの参照削除
  - [ ] 型定義ファイルの削除

- [ ] 品質保証と検証（AC: #10-12）
  - [ ] 削除後のビルドプロセス確認
  - [ ] 既存機能の回帰テスト
  - [ ] セキュリティ状態の文書化

## Dev Notes

### 🚀 実装者向けクイックスタート（Story 1の分析結果に基づく）

#### 1. 即座に必要な情報（Phase 1開始用）
- **Story 1の分析結果**: `bmad-docs/stories/epic-metadata-removal-story-1.md`を参照
- **削除対象ファイル**: Story 1で特定済みの全Gemini API関連ファイル
- **セキュリティ要件**: エピックで定義されたセキュリティ検証チェックリスト

#### 2. 実装順序（依存関係考慮済み）
- **Phase 1**: セキュリティクリーンアップ（並列実行可能）
- **Phase 2**: Gemini API統合の完全削除（並列実行可能）
- **Phase 3**: 品質保証と検証（統合フェーズ）

#### 3. Story 1との連携ポイント
- **分析結果の活用**: Story 1で特定された全統合箇所の削除
- **リスク軽減策の実装**: Story 1で設計されたセキュリティ対策の実行
- **テストケースの活用**: Story 1で作成されたテストケースでの検証

#### 4. 具体的な実装手順（Story 1の分析結果に基づく）

**Phase 1: セキュリティクリーンアップ**
```bash
# 1. Story 1の分析結果を確認
cat bmad-docs/stories/epic-metadata-removal-story-1.md

# 2. 環境変数のクリーンアップ
grep -r "GOOGLE_API_KEY" . --exclude-dir=node_modules
grep -r "GOOGLE_MODEL" . --exclude-dir=node_modules

# 3. CI/CD設定の確認
grep -r "GOOGLE" .github/ --exclude-dir=node_modules
```

**Phase 2: Gemini API統合の完全削除**
```bash
# 1. ディレクトリの削除
rm -rf GenAI-PostMetadata-Gemini\(Deprecated\)/

# 2. パッケージの削除
npm uninstall @google/genai

# 3. ソースコードでの参照削除
grep -r "@google/genai" src/ --exclude-dir=node_modules
```

**Phase 3: 品質保証と検証**
```bash
# 1. ビルドプロセスの確認
npm run build

# 2. セキュリティスキャンの実行
npm run security-scan

# 3. 既存機能のテスト
npm run test
```

## Testing

### 関連するテスト標準

**Story 1のテストケースを活用:**
- 依存関係チェックテスト
- セキュリティスキャンテスト
- ビルドプロセステスト
- 機能代替テスト

**このストーリー用の追加テスト要件:**
- 削除完了後のセキュリティ状態確認
- 既存機能の回帰テスト
- ビルドプロセスの動作確認

### 包括的テスト設計（Story 1のテストケースを活用）

#### 📋 テスト戦略概要
**テストアプローチ**: セキュリティ優先 + 回帰テスト
**テストレベル**: セキュリティ、統合、E2E
**カバレッジ目標**: 100%（セキュリティ領域）

#### 🔒 セキュリティテスト（最優先）

**1. APIキー削除確認テスト**
```javascript
// tests/unit/security-api-key-removal.test.js
describe('API Key Removal Validation', () => {
  test('should not contain GOOGLE_API_KEY in any files', () => {
    const files = glob.sync('**/*.{ts,js,md,yml,yaml}');
    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      expect(content).not.toMatch(/GOOGLE_API_KEY/);
    });
  });

  test('should not contain @google/genai package references', () => {
    const packageJson = require('../../package.json');
    expect(packageJson.dependencies).not.toHaveProperty('@google/genai');
  });
});
```

**2. 環境変数クリーンアップテスト**
```javascript
// tests/unit/security-environment-cleanup.test.js
describe('Environment Variables Cleanup', () => {
  test('should not contain Gemini-related environment variables', () => {
    const envExample = fs.readFileSync('.env.example', 'utf8');
    expect(envExample).not.toMatch(/GOOGLE_MODEL/);
    expect(envExample).not.toMatch(/gemini/);
  });
});
```

#### 🔗 統合テスト

**3. ビルドプロセステスト**
```javascript
// tests/integration/build-after-removal.test.js
describe('Build Process After Gemini Removal', () => {
  test('should build successfully without Gemini dependencies', async () => {
    const { execSync } = require('child_process');
    expect(() => {
      execSync('npm run build', { stdio: 'pipe' });
    }).not.toThrow();
  });
});
```

#### ⚡ パフォーマンステスト

**4. 削除影響測定テスト**
```javascript
// tests/performance/removal-impact.test.js
describe('Performance Impact After Removal', () => {
  test('should maintain or improve build performance', async () => {
    const beforeMetrics = await collectBuildMetrics();
    const afterMetrics = await collectBuildMetrics();
    
    expect(afterMetrics.buildTime).toBeLessThanOrEqual(beforeMetrics.buildTime);
    expect(afterMetrics.bundleSize).toBeLessThan(beforeMetrics.bundleSize);
  });
});
```

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|---------|
| 2024-12-19 | 1.0 | 初期ドラフト作成 | PO Agent |

## Definition of Done

- [ ] 全Gemini APIキーの完全削除確認
- [ ] 環境変数の完全クリーンアップ
- [ ] CI/CD設定でのAPIキー参照削除確認
- [ ] セキュリティスキャンによる機密情報漏洩の確認なし
- [ ] セキュリティ検証チェックリストの全項目完了
- [ ] `GenAI-PostMetadata-Gemini(Deprecated)/`ディレクトリの完全削除
- [ ] `@google/genai`パッケージの完全削除
- [ ] 全ソースコードでの`@google/genai`参照の完全削除
- [ ] 削除後のビルドプロセスが正常動作
- [ ] 既存機能の回帰なし
- [ ] セキュリティ状態の文書化完了

## Estimated Effort

- セキュリティエンジニア: 6時間
- 実装者: 4時間

## Dependencies

- Story 1完了（✅ 完了済み）
- Story 1の分析結果とリスク軽減策の活用

## Risk Assessment

- **プライオリティ**: 最高（セキュリティ要件）
- **難易度**: 中
- **リスク**: 削除の不完全性によるセキュリティ脆弱性

### 詳細リスクプロファイル

#### 🔴 クリティカルリスク (R-001)
**リスク**: APIキー削除の不完全性による機密情報漏洩
- **確率**: 中 (60%)
- **影響**: 高 (10/10)
- **リスクスコア**: 60/100
- **軽減策**: Story 1の分析結果に基づく包括的削除プロセス

#### 🔴 セキュリティリスク (R-002)
**リスク**: 環境変数の残存による設定漏洩
- **確率**: 中 (70%)
- **影響**: 高 (9/10)
- **リスクスコア**: 63/100
- **軽減策**: 複数段階でのセキュリティ検証

#### 🟡 ビルド・デプロイリスク (R-003)
**リスク**: 削除後のビルドエラーとデプロイ失敗
- **確率**: 中 (50%)
- **影響**: 中 (7/10)
- **リスクスコア**: 35/100
- **軽減策**: Story 1のテストケースでの事前検証

#### 🟡 機能回帰リスク (R-004)
**リスク**: 削除処理による既存機能の破損
- **確率**: 低 (30%)
- **影響**: 中 (6/10)
- **リスクスコア**: 18/100
- **軽減策**: 段階的削除と即座のロールバック機能

---

## 強化されたソリューションと対策（Story 1の分析結果に基づく）

### リスクプロファイル分析からの主要対策

#### 🔴 クリティカルリスク対応 (R-001, R-002)
- **R-001対策強化**: Story 1の分析結果に基づく包括的削除プロセス
- **R-002強化**: 複数段階でのセキュリティ検証と二重チェック

#### 🟡 段階的ロールバックの具体化
- **チェックポイントでの状態保存**: 各削除段階での状態を自動記録
- **即座の復旧可能な設計**: 5分以内での復旧を保証
- **Story 1のロールバック戦略の活用**: 既存の段階的ロールバック機能との統合

### 実装時の品質保証

#### セキュリティ検証の自動化
```bash
# 自動化されたセキュリティスキャン
npm run security-scan:gemini-removal

# 段階的削除の検証
npm run validate:removal-phase1
npm run validate:removal-phase2
npm run validate:removal-phase3
```

#### ロールバック機能の実装
```bash
# ロールバックポイントの作成
npm run create:rollback-point

# 即座のロールバック実行
npm run rollback:immediate
```

## Dev Agent Record

### Agent Model Used
実装時に使用されたAIエージェントのモデル名とバージョンが記録されます。

### Debug Log References
実装中に生成されたデバッグログやトレースの参照が記録されます。

### Completion Notes List
タスク完了に関するメモや遭遇した問題が記録されます。

### File List
実装中に作成、修正、影響を受けたすべてのファイルが記録されます。

## QA Results

*QAレビュー結果はここに記録されます*
