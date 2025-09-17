# Phase 1 実装計画 - CSS競合修正

**作成日**: 2024年12月19日  
**実装者**: Winston (Architect)  
**対象ファイル**: `src/styles/global.css`  
**予定時間**: 90分

## Phase 1 目標
高優先度・低リスクの競合を修正し、既存スタイルを壊すことなくCSS変数の重複を解決する。

## 実装ステップ

### Step 1: グロウ効果変数の重複修正 (15分)

#### 1.1 現在の状況
```css
/* 行37-39: レガシーシステム */
--color-accent-purple-glow-faint: oklch(0.65 0.25 280 / 0.05);
--color-accent-purple-glow-medium: oklch(0.65 0.25 280 / 0.25);
--color-accent-purple-glow-strong: oklch(0.65 0.25 280 / 0.5);

/* 行41-43: 重複定義（上書きされる） */
--color-accent-glow-faint: oklch(0.65 0.25 280 / 0.05);
--color-accent-glow-medium: oklch(0.65 0.25 280 / 0.1);
--color-accent-glow-strong: oklch(0.65 0.25 280 / 0.2);
```

#### 1.2 修正方針
- 重複する変数定義を削除
- 一貫した値を保持
- コメントで修正理由を明記

#### 1.3 実装内容
```css
/* 修正後 */
--color-accent-purple-glow-faint: oklch(0.65 0.25 280 / 0.05);
--color-accent-purple-glow-medium: oklch(0.65 0.25 280 / 0.25);
--color-accent-purple-glow-strong: oklch(0.65 0.25 280 / 0.5);
/* Unified glow effects - using consistent values */
--color-accent-glow-faint: oklch(0.65 0.25 280 / 0.05);
--color-accent-glow-medium: oklch(0.65 0.25 280 / 0.1);
--color-accent-glow-strong: oklch(0.65 0.25 280 / 0.2);
--color-accent-shadow: oklch(0.65 0.25 280 / 0.4);
```

### Step 2: フォント変数の重複修正 (30分)

#### 2.1 現在の状況
```css
/* 行62: 最初の定義 */
--font-primary: 'Inter', sans-serif;

/* 行68-70: 中間定義（使用されない） */
--font-family-base: 'Inter', 'Noto Sans JP', ...;

/* 行73-75: 最終定義（実際に使用される） */
--font-primary: 'Inter', system-ui, ...;
```

#### 2.2 修正方針
- 重複する定義を削除
- 最も完全な定義を保持
- フォールバックを最適化

#### 2.3 実装内容
```css
/* 修正後 */
/* ===== TYPOGRAPHY SYSTEM ===== */
--font-primary: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-serif: 'Lora', 'Times New Roman', Times, serif;
--font-jp: 'Yuji Syuku', 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', serif;
--font-cursive: 'Cedarville Cursive', cursive;

/* Legacy compatibility - kept for backward compatibility */
--font-family-base: 'Inter', 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Step 3: プライマリカラー変数の統合 (30分)

#### 3.1 現在の状況
```css
/* 行10: 新システム */
--clr-accent: oklch(0.65 0.25 280);

/* 行28: レガシーシステム */
--color-accent-purple: oklch(0.65 0.25 280);

/* 行530-532: Tailwindテーマ */
--color-accent: oklch(65% 0.18 280);
```

#### 3.2 修正方針
- `--clr-accent`を標準として確立
- レガシー変数をエイリアス化
- 一貫した値を保持

#### 3.3 実装内容
```css
/* 修正後 */
/* ===== PRIMARY COLOR SYSTEM - OKLCH Color Space ===== */
--clr-accent: oklch(0.65 0.25 280);
--clr-accent-dark: oklch(0.6 0.25 280);

/* ===== LEGACY COLOR MAPPING - COMPATIBILITY LAYER ===== */
/* Legacy variables now reference the primary system */
--color-accent-purple: var(--clr-accent);
--color-accent-dark: var(--clr-accent-dark);

/* ===== TAILWIND V4.1 THEME TOKENS ===== */
--color-primary: var(--clr-accent);
--color-accent: var(--clr-accent);
```

### Step 4: テキストカラー変数の統合 (15分)

#### 4.1 現在の状況
```css
/* 行7: 新システム */
--clr-text-primary: oklch(1 0 0);

/* 行27: レガシーシステム */
--color-text-primary: oklch(1 0 0);

/* 行502: Tailwindテーマ */
--color-foreground: oklch(98% 0.002 270);
```

#### 4.2 修正方針
- 一つの標準値を確立
- レガシー変数をエイリアス化
- 一貫性を保つ

#### 4.3 実装内容
```css
/* 修正後 */
/* ===== PRIMARY COLOR SYSTEM ===== */
--clr-text-primary: oklch(1 0 0);
--clr-text-secondary: oklch(0.8 0 0);
--clr-text-muted: oklch(0.67 0 0);

/* ===== LEGACY COLOR MAPPING ===== */
--color-text-primary: var(--clr-text-primary);
--color-text-secondary: var(--clr-text-secondary);
--color-text-muted: var(--clr-text-muted);

/* ===== TAILWIND THEME ===== */
--color-foreground: var(--clr-text-primary);
--color-muted-foreground: var(--clr-text-secondary);
```

## 実装順序

1. **Step 1**: グロウ効果変数の重複修正
2. **Step 2**: フォント変数の重複修正
3. **Step 3**: プライマリカラー変数の統合
4. **Step 4**: テキストカラー変数の統合

## 検証計画

### 各ステップ完了後
1. **構文チェック**: CSS構文エラーの確認
2. **変数参照チェック**: 削除した変数が他で使用されていないか確認
3. **ビジュアルチェック**: 主要ページの表示確認

### Phase 1完了後
1. **全ページ表示確認**: ホームページ、ツールページ、コンテンツページ
2. **コンポーネント確認**: ボタン、カード、ナビゲーション
3. **レスポンシブ確認**: モバイル、タブレット、デスクトップ

## リスク軽減策

### 高リスク項目
- **色変数の変更**: 既存コンポーネントの色が変わる可能性
  - **軽減策**: エイリアス変数を維持し、段階的移行

### 中リスク項目
- **フォント変数の変更**: フォント表示が変わる可能性
  - **軽減策**: フォールバックを維持し、段階的移行

## ロールバック計画

### 問題発生時
1. **即座にロールバック**: 変更前の状態に戻す
2. **問題の特定**: どの変数が原因かを特定
3. **段階的修正**: より小さな単位で修正を再実行

## 期待される効果

- **ファイルサイズ削減**: 約5-10%の削減
- **保守性向上**: 変数定義の一元化
- **一貫性向上**: 色とフォントの統一
- **開発効率向上**: 混乱のない変数体系

## 次のステップ

Phase 1完了後、Phase 2（レイヤー構造の最適化）に進む。

---

**実装開始**: この計画に基づいて段階的に実装を進める
