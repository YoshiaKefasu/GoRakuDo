// Docs Skeleton Loader - Optimized External Module
// Extracted from docs.astro for better maintainability and performance
// Handles skeleton loading for docs page navigation, search results, and pagination

/**
 * DocsSkeletonLoader - Enhanced Skeleton Loading System
 */
class DocsSkeletonLoader {
  constructor() {
    // Property declarations for TypeScript
    this.isInitialized = false;
    this.skeletonManager = null;
    this.loadingStates = new Map();

    this.initialize();
  }

  /**
   * Initialize skeleton loader
   */
  initialize() {
    try {
      this.initializeSkeletonSystem();
      this.setupEventListeners();
      this.showInitialSkeleton();
      this.isInitialized = true;
    } catch (error) {
      console.error("Error initializing docs skeleton loader:", error);
    }
  }

  /**
   * Initialize skeleton system
   */
  initializeSkeletonSystem() {
    try {
      if (!document.getElementById("skeleton-styles")) {
        const style = document.createElement("style");
        style.id = "skeleton-styles";
        style.textContent = this.generateSkeletonCSS();
        document.head.appendChild(style);
      }

      this.skeletonManager = {
        show: (containerId, config) => this.showSkeleton(containerId, config),
        hide: (containerId) => this.hideSkeleton(containerId),
        hideAll: () => this.hideAllSkeletons(),
      };
    } catch (error) {
      console.error("Error initializing skeleton system:", error);
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    try {
      const searchInput = document.getElementById("searchInput");
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          const target = e.target;
          if (target?.value !== undefined) {
            this.handleSearchInput(target.value);
          }
        });
      }

      document.addEventListener("click", (e) => {
        const target = e.target;
        if (target?.matches && target.matches(".pagination-btn, .pagination-number")) {
          this.handlePaginationClick(e);
        }
      });

      const infiniteScrollToggle = document.getElementById("infiniteScrollToggle");
      if (infiniteScrollToggle) {
        infiniteScrollToggle.addEventListener("change", (e) => {
          this.handleInfiniteScrollToggle(e);
        });
      }

