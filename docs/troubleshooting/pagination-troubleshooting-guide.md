# ページネーションシステム トラブルシューティングガイド

## 概要

ページネーションシステムで発生する可能性のある問題とその解決方法を説明します。

## よくある問題と解決方法

### 1. ページネーションが表示されない

#### 症状
- ページネーションコンポーネントが表示されない
- 複数ページあるのにページネーションが表示されない

#### 原因と解決方法

**原因1: 総ページ数が1以下**
```typescript
// 問題のあるコード
const totalPages = Math.ceil(posts.length / postsPerPage);
// posts.length が postsPerPage 以下の場合、totalPages が 1 になる

// 解決方法: デバッグログを追加
console.log('Pagination Debug:', {
  postsLength: posts.length,
  postsPerPage,
  totalPages: Math.ceil(posts.length / postsPerPage)
});
```

**原因2: Propsの値が無効**
```typescript
// 問題のあるコード
<Pagination
  currentPage={undefined}  // 無効な値
  totalPages={0}          // 無効な値
  baseUrl="/docs"
/>

// 解決方法: 適切な値を渡す
<Pagination
  currentPage={parseInt(Astro.url.searchParams.get('page') || '1')}
  totalPages={Math.ceil(posts.length / postsPerPage)}
  baseUrl="/docs"
/>
```

**原因3: バリデーションエラー**
```typescript
// コンソールでエラーログを確認
// 以下のようなエラーが表示される場合:
// "Pagination: Invalid parameters"
```

### 2. ページ遷移が動作しない

#### 症状
- ページ番号をクリックしても遷移しない
- URLは変わるがコンテンツが更新されない

#### 原因と解決方法

**原因1: サーバーサイドロジックの問題**
```typescript
// 問題のあるコード
const currentPage = Astro.url.searchParams.get('page'); // 文字列のまま

// 解決方法: 数値に変換
const currentPage = parseInt(Astro.url.searchParams.get('page') || '1');
```

**原因2: ページネーション計算の誤り**
```typescript
// 問題のあるコード
const startIndex = currentPage * postsPerPage; // 間違い

// 解決方法: 正しい計算
const startIndex = (currentPage - 1) * postsPerPage;
const endIndex = startIndex + postsPerPage;
const paginatedPosts = posts.slice(startIndex, endIndex);
```

### 3. URLが正しく生成されない

#### 症状
- ページ1でもクエリパラメータが残る
- 無効なURLが生成される

#### 原因と解決方法

**原因1: baseUrlの設定ミス**
```typescript
// 問題のあるコード
baseUrl="docs"  // スラッシュなし

// 解決方法: 正しいbaseUrl
baseUrl="/docs"
```

**原因2: Astro.siteの設定不足**
```typescript
// astro.config.mjs で設定を確認
export default defineConfig({
  site: 'https://gorakudo.org', // 本番URL
  // または
  site: 'http://localhost:4321', // 開発環境
});
```

### 4. レスポンシブデザインの問題

#### 症状
- モバイルで表示が崩れる
- タッチターゲットが小さすぎる

#### 原因と解決方法

**原因1: タッチターゲットサイズ不足**
```css
/* 問題のあるコード */
.pagination-btn {
  padding: 0.5rem 1rem; /* 44px未満 */
}

/* 解決方法: 適切なサイズ */
.pagination-btn {
  min-width: 44px;
  min-height: 44px;
  padding: clamp(0.75rem, 2vw, 1rem) clamp(1.25rem, 3vw, 1.5rem);
}
```

**原因2: メディアクエリの不備**
```css
/* 問題のあるコード */
@media (max-width: 768px) {
  .pagination-controls {
    flex-direction: column;
  }
}

/* 解決方法: min-widthアプローチ */
@media (min-width: 768px) {
  .pagination-controls {
    flex-direction: row;
  }
}
```

### 5. アクセシビリティの問題

#### 症状
- キーボードナビゲーションが動作しない
- スクリーンリーダーで正しく読み上げられない

#### 原因と解決方法

