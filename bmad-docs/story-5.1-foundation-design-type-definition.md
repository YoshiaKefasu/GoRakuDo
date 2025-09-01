<!-- Powered by BMAD™ Core -->

# Sub-Story 5.1: 基盤設計・型定義構築

## Status

**🎯 IN PROGRESS** - BasicSEOコンポーネントの基盤となる型定義とバリデーションシステムの構築
**📋 PLANNED** - 3日間の実装計画、型安全性の確保、既存システムとの競合回避
**⚠️ CRITICAL WARNING** - 既存システムの変更禁止箇所が特定され、厳格な遵守が必要

## Story

**As a** 開発者,
**I want** BasicSEOコンポーネントの基盤となる型定義とバリデーションシステムを構築する,
**So that** 手動キーワード管理とFrontmatterサポートの基盤が整い、型安全性を保証できる.

## 高校生向け説明

### 🎯 何をやるの？

Sub-Story 5.1では、BasicSEOコンポーネントの土台となる部分を作るんだ。

**型定義って何？**
- TypeScriptでデータの形を決めるルール
- 間違ったデータが入らないようにする安全装置
- 開発者がミスを防ぐためのガイドライン

**バリデーションって何？**
- 入力されたデータが正しいかチェックする機能
- キーワードが適切な長さか、重複していないかなどを確認
- エラーがあれば教えてくれる機能

### 🔧 どうやって実装するの？

1. **型定義の作成**: BasicSEOPropsという新しい型を作る
2. **キーワード検証システム**: キーワードが正しいかチェックする機能
3. **Frontmatterパーサー**: 記事の設定部分を読み込む機能
4. **テスト環境の構築**: 作った機能が正しく動くかテストする環境

## 🚨 CRITICAL WARNING: 変更禁止箇所の厳格な遵守

### ⚠️ 絶対に変更・削除してはいけないファイル・コード

**1. 既存型定義システム（src/types/）**
- **変更禁止**: 既存の型定義ファイル（base-integration.ts、fallback-system.ts、metadata-input.ts）
- **削除禁止**: 既存のインターフェースと型定義
- **理由**: TypeScript型チェックが失敗し、ビルドエラーが発生する

**2. 既存設定ファイル**
- **変更禁止**: tsconfig.json、package.json
- **削除禁止**: 既存の設定ファイル
- **理由**: プロジェクトの設定が破損し、開発環境が停止する

### 🔒 変更可能な箇所（新規作成のみ）

**1. 新規型定義**
- **作成可能**: `src/types/basic-seo.ts`（新規ファイル）
- **制限**: 既存の型定義と競合しないよう注意

**2. 新規ユーティリティ**
- **作成可能**: `src/utils/manual-keyword-validator.ts`（新規ファイル）
- **作成可能**: `src/utils/manual-frontmatter-parser.ts`（新規ファイル）
- **制限**: 既存のユーティリティ関数を上書きしない

**3. 新規テスト**
- **作成可能**: `tests/unit/basic-seo/`（新規ディレクトリ）
- **制限**: 既存のテストファイルを変更しない

## Acceptance Criteria

**型定義要件:**

1. BasicSEOProps型定義の実装完了
2. 既存型定義との競合回避完了
3. JSDocコメントの追加完了
4. TypeScript型チェック通過（0エラー、0警告）

**バリデーション要件:**

5. ManualKeywordValidatorクラスの実装完了
6. キーワード長チェック（2-50文字）の実装完了
7. 重複チェック（大文字小文字区別なし）の実装完了
8. 個数制限チェック（最大10個）の実装完了
9. 日本語文字チェックの実装完了

**パーサー要件:**

10. ManualFrontmatterParserクラスの実装完了
11. YAMLパース機能の実装完了
12. 型安全性チェックの実装完了
13. エラーレポート機能の実装完了

**テスト要件:**

14. テスト環境の構築完了
15. Jest設定の追加完了
16. テストファイルのテンプレート作成完了
17. モックデータの準備完了

**🚨 安全性要件（必須）:**

18. 既存ファイルの変更・削除0件
19. 既存コードの上書き0件
20. 既存設定の変更0件
21. 新規ファイルのみの作成

## 技術仕様

### 1. BasicSEOProps型定義

