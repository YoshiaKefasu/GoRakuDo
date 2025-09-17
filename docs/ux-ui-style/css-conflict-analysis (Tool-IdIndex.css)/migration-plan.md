# CSS統合移行計画書

## 概要
`Tool-IdIndex.css`と`global.css`の競合を解決し、統一されたデザインシステムを構築するための段階的移行計画です。

## 移行戦略
**既存スタイルを壊さない**ことを最優先とし、段階的かつ慎重に進めます。

## Phase 1: 緊急対応（即座に実行可能）

### 1.1 変数の名前空間化
**目的**: 競合を即座に解決し、既存スタイルを保護

**実行内容**:
```css
/* Tool-IdIndex.css の :root セクションを以下に変更 */
:root {
  /* ツール専用変数に名前空間を追加 */
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

  /* スペーシングは global.css と一致しているため、そのまま使用 */
  --tool-spacing-xs: var(--spacing-xs);
  --tool-spacing-sm: var(--spacing-sm);
  --tool-spacing-md: var(--spacing-md);
  --tool-spacing-lg: var(--spacing-lg);
  --tool-spacing-xl: var(--spacing-xl);
  --tool-spacing-2xl: var(--spacing-2xl);

  /* ボーダー半径は段階的に統一 */
  --tool-radius-sm: 0.5rem;
  --tool-radius-md: 0.75rem;
  --tool-radius-lg: 1rem;
  --tool-radius-xl: 1.5rem;
  --tool-radius-2xl: 2rem;

  /* シャドウは段階的に統一 */
  --tool-shadow-sm: 0 4px 12px oklch(0% 0 0 / 0.1);
  --tool-shadow-md: 0 10px 30px oklch(0% 0 0 / 0.3);

  /* フォントサイズは段階的に統一 */
  --tool-font-size-xs: 0.625rem;
  --tool-font-size-sm: 0.75rem;
  --tool-font-size-base: 0.875rem;
  --tool-font-size-lg: 1rem;
  --tool-font-size-xl: 1.125rem;
  --tool-font-size-2xl: 1.25rem;
  --tool-font-size-3xl: 1.5rem;
  --tool-font-size-4xl: 2rem;

  /* レイアウト */
  --tool-container-max-width: 1280px;
  --tool-grid-gap: var(--spacing-xl);
}
```

**リスク**: 低（既存スタイルに影響なし）
**実行時間**: 30分
**テスト**: ツールページの表示確認

### 1.2 変数参照の更新
**目的**: 新しい名前空間付き変数を使用するように更新

**実行内容**:
- `Tool-IdIndex.css`内の全ての変数参照を`--tool-`プレフィックス付きに変更
- 例: `var(--color-primary)` → `var(--tool-color-primary)`

**リスク**: 低（内部的な変更のみ）
**実行時間**: 1時間
**テスト**: ツールページの表示確認

## Phase 2: 段階的統一（1週間後）

### 2.1 色変数の統一
**目的**: ブランド一貫性の向上

**実行内容**:
```css
/* Tool-IdIndex.css の色変数を global.css に合わせる */
:root {
  --tool-color-primary: var(--color-primary);
  --tool-color-text-primary: var(--color-text-primary);
  --tool-color-text-secondary: var(--color-text-secondary);
  --tool-color-text-muted: var(--color-text-muted);
  /* 他の色変数も同様に統一 */
}
```

**リスク**: 中（色の変更による視覚的影響）
**実行時間**: 2時間
**テスト**: 全ツールページの表示確認、ブランドガイドラインとの整合性確認

### 2.2 フォントサイズの統一
**目的**: タイポグラフィの一貫性向上