**原因1: ARIA属性の不足**
```html
<!-- 問題のあるコード -->
<nav>
  <a href="/docs?page=2">2</a>
</nav>

<!-- 解決方法: 適切なARIA属性 -->
<nav aria-label="ページネーション" aria-current="page">
  <a href="/docs?page=2" aria-label="ページ 2 に移動">2</a>
</nav>
```

**原因2: フォーカス表示の不備**
```css
/* 問題のあるコード */
.pagination-btn:focus {
  outline: none; /* フォーカス表示なし */
}

/* 解決方法: 適切なフォーカス表示 */
.pagination-btn:focus {
  outline: 3px solid oklch(60% 0.3 280deg);
  outline-offset: 3px;
}
```

### 6. パフォーマンスの問題

#### 症状
- ページ読み込みが遅い
- メモリ使用量が多い

#### 原因と解決方法

**原因1: 不要な再レンダリング**
```typescript
// 問題のあるコード
const visiblePages = calculateVisiblePages(currentPage, totalPages, maxVisiblePages);
// 毎回計算される

// 解決方法: メモ化
const visiblePages = useMemo(() => 
  calculateVisiblePages(currentPage, totalPages, maxVisiblePages),
  [currentPage, totalPages, maxVisiblePages]
);
```

**原因2: 大量のDOM要素**
```typescript
// 問題のあるコード
// 100ページすべてを表示

// 解決方法: 表示数を制限
const maxVisiblePages = 5; // 最大5ページまで表示
```

## デバッグ方法

### 1. コンソールログの確認
```typescript
// デバッグログを有効にする
console.log('Pagination Debug:', {
  currentPage,
  totalPages,
  baseUrl,
  maxVisiblePages,
  visiblePages: calculateVisiblePages(currentPage, totalPages, maxVisiblePages)
});
```

### 2. ブラウザ開発者ツールの使用
- **Elements**: DOM構造の確認
- **Console**: エラーログの確認
- **Network**: リクエストの確認
- **Performance**: パフォーマンスの測定

### 3. アクセシビリティツールの使用
- **Chrome DevTools**: Accessibility タブ
- **axe DevTools**: アクセシビリティ監査
- **WAVE**: Web Accessibility Evaluator

## テスト方法

### 1. 手動テスト
```bash
# 開発サーバーを起動
npm run dev

# 各ページをテスト
# /docs
# /docs?page=2
# /docs?page=999 (エラーテスト)
```

### 2. 自動テスト
```bash
# 統合テストを実行
node src/scripts/integration-test.js

# アクセシビリティテストを実行
node src/scripts/accessibility-test.js
```

### 3. パフォーマンステスト
```bash
# ビルドテスト
npm run build

# Lighthouse監査
# Chrome DevTools > Lighthouse
```

## よくある質問（FAQ）

### Q: ページネーションが表示されないのはなぜですか？
A: 総ページ数が1以下の場合、ページネーションは表示されません。`posts.length`と`postsPerPage`の値を確認してください。

### Q: ページ遷移が動作しないのはなぜですか？
A: サーバーサイドでページネーションロジックが正しく実装されているか確認してください。`currentPage`の値が正しく計算されているかも確認してください。

### Q: モバイルで表示が崩れるのはなぜですか？
A: レスポンシブデザインのCSSが正しく適用されているか確認してください。特に`min-width`メディアクエリの使用を推奨します。

### Q: アクセシビリティテストに失敗するのはなぜですか？
A: ARIA属性とキーボードナビゲーションが正しく実装されているか確認してください。スクリーンリーダーでのテストも重要です。

### Q: パフォーマンスが悪いのはなぜですか？
A: 不要な再レンダリングや大量のDOM要素がないか確認してください。`contain`と`will-change`プロパティの使用も検討してください。

## サポート

### ドキュメント
- **実装ガイド**: `docs/ux-ui-style/pagination-system-design.md`
- **テストガイド**: `docs/testing/integration-test-guide.md`

### 連絡先
- **技術的な問題**: プロジェクトチーム
- **バグ報告**: GitHub Issues
- **機能要求**: GitHub Discussions

---

**作成日**: 2024-12-20  
**バージョン**: 1.0  
**ステータス**: 本番リリース準備完了  
**担当**: Winston (Architect)
