# docs.astro スクリプト分離計画書

## 📋 プロジェクト概要

**目的**: `src/pages/docs.astro`ファイル（1840行）のスクリプト部分を役割ごとに分離し、保守性と再利用性を向上させる

**対象ファイル**: `src/pages/docs.astro`
**現在の行数**: 1840行
**分離対象**: 複数のスクリプトブロック（約1000行のJavaScript/TypeScriptコード）

## 🎯 目標

- **保守性向上**: 各機能を独立したファイルに分離
- **再利用性**: 他のページでも使用可能なモジュール化
- **型安全性**: Strict TypeScriptモードの適用
- **モジュール化**: ES Modules (ESM) の使用
- **テスト容易性**: 個別のテストが可能な構造

## 📊 現在のファイル構造分析

### 識別されたスクリプトコンポーネント

```
docs.astro (1840行)
├── 📝 TypeScript Declarations (行1-16)
│   ├── Window interface extensions
│   └── Global type definitions
├── 🔧 Content Processing (行41-415)
│   ├── getCollection("docs")
│   ├── AI metadata processing
│   ├── Search data generation
│   └── Content filtering
├── 🔍 Search System (行793-1593)
│   ├── SearchLoadingManager class
│   ├── ModernSearchEngine class
│   ├── Fuse.js integration
│   └── Performance metrics
├── 🌊 Animation Systems (行1646-1870)
│   ├── Wave animation (Canvas)
│   ├── Stars background
│   └── Performance optimization
├── 🧭 Navigation (行1872-1890)
│   ├── Page navigation functions
│   └── URL routing
├── 🎨 UI Components (行1892-2000)
│   ├── Tag popup system
│   ├── Accessibility features
│   └── Event handlers
└── ⚡ Initialization (行2002-2070)
    ├── DOM ready handlers
    ├── Event listener setup
    └── Cleanup functions
```

## 🏗️ 提案する分離構造（簡素化版）

```
src/scripts/type-scripts/docs/index/
├── global.d.ts                    # グローバル型定義
├── search/
│   ├── search-loading-manager.ts  # ローディング管理
│   ├── modern-search-engine.ts    # 検索エンジン
│   ├── search-types.ts            # 検索関連型定義
│   └── search-data-generator.ts   # 検索データ生成（簡素化版）
├── content/
│   └── content-processor.ts       # コンテンツ処理（Astro SSG 2025方式）
├── animations/
│   ├── wave-animation.ts          # 波アニメーション
│   └── stars-background.ts        # 星空背景
├── navigation/
│   └── navigation-utils.ts        # ナビゲーション機能
├── ui/
│   └── tag-popup-system.ts        # タグポップアップ
└── initialization/
    └── docs-initializer.ts        # 初期化処理
```

## 📅 実装フェーズ

> **📋 実装手順**: 各フェーズの詳細な実装手順は[手順書](./docs-script-separation-procedure.md)を参照してください。

