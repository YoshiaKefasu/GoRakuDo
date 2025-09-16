# 🔧 トラブルシューティングガイド

## 🚨 緊急度別問題解決

### 🔴 緊急（サイトが表示されない）

#### 問題: ビルドエラーでサイトが表示されない
**症状**: `npm run build` でエラーが発生

**原因と解決方法**:
1. **構文エラー**
   ```bash
   # エラーメッセージを確認
   npm run build
   ```
   - 設定ファイルのカンマ、括弧を確認
   - 引用符の閉じ忘れを確認

2. **ファイルパスエラー**
   ```bash
   # ファイルの存在確認
   ls public/icon/[ツール名]-icon-240.webp
   ```
   - アイコンファイルが正しい場所にあるか確認
   - ファイル名の大文字小文字を確認

3. **設定ファイルエラー**
   ```javascript
   // 正しい構文例
   const toolConfigs = {
     anki: { 
       iconPath: '/icon/anki-icon-240.webp', 
       description: '...' 
     },
     takoboto: { 
       iconPath: '/icon/takoboto-icon-240.webp', 
       description: '...' 
     }
   } as const;
   ```

**解決手順**:
1. エラーメッセージを読む
2. 該当ファイルを開く
3. 構文を修正
4. 再度ビルドテスト

---

### 🟡 中程度（ツールが表示されない）

#### 問題: 新しいツールが表示されない
**症状**: ツールページにアクセスしても404エラー

**原因と解決方法**:

1. **記事のtoolNameが間違っている**
   ```markdown
   # 正しい例
   ---
   toolName: 'Takoboto'  # 正確なツール名
   ---
   ```

2. **記事ファイルの場所が間違っている**
   ```
   # 正しい場所
   src/content/tool-articles/takoboto/pengenalan-takoboto.md
   
   # 間違った場所
   src/content/tool-articles/Takoboto/pengenalan-takoboto.md
   ```

3. **設定ファイルにツールが追加されていない**
   ```javascript
   // toolConfigsに追加が必要
   takoboto: { 
     iconPath: '/icon/takoboto-icon-240.webp', 
     description: '...' 
   }
   ```

**解決手順**:
1. 記事の`toolName`を確認
2. ファイルの場所を確認
3. 設定ファイルを確認
4. 開発サーバーを再起動

---

### 🟢 軽微（表示の問題）

#### 問題: アイコンが表示されない
**症状**: ツールページでアイコンが表示されない

**原因と解決方法**:

1. **ファイルパスが間違っている**
   ```javascript
   // 正しい例
   iconPath: '/icon/takoboto-icon-240.webp'
   
   // 間違った例
   iconPath: '/icon/Takoboto-icon-240.webp'  // 大文字小文字
   iconPath: '/icon/takoboto-icon-240.png'   // ファイル拡張子
   ```

2. **ファイルが存在しない**
   ```bash
   # ファイルの存在確認
   ls -la public/icon/takoboto-icon-240.webp
   ```

3. **ファイル形式が間違っている**
   - WebP形式を推奨
   - PNG形式も使用可能
   - サイズ: 240x240px

**解決手順**:
1. ファイルの存在を確認
2. ファイル名を確認
3. 設定ファイルのパスを確認
4. ブラウザのキャッシュをクリア

---

## 🔍 デバッグ手順

### ステップ1: エラーメッセージの確認
```bash
# 開発サーバーでエラーを確認
npm run dev

# ビルドエラーを確認
npm run build
```

### ステップ2: ファイル構造の確認
```bash
# 記事ファイルの確認
ls -la src/content/tool-articles/[ツール名]/

# アイコンファイルの確認
ls -la public/icon/[ツール名]-icon-240.webp
```

### ステップ3: 設定ファイルの確認
```javascript
// src/pages/tools/[tool]/index.astro
const toolConfigs = {
  // 設定を確認
};
```

### ステップ4: ブラウザでの確認
1. 開発者ツールを開く（F12）
2. Consoleタブでエラーを確認
3. Networkタブでファイルの読み込みを確認

---

## 📋 よくあるエラーメッセージと解決方法

### エラー: "Cannot find module"
**原因**: ファイルパスが間違っている
**解決方法**: ファイルの存在とパスを確認

### エラー: "Unexpected token"
**原因**: 構文エラー
**解決方法**: カンマ、括弧、引用符を確認

### エラー: "Property does not exist"
**原因**: 設定オブジェクトの構造が間違っている
**解決方法**: 設定ファイルの構造を確認

### エラー: "404 Not Found"
**原因**: ファイルが存在しない
**解決方法**: ファイルの場所と名前を確認

---

## 🛠️ 予防策

### 1. ファイル命名規則の統一
```
記事ファイル: pengenalan-[ツール名].md
アイコンファイル: [ツール名]-icon-240.webp
フォルダ名: [ツール名]（小文字）
```

### 2. 設定ファイルのバックアップ
```bash
# 設定ファイルのバックアップ
cp src/pages/tools/[tool]/index.astro src/pages/tools/[tool]/index.astro.backup
```

### 3. 段階的なテスト
1. 記事ファイルのみ作成
2. 設定ファイルに追加
3. アイコンファイルを追加
4. 最終テスト

### 4. バージョン管理
```bash
# 変更前にコミット
git add .
git commit -m "Add new tool: [ツール名]"
```

---

## 📞 サポート連絡先

### 技術的な問題
- **緊急**: 直接連絡
- **一般的**: チームSlack
- **ドキュメント**: このガイド

### エスカレーション手順
1. このガイドを確認
2. 基本的なトラブルシューティングを実行
3. エラーメッセージと状況を記録
4. 技術チームに連絡

---

## 📚 参考資料

- [ツール管理ガイド](./tool-management-guide.md)
- [ワークフローチェックリスト](./tool-workflow-checklist.md)
- [ツール記事テンプレート](./tool-article-template.md)
- [設定テンプレート](./tool-config-template.js)

---

*このガイドは定期的に更新されます。最新版は常に確認してください。*
