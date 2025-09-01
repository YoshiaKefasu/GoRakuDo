<!-- Powered by BMAD™ Core -->

# Story 2: HeadSEO.astroとBasicSEO.astroの実装

## Status

**🎯 READY FOR IMPLEMENTATION** - 基本コンポーネントの実装
**📋 REQUIREMENTS DEFINED** - Story 1の型定義システム完了
**🔧 TECHNICAL SPECIFICATION** - 2つの基本コンポーネントの実装仕様完了

## Story

**As a** 開発者,
**I want** HeadSEO.astroとBasicSEO.astroの2つの基本コンポーネントを実装する,
**So that** 基本的なHTML head要素とSEO特化機能が分離され、独立して動作するコンポーネントが利用できる.

## 高校生向け説明

### 🎯 何をやるの？

Story 1で作った設計図を使って、実際に動くコンポーネントを2つ作るんだ。

**2つのコンポーネントって何？**
1. **HeadSEO.astro** - 基本的なHTML head要素（タイトル、説明、ファビコンなど）
2. **BasicSEO.astro** - SEO特化機能（キーワード、Open Graph、Twitter Cardなど）

**なぜ2つに分けるの？**
- 責任を明確にする（単一責任の原則）
- 必要な機能だけを使える（柔軟性）
- テストしやすく、保守しやすい（保守性）

### 🔧 どうやって実装するの？

1. **HeadSEO.astroの実装**: 基本的なHTML head要素のみ
2. **BasicSEO.astroの実装**: SEO特化機能とキーワード管理
3. **基本的な連携テスト**: 2つのコンポーネントが正しく連携するかテスト
4. **エラーハンドリング**: 開発環境でのエラー表示機能

## Acceptance Criteria

### **HeadSEO.astro実装要件**

1. **基本的なHTML head要素の実装**
   - HTML lang属性の設定
   - charset、viewportメタタグ
   - 基本的なタイトルと説明
   - 基本的なファビコンとリソースヒント

2. **Props interfaceの実装**
   - Story 1で定義したHeadSEOProps型の使用
   - 適切なデフォルト値の設定
   - オプショナルプロパティの処理

3. **スロット機能の実装**
   - 他のコンポーネントが挿入されるスロット
   - メインコンテンツとフッター用のスロット

### **BasicSEO.astro実装要件**

4. **SEO特化機能の基本実装**
   - キーワード管理機能の統合
   - Open Graph メタタグの生成
   - Twitter Card メタタグの生成

5. **キーワード検証システムの統合**
   - Story 1で作成したNewSEOKeywordValidatorの使用
   - バリデーション結果の表示（開発環境のみ）
   - エラーと警告の適切な処理

6. **構造化データの実装**
   - Schema.org準拠の構造化データ生成
   - 記事タイプと学習段階の反映
   - 検索意図の反映

### **連携機能要件**

7. **基本的な連携テスト**
   - HeadSEO.astroとBasicSEO.astroの連携
   - Propsの受け渡しの確認
   - スロットの動作確認

8. **エラーハンドリング**
   - 必須プロパティの欠如時の処理
   - 無効なキーワードの処理
   - 開発環境でのエラー表示

## General Principles

### 1. 単一責任の原則
- HeadSEO.astroは基本的なHTML head要素のみ担当
- BasicSEO.astroはSEO特化機能のみ担当
- 各コンポーネントの責任を明確に分離

### 2. 型安全性の確保
- Story 1で定義した型定義を厳密に使用
- プロパティの型チェックを徹底
- ランタイムエラーを防ぐ実装

### 3. 開発者体験の向上
- 開発環境でのエラー表示
- 直感的なプロパティ設定
- 適切なデフォルト値の提供

### 4. パフォーマンスの最適化
- 必要な機能のみ読み込み
- 効率的なメタタグ生成
- 不要な処理の回避

## 🚫 DEV AGENT制約事項（MANDATORY）

