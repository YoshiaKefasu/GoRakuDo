# CSS移行計画: tools-index.css → global.css 統合

## 概要

このドキュメントは、`tools-index.css`と`global.css`の競合を解決し、統一されたデザインシステムを構築するための段階的移行計画です。

## 移行戦略

### 基本方針
1. **既存スタイルを壊さない** - 段階的な移行でリスクを最小化
2. **global.cssを基準とする** - より包括的なデザインシステムを採用
3. **OKLCHカラーシステムを統一** - モダンなカラー管理を実現
4. **後方互換性を維持** - 既存コンポーネントの動作を保証

## Phase 1: 緊急修正 (1-2日)

### 1.1 CSS変数の重複削除

#### 実行内容
- `tools-index.css`の重複CSS変数を削除
- `global.css`のOKLCHカラーシステムを採用
- 変数名のマッピングを作成

#### 具体的な変更

**削除する変数 (tools-index.css)**
```css
/* 削除対象 */
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

**マッピング表**
| tools-index.css | global.css | 備考 |
|----------------|------------|------|
| `--clr-bg` | `--clr-background` | OKLCHに変換 |
| `--clr-text-primary` | `--clr-text-primary` | OKLCHに変換 |
| `--clr-text-secondary` | `--clr-text-secondary` | OKLCHに変換 |
| `--clr-text-muted` | `--clr-text-muted` | OKLCHに変換 |
| `--clr-accent` | `--clr-accent` | OKLCHに変換 |
| `--clr-accent-dark` | `--clr-accent-dark` | OKLCHに変換 |
| `--clr-accent-glow-faint` | `--clr-accent-glow-faint` | OKLCHに変換 |
| `--clr-accent-glow-medium` | `--clr-accent-glow-medium` | OKLCHに変換 |
| `--clr-accent-glow-strong` | `--clr-accent-glow-strong` | OKLCHに変換 |

#### 実装手順
1. `tools-index.css`の`:root`セクションから重複変数を削除
2. 既存のクラスで使用されている変数名を更新
3. テスト環境で動作確認

### 1.2 body要素のスタイル統合

#### 実行内容
- `tools-index.css`のbodyスタイルを削除
- `global.css`のbodyスタイルを基準とする

#### 削除するスタイル (tools-index.css)
```css
/* 削除対象 */
body {
  background-color: var(--clr-bg);
  color: var(--clr-text-primary);
  font-family: var(--font-family-sans);
}
```

#### 実装手順
1. `tools-index.css`のbodyスタイルを削除
2. 必要に応じて`global.css`のbodyスタイルを調整
3. ツールページでの表示確認

### 1.3 フォントファミリーの統一

#### 実行内容
- `--font-family-sans`の参照を`--font-primary`に変更

#### 変更箇所
```css
/* 変更前 */
font-family: var(--font-family-sans);

