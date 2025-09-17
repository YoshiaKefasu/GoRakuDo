# Phase 1 実装ガイド: CSS変数の重複削除

## 実装概要

Phase 1では、`tools-index.css`と`global.css`の間で発生している重大な競合を解決します。特に、CSS変数の重複削除とbody要素のスタイル統合に焦点を当てます。

## 実装手順

### ステップ 1: バックアップの作成

```bash
# 現在のファイルをバックアップ
cp src/styles/tools/tools-index.css src/styles/tools/tools-index.css.backup
cp src/styles/global.css src/styles/global.css.backup
```

### ステップ 2: CSS変数の重複削除

#### 2.1 tools-index.cssの修正

**削除対象の変数 (行 5-48)**
```css
/* 削除する変数 */
--clr-bg: #111111;
--clr-text-primary: #e5e5e5;
--clr-text-secondary: #a3a3a3;
--clr-text-muted: #b0b0b0;
--clr-accent: #8b5cf6;
--clr-accent-dark: #7b4def;
--clr-accent-glow-faint: rgba(139, 92, 246, 0.05);
--clr-accent-glow-medium: rgba(139, 92, 246, 0.35);
--clr-accent-glow-strong: rgba(139, 92, 246, 0.7);
```

**修正後の:rootセクション**
```css
:root {
  /* Typography - ツールページ専用 */
  --fs-h1: clamp(2.25rem, 5vw, 3rem);
  --fs-h3: 1.75rem; /* 28px */
  --fs-base: 1rem; /* 16px */
  --fs-sm: 0.875rem; /* 14px */
  --fs-xs: 0.75rem; /* 12px */

  /* Spacing System - ツールページ専用 */
  --spacing-1: 0.25rem; /* 4px */
  --spacing-2: 0.5rem; /* 8px */
  --spacing-3: 0.75rem; /* 12px */
  --spacing-4: 1rem; /* 16px */
  --spacing-6: 1.5rem; /* 24px */
  --spacing-8: 2rem; /* 32px */
  --spacing-12: 3rem; /* 48px */
  --spacing-16: 4rem; /* 64px */
  --section-padding-y: var(--spacing-8);

  /* Borders & Shadows - ツールページ専用 */
  --border-radius-card: 1rem; /* 16px */
  --border-radius-pill: 9999px;
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg-accent: 0 10px 30px rgba(139, 92, 246, 0.2);

  /* Transitions - ツールページ専用 */
  --transition-speed: 200ms;
  --transition-ease: ease-out;
  --animate-duration-normal: 0.4s;
  --animate-duration-fast: 0.2s;
  --animate-duration-slow: 0.6s;
}
```

#### 2.2 変数参照の更新

**変更前**
```css
body {
  background-color: var(--clr-bg);
  color: var(--clr-text-primary);
  font-family: var(--font-family-sans);
}
```

**変更後**
```css
/* body要素のスタイルは削除 - global.cssに委譲 */
```

**その他の変更箇所**
```css
/* 変更前 */
.tool-card {
  background: var(--clr-accent-glow-faint);
  border: 1px solid var(--clr-accent-glow-medium);
  /* ... */
}

/* 変更後 */
.tool-card {
  background: var(--clr-accent-glow-faint);
  border: 1px solid var(--clr-accent-glow-medium);
  /* ... */
}
```

### ステップ 3: body要素のスタイル削除

**削除対象 (行 51-55)**
```css
/* 削除するスタイル */
body {
  background-color: var(--clr-bg);
  color: var(--clr-text-primary);
  font-family: var(--font-family-sans);
}
```

### ステップ 4: フォントファミリーの統一

**変更箇所の検索と置換**
```css
/* 変更前 */
font-family: var(--font-family-sans);

/* 変更後 */
font-family: var(--font-primary);
```

## 実装後の確認事項

### 4.1 視覚的な確認
- [ ] ツールページの表示が正常か
- [ ] カラーテーマが統一されているか
- [ ] フォントが正しく表示されているか

### 4.2 機能的な確認
- [ ] ホバーエフェクトが動作するか
- [ ] アニメーションが正常に動作するか
- [ ] レスポンシブデザインが機能するか

### 4.3 他のページへの影響確認
- [ ] ホームページの表示に問題がないか
- [ ] 記事ページの表示に問題がないか
- [ ] ナビゲーションの表示に問題がないか

## トラブルシューティング

### よくある問題と解決策

#### 問題 1: カラーが正しく表示されない
**原因:** 変数名の不一致
**解決策:** 変数名をglobal.cssのものに統一

#### 問題 2: フォントが変更されない
**原因:** フォント変数の参照が古い
**解決策:** `--font-family-sans`を`--font-primary`に変更

#### 問題 3: アニメーションが動作しない
**原因:** アニメーション変数の参照が古い
**解決策:** 変数名をglobal.cssのものに統一

## ロールバック手順

### 緊急時のロールバック
```bash
# バックアップファイルを復元
cp src/styles/tools/tools-index.css.backup src/styles/tools/tools-index.css
cp src/styles/global.css.backup src/styles/global.css
```

### 部分的なロールバック
1. 問題のある箇所を特定
2. 該当する変更のみを元に戻す
3. 再度テストを実行

## 次のステップ

Phase 1が完了したら、以下のステップに進みます：

1. **Phase 2の準備**
   - アニメーション変数の統一
   - ボーダーラディウスの統一
   - スペーシングシステムの統合

2. **継続的な監視**
   - パフォーマンスの監視
   - ユーザーフィードバックの収集
   - 必要に応じた調整

## 実装チェックリスト

### 事前準備
- [ ] バックアップファイルの作成
- [ ] テスト環境の準備
- [ ] 実装計画の確認

### 実装中
- [ ] CSS変数の重複削除
- [ ] body要素のスタイル削除
- [ ] フォントファミリーの統一
- [ ] 変数参照の更新

### 実装後
- [ ] 視覚的な確認
- [ ] 機能的な確認
- [ ] 他のページへの影響確認
- [ ] パフォーマンスの確認

### 完了後
- [ ] ドキュメントの更新
- [ ] チームへの報告
- [ ] Phase 2の準備

---

**重要:** この実装は段階的に行い、各ステップで必ず動作確認を行ってください。問題が発生した場合は、即座にロールバックを実行してください。
