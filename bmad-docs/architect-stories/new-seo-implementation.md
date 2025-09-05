<!-- Powered by BMAD™ Core -->

# New SEO Implementation: 3つのコンポーネント分離設計

## Status

**🚀 READY FOR IMPLEMENTATION** - 3つのコンポーネント分離による新しいSEO実装プロジェクト
**🎯 PLANNED** - 段階的実装計画、コンポーネント分離、責任の明確化
**📋 REQUIREMENTS DEFINED** - 新しい設計思想による要件定義完了
**⚠️ CRITICAL WARNING** - 既存システムの完全置き換え戦略

## Story

**As a** コンテンツ作成者,
**I want** 3つのコンポーネントに分離された新しいSEOシステムを構築する,
**So that** 責任の分離、柔軟性、保守性を実現し、必要に応じて機能を組み合わせられるシステムを構築できる.

## 高校生向け説明

### 🎯 何をやるの？

既存のHeadSEO.astroを3つのコンポーネントに分離して、それぞれが明確な責任を持つシステムを作るんだ。

**3つのコンポーネントって何？**
1. **HeadSEO.astro** - 基本的なHTML head要素のみ担当
2. **BasicSEO.astro** - SEO特化機能（キーワード、メタタグ、構造化データ）
3. **MetaManager.astro** - 高度なメタデータ管理（パフォーマンス、セキュリティ、アナリティクス）

**なぜ分離するの？**
- 責任を明確にする（単一責任の原則）
- 必要な機能だけを使える（柔軟性）
- テストしやすく、保守しやすい（保守性）
- パフォーマンスを向上させる（効率性）

### 🔧 どうやって実装するの？

1. **既存システムの完全削除**: 古いHeadSEO.astro、seo-optimizer.ts、metadata-loader.tsを完全に削除
2. **3つのコンポーネント実装**: それぞれが独立して動作するコンポーネントを作成
3. **段階的統合**: 基本機能から高度な機能まで段階的に統合
4. **完全置き換え**: 古いシステムとの併用なしで、完全に新しいシステムに移行

## 🚨 CRITICAL WARNING: 古いシステムの完全置き換え戦略

### ⚠️ 置き換え対象の古いシステム

**1. 古い型定義システム（src/types/）**
- **置き換え対象**: base-integration.ts、fallback-system.ts、metadata-input.ts
- **理由**: 古い設計思想に基づいており、現代的なAstroシステムとの互換性が低い
- **新システム**: 新しい3つのコンポーネント用の型定義システムで完全置き換え

**2. 古いSEO最適化システム（src/utils/ai/seo-optimizer.ts）**
- **置き換え対象**: SEOOptimizerクラスの古いメソッド
- **理由**: AI依存の複雑なシステムで、手動管理の柔軟性が不足
- **新システム**: 手動キーワード管理に特化したBasicSEOシステム

**3. 古いメタデータ管理システム（src/utils/metadata-loader.ts）**
- **置き換え対象**: 古いメタデータ読み込み・処理ロジック
- **理由**: 複雑で保守性が低く、新しいAstroコンポーネントとの統合が困難
- **新システム**: 3つのコンポーネントによる段階的メタデータ管理システム

### 🔒 新システム構築と古いシステムの置き換え

**1. 新しい3つのコンポーネントシステム**
- **作成**: `src/components/public-components/HeadSEO.astro`（基本的なHTML head要素）
- **作成**: `src/components/public-components/BasicSEO.astro`（SEO特化機能）
- **作成**: `src/components/public-components/MetaManager.astro`（高度なメタデータ管理）
- **置き換え**: 古いHeadSEO.astroを3つのコンポーネントで完全置き換え

**2. 新しい型定義システム**
- **作成**: `src/types/new-seo-system.ts`（3つのコンポーネント用の統合型定義）
- **置き換え**: 古い型定義システムを新しいシステムで完全置き換え
- **統合**: 各コンポーネントの責任を明確に定義

**3. 新しいSEO最適化システム**
- **作成**: `src/utils/new-seo-optimizer.ts`（3つのコンポーネント連携システム）
- **置き換え**: 古いAI依存システムを新しい手動管理システムで置き換え
- **統合**: 3つのコンポーネントの連携による最適化

### 🚫 古いシステムの完全置き換えルール