```typescript
// src/types/basic-seo.ts（新規作成）
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
  canonicalUrl?: string;
  lang?: "id" | "ja";
  noIndex?: boolean;
  ogImage?: ImageMetadata;
  pageType?: "website" | "article";
  publishedDate?: string;
  modifiedDate?: string;
  authorName?: string;
  alternateUrl?: string;
}
```

### 2. キーワード検証システム

```typescript
// src/utils/manual-keyword-validator.ts（新規作成）
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  optimizedKeywords: string[];
}

export class ManualKeywordValidator {
  validateKeywords(keywords: string[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // 長さチェック
    keywords.forEach((keyword, index) => {
      if (keyword.length < 2) {
        errors.push(`キーワード${index + 1}が短すぎます: ${keyword}`);
      }
      if (keyword.length > 50) {
        warnings.push(`キーワード${index + 1}が長すぎます: ${keyword}`);
      }
    });
    
    // 重複チェック
    const duplicates = keywords.filter((item, index) => keywords.indexOf(item) !== index);
    if (duplicates.length > 0) {
      warnings.push(`重複キーワード: ${duplicates.join(', ')}`);
    }
    
    // 個数チェック
    if (keywords.length > 10) {
      warnings.push('キーワード数が多すぎます（推奨: 10個まで）');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
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
}
```

### 3. Frontmatterパーサー

```typescript
// src/utils/manual-frontmatter-parser.ts（新規作成）
export interface ParsedFrontmatter {
  seo?: BasicSEOProps;
  [key: string]: any;
}

export class ManualFrontmatterParser {
  parse(frontmatter: string): ParsedFrontmatter {
    try {
      // YAMLパース処理
      const parsed = yaml.parse(frontmatter);
      
      // 型安全性チェック
      this.validateParsedData(parsed);
      
      return parsed;
    } catch (error) {
      throw new Error(`Frontmatter解析エラー: ${error.message}`);
    }
  }
  
  private validateParsedData(data: any): void {
    if (data.seo && typeof data.seo !== 'object') {
      throw new Error('SEO設定が不正な形式です');
    }
    
    // 必須プロパティのチェック
    if (data.seo) {
      if (!data.seo.title || typeof data.seo.title !== 'string') {
        throw new Error('titleプロパティが必須です');
      }
      if (!data.seo.description || typeof data.seo.description !== 'string') {
        throw new Error('descriptionプロパティが必須です');
      }
      if (!data.seo.primaryKeywords || !Array.isArray(data.seo.primaryKeywords)) {
        throw new Error('primaryKeywordsプロパティが必須で、配列である必要があります');
      }
    }
  }
}
```

## 実装計画（詳細版）

### Day 1: 型定義とバリデーター基盤

**午前: 型定義の実装（9:00-12:00）**
- [ ] BasicSEOProps型定義の作成
  - 必須プロパティの定義（title, description, primaryKeywords, seoProperty）
  - オプションプロパティの定義（longTailKeywords, articleKeywords, categoryKeywords等）
  - 型制約の設定（文字列長制限、配列要素数制限、列挙型制約）
  - JSDocコメントの追加（各プロパティの説明、使用例、制約事項）
- [ ] 既存型定義との競合チェック
  - 名前の重複確認（base-integration.ts, fallback-system.ts, metadata-input.ts）
  - 型の競合確認（インターフェース名、プロパティ名、型名）
  - 必要に応じた調整（名前空間の変更、型名の変更、プロパティ名の変更）

**午後: バリデーターの基本実装（13:00-17:00）**
- [ ] ManualKeywordValidatorクラスの基本構造
  - クラス定義（export class ManualKeywordValidator）
  - インターフェース定義（ValidationResult, KeywordValidationOptions）
  - 基本メソッドの実装（validateKeywords, optimizeKeywords, generateReport）
  - エラーハンドリングの実装（try-catch文、エラーログ、詳細エラー情報）

### Day 2: バリデーター機能の実装

**午前: キーワード検証機能（9:00-12:00）**
- [ ] キーワード長チェック（2-50文字）
  - 最小長チェック（2文字未満の検出、エラーメッセージ生成）
  - 最大長チェック（50文字超過の検出、警告メッセージ生成）
  - エラーメッセージの日本語化（「キーワードXが短すぎます: 値」「キーワードXが長すぎます: 値」）
  - 境界値テスト（1文字、2文字、49文字、50文字、51文字での動作確認）
