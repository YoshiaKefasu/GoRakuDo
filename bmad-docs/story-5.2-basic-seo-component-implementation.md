<!-- Powered by BMAD™ Core -->

# Sub-Story 5.2: BasicSEOコンポーネント実装

## Status

**🎯 IN PROGRESS** - 手動キーワード管理機能を持つBasicSEOコンポーネントの実装
**📋 PLANNED** - 4日間の実装計画、既存システムとの統合、段階的移行の準備
**⚠️ CRITICAL WARNING** - 既存システムの変更禁止箇所が特定され、厳格な遵守が必要

## Story

**As a** 開発者,
**I want** 手動キーワード管理機能を持つBasicSEOコンポーネントを実装する,
**So that** 既存のHeadSEO.astroと併用しながら、手動でSEO設定を管理できるシステムを実現できる.

## 高校生向け説明

### 🎯 何をやるの？

Sub-Story 5.2では、実際にBasicSEOコンポーネントを作って、手動でキーワードを管理できるようにするんだ。

**BasicSEOコンポーネントって何？**
- 検索エンジンで見つけやすくするための設定を簡単に変更できるコンポーネント
- 記事ごとにキーワードを手動で設定できる機能
- 既存のHeadSEO.astroと一緒に使える機能

**手動キーワード管理って何？**
- 自動生成ではなく、人間が記事に合ったキーワードを手動で入力
- 主要キーワード、ロングテールキーワード、記事固有キーワードを分けて管理
- キーワードの妥当性をチェックする機能

### 🔧 どうやって実装するの？

1. **基本構造の実装**: BasicSEO.astroコンポーネントの基本部分を作る
2. **キーワード管理機能**: 手動でキーワードを入力・管理する機能
3. **OGP・Twitter Card対応**: SNSでシェアされた時の表示を最適化
4. **多言語対応**: 日本語とインドネシア語の両方に対応
5. **既存システムとの統合**: HeadSEO.astroと一緒に使えるようにする

## 🚨 CRITICAL WARNING: 変更禁止箇所の厳格な遵守

### ⚠️ 絶対に変更・削除してはいけないファイル・コード

**1. 既存HeadSEO.astroコンポーネント（src/components/public-components/HeadSEO.astro）**
- **変更禁止**: 既存のProps interface、構造化データ、OGP設定、Twitter Card設定
- **削除禁止**: 既存のメタタグ、リソースヒント、AI最適化機能
- **理由**: 既存記事のSEO設定が破損し、検索エンジンの可視性が失われる

**2. 既存SEO最適化システム（src/utils/ai/seo-optimizer.ts）**
- **変更禁止**: SEOOptimizerクラスの既存メソッド（extractKeywords、optimizeTitle、generateStructuredKeywords）
- **削除禁止**: 既存の日本語・インドネシア語キーワードセット
- **理由**: 既存のSEO最適化機能が停止し、コンテンツの品質が低下する

**3. 既存メタデータ管理システム（src/utils/metadata-loader.ts）**
- **変更禁止**: loadMetadata、getSEOFromMetadata、getRecommendationsFromMetadata関数
- **削除禁止**: MetadataContent、LoadedMetadataインターフェース
- **理由**: 既存記事のメタデータ読み込みが失敗し、SEOデータが失われる

### 🔒 変更可能な箇所（新規作成のみ）

**1. 新規BasicSEOコンポーネント**
- **作成可能**: `src/components/public-components/BasicSEO.astro`（新規ファイル）
- **制限**: 既存のHeadSEO.astroを参照・拡張するが、直接変更は禁止

**2. 新規テスト**
- **作成可能**: `tests/integration/basic-seo/`（新規ディレクトリ）
- **制限**: 既存のテストファイルを変更しない

## Acceptance Criteria

**BasicSEOコンポーネント要件:**

1. BasicSEO.astroコンポーネントの基本実装完了
2. Props interfaceの実装完了
3. 基本HTML構造の実装完了
4. メタタグ生成ロジックの実装完了
5. 構造化データの実装完了

**手動キーワード管理要件:**

6. 手動キーワード管理機能の基本実装完了
7. キーワード表示機能の実装完了
8. キーワード検証機能の統合完了
9. エラー表示機能の実装完了

**高度機能要件:**

10. OGP・Twitter Card対応の実装完了
11. Open Graph メタタグの生成完了
12. Twitter Card メタタグの生成完了
13. 画像最適化の実装完了