**1. 古いファイルの完全削除**
```bash
# 古いシステムの完全削除
rm src/components/public-components/HeadSEO.astro
rm src/utils/ai/seo-optimizer.ts
rm src/utils/metadata-loader.ts
rm src/types/base-integration.ts
rm src/types/fallback-system.ts
rm src/types/metadata-input.ts
```

**2. 新しい3つのコンポーネントの作成**
```bash
# 新しい3つのコンポーネントの作成
touch src/components/public-components/HeadSEO.astro
touch src/components/public-components/BasicSEO.astro
touch src/components/public-components/MetaManager.astro
```

## 🎨 3つのコンポーネント分離設計

### **1. HeadSEO.astro（基本的なHTML head要素）**

**責任**: 基本的なHTML head要素のみを担当
**機能**: 
- HTML lang属性の設定
- 基本的なメタタグ（charset、viewport）
- 基本的なタイトルと説明
- 基本的なファビコン
- 基本的なリソースヒント

**使用場面**: シンプルなページ、基本的なSEOのみ必要なページ

### **2. BasicSEO.astro（SEO特化機能）**

**責任**: SEO関連のメタタグと構造化データを担当
**機能**:
- キーワード管理と検証
- Open Graph メタタグ
- Twitter Card メタタグ
- 構造化データ（Schema.org）
- 基本的なSEO最適化

**使用場面**: SEO重視のページ、検索エンジン最適化が必要なページ

### **3. MetaManager.astro（高度なメタデータ管理）**

**責任**: 高度なメタデータ管理と最適化を担当
**機能**:
- 高度なメタデータ設定
- パフォーマンス最適化（preload、prefetch）
- セキュリティヘッダー（CSP、HSTS）
- アナリティクス統合
- 高度なSEO設定

**使用場面**: 高度な機能が必要なページ、パフォーマンスとセキュリティが重要なページ

## 🔄 段階的実装計画

### **Phase 1: 基本設計と型定義（1週間）**
- 3つのコンポーネントの詳細設計
- 新しい型定義システムの構築
- コンポーネント間の連携設計

### **Phase 2: 基本コンポーネント実装（1週間）**
- HeadSEO.astroの実装
- BasicSEO.astroの実装
- 基本的な連携テスト

### **Phase 3: 高度機能実装（1週間）**
- MetaManager.astroの実装
- 3つのコンポーネントの完全統合
- パフォーマンス最適化

### **Phase 4: テストと品質保証（1週間）**
- 包括的なテスト実装
- 品質基準の確認
- ドキュメント作成

## 📊 期待される効果

### **1. 責任の分離**
- 各コンポーネントが明確な責任を持つ
- 単一責任の原則の実現
- テストしやすい構造

### **2. 柔軟性の向上**
- 必要に応じて機能を組み合わせ可能
- シンプルなページから高度なページまで対応
- 段階的な機能追加が容易

### **3. 保守性の向上**
- 各コンポーネントが独立して動作
- 機能追加・変更が容易
- バグの特定と修正が簡単

### **4. パフォーマンスの向上**
- 必要な機能のみ読み込み
- 不要な処理を回避
- 効率的なリソース管理

---

**次の段階**: 詳細な技術仕様と実装手順の定義

## 🔧 詳細な技術仕様

### **1. 新しい型定義システム**

