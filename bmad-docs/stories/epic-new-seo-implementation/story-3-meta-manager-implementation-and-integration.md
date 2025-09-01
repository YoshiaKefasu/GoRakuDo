<!-- Powered by BMAD™ Core -->

# Story 3: MetaManager.astroの実装と統合

## Status

**🎯 READY FOR IMPLEMENTATION** - 高度なメタデータ管理コンポーネントの実装
**📋 REQUIREMENTS DEFINED** - Story 1とStory 2の基本システム完了
**🔧 TECHNICAL SPECIFICATION** - MetaManager.astroの実装仕様完了

## Story

**As a** 開発者,
**I want** MetaManager.astroコンポーネントを実装し、3つのコンポーネントを完全統合する,
**So that** 高度なメタデータ管理、パフォーマンス最適化、セキュリティ強化が可能になり、完全なSEOシステムが構築できる.

## 高校生向け説明

### 🎯 何をやるの？

Story 1とStory 2で作った基本システムに、高度な機能を追加する最後のコンポーネントを作るんだ。

**MetaManager.astroって何？**
- 高度なメタデータ管理（パフォーマンス、セキュリティ、アナリティクス）
- 3つのコンポーネントを統合する司令塔
- 最も高度な機能を持つコンポーネント

**なぜ3つ目が必要なの？**
- 基本機能だけでは不十分な場合がある
- パフォーマンスとセキュリティを強化したい
- アナリティクスや高度なSEO設定が必要

### 🔧 どうやって実装するの？

1. **MetaManager.astroの実装**: 高度なメタデータ管理機能
2. **3つのコンポーネントの完全統合**: 連携とエラーハンドリング
3. **パフォーマンス最適化**: レンダリング時間とメモリ使用量の最適化
4. **高度な機能テスト**: 統合システムの動作確認

## Acceptance Criteria

### **MetaManager.astro実装要件**

1. **高度なメタデータ管理の基本実装**
   - 高度なメタデータ設定（robots、theme-color、color-scheme）
   - パフォーマンス最適化（preload、prefetch、dns-prefetch）
   - セキュリティヘッダー（CSP、HSTS、referrer-policy）

2. **パフォーマンス最適化機能の実装**
   - リソースの事前読み込み（preload）
   - リソースの事前取得（prefetch）
   - DNS事前解決（dns-prefetch）
   - 事前接続（preconnect）

3. **セキュリティヘッダー機能の実装**
   - Content Security Policy（CSP）
   - HTTP Strict Transport Security（HSTS）
   - Referrer Policy
   - Permissions Policy

4. **アナリティクス統合機能の実装**
   - Google Analytics（gtag）
   - Google Tag Manager（GTM）
   - Facebook Pixel
   - Twitter Analytics

### **高度機能実装要件**

5. **高度なSEO設定機能の実装**
   - 代替言語設定（alternate languages）
   - 高度な構造化データ（Schema.org）
   - パンくずリスト（breadcrumbs）
   - サイトマップ関連設定

6. **構造化データの高度な生成**
   - 複雑なSchema.org構造
   - 動的データの統合
   - カスタム構造化データ
   - 検索エンジン最適化

7. **パフォーマンス監視機能の実装**
   - レンダリング時間の測定
   - メモリ使用量の監視
   - リソース読み込み時間の測定
   - パフォーマンスメトリクスの収集

### **統合機能要件**

8. **3つのコンポーネントの完全統合**
   - 統合型定義の実装
   - コンポーネント間の完全連携
   - エラーハンドリングの統合
   - パフォーマンス監視の統合

9. **高度な機能テスト**
   - 3つのコンポーネントの統合テスト
   - 高度な機能の動作確認
   - パフォーマンステスト
   - セキュリティテスト

## General Principles

### 1. 高度性と柔軟性の両立
- 高度な機能を提供しつつ、必要に応じて無効化可能
- 設定の柔軟性を確保
- パフォーマンスへの影響を最小化

