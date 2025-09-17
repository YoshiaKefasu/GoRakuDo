# Phase 2 実装テンプレート

## 実行前チェックリスト

### 環境準備
- [ ] Phase 1完了の確認
- [ ] バックアップファイルの作成
- [ ] テスト環境の準備
- [ ] ロールバック計画の確認

### 実装準備
- [ ] 色変数のマッピング確認
- [ ] フォントサイズのマッピング確認
- [ ] 影響範囲の確認
- [ ] テスト計画の確認

## 実装手順

### Step 1: 色変数の統一

#### 1.1 バックアップ作成
```bash
# 現在のファイルをバックアップ
cp "src/styles/tools/[tool]/tool-index.css" "src/styles/@ux-ui-style/tool-index-phase2-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss').css"
```

#### 1.2 色変数の更新
```css
/* tool-index.css の :root セクションを以下に更新 */
:root {
  /* Phase 2.1: 基本色の統一 */
  --tool-color-primary: var(--color-primary);
  --tool-color-primary-hover: var(--color-primary-dark);
  --tool-color-text-primary: var(--color-text-primary);
  --tool-color-text-secondary: var(--color-text-secondary);
  --tool-color-text-muted: var(--color-text-muted);
  --tool-color-border: var(--color-border);
  --tool-color-border-hover: var(--color-border-hover);
  
  /* ツール専用色（段階的に統一予定） */
  --tool-color-secondary: oklch(75% 0.12 65);
  --tool-color-bg-card: oklch(8% 0.01 270 / 0.5);
  --tool-color-bg-card-hover: oklch(8% 0.01 270 / 0.7);
  --tool-color-text-light: oklch(60% 0.01 270);
  
  /* その他の変数は既存のまま */
}
```

#### 1.3 色変数統一後のテスト
- [ ] ツールページの表示確認
- [ ] プライマリカラーの統一確認
- [ ] テキストカラーの統一確認
- [ ] ボーダーカラーの統一確認
- [ ] ブランドガイドラインとの整合性確認

### Step 2: フォントサイズの統一

#### 2.1 フォントサイズの更新
```css
/* tool-index.css の :root セクションに以下を追加 */
:root {
  /* Phase 2.2: フォントサイズの統一 */
  --tool-font-size-xs: var(--font-size-xs);
  --tool-font-size-sm: var(--font-size-sm);
  --tool-font-size-base: var(--font-size-base);
  --tool-font-size-lg: var(--font-size-lg);
  --tool-font-size-xl: var(--font-size-xl);
  --tool-font-size-2xl: var(--font-size-2xl);
  --tool-font-size-3xl: var(--font-size-3xl);
  --tool-font-size-4xl: var(--font-size-4xl);
  
  /* その他の変数は既存のまま */
}
```

#### 2.2 フォントサイズ統一後のテスト
- [ ] 各フォントサイズでの可読性確認
- [ ] 行間の適切性確認
- [ ] 文字間隔の適切性確認
- [ ] レスポンシブデザインの確認
- [ ] アクセシビリティの確認

### Step 3: 統合テスト

#### 3.1 ビジュアルテスト
- [ ] ツールページの表示確認
- [ ] 色の一貫性確認
- [ ] タイポグラフィの統一確認
- [ ] レイアウトの適切性確認

#### 3.2 レスポンシブテスト
- [ ] モバイル（320px+）での表示確認
- [ ] タブレット（768px+）での表示確認
- [ ] デスクトップ（1280px+）での表示確認

#### 3.3 アクセシビリティテスト
- [ ] コントラスト比の確認
- [ ] フォントサイズの適切性確認
- [ ] 視覚障害者向けの可読性確認

## ロールバック手順

### 色変数のロールバック
```css
/* 問題が発生した場合のロールバック用コード */
:root {
  --tool-color-primary: oklch(65% 0.18 280);
  --tool-color-primary-hover: oklch(70% 0.18 280);
  --tool-color-text-primary: oklch(95% 0.01 270);
  --tool-color-text-secondary: oklch(75% 0.01 270);
  --tool-color-text-muted: oklch(70% 0.01 270);
  --tool-color-border: oklch(25% 0.02 270 / 0.1);
  --tool-color-border-hover: oklch(25% 0.02 270 / 0.3);
}
```

### フォントサイズのロールバック
```css
/* 問題が発生した場合のロールバック用コード */
:root {
  --tool-font-size-xs: 0.625rem;
  --tool-font-size-sm: 0.75rem;
  --tool-font-size-base: 0.875rem;
  --tool-font-size-lg: 1rem;
  --tool-font-size-xl: 1.125rem;
  --tool-font-size-2xl: 1.25rem;
  --tool-font-size-3xl: 1.5rem;
  --tool-font-size-4xl: 2rem;
}
```

## 完了確認

### 実装完了チェックリスト
- [ ] 色変数の統一完了
- [ ] フォントサイズの統一完了
- [ ] 全テストの完了
- [ ] ドキュメントの更新
- [ ] ロールバック計画の確認

### 品質確認
- [ ] ビジュアル一貫性の確認
- [ ] ブランド準拠率の確認
- [ ] アクセシビリティスコアの確認
- [ ] レスポンシブ対応の確認

## 記録事項

### 実装日時
- **開始時刻**: 
- **完了時刻**: 
- **実装者**: Sally (UX Expert)

### テスト結果
- **ビジュアルテスト**: 
- **レスポンシブテスト**: 
- **アクセシビリティテスト**: 

### 問題と解決策
- **発生した問題**: 
- **解決策**: 
- **今後の対策**: 

---

**テンプレート作成者**: Sally (UX Expert)  
**作成日**: 2025年9月17日  
**使用開始予定**: 2025年9月24日
