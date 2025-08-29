// Docs Search Engine - Enhanced Search Functionality
// Provides advanced search capabilities for documentation pages
// Handles search initialization, query processing, and result management

// Search Engine Configuration
const SEARCH_CONFIG = {
  // Search behavior settings
  minQueryLength: 2,
  maxResults: 50,
  searchDelay: 300, // ms
  highlightClass: 'search-highlight',
  
  // Search fields and weights
  searchFields: {
    title: { weight: 3, boost: 2.0 },
    description: { weight: 2, boost: 1.5 },
    tags: { weight: 2, boost: 1.8 },
    content: { weight: 1, boost: 1.0 }
  },
  
  // Filter options
  filters: {
    contentType: ['guide', 'methodology', 'tool', 'theory', 'practice', 'review', 'case-study', 'faq'],
    learningStage: ['alphabet', 'basic-grammar', 'kanji-intro', 'intermediate', 'advanced', 'fluency'],
    difficulty: ['beginner', 'intermediate', 'advanced']
  }
};

// Search Engine Class
class DocsSearchEngine {
  constructor() {
    this.posts = [];
    this.searchIndex = new Map();
    this.currentQuery = '';
    this.searchResults = [];
    this.isInitialized = false;
    this.searchTimeout = null;
    
    // Performance tracking
    this.metrics = {
      searchCount: 0,
      averageSearchTime: 0,
      totalSearchTime: 0
    };
  }

  /**
   * Initialize the search engine
   */
  async initialize() {
    try {
      console.log('🔍 Initializing Docs Search Engine...');
      
      // Load posts data
      await this.loadPostsData();
      
      // Build search index
      this.buildSearchIndex();
      
      // Set up event listeners
      this.setupEventListeners();
      
      this.isInitialized = true;
      console.log('✅ Docs Search Engine initialized successfully');
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Docs Search Engine:', error);
      return false;
    }
  }

  /**
   * Load posts data from the page
   */
  async loadPostsData() {
    try {
      // Get posts from the page data
      const postsContainer = document.querySelector('[data-posts]');
      if (postsContainer) {
        const postsData = postsContainer.getAttribute('data-posts');
        if (postsData) {
          this.posts = JSON.parse(postsData);
        }
      }
      
      // Fallback: try to extract from page elements
      if (this.posts.length === 0) {
        this.posts = this.extractPostsFromPage();
      }
      
      console.log(`📚 Loaded ${this.posts.length} posts for search`);
    } catch (error) {
      console.error('❌ Error loading posts data:', error);
      this.posts = [];
    }
  }

  /**
   * Extract posts from page elements as fallback
   */
  extractPostsFromPage() {
    const posts = [];
    const postElements = document.querySelectorAll('[data-post]');
    
    postElements.forEach(element => {
      try {
        const postData = JSON.parse(element.getAttribute('data-post') || '{}');
        if (postData.title) {
          posts.push(postData);
        }
      } catch (error) {
        console.warn('⚠️ Failed to parse post data:', error);
      }
    });
    
    return posts;
  }

  /**
   * Build search index for fast searching
   */
  buildSearchIndex() {
    this.searchIndex.clear();
    
    this.posts.forEach((post, index) => {
      // Index by title
      this.indexText(post.title, index, SEARCH_CONFIG.searchFields.title.weight);
      
      // Index by description
      if (post.description) {
        this.indexText(post.description, index, SEARCH_CONFIG.searchFields.description.weight);
      }
      
      // Index by tags
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          this.indexText(tag, index, SEARCH_CONFIG.searchFields.tags.weight);
        });
      }
      