### 2. セキュリティファースト
- セキュリティヘッダーの適切な設定
- XSS対策の実装
- CSRF対策の実装
- インジェクション対策の実装

### 3. パフォーマンス最適化
- レンダリング時間の最適化
- メモリ使用量の最適化
- バンドルサイズの最適化
- キャッシュ戦略の最適化

### 4. 統合性の確保
- 3つのコンポーネントの完全連携
- 一貫したAPI設計
- 統一されたエラーハンドリング
- 統合されたパフォーマンス監視

## 🚫 DEV AGENT制約事項（MANDATORY）

### 🚨 絶対禁止事項
- **既存コンポーネントの変更**: Story 2で作成したコンポーネントは一切変更しない
- **新規ライブラリの導入**: 既存のAstro.js以外のフレームワークは使用しない
- **既存ファイル構造の変更**: 既存のディレクトリ構造は変更しない
- **古いシステムの併用**: 古いSEOシステムとの併用は禁止
- **CommonJSの使用**: `require`/`module.exports`の使用は絶対禁止
- **Strict TypeScript mode違反**: 暗黙的な`any`型、暗黙的な戻り値型は禁止
- **テストアーティファクトの残存**: 一時ファイル、モックデータ、デバッグコードの残存は禁止

### ✅ 許可される作業
- **新規コンポーネントの作成**: `src/components/public-components/MetaManager.astro`の作成
- **Story 1の型定義とユーティリティの使用**: 既に作成したシステムの活用
- **Story 2のコンポーネントとの統合**: 既存コンポーネントとの連携
- **既存ディレクトリ構造の活用**: 既存の`src/components/public-components/`ディレクトリを使用

## 🔧 実装ガイド

### **ファイル構造**
```
src/components/public-components/
├── HeadSEO.astro           # 基本的なHTML head要素
├── BasicSEO.astro          # SEO特化機能
├── MetaManager.astro       # 高度なメタデータ管理
└── __tests__/              # テストファイル
    ├── HeadSEO.test.ts
    ├── BasicSEO.test.ts
    └── MetaManager.test.ts

src/utils/new-seo-system/
├── meta-manager.ts         # メタデータ管理クラス（ES Modules必須）
├── performance-optimizer.ts # パフォーマンス最適化
├── security-manager.ts     # セキュリティ管理
└── analytics-integration.ts # アナリティクス統合
```

### **実装順序**
1. **MetaManager.astroの基本実装**
2. **高度なメタデータ管理機能の実装**
3. **パフォーマンス最適化機能の実装**
4. **セキュリティヘッダー機能の実装**
5. **アナリティクス統合機能の実装**
6. **3つのコンポーネントの完全統合**
7. **高度な機能テスト**
8. **テストアーティファクトのクリーンアップ（MANDATORY）**

### **技術的考慮事項**
- **パフォーマンス**: 高度な機能によるパフォーマンスへの影響を最小化
- **セキュリティ**: セキュリティヘッダーの適切な設定とテスト
- **拡張性**: 将来の機能追加に対応できる柔軟な設計
- **保守性**: 複雑な機能を適切に分割し、保守しやすい構造

### **coding-standards.md準拠の実装原則（MANDATORY）**