- [ ] 重複チェック（大文字小文字区別なし）
  - 重複検出アルゴリズム（Array.filter + Array.indexOf、Set使用の比較）
  - 警告メッセージの生成（「重複キーワード: 値1, 値2, 値3」）
  - 重複除去機能（[...new Set(keywords)]による重複除去）
  - パフォーマンス最適化（O(n²)からO(n)への改善）

**午後: 個数制限と最適化機能（13:00-17:00）**
- [ ] 個数制限チェック（最大10個）
  - 個数制限の実装（keywords.length > 10の判定）
  - 警告メッセージの生成（「キーワード数が多すぎます（推奨: 10個まで）」）
  - 制限適用機能（slice(0, 10)による制限）
  - 境界値テスト（0個、1個、9個、10個、11個での動作確認）
- [ ] キーワード最適化機能
  - 重複除去（Set使用による高速重複除去）
  - 長さフィルタリング（2文字以上50文字以下のフィルタリング）
  - 最適化結果の返却（最適化されたキーワード配列の返却）
  - 最適化レポートの生成（除去されたキーワード数、警告数、エラー数の集計）

### Day 3: パーサーとテスト環境

**午前: Frontmatterパーサー（9:00-12:00）**
- [ ] ManualFrontmatterParserクラスの実装
  - YAMLパース機能（js-yamlライブラリの使用、try-catch文によるエラーハンドリング）
  - 型安全性チェック（パース結果の型ガード、必須プロパティの存在確認）
  - エラーレポート機能（詳細なエラー情報、エラー位置の特定、修正提案）
  - パフォーマンス最適化（大きなFrontmatterの効率的処理、メモリ使用量の最適化）
- [ ] バリデーション機能の統合
  - パース結果の検証（BasicSEOProps型との整合性確認、制約条件のチェック）
  - エラーハンドリング（階層的なエラー処理、部分的な成功時の処理）
  - 詳細なエラー情報（エラーの種類、発生箇所、修正方法の提案）

**午後: テスト環境の構築（13:00-17:00）**
- [ ] Jest設定の追加
  - テスト設定ファイルの作成（jest.config.js、テスト環境の設定、カバレッジ設定）
  - テスト環境の設定（TypeScript対応、ES6モジュール対応、パスエイリアス設定）
  - モックライブラリの設定（jest-mock-extended、@types/jest、テストユーティリティ）
  - カスタムマッチャーの作成（SEO関連の専用マッチャー、メタタグ検証マッチャー）
- [ ] テストファイルのテンプレート作成
  - 単体テストテンプレート（ManualKeywordValidator、ManualFrontmatterParser用）
  - 統合テストテンプレート（型定義とバリデーターの連携テスト用）
  - モックデータの準備（正常系・異常系・境界値のテストデータ）
  - テストヘルパー関数の作成（共通のテストロジック、アサーション関数）

## ファイル構成

### 新規作成ファイル

**型定義:**
- `src/types/basic-seo.ts` - BasicSEOの型定義

**ユーティリティ:**
- `src/utils/manual-keyword-validator.ts` - 手動キーワード検証
- `src/utils/manual-frontmatter-parser.ts` - Frontmatterパーサー

**テスト:**
- `tests/unit/basic-seo/` - 単体テスト
- `tests/unit/basic-seo/manual-keyword-validator.test.ts`
- `tests/unit/basic-seo/manual-frontmatter-parser.test.ts`
- `tests/unit/basic-seo/type-definitions.test.ts`

### 既存ファイル（変更禁止）

**型定義:**
- `src/types/base-integration.ts` - 変更禁止
- `src/types/fallback-system.ts` - 変更禁止
- `src/types/metadata-input.ts` - 変更禁止

**設定ファイル:**
- `tsconfig.json` - 変更禁止
- `package.json` - 変更禁止

## 品質保証（詳細版）

### 品質基準

**型安全性:**
- TypeScript型チェック: 0エラー、0警告
- 既存型定義との競合: 0件
- 型定義の完全性: 100%

**バリデーション精度:**
- キーワード検証: 100%正常動作
- エラーメッセージ: 100%正確性
- 最適化機能: 95%以上精度

**パーサー機能:**
- YAMLパース: 100%正常動作
- 型安全性チェック: 100%動作
- エラーハンドリング: 100%動作

### 具体的なテストケース