### 🚨 絶対禁止事項
- **既存コンポーネントの変更**: 既存のコンポーネントは一切変更しない
- **新規ライブラリの導入**: 既存のAstro.js以外のフレームワークは使用しない
- **既存ファイル構造の変更**: 既存のディレクトリ構造は変更しない
- **古いシステムの併用**: 古いSEOシステムとの併用は禁止
- **CommonJSの使用**: `require`/`module.exports`の使用は絶対禁止
- **Strict TypeScript mode違反**: 暗黙的な`any`型、暗黙的な戻り値型は禁止
- **テストアーティファクトの残存**: 一時ファイル、モックデータ、デバッグコードの残存は禁止

### ✅ 許可される作業
- **新規コンポーネントの作成**: `src/components/public-components/`に新規ファイル作成
- **Story 1の型定義の使用**: 新しく作成した型定義システムの使用
- **新規ユーティリティの使用**: Story 1で作成したキーワード検証とメタデータ管理クラスの使用
- **既存ディレクトリ構造の活用**: 既存の`src/components/public-components/`ディレクトリを使用

## 🔧 実装ガイド

### **ファイル構造**
```
src/components/public-components/
├── HeadSEO.astro           # 基本的なHTML head要素
├── BasicSEO.astro          # SEO特化機能
└── __tests__/              # テストファイル
    ├── HeadSEO.test.ts
    └── BasicSEO.test.ts

src/utils/new-seo-system/
├── common-helpers.ts       # 共通ユーティリティ関数（DRY原則）
├── seo-helpers.ts          # SEO特化ヘルパー関数
└── keyword-validator.ts    # キーワード検証クラス
```

### **実装順序**
1. **HeadSEO.astroの基本実装**
2. **BasicSEO.astroの基本実装**
3. **キーワード検証システムの統合**
4. **基本的な連携テスト**
5. **エラーハンドリングの実装**
6. **テストアーティファクトのクリーンアップ（MANDATORY）**

### **技術的考慮事項**
- **Astro.jsの特性**: サーバーサイドレンダリングとクライアントサイドの最適化
- **型安全性**: Story 1で定義した型定義の厳密な使用
- **パフォーマンス**: 不要な処理の回避と効率的なレンダリング
- **アクセシビリティ**: セマンティックなHTMLとARIA属性の適切な使用

### **coding-standards.md準拠の実装原則（MANDATORY）**

#### 1. DRY原則の適用（MANDATORY）
```typescript
// ✅ Good - 共通のユーティリティ関数を作成（DRY原則）
// src/utils/new-seo-system/common-helpers.ts
export const generateMetaTag = (name: string, content: string): string => {
  return `<meta name="${name}" content="${content}" />`;
};

export const generateLinkTag = (rel: string, href: string, type?: string): string => {
  const typeAttr = type ? ` type="${type}"` : '';
  return `<link rel="${rel}" href="${href}"${typeAttr} />`;
};

// ❌ Bad - 各コンポーネントで重複したメタタグ生成（DRY原則違反）
// HeadSEO.astro
const metaTag = `<meta name="description" content="${description}" />`;

// BasicSEO.astro
const metaTag = `<meta name="description" content="${description}" />`;
```

#### 2. KISS原則の適用（MANDATORY）
```astro
<!-- ✅ Good - シンプルで理解しやすいコンポーネント構造（KISS原則） -->
---
// 1. Imports (外部ライブラリ、内部モジュール、型定義の順)
import type { HeadSEOProps } from '@/types/new-seo-system';
import { generateMetaTag, generateLinkTag } from '@/utils/new-seo-system/common-helpers';

// 2. Props interface (型安全性の確保)
interface Props extends HeadSEOProps {
  // 追加のプロパティ
}

// 3. Props destructuring with defaults
const {
  title = "GoRakuDo",
  description = "日本語学習プラットフォーム",
  lang = "ja",
  canonicalUrl,
  favicon = "/favicon.svg"
}: Props = Astro.props;

// 4. Simple utility functions (KISS principle)
const generateFaviconTags = (faviconPath: string): string => {
  return generateLinkTag('icon', faviconPath, 'image/svg+xml');
};
---

<!-- 5. Template (シンプルで読みやすい) -->
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
    
    {generateFaviconTags(favicon)}
    {canonicalUrl && generateLinkTag('canonical', canonicalUrl)}
    
    <slot name="additional-head" />
  </head>
  <body>
    <slot />
    <slot name="footer" />
  </body>
</html>
```