```typescript
// src/types/new-seo-system.ts（新規作成）
export interface HeadSEOProps {
  // 基本的なHTML head要素用
  title?: string;
  description?: string;
  lang?: "ja" | "id";
  canonicalUrl?: string;
  favicon?: string;
}

export interface BasicSEOProps {
  // 基本SEO（必須・手動入力）
  title: string;
  description: string;
  
  // キーワード管理（手動入力）
  primaryKeywords: string[];      // 主要キーワード（5個まで）
  longTailKeywords?: string[];    // ロングテールキーワード（10個まで）
  articleKeywords?: string[];     // 記事固有キーワード（5個まで）
  categoryKeywords?: string[];    // カテゴリキーワード（手動入力）
  
  // SEOProperty（手動入力）
  seoProperty?: {
    articleType: "guide" | "methodology" | "tool" | "theory";
    learningStage: "alphabet" | "basic-grammar" | "intermediate" | "advanced";
    searchIntent: "informational" | "navigational" | "transactional";
  };
  
  // 基本設定（手動入力）
  ogImage?: ImageMetadata;
  pageType?: "website" | "article";
  publishedDate?: string;
  modifiedDate?: string;
  authorName?: string;
}

export interface MetaManagerProps {
  // 高度なメタデータ設定
  advancedMeta?: {
    robots?: string;
    themeColor?: string;
    colorScheme?: "light" | "dark" | "light dark";
    viewport?: string;
  };
  
  // パフォーマンス最適化
  performanceOptimization?: {
    preload?: Array<{ href: string; as: string; type?: string }>;
    prefetch?: Array<{ href: string; as: string }>;
    dnsPrefetch?: string[];
    preconnect?: string[];
  };
  
  // セキュリティヘッダー
  securityHeaders?: {
    csp?: string;
    hsts?: string;
    referrerPolicy?: string;
    permissionsPolicy?: string;
  };
  
  // アナリティクス
  analytics?: {
    gtag?: string;
    gtm?: string;
    facebook?: string;
    twitter?: string;
  };
  
  // 高度なSEO設定
  advancedSEO?: {
    alternateLanguages?: Array<{ lang: string; url: string }>;
    structuredData?: Record<string, any>;
    breadcrumbs?: Array<{ name: string; url: string }>;
  };
}

// 統合型定義
export interface IntegratedSEOProps {
  headSEO?: HeadSEOProps;
  basicSEO?: BasicSEOProps;
  metaManager?: MetaManagerProps;
}
```

### **2. 新しいキーワード検証システム**

```typescript
// src/utils/new-seo-keyword-validator.ts（新規作成）
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  optimizedKeywords: string[];
  suggestions: string[];
}

export class NewSEOKeywordValidator {
  validateKeywords(keywords: string[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    
    // 長さチェック
    keywords.forEach((keyword, index) => {
      if (keyword.length < 2) {
        errors.push(`キーワード${index + 1}が短すぎます: ${keyword}`);
        suggestions.push(`2文字以上のキーワードを使用してください`);
      }
      if (keyword.length > 50) {
        warnings.push(`キーワード${index + 1}が長すぎます: ${keyword}`);
        suggestions.push(`50文字以内のキーワードに短縮することを推奨します`);
      }
    });
    
    // 重複チェック
    const duplicates = keywords.filter((item, index) => keywords.indexOf(item) !== index);
    if (duplicates.length > 0) {
      warnings.push(`重複キーワード: ${duplicates.join(', ')}`);
      suggestions.push(`重複キーワードを除去してください`);
    }
    
    // 個数チェック
    if (keywords.length > 10) {
      warnings.push('キーワード数が多すぎます（推奨: 10個まで）');
      suggestions.push(`上位10個のキーワードに絞り込むことを推奨します`);
    }
    
    // 日本語文字チェック
    const japaneseKeywords = keywords.filter(k => /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(k));
    if (japaneseKeywords.length === 0) {
      warnings.push('日本語キーワードが含まれていません');
      suggestions.push('日本語キーワードを含めることを推奨します');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      optimizedKeywords: this.optimizeKeywords(keywords)
    };
  }
  
  optimizeKeywords(keywords: string[]): string[] {
    // 重複除去
    const uniqueKeywords = [...new Set(keywords)];
    
    // 長さフィルタリング（2文字以上50文字以下）
    const filteredKeywords = uniqueKeywords.filter(k => 
      k.length >= 2 && k.length <= 50
    );
    
    // 個数制限（10個まで）
    return filteredKeywords.slice(0, 10);
  }
  
  generateKeywordSuggestions(content: string): string[] {
    // コンテンツからキーワード候補を生成（オプション機能）
    const words = content.split(/\s+/).filter(word => word.length >= 2);
    const wordCount = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }
}
```

### **3. 新しいメタデータ管理システム**

