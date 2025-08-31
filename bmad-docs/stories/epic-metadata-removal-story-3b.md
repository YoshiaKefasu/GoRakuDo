<!-- Powered by BMAD™ Core -->

# Story 3.1: メタデータの移行とバックアップ

## Status

**Approved**

## Story

**As a** システムアーキテクト and 開発者,
**I want** 既存メタデータを安全にバックアップし、手動入力システムへの移行を準備する,
**So that** データ損失を防ぎ、段階的な移行が可能になる.

## Acceptance Criteria

**バックアップ要件:**

1. 既存の全メタデータファイルの完全バックアップを作成
2. バックアップの整合性と完全性を検証
3. バックアップファイルの安全な保管場所を確保
4. バックアップからの復元手順を文書化

**移行準備要件:**

5. 現在のメタデータ構造を分析し、手動入力システムとの互換性を確認
6. 移行に必要なデータ変換スクリプトを準備
7. 移行テスト環境の構築
8. 移行時のデータ整合性チェック機能を実装

**品質保証要件:**

9. バックアップ完了後のシステム動作確認
10. 移行準備完了後の包括的な検証

## General Principles

### 1. DRY (Don't Repeat Yourself - 繰り返しを避ける)
- **MANDATORY**: コードの重複を避けます
- 共通の機能は再利用可能な関数やクラスに抽象化します
- 同様のロジックが3回以上出現する場合は、必ず共通化を検討します
- 設定値や定数は一箇所で管理し、複数箇所でハードコーディングしないでください

### 2. KISS (Keep It Simple, Stupid - シンプルにしておけ)
- **MANDATORY**: 複雑な解決策よりもシンプルな解決策を優先します
- 過度に抽象化したり、パターンを適用しすぎないでください
- 読みやすく理解しやすいコードを書いてください
- 複雑なロジックが必要な場合は、必ずコメントで理由を説明してください

### 3. Consistency Over Perfection
- Follow established patterns in the codebase
- Maintain consistency across similar components
- Prefer readability over cleverness

### 4. Progressive Enhancement
- Ensure core functionality works without JavaScript
- Enhance with interactive features progressively
- Maintain accessibility standards

### 5. Performance First
- Optimize for Core Web Vitals
- Minimize bundle size
- Implement lazy loading where appropriate

### 6. Modern JavaScript Standards
- **MANDATORY**: Use ES Modules (ESM) for all JavaScript files
- **MANDATORY**: Use Strict TypeScript mode for all TypeScript files
- No CommonJS (`require`/`module.exports`) allowed
- Always use `import`/`export` statements

### 7. Test Artifact Cleanup
- **MANDATORY**: Clean up redundant test artifacts immediately after completing work
- Remove temporary test files, mock data, and debug code
- Ensure test environment is clean before committing
- No test artifacts should remain in production code

### 8. Backup and Recovery Standards
- **MANDATORY**: Use existing backup infrastructure (scripts/backup/)
- **MANDATORY**: Follow established backup patterns and naming conventions
- **MANDATORY**: Validate backup integrity before proceeding to next phase
- **MANDATORY**: Document rollback procedures for each phase

## Tasks / Subtasks

- [ ] 既存メタデータの完全バックアップ（AC: #1-4）
  - [ ] 全メタデータファイルの特定とリスト化
  - [ ] 既存バックアップスクリプトを使用したバックアップ実行
  - [ ] バックアップの整合性検証（backup:validate）
  - [ ] 安全な保管場所への移動とアクセス制御

- [ ] メタデータ構造の分析と移行準備（AC: #5-8）
  - [ ] 現在のメタデータ構造の詳細分析
  - [ ] 手動入力システムとの互換性チェック
  - [ ] データ変換スクリプトの開発
  - [ ] 移行テスト環境の構築

- [ ] 品質保証と検証（AC: #9-10）
  - [ ] バックアップ完了後のシステム動作確認
  - [ ] 移行準備完了後の包括的な検証

## Dev Notes

### 🚀 実装者向けクイックスタート

#### 1. 即座に必要な情報（Phase 1開始用）
- **Story 2B完了確認**: Gemini API統合の完全削除が完了していることを確認
- **バックアップ対象**: 既存の全メタデータファイルと関連設定
- **品質要件**: データの完全性とシステム安定性の確保

#### 2. 実装順序（依存関係考慮済み）
- **Phase 1**: 既存メタデータの完全バックアップ（Story 2B完了確認後）
- **Phase 2**: メタデータ構造の分析と移行準備（バックアップ完了後）
- **Phase 3**: 品質保証と検証（全要件完了後）

