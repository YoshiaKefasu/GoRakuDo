# GoRakuDo Content Collections 設定ガイド

## 📋 概要

このディレクトリは、GoRakuDoサイトのコンテンツ管理システム（Content Collections）の設定ファイルとコンテンツファイルを格納しています。

## 🗂️ ディレクトリ構造

```
src/content/
├── config.ts              # メイン設定ファイル
├── README.md              # このファイル
├── docs/                  # メインコンテンツ（ブログ記事、ガイド）
├── templates/             # 記事作成用テンプレート
├── pages/                 # 静的ページ（サポートページなど）
└── tool-articles/         # ツール紹介記事
```

## 🧠 MindMaps構造

### 📊 Content Collections 全体構造

```mermaid
mindmap
  root((GoRakuDo<br/>Content Collections))
    📚 docs
      基本情報
        title
        description
        publishedDate
        author
        emoji
      分類・タグ
        categories
        tags
      オプション
        status
    📝 templates
      テンプレート情報
        templateName
        templateType
        description
        version
        lastUpdated
      テンプレート構造
        requiredFields
        optionalFields
        instructions
        examples
        templateContent
      管理用メタデータ
        author
        tags
    📄 pages
      基本情報
        title
        description
        publishedDate
        author
      分類・タグ
        category
        tags
        featured
      ページタイプ
        contentType
    🛠️ tool-articles
      基本情報
        title
        description
        publishedDate
        updatedDate
        author
      ツール固有情報
        toolName
        toolVersion
        toolWebsite
        toolCategory
      視覚的要素
        emoji
        icon
      分類・タグ
        categories
        tags
      SEO・発見性
        keywords
        relatedTools
```

### 🔧 設定定数構造

```mermaid
mindmap
  root((設定定数))
    📏 LIMITS
      文字数制限
        TITLE_MIN: 1
        TITLE_MAX: 100
        DESCRIPTION_MIN: 10
        DESCRIPTION_MAX: 200
        AUTHOR_MAX: 50
        CATEGORY_MAX: 30
        TAG_MAX: 20
      配列制限
        CATEGORIES_MAX: 5
        TAGS_MAX: 10
    🎯 DEFAULTS
      デフォルト値
        AUTHOR: 'Tim GoRakuDo'
        VERSION: '1.0.0'
        STATUS: 'published'
        COST: 'free'
        CONTENT_TYPE: 'resource'
```

### 📝 フィールドタイプ別分類

```mermaid
mindmap
  root((フィールドタイプ))
    📝 文字列フィールド
      基本文字列
        title
        description
        author
        toolName
      特殊文字列
        publishedDate (ISO形式)
        version (セマンティック)
      正規表現検証
        emoji (絵文字のみ)
        icon (ファイルパス)
        toolVersion (バージョン形式)
    🔢 数値フィールド
      整数
        readTime (削除済み)
    ✅ 真偽値フィールド
      フラグ
        featured
        isActive
    📋 配列フィールド
      文字列配列
        categories
        tags
        keywords
        relatedTools
        requiredFields
        optionalFields
        examples
    🎯 列挙型フィールド
      状態管理
        status (published/draft/archived)
        contentType (resource/info/legal)
      分類
        templateType (post/guide/tutorial/review/case-study)
        toolCategory (flashcard/reading/listening/writing/suite/video/browser-extension/mobile-app/desktop-app)
```

## 🎯 各コレクション詳細

### 📚 docs コレクション

**用途**: メインコンテンツ（ブログ記事、ガイド、チュートリアル）  
**場所**: `src/content/docs/`  
**必須フィールド**: title, description, publishedDate

#### フィールド構造
```mermaid
graph TD
    A[docs] --> B[基本情報]
    A --> C[分類・タグ]
    A --> D[オプション]
    
    B --> B1[title: 1-100文字]
    B --> B2[description: 10-200文字]
    B --> B3[publishedDate: ISO形式]
    B --> B4[author: デフォルト値あり]
    B --> B5[emoji: 絵文字のみ]
    
    C --> C1[categories: 1-5個]
    C --> C2[tags: 最大10個]
    
    D --> D1[status: 公開状態]
```

### 📝 templates コレクション

**用途**: 記事作成用テンプレート管理  
**場所**: `src/content/templates/`  
**必須フィールド**: templateName, templateType, description, lastUpdated, templateContent