```typescript
// src/utils/new-seo-meta-manager.ts（新規作成）
export interface MetaGenerationResult {
  metaTags: string[];
  structuredData: string;
  performanceHints: string[];
  securityHeaders: Record<string, string>;
}

export class NewSEOMetaManager {
  generateMetaTags(props: MetaManagerProps): MetaGenerationResult {
    const metaTags: string[] = [];
    const performanceHints: string[] = [];
    const securityHeaders: Record<string, string> = {};
    
    // 高度なメタデータ生成
    if (props.advancedMeta) {
      if (props.advancedMeta.robots) {
        metaTags.push(`<meta name="robots" content="${props.advancedMeta.robots}">`);
      }
      if (props.advancedMeta.themeColor) {
        metaTags.push(`<meta name="theme-color" content="${props.advancedMeta.themeColor}">`);
      }
      if (props.advancedMeta.colorScheme) {
        metaTags.push(`<meta name="color-scheme" content="${props.advancedMeta.colorScheme}">`);
      }
    }
    
    // パフォーマンス最適化
    if (props.performanceOptimization) {
      if (props.performanceOptimization.preload) {
        props.performanceOptimization.preload.forEach(resource => {
          metaTags.push(`<link rel="preload" href="${resource.href}" as="${resource.as}"${resource.type ? ` type="${resource.type}"` : ''}>`);
        });
        performanceHints.push('リソースの事前読み込みが設定されています');
      }
      
      if (props.performanceOptimization.dnsPrefetch) {
        props.performanceOptimization.dnsPrefetch.forEach(domain => {
          metaTags.push(`<link rel="dns-prefetch" href="${domain}">`);
        });
        performanceHints.push('DNS事前解決が設定されています');
      }
    }
    
    // セキュリティヘッダー
    if (props.securityHeaders) {
      if (props.securityHeaders.csp) {
        securityHeaders['Content-Security-Policy'] = props.securityHeaders.csp;
      }
      if (props.securityHeaders.hsts) {
        securityHeaders['Strict-Transport-Security'] = props.securityHeaders.hsts;
      }
    }
    
    // アナリティクス
    if (props.analytics) {
      if (props.analytics.gtag) {
        metaTags.push(`<script async src="https://www.googletagmanager.com/gtag/js?id=${props.analytics.gtag}"></script>`);
        metaTags.push(`
          <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${props.analytics.gtag}');
          </script>
        `);
      }
    }
    
    return {
      metaTags,
      structuredData: this.generateStructuredData(props),
      performanceHints,
      securityHeaders
    };
  }
  
  private generateStructuredData(props: MetaManagerProps): string {
    if (!props.advancedSEO?.structuredData) {
      return '';
    }
    
    return `<script type="application/ld+json">${JSON.stringify(props.advancedSEO.structuredData)}</script>`;
  }
}
```

## 🚀 実装手順（詳細版）

### **Phase 1: 基本設計と型定義（1週間）**

**Day 1: 型定義システムの構築**
- [ ] `src/types/new-seo-system.ts`の作成
- [ ] HeadSEOProps、BasicSEOProps、MetaManagerPropsの定義
- [ ] IntegratedSEOPropsの統合型定義
- [ ] TypeScript型チェックの確認

**Day 2: キーワード検証システムの設計**
- [ ] `src/utils/new-seo-keyword-validator.ts`の設計
- [ ] ValidationResultインターフェースの定義
- [ ] キーワード最適化アルゴリズムの設計
- [ ] 日本語文字チェック機能の設計

**Day 3: メタデータ管理システムの設計**
- [ ] `src/utils/new-seo-meta-manager.ts`の設計
- [ ] MetaGenerationResultインターフェースの定義
- [ ] メタタグ生成ロジックの設計
- [ ] パフォーマンス最適化機能の設計

**Day 4: コンポーネント間連携の設計**
- [ ] 3つのコンポーネントの連携方法の設計
- [ ] Propsの受け渡し方法の設計
- [ ] エラーハンドリングの設計
- [ ] パフォーマンス監視の設計

**Day 5: 設計レビューと品質保証**
- [ ] 設計書の詳細レビュー
- [ ] 技術的実現可能性の確認
- [ ] パフォーマンス要件の確認
- [ ] セキュリティ要件の確認

### **Phase 2: 基本コンポーネント実装（1週間）**

**Day 1: HeadSEO.astroの実装**
- [ ] 基本的なHTML head要素の実装
- [ ] Props interfaceの実装
- [ ] 基本的なメタタグ生成の実装
- [ ] ファビコンとリソースヒントの実装

**Day 2: BasicSEO.astroの基本実装**
- [ ] SEO特化機能の基本実装
- [ ] キーワード管理機能の統合
- [ ] Open Graph メタタグの実装
- [ ] Twitter Card メタタグの実装

**Day 3: BasicSEO.astroの高度機能実装**
- [ ] 構造化データの実装
- [ ] キーワード検証システムの統合
- [ ] エラー表示機能の実装
- [ ] 警告表示機能の実装

**Day 4: 基本的な連携テスト**
- [ ] HeadSEO.astroとBasicSEO.astroの連携テスト
- [ ] Propsの受け渡しテスト
- [ ] 基本的なレンダリングテスト
- [ ] エラーハンドリングテスト

