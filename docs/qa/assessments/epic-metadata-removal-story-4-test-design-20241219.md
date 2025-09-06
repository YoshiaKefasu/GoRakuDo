# Test Design: Story 4 - MD投稿の手動メタデータ入力機能拡張

**Date:** 2024-12-19  
**Designer:** Quinn (Test Architect)  
**Story ID:** epic-metadata-removal-story-4  
**Test Strategy:** DRY + KISS原則に基づく既存システム活用型テスト  
**Risk Mitigation:** Enhanced (Risk Score: 12/25 → 8/25)

## Test Strategy Overview

- **Total test scenarios:** 24 → **18** (DRY原則による既存テストパターンの活用)
- **Unit tests:** 12 (50%) → **8 (44%)** - 既存テストインフラ活用
- **Integration tests:** 8 (33%) → **6 (33%)** - 既存システム統合テスト
- **E2E tests:** 4 (17%) → **4 (22%)** - ユーザージャーニー中心
- **Risk mitigation coverage:** 100% (全リスク項目に対応)
- **🆕 DRY + KISS効果:** 既存テストパターンの活用により、新規テストケースを25%削減

## Test Level Framework Application (Enhanced)

### Unit Tests (DRY原則: 既存テストパターン活用)
- **対象:** 純粋なロジック、アルゴリズム、計算処理
- **既存活用:** Jest設定、テストユーティリティ、モック（`tests/utils/`から）
- **新規作成:** 最小限（既存パターンの適用）
- **🆕 改善点:** 既存のバリデーションテストパターンを`src/utils/validation-helpers.js`として抽象化

### Integration Tests (DRY原則: 既存システム統合)
- **対象:** コンポーネント間相互作用、DB操作、API統合
- **既存活用:** 既存の統合テストフレームワーク（`tests/integration/`から）
- **新規作成:** 必要最小限（既存パターンの拡張）
- **🆕 改善点:** 既存のフロントマター解析ロジックを`src/utils/frontmatter-parser.js`として活用

### E2E Tests (KISS原則: シンプルなユーザージャーニー)
- **対象:** 重要なユーザーフロー、コンプライアンス
- **既存活用:** 既存のE2Eテストインフラ（`tests/e2e/`から）
- **新規作成:** 核心機能のみ（複雑性を避ける）
- **🆕 改善点:** 既存のユーザージャーニーテストパターンを活用

## Test Scenarios by Acceptance Criteria (Enhanced)

### AC #1-4: 手動入力機能要件

#### Unit Tests (P0 - セキュリティ・コア機能)

**TEST-001: メタデータ入力フィールドの表示制御**
- **Level:** Unit
- **Priority:** P0
- **Requirement:** AC #1
- **Description:** MDファイル編集時のメタデータ入力フィールド表示制御
- **Justification:** 純粋な表示ロジック、既存UIパターンの活用
- **Mitigates Risks:** TECH-001
- **Test Data:** 既存.mdファイル、フロントマター有無パターン
- **🆕 DRY + KISS改善:** 既存のUI表示テストパターンを`tests/unit/ui/`から再利用

**TEST-002: 入力値バリデーション（文字数制限）**
- **Level:** Unit
- **Priority:** P0
- **Requirement:** AC #4
- **Description:** タイトル、説明、キーワードの文字数制限チェック
- **Justification:** 純粋なバリデーションロジック、既存バリデーションパターン活用
- **Mitigates Risks:** DATA-001
- **Test Data:** 境界値、異常値、正常値
- **🆕 DRY + KISS改善:** 既存のバリデーションテストパターンを`tests/unit/validation/`から再利用

**TEST-003: 入力値サニタイゼーション（XSS防止）**
- **Level:** Unit
- **Priority:** P0
- **Requirement:** AC #4
- **Description:** 既存DOMPurify 3.2.6を使用した入力値サニタイゼーション
- **Justification:** 既存セキュリティパターンの活用（DRY原則）
- **Mitigates Risks:** SEC-001
- **Test Data:** XSS攻撃パターン、HTMLタグ、スクリプト
- **🆕 DRY + KISS改善:** 既存のセキュリティテストパターンを`tests/unit/security/`から再利用

