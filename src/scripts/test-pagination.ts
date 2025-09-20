// ページネーション動作確認用テストスクリプト
// 開発環境でのテスト用

interface PaginationTest {
 name: string;
 url: string;
 expectedPage: number;
 expectedTotalPages: number;
 expectedPostsCount: number;
}

// テストケース定義
const testCases: PaginationTest[] = [
 {
  name: 'ページ1（デフォルト）',
  url: '/docs',
  expectedPage: 1,
  expectedTotalPages: 0, // 実際の記事数に依存
  expectedPostsCount: 6
 },
 {
  name: 'ページ1（明示的）',
  url: '/docs?page=1',
  expectedPage: 1,
  expectedTotalPages: 0,
  expectedPostsCount: 6
 },
 {
  name: 'ページ2',
  url: '/docs?page=2',
  expectedPage: 2,
  expectedTotalPages: 0,
  expectedPostsCount: 6
 },
 {
  name: '無効なページ番号（負の数）',
  url: '/docs?page=-1',
  expectedPage: 1, // リダイレクトされる
  expectedTotalPages: 0,
  expectedPostsCount: 6
 },
 {
  name: '無効なページ番号（文字列）',
  url: '/docs?page=abc',
  expectedPage: 1, // リダイレクトされる
  expectedTotalPages: 0,
  expectedPostsCount: 6
 },
 {
  name: '存在しないページ（大きな数）',
  url: '/docs?page=999',
  expectedPage: 0, // 最後のページにリダイレクトされる
  expectedTotalPages: 0,
  expectedPostsCount: 0
 }
];

// テスト実行関数
export function runPaginationTests() {
 console.log('🧪 ページネーションテスト開始');
 console.log('=====================================');

 testCases.forEach((testCase, index) => {
  console.log(`\n${index + 1}. ${testCase.name}`);
  console.log(`   URL: ${testCase.url}`);
  console.log(`   期待値: ページ${testCase.expectedPage}, 記事数${testCase.expectedPostsCount}`);
 });

 console.log('\n=====================================');
 console.log('✅ テストケース定義完了');
 console.log('📝 実際のテストはブラウザで手動実行してください');
}

// ページネーション計算のテスト
export function testPaginationCalculation(
 totalPosts: number,
 postsPerPage: number,
 currentPage: number
) {
 const totalPages = Math.ceil(totalPosts / postsPerPage);
 const validatedPage = Math.max(1, Math.min(currentPage, totalPages));
 const startIndex = (validatedPage - 1) * postsPerPage;
 const endIndex = startIndex + postsPerPage;
 const paginatedPostsCount = Math.min(endIndex - startIndex, totalPosts - startIndex);

 return {
  totalPages,
  validatedPage,
  startIndex,
  endIndex,
  paginatedPostsCount,
  hasNextPage: validatedPage < totalPages,
  hasPreviousPage: validatedPage > 1
 };
}

// デバッグ情報の表示
export function logPaginationDebug(
 totalPosts: number,
 postsPerPage: number,
 currentPage: number
) {
 const result = testPaginationCalculation(totalPosts, postsPerPage, currentPage);

 console.log('🔍 ページネーションデバッグ情報:');
 console.log('=====================================');
 console.log(`総記事数: ${totalPosts}`);
 console.log(`1ページあたりの記事数: ${postsPerPage}`);
 console.log(`現在のページ: ${currentPage}`);
 console.log(`検証後のページ: ${result.validatedPage}`);
 console.log(`総ページ数: ${result.totalPages}`);
 console.log(`開始インデックス: ${result.startIndex}`);
 console.log(`終了インデックス: ${result.endIndex}`);
 console.log(`表示記事数: ${result.paginatedPostsCount}`);
 console.log(`次のページあり: ${result.hasNextPage}`);
 console.log(`前のページあり: ${result.hasPreviousPage}`);
 console.log('=====================================');
}

// 開発環境での自動実行
if (import.meta.env.DEV) {
 runPaginationTests();
}
