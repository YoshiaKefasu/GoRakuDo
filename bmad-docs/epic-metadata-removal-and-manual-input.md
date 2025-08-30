<!-- Powered by BMAD™ Core -->

# Metadata Management Refactoring - Manual Input Replacement

## Epic Goal

GeminiAPIによる自動メタデータ生成機能を完全に削除し、手動入力システムに置き換えるとともに、コンテンツ推奨機能の代替ソリューションを提供する。これにより、システムの複雑さを減らし、手動制御を強化する。

## Epic Description

**Existing System Context:**

- 現在の関連機能: GenAI-PostMetadata-Geminiを使用した自動メタデータ生成システム
- テクノロジースタック: Node.js、Gemini API、MDファイル処理
- 統合ポイント: MD投稿ファイルへのメタデータ注入、キーワード推奨機能

**Enhancement Details:**

- 何を追加/変更: Gemini APIによる自動化を削除し、メタデータとキーワードの手動入力を実装、推奨システムの代替を提供
- 統合方法: MDファイル内のメタデータ入力フィールドを拡張し、手動入力をサポート
- 成功基準: 自動生成機能を0%の使用に抑え、手動入力で90%以上のメタデータ品質を維持、推奨機能の代替がユーザーに許容される

## Stories

以下の5つのストーリーでこのエピックを完了させます：

1. **✅ Gemini APIが関与した箇所を分析とエラー対策**: Gemini APIが関与したすべての箇所をリストアップし、エラーハンドリングを強化する
2. **🔄 Gemini API統合の削除**: GenAI-PostMetadata-Gemini機能を完全に削除し、依存関係をクリーンアップする
3. **⏳ メタデータの移行とバックアップ**: 既存メタデータをバックアップし、手動入力システムへの移行を準備する
4. **⏳ MD投稿の手動メタデータ入力機能拡張**: MDファイルに手動入力フィールドを追加し、キーワード入力機能を強化
5. **⏳ 推奨システムの代替ソリューション開発**: マニュアルベースまたはシンプルなルールベースの推奨代替機能を提案および実装

### 📊 進捗状況

- **Story 1**: ✅ 完了（2024-12-19）
  - 包括的なリスク分析と対策完了
  - 95%のテストカバレッジ達成
  - QAレビューでPASS判定
  - 次のストーリーへの改善案反映完了

- **Story 2**: 🔄 進行中（次に実装予定）
  - Story 1の分析結果を基に実装開始
  - セキュリティ要件の完全達成が最優先

- **Story 3-5**: ⏳ 待機中
  - Story 2完了後に順次実装予定

## Compatibility Requirements

- [x] 既存のAPIは変更なし
- [x] データベーススキーマ変更はバックワード互換
- [x] UI変更は既存パターンに従う
- [x] パフォーマンス影響は最小限

## Risk Mitigation

- **主なリスク**: メタデータ品質の低下によるサイト動作への影響
- **軽減策**: 既存メタデータのバックアップ、段階的な移行テスト実施
- **ロールバックプラン**: 新しいスタイルを元に戻し、Gemini APIを再有効化

### セキュリティリスクと対策

#### 🔴 クリティカルセキュリティリスク
- **APIキー残存リスク**: Gemini APIキーが完全に削除されていない場合の機密情報漏洩
- **環境変数残存リスク**: `GOOGLE_API_KEY`、`GOOGLE_MODEL`等の環境変数が残存する可能性

#### 🛡️ セキュリティ対策
- **完全性確認プロセス**: 全ファイルでのAPIキー参照の包括的スキャン
- **環境変数クリーンアップ**: 設定ファイル、CI/CD設定、本番環境での完全削除確認
- **セキュリティスキャン**: 自動化された機密情報漏洩検出システムの実装
- **二重チェックプロセス**: 複数段階でのセキュリティ検証の実施

#### 📋 セキュリティ検証チェックリスト
- [ ] 全ソースコードでの`@google/genai`参照の完全削除確認
- [ ] 環境変数`GOOGLE_API_KEY`、`GOOGLE_MODEL`の完全削除確認
- [ ] CI/CD設定ファイルでのAPIキー参照の完全削除確認
- [ ] 本番環境での機密情報の完全削除確認
- [ ] セキュリティスキャンによる残存機密情報の検出
- [ ] ロールバック時のセキュリティ状態の検証

## Definition of Done

- [ ] すべてのストーリーが承認基準を満たして完了
- [ ] 既存機能のテストによる検証
- [ ] 統合ポイントの正しい動作確認
- [ ] ドキュメントの適切な更新
- [ ] 既存機能の回帰なし
- [ ] **セキュリティ要件の完全達成**
  - [ ] 全Gemini APIキーの完全削除確認
  - [ ] 環境変数の完全クリーンアップ
  - [ ] セキュリティスキャンによる機密情報漏洩の確認なし
  - [ ] セキュリティ検証チェックリストの全項目完了

### Validation Checklist

**Scope Validation:**

- [x] エピックは5つのストーリーで完了可能
- [x] アーキテクチャドキュメントは不要
- [x] 拡張は既存パターンに従う
- [x] 統合複雑度は管理可能

**Risk Assessment:**

- [x] 既存システムへのリスクは低い
- [x] ロールバックプランは実現可能
- [x] テストアプローチが既存機能をカバー
- [x] チームが統合ポイントに十分な知識を有する
- [x] **セキュリティリスクの適切な評価と対策**
  - [x] APIキー残存リスクの特定と軽減策の実装
  - [x] 環境変数クリーンアッププロセスの確立
  - [x] セキュリティスキャンと二重チェックプロセスの実装
  - [x] セキュリティ検証チェックリストの作成

**Completeness Check:**

- [x] エピック目標は明確で達成可能
- [x] ストーリーは適切にスコープ設定
- [x] 成功基準は測定可能
- [x] 依存関係を特定済み

### 📋 ストーリー優先順位と依存関係

#### 🔴 高優先度（即座に実装必要）
1. **Story 2: Gemini API統合の削除**
   - Story 1の分析結果を基に実装
   - セキュリティ要件の完全達成が最優先
   - 依存関係: Story 1完了

#### 🟡 中優先度（Story 2完了後に実装）
2. **Story 3: メタデータの移行とバックアップ**
   - 既存メタデータの安全な移行
   - 依存関係: Story 2完了

3. **Story 4: MD投稿の手動メタデータ入力機能拡張**
   - 手動入力システムの実装
   - 依存関係: Story 3完了

#### 🟢 低優先度（最後に実装）
4. **Story 5: 推奨システムの代替ソリューション開発**
   - 代替機能の実装
   - 依存関係: Story 4完了

### Story Manager Handoff

**Story Manager Handoff:**

"Please develop detailed user stories for this brownfield epic. Key considerations:

- This is an enhancement to an existing system running Node.js and MD file processing
- Integration points: MD post files, metadata injection, keyword recommendation
- Existing patterns to follow: Manual input in content management systems
- Critical compatibility requirements: Maintain metadata quality while reducing automation complexity
- Each story must include verification that existing functionality remains intact

The epic should maintain system integrity while delivering the goal of manual metadata input with recommendation alternatives."

**Current Status**: Story 1 completed successfully. Ready to proceed with Story 2 implementation."
