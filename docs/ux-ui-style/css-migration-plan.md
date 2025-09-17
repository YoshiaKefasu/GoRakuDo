# CSS移行計画: tools-index.css統合

## 概要
`tools-index.css`と`global.css`の競合を解消し、統一されたデザインシステムを構築するための段階的移行計画です。

## 移行戦略

### 基本方針
1. **既存スタイルの保護**: 既存の見た目を壊さない
2. **段階的実行**: リスクを最小化した段階的アプローチ
3. **テスト駆動**: 各段階で十分なテストを実施
4. **ロールバック可能**: 問題発生時の迅速な復旧

## Phase 1: 緊急競合解消 (即座実行)

### 1.1 変数名の競合解消
**目標**: CSS変数の重複定義を解消

#### 実行内容
```css
/* tools-index.css内の変数名を変更 */
:root {
  /* 変更前 */
  --clr-accent: #8b5cf6;
  --clr-accent-dark: #7b4def;
  --clr-accent-glow-faint: rgba(139, 92, 246, 0.05);
  --clr-accent-glow-medium: rgba(139, 92, 246, 0.35);
  --clr-accent-glow-strong: rgba(139, 92, 246, 0.7);
  --clr-text-primary: #e5e5e5;
  --clr-text-secondary: #a3a3a3;
  --clr-text-muted: #b0b0b0;
  --clr-bg: #111111;

  /* 変更後 */
  --tools-clr-accent: #8b5cf6;
  --tools-clr-accent-dark: #7b4def;
  --tools-clr-accent-glow-faint: rgba(139, 92, 246, 0.05);
  --tools-clr-accent-glow-medium: rgba(139, 92, 246, 0.35);
  --tools-clr-accent-glow-strong: rgba(139, 92, 246, 0.7);
  --tools-clr-text-primary: #e5e5e5;
  --tools-clr-text-secondary: #a3a3a3;
  --tools-clr-text-muted: #b0b0b0;
  --tools-clr-bg: #111111;
}
```

#### 使用箇所の更新
```css
/* 全ての使用箇所を更新 */
.tool-card {
  background: var(--tools-clr-accent-glow-faint);
  border: 1px solid var(--tools-clr-accent-glow-medium);
  /* ... */
}
```

### 1.2 フォールバック値の追加
**目標**: 既存スタイルの保護

```css
/* グローバル変数をフォールバックとして使用 */
.tool-card {
  background: var(--tools-clr-accent-glow-faint, var(--clr-accent-glow-faint));
  border: 1px solid var(--tools-clr-accent-glow-medium, var(--clr-accent-glow-medium));
  /* ... */
}
```

### 1.3 テスト項目
- [ ] ツールページの表示確認
- [ ] 他のページへの影響なし
- [ ] レスポンシブデザインの確認

## Phase 2: デザインシステム統一 (1週間後)

### 2.1 色空間の統一
**目標**: OKLCH色空間への統一

#### 実行内容
```css
/* tools-index.cssの色をOKLCHに変換 */
:root {
  --tools-clr-accent: oklch(0.65 0.25 280);
  --tools-clr-accent-dark: oklch(0.6 0.25 280);
  --tools-clr-accent-glow-faint: oklch(0.65 0.25 280 / 0.05);
  --tools-clr-accent-glow-medium: oklch(0.65 0.25 280 / 0.1);
  --tools-clr-accent-glow-strong: oklch(0.65 0.25 280 / 0.2);
  --tools-clr-text-primary: oklch(0.9 0 0);
  --tools-clr-text-secondary: oklch(0.65 0 0);
  --tools-clr-text-muted: oklch(0.7 0 0);
  --tools-clr-bg: oklch(0.07 0 0);
}
```

### 2.2 スペーシングシステムの統一
**目標**: global.cssのスペーシングシステムを使用

```css
/* global.cssのスペーシング変数を参照 */
:root {
  --tools-spacing-1: var(--spacing-xs);
  --tools-spacing-2: var(--spacing-sm);
  --tools-spacing-3: var(--spacing-md);
  --tools-spacing-4: var(--spacing-lg);
  --tools-spacing-6: var(--spacing-xl);
  --tools-spacing-8: var(--spacing-2xl);
  --tools-spacing-12: var(--spacing-3xl);
  --tools-spacing-16: var(--spacing-4xl);
}
```

### 2.3 テスト項目
- [ ] 色の一貫性確認
- [ ] スペーシングの統一確認
- [ ] パフォーマンステスト

## Phase 3: 完全統合 (2週間後)

### 3.1 変数の完全統合
**目標**: 独自変数の削除とグローバル変数の直接使用

#### 実行内容
```css
/* tools-index.cssから独自変数を削除 */
/* グローバル変数を直接使用 */
.tool-card {
  background: var(--clr-accent-glow-faint);
  border: 1px solid var(--clr-accent-glow-medium);
  /* ... */
}
```

### 3.2 不要コードの削除
**目標**: コードの最適化

- 重複するアニメーション定義の削除
- 未使用のユーティリティクラスの削除
- コメントの整理

### 3.3 テスト項目
- [ ] 全ページの表示確認
- [ ] パフォーマンステスト
- [ ] アクセシビリティテスト

## 実行スケジュール

### Week 1: Phase 1実行
- **Day 1-2**: 変数名変更の実装
- **Day 3-4**: テストとデバッグ
- **Day 5**: 本番環境へのデプロイ

### Week 2: Phase 2実行
- **Day 1-2**: 色空間統一の実装
- **Day 3-4**: スペーシング統一の実装
- **Day 5**: テストとデバッグ

### Week 3: Phase 3実行
- **Day 1-2**: 完全統合の実装
- **Day 3-4**: 最適化とクリーンアップ
- **Day 5**: 最終テストとデプロイ

## リスク管理

### 4.1 ロールバック計画
```bash
# Gitを使用したロールバック
git tag css-migration-phase1
git tag css-migration-phase2
git tag css-migration-phase3

# 問題発生時のロールバック
git checkout css-migration-phase1
```

### 4.2 監視項目
- **視覚的回帰**: スクリーンショット比較
- **パフォーマンス**: Core Web Vitals
- **エラー率**: コンソールエラーの監視

### 4.3 緊急時対応
1. **即座のロールバック**: 問題発生時の迅速な復旧
2. **部分的な修正**: 問題箇所のみの修正
3. **段階的な復旧**: 段階を戻しての再実行

## 成功指標

### 5.1 技術指標
- [ ] CSS変数の競合解消: 0件
- [ ] パフォーマンス向上: 10%以上
- [ ] コードサイズ削減: 15%以上

### 5.2 品質指標
- [ ] 視覚的回帰: 0件
- [ ] アクセシビリティスコア: 維持以上
- [ ] クロスブラウザ互換性: 100%

### 5.3 メンテナンス性指標
- [ ] デザインシステムの統一: 100%
- [ ] ドキュメント化: 完了
- [ ] テストカバレッジ: 90%以上

## 次のアクション

### 即座に実行
1. **Phase 1の実装開始**: 変数名の競合解消
2. **テスト環境の準備**: 視覚的回帰テストの設定
3. **監視体制の構築**: パフォーマンス監視の設定

### 1週間以内
1. **Phase 2の準備**: 色空間変換の準備
2. **チーム内レビュー**: 変更内容の確認
3. **ステークホルダーへの報告**: 進捗状況の共有

---

**作成日**: 2024年12月19日  
**作成者**: Sally (UX Expert)  
**承認者**: 要確認  
**次回更新**: Phase 1完了後