**Day 5: 基本機能の品質保証**
- [ ] TypeScript型チェックの確認
- [ ] 基本的なビルドテスト
- [ ] 基本的なレンダリングテスト
- [ ] ドキュメント作成

### **Phase 3: 高度機能実装（1週間）**

**Day 1: MetaManager.astroの基本実装**
- [ ] 高度なメタデータ管理の基本実装
- [ ] パフォーマンス最適化機能の実装
- [ ] セキュリティヘッダー機能の実装
- [ ] アナリティクス統合機能の実装

**Day 2: MetaManager.astroの高度機能実装**
- [ ] 高度なSEO設定機能の実装
- [ ] 構造化データの高度な生成
- [ ] パフォーマンス監視機能の実装
- [ ] セキュリティ監視機能の実装

**Day 3: 3つのコンポーネントの完全統合**
- [ ] 統合型定義の実装
- [ ] コンポーネント間の完全連携
- [ ] エラーハンドリングの統合
- [ ] パフォーマンス監視の統合

**Day 4: 高度な機能テスト**
- [ ] 3つのコンポーネントの統合テスト
- [ ] 高度な機能の動作確認
- [ ] パフォーマンステスト
- [ ] セキュリティテスト

**Day 5: パフォーマンス最適化**
- [ ] レンダリング時間の最適化
- [ ] メモリ使用量の最適化
- [ ] バンドルサイズの最適化
- [ ] キャッシュ戦略の最適化

### **Phase 4: テストと品質保証（1週間）**

**Day 1: 包括的なテスト実装**
- [ ] 単体テストの実装
- [ ] 統合テストの実装
- [ ] E2Eテストの実装
- [ ] パフォーマンステストの実装

**Day 2: 品質基準の確認**
- [ ] TypeScript型チェックの最終確認
- [ ] ビルド成功率の確認
- [ ] テストカバレッジの確認
- [ ] パフォーマンス基準の確認

**Day 3: セキュリティとセーフティの確認**
- [ ] セキュリティヘッダーの確認
- [ ] XSS対策の確認
- [ ] CSRF対策の確認
- [ ] インジェクション対策の確認

**Day 4: ドキュメント作成**
- [ ] 実装ガイドの作成
- [ ] 使用方法のドキュメント作成
- [ ] トラブルシューティングガイドの作成
- [ ] ベストプラクティスの作成

**Day 5: 最終品質保証**
- [ ] 全機能の最終動作確認
- [ ] 品質基準の最終確認
- [ ] ドキュメントの最終確認
- [ ] 運用準備の完了確認

---

**次の段階**: 具体的なコード実装例とテストケースの定義

## 💻 具体的なコード実装例

### **1. HeadSEO.astro（基本的なHTML head要素）**

```astro
---
// src/components/public-components/HeadSEO.astro
// 基本的なHTML head要素のみを担当

import type { HeadSEOProps } from '../../types/new-seo-system';

const { 
  title = "GoRakuDo",
  description = "日本語学習プラットフォーム",
  lang = "ja",
  canonicalUrl,
  favicon = "/favicon.svg"
}: HeadSEOProps = Astro.props;

// 基本的なメタタグの生成
const basicMetaTags = [
  { charset: "utf-8" },
  { name: "viewport", content: "width=device-width, initial-scale=1.0" },
  { name: "description", content: description },
  { name: "generator", content: "Astro" }
];

// 基本的なリソースヒント
const resourceHints = [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: true },
  { rel: "icon", type: "image/svg+xml", href: favicon }
];
---

<html lang={lang}>
<head>
  <!-- 基本的なメタタグ -->
  {basicMetaTags.map(tag => {
    if ('charset' in tag) {
      return <meta charset={tag.charset} />;
    } else {
      return <meta name={tag.name} content={tag.content} />;
    }
  })}
  
  <!-- タイトル -->
  <title>{title}</title>
  
  <!-- リソースヒント -->
  {resourceHints.map(hint => (
    <link rel={hint.rel} href={hint.href} {hint.crossorigin && { crossorigin: hint.crossorigin }} />
  ))}
  
  <!-- カノニカルURL -->
  {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
  
  <!-- スロット（他のコンポーネントが挿入される場所） -->
  <slot />
</head>
<body>
  <!-- メインコンテンツ -->
  <slot name="main" />
  
  <!-- フッター -->
  <slot name="footer" />
</body>
</html>
```