#### **1. 型定義テスト**
```typescript
// 正常系テスト
test('BasicSEOProps型定義の整合性', () => {
  // Given: 有効なBasicSEOPropsオブジェクト
  const validProps: BasicSEOProps = {
    title: 'テストタイトル',
    description: 'テスト説明',
    primaryKeywords: ['テスト', 'キーワード'],
    seoProperty: {
      articleType: 'guide',
      learningStage: 'intermediate',
      searchIntent: 'informational'
    }
  };
  
  // When: 型チェックが実行される
  // Then: 型エラーが発生しない
  expect(validProps.title).toBe('テストタイトル');
  expect(validProps.primaryKeywords).toHaveLength(2);
  expect(validProps.seoProperty.articleType).toBe('guide');
});

// 異常系テスト
test('無効な型でのBasicSEOProps定義', () => {
  // Given: 無効な型のプロパティ
  const invalidProps = {
    title: 123, // 数値（文字列である必要がある）
    description: null, // null（文字列である必要がある）
    primaryKeywords: '文字列' // 文字列（配列である必要がある）
  };
  
  // When: 型チェックが実行される
  // Then: 適切な型エラーが発生する
  expect(() => {
    const props: BasicSEOProps = invalidProps as any;
  }).toThrow();
});
```

#### **2. キーワード検証テスト**
```typescript
// 境界値テスト
test('キーワード長の境界値テスト', () => {
  const validator = new ManualKeywordValidator();
  
  // Given: 境界値のキーワード
  const boundaryKeywords = [
    'a',           // 1文字（最小値未満）
    'ab',          // 2文字（最小値）
    'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz', // 50文字（最大値）
    'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzx' // 51文字（最大値超過）
  ];
  
  // When: 境界値でのバリデーションが実行される
  const result = validator.validateKeywords(boundaryKeywords);
  
  // Then: 境界値が正しく処理される
  expect(result.isValid).toBe(false);
  expect(result.errors).toContain('キーワード1が短すぎます: a');
  expect(result.warnings).toContain('キーワード4が長すぎます: abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzx');
  expect(result.optimizedKeywords).toHaveLength(2); // 2文字と50文字のみ有効
});

// パフォーマンステスト
test('大量キーワードでのパフォーマンス', () => {
  const validator = new ManualKeywordValidator();
  
  // Given: 大量のキーワード（1000個）
  const largeKeywordSet = Array.from({length: 1000}, (_, i) => `キーワード${i}`);
  
  // When: 大量キーワードでのバリデーションが実行される
  const startTime = performance.now();
  const result = validator.validateKeywords(largeKeywordSet);
  const endTime = performance.now();
  
  // Then: 100ms以内で処理が完了する
  expect(endTime - startTime).toBeLessThan(100);
  expect(result.optimizedKeywords).toHaveLength(10); // 最大10個に制限
});
```

#### **3. Frontmatterパーサーテスト**
```typescript
// 複雑なYAML構造テスト
test('ネストされたSEO設定の解析', () => {
  const parser = new ManualFrontmatterParser();
  
  // Given: 複雑なネスト構造のFrontmatter
  const complexFrontmatter = `
    seo:
      primaryKeywords: ["日本語学習", "イマージョン"]
      longTailKeywords: ["初心者向け", "効果的な学習法"]
      seoProperty:
        articleType: "guide"
        learningStage: "intermediate"
        searchIntent: "informational"
      advanced:
        canonicalUrl: "/docs/guide"
        noIndex: false
        ogImage:
          src: "/images/guide.png"
          alt: "学習ガイド"
  `;
  
  // When: 複雑な構造のパースが実行される
  const result = parser.parse(complexFrontmatter);
  
  // Then: 正しく構造化されたオブジェクトが返される
  expect(result.seo.primaryKeywords).toEqual(['日本語学習', 'イマージョン']);
  expect(result.seo.seoProperty.articleType).toBe('guide');
  expect(result.seo.advanced.canonicalUrl).toBe('/docs/guide');
  expect(result.seo.advanced.ogImage.src).toBe('/images/guide.png');
});
```

### 品質保証プロセス

#### **1. コードレビュー**
- **自動チェック**: ESLint、Prettier、TypeScript型チェック
- **手動レビュー**: 既存型定義との競合確認、命名規則の確認
- **セキュリティチェック**: インジェクション対策、XSS対策

