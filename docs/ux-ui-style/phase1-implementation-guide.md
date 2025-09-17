# Phase 1実装ガイド: CSS変数競合解消

## 概要
`tools-index.css`と`global.css`の変数競合を解消するための具体的な実装手順です。

## 実装前の準備

### 1. バックアップの作成
```bash
# 現在の状態をバックアップ
git add .
git commit -m "Before Phase 1: CSS variable conflict resolution"
git tag css-migration-phase1-backup
```

### 2. テスト環境の確認
- [ ] ローカル開発環境での動作確認
- [ ] ツールページの表示確認
- [ ] 他のページへの影響確認

## Phase 1.1: 変数名の競合解消

### 1.1.1 色変数の変更
**対象ファイル**: `src/styles/tools/tools-index.css`

#### 変更内容
```css
/* 変更前 (5-16行目) */
:root {
  /* Colors (WCAG AA Compliant) */
  --clr-bg: #111111;
  --clr-text-primary: #e5e5e5;
  --clr-text-secondary: #a3a3a3;
  --clr-text-muted: #b0b0b0;
  --clr-accent: #8b5cf6;
  --clr-accent-dark: #7b4def;
  --clr-accent-glow-faint: rgba(139, 92, 246, 0.05);
  --clr-accent-glow-medium: rgba(139, 92, 246, 0.35);
  --clr-accent-glow-strong: rgba(139, 92, 246, 0.7);
}

/* 変更後 */
:root {
  /* Colors (WCAG AA Compliant) - Tools Specific */
  --tools-clr-bg: #111111;
  --tools-clr-text-primary: #e5e5e5;
  --tools-clr-text-secondary: #a3a3a3;
  --tools-clr-text-muted: #b0b0b0;
  --tools-clr-accent: #8b5cf6;
  --tools-clr-accent-dark: #7b4def;
  --tools-clr-accent-glow-faint: rgba(139, 92, 246, 0.05);
  --tools-clr-accent-glow-medium: rgba(139, 92, 246, 0.35);
  --tools-clr-accent-glow-strong: rgba(139, 92, 246, 0.7);
}
```

### 1.1.2 使用箇所の更新
**対象ファイル**: `src/styles/tools/tools-index.css`

#### 更新が必要な箇所
1. **body要素** (52-54行目)
```css
/* 変更前 */
body {
  background-color: var(--clr-bg);
  color: var(--clr-text-primary);
  font-family: var(--font-family-sans);
}

/* 変更後 */
body {
  background-color: var(--tools-clr-bg);
  color: var(--tools-clr-text-primary);
  font-family: var(--font-family-sans);
}
```

2. **ツールカード** (103-105行目)
```css
/* 変更前 */
.tool-card {
  background: var(--clr-accent-glow-faint);
  border: 1px solid var(--clr-accent-glow-medium);
  border-radius: var(--border-radius-card);
}

/* 変更後 */
.tool-card {
  background: var(--tools-clr-accent-glow-faint);
  border: 1px solid var(--tools-clr-accent-glow-medium);
  border-radius: var(--border-radius-card);
}
```

3. **ツールメタ情報** (167-169行目)
```css
/* 変更前 */
.tool-category {
  background-color: #2a2a2e;
  color: var(--clr-text-secondary);
  border: 1px solid #4a4a50;
}

/* 変更後 */
.tool-category {
  background-color: #2a2a2e;
  color: var(--tools-clr-text-secondary);
  border: 1px solid #4a4a50;
}
```

4. **ツール名** (177-181行目)
```css
/* 変更前 */
.tool-name {
  font-size: var(--fs-h3);
  font-weight: 600;
  margin-bottom: var(--spacing-3);
  color: var(--clr-text-primary);
}

/* 変更後 */
.tool-name {
  font-size: var(--fs-h3);
  font-weight: 600;
  margin-bottom: var(--spacing-3);
  color: var(--tools-clr-text-primary);
}
```

5. **ツール説明** (183-187行目)
```css
/* 変更前 */
.tool-description-card {
  color: var(--clr-text-muted);
  line-height: 1.6;
  font-size: var(--fs-sm);
}

/* 変更後 */
.tool-description-card {
  color: var(--tools-clr-text-muted);
  line-height: 1.6;
  font-size: var(--fs-sm);
}
```

6. **ツールフッター** (194-197行目)
```css
/* 変更前 */
.tool-card-footer {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-top: var(--spacing-6);
  color: var(--clr-text-muted);
  font-size: var(--fs-sm);
  font-weight: 500;
  transition: color var(--transition-speed) var(--transition-ease);
}

/* 変更後 */
.tool-card-footer {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-top: var(--spacing-6);
  color: var(--tools-clr-text-muted);
  font-size: var(--fs-sm);
  font-weight: 500;
  transition: color var(--transition-speed) var(--transition-ease);
}
```

