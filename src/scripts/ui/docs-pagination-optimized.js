// Docs Pagination - Optimized External Module
// Extracted from docs.astro for better maintainability and performance
// Handles pagination, infinite scroll, and search integration

/**
 * DocsPagination - Enhanced Pagination System
 */
class DocsPagination {
  constructor() {
    // Property declarations for TypeScript
    this.allPosts = [];
    this.currentPage = 1;
    this.postsPerPage = 6;
    this.totalPages = 1;
    this.isInfiniteScroll = false;
    this.loadedPosts = 0;

    // Search state management
    this.isSearchActive = false;
    this.searchResults = [];
    this.originalPosts = [];

    // Progressive loading for search results
    this.progressiveLoading = {
      enabled: false,
      batchSize: 3,
      loadedSearchResults: 0,
      isLoading: false,
      observer: null,
    };

    this.initializePagination();
  }

  /**
   * Initialize pagination system
   */
  initializePagination() {
    this.extractAllPosts();
    this.totalPages = Math.ceil(this.allPosts.length / this.postsPerPage);
    this.setupEventListeners();
    this.updatePaginationState();
  }

  /**
   * Extract all posts from DOM
   */
  extractAllPosts() {
    const postCards = document.querySelectorAll('.post-card');
    this.allPosts = Array.from(postCards).map(card => ({
      element: card,
      title: card.querySelector('.post-title a')?.textContent || '',
      description: card.querySelector('.post-description')?.textContent || '',
      tags: Array.from(card.querySelectorAll('.post-tag')).map(
        tag => tag.textContent || ''
      ),
      slug: card.getAttribute('data-post-slug') || '',
      date: card.querySelector('.post-date')?.textContent || '',
      readTime: card.querySelector('.post-readtime')?.textContent || '',
    }));

    this.originalPosts = [...this.allPosts];
  }

  /**
   * Handle search state changes from search engine
   */
  handleSearchStateChange(isSearchActive, searchResults) {
    this.isSearchActive = isSearchActive;
    this.searchResults = searchResults || [];

    if (isSearchActive) {
      this.showAllSearchResults();
    } else {
      this.returnToNormalPagination();
    }
  }

  /**
   * Show all search results without pagination limits
   */
  showAllSearchResults() {
    const contentState = document.getElementById('contentState');
    if (!contentState) return;

    // Search mode change notification removed - using ModernSearchEngine

    contentState.innerHTML = '';
    this.progressiveLoading.enabled = true;
    this.progressiveLoading.loadedSearchResults = 0;

    if (this.searchResults.length > 6) {
      this.loadNextSearchBatch();
      this.setupProgressiveLoadingObserver();
    } else {
      this.searchResults.forEach(post => {
        const postCard = this.createPostCard(post);
        contentState.appendChild(postCard);
      });
      this.progressiveLoading.loadedSearchResults = this.searchResults.length;
    }

    // DOM update notification removed - using ModernSearchEngine

    this.hidePaginationControls();
    this.updateSearchStateDisplay(true);
  }

  /**
   * Return to normal pagination when search is cleared
   */
  returnToNormalPagination() {
    // Search mode change notification removed - using ModernSearchEngine

    this.progressiveLoading.enabled = false;
    this.progressiveLoading.loadedSearchResults = 0;
    this.cleanupProgressiveLoadingObserver();

    this.currentPage = 1;
    this.loadedPosts = 0;
    this.displayPage(1);

    // DOM update notification removed - using ModernSearchEngine

    this.showPaginationControls();
    this.updateSearchStateDisplay(false);
  }

  /**
   * Load next batch of search results progressively
   */
  loadNextSearchBatch() {
    if (this.progressiveLoading.isLoading) return;

    const startIndex = this.progressiveLoading.loadedSearchResults;
    const endIndex = Math.min(
      startIndex + this.progressiveLoading.batchSize,
      this.searchResults.length
    );

    if (startIndex >= this.searchResults.length) return;

    this.progressiveLoading.isLoading = true;
    const contentState = document.getElementById('contentState');
    if (!contentState) return;

    // Skeleton loading removed - direct content loading for better performance
    setTimeout(() => {
      const postsToLoad = this.searchResults.slice(startIndex, endIndex);
      postsToLoad.forEach((post, index) => {
        setTimeout(() => {
          const postCard = this.createPostCard(post);
          postCard.style.opacity = '0';
          postCard.style.transform = 'translateY(20px)';
          contentState.appendChild(postCard);

          requestAnimationFrame(() => {
            postCard.style.transition =
              'opacity 0.3s ease, transform 0.3s ease';
            postCard.style.opacity = '1';
            postCard.style.transform = 'translateY(0)';
          });
        }, index * 100);
      });

      // DOM update notification removed - using ModernSearchEngine

      this.progressiveLoading.loadedSearchResults = endIndex;
      this.progressiveLoading.isLoading = false;

      if (endIndex < this.searchResults.length) {
        this.addLoadingTrigger();
      }
    }, 100); // Reduced delay for better UX without skeleton loading
  }