#### **2. テスト戦略**
- **単体テスト**: 各クラス・関数の個別テスト（カバレッジ95%以上）
- **境界値テスト**: 制限値での動作確認、エッジケースの検証
- **パフォーマンステスト**: 大量データでの処理時間測定

#### **3. 品質監視**
- **型安全性**: コンパイル時の型エラー監視
- **バリデーション精度**: テスト結果の精度測定
- **パフォーマンス**: 処理時間の継続的監視

### テスト戦略

**単体テスト:**
- ManualKeywordValidatorクラスの全メソッド
- ManualFrontmatterParserクラスの全メソッド
- 型定義の整合性チェック

**境界値テスト:**
- キーワード長の境界値（1文字、2文字、49文字、50文字、51文字）
- キーワード数の境界値（0個、1個、9個、10個、11個）
- 空文字、null値、undefined値

**エラーケーステスト:**
- 不正なYAML形式
- 必須プロパティの不足
- 不正な型のプロパティ

## リスク管理

### 特定されたリスク

**型定義の競合:**
- 既存型定義との名前の重複
- 型の競合によるビルドエラー
- 既存コードへの影響

**バリデーションの精度:**
- キーワード検証の誤判定
- エラーメッセージの不正確性
- 最適化機能の不具合

**パーサーの安定性:**
- YAMLパースの失敗
- 型安全性チェックの漏れ
- エラーハンドリングの不備

### 軽減策

**型定義の競合回避:**
- 既存型定義の事前確認
- ユニークな名前空間の使用
- 段階的な型定義の追加

**バリデーションの精度向上:**
- 包括的なテストケース
- 境界値の詳細テスト
- エラーケースの網羅的テスト

**パーサーの安定性向上:**
- 堅牢なエラーハンドリング
- 型安全性の厳格なチェック
- 詳細なエラー情報の提供

## 次のステップ

1. **実装開始の承認**: このSub-Storyでの実装開始
2. **Day 1の開始**: 型定義とバリデーター基盤の実装開始
3. **定期レビュー**: 各Day完了時のレビュー実施
4. **🚨 安全性確認**: 各段階での既存システム保護確認
5. **エラー監視**: 実装中のエラー発生状況の監視
6. **品質チェック**: 各段階での品質基準の確認

この基盤設計・型定義構築により、BasicSEOコンポーネントの土台が整い、型安全性とバリデーション機能が保証されます。各Dayでの品質ゲートを確実に通過し、次のSub-Storyへの準備を完了します。

---

## 🔍 要件とテストのトレーサビリティマッピング

### 📋 要件トレーサビリティマトリックス

#### **REQ-001: BasicSEOProps型定義**

| テストケース | Given（前提条件） | When（実行条件） | Then（期待結果） | 品質基準 | ステータス |
|-------------|------------------|------------------|------------------|----------|------------|
| TC-001-01 | 必須プロパティのみでBasicSEOPropsが定義される | TypeScript型チェックが実行される | 型エラーが発生しない | 0エラー | 🔄 計画中 |
| TC-001-02 | オプションプロパティを含むBasicSEOPropsが定義される | 型チェックが実行される | 型エラーが発生しない | 0エラー | 🔄 計画中 |
| TC-001-03 | 無効な型のプロパティが設定される | 型チェックが実行される | 適切な型エラーが発生する | 100%型安全性 | 🔄 計画中 |

#### **REQ-002: キーワード検証システム**

| テストケース | Given（前提条件） | When（実行条件） | Then（期待結果） | 品質基準 | ステータス |
|-------------|------------------|------------------|------------------|----------|------------|
| TC-002-01 | 有効なキーワード配列が入力される | ManualKeywordValidator.validateKeywords()が実行される | 検証結果が有効（isValid: true）で返される | 100%動作 | 🔄 計画中 |
| TC-002-02 | 短すぎるキーワード（2文字未満）が含まれる | バリデーションが実行される | エラーメッセージが返され、isValid: falseになる | 100%精度 | 🔄 計画中 |
| TC-002-03 | 長すぎるキーワード（50文字超過）が含まれる | バリデーションが実行される | 警告メッセージが返され、最適化されたキーワードが返される | 95%精度 | 🔄 計画中 |

#### **REQ-003: Frontmatterパーサー**