**多言語対応要件:**

14. 多言語対応の実装完了
15. hreflangタグの生成完了
16. 言語別メタデータの生成完了
17. 代替URLの設定完了

**統合要件:**

18. 既存システムとの統合実装完了
19. HeadSEO.astroとの連携完了
20. 段階的移行の準備完了
21. 互換性チェックの実装完了

**🚨 安全性要件（必須）:**

22. 既存ファイルの変更・削除0件
23. 既存コードの上書き0件
24. 既存設定の変更0件
25. 新規ファイルのみの作成

## 技術仕様

### 1. BasicSEOコンポーネントの基本構造

```astro
---
// src/components/public-components/BasicSEO.astro（新規作成）
import type { BasicSEOProps } from '../../types/basic-seo';
import { ManualKeywordValidator } from '../../utils/manual-keyword-validator';

interface Props extends BasicSEOProps {
  // 既存HeadSEO.astroとの互換性を保つための追加プロパティ
  existingHeadSEO?: boolean; // 既存HeadSEO.astroとの併用フラグ
}

const {
  title,
  description,
  primaryKeywords = [],
  longTailKeywords = [],
  articleKeywords = [],
  categoryKeywords = [],
  seoProperty,
  canonicalUrl,
  lang = 'ja',
  noIndex = false,
  ogImage,
  pageType = 'article',
  publishedDate,
  modifiedDate,
  authorName,
  alternateUrl,
  existingHeadSEO = false
}: Props = Astro.props;

// キーワード検証
const validator = new ManualKeywordValidator();
const validationResult = validator.validateKeywords([
  ...primaryKeywords,
  ...longTailKeywords,
  ...articleKeywords,
  ...categoryKeywords
]);

// 構造化データの生成
const structuredData = {
  "@context": "https://schema.org",
  "@type": seoProperty?.articleType || "Article",
  "headline": title,
  "description": description,
  "keywords": validationResult.optimizedKeywords.join(', '),
  "author": {
    "@type": "Person",
    "name": authorName || "GoRakuDo"
  },
  "publisher": {
    "@type": "Organization",
    "name": "GoRakuDo",
    "logo": {
      "@type": "ImageObject",
      "url": "/favicon.svg"
    }
  },
  "datePublished": publishedDate,
  "dateModified": modifiedDate || publishedDate,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": canonicalUrl || Astro.url.href
  }
};
---

<!-- BasicSEOコンポーネント -->
<!-- 既存HeadSEO.astroとの併用を考慮した実装 -->

<!-- メタタグ -->
<meta name="title" content={title} />
<meta name="description" content={description} />
<meta name="keywords" content={validationResult.optimizedKeywords.join(', ')} />
<meta name="author" content={authorName || "GoRakuDo"} />
<meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />

<!-- 言語設定 -->
<meta name="language" content={lang} />
<link rel="alternate" hreflang={lang} href={canonicalUrl || Astro.url.href} />
{alternateUrl && <link rel="alternate" hreflang="x-default" href={alternateUrl} />}

<!-- カノニカルURL -->
<link rel="canonical" href={canonicalUrl || Astro.url.href} />

<!-- Open Graph -->
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:type" content={pageType} />
<meta property="og:url" content={canonicalUrl || Astro.url.href} />
<meta property="og:image" content={ogImage?.src || "/favicon.svg"} />
<meta property="og:site_name" content="GoRakuDo" />
<meta property="og:locale" content={lang === 'ja' ? 'ja_JP' : 'id_ID'} />
{authorName && <meta property="og:author" content={authorName} />}

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage?.src || "/favicon.svg"} />
<meta name="twitter:site" content="@GoRakuDo" />

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

<style>
  .seo-validation-errors,
  .seo-validation-warnings {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    padding: 1rem;
    margin: 1rem 0;
    font-size: 0.875rem;
  }
  
  .seo-validation-errors {
    border-color: #dc3545;
    background: #f8d7da;
  }
  
  .seo-validation-warnings {
    border-color: #ffc107;
    background: #fff3cd;
  }
  
  .seo-validation-errors h3,
  .seo-validation-warnings h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    font-weight: 600;
  }
  
  .seo-validation-errors ul,
  .seo-validation-warnings ul {
    margin: 0;
    padding-left: 1.5rem;
  }
  
  .seo-validation-errors li,
  .seo-validation-warnings li {
    margin: 0.25rem 0;
  }
</style>
```