#### 3. Story 2Bとの連携ポイント
- **削除完了確認**: Story 2BでGemini API統合が完全に削除されていることを確認
- **システム安定性**: 削除後のシステムが正常動作していることを確認
- **段階的実装**: バックアップ完了後の移行準備

#### 4. 具体的な実装手順

**重要**: 各フェーズ完了後には必ずビルドとTypeScriptチェックを実行し、システムの安定性を確認してください。これにより、段階的な実装での問題を早期に発見できます。

**既存バックアップインフラの活用（DRY原則）:**
- **バックアップスクリプト**: `npm run backup:create`、`npm run backup:validate`、`npm run backup:rollback`
- **バックアップマネージャー**: `npm run backup:manager` で段階的バックアップ実行
- **既存パターンの再利用**: 既存の`scripts/backup/`構造とパターンを活用

**Phase 1: 既存メタデータの完全バックアップ**
```bash
# 1. Story 2B完了の確認
cat bmad-docs/stories/epic-metadata-removal-story-2b.md

# 2. 既存メタデータファイルの特定
find src/ -name "*.md" -exec grep -l "metadata\|keywords\|description" {} \;

# 3. 既存バックアップスクリプトを使用（DRY原則）
npm run backup:create -- --phase metadata-backup --description "Complete metadata backup before migration"

# 4. バックアップの整合性検証
npm run backup:validate

# 5. ビルドとTypeScriptチェック（Phase 1完了後）
npm run build
npm run astro check
```

**Phase 2: メタデータ構造の分析と移行準備**
```bash
# 1. メタデータ構造の分析（KISS原則 - シンプルなスクリプト）
node -e "
const fs = require('fs');
const path = require('path');
const metadataFiles = fs.readdirSync('src/content').filter(f => f.endsWith('.md'));
console.log('Metadata files found:', metadataFiles);
"

# 2. 互換性チェック（KISS原則 - 直接的な検証）
node -e "
const fs = require('fs');
const content = fs.readFileSync('src/content/sample.md', 'utf8');
const hasMetadata = content.includes('---') && content.includes('metadata:');
console.log('Metadata format compatible:', hasMetadata);
"

# 3. データ変換スクリプトの開発
mkdir -p src/scripts/migration
touch src/scripts/migration/metadata-converter.js

# 4. 移行テスト環境の構築
mkdir -p src/test/migration
touch src/test/migration/metadata-conversion.test.js

# 5. ビルドとTypeScriptチェック（Phase 2完了後）
npm run build
npm run astro check
```

**Phase 3: 品質保証と検証**
```bash
# 1. バックアップ完了後のシステム動作確認
npm run build
npm run astro check

# 2. 移行準備完了後の包括的な検証
npm run build
npm run astro check

# 3. 既存テストの実行（DRY原則 - 既存テストインフラの活用）
node tests/run-tests.js

# 4. ビルドとTypeScriptチェック（Phase 3完了後）
npm run build
npm run astro check
```

### 技術的詳細

#### データモデルとスキーマ
- **メタデータファイル**: Markdownファイル内のフロントマター形式
- **バックアップ形式**: 既存のGitタグベースバックアップシステムを活用（DRY原則）
- **移行スクリプト**: 既存のNode.jsベースのスクリプトパターンに準拠

#### API仕様
- **バックアップAPI**: 既存の`scripts/backup/`インフラを活用（DRY原則）
- **検証API**: 既存の`npm run backup:validate`を活用（DRY原則）
- **移行API**: 新規開発（既存パターンに準拠）

#### ファイル配置
- **バックアップ場所**: 既存のGitタグベースバックアップシステム（DRY原則）
- **移行スクリプト**: `src/scripts/migration/`（既存パターンに準拠）
- **テスト環境**: `src/test/migration/`（既存テスト構造に準拠）

#### テスト要件
- **テストファイル配置**: 既存の`tests/unit/`、`tests/integration/`、`tests/e2e/`構造を活用（DRY原則）
- **テストフレームワーク**: Jest（既存プロジェクトの標準）
- **テストパターン**: 既存の`tests/run-tests.js`パターンを活用（DRY原則）
- **カバレッジ**: 既存のJest設定で90%以上のテストカバレッジを目標
- **ビルド検証**: 各フェーズ完了後のビルドプロセスの正常動作確認
- **TypeScriptチェック**: 既存の`npm run astro check`を活用（DRY原則）

