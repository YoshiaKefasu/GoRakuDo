<!-- Powered by BMAD™ Core -->

# Story 5: 推奨システムの代替ソリューション開発

## Status

**⏳ Ready for Development** - 推奨システムの代替ソリューション開発準備完了

## Story

**As a** コンテンツ作成者,
**I want** Gemini APIに依存しない推奨システムの代替機能,
**So that** 自動生成機能がなくても、高品質なメタデータとキーワードの提案を受けられる.

## 高校生向け説明

### 🎯 何をやるの？
今までGemini APIが自動で提案していた「キーワード」や「説明」を、今度は人間が作ったルールや既存の記事から自動で提案するシステムに置き換えるんだ。

**推奨システムって何？**
- 記事を書くときに「こんなキーワードはどう？」と提案してくれる機能
- 既存の記事から関連する内容を自動で見つけてくれる機能
- 人間が作ったルールに基づいて、適切な提案をしてくれる機能

### 🔧 どうやって実装するの？
1. **ルールベース推奨**: 人間が作ったルールに基づいて提案する
2. **既存記事分析**: 過去の記事から関連する内容を自動で見つける
3. **統計ベース推奨**: 人気のあるキーワードやパターンを分析して提案する

## Acceptance Criteria

**ルールベース推奨機能要件:**

1. 人間が定義した推奨ルールの管理システム
2. 記事のカテゴリに基づくキーワード推奨
3. 記事の長さに基づく説明文の長さ推奨
4. 季節やイベントに基づくタイムリーな推奨

**既存記事分析機能要件:**

5. 既存記事からの関連キーワード抽出
6. 類似記事の自動検索と推奨
7. 人気記事のパターン分析
8. トレンドキーワードの自動検出

**統計ベース推奨機能要件:**

9. キーワードの使用頻度分析
10. 記事のパフォーマンス統計
11. 読者の興味傾向分析
12. 効果的なメタデータパターンの提案

**統合推奨機能要件:**

13. 複数の推奨ソースからの統合提案
14. 推奨の信頼度スコア表示
15. 推奨内容のカスタマイズ機能
16. 推奨履歴の管理と学習機能

## General Principles

### 1. DRY (Don't Repeat Yourself - 繰り返しを避ける)
- **MANDATORY**: コードの重複を避けます
- 共通の推奨ロジックは再利用可能な関数やクラスに抽象化します
- 同様の分析ロジックが3回以上出現する場合は、必ず共通化を検討します
- 設定値や定数は一箇所で管理し、複数箇所でハードコーディングしないでください

### 2. KISS (Keep It Simple, Stupid - シンプルにしておけ)
- **MANDATORY**: 複雑な解決策よりもシンプルな解決策を優先します
- 過度に抽象化したり、パターンを適用しすぎないでください
- 読みやすく理解しやすいコードを書いてください
- 複雑なロジックが必要な場合は、必ずコメントで理由を説明してください

### 3. Data-Driven Decisions
- 既存データの分析に基づく推奨
- 統計的な根拠のある提案
- 継続的な学習と改善

### 4. User Control
- ユーザーが推奨を選択・拒否できる
- 推奨の理由が分かりやすい
- カスタマイズ可能な推奨設定

## Tasks / Subtasks

- [ ] ルールベース推奨システムの実装（AC: #1-4）
  - [ ] 推奨ルール管理システムの作成
  - [ ] カテゴリベース推奨機能の実装
  - [ ] 記事長さベース推奨機能の実装
  - [ ] タイムリー推奨機能の実装

- [ ] 既存記事分析システムの実装（AC: #5-8）
  - [ ] 関連キーワード抽出機能の実装
  - [ ] 類似記事検索機能の実装
  - [ ] 人気記事パターン分析機能の実装
  - [ ] トレンド検出機能の実装

- [ ] 統計ベース推奨システムの実装（AC: #9-12）
  - [ ] キーワード使用頻度分析機能の実装
  - [ ] 記事パフォーマンス統計機能の実装
  - [ ] 読者興味傾向分析機能の実装
  - [ ] 効果的パターン提案機能の実装

