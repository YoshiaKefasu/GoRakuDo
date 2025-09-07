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

## 🏗️ 提案する分離構造

```
src/scripts/type-scripts/docs/index/
├── global.d.ts                    # グローバル型定義
├── search/
│   ├── search-loading-manager.ts  # ローディング管理
│   ├── modern-search-engine.ts    # 検索エンジン
│   └── search-types.ts            # 検索関連型定義
├── content/
│   ├── content-processor.ts       # コンテンツ処理
│   └── search-data-generator.ts   # 検索データ生成
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
**🚀 実装準備完了** - [手順書 Phase 2](./docs-script-separation-procedure-phase-2.md#phase-2-コンテンツ処理システム分離)を参照
- `content/content-processor.ts` - コンテンツ処理（行41-415の処理ロジック分離）
- `content/search-data-generator.ts` - 検索データ生成（行282-415の検索データ生成分離）

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

- **[実装手順書](./docs-script-separation-procedure.md)** - 詳細な実装手順とコード例
- **[Astro開発パターン](../architecture/astro-development-patterns.md)** - Astroベストプラクティス
- **[コーディング標準](../architecture/coding-standards.md)** - プロジェクトのコーディング規約
- **[技術スタック](../architecture/tech-stack.md)** - 使用技術の詳細

---

**作成日**: 2024年12月19日
**作成者**: Astra (Astro SSG Developer)
**バージョン**: 1.7
**ステータス**: Phase 1実装完了（コア検索システム分離完了、型安全性確保、既存機能保持）

## 🔧 修正内容（v1.6）

### 修正された矛盾点
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

## 🎉 Phase 1実装完了（v1.7）

### 実装完了サマリー
**Phase 1: コア検索システム分離**が正常に完了しました。

#### 完了した主要成果
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

### 次のフェーズ準備状況
- [x] **Phase 1**: コア検索システム分離（完了）
- [ ] **Phase 2**: コンテンツ処理システム分離（優先度: 高）🚀 実装準備完了
- [ ] **Phase 3**: アニメーションシステム分離（優先度: 中）
- [ ] **Phase 4**: UI・ナビゲーション分離（優先度: 中）
- [ ] **Phase 5**: 初期化・統合（優先度: 高）

### 成功指標達成状況
- [x] コア検索システム分離完了
- [x] 型安全性確保
- [x] 既存機能保持
- [x] パフォーマンス維持
- [ ] 全スクリプト分離完了（Phase 2-5で継続）