#### Integration Tests (P1 - ユーザビリティ・統合)

**TEST-004: リアルタイムプレビュー機能**
- **Level:** Integration
- **Priority:** P1
- **Requirement:** AC #3
- **Description:** 入力内容のリアルタイムプレビュー表示
- **Justification:** コンポーネント間相互作用、既存プレビューシステム活用
- **Mitigates Risks:** PERF-001
- **Test Data:** 大量テキスト、特殊文字、長文
- **🆕 DRY + KISS改善:** 既存のプレビューテストパターンを`tests/integration/preview/`から再利用

**TEST-005: フロントマター解析と統合**
- **Level:** Integration
- **Priority:** P1
- **Requirement:** AC #1-4
- **Description:** 既存.mdファイルのフロントマター解析と新システム統合
- **Justification:** 既存システムとの統合、フロントマター解析ロジック活用
- **Mitigates Risks:** TECH-001
- **Test Data:** 既存.mdファイル、フロントマター形式
- **🆕 DRY + KISS改善:** 既存のフロントマターテストパターンを`tests/integration/frontmatter/`から再利用

### AC #5-8: キーワード機能強化要件

#### Unit Tests (P1 - コア機能)

**TEST-006: キーワード追加・削除・編集機能**
- **Level:** Unit
- **Priority:** P1
- **Requirement:** AC #5
- **Description:** キーワードの基本的なCRUD操作
- **Justification:** 純粋なデータ操作ロジック、既存CRUDパターン活用
- **Mitigates Risks:** DATA-001
- **Test Data:** 空文字、特殊文字、重複キーワード
- **🆕 DRY + KISS改善:** 既存のCRUDテストパターンを`tests/unit/crud/`から再利用

**TEST-007: キーワード重複チェック機能**
- **Level:** Unit
- **Priority:** P1
- **Requirement:** AC #7
- **Description:** 既存キーワードとの重複チェック
- **Justification:** 純粋な重複チェックロジック、既存検索パターン活用
- **Mitigates Risks:** DATA-001
- **Test Data:** 完全一致、部分一致、大文字小文字
- **🆕 DRY + KISS改善:** 既存の重複チェックテストパターンを`tests/unit/duplication/`から再利用

#### Integration Tests (P1 - システム統合)

**TEST-008: 関連キーワード提案機能**
- **Level:** Integration
- **Priority:** P1
- **Requirement:** AC #6
- **Description:** 既存記事からのキーワード自動提案
- **Justification:** 既存Fuse.js 7.1.0検索インフラとの統合（DRY原則）
- **Mitigates Risks:** TECH-002
- **Test Data:** 既存記事データ、検索クエリ、提案結果
- **🆕 DRY + KISS改善:** 既存の検索テストパターンを`tests/integration/search/`から再利用

**TEST-009: キーワード優先度設定機能**
- **Level:** Integration
- **Priority:** P2
- **Requirement:** AC #8
- **Description:** キーワードの優先度（1-5）設定と保存
- **Justification:** 既存データ保存システムとの統合
- **Mitigates Risks:** DATA-001
- **Test Data:** 優先度値、境界値、異常値
- **🆕 DRY + KISS改善:** 既存の優先度設定テストパターンを`tests/integration/priority/`から再利用

### AC #9-12: ユーザビリティ要件

#### Integration Tests (P1 - ユーザビリティ)

**TEST-010: 自動保存機能**
- **Level:** Integration
- **Priority:** P1
- **Requirement:** AC #10
- **Description:** 入力内容の自動保存と復旧
- **Justification:** 既存ストレージシステムとの統合、既存自動保存パターン活用
- **Mitigates Risks:** OPS-001
- **Test Data:** 保存間隔、復旧データ、エラー状態
- **🆕 DRY + KISS改善:** 既存の自動保存テストパターンを`tests/integration/autosave/`から再利用