### **2. BasicSEO.astro（SEO特化機能）**

```astro
---
// src/components/public-components/BasicSEO.astro
// SEO関連のメタタグと構造化データを担当

import type { BasicSEOProps } from '../../types/new-seo-system';
import { NewSEOKeywordValidator } from '../../utils/new-seo-keyword-validator';

const {
  title,
  description,
  primaryKeywords = [],
  seoProperty,
  ogImage,
  pageType = 'article',
  publishedDate,
  modifiedDate,
  authorName = 'GoRakuDo'
}: BasicSEOProps = Astro.props;

// キーワード検証
const validator = new NewSEOKeywordValidator();
const validationResult = validator.validateKeywords(primaryKeywords);

// 構造化データの生成
const generateStructuredData = () => {
  const baseData = {
    "@context": "https://schema.org",
    "@type": seoProperty?.articleType || "Article",
    "headline": title,
    "description": description,
    "keywords": validationResult.optimizedKeywords.join(', '),
    "author": { "@type": "Person", "name": authorName },
    "publisher": { "@type": "Organization", "name": "GoRakuDo" }
  };
  
  if (publishedDate) {
    baseData.datePublished = publishedDate;
  }
  if (modifiedDate) {
    baseData.dateModified = modifiedDate;
  }
  
  return baseData;
};

const structuredData = generateStructuredData();

// Open Graph メタタグの生成
const generateOpenGraphTags = () => {
  const tags = [
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: pageType },
    { property: "og:site_name", content: "GoRakuDo" }
  ];
  
  if (ogImage) {
    tags.push({ property: "og:image", content: ogImage.src });
    tags.push({ property: "og:image:width", content: ogImage.width?.toString() });
    tags.push({ property: "og:image:height", content: ogImage.height?.toString() });
  }
  
  return tags;
};

const openGraphTags = generateOpenGraphTags();

// Twitter Card メタタグの生成
const generateTwitterCardTags = () => [
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: title },
  { name: "twitter:description", content: description },
  { name: "twitter:site", content: "@GoRakuDo" }
];

const twitterCardTags = generateTwitterCardTags();
---

<!-- SEO特化のメタタグ -->
<meta name="keywords" content={validationResult.optimizedKeywords.join(', ')} />
<meta name="author" content={authorName} />
<meta name="robots" content="index, follow" />

<!-- Open Graph -->
{openGraphTags.map(tag => (
  <meta property={tag.property} content={tag.content} />
))}

<!-- Twitter Card -->
{twitterCardTags.map(tag => (
  <meta name={tag.name} content={tag.content} />
))}

<!-- 構造化データ -->
<script type="application/ld+json" set:html={JSON.stringify(structuredData)} />

<!-- キーワード検証エラー表示（開発環境のみ） -->
{import.meta.env.DEV && validationResult.errors.length > 0 && (
  <div class="seo-validation-errors" style="display: none;">
    <h3>SEO設定エラー</h3>
    <ul>
      {validationResult.errors.map(error => <li>{error}</li>)}
    </ul>
  </div>
)}

<!-- キーワード検証警告表示（開発環境のみ） -->
{import.meta.env.DEV && validationResult.warnings.length > 0 && (
  <div class="seo-validation-warnings" style="display: none;">
    <h3>SEO設定警告</h3>
    <ul>
      {validationResult.warnings.map(warning => <li>{warning}</li>)}
    </ul>
  </div>
)}
```

### **3. MetaManager.astro（高度なメタデータ管理）**

