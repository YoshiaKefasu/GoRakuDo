<!-- Powered by BMAD™ Core -->

# Epic: レガシー型定義システム完全統合

## Epic Goal

新人開発者がGoRakuDoプロジェクトの古い型定義システムを新しい統合システムに完全移行できるよう、包括的な学習ガイドと実践的な統合ワークフローを提供する。DRY・KISS原則に基づくコード品質向上と保守性改善を実現する。

## Epic Description

### Existing System Context

- **Current relevant functionality**: GoRakuDoプロジェクトには5つの独立した古い型定義ファイルが存在し、コード重複率45%の問題を抱えている
- **Technology stack**: TypeScript 5.0以上、Node.js 18.0以上、VS Code開発環境
- **Integration points**: 新しい統合型定義システム(`src/types/new-seo-system/`)との完全統合

### Enhancement Details

- **What's being added/changed**: 5つの古い型定義ファイルの完全統合と新人開発者向け学習ガイドの作成
- **How it integrates**: 新システムの型定義を直接使用し、古いファイルの段階的削除
- **Success criteria**:
  - コード重複率を45%から15%以下に削減（67%改善）
  - 5つの独立システムを1つの統合システムに統一
  - 保守工数を50%削減
  - 開発効率を29%向上（70%→90%）

## Stories

1. **Story 1.1: 基礎知識習得** - DRY・KISS原則の理解と型定義システムの基本概念学習（3日間）
2. **Story 1.2: 統合計画立案** - 統合の必要性分析と詳細な移行計画の作成（1-2日間）
3. **Story 1.3A: 高優先度ファイル統合実装** - 基盤ファイル（base-integration.ts, fallback-system.ts）の統合（2日間）
4. **Story 1.3B: 中優先度ファイル統合実装** - メタデータ・最適化ファイル（metadata-input.ts, advanced-optimization.ts）の統合（3日間）
5. **Story 1.3C: 低優先度ファイル統合実装** - SEO関連ファイル（seo.ts）の統合（2日間）
6. **Story 1.4: 品質保証とテスト** - 統合後の動作確認とパフォーマンス検証（約4日間）

## Compatibility Requirements

- [x] Existing APIs remain unchanged（既存APIの互換性維持）
- [x] Database schema changes are backward compatible（データベース変更は後方互換）
- [x] UI changes follow existing patterns（UI変更は既存パターンに従う）
- [x] Performance impact is minimal（パフォーマンス影響は最小限）

## Risk Mitigation

- **Primary Risk**: 統合中の型エラーによる既存機能の破綻
- **Mitigation**: 各段階でTypeScript strictモードでの検証、段階的コミット、バックアップ保持
- **Rollback Plan**: git checkoutで前のコミットに戻し、バックアップファイルからの復元

## Definition of Done

- [ ] All stories completed with acceptance criteria met
- [ ] Existing functionality verified through testing
- [ ] Integration points working correctly
- [ ] Documentation updated appropriately
- [ ] No regression in existing features
- [ ] Code follows DRY・KISS principles
- [ ] TypeScript strict mode passes without errors
- [ ] Performance meets or exceeds current levels

## Technical Context

### Integration Points
- `src/types/base-integration.ts` → `new-seo-system/integration-types.ts`
- `src/types/fallback-system.ts` → `new-seo-system/validation-types.ts`
- `src/types/metadata-input.ts` → `new-seo-system/validation-types.ts`
- `src/types/advanced-optimization.ts` → `new-seo-system/validation-types.ts`
- `src/types/seo.ts` → `new-seo-system/component-props.ts`

### Existing Patterns
- 新システムの型定義パターンに準拠
- DRY・KISS原則の厳格適用
- 段階的移行によるリスク低減

### Quality Standards
- TypeScript strictモード: エラー0件、警告0件
- ビルド成功率: 100%
- テストカバレッジ: 95%以上
- パフォーマンス: 既存システム同等以上

## Detailed Integration Mapping

### Phase 1: 高優先度ファイル統合（最優先）
1. **base-integration.ts** → integration-types.ts
   - 統合される型: SEOIntegrationConfig, FallbackIntegrationConfig, DataFlowConfig
   - 方法: レガシー型削除、新システム型直接使用

2. **fallback-system.ts** → validation-types.ts
   - 統合される型: ValidationResult, ValidationError, ValidationWarning
   - 方法: ファイル削除、新システムからの再エクスポート利用

### Phase 2: 中優先度ファイル統合（2-3番目）
3. **metadata-input.ts** → validation-types.ts
   - 統合される型: MetadataInput, ValidationRule, ValidationResult
   - 方法: 再エクスポート削除、独自型移動

4. **advanced-optimization.ts** → validation-types.ts
   - 統合される型: QualityGateConfig, TestCleanupConfig
   - 方法: 再エクスポート削除、独自型移動

### Phase 3: 低優先度ファイル統合（最後）
5. **seo.ts** → component-props.ts
   - 統合される型: BaseSEOProps, HeadSEOProps, BasicSEOProps
   - 方法: 再エクスポート削除、独自型移動

## Success Metrics

### Quantitative Goals
- **コード重複率**: 45% → 15%以下（67%削減）
- **型定義ファイル数**: 6つの独立システム → 1つの統合システム
- **保守工数**: 現在の2倍 → 50%削減
- **開発効率**: 70% → 90%以上（29%向上）

### Quality Goals
- **TypeScript strictモード**: エラー0件、警告0件
- **ビルド成功率**: 100%
- **テストカバレッジ**: 95%以上
- **パフォーマンス**: 既存システム同等以上

## Learning Objectives

### Technical Skills
- DRY・KISS原則の実践的理解
- 大規模プロジェクトでの型管理手法
- 段階的移行戦略の実践

### Practical Experience
- 実際のプロジェクトでの統合作業
- リスク管理とロールバック手順
- 品質保証プロセスの体験

---

**Story Manager Handoff:**

"このbrownfield epicの詳細なユーザーストーリーを開発してください。重要な考慮事項:

- これはTypeScript 5.0以上、Node.js 18.0以上の既存システムへの拡張
- 統合ポイント: 5つの古い型定義ファイルから新しい統合システムへの移行
- 既存パターン: DRY・KISS原則、段階的統合、型安全性確保
- 重要な互換性要件: 既存機能の完全維持、API互換性、性能維持
- 各ストーリーは既存機能の完全性を検証するものとする

このepicはシステムの完全性を維持しながら、レガシー型定義システムの完全統合を実現するものとする。"

---

**作成日**: 2024-12-31
**最終更新**: 2024-12-31
**見積り期間**: 約2週間
**リスクレベル**: 中（段階的実装によるリスク低減）
**技術的複雑さ**: 中（TypeScript型定義の専門知識が必要）
**対象**: 新人開発者（TypeScript経験1年未満）
**難易度**: 初級〜中級
**予想学習時間**: 約2週間
**最終目標**: 5つの型定義ファイルの完全統合完了