### 2. 既存システムとの統合インターフェース

```typescript
// src/types/basic-seo-integration.ts（新規作成）
export interface BasicSEOIntegrationProps {
  // 既存HeadSEO.astroとの併用設定
  existingHeadSEO?: boolean;
  
  // 既存システムとの互換性設定
  compatibilityMode?: 'strict' | 'loose' | 'hybrid';
  
  // 段階的移行設定
  migrationPhase?: 'phase1' | 'phase2' | 'phase3' | 'complete';
  
  // 既存システムの状態確認
  existingSystemStatus?: {
    headSEOExists: boolean;
    seoOptimizerExists: boolean;
    metadataLoaderExists: boolean;
  };
}

export interface BasicSEOCompatibilityCheck {
  isCompatible: boolean;
  conflicts: string[];
  warnings: string[];
  recommendations: string[];
}
```

### 3. 手動キーワード管理の高度機能

```typescript
// src/utils/manual-keyword-manager.ts（新規作成）
export interface KeywordCategory {
  primary: string[];
  longTail: string[];
  article: string[];
  category: string[];
}

export interface KeywordAnalysis {
  totalKeywords: number;
  primaryCount: number;
  longTailCount: number;
  articleCount: number;
  categoryCount: number;
  duplicateCount: number;
  shortKeywords: number;
  longKeywords: number;
}

export class ManualKeywordManager {
  private validator: ManualKeywordValidator;
  
  constructor() {
    this.validator = new ManualKeywordValidator();
  }
  
  analyzeKeywords(keywords: KeywordCategory): KeywordAnalysis {
    const allKeywords = [
      ...keywords.primary,
      ...keywords.longTail,
      ...keywords.article,
      ...keywords.category
    ];
    
    const validation = this.validator.validateKeywords(allKeywords);
    
    return {
      totalKeywords: allKeywords.length,
      primaryCount: keywords.primary.length,
      longTailCount: keywords.longTail.length,
      articleCount: keywords.article.length,
      categoryCount: keywords.category.length,
      duplicateCount: allKeywords.length - validation.optimizedKeywords.length,
      shortKeywords: validation.errors.filter(e => e.includes('短すぎます')).length,
      longKeywords: validation.warnings.filter(w => w.includes('長すぎます')).length
    };
  }
  
  suggestKeywords(articleContent: string, existingKeywords: string[]): string[] {
    // 記事内容からキーワード候補を抽出（既存システムを参考）
    const contentWords = articleContent
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length >= 3);
    
    // 既存キーワードとの重複を避ける
    const uniqueWords = contentWords.filter(word => 
      !existingKeywords.some(existing => 
        existing.toLowerCase().includes(word) || 
        word.includes(existing.toLowerCase())
      )
    );
    
    // 頻度でソートして上位10個を返す
    const wordFrequency = uniqueWords.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(wordFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }
}
```

## 実装計画（詳細版）

### Day 1: BasicSEOコンポーネント実装 - 基本構造

**午前: コンポーネントの基本実装（9:00-12:00）**
- [ ] BasicSEO.astroコンポーネントの基本構造作成
  - Props interfaceの実装（BasicSEOProps型の使用、デフォルト値の設定）
  - 基本HTML構造の実装（メタタグ、リンクタグ、スクリプトタグの配置）
  - メタタグ生成ロジックの実装（title、description、keywordsの動的生成）
  - エラーハンドリングの実装（Props検証、フォールバック値の設定）
- [ ] 型安全性の確保
  - TypeScript型チェックの通過（strict modeでの0エラー、0警告）
  - 既存型定義との競合回避（名前空間の確認、型名の重複チェック）
  - エラーハンドリングの実装（try-catch文、エラーログ、ユーザーフレンドリーなエラー表示）

**午後: 構造化データとキーワード管理（13:00-17:00）**
- [ ] 構造化データの実装
  - JSON-LD形式での構造化データ生成（Schema.org準拠、記事タイプ別の構造化）
  - 記事タイプ別の構造化データ（Article、Guide、HowTo、FAQ等の適切な型選択）
  - 著者・出版社情報の設定（Person、Organization、WebSite等の構造化データ）
  - 検索エンジン最適化（リッチスニペット表示のための最適化）