| テストケース | Given（前提条件） | When（実行条件） | Then（期待結果） | 品質基準 | ステータス |
|-------------|------------------|------------------|------------------|----------|------------|
| TC-003-01 | 有効なYAML形式のFrontmatterが入力される | ManualFrontmatterParser.parse()が実行される | パースされたSEO設定オブジェクトが返される | 100%動作 | 🔄 計画中 |
| TC-003-02 | 無効なYAML形式のFrontmatterが入力される | パース処理が実行される | 適切なエラーメッセージが返される | 100%エラーハンドリング | 🔄 計画中 |
| TC-003-03 | 必須SEOプロパティが不足しているFrontmatter | バリデーションが実行される | 必須プロパティ不足のエラーメッセージが返される | 100%検証 | 🔄 計画中 |

### 🧪 テストシナリオ詳細（Given-When-Then形式）

#### **TC-001-01: 必須プロパティの型チェック**

```typescript
describe('BasicSEOProps - 必須プロパティの型チェック', () => {
  test('必須プロパティのみでの型定義', () => {
    // Given: 必須プロパティのみでBasicSEOPropsが定義される
    const basicProps: BasicSEOProps = {
      title: '日本語学習ガイド',
      description: '効果的な日本語学習方法を紹介します',
      primaryKeywords: ['日本語学習', 'イマージョン'],
      seoProperty: {
        articleType: 'guide',
        learningStage: 'intermediate',
        searchIntent: 'informational'
      }
    };
    
    // When: TypeScript型チェックが実行される
    // Then: 型エラーが発生しない（コンパイル成功）
    expect(basicProps.title).toBe('日本語学習ガイド');
    expect(basicProps.primaryKeywords).toHaveLength(2);
    expect(basicProps.seoProperty.articleType).toBe('guide');
  });
});
```

#### **TC-002-01: 有効なキーワードの検証**

```typescript
describe('ManualKeywordValidator - 有効なキーワード検証', () => {
  test('正常なキーワード配列の検証', () => {
    // Given: 有効なキーワード配列が準備される
    const validKeywords = ['日本語学習', 'イマージョン', 'GoRakuDo'];
    const validator = new ManualKeywordValidator();
    
    // When: バリデーションが実行される
    const result = validator.validateKeywords(validKeywords);
    
    // Then: 検証結果が有効で返される
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.optimizedKeywords).toEqual(validKeywords);
    expect(result.warnings).toHaveLength(0);
  });
});
```

#### **TC-003-01: 有効なFrontmatterの解析**

```typescript
describe('ManualFrontmatterParser - 有効なFrontmatter解析', () => {
  test('正常なYAML形式の解析', () => {
    // Given: 有効なYAML形式のFrontmatterが準備される
    const validFrontmatter = `
      seo:
        primaryKeywords: ["日本語学習", "イマージョン"]
        articleType: "guide"
        learningStage: "intermediate"
        searchIntent: "informational"
    `;
    const parser = new ManualFrontmatterParser();
    
    // When: パース処理が実行される
    const result = parser.parse(validFrontmatter);
    
    // Then: パースされたSEO設定オブジェクトが返される
    expect(result.seo.primaryKeywords).toEqual(['日本語学習', 'イマージョン']);
    expect(result.seo.articleType).toBe('guide');
    expect(result.seo.learningStage).toBe('intermediate');
    expect(result.seo.searchIntent).toBe('informational');
  });
});
```

---

このSub-Story 5.1により、BasicSEOコンポーネントの基盤が確実に構築され、次のSub-Storyへの準備が完了します。

## Dev Notes

### 関連ソースツリー情報

**型定義ディレクトリ（src/types/）:**
- `base-integration.ts` - 既存の基本統合型定義（変更禁止）
- `fallback-system.ts` - 既存のフォールバックシステム型定義（変更禁止）
- `metadata-input.ts` - 既存のメタデータ入力型定義（変更禁止）
- `basic-seo.ts` - 新規作成予定のBasicSEO型定義

**ユーティリティディレクトリ（src/utils/）:**
- `manual-keyword-validator.ts` - 新規作成予定のキーワード検証ユーティリティ
- `manual-frontmatter-parser.ts` - 新規作成予定のFrontmatterパーサー

**テストディレクトリ（tests/unit/）:**
- `basic-seo/` - 新規作成予定のBasicSEOテストディレクトリ