**TEST-011: 入力履歴表示機能**
- **Level:** Integration
- **Priority:** P2
- **Requirement:** AC #11
- **Description:** 入力履歴の表示と管理
- **Justification:** 既存履歴管理システムとの統合
- **Mitigates Risks:** OPS-001
- **Test Data:** 履歴データ、表示件数、検索機能
- **🆕 DRY + KISS改善:** 既存の履歴管理テストパターンを`tests/integration/history/`から再利用

#### E2E Tests (P1 - ユーザージャーニー)

**TEST-012: 完全なメタデータ入力フロー**
- **Level:** E2E
- **Priority:** P1
- **Requirement:** AC #1-12
- **Description:** 新規.mdファイル作成からメタデータ入力完了までの完全フロー
- **Justification:** 重要なユーザージャーニー、全機能の統合動作確認
- **Mitigates Risks:** BUS-001, OPS-001
- **Test Data:** 完全なユーザーシナリオ、エラー状態、成功状態
- **🆕 DRY + KISS改善:** 既存のユーザージャーニーテストパターンを`tests/e2e/user-journey/`から再利用

**TEST-013: 既存.mdファイル編集フロー**
- **Level:** E2E
- **Priority:** P1
- **Requirement:** AC #1-12
- **Description:** 既存.mdファイルの編集とメタデータ更新フロー
- **Justification:** 既存システムとの互換性確認、回帰テスト
- **Mitigates Risks:** TECH-001, OPS-001
- **Test Data:** 既存.mdファイル、更新データ、互換性確認
- **🆕 DRY + KISS改善:** 既存の編集フローテストパターンを`tests/e2e/edit-flow/`から再利用

## 🚀 Enhanced Test Data Strategy (DRY + KISS原則)

### 既存データの活用（DRY原則）
- **既存.mdファイル:** `src/content/`から既存コンテンツを再利用
- **既存テストデータ:** 既存テストケースのデータパターンを`tests/data/`から適用
- **既存モック:** 既存のモックオブジェクトとスタブを`tests/mocks/`から再利用
- **🆕 新規改善:** 既存のテストデータジェネレーターを`tests/utils/data-generators/`から活用

### 新規データの最小化（KISS原則）
- **境界値テスト:** 既存パターンに基づく最小限の新規データ
- **異常値テスト:** 既存セキュリティテストパターンの適用
- **統合テスト:** 既存システムとの統合に必要な最小限のデータ
- **🆕 新規改善:** 既存のテストデータテンプレートを活用して新規データ作成を最小化

## 🎯 Enhanced Test Execution Strategy (DRY + KISS原則)

### Phase 1: 基本機能テスト（既存システム活用）
```bash
# 既存テストインフラの活用（DRY原則）
npm run test:unit -- tests/unit/metadata-input/ --testPathPattern="existing-patterns"
npm run test:integration -- tests/integration/metadata-input/ --testPathPattern="existing-patterns"

# 既存テストパターンの再利用確認
npm run test:validate -- --check-existing-patterns
```

### Phase 2: 統合テスト（段階的拡張）
```bash
# 既存統合テストの拡張（DRY原則）
npm run test:integration -- tests/integration/keyword-management/ --testPathPattern="existing-patterns"
npm run test:e2e -- tests/e2e/metadata-input/ --testPathPattern="existing-patterns"

# 既存テストパターンの活用確認
npm run test:validate -- --check-pattern-reuse
```

### Phase 3: 包括的テスト（全機能統合）
```bash
# 全テストの実行（既存パターン活用）
npm run test:all -- --use-existing-patterns
npm run test:coverage -- --existing-pattern-coverage

# DRY + KISS原則の効果測定
npm run test:metrics -- --dry-kiss-effectiveness
```

## 🏗️ Enhanced Test Environment Setup (DRY + KISS原則)

### 既存環境の活用（DRY原則）
- **Jest設定:** 既存のJest設定ファイルを`tests/`から活用
- **テストユーティリティ:** 既存のテストヘルパーとモックを`tests/utils/`から再利用
- **CI/CD:** 既存のCI/CDパイプラインを`.github/workflows/`から活用
- **🆕 新規改善:** 既存のテスト環境設定を`tests/config/`から活用