#### 1. DRY原則の適用（MANDATORY）
```typescript
// ✅ Good - 共通のユーティリティ関数を作成（DRY原則）
// src/utils/new-seo-system/meta-manager.ts
export class NewSEOMetaManager {
  private generateMetaTag(name: string, content: string): string {
    const escapedContent = content.replace(/"/g, '&quot;');
    return `<meta name="${name}" content="${escapedContent}" />`;
  }
  
  private generateLinkTag(rel: string, href: string, type?: string): string {
    const typeAttr = type ? ` type="${type}"` : '';
    return `<link rel="${rel}" href="${href}"${typeAttr} />`;
  }
  
  // 共通のメタタグ生成ロジックを再利用
  generateAdvancedMeta(config: AdvancedMetaConfig): string[] {
    const tags: string[] = [];
    
    if (config.robots) {
      tags.push(this.generateMetaTag('robots', config.robots));
    }
    
    if (config.themeColor) {
      tags.push(this.generateMetaTag('theme-color', config.themeColor));
    }
    
    return tags;
  }
}

// ❌ Bad - 重複したメタタグ生成（DRY原則違反）
class PerformanceOptimizer {
  generatePreloadTag(href: string, as: string): string {
    return `<link rel="preload" href="${href}" as="${as}" />`;
  }
}

class SecurityManager {
  generateCSPTag(content: string): string {
    return `<meta http-equiv="Content-Security-Policy" content="${content}" />`;
  }
}
```

#### 2. KISS原則の適用（MANDATORY）
```typescript
// ✅ Good - シンプルで理解しやすいクラス構造（KISS原則）
export class PerformanceOptimizer {
  generateTags(optimization: PerformanceOptimizationProps): string[] {
    const tags: string[] = [];
    
    // Preload tags
    if (optimization.preload) {
      optimization.preload.forEach(resource => {
        tags.push(`<link rel="preload" href="${resource.href}" as="${resource.as}" />`);
      });
    }
    
    // Prefetch tags
    if (optimization.prefetch) {
      optimization.prefetch.forEach(resource => {
        tags.push(`<link rel="prefetch" href="${resource}" />`);
      });
    }
    
    return tags;
  }
}

// ❌ Bad - 過度に複雑な抽象化（KISS原則違反）
interface OptimizationStrategy {
  generateTags(): string[];
}

class PreloadStrategy implements OptimizationStrategy {
  generateTags(): string[] {
    // 複雑な実装
  }
}

class PrefetchStrategy implements OptimizationStrategy {
  generateTags(): string[] {
    // 複雑な実装
  }
}
```

#### 3. ES Modulesの必須使用（MANDATORY）
```typescript
// ✅ Good - ES Modules (MANDATORY)
import type { MetaManagerProps } from '@/types/new-seo-system';
import { NewSEOMetaManager } from '@/utils/new-seo-system/meta-manager';
import { PerformanceOptimizer } from '@/utils/new-seo-system/performance-optimizer';
import { SecurityManager } from '@/utils/new-seo-system/security-manager';

export class MetaManagerIntegration {
  private metaManager: NewSEOMetaManager;
  private performanceOptimizer: PerformanceOptimizer;
  private securityManager: SecurityManager;
  
  constructor() {
    this.metaManager = new NewSEOMetaManager();
    this.performanceOptimizer = new PerformanceOptimizer();
    this.securityManager = new SecurityManager();
  }
}

// ❌ Bad - CommonJS (NOT ALLOWED)
const { MetaManagerProps } = require('@/types/new-seo-system');
const NewSEOMetaManager = require('@/utils/new-seo-system/meta-manager');
```

#### 4. Strict TypeScript Modeの必須使用（MANDATORY）
```typescript
// ✅ Good - Strict TypeScript Mode (MANDATORY)
interface MetaGenerationResult {
  metaTags: string[];
  structuredData: string;
  performanceHints: string[];
  securityHeaders: string[];
}

export class NewSEOMetaManager {
  // 明示的な戻り値型（strict mode要件）
  generateMetaTags(config: MetaManagerProps): MetaGenerationResult {
    const result: MetaGenerationResult = {
      metaTags: [],
      structuredData: '',
      performanceHints: [],
      securityHeaders: []
    };
    
    // メタタグの生成ロジック
    if (config.advancedMeta) {
      result.metaTags.push(...this.generateAdvancedMeta(config.advancedMeta));
    }
    
    return result;
  }
  
  // 明示的なパラメータ型（strict mode要件）
  private generateAdvancedMeta(config: AdvancedMetaConfig): string[] {
    const tags: string[] = [];
    
    if (config.robots) {
      tags.push(`<meta name="robots" content="${config.robots}" />`);
    }
    
    return tags;
  }
}

// ❌ Bad - Implicit any (NOT ALLOWED in strict mode)
function generateMetaTags(config) { // 型注釈なし
  // 実装
}
```