### 既存システムとの競合回避戦略

**1. 型定義の競合チェック手順:**
- 既存の`src/types/`ディレクトリ内の全ファイルを事前に確認
- 新規型名（BasicSEOProps、ValidationResult等）が既存型名と重複していないかチェック
- 必要に応じて名前空間（namespace）を使用して競合を回避

**2. ファイル作成時の競合回避:**
- 新規ファイル作成前に既存ファイルの存在確認
- ファイル名の一意性を保証（例：`basic-seo.ts`、`manual-keyword-validator.ts`）
- 既存のユーティリティ関数との名前の重複を避ける

**3. 既存コードへの影響回避:**
- 既存のimport文や型参照を変更しない
- 新規作成する型定義は既存の型定義を拡張する形で実装
- 既存のコンポーネントやユーティリティへの影響を最小限に抑制

### 技術的実装の詳細

**TypeScript厳格モード準拠:**
- `tsconfig.json`の`strict: true`設定に準拠
- 型安全性を最大限に活用（any型の使用禁止、null/undefinedの適切な処理）
- インターフェースと型定義の明確な分離

**ESモジュール準拠:**
- 全てのJavaScript/TypeScriptファイルで`import`/`export`文を使用
- CommonJS（`require`/`module.exports`）の使用禁止
- モジュール解決の一貫性を保つ

**DRY・KISS原則の適用:**
- 共通のバリデーションロジックを再利用可能な関数に抽象化
- 複雑なロジックは避け、読みやすく理解しやすいコードを記述
- 設定値や定数は一箇所で管理

### 既存システムの保護

**変更禁止ファイルの厳格な遵守:**
- `src/types/base-integration.ts` - 絶対に変更・削除しない
- `src/types/fallback-system.ts` - 絶対に変更・削除しない
- `src/types/metadata-input.ts` - 絶対に変更・削除しない
- `tsconfig.json` - 絶対に変更・削除しない
- `package.json` - 絶対に変更・削除しない

**新規作成のみの制限:**
- 新規ファイルの作成のみ許可
- 既存ファイルの上書き・変更・削除は一切禁止
- 既存の設定やコードへの影響を完全に回避

### テスト環境の詳細

**Jest設定の詳細:**
- `jest.config.js`の作成（TypeScript対応、ES6モジュール対応）
- テスト環境の設定（Node.js環境、モックライブラリの設定）
- カバレッジ設定（95%以上のカバレッジ目標）

**テストファイルの構造:**
- 単体テスト（ManualKeywordValidator、ManualFrontmatterParser用）
- 統合テスト（型定義とバリデーターの連携テスト用）
- モックデータの準備（正常系・異常系・境界値のテストデータ）

**テストヘルパー関数:**
- 共通のテストロジックの抽象化
- SEO関連の専用マッチャーの作成
- メタタグ検証マッチャーの作成

### パフォーマンスとセキュリティ

**パフォーマンス最適化:**
- キーワード検証のアルゴリズム最適化（O(n²)からO(n)への改善）
- 大きなFrontmatterの効率的処理
- メモリ使用量の最適化

**セキュリティ考慮事項:**
- YAMLパース時のインジェクション対策
- 入力データの適切なサニタイゼーション
- エラー情報の適切な制御（機密情報の漏洩防止）

### 品質保証プロセス

**コードレビュー:**
- ESLint、Prettier、TypeScript型チェックの自動実行
- 既存型定義との競合確認の手動レビュー
- 命名規則とコーディング規約の確認

**テスト戦略:**
- 単体テスト（各クラス・関数の個別テスト）
- 境界値テスト（制限値での動作確認）
- パフォーマンステスト（大量データでの処理時間測定）

**品質監視:**
- コンパイル時の型エラー監視
- テスト結果の精度測定
- 処理時間の継続的監視

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|---------|
| 2025-01-XX | 1.0 | 初回作成 - 基盤設計・型定義構築のSub-Story | PO |
| 2025-01-XX | 1.1 | Dev Notesセクションの充実化、不足セクションの追加 | PO |

## Dev Agent Record

### Agent Model Used
{{agent_model_name_version}}

### Debug Log References
{{debug_log_references}}

### Completion Notes List
{{completion_notes}}

### File List
{{file_list}}

## QA Results
{{qa_results}}