7. **ホバー状態** (207-208行目)
```css
/* 変更前 */
.tool-card:hover {
  transform: translateY(-1px);
  border-color: var(--clr-accent-glow-strong);
  box-shadow: var(--shadow-lg-accent);
}

/* 変更後 */
.tool-card:hover {
  transform: translateY(-1px);
  border-color: var(--tools-clr-accent-glow-strong);
  box-shadow: var(--shadow-lg-accent);
}
```

8. **フォーカス状態** (220-227行目)
```css
/* 変更前 */
.tool-card:focus-visible {
  outline: none;
  transform: translateY(-1px);
  border-color: var(--clr-accent-glow-strong);
  box-shadow:
    0 0 0 3px var(--clr-bg),
    0 0 0 5px var(--clr-accent);
}

/* 変更後 */
.tool-card:focus-visible {
  outline: none;
  transform: translateY(-1px);
  border-color: var(--tools-clr-accent-glow-strong);
  box-shadow:
    0 0 0 3px var(--tools-clr-bg),
    0 0 0 5px var(--tools-clr-accent);
}
```

9. **ツールアイコン** (881-889行目)
```css
/* 変更前 */
.tool-icon-anki {
  background-color: var(--clr-accent);
}

.tool-icon-yomichan {
  background-color: var(--clr-accent-dark);
}

.tool-icon-migaku {
  background-color: var(--clr-accent-glow-strong);
}

/* 変更後 */
.tool-icon-anki {
  background-color: var(--tools-clr-accent);
}

.tool-icon-yomichan {
  background-color: var(--tools-clr-accent-dark);
}

.tool-icon-migaku {
  background-color: var(--tools-clr-accent-glow-strong);
}
```

## Phase 1.2: フォールバック値の追加

### 1.2.1 グローバル変数との互換性確保
**目的**: 既存スタイルの保護と段階的移行の準備

#### 実装内容
```css
/* フォールバック付きの変数定義 */
:root {
  /* 既存のグローバル変数をフォールバックとして使用 */
  --tools-clr-bg: var(--clr-background, #111111);
  --tools-clr-text-primary: var(--clr-text-primary, #e5e5e5);
  --tools-clr-text-secondary: var(--clr-text-secondary, #a3a3a3);
  --tools-clr-text-muted: var(--clr-text-muted, #b0b0b0);
  --tools-clr-accent: var(--clr-accent, #8b5cf6);
  --tools-clr-accent-dark: var(--clr-accent-dark, #7b4def);
  --tools-clr-accent-glow-faint: var(--clr-accent-glow-faint, rgba(139, 92, 246, 0.05));
  --tools-clr-accent-glow-medium: var(--clr-accent-glow-medium, rgba(139, 92, 246, 0.35));
  --tools-clr-accent-glow-strong: var(--clr-accent-glow-strong, rgba(139, 92, 246, 0.7));
}
```

## Phase 1.3: テスト項目

### 1.3.1 視覚的確認
- [ ] ツールページの表示確認
- [ ] カードの色とスタイルが正しく表示される
- [ ] ホバー効果が正常に動作する
- [ ] フォーカス状態が正しく表示される

### 1.3.2 レスポンシブデザイン確認
- [ ] モバイル表示 (360px)
- [ ] タブレット表示 (768px)
- [ ] デスクトップ表示 (1024px+)

### 1.3.3 他のページへの影響確認
- [ ] ホームページの表示確認
- [ ] 他のツールページの表示確認
- [ ] ナビゲーションの表示確認

## Phase 1.4: 実装手順

### 手順1: 変数定義の変更
1. `src/styles/tools/tools-index.css`を開く
2. 5-16行目の変数定義を変更
3. フォールバック値を追加

### 手順2: 使用箇所の更新
1. 各使用箇所を順次更新
2. 変更内容を確認
3. 構文エラーがないかチェック

### 手順3: テスト実行
1. ローカル環境で動作確認
2. 各ブレークポイントで表示確認
3. ブラウザの開発者ツールでエラー確認

### 手順4: コミット
```bash
git add src/styles/tools/tools-index.css
git commit -m "Phase 1: Resolve CSS variable conflicts in tools-index.css

- Rename conflicting variables with --tools- prefix
- Add fallback values for global variables
- Maintain visual consistency
- Prepare for Phase 2 migration"
```

## 期待される結果

### 1. 競合解消
- CSS変数の重複定義が解消される
- ブラウザが正しい変数を参照する

### 2. 視覚的一貫性
- 既存の見た目が維持される
- 色とスタイルが正しく表示される

### 3. メンテナンス性向上
- 変数の用途が明確になる
- デバッグが容易になる

## 次のステップ

Phase 1完了後、以下の準備を行います：

1. **Phase 2の準備**: OKLCH色空間への変換準備
2. **パフォーマンス測定**: 変更前後の比較
3. **ドキュメント更新**: 変更内容の記録

---

**作成日**: 2024年12月19日  
**作成者**: Sally (UX Expert)  
**承認者**: 要確認  
**実装予定**: 即座実行可能