- [ ] 統合推奨システムの実装（AC: #13-16）
  - [ ] 複数ソース統合機能の実装
  - [ ] 信頼度スコア表示機能の実装
  - [ ] カスタマイズ機能の実装
  - [ ] 推奨履歴管理機能の実装

## Dev Notes

### 🚀 実装者向けクイックスタート

#### 1. 即座に必要な情報（Phase 1開始用）
- **Story 4完了確認**: 手動メタデータ入力機能が完了していることを確認
- **既存データ**: 過去の記事データとメタデータの分析
- **品質要件**: 推奨の精度とユーザビリティの確保

#### 2. 実装順序（依存関係考慮済み）
- **Phase 1**: ルールベース推奨システムの実装（Story 4完了確認後）
- **Phase 2**: 既存記事分析システムの実装（ルールベース完了後）
- **Phase 3**: 統計ベース推奨システムの実装（記事分析完了後）
- **Phase 4**: 統合推奨システムの実装（全機能完了後）

#### 3. Story 4との連携ポイント
- **入力機能完了確認**: Story 4で手動入力機能が完了していることを確認
- **データ構造**: 手動入力されたメタデータとの互換性確認
- **段階的実装**: 基本推奨から高度な推奨への段階的実装

#### 4. 具体的な実装手順

**重要**: 各フェーズ完了後には必ずビルドとTypeScriptチェックを実行し、システムの安定性を確認してください。これにより、段階的な実装での問題を早期に発見できます。

**既存データ分析インフラの活用（DRY原則）:**
- **データ分析**: 既存の記事データとメタデータの活用
- **統計処理**: 既存の統計ライブラリの活用
- **パターン分析**: 既存の分析ロジックの再利用

**Phase 1: ルールベース推奨システムの実装**
```bash
# 1. Story 4完了の確認
cat bmad-docs/stories/epic-metadata-removal-story-4.md

# 2. 既存データ構造の確認
find src/ -name "*.ts" -exec grep -l "metadata\|keyword" {} \;

# 3. 推奨ルール管理システムの作成
mkdir -p src/components/recommendation
touch src/components/recommendation/RuleBasedRecommender.tsx

# 4. カテゴリベース推奨機能の実装
touch src/components/recommendation/CategoryRecommender.tsx

# 5. ビルドとTypeScriptチェック（Phase 1完了後）
npm run build
npm run astro check
```

**Phase 2: 既存記事分析システムの実装**
```bash
# 1. 関連キーワード抽出機能の実装
touch src/components/recommendation/KeywordExtractor.tsx

# 2. 類似記事検索機能の実装
touch src/components/recommendation/SimilarArticleFinder.tsx

# 3. 人気記事パターン分析機能の実装
touch src/components/recommendation/PatternAnalyzer.tsx

# 4. トレンド検出機能の実装
touch src/components/recommendation/TrendDetector.tsx

# 5. ビルドとTypeScriptチェック（Phase 2完了後）
npm run build
npm run astro check
```

**Phase 3: 統計ベース推奨システムの実装**
```bash
# 1. キーワード使用頻度分析機能の実装
touch src/components/recommendation/KeywordFrequencyAnalyzer.tsx

# 2. 記事パフォーマンス統計機能の実装
touch src/components/recommendation/PerformanceAnalyzer.tsx

# 3. 読者興味傾向分析機能の実装
touch src/components/recommendation/InterestAnalyzer.tsx

# 4. 効果的パターン提案機能の実装
touch src/components/recommendation/PatternRecommender.tsx

# 5. ビルドとTypeScriptチェック（Phase 3完了後）
npm run build
npm run astro check
```

**Phase 4: 統合推奨システムの実装**
```bash
# 1. 複数ソース統合機能の実装
touch src/components/recommendation/IntegratedRecommender.tsx

# 2. 信頼度スコア表示機能の実装
touch src/components/recommendation/ConfidenceScore.tsx

# 3. カスタマイズ機能の実装
touch src/components/recommendation/RecommendationCustomizer.tsx

# 4. 推奨履歴管理機能の実装
touch src/components/recommendation/RecommendationHistory.tsx

# 5. ビルドとTypeScriptチェック（Phase 4完了後）
npm run build
npm run astro check
```