**実行内容**:
```css
/* Tool-IdIndex.css のフォントサイズを global.css に合わせる */
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

**リスク**: 中（レイアウトの微調整が必要な可能性）
**実行時間**: 1時間
**テスト**: レスポンシブデザインの確認、可読性テスト

## Phase 3: 完全統合（2週間後）

### 3.1 ボーダー半径の統一
**目的**: 視覚的一貫性の向上

**実行内容**:
```css
/* Tool-IdIndex.css のボーダー半径を global.css に合わせる */
:root {
  --tool-radius-sm: var(--radius-sm);
  --tool-radius-md: var(--radius-md);
  --tool-radius-lg: var(--radius-lg);
  --tool-radius-xl: var(--radius-xl);
}
```

**リスク**: 中（コンポーネントの見た目の変更）
**実行時間**: 1時間
**テスト**: 全コンポーネントの表示確認

### 3.2 シャドウシステムの統一
**目的**: デプス感の一貫性向上

**実行内容**:
```css
/* Tool-IdIndex.css のシャドウを global.css に合わせる */
:root {
  --tool-shadow-sm: var(--shadow-sm);
  --tool-shadow-md: var(--shadow-md);
}
```

**リスク**: 低（視覚的な微調整）
**実行時間**: 30分
**テスト**: 全ページの表示確認

## Phase 4: 最適化（3週間後）

### 4.1 重複変数の削除
**目的**: コードの簡潔性向上

**実行内容**:
- `Tool-IdIndex.css`から`--tool-`プレフィックス付き変数を削除
- 直接`global.css`の変数を使用

**リスク**: 低（内部的な変更のみ）
**実行時間**: 30分
**テスト**: 全機能の動作確認

### 4.2 パフォーマンス最適化
**目的**: CSSファイルサイズの削減

**実行内容**:
- 未使用のCSS変数の削除
- 重複するスタイルの統合
- CSSの最適化

**リスク**: 低（最適化のみ）
**実行時間**: 1時間
**テスト**: パフォーマンステスト

## 実行スケジュール

| Phase | 実行日 | 作業時間 | 担当者 | 承認者 |
|-------|--------|----------|--------|--------|
| Phase 1 | 即座 | 1.5時間 | UX Expert | - |
| Phase 2 | 1週間後 | 3時間 | UX Expert | - |
| Phase 3 | 2週間後 | 1.5時間 | UX Expert | - |
| Phase 4 | 3週間後 | 1.5時間 | UX Expert | - |

## テスト計画

### 各Phase後のテスト項目
1. **ビジュアルリグレッションテスト**
   - ツールページの表示確認
   - レスポンシブデザインの確認
   - ブラウザ間の表示確認

2. **機能テスト**
   - 全リンクの動作確認
   - インタラクションの動作確認
   - フォームの動作確認

3. **パフォーマンステスト**
   - ページ読み込み速度の測定
   - CSSファイルサイズの確認

## ロールバック計画

### 各Phaseでのロールバック手順
1. **Gitでのコミット**: 各Phase前にコミットを作成
2. **バックアップ**: 変更前のファイルをバックアップ
3. **段階的ロールバック**: 問題が発生した場合、前のPhaseに戻る

## 成功指標

### Phase 1完了時
- [ ] 競合エラーが解消されている
- [ ] 既存の表示に変化がない
- [ ] ツールページが正常に動作する

### Phase 2完了時
- [ ] 色の一貫性が向上している
- [ ] タイポグラフィが統一されている
- [ ] ブランドガイドラインに準拠している

### Phase 3完了時
- [ ] ボーダー半径が統一されている
- [ ] シャドウが統一されている
- [ ] 全ページで一貫したデザインが適用されている

### Phase 4完了時
- [ ] CSSファイルサイズが削減されている
- [ ] パフォーマンスが向上している
- [ ] コードの保守性が向上している

## 注意事項

1. **段階的実行**: 一度に全てを変更せず、段階的に進める
2. **テスト重視**: 各段階で十分なテストを実施する
3. **ロールバック準備**: 問題が発生した場合の対応を準備する
4. **ドキュメント更新**: 変更内容を適切に記録する

---

**作成者**: Sally (UX Expert)  
**作成日**: 2025年9月17日  
**承認者**: -  
**次回レビュー**: Phase 1完了後