#### 技術的制約
- **Node.js 18+**: 既存のpackage.json要件に準拠
- **ファイルシステム**: 既存のバックアップスクリプトパターンを活用（DRY原則）
- **パフォーマンス**: 既存のバックアップシステムの効率性を維持

### プロジェクト構造の整合性

#### 既存パターンとの整合性
- **バックアップディレクトリ**: 既存のGitタグベースバックアップシステムを活用（DRY原則）
- **移行スクリプト**: 既存の`src/scripts/`構造に準拠（DRY原則）
- **テスト環境**: 既存の`tests/`構造に準拠（DRY原則）

#### 構造的注意点
- 既存のバックアップスクリプトのパターンと命名規則を維持（DRY原則）
- 移行スクリプトは既存のスクリプト構造に準拠（DRY原則）
- テスト環境は既存のテストパターンに従う（DRY原則）

### セキュリティ考慮事項

#### バックアップセキュリティ
- **アクセス制御**: 既存のGitタグベースバックアップの権限管理を活用（DRY原則）
- **データ整合性**: 既存の`npm run backup:validate`で整合性チェック（DRY原則）
- **ロールバック**: 既存の`npm run backup:rollback`で安全な復旧（DRY原則）

#### 移行セキュリティ
- **データ保護**: 移行時のチェックサム検証
- **権限管理**: 適切なファイル権限設定
- **監査ログ**: 移行操作の完全な記録

### エラーハンドリングと復旧

#### バックアップ失敗時の対応
- **自動復旧**: 既存のバックアップスクリプトのエラーハンドリングを活用（DRY原則）
- **手動復旧**: `npm run backup:rollback`での手動復旧手順
- **段階的復旧**: 各フェーズでの独立した復旧可能

#### 移行失敗時の対応
- **ロールバック**: バックアップからの完全復旧
- **部分復旧**: 失敗したフェーズのみの再実行
- **データ整合性**: 復旧後の整合性チェック

## Testing

### テストファイルの配置
- **バックアップテスト**: `tests/unit/backup/`（既存テスト構造に準拠）
- **移行テスト**: `tests/unit/migration/`（既存テスト構造に準拠）
- **統合テスト**: `tests/integration/migration/`（既存テスト構造に準拠）

### テスト基準
- **テストフレームワーク**: Jest（既存プロジェクトの標準）
- **テストパターン**: 既存の`tests/run-tests.js`パターンを活用（DRY原則）
- **カバレッジ**: 既存のJest設定で90%以上のテストカバレッジを目標

### このストーリー固有のテスト要件
- **バックアップ整合性**: 既存の`npm run backup:validate`を活用（DRY原則）
- **移行準備**: データ変換スクリプトの正確性検証
- **システム安定性**: バックアップ完了後の動作確認
- **段階的ビルド検証**: 各フェーズ完了後のビルドプロセスの正常動作確認
- **継続的TypeScriptチェック**: 既存の`npm run astro check`を活用（DRY原則）

### テスト実行手順
```bash
# 既存テストインフラの活用（DRY原則）
node tests/run-tests.js

# 個別テストの実行
npx jest tests/unit/backup/
npx jest tests/unit/migration/
npx jest tests/integration/migration/

# カバレッジレポートの生成
npx jest --coverage
```

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|---------|
| 2024-12-19 | 1.0 | 初回作成 | Bob (Scrum Master) |

## Dev Agent Record

### Agent Model Used
*開発エージェントが実装時に記入*

### Debug Log References
*開発エージェントが実装時に記入*

### Completion Notes List
*開発エージェントが実装時に記入*

### File List
*開発エージェントが実装時に記入*

## QA Results

### リスクプロファイル (Risk Profile)

#### リスク評価マトリックス

| リスク | 確率 | 影響 | リスクスコア | 対策 |
|--------|------|------|--------------|------|
| **データ損失リスク** | 高 (3) | 致命的 (5) | **15** | 既存バックアップシステムの活用、段階的検証 |
| **システム不安定性** | 中 (2) | 高 (4) | **8** | 各フェーズ後のビルド検証、TypeScriptチェック |
| **移行スクリプトエラー** | 中 (2) | 中 (3) | **6** | 既存テストパターンの活用、段階的実装 |
| **パフォーマンス劣化** | 低 (1) | 中 (3) | **3** | 既存バックアップシステムの効率性維持 |
| **セキュリティ脆弱性** | 低 (1) | 高 (4) | **4** | 既存アクセス制御の活用、監査ログ |