### 技術的詳細

#### データモデルとスキーマ
- **推奨ルール**: JSON形式でのルール定義
- **分析結果**: 統計データとパターン情報の保存
- **推奨履歴**: ユーザーの選択とフィードバックの記録

#### コンポーネント設計
- **RuleBasedRecommender**: ルールベース推奨のメインコンポーネント
- **KeywordExtractor**: 既存記事からのキーワード抽出
- **PatternAnalyzer**: 記事パターンの分析
- **IntegratedRecommender**: 統合推奨システム

#### ファイル配置
- **コンポーネント**: `src/components/recommendation/`
- **ユーティリティ**: `src/utils/recommendation/`
- **データ**: `src/data/recommendation/`
- **テスト**: `tests/unit/recommendation/`

#### テスト要件
- **テストファイル配置**: 既存の`tests/unit/`、`tests/integration/`構造を活用
- **テストフレームワーク**: Jest（既存プロジェクトの標準）
- **カバレッジ**: 既存のJest設定で90%以上のテストカバレッジを目標
- **ビルド検証**: 各フェーズ完了後のビルドプロセスの正常動作確認

### プロジェクト構造の整合性

#### 既存パターンとの整合性
- **コンポーネント**: 既存のReactコンポーネントパターンに準拠
- **データ分析**: 既存のデータ処理パターンを活用
- **テスト**: 既存のテスト構造に準拠

#### 構造的注意点
- 既存のコンポーネント命名規則を維持
- 既存のデータ構造との互換性を確保
- 既存のテストパターンに従う

### セキュリティ考慮事項

#### データ保護
- 記事データの適切なアクセス制御
- 統計情報の機密性保護
- ユーザー履歴のプライバシー保護

#### 推奨システムの安全性
- 不適切な内容の推奨防止
- 推奨内容の適切なフィルタリング
- ユーザー入力の安全な処理

### エラーハンドリングと復旧

#### 推奨失敗時の対応
- 代替推奨の提供
- エラー状態の適切な表示
- 手動入力へのフォールバック

#### システムエラー時の対応
- 推奨機能の一時無効化
- エラー状態からの復旧手順
- ユーザーへの適切なガイダンス

## Testing

### テストファイルの配置
- **ルールベーステスト**: `tests/unit/recommendation/rule-based/`
- **記事分析テスト**: `tests/unit/recommendation/article-analysis/`
- **統計推奨テスト**: `tests/unit/recommendation/statistical/`
- **統合テスト**: `tests/integration/recommendation/`

### テスト基準
- **テストフレームワーク**: Jest（既存プロジェクトの標準）
- **カバレッジ**: 既存のJest設定で90%以上のテストカバレッジを目標

### このストーリー固有のテスト要件
- **ルールベース推奨**: 推奨ルールの正確な適用
- **記事分析**: 既存記事からの正確な情報抽出
- **統計推奨**: 統計データの正確な分析
- **統合推奨**: 複数ソースからの適切な統合

### テスト実行手順
```bash
# 既存テストインフラの活用（DRY原則）
node tests/run-tests.js

# 個別テストの実行
npx jest tests/unit/recommendation/rule-based/
npx jest tests/unit/recommendation/article-analysis/
npx jest tests/unit/recommendation/statistical/
npx jest tests/integration/recommendation/

# カバレッジレポートの生成
npx jest --coverage
```

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|---------|
| 2024-12-19 | 1.0 | 初回作成 | Bob (Scrum Master) |

## Dev Agent Record

### Agent Model Used
**dev** - Full Stack Developer (TBD)

### Debug Log References
- **Phase 1**: ルールベース推奨システムの実装（未開始）
- **Phase 2**: 既存記事分析システムの実装（未開始）
- **Phase 3**: 統計ベース推奨システムの実装（未開始）
- **Phase 4**: 統合推奨システムの実装（未開始）