#### 3. ES Modulesの必須使用（MANDATORY）
```typescript
// ✅ Good - ES Modules (MANDATORY)
import type { BasicSEOProps } from '@/types/new-seo-system';
import { NewSEOKeywordValidator } from '@/utils/new-seo-system/keyword-validator';
import { generateMetaTag, generateStructuredData } from '@/utils/new-seo-system/seo-helpers';

// ❌ Bad - CommonJS (NOT ALLOWED)
const { BasicSEOProps } = require('@/types/new-seo-system');
const NewSEOKeywordValidator = require('@/utils/new-seo-system/keyword-validator');
```

#### 4. Strict TypeScript Modeの必須使用（MANDATORY）
```typescript
// ✅ Good - Strict TypeScript Mode (MANDATORY)
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  optimizedKeywords: string[];
}

// 明示的な型注釈（strict mode要件）
function validateKeywords(keywords: string[]): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    optimizedKeywords: []
  };
  
  // キーワードの検証ロジック
  keywords.forEach((keyword: string) => {
    if (keyword.length < 2) {
      result.errors.push(`キーワード "${keyword}" が短すぎます（2文字以上必要）`);
      result.isValid = false;
    } else if (keyword.length > 50) {
      result.warnings.push(`キーワード "${keyword}" が長すぎます（50文字以下推奨）`);
    } else {
      result.optimizedKeywords.push(keyword);
    }
  });
  
  return result;
}

// ❌ Bad - Implicit any (NOT ALLOWED in strict mode)
function validateKeywords(keywords) { // 型注釈なし
  // 実装
}
```

#### 5. テストアーティファクトのクリーンアップ（MANDATORY）
```typescript
// ✅ Good - テスト完了後のクリーンアップ（MANDATORY）
describe('SEO Component Tests', () => {
  afterEach(() => {
    // テストアーティファクトのクリーンアップ
    // 一時ファイル、モックデータ、デバッグコードの削除
    cleanup();
  });
  
  afterAll(() => {
    // 最終クリーンアップ
    // テスト環境の完全クリーンアップ
    finalCleanup();
  });
});

// ❌ Bad - テストアーティファクトの残存（NOT ALLOWED）
// 一時ファイル、モックデータ、デバッグコードが残存
```

## 📋 詳細実装仕様

### **HeadSEO.astroの詳細実装（coding-standards.md準拠）**
```astro
---
// ========== IMPORTS ==========
// External libraries (things we download from the internet)
import type { HeadSEOProps } from '@/types/new-seo-system';

// Internal utilities (things we made ourselves)
import { generateMetaTag, generateLinkTag } from '@/utils/new-seo-system/common-helpers';

// ========== PROPS INTERFACE ==========
// Extends HeadSEOProps for additional functionality
interface Props extends HeadSEOProps {
  // 追加のプロパティ
}

// ========== PROPS DESTRUCTURING ==========
// Clear default values for better developer experience
const {
  title = "GoRakuDo",
  description = "日本語学習プラットフォーム",
  lang = "ja",
  canonicalUrl,
  favicon = "/favicon.svg",
  resourceHints = {}
}: Props = Astro.props;

// ========== UTILITY FUNCTIONS ==========
// Simple, focused functions (KISS principle)
const generateFaviconTags = (faviconPath: string): string => {
  return generateLinkTag('icon', faviconPath, 'image/svg+xml');
};

const generateResourceHintTags = (hints: any): string[] => {
  const tags: string[] = [];
  
  if (hints.preload) {
    hints.preload.forEach((resource: string) => {
      tags.push(generateLinkTag('preload', resource, 'style'));
    });
  }
  
  return tags;
};

// ファビコンの設定
const faviconTags = generateFaviconTags(favicon);

// リソースヒントの生成
const resourceHintTags = generateResourceHintTags(resourceHints);
---

<!-- ========== HTML TEMPLATE ========== -->
<html lang={lang}>
  <head>
    <!-- ========== BASIC META TAGS ========== -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
    
    <!-- ========== CANONICAL URL ========== -->
    {canonicalUrl && generateLinkTag('canonical', canonicalUrl)}
    
    <!-- ========== FAVICON ========== -->
    <Fragment set:html={faviconTags} />
    
    <!-- ========== RESOURCE HINTS ========== -->
    {resourceHintTags.map(tag => (
      <Fragment set:html={tag} />
    ))}
    
    <!-- ========== ADDITIONAL HEAD SLOT ========== -->
    <slot name="additional-head" />
  </head>
  <body>
    <!-- ========== MAIN CONTENT SLOT ========== -->
    <slot />
    
    <!-- ========== FOOTER SLOT ========== -->
    <slot name="footer" />
  </body>
</html>
```