      // Index by content (first 500 characters for performance)
      if (post.content) {
        const contentPreview = post.content.substring(0, 500);
        this.indexText(contentPreview, index, SEARCH_CONFIG.searchFields.content.weight);
      }
    });
    
    console.log(`🔍 Built search index with ${this.searchIndex.size} terms`);
  }

  /**
   * Index text for searching
   */
  indexText(text, postIndex, weight) {
    if (!text) return;
    
    const words = this.tokenize(text);
    words.forEach(word => {
      if (!this.searchIndex.has(word)) {
        this.searchIndex.set(word, new Map());
      }
      
      const postWeights = this.searchIndex.get(word);
      const currentWeight = postWeights.get(postIndex) || 0;
      postWeights.set(postIndex, currentWeight + weight);
    });
  }

  /**
   * Tokenize text into searchable terms
   */
  tokenize(text) {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length >= SEARCH_CONFIG.minQueryLength)
      .filter(word => !this.isStopWord(word));
  }

  /**
   * Check if word is a stop word
   */
  isStopWord(word) {
    const stopWords = new Set([
      // English stop words
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
      
      // Indonesian stop words
      'yang', 'dan', 'atau', 'dengan', 'di', 'ke', 'dari', 'untuk', 'dalam', 'pada', 'oleh', 'karena',
      'adalah', 'akan', 'sudah', 'belum', 'tidak', 'bukan', 'juga', 'saja', 'hanya', 'masih', 'sudah',
      'pernah', 'selalu', 'kadang', 'sering', 'jarang', 'segera', 'nanti', 'kemarin', 'hari', 'ini',
      'itu', 'ini', 'sana', 'sini', 'mana', 'apa', 'siapa', 'kapan', 'bagaimana', 'mengapa', 'berapa',
      'seperti', 'sebagai', 'tentang', 'terhadap', 'antara', 'diantara', 'sebelum', 'sesudah', 'setelah',
      'sambil', 'sementara', 'ketika', 'jika', 'kalau', 'apabila', 'meskipun', 'walaupun', 'sehingga',
      'agar', 'supaya', 'hingga', 'sampai', 'selama', 'sepanjang', 'sejak', 'dari', 'hingga', 'sampai',
      'lebih', 'paling', 'terlalu', 'sangat', 'amat', 'benar', 'sungguh', 'memang', 'tentu', 'pasti',
      'mungkin', 'barangkali', 'rasanya', 'sepertinya', 'kayaknya', 'seolah', 'seakan', 'bagai',
      'seperti', 'sebagai', 'tentang', 'terhadap', 'antara', 'diantara', 'sebelum', 'sesudah', 'setelah',
      'sambil', 'sementara', 'ketika', 'jika', 'kalau', 'apabila', 'meskipun', 'walaupun', 'sehingga',
      'agar', 'supaya', 'hingga', 'sampai', 'selama', 'sepanjang', 'sejak', 'dari', 'hingga', 'sampai',
      'lebih', 'paling', 'terlalu', 'sangat', 'amat', 'benar', 'sungguh', 'memang', 'tentu', 'pasti',
      'mungkin', 'barangkali', 'rasanya', 'sepertinya', 'kayaknya', 'seolah', 'seakan', 'bagai',
      'saya', 'aku', 'kamu', 'anda', 'dia', 'mereka', 'kami', 'kita', 'kalian', 'mereka', 'ini', 'itu',
      'disini', 'disana', 'dimana', 'kemana', 'darimana', 'bagaimana', 'mengapa', 'kenapa', 'berapa',
      'kapan', 'dimana', 'kemana', 'darimana', 'bagaimana', 'mengapa', 'kenapa', 'berapa', 'kapan'
    ]);
    return stopWords.has(word.toLowerCase());
  }

  /**
   * Perform search
   */
  search(query, options = {}) {
    if (!this.isInitialized) {
      console.warn('⚠️ Search engine not initialized');
      return { results: [], total: 0, query: '' };
    }

    const startTime = performance.now();
    
    // Clear previous timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Debounce search
    return new Promise((resolve) => {
      this.searchTimeout = setTimeout(() => {
        const results = this.performSearch(query, options);
        const searchTime = performance.now() - startTime;
        
        // Update metrics
        this.updateMetrics(searchTime);
        
        // Update current state
        this.currentQuery = query;
        this.searchResults = results.results;
        
        resolve(results);
      }, SEARCH_CONFIG.searchDelay);
    });
  }

  /**
   * Perform the actual search
   */
  performSearch(query, options) {
    if (!query || query.trim().length < SEARCH_CONFIG.minQueryLength) {
      return { results: [], total: 0, query: '' };
    }

    const queryWords = this.tokenize(query);
    const scores = new Map();
    
    // Calculate scores for each post
    queryWords.forEach(word => {
      const postWeights = this.searchIndex.get(word);
      if (postWeights) {
        postWeights.forEach((weight, postIndex) => {
          const currentScore = scores.get(postIndex) || 0;
          scores.set(postIndex, currentScore + weight);
        });
      }
    });
    
    // Convert scores to results
    const results = Array.from(scores.entries())
      .map(([postIndex, score]) => ({
        post: this.posts[postIndex],
        score: score,
        highlights: this.generateHighlights(query, this.posts[postIndex])
      }))
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, SEARCH_CONFIG.maxResults);
    
    return {
      results: results,
      total: results.length,
      query: query,
      searchTime: performance.now()
    };
  }

  /**
   * Generate highlights for search results
   */
  generateHighlights(query, post) {
    const highlights = [];
    const queryWords = this.tokenize(query);
    
    // Highlight in title
    if (post.title) {
      highlights.push({
        field: 'title',
        text: this.highlightText(post.title, queryWords)
      });
    }
    
    // Highlight in description
    if (post.description) {
      highlights.push({
        field: 'description',
        text: this.highlightText(post.description, queryWords)
      });
    }
    
    return highlights;
  }

  /**
   * Highlight matching text
   */
  highlightText(text, queryWords) {
    let highlightedText = text;
    
    queryWords.forEach(word => {
      const regex = new RegExp(`(${word})`, 'gi');
      highlightedText = highlightedText.replace(regex, `<mark class="${SEARCH_CONFIG.highlightClass}">$1</mark>`);
    });
    
    return highlightedText;
  }

  /**
   * Filter search results
   */
  filterResults(results, filters) {
    if (!filters || Object.keys(filters).length === 0) {
      return results;
    }
    
    return results.filter(result => {
      const post = result.post;
      
      // Filter by content type
      if (filters.contentType && filters.contentType.length > 0) {
        if (!filters.contentType.includes(post.contentType)) {
          return false;
        }
      }
      
      // Filter by learning stage
      if (filters.learningStage && filters.learningStage.length > 0) {
        if (!filters.learningStage.includes(post.learningStage)) {
          return false;
        }
      }
      
      // Filter by difficulty
      if (filters.difficulty && filters.difficulty.length > 0) {
        if (!filters.difficulty.includes(post.difficulty)) {
          return false;
        }
      }
      
      return true;
    });
  }

  /**
   * Get search suggestions
   */
  getSuggestions(query) {
    if (!query || query.length < 2) {
      return [];
    }
    
    const suggestions = new Set();
    const queryLower = query.toLowerCase();
    
    // Find matching terms from search index
    this.searchIndex.forEach((_, term) => {
      if (term.startsWith(queryLower) && term !== queryLower) {
        suggestions.add(term);
      }
    });
    
    // Find matching titles
    this.posts.forEach(post => {
      const titleWords = this.tokenize(post.title);
      titleWords.forEach(word => {
        if (word.startsWith(queryLower)) {
          suggestions.add(word);
        }
      });
    });
    
    return Array.from(suggestions).slice(0, 10);
  }

  /**
   * Update performance metrics
   */
  updateMetrics(searchTime) {
    this.metrics.searchCount++;
    this.metrics.totalSearchTime += searchTime;
    this.metrics.averageSearchTime = this.metrics.totalSearchTime / this.metrics.searchCount;
  }

  /**
   * Get search metrics
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Search input event listener
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        this.handleSearchInput(query);
      });
      
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.handleSearchSubmit();
        }
      });
    }
    
    // Search form submit
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSearchSubmit();
      });
    }
  }

  /**
   * Handle search input changes
   */
  handleSearchInput(query) {
    if (query.length >= SEARCH_CONFIG.minQueryLength) {
      this.search(query).then(results => {
        this.displayResults(results);
        this.showSuggestions(query);
      });
    } else {
      this.clearResults();
      this.hideSuggestions();
    }
  }

  /**
   * Handle search form submission
   */
  handleSearchSubmit() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      const query = searchInput.value.trim();
      if (query.length >= SEARCH_CONFIG.minQueryLength) {
        this.search(query).then(results => {
          this.displayResults(results);
          this.hideSuggestions();
        });
      }
    }
  }

  /**
   * Display search results
   */
  displayResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;
    
    if (results.results.length === 0) {
      resultsContainer.innerHTML = `
        <div class="text-center py-8">
          <p class="text-gray-500">No results found for "${results.query}"</p>
          <p class="text-sm text-gray-400 mt-2">Try different keywords or check your spelling</p>
        </div>
      `;
      return;
    }
    
    const resultsHTML = results.results.map(result => {
      const post = result.post;
      const highlights = result.highlights;
      
      return `
        <div class="search-result-item p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            <a href="${post.url || '#'}" class="hover:text-primary-600">
              ${highlights.find(h => h.field === 'title')?.text || post.title}
            </a>
          </h3>
          <p class="text-gray-600 text-sm mb-2">
            ${highlights.find(h => h.field === 'description')?.text || post.description || ''}
          </p>
          <div class="flex items-center gap-2 text-xs text-gray-500">
            ${post.tags ? post.tags.map(tag => `<span class="bg-gray-100 px-2 py-1 rounded">${tag}</span>`).join('') : ''}
            <span class="ml-auto">Score: ${result.score.toFixed(2)}</span>
          </div>
        </div>
      `;
    }).join('');
    
    resultsContainer.innerHTML = resultsHTML;
  }

  /**
   * Clear search results
   */
  clearResults() {
    const resultsContainer = document.getElementById('searchResults');
    if (resultsContainer) {
      resultsContainer.innerHTML = '';
    }
  }

  /**
   * Show search suggestions
   */
  showSuggestions(query) {
    const suggestions = this.getSuggestions(query);
    const suggestionsContainer = document.getElementById('searchSuggestions');
    
    if (!suggestionsContainer || suggestions.length === 0) return;
    
    const suggestionsHTML = suggestions.map(suggestion => `
      <div class="suggestion-item px-4 py-2 hover:bg-gray-100 cursor-pointer" 
           onclick="window.enhancedDocsSearch.selectSuggestion('${suggestion}')">
        ${suggestion}
      </div>
    `).join('');
    
    suggestionsContainer.innerHTML = suggestionsHTML;
    suggestionsContainer.style.display = 'block';
  }

  /**
   * Hide search suggestions
   */
  hideSuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
      suggestionsContainer.style.display = 'none';
    }
  }

  /**
   * Select a search suggestion
   */
  selectSuggestion(suggestion) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = suggestion;
      this.handleSearchInput(suggestion);
    }
    this.hideSuggestions();
  }
}

// Global search engine instance
let enhancedDocsSearch = null;

// Initialize function
function initializeDocsSearch() {
  if (!enhancedDocsSearch) {
    enhancedDocsSearch = new DocsSearchEngine();
    enhancedDocsSearch.initialize().then(success => {
      if (success) {
        console.log('✅ Enhanced Docs Search initialized successfully');
        // Make it globally available
        window.enhancedDocsSearch = enhancedDocsSearch;
      } else {
        console.error('❌ Failed to initialize Enhanced Docs Search');
      }
    });
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDocsSearch);
} else {
  initializeDocsSearch();
}

// Export for module usage
export { DocsSearchEngine, initializeDocsSearch };

// Make available globally
window.enhancedDocsSearch = enhancedDocsSearch;
window.initializeDocsSearch = initializeDocsSearch;