```astro
---
// src/components/public-components/MetaManager.astro
// 高度なメタデータ管理と最適化を担当

import type { MetaManagerProps } from '../../types/new-seo-system';
import { NewSEOMetaManager } from '../../utils/new-seo-meta-manager';

const {
  advancedMeta,
  performanceOptimization,
  securityHeaders,
  analytics,
  advancedSEO
}: MetaManagerProps = Astro.props;

const metaManager = new NewSEOMetaManager();
const metaResult = metaManager.generateMetaTags({
  advancedMeta,
  performanceOptimization,
  securityHeaders,
  analytics,
  advancedSEO
});

// セキュリティヘッダーの設定
if (Object.keys(metaResult.securityHeaders).length > 0) {
  // Astro.config.mjsでセキュリティヘッダーを設定
  // または、サーバーサイドでヘッダーを設定
}
---

<!-- 高度なメタデータ -->
{metaResult.metaTags.map(tag => (
  <Fragment set:html={tag} />
))}

<!-- パフォーマンス最適化のヒント（開発環境のみ） -->
{import.meta.env.DEV && metaResult.performanceHints.length > 0 && (
  <div class="performance-hints" style="display: none;">
    <h3>パフォーマンス最適化ヒント</h3>
    <ul>
      {metaResult.performanceHints.map(hint => <li>{hint}</li>)}
    </ul>
  </div>
)}

<!-- セキュリティヘッダー情報（開発環境のみ） -->
{import.meta.env.DEV && Object.keys(metaResult.securityHeaders).length > 0 && (
  <div class="security-headers" style="display: none;">
    <h3>セキュリティヘッダー設定</h3>
    <ul>
      {Object.entries(metaResult.securityHeaders).map(([key, value]) => (
        <li><strong>{key}:</strong> {value}</li>
      ))}
    </ul>
  </div>
)}
```

## 🧪 テストケースと品質保証

### **1. 単体テストケース**

```typescript
// tests/new-seo-system/unit/head-seo.test.ts
import { describe, test, expect } from 'vitest';
import { render } from '@astrojs/test-utils';
import HeadSEO from '../../../src/components/public-components/HeadSEO.astro';

describe('HeadSEO Component', () => {
  test('基本的なHTML head要素を生成する', async () => {
    const result = await render(HeadSEO, {
      props: {
        title: 'テストページ',
        description: 'テスト説明',
        lang: 'ja'
      }
    });
    
    expect(result.html).toContain('<html lang="ja">');
    expect(result.html).toContain('<title>テストページ</title>');
    expect(result.html).toContain('<meta name="description" content="テスト説明">');
  });
  
  test('デフォルト値が正しく設定される', async () => {
    const result = await render(HeadSEO, {});
    
    expect(result.html).toContain('<title>GoRakuDo</title>');
    expect(result.html).toContain('<html lang="ja">');
  });
});

// tests/new-seo-system/unit/basic-seo.test.ts
import { describe, test, expect } from 'vitest';
import { render } from '@astrojs/test-utils';
import BasicSEO from '../../../src/components/public-components/BasicSEO.astro';

describe('BasicSEO Component', () => {
  test('SEO特化のメタタグを生成する', async () => {
    const result = await render(BasicSEO, {
      props: {
        title: 'SEOテストページ',
        description: 'SEOテスト説明',
        primaryKeywords: ['テスト', 'SEO', 'キーワード'],
        seoProperty: {
          articleType: 'guide',
          learningStage: 'intermediate',
          searchIntent: 'informational'
        }
      }
    });
    
    expect(result.html).toContain('<meta name="keywords" content="テスト, SEO, キーワード">');
    expect(result.html).toContain('property="og:title"');
    expect(result.html).toContain('name="twitter:card"');
  });
  
  test('キーワード検証エラーを表示する', async () => {
    const result = await render(BasicSEO, {
      props: {
        title: 'エラーテスト',
        description: 'エラーテスト説明',
        primaryKeywords: ['a', '短すぎるキーワード'] // 2文字未満のキーワード
      }
    });
    
    expect(result.html).toContain('SEO設定エラー');
  });
});

// tests/new-seo-system/unit/meta-manager.test.ts
import { describe, test, expect } from 'vitest';
import { render } from '@astrojs/test-utils';
import MetaManager from '../../../src/components/public-components/MetaManager.astro';

describe('MetaManager Component', () => {
  test('高度なメタデータを生成する', async () => {
    const result = await render(MetaManager, {
      props: {
        advancedMeta: {
          robots: 'index, follow, max-snippet:-1',
          themeColor: '#3b82f6'
        },
        performanceOptimization: {
          preload: [
            { href: '/css/critical.css', as: 'style' }
          ]
        }
      }
    });
    
    expect(result.html).toContain('rel="preload"');
    expect(result.html).toContain('href="/css/critical.css"');
  });
});
```

### **2. 統合テストケース**