### **BasicSEO.astroの詳細実装（DRY原則とKISS原則の両立）**
```astro
---
// ========== IMPORTS ==========
// Type definitions
import type { BasicSEOProps } from '@/types/new-seo-system';

// Utility classes
import { NewSEOKeywordValidator } from '@/utils/new-seo-system/keyword-validator';

// Helper functions
import { 
  generateMetaTag, 
  generateOpenGraphTags, 
  generateTwitterCardTags,
  generateStructuredData 
} from '@/utils/new-seo-system/seo-helpers';

// ========== PROPS INTERFACE ==========
interface Props extends BasicSEOProps {
  // 追加のプロパティ
}

// ========== PROPS DESTRUCTURING ==========
const {
  title,
  description,
  primaryKeywords = [],
  longTailKeywords = [],
  articleKeywords = [],
  categoryKeywords = [],
  seoProperties = {},
  socialMedia = {}
}: Props = Astro.props;

// ========== KEYWORD VALIDATION ==========
// Use the validator class for consistent validation (DRY principle)
const validator = new NewSEOKeywordValidator();
const validationResult = validator.validateAll({
  primary: primaryKeywords,
  longTail: longTailKeywords,
  article: articleKeywords,
  category: categoryKeywords
});

// ========== DEVELOPMENT ENVIRONMENT WARNINGS ==========
// Show validation warnings only in development (KISS principle)
if (import.meta.env.DEV && !validationResult.isValid) {
  console.warn('🚨 SEO Validation Warnings:', validationResult.warnings);
  console.warn('💡 SEO Suggestions:', validationResult.suggestions);
}

// ========== META TAG GENERATION ==========
// Generate meta tags using utility functions (DRY principle)
const metaTags = generateMetaTag('keywords', validationResult.optimizedKeywords.join(', '));

// ========== STRUCTURED DATA GENERATION ==========
// Generate structured data for search engines
const structuredData = generateStructuredData({
  title,
  description,
  keywords: validationResult.optimizedKeywords,
  seoProperties
});
---

<!-- ========== SEO META TAGS ========== -->
<Fragment set:html={metaTags} />

<!-- ========== STRUCTURED DATA ========== -->
<script type="application/ld+json" set:html={JSON.stringify(structuredData)} />

<!-- ========== OPEN GRAPH TAGS ========== -->
{socialMedia.openGraph && (
  <Fragment set:html={generateOpenGraphTags(socialMedia.openGraph)} />
)}

<!-- ========== TWITTER CARD TAGS ========== -->
{socialMedia.twitterCard && (
  <Fragment set:html={generateTwitterCardTags(socialMedia.twitterCard)} />
)}

<!-- ========== DEVELOPMENT ENVIRONMENT WARNINGS ========== -->
{import.meta.env.DEV && !validationResult.isValid && (
  <div class="seo-validation-warnings" style="display: none;">
    <h3>🚨 SEO Validation Warnings</h3>
    <ul>
      {validationResult.warnings.map(warning => (
        <li>{warning}</li>
      ))}
    </ul>
    <h4>💡 SEO Suggestions</h4>
    <ul>
      {validationResult.suggestions.map(suggestion => (
        <li>{suggestion}</li>
      ))}
    </ul>
  </div>
)}
```

