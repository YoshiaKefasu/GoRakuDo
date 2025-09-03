// Enhanced Search Functionality Implementation - COMPLETE REWRITE
// Fixed content type mismatch and robust filtering system
// Optimized for AI metadata integration with proper data attribute handling

class DocsSearch {
  constructor() {
    this.posts = [];
    this.searchInput = null;
    this.filterButtons = [];
    this.suggestionTags = [];
    this.currentFilter = 'all';
    this.searchTimeout = null;
    this.isInitialized = false;

    this.initializeSearch();
  }

  initializeSearch() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupSearch());
    } else {
      this.setupSearch();
    }
  }

  setupSearch() {
    // Get DOM elements
    this.searchInput = document.getElementById('searchInput');
    this.filterButtons = document.querySelectorAll('.filter-button');
    this.suggestionTags = document.querySelectorAll('.suggestion-tag');

    // Validate essential elements exist
    if (!this.searchInput) {
      console.warn('🔍 Search input not found');
      return;
    }

    // Get posts data from the page
    this.extractPostsData();

    // Setup event listeners
    this.setupEventListeners();

    // Initialize with all posts visible
    this.updateSearchResults();

    this.isInitialized = true;
    console.log('🔍 DocsSearch initialized successfully');
  }

  extractPostsData() {
    // Get all post cards from the DOM
    const postCards = document.querySelectorAll('.post-card');

    if (postCards.length === 0) {
      console.warn('🔍 No post cards found in DOM');
      return;
    }

    this.posts = Array.from(postCards).map(card => {
      const titleElement = card.querySelector('.post-title a');
      const descriptionElement = card.querySelector('.post-description');
      const tagElements = card.querySelectorAll('.post-tag');

      const post = {
        element: card,
        title: titleElement?.textContent?.toLowerCase() || '',
        description: descriptionElement?.textContent?.toLowerCase() || '',
        tags: Array.from(tagElements).map(
          tag => tag.textContent?.toLowerCase() || ''
        ),
        slug: card.getAttribute('data-post-slug') || '',

        // Data attributes for filtering
        dataAttributes: {
          isBeginner: card.getAttribute('data-is-beginner') === 'true',
          isTool: card.getAttribute('data-is-tool') === 'true',
          isRecommended: card.getAttribute('data-is-recommended') === 'true',
          learningStage: card.getAttribute('data-learning-stage') || '',
          contentType: card.getAttribute('data-content-type') || '',
        },

        // Fallback category detection
        category: this.determineCategory(card),
      };

      return post;
    });

    // Debug logging to verify data extraction
    console.log('🔍 Posts Data Extracted:', this.posts.length, 'posts');
    this.posts.forEach((post, index) => {
      console.log(`🔍 Post ${index + 1}: "${post.title}"`);
      console.log(`  - Slug: ${post.slug}`);
      console.log(`  - Category: ${post.category}`);
      console.log(`  - Data Attributes:`, post.dataAttributes);

      // Special debug for Anki post
      if (post.title.toLowerCase().includes('anki')) {
        console.log(`🔍 SPECIAL DEBUG - Anki Post:`);
        console.log(`  - Title: ${post.title}`);
        console.log(`  - Slug: ${post.slug}`);
        console.log(`  - data-is-tool: ${post.dataAttributes.isTool}`);
        console.log(
          `  - data-content-type: ${post.dataAttributes.contentType}`
        );
        console.log(`  - Category: ${post.category}`);
      }
    });
  }

  determineCategory(card) {
    // First, try to get category from data attributes (server-side AI metadata)
    const learningStage = card.getAttribute('data-learning-stage');
    const contentType = card.getAttribute('data-content-type');
    const isTool = card.getAttribute('data-is-tool') === 'true';
    const isBeginner = card.getAttribute('data-is-beginner') === 'true';

    // Map server-side categories to client-side filter names
    if (isTool) {
      return 'tools';
    } else if (isBeginner || learningStage === 'alphabet') {
      return 'beginner';
    }

    // Fallback to text-based detection for other categories
    const title =
      card.querySelector('.post-title a')?.textContent?.toLowerCase() || '';
    const description =
      card.querySelector('.post-description')?.textContent?.toLowerCase() || '';

    if (
      title.includes('memulai') ||
      description.includes('memulai') ||
      title.includes('getting started')
    ) {
      return 'getting-started';
    } else if (
      title.includes('metodologi') ||
      description.includes('metodologi') ||
      title.includes('methodology')
    ) {
      return 'methodology';
    } else if (
      title.includes('tools') ||
      title.includes('anki') ||
      title.includes('tool')
    ) {
      return 'tools';
    } else if (
      title.includes('lanjutan') ||
      description.includes('lanjutan') ||
      title.includes('advanced')
    ) {
      return 'advanced';
    } else if (
      title.includes('pemula') ||
      description.includes('pemula') ||
      title.includes('beginner') ||
      description.includes('beginner')
    ) {
      return 'beginner';
    }

    return 'general';
  }

  setupEventListeners() {
    // Search input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', e => {
        this.handleSearchInput(e.target.value);
      });

      this.searchInput.addEventListener('focus', () => {
        this.showSuggestions();
      });

      this.searchInput.addEventListener('blur', () => {
        setTimeout(() => this.hideSuggestions(), 200);
      });
    }

    // Filter buttons
    this.filterButtons.forEach(button => {
      button.addEventListener('click', e => {
        this.handleFilterClick(e.target);
      });
    });

    // Suggestion tags
    this.suggestionTags.forEach(tag => {
      tag.addEventListener('click', e => {
        const suggestion = e.target.getAttribute('data-suggestion');
        if (this.searchInput && suggestion) {
          this.searchInput.value = suggestion;
          this.handleSearchInput(suggestion);
        }
      });
    });
  }

  handleSearchInput(query) {
    // Clear previous timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Debounce search
    this.searchTimeout = setTimeout(() => {
      this.performSearch(query);
    }, 300);
  }

  handleFilterClick(button) {
    // Update active filter
    this.filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    this.currentFilter = button.getAttribute('data-filter');
    console.log(`🔍 Filter changed to: ${this.currentFilter}`);

    // Re-run search with current query
    const currentQuery = this.searchInput?.value || '';
    this.performSearch(currentQuery);
  }

  performSearch(query) {
    const searchTerm = query.toLowerCase().trim();

    // Debug: Log current filter and search parameters
    console.log(`🔍 Search Parameters:`);
    console.log(`  - Current Filter: ${this.currentFilter}`);
    console.log(`  - Search Term: "${searchTerm}"`);
    console.log(`  - Total Posts Available: ${this.posts.length}`);

    const results = this.posts.filter(post => {
      // Step 1: Check if post matches current filter
      const filterMatch = this.checkFilterMatch(post);
      if (!filterMatch) {
        console.log(`🔍 Post "${post.title}" filtered out by category`);
        return false;
      }

      // Step 2: If no search term, show all posts for current filter
      if (!searchTerm) {
        return true;
      }

      // Step 3: Search in title, description, and tags
      const titleMatch = post.title.includes(searchTerm);
      const descriptionMatch = post.description.includes(searchTerm);
      const tagMatch = post.tags.some(tag => tag.includes(searchTerm));

      const searchMatch = titleMatch || descriptionMatch || tagMatch;

      if (searchMatch) {
        console.log(`🔍 Post "${post.title}" matches search term`);
      }

      return searchMatch;
    });

    // Debug: Log filter results
    console.log(`🔍 Search Results: ${results.length} posts found`);
    results.forEach((post, index) => {
      console.log(`  ${index + 1}. ${post.title} (${post.slug})`);
    });

    this.displaySearchResults(results, searchTerm);
  }

  checkFilterMatch(post) {
    switch (this.currentFilter) {
      case 'all':
        return true;

      case 'beginner':
        return post.dataAttributes.isBeginner;

      case 'tools':
        return post.dataAttributes.isTool;

      case 'recommendations':
        return post.dataAttributes.isRecommended;

      default:
        // Fallback to category-based filtering for other filters
        return post.category === this.currentFilter;
    }
  }

  displaySearchResults(results, searchTerm) {
    const contentState = document.getElementById('contentState');
    const searchResults = document.getElementById('searchResults');
    const searchStats = document.getElementById('searchStats');
    const searchResultsContent = document.getElementById(
      'searchResultsContent'
    );

    if (
      !contentState ||
      !searchResults ||
      !searchStats ||
      !searchResultsContent
    ) {
      console.warn('🔍 Required DOM elements not found for search results');
      return;
    }

    if (searchTerm) {
      // Show search results
      contentState.style.display = 'none';
      searchResults.style.display = 'block';

      // Update stats
      const totalPosts = this.posts.length;
      searchStats.textContent = `Menampilkan ${results.length} dari ${totalPosts} dokumentasi untuk "${searchTerm}"`;

      // Display results
      if (results.length === 0) {
        searchResultsContent.innerHTML = `
          <div class="no-results">
            <div class="no-results-icon">🔍</div>
            <h3>Tidak ada hasil ditemukan</h3>
            <p>Tidak ada dokumentasi yang cocok dengan pencarian "${searchTerm}"</p>
            <div class="search-suggestions">
              <div class="suggestions-title">Coba kata kunci lain:</div>
              <span class="suggestion-tag" data-suggestion="immersion">immersion</span>
              <span class="suggestion-tag" data-suggestion="anki">anki</span>
              <span class="suggestion-tag" data-suggestion="manga">manga</span>
              <span class="suggestion-tag" data-suggestion="anime">anime</span>
            </div>
          </div>
        `;
      } else {
        searchResultsContent.innerHTML = results
          .map(post => {
            const highlightedTitle = this.highlightText(post.title, searchTerm);
            const highlightedDescription = this.highlightText(
              post.description,
              searchTerm
            );

            return `
            <article class="post-card" data-post-slug="${post.slug}">
              <div class="post-header">
                <h2 class="post-title">
                  <a href="${post.url || `/docs/${post.slug}`}">${highlightedTitle}</a>
                </h2>
                <div class="post-meta">
                  <span class="post-date">📅 ${this.getPostDate(post.element)}</span>
                </div>
              </div>
              <p class="post-description">${highlightedDescription}</p>
              <div class="post-tags">
                ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
              </div>
              <a href="${post.url || `/docs/${post.slug}`}" class="read-more-btn">Baca Selengkapnya →</a>
            </article>
          `;
          })
          .join('');
      }
    } else {
      // Show all posts for current filter
      contentState.style.display = 'grid';
      searchResults.style.display = 'none';

      // Debug: Log display logic
      console.log(`🔍 Display Logic:`);
      console.log(`  - Filter: ${this.currentFilter}`);
      console.log(`  - Content State: ${contentState.style.display}`);
      console.log(`  - Search Results: ${searchResults.style.display}`);

      // Filter posts by category using data attributes
      this.posts.forEach(post => {
        const shouldShow = this.checkFilterMatch(post);
        post.element.style.display = shouldShow ? 'block' : 'none';

        // Debug: Log each post's display decision
        console.log(
          `🔍 Post "${post.title}": shouldShow = ${shouldShow}, display = ${post.element.style.display}`
        );
      });
    }
  }

  highlightText(text, searchTerm) {
    if (!searchTerm) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
  }

  getPostDate(element) {
    const dateElement = element.querySelector('.post-date');
    return dateElement ? dateElement.textContent.replace('📅 ', '') : '';
  }

  showSuggestions() {
    const suggestions = document.getElementById('searchSuggestions');
    if (suggestions) {
      suggestions.style.display = 'block';
    }
  }

  hideSuggestions() {
    const suggestions = document.getElementById('searchSuggestions');
    if (suggestions) {
      suggestions.style.display = 'none';
    }
  }

  updateSearchResults() {
    this.performSearch('');
  }
}

// Navigation functions
function goHome() {
  window.location.href = '/';
}

function goToInvitation() {
  window.location.href = '/discord';
}

// Progressive loading with skeleton screens - ENHANCED
document.addEventListener('DOMContentLoaded', function () {
  const loadingState = document.getElementById('loadingState');
  const contentState = document.getElementById('contentState');
  const postsGrid = document.getElementById('contentState');

  // Validate all elements exist
  if (!loadingState) {
    console.warn('🔍 Loading state element not found');
    return;
  }

  if (!contentState) {
    console.warn('🔍 Content state element not found');
    return;
  }

  if (!postsGrid) {
    console.warn('🔍 Posts grid element not found');
    return;
  }

  // Show loading state initially
  loadingState.style.display = 'block';
  contentState.style.display = 'none';

  // Simulate loading delay for better UX
  setTimeout(() => {
    loadingState.style.display = 'none';
    postsGrid.style.display = 'grid';

    // Initialize search functionality after content is loaded
    console.log('🔍 Initializing DocsSearch...');
    new DocsSearch();
  }, 800);
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DocsSearch, goHome, goToInvitation };
}