#### 5. テストアーティファクトのクリーンアップ（MANDATORY）
```typescript
// ✅ Good - テスト完了後のクリーンアップ（MANDATORY）
describe('MetaManager Integration Tests', () => {
  let testData: any;
  
  beforeEach(() => {
    // テストデータの準備
    testData = createTestData();
  });
  
  afterEach(() => {
    // テストアーティファクトのクリーンアップ
    cleanup();
    testData = null;
  });
  
  afterAll(() => {
    // 最終クリーンアップ
    finalCleanup();
  });
});

// ❌ Bad - テストアーティファクトの残存（NOT ALLOWED）
// 一時ファイル、モックデータ、デバッグコードが残存
```

## 📋 詳細実装仕様

### **MetaManager.astroの詳細実装（coding-standards.md準拠）**
```astro
---
// ========== IMPORTS ==========
// Type definitions (ES Modules必須)
import type { MetaManagerProps } from '@/types/new-seo-system';

// Utility classes (ES Modules必須)
import { NewSEOMetaManager } from '@/utils/new-seo-system/meta-manager';
import { PerformanceOptimizer } from '@/utils/new-seo-system/performance-optimizer';
import { SecurityManager } from '@/utils/new-seo-system/security-manager';
import { AnalyticsIntegration } from '@/utils/new-seo-system/analytics-integration';

// ========== PROPS INTERFACE ==========
interface Props extends MetaManagerProps {
  // 追加のプロパティ
}

// ========== PROPS DESTRUCTURING ==========
const {
  advancedMeta = {},
  performanceOptimization = {},
  securityHeaders = {},
  analytics = {}
}: Props = Astro.props;

// ========== UTILITY CLASSES INITIALIZATION ==========
// 各機能を担当するクラスの初期化（単一責任の原則）
const metaManager = new NewSEOMetaManager();
const performanceOptimizer = new PerformanceOptimizer();
const securityManager = new SecurityManager();
const analyticsIntegration = new AnalyticsIntegration();

// ========== META TAG GENERATION ==========
// 各クラスを使用してメタタグを生成（DRY原則）
const advancedMetaTags = metaManager.generateAdvancedMeta(advancedMeta);
const performanceTags = performanceOptimizer.generateTags(performanceOptimization);
const securityTags = securityManager.generateHeaders(securityHeaders);
const analyticsTags = analyticsIntegration.generateTags(analytics);

// ========== INTEGRATION ==========
// 統合メタデータの生成（KISS原則）
const integratedMeta = metaManager.integrateAll({
  advanced: advancedMetaTags,
  performance: performanceTags,
  security: securityTags,
  analytics: analyticsTags
});
---

<!-- ========== ADVANCED META TAGS ========== -->
{integratedMeta.advanced}

<!-- ========== PERFORMANCE OPTIMIZATION ========== -->
{integratedMeta.performance}

<!-- ========== SECURITY HEADERS ========== -->
{integratedMeta.security}

<!-- ========== ANALYTICS ========== -->
{integratedMeta.analytics}

<!-- ========== DEVELOPMENT ENVIRONMENT DEBUG INFO ========== -->
{import.meta.env.DEV && (
  <div class="meta-manager-debug" style="display: none;">
    <h3>Meta Manager Debug Info</h3>
    <pre>{JSON.stringify(integratedMeta, null, 2)}</pre>
  </div>
)}
```