  // Skeleton placeholder creation method removed - using direct content loading

  /**
   * Add loading trigger element for progressive loading
   */
  addLoadingTrigger() {
    const contentState = document.getElementById('contentState');
    if (!contentState) return;

    const existingTrigger = document.getElementById('loading-trigger');
    if (existingTrigger) {
      existingTrigger.remove();
    }

    const trigger = document.createElement('div');
    trigger.id = 'loading-trigger';
    trigger.className = 'loading-trigger';
    trigger.style.height = '1px';
    trigger.style.opacity = '0';
    contentState.appendChild(trigger);

    if (this.progressiveLoading.observer) {
      this.progressiveLoading.observer.observe(trigger);
    }
  }

  /**
   * Setup progressive loading observer
   */
  setupProgressiveLoadingObserver() {
    this.cleanupProgressiveLoadingObserver();

    this.progressiveLoading.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && this.progressiveLoading.enabled) {
            this.loadNextSearchBatch();
          }
        });
      },
      {
        rootMargin: '200px 0px',
        threshold: 0.1,
      }
    );
  }

  /**
   * Cleanup progressive loading observer
   */
  cleanupProgressiveLoadingObserver() {
    if (this.progressiveLoading.observer) {
      this.progressiveLoading.observer.disconnect();
      this.progressiveLoading.observer = null;
    }

    const trigger = document.getElementById('loading-trigger');
    if (trigger) {
      trigger.remove();
    }
  }

  /**
   * Hide pagination controls during search
   */
  hidePaginationControls() {
    const paginationContainer = document.getElementById('paginationContainer');
    if (paginationContainer) {
      paginationContainer.style.display = 'none';
    }
  }

  /**
   * Show pagination controls when not searching
   */
  showPaginationControls() {
    const paginationContainer = document.getElementById('paginationContainer');
    if (paginationContainer) {
      paginationContainer.style.display = 'block';
    }
  }

  /**
   * Update search state display
   */
  updateSearchStateDisplay(isSearchActive) {
    const paginationStats = document.querySelector('.pagination-stats');
    if (paginationStats) {
      if (isSearchActive) {
        paginationStats.innerHTML = `
          <span class="search-mode-text">
            Semua hasil penelusuran (${this.searchResults.length})
          </span>
        `;
      } else {
        const startIndex = (this.currentPage - 1) * this.postsPerPage;
        const endIndex = Math.min(
          startIndex + this.postsPerPage,
          this.allPosts.length
        );
        paginationStats.innerHTML = `
          <span class="pagination-stats">
            Menampilkan ${startIndex + 1}-${endIndex} dari ${this.allPosts.length} dokumentasi
          </span>
        `;
      }
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const pageNumbers = document.querySelectorAll('.pagination-number');
    const infiniteScrollToggle = document.getElementById(
      'infiniteScrollToggle'
    );

    if (prevBtn) {
      prevBtn.addEventListener('click', () =>
        this.goToPage(this.currentPage - 1)
      );
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () =>
        this.goToPage(this.currentPage + 1)
      );
    }

    pageNumbers.forEach(number => {
      number.addEventListener('click', e => {
        const target = e.target;
        if (target?.getAttribute) {
          const page = parseInt(target.getAttribute('data-page') || '1');
          this.goToPage(page);
        }
      });
    });

    if (infiniteScrollToggle) {
      infiniteScrollToggle.addEventListener('change', e => {
        const target = e.target;
        if (target?.checked !== undefined) {
          this.toggleInfiniteScroll(target.checked);
        }
      });
    }

    this.setupInfiniteScroll();
  }

  /**
   * Setup infinite scroll detection
   */
  setupInfiniteScroll() {
    let scrollTimeout;

    window.addEventListener('scroll', () => {
      if (!this.isInfiniteScroll) return;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.checkInfiniteScroll();
      }, 100);
    });
  }

  /**
   * Check if infinite scroll should load more posts
   */
  checkInfiniteScroll() {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (
      scrollPosition >= documentHeight - 200 &&
      this.loadedPosts < this.allPosts.length
    ) {
      this.loadMorePosts();
    }
  }

  /**
   * Load more posts for infinite scroll
   */
  loadMorePosts() {
    const startIndex = this.loadedPosts;
    const endIndex = Math.min(
      startIndex + this.postsPerPage,
      this.allPosts.length
    );
    const postsToLoad = this.allPosts.slice(startIndex, endIndex);

    const contentState = document.getElementById('contentState');
    if (!contentState) return;

    postsToLoad.forEach(post => {
      const postCard = this.createPostCard(post);
      contentState.appendChild(postCard);
    });

    this.loadedPosts = endIndex;
    this.updatePaginationState();
  }

  /**
   * Create post card element
   */
  createPostCard(post) {
    const article = document.createElement('article');
    article.className = 'post-card';
    article.setAttribute('data-post-slug', post.slug);

    article.innerHTML = `
      <div class="post-header">
        <h2 class="post-title">
          <a href="${post.url || `/docs/${post.slug}`}">${post.title}</a>
        </h2>
        <div class="post-meta">
          <span class="post-date">${post.date}</span>
          ${post.readTime ? `<span class="post-readtime">${post.readTime}</span>` : ''}
        </div>
      </div>
      <p class="post-description">${post.description}</p>
      <div class="post-tags">
        ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
      </div>
      <a href="${post.url || `/docs/${post.slug}`}" class="read-more-btn">Baca Selengkapnya →
    `;

    return article;
  }

  /**
   * Go to specific page
   */
  goToPage(page) {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.displayPage(page);
    this.updatePaginationState();
    this.updateURL(page);
  }

  /**
   * Display posts for specific page
   */
  displayPage(page) {
    const startIndex = (page - 1) * this.postsPerPage;
    const endIndex = Math.min(
      startIndex + this.postsPerPage,
      this.allPosts.length
    );
    const postsToShow = this.allPosts.slice(startIndex, endIndex);

    const contentState = document.getElementById('contentState');
    if (!contentState) return;

    contentState.innerHTML = '';

    postsToShow.forEach(post => {
      const postCard = this.createPostCard(post);
      contentState.appendChild(postCard);
    });

    this.loadedPosts = endIndex;
  }

  /**
   * Update pagination state and UI
   */
  updatePaginationState() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const pageNumbers = document.querySelectorAll('.pagination-number');
    const paginationStats = document.querySelector('.pagination-stats');

    if (prevBtn) {
      prevBtn.disabled = this.currentPage === 1;
      prevBtn.setAttribute('data-page', String(this.currentPage - 1));
    }

    if (nextBtn) {
      nextBtn.disabled = this.currentPage === this.totalPages;
      nextBtn.setAttribute('data-page', String(this.currentPage + 1));
    }

    pageNumbers.forEach(number => {
      const page = parseInt(number.getAttribute('data-page') || '1');
      number.classList.toggle('active', page === this.currentPage);
    });

    if (paginationStats) {
      const startIndex = (this.currentPage - 1) * this.postsPerPage + 1;
      const endIndex = Math.min(
        this.currentPage * this.postsPerPage,
        this.allPosts.length
      );
      paginationStats.textContent = `Menampilkan ${startIndex}-${endIndex} dari ${this.allPosts.length} dokumentasi`;
    }

    const paginationContainer = document.querySelector('.pagination-container');
    if (paginationContainer) {
      paginationContainer.style.display =
        this.totalPages > 1 ? 'block' : 'none';
    }
  }

  /**
   * Toggle infinite scroll mode
   */
  toggleInfiniteScroll(enabled) {
    this.isInfiniteScroll = enabled;

    const paginationControls = document.querySelector('.pagination-controls');
    if (paginationControls) {
      paginationControls.style.display = enabled ? 'none' : 'flex';
    }

    if (enabled) {
      this.currentPage = 1;
      this.displayAllLoadedPosts();
    } else {
      this.goToPage(1);
    }
  }

  /**
   * Display all loaded posts for infinite scroll
   */
  displayAllLoadedPosts() {
    const contentState = document.getElementById('contentState');
    if (!contentState) return;

    contentState.innerHTML = '';

    const postsToShow = this.allPosts.slice(0, this.loadedPosts);
    postsToShow.forEach(post => {
      const postCard = this.createPostCard(post);
      contentState.appendChild(postCard);
    });
  }

  /**
   * Update URL with page parameter
   */
  updateURL(page) {
    const url = new URL(window.location.href);
    url.searchParams.set('page', page.toString());
    window.history.pushState({}, '', url);
  }

  /**
   * Initialize pagination from URL parameters
   */
  initializeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');

    if (pageParam) {
      const page = parseInt(pageParam);
      if (page >= 1 && page <= this.totalPages) {
        this.goToPage(page);
      }
    }
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DocsPagination };
}

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initializeDocsPagination();
    });
  } else {
    initializeDocsPagination();
  }

  function initializeDocsPagination() {
    console.log('📄 Initializing Docs Pagination...');

    setTimeout(() => {
      if (typeof DocsPagination !== 'undefined') {
        const pagination = new DocsPagination();
        pagination.initializeFromURL();
        window.docsPagination = pagination;
        console.log('📄 Docs Pagination initialized successfully');
      }
    }, 100);
  }
}