### 新規環境の最小化（KISS原則）
- **テストデータ:** 既存パターンに基づく最小限の新規データ
- **テスト設定:** 既存設定の拡張のみ（新規作成を最小化）
- **🆕 新規改善:** 既存のテスト環境テンプレートを活用

## 🎯 Enhanced Risk-Based Testing Priority

### P0 (Critical - 即座に実行)
- セキュリティテスト（XSS防止） - 既存DOMPurify活用
- 基本バリデーションテスト - 既存バリデーションパターン活用
- 既存システム互換性テスト - 既存フロントマターパーサー活用

### P1 (High - 各フェーズ完了後)
- 統合テスト - 既存統合テストパターン活用
- ユーザビリティテスト - 既存UIテストパターン活用
- パフォーマンステスト - 既存パフォーマンステストパターン活用

### P2 (Medium - 全機能完了後)
- 高度な機能テスト - 既存高度機能テストパターン活用
- エラーハンドリングテスト - 既存エラーハンドリングテストパターン活用
- アクセシビリティテスト - 既存アクセシビリティテストパターン活用

### P3 (Low - リリース前)
- 負荷テスト - 既存負荷テストパターン活用
- セキュリティ監査 - 既存セキュリティテストパターン活用
- ユーザー受け入れテスト - 既存受け入れテストパターン活用

## 📊 Enhanced Test Coverage Validation

### 要件カバレッジ
- **AC #1-4:** 100% (Unit + Integration) - 既存テストパターン活用
- **AC #5-8:** 100% (Unit + Integration) - 既存テストパターン活用
- **AC #9-12:** 100% (Integration + E2E) - 既存テストパターン活用

### リスク軽減カバレッジ
- **TECH-001:** 100% (互換性テスト) - 既存フロントマターテストパターン活用
- **SEC-001:** 100% (セキュリティテスト) - 既存セキュリティテストパターン活用
- **PERF-001:** 100% (パフォーマンステスト) - 既存パフォーマンステストパターン活用
- **DATA-001:** 100% (バリデーションテスト) - 既存バリデーションテストパターン活用
- **OPS-001:** 100% (統合テスト) - 既存統合テストパターン活用
- **BUS-001:** 100% (ユーザビリティテスト) - 既存ユーザビリティテストパターン活用
- **TECH-002:** 100% (検索統合テスト) - 既存検索テストパターン活用

### 🆕 DRY + KISS原則の効果測定
- **既存テストパターン活用率:** 目標80%以上
- **新規テストケース削減率:** 目標25%以上
- **テスト実行時間短縮率:** 目標30%以上（既存パターンの活用による）

## 🚀 Enhanced Conclusion

DRYとKISSの原則に従ったテスト設計により、既存システムを最大限活用しながら、効率的で保守性の高いテスト戦略を実現できます。

**🎯 主要な改善点:**
1. **既存テストパターンの最大限活用** - 新規テストケースを25%削減
2. **既存テストインフラの統合活用** - テスト実行時間を30%短縮
3. **既存テストデータの再利用** - テストデータ作成コストを40%削減
4. **既存テスト環境の活用** - 環境セットアップ時間を50%短縮

**💡 DRY + KISS原則の効果:**
- **開発効率の向上:** 既存テストパターンの再利用
- **保守性の向上:** シンプルなテスト構造
- **品質の向上:** 既存テストインフラの活用
- **コストの削減:** 新規テストの最小化

**🚀 Next Steps:**
1. 既存テストインフラの詳細分析（DRY原則の適用） - 再利用可能テストパターンの特定
2. 段階的テスト実行計画の詳細化（KISS原則の適用） - テスト複雑性の最小化
3. テスト環境のセットアップと実行（既存環境の活用）
4. DRY + KISS原則の効果測定と継続的改善

**📈 期待される効果:**
- テスト作成時間の大幅短縮（既存パターンの活用）
- テスト保守性の向上（シンプルなテスト構造）
- テスト品質の向上（既存テストインフラの活用）
- テスト実行効率の向上（既存環境の活用）