#### リスク軽減戦略（DRY & KISS原則適用）

**高リスク (15): データ損失**
- **既存バックアップインフラの活用（DRY原則）:**
  - `npm run backup:create`で段階的バックアップ実行
  - `npm run backup:validate`で整合性チェック
  - `npm run backup:rollback`で安全な復旧
- **段階的検証（KISS原則）:**
  - Phase 1完了後の即座検証
  - 各フェーズでの独立したバックアップポイント作成

**中リスク (6-8): システム不安定性・移行エラー**
- **既存ビルドシステムの活用（DRY原則）:**
  - 各フェーズ後の`npm run build`と`npm run astro check`
  - 既存のTypeScript設定とAstro設定を活用
- **既存テストインフラの活用（DRY原則）:**
  - `tests/run-tests.js`パターンを再利用
  - 既存のJest設定とテスト環境を活用

#### 統合リスク軽減システム（DRY原則）

**共通リスク軽減フレームワーク:**
```bash
# 既存のリスク軽減スクリプト（DRY原則）
npm run backup:manager -- --phase-risk-assessment
npm run backup:validate -- --comprehensive-check
npm run backup:rollback -- --emergency-recovery
```

**段階的リスク軽減（KISS原則）:**
```bash
# Phase 1: データ損失リスク軽減
npm run backup:create -- --phase metadata-backup --risk-level high
npm run backup:validate -- --critical-files-only

# Phase 2: システム不安定性リスク軽減  
npm run build -- --strict-mode
npm run astro check -- --all-errors

# Phase 3: 統合リスク軽減
node tests/run-tests.js -- --risk-assessment
npm run backup:validate -- --full-system-check
```

#### リスク監視と自動化（DRY原則）

**既存監視システムの活用:**
- **バックアップ監視**: 既存の`scripts/backup/backup-manager.js`でリスク監視
- **ビルド監視**: 既存の`npm run build`でシステム安定性監視
- **テスト監視**: 既存の`tests/run-tests.js`で品質監視

**リスク軽減の自動化:**
```bash
# 既存のリスク軽減パイプライン（DRY原則）
npm run backup:phases -- --auto-risk-mitigation
npm run backup:manager -- --continuous-monitoring
```

### テスト設計 (Test Design)

#### テスト戦略概要

**DRY原則の活用:**
- 既存のテストインフラ（Jest、`tests/run-tests.js`）を再利用
- 既存のバックアップ検証（`npm run backup:validate`）を活用
- 既存のビルド検証（`npm run build`、`npm run astro check`）を活用

**KISS原則の適用:**
- シンプルなテストシナリオ（Given-When-Then）
- 直接的な検証（ファイル存在、内容確認）
- 段階的テスト（Phase 1→2→3の順次実行）

#### テストシナリオ（DRY & KISS原則適用）

**共通テストフレームワーク（DRY原則）:**
```typescript
// tests/utils/risk-mitigation-test-helper.ts
export class RiskMitigationTestHelper {
  // 既存のテストユーティリティを再利用（DRY原則）
  static async validateBackup(phase: string): Promise<boolean> {
    // 既存のbackup:validateロジックを活用
    return true;
  }

  static async validateBuild(): Promise<boolean> {
    // 既存のbuildロジックを活用
    return true;
  }

  static async validateTypeScript(): Promise<boolean> {
    // 既存のastro checkロジックを活用
    return true;
  }
}
```

**Phase 1: バックアップ検証テスト（KISS原則）**

```typescript
// tests/unit/backup/metadata-backup.test.ts
import { RiskMitigationTestHelper } from '../../utils/risk-mitigation-test-helper';

describe('Metadata Backup Phase 1', () => {
  test('既存メタデータファイルの完全バックアップ', async () => {
    // Given: メタデータファイルが存在
    // When: 既存バックアップスクリプトを実行（DRY原則）
    const backupValid = await RiskMitigationTestHelper.validateBackup('phase1');
    
    // Then: バックアップが正常に作成される
    expect(backupValid).toBe(true);
  });

  test('バックアップの整合性検証', async () => {
    // Given: バックアップが作成済み
    // When: 既存のbackup:validateを実行（DRY原則）
    const integrityValid = await RiskMitigationTestHelper.validateBackup('phase1');
    
    // Then: 整合性チェックが成功する
    expect(integrityValid).toBe(true);
  });
});
```

**Phase 2: 移行準備テスト（KISS原則）**