### Completion Notes List
⏳ **Phase 1**: ルールベース推奨システムの実装（未開始）
- 推奨ルール管理システムの作成
- カテゴリベース推奨機能の実装
- 記事長さベース推奨機能の実装
- タイムリー推奨機能の実装

⏳ **Phase 2**: 既存記事分析システムの実装（未開始）
- 関連キーワード抽出機能の実装
- 類似記事検索機能の実装
- 人気記事パターン分析機能の実装
- トレンド検出機能の実装

⏳ **Phase 3**: 統計ベース推奨システムの実装（未開始）
- キーワード使用頻度分析機能の実装
- 記事パフォーマンス統計機能の実装
- 読者興味傾向分析機能の実装
- 効果的パターン提案機能の実装

⏳ **Phase 4**: 統合推奨システムの実装（未開始）
- 複数ソース統合機能の実装
- 信頼度スコア表示機能の実装
- カスタマイズ機能の実装
- 推奨履歴管理機能の実装

### File List
**新規作成予定ファイル:**
- `src/components/recommendation/RuleBasedRecommender.tsx` - ルールベース推奨
- `src/components/recommendation/CategoryRecommender.tsx` - カテゴリベース推奨
- `src/components/recommendation/KeywordExtractor.tsx` - キーワード抽出
- `src/components/recommendation/SimilarArticleFinder.tsx` - 類似記事検索
- `src/components/recommendation/PatternAnalyzer.tsx` - パターン分析
- `src/components/recommendation/TrendDetector.tsx` - トレンド検出
- `src/components/recommendation/KeywordFrequencyAnalyzer.tsx` - 使用頻度分析
- `src/components/recommendation/PerformanceAnalyzer.tsx` - パフォーマンス分析
- `src/components/recommendation/InterestAnalyzer.tsx` - 興味傾向分析
- `src/components/recommendation/PatternRecommender.tsx` - パターン提案
- `src/components/recommendation/IntegratedRecommender.tsx` - 統合推奨
- `src/components/recommendation/ConfidenceScore.tsx` - 信頼度スコア
- `src/components/recommendation/RecommendationCustomizer.tsx` - カスタマイズ
- `src/components/recommendation/RecommendationHistory.tsx` - 履歴管理

**既存ファイル（変更予定）:**
- 既存の記事データ構造
- 既存のメタデータ処理ロジック
- 既存のテスト設定

## QA Results

### Review Date: TBD

### Reviewed By: TBD

### Code Quality Assessment

**TBD** - 実装完了後に評価予定

### Refactoring Performed

**なし** - 新規実装のため

### Compliance Check

- Coding Standards: ⏳ 実装完了後に評価予定
- Project Structure: ⏳ 実装完了後に評価予定
- Testing Strategy: ⏳ 実装完了後に評価予定
- All ACs Met: ⏳ 実装完了後に評価予定

### Improvements Checklist

- [ ] 既存データ分析インフラの活用（DRY原則）
- [ ] 既存統計処理ライブラリの活用（DRY原則）
- [ ] 段階的実装によるリスク最小化（KISS原則）
- [ ] 既存ビルドシステムの活用（DRY原則）
- [ ] 包括的なテスト環境の構築
- [ ] 推奨精度の最適化
- [ ] ユーザビリティの向上
- [ ] パフォーマンスの最適化

### Security Review

**セキュリティ評価予定** ⏳
- データアクセス制御の実装
- 統計情報の機密性保護
- ユーザー履歴のプライバシー保護

### Performance Considerations

**パフォーマンス評価予定** ⏳
- 推奨計算の効率性
- 大量データの処理速度
- リアルタイム推奨の応答性

### Files Modified During Review

**なし** - レビュー中にファイルの修正は行っていません。

### Gate Status

**Gate: PENDING** ⏳ → 実装完了後に評価予定

### Recommended Status

⏳ **Ready for Development** - Story 4完了後に実装開始予定。既存データ分析インフラの活用により、効率的な開発が可能。