/* 変更後 */
font-family: var(--font-primary);
```

## Phase 2: 中程度の修正 (3-5日)

### 2.1 アニメーション変数の統一

#### 実行内容
- `global.css`のアニメーション変数を基準とする
- `tools-index.css`の重複変数を削除

#### 削除する変数 (tools-index.css)
```css
/* 削除対象 */
--transition-speed: 200ms;
--transition-ease: ease-out;
--animate-duration-normal: 0.4s;
--animate-duration-fast: 0.2s;
--animate-duration-slow: 0.6s;
```

#### マッピング表
| tools-index.css | global.css | 備考 |
|----------------|------------|------|
| `--transition-speed` | `--transition-speed` | 値の統一 |
| `--animate-duration-normal` | `--animate-duration-normal` | 値の統一 |
| `--animate-duration-fast` | `--animate-duration-fast` | 値の統一 |
| `--animate-duration-slow` | `--animate-duration-slow` | 値の統一 |

### 2.2 ボーダーラディウスの統一

#### 実行内容
- `global.css`のボーダーラディウスを基準とする
- `tools-index.css`の重複変数を削除

#### 削除する変数 (tools-index.css)
```css
/* 削除対象 */
--border-radius-card: 1rem; /* 16px */
--border-radius-pill: 9999px;
```

#### マッピング表
| tools-index.css | global.css | 備考 |
|----------------|------------|------|
| `--border-radius-card` | `--border-radius-card` | 値の統一 |
| `--border-radius-pill` | `--border-radius-pill` | 値の統一 |

### 2.3 スペーシングシステムの統合

#### 実行内容
- `global.css`のスペーシングシステムを基準とする
- `tools-index.css`の重複変数を削除

#### 削除する変数 (tools-index.css)
```css
/* 削除対象 */
--spacing-1: 0.25rem; /* 4px */
--spacing-2: 0.5rem; /* 8px */
--spacing-3: 0.75rem; /* 12px */
--spacing-4: 1rem; /* 16px */
--spacing-6: 1.5rem; /* 24px */
--spacing-8: 2rem; /* 32px */
--spacing-12: 3rem; /* 48px */
--spacing-16: 4rem; /* 64px */
```

#### マッピング表
| tools-index.css | global.css | 備考 |
|----------------|------------|------|
| `--spacing-1` | `--spacing-xs` | 変数名変更 |
| `--spacing-2` | `--spacing-sm` | 変数名変更 |
| `--spacing-3` | `--spacing-sm` | 値の統一 |
| `--spacing-4` | `--spacing-md` | 変数名変更 |
| `--spacing-6` | `--spacing-lg` | 変数名変更 |
| `--spacing-8` | `--spacing-xl` | 変数名変更 |
| `--spacing-12` | `--spacing-2xl` | 変数名変更 |
| `--spacing-16` | `--spacing-3xl` | 変数名変更 |

## Phase 3: 最終整理 (1週間)

### 3.1 ユーティリティクラスの整理

#### 実行内容
- 重複するユーティリティクラスを統合
- `global.css`のクラスを基準とする

#### 統合対象クラス
- `.loading`
- `.sr-only`
- `.scroll-reveal`
- `.page-load-fade-in`
- `.page-load-slide-up`

### 3.2 重複キーフレームの削除

#### 実行内容
- `tools-index.css`の重複キーフレームを削除
- `global.css`のキーフレームを基準とする

#### 削除対象キーフレーム
```css
/* 削除対象 */
@keyframes safe-fade-in
@keyframes safe-slide-up
@keyframes safe-scale-in
@keyframes page-load-fade-in
@keyframes page-load-slide-up
@keyframes stagger-fade-in
@keyframes loading-spinner
```

### 3.3 パフォーマンス最適化

#### 実行内容
- 不要なCSSの削除
- 重複コードの統合
- ファイルサイズの最適化

## 実装チェックリスト

### Phase 1 チェックリスト
- [ ] CSS変数の重複削除完了
- [ ] body要素のスタイル統合完了
- [ ] フォントファミリーの統一完了
- [ ] ツールページの表示確認
- [ ] 他のページへの影響確認

### Phase 2 チェックリスト
- [ ] アニメーション変数の統一完了
- [ ] ボーダーラディウスの統一完了
- [ ] スペーシングシステムの統合完了
- [ ] アニメーションの動作確認
- [ ] レスポンシブデザインの確認

### Phase 3 チェックリスト
- [ ] ユーティリティクラスの整理完了
- [ ] 重複キーフレームの削除完了
- [ ] パフォーマンス最適化完了
- [ ] 全体的な動作確認
- [ ] アクセシビリティの確認

## テスト計画

### 視覚的回帰テスト
1. **ツールページ**
   - カードレイアウトの表示確認
   - アニメーションの動作確認
   - レスポンシブデザインの確認

2. **他のページ**
   - ホームページの表示確認
   - 記事ページの表示確認
   - ナビゲーションの表示確認

### 機能テスト
1. **インタラクション**
   - ホバーエフェクトの確認
   - フォーカス状態の確認
   - アニメーションの確認

2. **アクセシビリティ**
   - キーボードナビゲーションの確認
   - スクリーンリーダーの確認
   - コントラスト比の確認

## リスク管理

### 高リスク項目
1. **カラーテーマの変更**
   - 事前にカラーパレットの確認
   - 段階的な適用でリスクを軽減

2. **グローバルスタイルの変更**
   - 他のページへの影響を事前確認
   - ロールバック計画の準備

### 中リスク項目
1. **アニメーション速度の変更**
   - ユーザーエクスペリエンスへの影響を考慮
   - 必要に応じて調整

2. **既存コンポーネントの表示崩れ**
   - 各コンポーネントの個別確認
   - 必要に応じて個別調整

## ロールバック計画

### 緊急時の対応
1. **即座にロールバック**
   - 変更前のファイルを復元
   - 問題の特定と分析

2. **段階的な修正**
   - 問題箇所の特定
   - 最小限の修正で対応

### 予防策
1. **バックアップの作成**
   - 変更前のファイルをバックアップ
   - バージョン管理の活用

2. **段階的な適用**
   - 一度に大量の変更を行わない
   - 各段階での動作確認

## 完了後の確認事項

### 技術的な確認
- [ ] CSSファイルサイズの最適化
- [ ] 重複コードの完全削除
- [ ] パフォーマンスの向上

### デザイン的な確認
- [ ] デザインシステムの統一
- [ ] ブランド一貫性の確保
- [ ] ユーザーエクスペリエンスの向上

### メンテナンス性の確認
- [ ] コードの可読性向上
- [ ] デバッグの容易さ
- [ ] 今後の拡張性

---

**注意事項:**
- この移行計画は2024年12月19日時点のファイル内容に基づいています
- 実装中に新たな問題が発見された場合は、計画を調整してください
- 各段階での動作確認を必ず行ってください
