# パンくずリスト使用例テンプレート

## 基本的な使用方法

### 1. シンプルなパンくずリスト
```astro
<Breadcrumb 
  currentPath="/current/path" 
  showIcons={true}
/>
```

### 2. ポスト用パンくずリスト
```astro
<Breadcrumb 
  {post}
  showIcons={true}
  variant="compact"
/>
```

### 3. ツールページ用パンくずリスト
```astro
<Breadcrumb
  currentPath={`/tools/${tool}`}
  showHome={true}
  showIcons={true}
  variant="compact"
  ariaLabel="Tool navigation breadcrumb"
/>
```

## カスタマイズ例

### 1. アイコンなしのパンくずリスト
```astro
<Breadcrumb 
  currentPath="/docs" 
  showIcons={false}
  variant="minimal"
/>
```

### 2. 縦向きのパンくずリスト
```astro
<Breadcrumb 
  currentPath="/pages" 
  orientation="vertical"
  showIcons={true}
/>
```

### 3. 大きなパンくずリスト
```astro
<Breadcrumb 
  currentPath="/support-us" 
  variant="spacious"
  showIcons={true}
  maxItems={10}
/>
```

### 4. ピル型のパンくずリスト
```astro
<Breadcrumb 
  currentPath="/tools/anki" 
  variant="pill"
  showIcons={true}
  theme="dark"
/>
```

### 5. アンダーライン型のパンくずリスト
```astro
<Breadcrumb 
  currentPath="/docs/guide" 
  variant="underline"
  showIcons={true}
  theme="light"
/>
```

## 設定ファイルでのカスタマイズ

### 新しいアイコンを追加
```typescript
// src/config/breadcrumb-config.ts
{
  name: 'custom-icon',
  svg: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>`,
  description: 'カスタムスターアイコン'
}
```

### パス別アイコンを設定
```typescript
// src/config/breadcrumb-config.ts
export const PATH_ICON_MAP: Record<string, string> = {
  'docs': 'book',
  'pages': 'document',
  'support-us': 'heart',  // 新しいアイコン
  'tools': 'tools'
};
```

### デフォルト設定を変更
```typescript
// src/config/breadcrumb-config.ts
export const BREADCRUMB_DEFAULTS = {
  variant: 'spacious',    // デフォルトを大きく
  theme: 'light',         // デフォルトをライトテーマ
  showIcons: true,        // デフォルトでアイコン表示
  orientation: 'horizontal',
  maxItems: 7             // 表示アイテム数を増加
};
```

## よく使用されるパターン

### 1. ドキュメントページ
```astro
<Breadcrumb 
  currentPath="/docs" 
  showIcons={true}
  variant="compact"
  ariaLabel="Documentation navigation breadcrumb"
/>
```

### 2. ツールページ
```astro
<Breadcrumb
  currentPath={`/tools/${tool}`}
  showHome={true}
  showIcons={true}
  variant="compact"
  ariaLabel="Tool navigation breadcrumb"
/>
```

### 3. サポートページ
```astro
<Breadcrumb 
  currentPath="/support-us" 
  showIcons={true}
  variant="minimal"
  ariaLabel="Support page navigation breadcrumb"
/>
```

### 4. ポスト詳細ページ
```astro
<Breadcrumb 
  {post}
  showIcons={true}
  variant="compact"
  ariaLabel="Post navigation breadcrumb"
/>
```

## アクセシビリティの考慮

### 適切なaria-labelの設定
```astro
<!-- ドキュメントページ -->
<Breadcrumb 
  currentPath="/docs" 
  ariaLabel="Documentation navigation breadcrumb"
/>

<!-- ツールページ -->
<Breadcrumb
  currentPath={`/tools/${tool}`}
  ariaLabel="Tool navigation breadcrumb"
/>

<!-- ポストページ -->
<Breadcrumb 
  {post}
  ariaLabel="Post navigation breadcrumb"
/>
```

## パフォーマンス最適化

### メモ化の活用
設定ファイルベースの実装により、アイコンは自動的にキャッシュされ、パフォーマンスが最適化されます。

### 最小限のプロパティ
必要なプロパティのみを指定することで、レンダリング性能を向上させます：

```astro
<!-- 推奨: 最小限のプロパティ -->
<Breadcrumb currentPath="/docs" />

<!-- 避ける: 不要なプロパティ -->
<Breadcrumb 
  currentPath="/docs" 
  showHome={true}
  variant="compact"
  theme="auto"
  orientation="horizontal"
  maxItems={5}
  showIcons={true}
  ariaLabel="Breadcrumb navigation"
  className=""
/>
```