      document.addEventListener("click", (e) => {
        const target = e.target;
        if (target?.matches && target.matches('a[href^="/docs/"]')) {
          this.handlePostNavigation(e);
        }
      });
    } catch (error) {
      console.error("Error setting up event listeners:", error);
    }
  }

  /**
   * Show initial skeleton if needed
   */
  showInitialSkeleton() {
    try {
      const postsContainer = document.getElementById("postsContainer");
      if (postsContainer && postsContainer.children.length === 0) {
        this.showSkeleton("postsContainer", {
          type: "post-card",
          count: 3,
        });
      }

      const paginationContainer = document.querySelector(".pagination-container");
      if (paginationContainer && paginationContainer.children.length === 0) {
        this.showSkeleton("paginationContainer", {
          type: "pagination",
          count: 1,
        });
      }
    } catch (error) {
      console.error("Error showing initial skeleton:", error);
    }
  }

  /**
   * Handle search input
   */
  handleSearchInput(query) {
    try {
      if (!query || query.trim().length === 0) {
        this.hideSkeleton("searchResultsContent");
        return;
      }

      this.showSkeleton("searchResultsContent", {
        type: "search-result",
        count: 3,
      });

      setTimeout(() => {
        this.hideSkeleton("searchResultsContent");
      }, 500);
    } catch (error) {
      console.error("Error handling search input:", error);
    }
  }

  /**
   * Handle pagination click
   */
  handlePaginationClick(event) {
    try {
      const target = event.target;
      const page = target.dataset.page;

      if (!page) return;

      this.showSkeleton("postsContainer", {
        type: "post-card",
        count: 3,
      });

      setTimeout(() => {
        this.hideSkeleton("postsContainer");
      }, 300);
    } catch (error) {
      console.error("Error handling pagination click:", error);
    }
  }

  /**
   * Handle infinite scroll toggle
   */
  handleInfiniteScrollToggle(event) {
    try {
      const isEnabled = event.target.checked;

      if (isEnabled) {
        this.showSkeleton("postsContainer", {
          type: "post-card",
          count: 2,
        });

        setTimeout(() => {
          this.hideSkeleton("postsContainer");
        }, 400);
      }
    } catch (error) {
      console.error("Error handling infinite scroll toggle:", error);
    }
  }

  /**
   * Handle post navigation
   */
  handlePostNavigation(event) {
    try {
      const link = event.target.closest("a");
      if (!link) return;

      this.showSkeleton("postContent", { type: "content", count: 1 });

      const relationshipsContainer = document.getElementById("relationshipsContainer");
      if (relationshipsContainer) {
        this.showSkeleton("relationshipsContainer", {
          type: "relationship-card",
          count: 3,
        });
      }
    } catch (error) {
      console.error("Error handling post navigation:", error);
    }
  }

  /**
   * Show skeleton
   */
  showSkeleton(containerId, config) {
    try {
      const container = document.getElementById(containerId);
      if (!container) {
        console.warn(`笞・・Container not found: ${containerId}`);
        return;
      }

      const skeletonHTML = this.generateSkeletonHTML(config);
      container.innerHTML = skeletonHTML;
      container.classList.add("skeleton-loading");

      this.loadingStates.set(containerId, config);
    } catch (error) {
      console.error("Error showing skeleton:", error);
    }
  }

  /**
   * Hide skeleton
   */
  hideSkeleton(containerId) {
    try {
      const container = document.getElementById(containerId);
      if (!container) {
        console.warn(`笞・・Container not found: ${containerId}`);
        return;
      }

      container.classList.remove("skeleton-loading");
      container.classList.add("skeleton-fade-in");

      setTimeout(() => {
        container.classList.remove("skeleton-fade-in");
      }, 500);

      this.loadingStates.delete(containerId);
    } catch (error) {
      console.error("Error hiding skeleton:", error);
    }
  }

  /**
   * Hide all skeletons
   */
  hideAllSkeletons() {
    try {
      this.loadingStates.forEach((config, containerId) => {
        this.hideSkeleton(containerId);
      });
    } catch (error) {
      console.error("Error hiding all skeletons:", error);
    }
  }

  /**
   * Generate skeleton HTML
   */
  generateSkeletonHTML(config) {
    try {
      const { type, count = 1, className = "" } = config;
      let skeletonHTML = "";

      for (let i = 0; i < count; i++) {
        switch (type) {
          case "post-card":
            skeletonHTML += this.generatePostCardSkeleton(className);
            break;
          case "search-result":
            skeletonHTML += this.generateSearchResultSkeleton(className);
            break;
          case "pagination":
            skeletonHTML += this.generatePaginationSkeleton(className);
            break;
          case "content":
            skeletonHTML += this.generateContentSkeleton(className);
            break;
          case "relationship-card":
            skeletonHTML += this.generateRelationshipCardSkeleton(className);
            break;
          default:
            console.warn(`笞・・Unknown skeleton type: ${type}`);
            break;
        }
      }

      return skeletonHTML;
    } catch (error) {
      console.error("Error generating skeleton HTML:", error);
      return "";
    }
  }

  /**
   * Generate post card skeleton
   */
  generatePostCardSkeleton(className = "") {
    return `
      <article class="post-card skeleton-post-card ${className}">
        <div class="skeleton-post-header">
          <div class="skeleton-title"></div>
          <div class="skeleton-meta">
            <div class="skeleton-date"></div>
            <div class="skeleton-read-time"></div>
          </div>
        </div>
        <div class="skeleton-description"></div>
        <div class="skeleton-tags">
          <div class="skeleton-tag"></div>
          <div class="skeleton-tag"></div>
          <div class="skeleton-tag"></div>
        </div>
        <div class="skeleton-read-more"></div>
      </article>
    `;
  }

  /**
   * Generate search result skeleton
   */
  generateSearchResultSkeleton(className = "") {
    return `
      <div class="search-result skeleton-search-result ${className}">
        <div class="skeleton-result-header">
          <div class="skeleton-result-title"></div>
          <div class="skeleton-result-meta">
            <div class="skeleton-result-date"></div>
            <div class="skeleton-result-read-time"></div>
          </div>
        </div>
        <div class="skeleton-result-description"></div>
        <div class="skeleton-result-tags">
          <div class="skeleton-result-tag"></div>
          <div class="skeleton-result-tag"></div>
        </div>
      </div>
    `;
  }

  /**
   * Generate pagination skeleton
   */
  generatePaginationSkeleton(className = "") {
    return `
      <div class="pagination-container skeleton-pagination ${className}">
        <div class="skeleton-pagination-info">
          <div class="skeleton-pagination-stats"></div>
        </div>
        <div class="skeleton-pagination-controls">
          <div class="skeleton-pagination-btn"></div>
          <div class="skeleton-pagination-numbers">
            <div class="skeleton-pagination-number"></div>
            <div class="skeleton-pagination-number"></div>
            <div class="skeleton-pagination-number"></div>
          </div>
          <div class="skeleton-pagination-btn"></div>
        </div>
      </div>
    `;
  }

  /**
   * Generate content skeleton
   */
  generateContentSkeleton(className = "") {
    return `
      <div class="post-content skeleton-content ${className}">
        <div class="skeleton-content-header">
          <div class="skeleton-content-title"></div>
          <div class="skeleton-content-meta">
            <div class="skeleton-content-author"></div>
            <div class="skeleton-content-date"></div>
            <div class="skeleton-content-read-time"></div>
          </div>
        </div>
        <div class="skeleton-content-body">
          <div class="skeleton-paragraph"></div>
          <div class="skeleton-paragraph"></div>
          <div class="skeleton-paragraph"></div>
          <div class="skeleton-paragraph short"></div>
        </div>
        <div class="skeleton-content-tags">
          <div class="skeleton-content-tag"></div>
          <div class="skeleton-content-tag"></div>
          <div class="skeleton-content-tag"></div>
        </div>
      </div>
    `;
  }

  /**
   * Generate relationship card skeleton
   */
  generateRelationshipCardSkeleton(className = "") {
    return `
      <div class="relationship-card skeleton-relationship-card ${className}">
        <div class="skeleton-relationship-header">
          <div class="skeleton-relationship-title"></div>
          <div class="skeleton-relationship-strength"></div>
        </div>
        <div class="skeleton-relationship-reason"></div>
      </div>
    `;
  }

  /**
   * Generate skeleton CSS
   */
  generateSkeletonCSS() {
    return `
      /* Skeleton Loading Animations */
      .skeleton-post-card,
      .skeleton-search-result,
      .skeleton-pagination,
      .skeleton-content,
      .skeleton-relationship-card {
        opacity: 0.7;
        animation: skeleton-pulse 1.5s ease-in-out infinite;
      }

      @keyframes skeleton-pulse {
        0%, 100% {
          opacity: 0.7;
        }
        50% {
          opacity: 0.4;
        }
      }

      /* Post Card Skeleton */
      .skeleton-post-card {
        background: rgba(139, 93, 255, 0.05);
        border: 1px solid rgba(139, 93, 255, 0.1);
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
      }

      .skeleton-title {
        height: 24px;
        background: linear-gradient(90deg, rgba(139, 93, 255, 0.1) 25%, rgba(139, 93, 255, 0.2) 50%, rgba(139, 93, 255, 0.1) 75%);
        background-size: 200% 100%;
        animation: skeleton-shimmer 2s infinite;
        border-radius: 4px;
        margin-bottom: 12px;
        width: 80%;
      }

      .skeleton-meta {
        display: flex;
        gap: 15px;
        margin-bottom: 15px;
      }

      .skeleton-date,
      .skeleton-read-time {
        height: 16px;
        background: linear-gradient(90deg, rgba(139, 93, 255, 0.1) 25%, rgba(139, 93, 255, 0.2) 50%, rgba(139, 93, 255, 0.1) 75%);
        background-size: 200% 100%;
        animation: skeleton-shimmer 2s infinite;
        border-radius: 4px;
        width: 60px;
      }

      .skeleton-description {
        height: 16px;
        background: linear-gradient(90deg, rgba(139, 93, 255, 0.1) 25%, rgba(139, 93, 255, 0.2) 50%, rgba(139, 93, 255, 0.1) 75%);
        background-size: 200% 100%;
        animation: skeleton-shimmer 2s infinite;
        border-radius: 4px;
        margin-bottom: 15px;
        width: 100%;
      }

      .skeleton-tags {
        display: flex;
        gap: 8px;
        margin-bottom: 15px;
      }

      .skeleton-tag {
        height: 20px;
        background: linear-gradient(90deg, rgba(139, 93, 255, 0.1) 25%, rgba(139, 93, 255, 0.2) 50%, rgba(139, 93, 255, 0.1) 75%);
        background-size: 200% 100%;
        animation: skeleton-shimmer 2s infinite;
        border-radius: 10px;
        width: 50px;
      }

      .skeleton-read-more {
        height: 16px;
        background: linear-gradient(90deg, rgba(139, 93, 255, 0.1) 25%, rgba(139, 93, 255, 0.2) 50%, rgba(139, 93, 255, 0.1) 75%);
        background-size: 200% 100%;
        animation: skeleton-shimmer 2s infinite;
        border-radius: 4px;
        width: 120px;
      }

      /* Search Result Skeleton */
      .skeleton-search-result {
        background: rgba(139, 93, 255, 0.05);
        border: 1px solid rgba(139, 93, 255, 0.1);
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 15px;
      }

      .skeleton-result-title {
        height: 20px;
        background: linear-gradient(90deg, rgba(139, 93, 255, 0.1) 25%, rgba(139, 93, 255, 0.2) 50%, rgba(139, 93, 255, 0.1) 75%);
        background-size: 200% 100%;
        animation: skeleton-shimmer 2s infinite;
        border-radius: 4px;
        margin-bottom: 10px;
        width: 70%;
      }

      .skeleton-result-description {
        height: 14px;
        background: linear-gradient(90deg, rgba(139, 93, 255, 0.1) 25%, rgba(139, 93, 255, 0.2) 50%, rgba(139, 93, 255, 0.1) 75%);
        background-size: 200% 100%;
        animation: skeleton-shimmer 2s infinite;
        border-radius: 4px;
        margin-bottom: 10px;
        width: 100%;
      }

      /* Pagination Skeleton */
      .skeleton-pagination {
        background: rgba(139, 93, 255, 0.05);
        border: 1px solid rgba(139, 93, 255, 0.1);
        border-radius: 8px;
        padding: 20px;
        margin-top: 30px;
      }

      .skeleton-pagination-stats {
        height: 16px;
        background: linear-gradient(90deg, rgba(139, 93, 255, 0.1) 25%, rgba(139, 93, 255, 0.2) 50%, rgba(139, 93, 255, 0.1) 75%);
        background-size: 200% 100%;
        animation: skeleton-shimmer 2s infinite;
        border-radius: 4px;
        margin-bottom: 15px;
        width: 200px;
      }

      .skeleton-pagination-controls {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }

      .skeleton-pagination-btn {
        height: 36px;
        background: linear-gradient(90deg, rgba(139, 93, 255, 0.1) 25%, rgba(139, 93, 255, 0.2) 50%, rgba(139, 93, 255, 0.1) 75%);
        background-size: 200% 100%;
        animation: skeleton-shimmer 2s infinite;
        border-radius: 6px;
        width: 80px;
      }

      .skeleton-pagination-numbers {
        display: flex;
        gap: 5px;
      }

      .skeleton-pagination-number {
        height: 36px;
        background: linear-gradient(90deg, rgba(139, 93, 255, 0.1) 25%, rgba(139, 93, 255, 0.2) 50%, rgba(139, 93, 255, 0.1) 75%);
        background-size: 200% 100%;
        animation: skeleton-shimmer 2s infinite;
        border-radius: 6px;
        width: 36px;
      }

      /* Content Skeleton */
      .skeleton-content {
        background: rgba(139, 93, 255, 0.05);
        border: 1px solid rgba(139, 93, 255, 0.1);
        border-radius: 12px;
        padding: 25px;
        margin-bottom: 30px;
      }

      .skeleton-content-title {
        height: 32px;
        background: linear-gradient(90deg, rgba(139, 93, 255, 0.1) 25%, rgba(139, 93, 255, 0.2) 50%, rgba(139, 93, 255, 0.1) 75%);
        background-size: 200% 100%;
        animation: skeleton-shimmer 2s infinite;
        border-radius: 6px;
        margin-bottom: 15px;
        width: 90%;
      }

      .skeleton-content-meta {
        display: flex;
        gap: 20px;
        margin-bottom: 25px;
      }

      .skeleton-content-author,
      .skeleton-content-date,
      .skeleton-content-read-time {
        height: 18px;
        background: linear-gradient(90deg, rgba(139, 93, 255, 0.1) 25%, rgba(139, 93, 255, 0.2) 50%, rgba(139, 93, 255, 0.1) 75%);
        background-size: 200% 100%;
        animation: skeleton-shimmer 2s infinite;
        border-radius: 4px;
        width: 80px;
      }

      .skeleton-paragraph {
        height: 16px;
        background: linear-gradient(90deg, rgba(139, 93, 255, 0.1) 25%, rgba(139, 93, 255, 0.2) 50%, rgba(139, 93, 255, 0.1) 75%);
        background-size: 200% 100%;
        animation: skeleton-shimmer 2s infinite;
        border-radius: 4px;
        margin-bottom: 12px;
        width: 100%;
      }

      .skeleton-paragraph.short {
        width: 70%;
      }

      /* Relationship Card Skeleton */
      .skeleton-relationship-card {
        background: rgba(139, 93, 255, 0.05);
        border: 1px solid rgba(139, 93, 255, 0.1);
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 15px;
      }

      .skeleton-relationship-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }

      .skeleton-relationship-title {
        height: 18px;
        background: linear-gradient(90deg, rgba(139, 93, 255, 0.1) 25%, rgba(139, 93, 255, 0.2) 50%, rgba(139, 93, 255, 0.1) 75%);
        background-size: 200% 100%;
        animation: skeleton-shimmer 2s infinite;
        border-radius: 4px;
        width: 60%;
      }

      .skeleton-relationship-strength {
        height: 16px;
        background: linear-gradient(90deg, rgba(139, 93, 255, 0.1) 25%, rgba(139, 93, 255, 0.2) 50%, rgba(139, 93, 255, 0.1) 75%);
        background-size: 200% 100%;
        animation: skeleton-shimmer 2s infinite;
        border-radius: 10px;
        width: 40px;
      }

      .skeleton-relationship-reason {
        height: 14px;
        background: linear-gradient(90deg, rgba(139, 93, 255, 0.1) 25%, rgba(139, 93, 255, 0.2) 50%, rgba(139, 93, 255, 0.1) 75%);
        background-size: 200% 100%;
        animation: skeleton-shimmer 2s infinite;
        border-radius: 4px;
        width: 80%;
      }

      /* Shimmer Animation */
      @keyframes skeleton-shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }

      /* Loading State Management */
      .skeleton-loading {
        pointer-events: none;
        user-select: none;
      }

      .skeleton-loading * {
        pointer-events: none;
      }

      /* Fade In Animation for Content */
      .skeleton-fade-in {
        animation: skeleton-fade-in 0.5s ease-in-out;
      }

      @keyframes skeleton-fade-in {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .skeleton-post-card,
        .skeleton-content {
          padding: 15px;
        }

        .skeleton-title {
          width: 90%;
        }

        .skeleton-content-title {
          width: 95%;
        }

        .skeleton-meta,
        .skeleton-content-meta {
          flex-direction: column;
          gap: 8px;
        }

        .skeleton-pagination-controls {
          flex-direction: column;
          gap: 15px;
        }
      }
    `;
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DocsSkeletonLoader };
}

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initializeDocsSkeletonLoader();
    });
  } else {
    initializeDocsSkeletonLoader();
  }

  function initializeDocsSkeletonLoader() {
    console.log('ｦｴ Initializing Docs Skeleton Loader...');
    
    try {
      window.docsSkeletonLoader = new DocsSkeletonLoader();
      console.log('笨・Skeleton loading utility loaded successfully');
    } catch (error) {
      console.error('Error initializing docs skeleton loader:', error);
    }
  }
}
