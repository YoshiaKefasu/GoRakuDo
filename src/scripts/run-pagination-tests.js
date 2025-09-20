#!/usr/bin/env node

/**
 * ページネーション統合テスト実行スクリプト
 * 開発環境でのテスト用
 */

const testCases = [
  {
    name: 'ページ1（デフォルト）',
    url: '/docs',
    expectedBehavior: '最初の6記事が表示される',
  },
  {
    name: 'ページ1（明示的）',
    url: '/docs?page=1',
    expectedBehavior: 'リダイレクトで /docs に移動',
  },
  {
    name: 'ページ2',
    url: '/docs?page=2',
    expectedBehavior: '7-12番目の記事が表示される',
  },
  {
    name: '無効なページ番号（負の数）',
    url: '/docs?page=-1',
    expectedBehavior: 'リダイレクトで /docs?page=1 に移動',
  },
  {
    name: '無効なページ番号（文字列）',
    url: '/docs?page=abc',
    expectedBehavior: 'リダイレクトで /docs?page=1 に移動',
  },
  {
    name: '存在しないページ（大きな数）',
    url: '/docs?page=999',
    expectedBehavior: '最後のページにリダイレクト',
  },
];

console.log('🧪 ページネーション統合テスト');
console.log('=====================================');
console.log('開発サーバーを起動してから以下のURLをテストしてください:\n');

testCases.forEach((testCase, index) => {
  console.log(`${index + 1}. ${testCase.name}`);
  console.log(`   URL: http://localhost:4321${testCase.url}`);
  console.log(`   期待動作: ${testCase.expectedBehavior}`);
  console.log('');
});

console.log('=====================================');
console.log('📝 テスト手順:');
console.log('1. npm run dev で開発サーバーを起動');
console.log('2. 上記のURLを順次ブラウザで開く');
console.log('3. 各テストケースの動作を確認');
console.log('4. コンソールログでエラーがないか確認');
console.log('5. ネットワークタブでリダイレクトを確認');
console.log('');
console.log(
  '✅ 詳細なテスト手順は docs/testing/pagination-integration-test.md を参照してください'
);