- [ ] 手動キーワード管理機能の基本実装
  - キーワード表示機能（主要キーワード、ロングテールキーワード、記事固有キーワードの表示）
  - キーワード検証機能の統合（ManualKeywordValidatorクラスの統合、リアルタイム検証）
  - エラー表示機能（開発環境でのエラー表示、本番環境でのエラー非表示）
  - キーワード最適化機能（重複除去、長さ制限、個数制限の適用）

### Day 2: BasicSEOコンポーネント実装 - 高度機能

**午前: OGP・Twitter Card対応（9:00-12:00）**
- [ ] Open Graph メタタグの生成
  - タイトル・説明・画像の設定（og:title、og:description、og:image）
  - サイト名・ロケールの設定（og:site_name、og:locale、og:type）
  - 著者情報の設定（og:author、og:url、og:updated_time）
  - カスタムOGPプロパティの実装（og:article:section、og:article:tag等）
- [ ] Twitter Card メタタグの生成
  - カードタイプの設定（twitter:card、twitter:site、twitter:creator）
  - 画像・タイトル・説明の設定（twitter:image、twitter:title、twitter:description）
  - サイト情報の設定（twitter:site、twitter:domain、twitter:app関連）
  - カスタムTwitter Cardプロパティの実装（twitter:image:alt、twitter:player等）

**午後: 画像最適化と多言語対応（13:00-17:00）**
- [ ] 画像最適化の実装
  - OGP画像の最適化（推奨サイズ1200x630px、WebP形式対応、遅延読み込み）
  - Twitter Card画像の最適化（推奨サイズ1200x600px、アスペクト比最適化）
  - フォールバック画像の設定（デフォルト画像、画像読み込み失敗時の処理）
  - 画像メタデータの最適化（alt属性、width/height属性、loading属性）
- [ ] 多言語対応の実装
  - hreflangタグの生成（ja、id、x-default、言語別の優先順位設定）
  - 言語別メタデータの生成（言語別のtitle、description、keywords）
  - 代替URLの設定（言語別ページへの適切なリンク、検索エンジン向けの言語情報）
  - 国際化SEOの最適化（地域別設定、通貨設定、時間帯設定）

### Day 3: Frontmatter統合と既存システム連携

**午前: Frontmatterサポートの完全実装**
- [ ] YAMLパーサーの統合
  - 既存パーサーとの連携
  - 型安全性の確保
  - エラーハンドリングの実装
- [ ] バリデーション機能の統合
  - パース結果の検証
  - エラーレポート機能
  - 警告表示機能

**午後: 既存システムとの統合実装**
- [ ] HeadSEO.astroとの連携
  - 併用時の競合回避
  - 設定の優先順位
  - 互換性チェック
- [ ] 段階的移行の準備
  - 移行フェーズの設定
  - 互換性モードの実装
  - 移行ガイドの作成

### Day 4: 統合テストと品質保証

**午前: 既存HeadSEO.astroとの併用テスト**
- [ ] 同時使用時の動作確認
  - 競合の有無の確認
  - パフォーマンスへの影響確認
  - 設定の優先順位確認
- [ ] 手動キーワード入力の包括テスト
  - 正常系テスト（有効なキーワード）
  - 異常系テスト（無効なキーワード）
  - 境界値テスト（制限値の確認）

**午後: 最終統合とパフォーマンステスト**
- [ ] Frontmatter統合の包括テスト
  - 各種Frontmatter形式のテスト
  - エラーケースのテスト
  - 型安全性のテスト
- [ ] パフォーマンステストと最適化
  - レンダリング時間の測定
  - メモリ使用量の測定
  - 既存システムとの比較

## ファイル構成

### 新規作成ファイル

**コンポーネント:**
- `src/components/public-components/BasicSEO.astro` - BasicSEOコンポーネント

**型定義:**
- `src/types/basic-seo-integration.ts` - 統合インターフェース

**ユーティリティ:**
- `src/utils/manual-keyword-manager.ts` - 高度キーワード管理

**テスト:**
- `tests/integration/basic-seo/` - 統合テスト
- `tests/integration/basic-seo/basic-seo-component.test.ts`
- `tests/integration/basic-seo/head-seo-integration.test.ts`
- `tests/integration/basic-seo/keyword-management.test.ts`

### 既存ファイル（変更禁止）

**コンポーネント:**
- `src/components/public-components/HeadSEO.astro` - 変更禁止