### **パフォーマンス最適化クラスの実装（DRY原則とKISS原則の両立）**
```typescript
// src/utils/new-seo-system/performance-optimizer.ts
// ========== PERFORMANCE OPTIMIZER ==========
// Simple, focused performance optimization (KISS principle)

export interface PerformanceOptimizationProps {
  preload?: Array<{ href: string; as: string }>;
  prefetch?: string[];
  dnsPrefetch?: string[];
  preconnect?: string[];
}

export class PerformanceOptimizer {
  // シンプルで理解しやすいメソッド（KISS原則）
  generateTags(optimization: PerformanceOptimizationProps): string[] {
    const tags: string[] = [];
    
    // Preload tags
    if (optimization.preload) {
      optimization.preload.forEach(resource => {
        tags.push(`<link rel="preload" href="${resource.href}" as="${resource.as}" />`);
      });
    }
    
    // Prefetch tags
    if (optimization.prefetch) {
      optimization.prefetch.forEach(resource => {
        tags.push(`<link rel="prefetch" href="${resource}" />`);
      });
    }
    
    // DNS prefetch
    if (optimization.dnsPrefetch) {
      optimization.dnsPrefetch.forEach(domain => {
        tags.push(`<link rel="dns-prefetch" href="${domain}" />`);
      });
    }
    
    // Preconnect
    if (optimization.preconnect) {
      optimization.preconnect.forEach(domain => {
        tags.push(`<link rel="preconnect" href="${domain}" />`);
      });
    }
    
    return tags;
  }
}
```

### **セキュリティ管理クラスの実装（KISS原則の適用）**
```typescript
// src/utils/new-seo-system/security-manager.ts
// ========== SECURITY MANAGER ==========
// Simple, focused security management (KISS principle)

export interface SecurityHeadersProps {
  csp?: string;
  hsts?: string;
  referrerPolicy?: string;
  permissionsPolicy?: string;
}

export class SecurityManager {
  // シンプルで理解しやすいセキュリティヘッダー生成（KISS原則）
  generateHeaders(security: SecurityHeadersProps): string[] {
    const headers: string[] = [];
    
    // Content Security Policy
    if (security.csp) {
      headers.push(`<meta http-equiv="Content-Security-Policy" content="${security.csp}" />`);
    }
    
    // HTTP Strict Transport Security
    if (security.hsts) {
      headers.push(`<meta http-equiv="Strict-Transport-Security" content="${security.hsts}" />`);
    }
    
    // Referrer Policy
    if (security.referrerPolicy) {
      headers.push(`<meta name="referrer" content="${security.referrerPolicy}" />`);
    }
    
    // Permissions Policy
    if (security.permissionsPolicy) {
      headers.push(`<meta http-equiv="Permissions-Policy" content="${security.permissionsPolicy}" />`);
    }
    
    return headers;
  }
}
```

## 📋 完了条件

### **必須完了項目**
1. ✅ MetaManager.astroの実装完了
2. ✅ 高度なメタデータ管理機能の実装完了
3. ✅ パフォーマンス最適化機能の実装完了
4. ✅ セキュリティヘッダー機能の実装完了
5. ✅ アナリティクス統合機能の実装完了
6. ✅ 3つのコンポーネントの完全統合完了
7. ✅ 高度な機能テスト完了
8. ✅ パフォーマンス最適化完了
9. ✅ テストアーティファクトのクリーンアップ完了（MANDATORY）

### **品質基準（coding-standards.md準拠）**
- TypeScript型エラー：0件（Strict Mode必須）
- ES Modules使用率：100%（CommonJS禁止）
- DRY原則適用確認：重複コード0件
- KISS原則適用確認：過度な抽象化なし
- テストアーティファクト：一時ファイル・モックデータ・デバッグコード0件
- 統合テスト成功率：100%
- パフォーマンス向上：20%以上
- セキュリティヘッダー：適切に設定済み

## 🎯 次のステップ

このStory 3が完了したら、最後のStory 4（テストと品質保証の完了）に進みます。

---

**完了**: Story 3（MetaManager.astroの実装と統合）の定義完了
