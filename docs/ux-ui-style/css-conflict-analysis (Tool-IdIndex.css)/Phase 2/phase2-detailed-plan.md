# Phase 2 詳細実装計画書

## 概要
Phase 1完了を受けて、色変数とフォントサイズの統一を実行するPhase 2の詳細計画です。

## Phase 1完了状況の確認
- [x] 変数の名前空間化完了
- [x] スペーシング変数の循環参照修正完了
- [x] 競合の即座解決完了
- [x] 既存スタイルの保護完了

## Phase 2: 段階的統一（1週間後）

### 2.1 色変数の統一

#### 目的
- ブランド一貫性の向上
- 視覚的な統一感の実現
- デザインシステムの統合

#### 実行内容

**Step 1: 色変数のマッピング確認**
```css
/* 現在の tool-index.css の色変数 */
--tool-color-primary: oklch(65% 0.18 280);
--tool-color-primary-hover: oklch(70% 0.18 280);
--tool-color-secondary: oklch(75% 0.12 65);
--tool-color-bg-card: oklch(8% 0.01 270 / 0.5);
--tool-color-bg-card-hover: oklch(8% 0.01 270 / 0.7);
--tool-color-text-primary: oklch(95% 0.01 270);
--tool-color-text-secondary: oklch(75% 0.01 270);
--tool-color-text-muted: oklch(70% 0.01 270);
--tool-color-text-light: oklch(60% 0.01 270);
--tool-color-border: oklch(25% 0.02 270 / 0.1);
--tool-color-border-hover: oklch(25% 0.02 270 / 0.3);

/* global.css の対応する色変数 */
--color-primary: oklch(0.65 0.25 280);
--color-text-primary: oklch(1 0 0);
--color-text-secondary: oklch(0.8 0 0);
--color-text-muted: oklch(0.67 0 0);
--color-border: oklch(25% 0.015 270);
```

**Step 2: 色変数の段階的統一**
```css
/* Phase 2.1: 基本色の統一 */
:root {
  /* プライマリカラーの統一 */
  --tool-color-primary: var(--color-primary);
  --tool-color-primary-hover: var(--color-primary-dark);
  
  /* テキストカラーの統一 */
  --tool-color-text-primary: var(--color-text-primary);
  --tool-color-text-secondary: var(--color-text-secondary);
  --tool-color-text-muted: var(--color-text-muted);
  
  /* ボーダーカラーの統一 */
  --tool-color-border: var(--color-border);
  --tool-color-border-hover: var(--color-border-hover);
  
  /* ツール専用色（段階的に統一予定） */
  --tool-color-secondary: oklch(75% 0.12 65);
  --tool-color-bg-card: oklch(8% 0.01 270 / 0.5);
  --tool-color-bg-card-hover: oklch(8% 0.01 270 / 0.7);
  --tool-color-text-light: oklch(60% 0.01 270);
}
```

#### リスク評価
- **リスクレベル**: 中
- **影響範囲**: ツールページの色合い
- **視覚的影響**: プライマリカラーとテキストカラーの微妙な変化
- **ブランド影響**: ブランドガイドラインとの整合性向上

#### テスト計画
1. **ビジュアルテスト**: ツールページの表示確認
2. **ブランドテスト**: ブランドガイドラインとの整合性確認
3. **アクセシビリティテスト**: コントラスト比の確認
4. **レスポンシブテスト**: 各ブレークポイントでの表示確認

### 2.2 フォントサイズの統一

#### 目的
- タイポグラフィの一貫性向上
- 可読性の最適化
- デザインシステムの統合

#### 実行内容

**Step 1: フォントサイズのマッピング確認**
```css
/* 現在の tool-index.css のフォントサイズ */
--tool-font-size-xs: 0.625rem;    /* 10px */
--tool-font-size-sm: 0.75rem;     /* 12px */
--tool-font-size-base: 0.875rem;  /* 14px */
--tool-font-size-lg: 1rem;        /* 16px */
--tool-font-size-xl: 1.125rem;    /* 18px */
--tool-font-size-2xl: 1.25rem;    /* 20px */
--tool-font-size-3xl: 1.5rem;     /* 24px */
--tool-font-size-4xl: 2rem;       /* 32px */

/* global.css の対応するフォントサイズ */
--font-size-xs: 0.75rem;          /* 12px */
--font-size-sm: 0.875rem;         /* 14px */
--font-size-base: 1rem;           /* 16px */
--font-size-lg: 1.125rem;         /* 18px */
--font-size-xl: 1.25rem;          /* 20px */
--font-size-2xl: 1.5rem;          /* 24px */
--font-size-3xl: 1.875rem;        /* 30px */
--font-size-4xl: 2.25rem;         /* 36px */
```