```typescript
// tests/new-seo-system/integration/seo-integration.test.ts
import { describe, test, expect } from 'vitest';
import { render } from '@astrojs/test-utils';
import HeadSEO from '../../../src/components/public-components/HeadSEO.astro';
import BasicSEO from '../../../src/components/public-components/BasicSEO.astro';
import MetaManager from '../../../src/components/public-components/MetaManager.astro';

describe('SEO Integration Tests', () => {
  test('3つのコンポーネントが連携して動作する', async () => {
    const result = await render(HeadSEO, {
      props: {
        title: '統合テストページ',
        description: '統合テスト説明',
        lang: 'ja'
      },
      slots: {
        '': `
          <BasicSEO
            title="統合テストページ"
            description="統合テスト説明"
            primaryKeywords={['統合', 'テスト', 'SEO']}
            seoProperty={{
              articleType: 'guide',
              learningStage: 'intermediate',
              searchIntent: 'informational'
            }}
          />
          <MetaManager
            advancedMeta={{
              robots: 'index, follow',
              themeColor: '#3b82f6'
            }}
            performanceOptimization={{
              preload: [
                { href: '/css/critical.css', as: 'style' }
              ]
            }}
          />
        `
      }
    });
    
    // 基本的なHTML head要素の確認
    expect(result.html).toContain('<html lang="ja">');
    expect(result.html).toContain('<title>統合テストページ</title>');
    
    // SEO特化機能の確認
    expect(result.html).toContain('<meta name="keywords" content="統合, テスト, SEO">');
    expect(result.html).toContain('property="og:title"');
    
    // 高度なメタデータの確認
    expect(result.html).toContain('rel="preload"');
    expect(result.html).toContain('href="/css/critical.css"');
  });
});
```

### **3. E2Eテストケース**

```typescript
// tests/new-seo-system/e2e/seo-e2e.test.ts
import { describe, test, expect } from 'playwright/test';

describe('SEO E2E Tests', () => {
  test('実際のページでSEO設定が正しく動作する', async ({ page }) => {
    // テストページにアクセス
    await page.goto('/test-seo-page');
    
    // HTML head要素の確認
    const title = await page.title();
    expect(title).toBe('テストSEOページ');
    
    // メタタグの確認
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe('テストSEO説明');
    
    // キーワードの確認
    const keywords = await page.locator('meta[name="keywords"]').getAttribute('content');
    expect(keywords).toContain('テスト');
    expect(keywords).toContain('SEO');
    
    // Open Graph タグの確認
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBe('テストSEOページ');
    
    // Twitter Card タグの確認
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    expect(twitterCard).toBe('summary_large_image');
  });
  
  test('パフォーマンス最適化が正しく動作する', async ({ page }) => {
    await page.goto('/test-performance-page');
    
    // preload タグの確認
    const preloadLinks = await page.locator('link[rel="preload"]').count();
    expect(preloadLinks).toBeGreaterThan(0);
    
    // DNS prefetch の確認
    const dnsPrefetch = await page.locator('link[rel="dns-prefetch"]').count();
    expect(dnsPrefetch).toBeGreaterThan(0);
  });
});
```

## 📊 品質保証プロセス

### **1. コードレビュー**

- **自動チェック**: ESLint、Prettier、TypeScript型チェック
- **手動レビュー**: 3つのコンポーネントの責任分離の確認
- **セキュリティチェック**: XSS対策、インジェクション対策
- **パフォーマンスチェック**: レンダリング時間、メモリ使用量

### **2. テスト戦略**

- **単体テスト**: 各コンポーネントの個別テスト
- **統合テスト**: 3つのコンポーネントの連携テスト
- **E2Eテスト**: 実際のページでの動作確認
- **パフォーマンステスト**: レンダリング時間の測定

### **3. 品質基準**

- **TypeScript型チェック**: 0エラー、0警告
- **テストカバレッジ**: 95%以上
- **パフォーマンス**: 100ms以内のレンダリング
- **セキュリティ**: セキュリティヘッダーの適切な設定

## 🎯 次のステップ

1. **実装開始の承認**: この設計での実装開始
2. **Phase 1の開始**: 基本設計と型定義フェーズの開始
3. **定期レビュー**: 各フェーズ完了時のレビュー実施
4. **品質保証**: 各段階での品質基準の確認
5. **ドキュメント作成**: 実装完了後の運用ガイド作成

この3つのコンポーネント分離設計により、責任の明確化、柔軟性の向上、保守性の向上、パフォーマンスの向上が実現されます。各フェーズでの品質ゲートを確実に通過し、プロジェクトの成功を保証します。

---

**完了**: 3つのコンポーネント分離による新しいSEO実装プロジェクトプランの完成
