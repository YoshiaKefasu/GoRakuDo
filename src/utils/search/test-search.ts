// Test file for SimpleSearch - Performance and functionality verification
// This file is for testing purposes only and can be removed in production

import { SimpleSearch } from './simple-search';
import type { SearchPost } from './types';

// Test data
const testPosts: SearchPost[] = [
  {
    id: '1',
    title: 'Panduan Menggunakan Anki',
    description: 'Cara setup dan menggunakan Anki untuk belajar bahasa Jepang',
    tags: ['anki', 'srs', 'flashcards', 'vocabulary'],
    slug: 'anki-guide',
    contentType: 'tool',
    learningStage: 'intermediate',
    isRecommended: true,
  },
  {
    id: '2',
    title: 'Memulai Perjalanan Immersion',
    description: 'Langkah-langkah awal untuk memulai immersion bahasa Jepang',
    tags: ['immersion', 'beginner', 'hiragana', 'katakana'],
    slug: 'getting-started',
    contentType: 'guide',
    learningStage: 'beginner',
    isRecommended: true,
  },
  {
    id: '3',
    title: 'Memilih Konten yang Tepat',
    description: 'Cara memilih anime dan manga yang sesuai untuk pembelajaran',
    tags: ['content-selection', 'anime', 'manga', 'i+1'],
    slug: 'choosing-content',
    contentType: 'methodology',
    learningStage: 'beginner',
    isRecommended: true,
  },
];

// Performance test
function testSearchPerformance() {
  console.log('🔍 Testing SimpleSearch Performance...');

  const search = new SimpleSearch(testPosts);

  // Test search performance
  const searchStart = performance.now();
  const searchResult = search.search('anki');
  const searchTime = performance.now() - searchStart;

  console.log(`✅ Search completed in ${searchTime.toFixed(2)}ms`);
  console.log(`✅ Found ${searchResult.filteredCount} results`);
  console.log(
    `✅ Performance target: <50ms (${searchTime < 50 ? 'PASSED' : 'FAILED'})`
  );

  // Test filter performance
  const filterStart = performance.now();
  const filterResult = search.filter({ contentType: 'tool' });
  const filterTime = performance.now() - filterStart;

  console.log(`✅ Filter completed in ${filterTime.toFixed(2)}ms`);
  console.log(`✅ Found ${filterResult.filteredCount} results`);
  console.log(
    `✅ Performance target: <30ms (${filterTime < 30 ? 'PASSED' : 'FAILED'})`
  );

  // Test suggestions
  const suggestions = search.getSuggestions('an');
  console.log(`✅ Suggestions: ${suggestions.join(', ')}`);

  // Test metrics
  const metrics = search.getMetrics();
  console.log(`✅ Metrics:`, metrics);

  return {
    searchTime,
    filterTime,
    searchResults: searchResult.posts.length,
    filterResults: filterResult.posts.length,
    suggestions: suggestions.length,
  };
}

// Functionality test
function testSearchFunctionality() {
  console.log('🔍 Testing SimpleSearch Functionality...');

  const search = new SimpleSearch(testPosts);

  // Test basic search
  const ankiResults = search.search('anki');
  console.log(`✅ Anki search: ${ankiResults.filteredCount} results`);

  // Test filter
  const toolResults = search.filter({ contentType: 'tool' });
  console.log(`✅ Tool filter: ${toolResults.filteredCount} results`);

  // Test combined search and filter
  const combinedResults = search.searchAndFilter('panduan', {
    learningStage: 'beginner',
  });
  console.log(`✅ Combined search: ${combinedResults.filteredCount} results`);

  // Test empty search
  const emptyResults = search.search('');
  console.log(
    `✅ Empty search: ${emptyResults.filteredCount} results (should be all)`
  );

  return {
    ankiResults: ankiResults.filteredCount,
    toolResults: toolResults.filteredCount,
    combinedResults: combinedResults.filteredCount,
    emptyResults: emptyResults.filteredCount,
  };
}

// Extend Window interface for test functions
declare global {
  interface Window {
    testSearchPerformance: typeof testSearchPerformance;
    testSearchFunctionality: typeof testSearchFunctionality;
  }
}

// Run tests
if (typeof window !== 'undefined') {
  // Browser environment
  window.testSearchPerformance = testSearchPerformance;
  window.testSearchFunctionality = testSearchFunctionality;

  console.log(
    '🔍 Search tests loaded. Run testSearchPerformance() or testSearchFunctionality() in console.'
  );
} else {
  // Node environment
  console.log('🔍 Running search tests...');
  testSearchPerformance();
  testSearchFunctionality();
}

export { testSearchPerformance, testSearchFunctionality };