**Step 2: フォントサイズの段階的統一**
```css
/* Phase 2.2: フォントサイズの統一 */
:root {
  --tool-font-size-xs: var(--font-size-xs);
  --tool-font-size-sm: var(--font-size-sm);
  --tool-font-size-base: var(--font-size-base);
  --tool-font-size-lg: var(--font-size-lg);
  --tool-font-size-xl: var(--font-size-xl);
  --tool-font-size-2xl: var(--font-size-2xl);
  --tool-font-size-3xl: var(--font-size-3xl);
  --tool-font-size-4xl: var(--font-size-4xl);
}
```

#### リスク評価
- **リスクレベル**: 中
- **影響範囲**: ツールページのタイポグラフィ
- **視覚的影響**: フォントサイズの微調整
- **レイアウト影響**: テキストの配置とスペーシングの調整が必要な可能性

#### テスト計画
1. **可読性テスト**: 各フォントサイズでの可読性確認
2. **レスポンシブテスト**: 各ブレークポイントでの表示確認
3. **レイアウトテスト**: テキストの配置とスペーシングの確認
4. **アクセシビリティテスト**: 視覚障害者向けの可読性確認

## Phase 2 実行スケジュール

### 実行日時
- **開始予定**: 2025年9月24日（Phase 1完了から1週間後）
- **完了予定**: 2025年9月24日（同日中）

### 作業時間
- **色変数統一**: 2時間
- **フォントサイズ統一**: 1時間
- **テスト**: 1時間
- **合計**: 4時間

### 実行順序
1. **Step 1**: 色変数の統一（2時間）
2. **Step 2**: フォントサイズの統一（1時間）
3. **Step 3**: 統合テスト（1時間）

## 詳細テスト計画

### 2.1 色変数統一後のテスト

#### ビジュアルテスト
- [ ] ツールページの表示確認
- [ ] プライマリカラーの統一確認
- [ ] テキストカラーの統一確認
- [ ] ボーダーカラーの統一確認

#### ブランドテスト
- [ ] ブランドガイドラインとの整合性確認
- [ ] カラーパレットの一貫性確認
- [ ] アクセシビリティガイドラインの遵守確認

#### レスポンシブテスト
- [ ] モバイル（320px+）での表示確認
- [ ] タブレット（768px+）での表示確認
- [ ] デスクトップ（1280px+）での表示確認

### 2.2 フォントサイズ統一後のテスト

#### 可読性テスト
- [ ] 各フォントサイズでの可読性確認
- [ ] 行間の適切性確認
- [ ] 文字間隔の適切性確認

#### レイアウトテスト
- [ ] テキストの配置確認
- [ ] スペーシングの適切性確認
- [ ] コンテナサイズの適切性確認

#### アクセシビリティテスト
- [ ] 視覚障害者向けの可読性確認
- [ ] コントラスト比の確認
- [ ] フォントサイズの適切性確認

## ロールバック計画

### 色変数統一のロールバック
```css
/* ロールバック用の元の値 */
--tool-color-primary: oklch(65% 0.18 280);
--tool-color-primary-hover: oklch(70% 0.18 280);
--tool-color-text-primary: oklch(95% 0.01 270);
--tool-color-text-secondary: oklch(75% 0.01 270);
--tool-color-text-muted: oklch(70% 0.01 270);
--tool-color-border: oklch(25% 0.02 270 / 0.1);
--tool-color-border-hover: oklch(25% 0.02 270 / 0.3);
```

### フォントサイズ統一のロールバック
```css
/* ロールバック用の元の値 */
--tool-font-size-xs: 0.625rem;
--tool-font-size-sm: 0.75rem;
--tool-font-size-base: 0.875rem;
--tool-font-size-lg: 1rem;
--tool-font-size-xl: 1.125rem;
--tool-font-size-2xl: 1.25rem;
--tool-font-size-3xl: 1.5rem;
--tool-font-size-4xl: 2rem;
```

## 成功指標

### Phase 2完了時の期待される結果
- [ ] 色の一貫性が向上している
- [ ] タイポグラフィが統一されている
- [ ] ブランドガイドラインに準拠している
- [ ] 視覚的な統一感が実現されている
- [ ] アクセシビリティが向上している

### 品質指標
- **ビジュアル一貫性**: 95%以上
- **ブランド準拠率**: 100%
- **アクセシビリティスコア**: WCAG 2.1 AA準拠
- **レスポンシブ対応**: 全ブレークポイントで正常表示

## 注意事項

### 実行時の注意点
1. **段階的実行**: 色変数とフォントサイズを別々に実行
2. **テスト重視**: 各変更後に即座にテストを実施
3. **ロールバック準備**: 問題が発生した場合の対応を準備
4. **ドキュメント更新**: 変更内容を適切に記録

### リスク軽減策
1. **バックアップ**: 実行前にバックアップを作成
2. **段階的検証**: 各変更後にビジュアルテストを実施
3. **即座ロールバック**: 問題が発生した場合の即座対応
4. **詳細記録**: 全ての変更内容を記録

---

**作成者**: Sally (UX Expert)  
**作成日**: 2025年9月17日  
**承認者**: -  
**次回レビュー**: Phase 2実行前