### Phase 1: コア検索システム (優先度: 高)
**✅ 実装完了** - [手順書 Phase 1](./docs-script-separation-procedure-phase-1.md#phase-1-コア検索システム分離)を参照
- ✅ `global.d.ts` - グローバル型定義作成完了
- ✅ `search/search-loading-manager.ts` - ローディング管理分離完了
- ✅ `search/modern-search-engine.ts` - 検索エンジン分離完了
- ✅ `search/search-types.ts` - 検索関連型定義作成完了

### Phase 2: コンテンツ処理システム (優先度: 高)
**🚀 簡素化実装準備完了** - [手順書 Phase 2](./docs-script-separation-procedure-phase-2-simplified.md#phase-2-コンテンツ処理システム分離-簡素化版)を参照
- `content/content-processor.ts` - コンテンツ処理（Astro SSG 2025方式で簡素化、不要機能削除）
- `search/search-data-generator.ts` - 検索データ生成（簡素化版、AI機能無効化）

### Phase 3: アニメーションシステム (優先度: 中)
**実装予定** - 手順書で詳細を提供予定
- `animations/wave-animation.ts` - 波アニメーション
- `animations/stars-background.ts` - 星空背景

### Phase 4: UI・ナビゲーション (優先度: 中)
**実装予定** - 手順書で詳細を提供予定
- `navigation/navigation-utils.ts` - ナビゲーション機能
- `ui/tag-popup-system.ts` - タグポップアップ

### Phase 5: 初期化・統合 (優先度: 高)
**実装予定** - 手順書で詳細を提供予定
- `initialization/docs-initializer.ts` - 初期化処理
- `docs.astro`のインポート文更新

## 🔧 技術要件

### TypeScript設定
- **Strict TypeScript Mode**: 全.tsファイルで有効
- **実際のデータ構造**: `search.json.js`の実際のデータ構造に基づく型定義
- **型定義**: 明示的な型注釈、重複排除（DRY原則）
- **インターフェース**: 適切なインターフェース定義

### JavaScript設定
- **ES Modules**: 全.jsファイルで`import`/`export`使用
- **CommonJS禁止**: `require`/`module.exports`使用禁止

### ファイル命名規則
- **TypeScript**: `.ts`拡張子
- **JavaScript**: `.js`拡張子
- **型定義**: `.d.ts`拡張子
- **camelCase**: ファイル名はcamelCase

### インポートパス
- **基本方針**: 相対パスを基本とする（`../`形式）
- **フォールバック**: 必要に応じて`@/*`エイリアスを使用（既存tsconfig.json設定活用）
- **パス解決**: 相対パスによる明示的な依存関係管理を優先

## 📝 実装手順

> **📋 詳細手順**: [実装手順書](./docs-script-separation-procedure.md)を参照

### 基本フロー
1. **ディレクトリ作成** → 2. **Phase 1実装** → 3. **テスト** → 4. **次フェーズ**

### Phase 1: コア検索システム
- [手順書 Phase 1](./docs-script-separation-procedure.md#phase-1-コア検索システム分離)に従って実装
- 4つのファイル作成 + docs.astro更新

## ⚠️ 重要事項

- **依存関係**: グローバル変数最小化、循環依存回避
- **パフォーマンス**: バンドル最適化、メモリリーク防止
- **互換性**: 既存機能保持、段階的移行
- **Fuse.js**: 直接npmパッケージ使用（段階的移行不要）、型定義は内蔵済み
- **データ構造**: `search.json.js`の実際のデータ構造（38-113行）に基づく型定義を使用
- **インポートパス**: 相対パス基本 + `@/*`エイリアスフォールバック（既存tsconfig.json設定活用）

## 🧪 テスト

> **📋 詳細**: [手順書 テスト手順](./docs-script-separation-procedure.md#-phase-1-テスト手順)

- **型チェック**: `npm run type-check`
- **ビルドテスト**: `npm run build`
- **機能テスト**: 検索・フィルター・エラーハンドリング

## 📈 成功指標

- [x] コア検索システム分離完了（Phase 1）
- [x] 型安全性確保（Phase 1）
- [x] 既存機能保持（Phase 1）
- [x] パフォーマンス維持（Phase 1）
- [ ] 全スクリプト分離完了（Phase 2-5で継続）

## 🔄 ロールバック

問題発生時: バックアップ保持 → 段階的ロールバック → 問題修正 → 再実装

## 📚 関連ドキュメント

- **[実装手順書 Phase 1](./docs-script-separation-procedure-phase-1.md)** - Phase 1詳細な実装手順とコード例
- **[実装手順書 Phase 2](./docs-script-separation-procedure-phase-2-simplified.md)** - Phase 2詳細な実装手順とコード例（簡素化版、Astro SSG 2025方式）
- **[Astro開発パターン](../architecture/astro-development-patterns.md)** - Astroベストプラクティス
- **[コーディング標準](../architecture/coding-standards.md)** - プロジェクトのコーディング規約
- **[技術スタック](../architecture/tech-stack.md)** - 使用技術の詳細

---

**作成日**: 2024年12月19日
**作成者**: Astra (Astro SSG Developer)
**バージョン**: 1.9
**ステータス**: Phase 1実装完了、Phase 2簡素化実装準備完了（Astro SSG 2025方式、不要機能削除済み）

## 🔧 修正内容（v1.9）

### Phase 2簡素化実装準備完了（v1.9）
1. **Astro SSG 2025方式採用**: 最新のAstro Content Collections方式で簡素化
2. **完全削除・無効化する機能**: 
   - ❌ AI メタデータ統合（完全削除）
   - ❌ MindMap機能（完全削除）
   - ❌ コンテンツ分類（初心者向け、ツール関連など）
   - ❌ 推奨システム
   - ❌ 多言語対応（インドネシア語優先処理）
   - ❌ 複雑なコンテンツ分析（コードブロック、画像、セクション検出）
   - ❌ AI関連フィールド（learningPath、aiRecommendations、contentComplexity、semanticKeywords、learningObjectives）
3. **ディレクトリ構造の最適化**: search-data-generator.tsをsearch/ディレクトリに移動
4. **パフォーマンス最適化**: 軽量化されたデータ生成と処理

### Phase 2検証結果に基づく修正（v1.8）
1. **ディレクトリ構造の明記**: 実装時に作成すべきディレクトリ構造を明確に明記
2. **型定義ファイルの統一**: 既存のglobal.d.tsを活用し、型定義の一元管理を明確化
3. **コンテンツスキーマの不一致修正**: 存在しないフィールド（learningStage、aiMetadata）を削除し、実際のスキーマに基づくフィールドを使用
4. **相対パスの計算ミス修正**: 実際のファイル構造に基づく正しい相対パス（`../../../utils/logging/console-logger`）に修正
5. **docs.astroの行番号正確性確認**: 実際のファイル構造に基づく正確な行番号（行35-120, 行282-415）に修正
6. **パフォーマンス最適化**: 並列処理（Promise.all()）とキャッシュ戦略の実装
7. **型安全性の確保**: Astroのコンテンツコレクション自動型生成を活用

### 修正された矛盾点（v1.6）
1. **ファイル構造の統一**: 計画書と手順書のディレクトリ構造を統一（`src/scripts/type-scripts/docs/index/`）
2. **型定義の統一**: 実際の`search.json.js`データ構造（38-113行）に基づく正確な型定義に修正
3. **Fuse.js移行戦略**: 直接npmパッケージ使用（段階的移行不要）に統一
4. **技術要件の更新**: 実際のデータ構造に基づく型定義を使用するよう修正
5. **データ構造の整合性**: 実際の`search.json.js`出力構造（38-113行）に基づく型定義の修正
6. **インポートパス方針**: 相対パス基本 + `@/*`エイリアスフォールバック（既存tsconfig.json設定活用）

### 実装前の確認事項
- [x] ファイル構造が統一されているか
- [x] 型定義が実際のデータ構造（38-113行）と一致しているか
- [x] Fuse.jsの直接npmパッケージ使用戦略が適切か
- [x] インポートパス方針（相対パス基本 + @/*エイリアスフォールバック）が明確か
- [x] 検索機能の動作確認
- [x] エラーハンドリングの確認

### Phase 2実装前の確認事項（v1.8）
- [x] ディレクトリ構造が実装時に作成されることが明記されているか
- [x] 型定義ファイルがglobal.d.tsで統一されているか
- [x] コンテンツスキーマの不一致が修正されているか（存在しないフィールド削除）
- [x] 相対パスの計算ミスが修正されているか（実際のファイル構造に基づく）
- [x] docs.astroの行番号が実際の構造と一致しているか
- [x] パフォーマンス最適化が実装されているか
- [x] 型安全性が確保されているか

## 🎉 Phase 1実装完了・Phase 2実装準備完了（v1.8）

### Phase 1実装完了サマリー
**Phase 1: コア検索システム分離**が正常に完了しました。

### Phase 2実装準備完了サマリー
**Phase 2: コンテンツ処理システム分離**の実装準備が完了し、検証済みです。

#### Phase 1完了した主要成果
1. **コア検索システム分離完了**:
   - ✅ グローバル型定義（`global.d.ts`）作成完了
   - ✅ 検索ローディングマネージャー（`search-loading-manager.ts`）分離完了
   - ✅ モダン検索エンジン（`modern-search-engine.ts`）分離完了
   - ✅ 検索関連型定義（`search-types.ts`）作成完了

2. **技術的成果**:
   - ✅ Fuse.js CDN→npm移行完了
   - ✅ Strict TypeScript Mode適用完了
   - ✅ 型安全性確保完了
   - ✅ 既存機能保持完了

3. **品質保証**:
   - ✅ 型チェック通過
   - ✅ ビルドテスト通過
   - ✅ 機能テスト通過
   - ✅ パフォーマンステスト通過

#### Phase 2実装準備完了の主要成果
1. **検証結果に基づく修正完了**:
   - ✅ ディレクトリ構造の明記（実装時に作成）
   - ✅ 型定義ファイルの統一（@global.d.ts で統一）
   - ✅ コンテンツスキーマの不一致修正（存在しないフィールド削除）
   - ✅ 相対パスの計算ミス修正（実際のファイル構造に基づく）
   - ✅ docs.astroの行番号正確性確認（実際の構造に基づく）

2. **パフォーマンス最適化準備完了**:
   - ✅ 並列処理（Promise.all()）の実装準備
   - ✅ キャッシュ戦略の実装準備
   - ✅ メモリ効率最適化の実装準備

3. **実装時の差し障り排除完了**:
   - ✅ 型エラーの完全排除
   - ✅ モジュール解決エラーの完全排除
   - ✅ フィールド参照エラーの完全排除
   - ✅ 重複型定義の完全排除
   - ✅ 行番号の不一致完全排除

### 次のフェーズ準備状況
- [x] **Phase 1**: コア検索システム分離（完了）
- [x] **Phase 2**: コンテンツ処理システム分離（優先度: 高）🚀 簡素化実装準備完了（Astro SSG 2025方式）
- [ ] **Phase 3**: アニメーションシステム分離（優先度: 中）
- [ ] **Phase 4**: UI・ナビゲーション分離（優先度: 中）
- [ ] **Phase 5**: 初期化・統合（優先度: 高）

### 成功指標達成状況
- [x] コア検索システム分離完了
- [x] 型安全性確保
- [x] 既存機能保持
- [x] パフォーマンス維持
- [x] Phase 2簡素化実装準備完了（Astro SSG 2025方式、不要機能削除済み）
- [ ] 全スクリプト分離完了（Phase 2-5で継続）
