#!/usr/bin/env node

/**
 * モバイルデバイスパフォーマンステストスクリプト
 * 開発環境でのモバイル最適化テスト用
 */

const mobileTestCases = [
  {
    name: 'iPhone SE (375x667)',
    viewport: { width: 375, height: 667 },
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
    tests: [
      'ページネーションコンポーネントの表示',
      'タッチターゲットサイズの確認',
      'スクロール動作の確認',
      'フォントサイズの確認',
    ],
  },
  {
    name: 'iPhone 12 Pro (390x844)',
    viewport: { width: 390, height: 844 },
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    tests: [
      'ページネーションコンポーネントの表示',
      'タッチターゲットサイズの確認',
      'スクロール動作の確認',
      'フォントサイズの確認',
    ],
  },
  {
    name: 'Samsung Galaxy S21 (360x800)',
    viewport: { width: 360, height: 800 },
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36',
    tests: [
      'ページネーションコンポーネントの表示',
      'タッチターゲットサイズの確認',
      'スクロール動作の確認',
      'フォントサイズの確認',
    ],
  },
  {
    name: 'iPad (768x1024)',
    viewport: { width: 768, height: 1024 },
    userAgent:
      'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
    tests: [
      'ページネーションコンポーネントの表示',
      'タッチターゲットサイズの確認',
      'スクロール動作の確認',
      'フォントサイズの確認',
    ],
  },
];

const performanceTests = [
  {
    name: 'Core Web Vitals',
    tests: [
      'FCP (First Contentful Paint) < 1.5秒',
      'LCP (Largest Contentful Paint) < 2.5秒',
      'TTI (Time to Interactive) < 3.0秒',
      'CLS (Cumulative Layout Shift) < 0.1',
      'FID (First Input Delay) < 100ms',
    ],
  },
  {
    name: 'パフォーマンス最適化',
    tests: [
      'CSS Containmentが適用されている',
      'will-changeが適切に設定されている',
      'フォント最適化が適用されている',
      'リソースヒントが設定されている',
      'プリロードが適切に設定されている',
    ],
  },
  {
    name: 'モバイル最適化',
    tests: [
      'タッチターゲットが44px以上',
      'スクロール動作がスムーズ',
      'フォントサイズが読みやすい',
      'レイアウトが適切に調整される',
      'タッチ操作が反応する',
    ],
  },
];

console.log('📱 モバイルデバイスパフォーマンステスト');
console.log('==========================================');
console.log('開発サーバーを起動してから以下のテストを実行してください:\n');

console.log('🔧 テスト環境の準備:');
console.log('1. npm run dev で開発サーバーを起動');
console.log('2. ブラウザの開発者ツールを開く');
console.log('3. デバイスエミュレーションを有効にする');
console.log('4. 以下のデバイス設定でテストを実行\n');

mobileTestCases.forEach((device, index) => {
  console.log(`${index + 1}. ${device.name}`);
  console.log(
    `   ビューポート: ${device.viewport.width}x${device.viewport.height}`
  );
  console.log(`   User Agent: ${device.userAgent.substring(0, 50)}...`);
  console.log('   テスト項目:');
  device.tests.forEach(test => {
    console.log(`     - ${test}`);
  });
  console.log('');
});

console.log('📊 パフォーマンステスト項目:');
console.log('==========================================');

performanceTests.forEach((category, index) => {
  console.log(`\n${index + 1}. ${category.name}`);
  category.tests.forEach(test => {
    console.log(`   - ${test}`);
  });
});

console.log('\n==========================================');
console.log('📝 テスト手順:');
console.log('1. 各デバイス設定でページを開く');
console.log('2. ページネーションコンポーネントの動作を確認');
console.log('3. パフォーマンスタブでCore Web Vitalsを測定');
console.log('4. ネットワークタブでリソース読み込みを確認');
console.log('5. コンソールでエラーがないか確認');
console.log('');
console.log(
  '✅ 詳細なテスト手順は docs/testing/pagination-integration-test.md を参照してください'
);
console.log('');
console.log('🎯 目標値:');
console.log('- FCP: < 1.5秒');
console.log('- LCP: < 2.5秒');
console.log('- TTI: < 3.0秒');
console.log('- CLS: < 0.1');
console.log('- FID: < 100ms');