#### フィールド構造
```mermaid
graph TD
    A[templates] --> B[テンプレート情報]
    A --> C[テンプレート構造]
    A --> D[使用方法・説明]
    A --> E[管理用メタデータ]
    
    B --> B1[templateName: 1-50文字]
    B --> B2[templateType: 5種類から選択]
    B --> B3[description: 10-200文字]
    B --> B4[version: セマンティック形式]
    B --> B5[lastUpdated: ISO形式]
    
    C --> C1[requiredFields: 最大15個]
    C --> C2[optionalFields: 最大15個]
    C --> C3[templateContent: 必須]
    
    D --> D1[instructions: 最大500文字]
    D --> D2[examples: 最大10個]
    
    E --> E1[author: デフォルト値あり]
    E --> E2[tags: 最大10個]
```

### 📄 pages コレクション

**用途**: 静的ページ（サポートページ、お知らせ、法的ページ）  
**場所**: `src/content/pages/`  
**必須フィールド**: title, description, publishedDate

#### フィールド構造
```mermaid
graph TD
    A[pages] --> B[基本情報]
    A --> C[分類・タグ]
    A --> D[ページタイプ設定]
    
    B --> B1[title: 1-100文字]
    B --> B2[description: 10-200文字]
    B --> B3[publishedDate: ISO形式]
    B --> B4[author: デフォルト値あり]
    
    C --> C1[category: 1-30文字]
    C --> C2[tags: 最大10個]
    C --> C3[featured: おすすめフラグ]
    
    D --> D1[contentType: 3種類から選択]
```

### 🛠️ tool-articles コレクション

**用途**: 学習ツールの紹介・解説記事  
**場所**: `src/content/tool-articles/`  
**必須フィールド**: title, description, publishedDate, toolName, toolCategory

#### フィールド構造
```mermaid
graph TD
    A[tool-articles] --> B[基本情報]
    A --> C[ツール固有情報]
    A --> D[セットアップ情報]
    A --> E[視覚的要素]
    A --> F[分類・タグ]
    A --> G[ツール機能・要件]
    A --> H[SEO・発見性]
    
    B --> B1[title: 1-100文字]
    B --> B2[description: 10-200文字]
    B --> B3[publishedDate: ISO形式]
    B --> B4[updatedDate: ISO形式]
    B --> B5[author: デフォルト値あり]
    
    C --> C1[toolName: 1-50文字]
    C --> C2[toolVersion: バージョン形式]
    C --> C3[toolWebsite: URL形式]
    C --> C4[toolCategory: 9種類から選択]
    
    E --> E1[emoji: 絵文字のみ]
    E --> E2[icon: ファイルパス形式]
    
    F --> F1[categories: 1-3個]
    F --> F2[tags: 最大10個]
    
    H --> H1[keywords: 最大15個]
    H --> H2[relatedTools: 最大10個]
```

## 🔧 設定変更ガイド

### よくある設定変更

#### 1. 文字数制限の変更
```typescript
// LIMITS オブジェクトの値を変更
const LIMITS = {
  TITLE_MAX: 100,  // 100 → 150 に変更
  // ...
} as const;
```

#### 2. デフォルト値の変更
```typescript
// DEFAULTS オブジェクトの値を変更
const DEFAULTS = {
  AUTHOR: 'Tim GoRakuDo',  // 新しい作者名に変更
  // ...
} as const;
```

#### 3. 選択肢の追加・変更
```typescript
// z.enum() の配列に項目を追加
toolCategory: z.enum([
  'flashcard',
  'reading',
  'new-category',  // 新しいカテゴリを追加
  // ...
])
```

#### 4. 新しいフィールドの追加
```typescript
// 各コレクションのschemaに新しいフィールドを追加
schema: z.object({
  // 既存のフィールド...
  newField: z.string().optional(),  // 新しいフィールドを追加
})
```

## ⚠️ 変更時の注意事項

1. **既存コンテンツの確認**: 変更前に既存のコンテンツファイルが新しい設定に準拠しているか確認
2. **ビルドテスト**: 変更後は必ず `npm run build` でビルドテストを実行
3. **破壊的変更**: 必須フィールドの追加など、破壊的変更の場合は既存コンテンツの更新が必要
4. **バックアップ**: 重要な変更前は設定ファイルのバックアップを取る

## 📞 サポート

設定変更で不明な点がある場合は、技術チームにご相談ください。

## 🔗 関連リンク

- [Astro Content Collections公式ドキュメント](https://docs.astro.build/ja/guides/content-collections/)
- [Zodバリデーションライブラリ](https://zod.dev/)
- [GoRakuDoプロジェクトメインREADME](../README.md)