### **共通ユーティリティ関数の実装（DRY原則の実践）**
```typescript
// src/utils/new-seo-system/common-helpers.ts
// ========== COMMON HELPER FUNCTIONS ==========
// Centralized utility functions to avoid duplication (DRY principle)

/**
 * Generate meta tag with proper escaping
 * @param name - Meta tag name
 * @param content - Meta tag content
 * @returns HTML string for meta tag
 */
export const generateMetaTag = (name: string, content: string): string => {
  const escapedContent = content.replace(/"/g, '&quot;');
  return `<meta name="${name}" content="${escapedContent}" />`;
};

/**
 * Generate link tag with optional type
 * @param rel - Link relationship
 * @param href - Link URL
 * @param type - Optional MIME type
 * @returns HTML string for link tag
 */
export const generateLinkTag = (rel: string, href: string, type?: string): string => {
  const typeAttr = type ? ` type="${type}"` : '';
  return `<link rel="${rel}" href="${href}"${typeAttr} />`;
};

/**
 * Generate preload tag for performance optimization
 * @param href - Resource URL
 * @param as - Resource type
 * @returns HTML string for preload tag
 */
export const generatePreloadTag = (href: string, as: string): string => {
  return `<link rel="preload" href="${href}" as="${as}" />`;
};

// ========== SEO HELPER FUNCTIONS ==========
// SEO-specific utility functions

/**
 * Generate Open Graph meta tags
 * @param config - Open Graph configuration
 * @returns Array of HTML strings for Open Graph tags
 */
export const generateOpenGraphTags = (config: any): string[] => {
  const tags: string[] = [];
  
  if (config.title) {
    tags.push(`<meta property="og:title" content="${config.title}" />`);
  }
  
  if (config.description) {
    tags.push(`<meta property="og:description" content="${config.description}" />`);
  }
  
  if (config.type) {
    tags.push(`<meta property="og:type" content="${config.type}" />`);
  }
  
  if (config.image) {
    tags.push(`<meta property="og:image" content="${config.image}" />`);
  }
  
  return tags;
};

/**
 * Generate Twitter Card meta tags
 * @param config - Twitter Card configuration
 * @returns Array of HTML strings for Twitter Card tags
 */
export const generateTwitterCardTags = (config: any): string[] => {
  const tags: string[] = [];
  
  if (config.card) {
    tags.push(`<meta name="twitter:card" content="${config.card}" />`);
  }
  
  if (config.title) {
    tags.push(`<meta name="twitter:title" content="${config.title}" />`);
  }
  
  if (config.description) {
    tags.push(`<meta name="twitter:description" content="${config.description}" />`);
  }
  
  return tags;
};
```

## 📋 完了条件

### **必須完了項目**
1. ✅ HeadSEO.astroの実装完了
2. ✅ BasicSEO.astroの実装完了
3. ✅ 基本的な連携テスト完了
4. ✅ エラーハンドリングの実装完了
5. ✅ TypeScript型チェックの確認完了
6. ✅ 基本的なビルドテスト完了
7. ✅ 基本的なレンダリングテスト完了
8. ✅ テストアーティファクトのクリーンアップ完了（MANDATORY）

### **品質基準（coding-standards.md準拠）**
- TypeScript型エラー：0件（Strict Mode必須）
- ES Modules使用率：100%（CommonJS禁止）
- DRY原則適用確認：重複コード0件
- KISS原則適用確認：過度な抽象化なし
- テストアーティファクト：一時ファイル・モックデータ・デバッグコード0件
- ビルド成功率：100%
- 基本的なレンダリング：正常動作
- エラーハンドリング：適切な動作

## 🎯 次のステップ

このStory 2が完了したら、次のStory 3（MetaManager.astroの実装と統合）に進みます。

---

**完了**: Story 2（HeadSEO.astroとBasicSEO.astroの実装）の定義完了