**ユーティリティ:**
- `src/utils/ai/seo-optimizer.ts` - 変更禁止
- `src/utils/metadata-loader.ts` - 変更禁止

## 品質保証

### 品質基準

**コンポーネント品質:**
- メタタグ生成: 100%正常動作
- 構造化データ: 100%正常動作
- OGP・Twitter Card: 100%正常動作
- 多言語対応: 100%正常動作

**統合品質:**
- 既存システム互換性: 100%維持
- パフォーマンス: 既存システムと同等以上
- エラーハンドリング: 100%動作
- 型安全性: 100%確保

**キーワード管理品質:**
- 手動入力機能: 100%正常動作
- 検証機能: 100%正常動作
- 最適化機能: 95%以上精度
- エラー表示: 100%正確性

### テスト戦略

**統合テスト:**
- BasicSEOコンポーネントの全機能
- HeadSEO.astroとの併用
- 既存システムとの互換性

**パフォーマンステスト:**
- レンダリング時間の測定
- メモリ使用量の測定
- 既存システムとの比較

**互換性テスト:**
- 既存記事での動作確認
- 新規記事での動作確認
- 段階的移行の動作確認

## リスク管理

### 特定されたリスク

**既存システムとの競合:**
- HeadSEO.astroとの設定競合
- メタタグの重複生成
- 構造化データの競合

**パフォーマンスへの影響:**
- レンダリング時間の増加
- メモリ使用量の増加
- バンドルサイズの増加

**移行時の問題:**
- 既存記事のSEO設定破損
- 検索エンジンの可視性低下
- ユーザー体験の悪化

### 軽減策

**競合回避:**
- 既存システムとの併用モード
- 設定の優先順位の明確化
- 競合検出機能の実装

**パフォーマンス最適化:**
- 効率的なレンダリング
- メモリ使用量の最適化
- バンドルサイズの最小化

**安全な移行:**
- 段階的な移行計画
- 既存システムの保護
- ロールバック機能の準備

## 次のステップ

1. **実装開始の承認**: このSub-Storyでの実装開始
2. **Day 1の開始**: BasicSEOコンポーネントの基本実装開始
3. **定期レビュー**: 各Day完了時のレビュー実施
4. **🚨 安全性確認**: 各段階での既存システム保護確認
5. **エラー監視**: 実装中のエラー発生状況の監視
6. **品質チェック**: 各段階での品質基準の確認

このBasicSEOコンポーネント実装により、手動キーワード管理機能が実現され、既存システムとの安全な統合が完了します。各Dayでの品質ゲートを確実に通過し、次のSub-Storyへの準備を完了します。

---

## 🔍 要件とテストのトレーサビリティマッピング

### 📋 要件トレーサビリティマトリックス

#### **REQ-001: BasicSEOコンポーネント基本実装**

| テストケース | Given（前提条件） | When（実行条件） | Then（期待結果） | 品質基準 | ステータス |
|-------------|------------------|------------------|------------------|----------|------------|
| TC-001-01 | 有効なBasicSEOPropsが渡される | BasicSEOコンポーネントがレンダリングされる | 正しいメタタグが生成される | 100%動作 | 🔄 計画中 |
| TC-001-02 | 必須プロパティが不足している | コンポーネントがレンダリングされる | 適切なエラーメッセージが表示される | 100%エラーハンドリング | 🔄 計画中 |
| TC-001-03 | 無効なキーワードが含まれる | キーワード検証が実行される | 警告メッセージが表示される | 100%検証 | 🔄 計画中 |

#### **REQ-002: OGP・Twitter Card対応**

| テストケース | Given（前提条件） | When（実行条件） | Then（期待結果） | 品質基準 | ステータス |
|-------------|------------------|------------------|------------------|----------|------------|
| TC-002-01 | 有効なOGP設定が提供される | Open Graphメタタグが生成される | 正しいOGPメタタグが出力される | 100%動作 | 🔄 計画中 |
| TC-002-02 | 有効なTwitter Card設定が提供される | Twitter Cardメタタグが生成される | 正しいTwitter Cardメタタグが出力される | 100%動作 | 🔄 計画中 |
| TC-002-03 | 画像が設定されていない | フォールバック画像が使用される | デフォルト画像が設定される | 100%動作 | 🔄 計画中 |

#### **REQ-003: 既存システム統合**