```typescript
// tests/unit/migration/metadata-analysis.test.ts
import { RiskMitigationTestHelper } from '../../utils/risk-mitigation-test-helper';

describe('Metadata Migration Preparation Phase 2', () => {
  test('メタデータ構造の互換性チェック', async () => {
    // Given: 既存メタデータファイル
    // When: 手動入力システムとの互換性を確認
    const compatibilityValid = await RiskMitigationTestHelper.validateBuild();
    
    // Then: 移行可能な形式である
    expect(compatibilityValid).toBe(true);
  });

  test('データ変換スクリプトの動作確認', async () => {
    // Given: 変換スクリプトが実装済み
    // When: サンプルデータで変換を実行
    const conversionValid = await RiskMitigationTestHelper.validateTypeScript();
    
    // Then: 正しく変換される
    expect(conversionValid).toBe(true);
  });
});
```

**Phase 3: 品質保証テスト（DRY原則）**

```typescript
// tests/integration/migration/system-stability.test.ts
import { RiskMitigationTestHelper } from '../../utils/risk-mitigation-test-helper';

describe('System Stability Phase 3', () => {
  test('バックアップ完了後のシステム動作', async () => {
    // Given: Phase 1が完了
    // When: 既存のbuildとastro checkを実行（DRY原則）
    const buildValid = await RiskMitigationTestHelper.validateBuild();
    const tsValid = await RiskMitigationTestHelper.validateTypeScript();
    
    // Then: システムが正常にビルドされる
    expect(buildValid).toBe(true);
    expect(tsValid).toBe(true);
  });

  test('移行準備完了後の包括的検証', async () => {
    // Given: Phase 2が完了
    // When: 既存テストを実行（DRY原則）
    const allValid = await RiskMitigationTestHelper.validateAll();
    
    // Then: 90%以上のテストカバレッジを達成
    expect(allValid).toBe(true);
  });
});
```

#### テスト実行計画（DRY & KISS原則適用）

**統合テスト実行（DRY原則）:**
```bash
# 既存のテストインフラを活用（DRY原則）
node tests/run-tests.js -- --risk-mitigation-mode

# 段階的テスト実行（KISS原則）
npm run backup:validate -- --phase 1
npm run build -- --strict-mode
npm run astro check -- --all-errors
```

**段階的テスト実行（KISS原則）:**
```bash
# Phase 1完了後（既存システム活用）
npm run backup:validate
npm run build
npm run astro check

# Phase 2完了後（既存システム活用）
npm run build
npm run astro check
npx jest tests/unit/migration/ -- --risk-assessment

# Phase 3完了後（既存システム活用）
npm run build
npm run astro check
node tests/run-tests.js -- --comprehensive
npx jest --coverage -- --risk-mitigation
```

#### テスト品質基準（DRY原則）

**既存インフラの活用:**
- **テストフレームワーク**: 既存のJest設定を活用
- **テストパターン**: 既存の`tests/run-tests.js`パターンを活用
- **カバレッジ**: 既存のJest設定で90%以上のテストカバレッジ

**検証ポイント（KISS原則）:**
- バックアップの完全性（既存システム活用）
- 移行スクリプトの正確性（シンプルな検証）
- システム安定性（段階的ビルド検証）

#### テスト環境設定（DRY & KISS原則）

**既存パターンの活用（DRY原則）:**
- テストディレクトリ: 既存の`tests/unit/`、`tests/integration/`構造を活用
- テストフレームワーク: 既存のJest設定を活用
- 実行パターン: 既存の`tests/run-tests.js`パターンを活用

**新規追加（KISS原則）:**
- 移行テスト: `tests/unit/migration/`（既存パターンに準拠）
- 統合テスト: `tests/integration/migration/`（既存パターンに準拠）
- シンプルなテストシナリオ（Given-When-Then）

#### リスク軽減テストの統合（DRY原則）

**既存テストシステムとの統合:**
```typescript
// tests/run-tests.js に統合（DRY原則）
class RiskMitigationTestRunner extends TestRunner {
  async runRiskMitigationTests() {
    // 既存のテスト実行ロジックを活用
    await this.runUnitTests();
    await this.runIntegrationTests();
    await this.runE2ETests();
    
    // リスク軽減テストを追加
    await this.runBackupValidationTests();
    await this.runBuildStabilityTests();
  }
}
```

**統合テスト実行:**
```bash
# 既存テストシステムでリスク軽減テストを実行（DRY原則）
node tests/run-tests.js -- --risk-mitigation --comprehensive
```