| テストケース | Given（前提条件） | When（実行条件） | Then（期待結果） | 品質基準 | ステータス |
|-------------|------------------|------------------|------------------|----------|------------|
| TC-003-01 | HeadSEO.astroとBasicSEOが同時に使用される | 両コンポーネントが同時レンダリングされる | 競合なく両方のSEO設定が適用される | 100%互換性 | 🔄 計画中 |
| TC-003-02 | 既存SEO最適化システムが動作している | BasicSEOが新規実装される | 既存システムの動作に影響しない | 100%非干渉 | 🔄 計画中 |
| TC-003-03 | 段階的移行が実行される | 既存システムから新規システムへの移行が実行される | 既存機能が停止することなく移行が完了する | 100%継続性 | 🔄 計画中 |

### 🧪 テストシナリオ詳細（Given-When-Then形式）

#### **TC-001-01: BasicSEOコンポーネントの基本動作**

```typescript
describe('BasicSEO Component - 基本動作', () => {
  test('有効なPropsでの正常レンダリング', () => {
    // Given: 有効なBasicSEOPropsが準備される
    const validProps: BasicSEOProps = {
      title: '日本語学習ガイド',
      description: '効果的な日本語学習方法を紹介します',
      primaryKeywords: ['日本語学習', 'イマージョン'],
      seoProperty: {
        articleType: 'guide',
        learningStage: 'intermediate',
        searchIntent: 'informational'
      }
    };
    
    // When: BasicSEOコンポーネントがレンダリングされる
    const component = renderComponent(<BasicSEO {...validProps} />);
    
    // Then: 正しいメタタグが生成される
    expect(component).toHaveMetaTag('name', 'title', '日本語学習ガイド');
    expect(component).toHaveMetaTag('name', 'description', '効果的な日本語学習方法を紹介します');
    expect(component).toHaveMetaTag('name', 'keywords', '日本語学習, イマージョン');
  });
});
```

#### **TC-002-01: OGPメタタグの生成**

```typescript
describe('BasicSEO Component - OGP対応', () => {
  test('Open Graphメタタグの正常生成', () => {
    // Given: OGP設定が含まれるPropsが準備される
    const ogpProps: BasicSEOProps = {
      title: '日本語学習ガイド',
      description: '効果的な日本語学習方法を紹介します',
      primaryKeywords: ['日本語学習'],
      ogImage: { src: '/images/guide.png', alt: '学習ガイド' },
      pageType: 'article'
    };
    
    // When: BasicSEOコンポーネントがレンダリングされる
    const component = renderComponent(<BasicSEO {...ogpProps} />);
    
    // Then: 正しいOGPメタタグが出力される
    expect(component).toHaveMetaTag('property', 'og:title', '日本語学習ガイド');
    expect(component).toHaveMetaTag('property', 'og:description', '効果的な日本語学習方法を紹介します');
    expect(component).toHaveMetaTag('property', 'og:image', '/images/guide.png');
    expect(component).toHaveMetaTag('property', 'og:type', 'article');
  });
});
```

#### **TC-003-01: 既存システムとの併用**

```typescript
describe('BasicSEO Integration - 既存システム併用', () => {
  test('HeadSEO.astroとの競合回避', () => {
    // Given: HeadSEO.astroとBasicSEOの両方が準備される
    const headSEOProps = {
      title: '既存タイトル',
      description: '既存説明',
      lang: 'ja' as const
    };
    
    const basicSEOProps: BasicSEOProps = {
      title: '新規タイトル',
      description: '新規説明',
      primaryKeywords: ['新規キーワード'],
      seoProperty: {
        articleType: 'guide',
        learningStage: 'intermediate',
        searchIntent: 'informational'
      }
    };
    
    // When: 両コンポーネントが同時にレンダリングされる
    const page = renderPage({
      headSEO: <HeadSEO {...headSEOProps} />,
      basicSEO: <BasicSEO {...basicSEOProps} />
    });
    
    // Then: 競合なく両方のSEO設定が適用される
    expect(page).toHaveValidHTML();
    expect(page).toHaveValidMetaTags();
    expect(page).toHaveNoConflictingMetaTags();
    expect(page).toContain('既存タイトル');
    expect(page).toContain('新規キーワード');
  });
});
```

---

このSub-Story 5.2により、BasicSEOコンポーネントの完全な実装が完了し、既存システムとの安全な統合が実現されます。
