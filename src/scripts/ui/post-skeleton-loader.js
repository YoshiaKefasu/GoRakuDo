// Post Skeleton Loading Script
// Handles skeleton loading for individual post pages and semantic relationships
// 100% safe implementation with comprehensive error handling

class PostSkeletonLoader {
  constructor() {
    this.isInitialized = false;
    this.skeletonManager = null;
    this.loadingStates = new Map();
    this.initialize();
  }

  initialize() {
    try {
      // Initialize skeleton system
      this.initializeSkeletonSystem();

      // Set up event listeners
      this.setupEventListeners();

      // Show initial skeleton if needed
      this.showInitialSkeleton();

      this.isInitialized = true;
      console.log('✅ Post skeleton loader initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing post skeleton loader:', error);
    }
  }

  initializeSkeletonSystem() {
    try {
      // Inject skeleton CSS if not already present
      if (!document.getElementById('skeleton-styles')) {
        const style = document.createElement('style');
        style.id = 'skeleton-styles';
        style.textContent = this.generateSkeletonCSS();
        document.head.appendChild(style);
      }

      // Create skeleton manager
      this.skeletonManager = {
        show: (containerId, config) => this.showSkeleton(containerId, config),
        hide: containerId => this.hideSkeleton(containerId),
        hideAll: () => this.hideAllSkeletons(),
      };

      console.log('✅ Post skeleton system initialized');
    } catch (error) {
      console.error('❌ Error initializing post skeleton system:', error);
    }
  }

  setupEventListeners() {
    try {
      // Markdown content loading events
      document.addEventListener('DOMContentLoaded', () => {
        this.handleContentLoading();
      });

      // Relationship section loading events
      const relationshipSections = document.querySelectorAll(
        '.relationship-section'
      );
      relationshipSections.forEach(section => {
        this.handleRelationshipSectionLoading(section);
      });

      // Navigation events
      document.addEventListener('click', e => {
        if (e.target.matches('a[href^="/docs/"]')) {
          this.handlePostNavigation(e);
        }
      });

      // Back to docs button
      const backToDocsBtn = document.querySelector('.back-to-docs');
      if (backToDocsBtn) {
        backToDocsBtn.addEventListener('click', () => {
          this.handleBackToDocs();
        });
      }

      console.log('✅ Post event listeners set up');
    } catch (error) {
      console.error('❌ Error setting up post event listeners:', error);
    }
  }

  showInitialSkeleton() {
    try {
      // Show skeleton for post content if it's empty
      const postContent = document.querySelector('.post-content');
      if (postContent && postContent.children.length === 0) {
        this.showSkeleton('postContent', { type: 'content', count: 1 });
      }

      // Show skeleton for relationships if they exist but are empty
      const relationshipsContainer = document.querySelector(
        '.relationships-container'
      );
      if (
        relationshipsContainer &&
        relationshipsContainer.children.length === 0
      ) {
        this.showSkeleton('relationshipsContainer', {
          type: 'relationship-card',
          count: 3,
        });
      }

      console.log('✅ Initial post skeleton shown');
    } catch (error) {
      console.error('❌ Error showing initial post skeleton:', error);
    }
  }

  handleContentLoading() {
    try {
      // Check if markdown content is still loading
      const markdownContent = document.querySelector('.markdown-content');
      if (markdownContent && markdownContent.innerHTML.trim() === '') {
        // Show skeleton for content
        this.showSkeleton('markdownContent', { type: 'content', count: 1 });

        // Hide skeleton after content loads
        setTimeout(() => {
          this.hideSkeleton('markdownContent');
        }, 1000);
      }

      console.log('✅ Content loading skeleton handled');
    } catch (error) {
      console.error('❌ Error handling content loading:', error);
    }
  }

  handleRelationshipSectionLoading(section) {
    try {
      const sectionId = section.id || 'relationshipSection';

      // Show skeleton for relationship section if it's empty
      if (section.children.length === 0) {
        this.showSkeleton(sectionId, { type: 'relationship-card', count: 2 });

        // Hide skeleton after relationships load
        setTimeout(() => {
          this.hideSkeleton(sectionId);
        }, 800);
      }

      console.log('✅ Relationship section skeleton handled');
    } catch (error) {
      console.error('❌ Error handling relationship section loading:', error);
    }
  }

  handlePostNavigation(event) {
    try {
      const link = event.target.closest('a');
      if (!link) return;

      // Show skeleton for post content
      this.showSkeleton('postContent', { type: 'content', count: 1 });

      // Show skeleton for relationships if they exist
      const relationshipsContainer = document.getElementById(
        'relationshipsContainer'
      );
      if (relationshipsContainer) {
        this.showSkeleton('relationshipsContainer', {
          type: 'relationship-card',
          count: 3,
        });
      }

      console.log('✅ Post navigation skeleton shown');
    } catch (error) {
      console.error('❌ Error handling post navigation:', error);
    }
  }

  handleBackToDocs() {
    try {
      // Show skeleton for docs page loading
      if (window.docsSkeletonLoader) {
        window.docsSkeletonLoader.showSkeleton('postsContainer', {
          type: 'post-card',
          count: 3,
        });
      }

      console.log('✅ Back to docs skeleton shown');
    } catch (error) {
      console.error('❌ Error handling back to docs:', error);
    }
  }

  showSkeleton(containerId, config) {
    try {
      const container = document.getElementById(containerId);
      if (!container) {
        console.warn(`⚠️ Container not found: ${containerId}`);
        return;
      }

      const skeletonHTML = this.generateSkeletonHTML(config);
      container.innerHTML = skeletonHTML;
      container.classList.add('skeleton-loading');

      // Track loading state
      this.loadingStates.set(containerId, config);

      console.log(`✅ Post skeleton shown for ${containerId} (${config.type})`);
    } catch (error) {
      console.error('❌ Error showing post skeleton:', error);
    }
  }

  hideSkeleton(containerId) {
    try {
      const container = document.getElementById(containerId);
      if (!container) {
        console.warn(`⚠️ Container not found: ${containerId}`);
        return;
      }

      container.classList.remove('skeleton-loading');
      container.classList.add('skeleton-fade-in');

      // Remove fade-in class after animation
      setTimeout(() => {
        container.classList.remove('skeleton-fade-in');
      }, 500);

      // Remove from loading states
      this.loadingStates.delete(containerId);

      console.log(`✅ Post skeleton hidden for ${containerId}`);
    } catch (error) {
      console.error('❌ Error hiding post skeleton:', error);
    }
  }

  hideAllSkeletons() {
    try {
      this.loadingStates.forEach((config, containerId) => {
        this.hideSkeleton(containerId);
      });

      console.log('✅ All post skeletons hidden');
    } catch (error) {
      console.error('❌ Error hiding all post skeletons:', error);
    }
  }

  generateSkeletonHTML(config) {
    try {
      const { type, count = 1, className = '' } = config;
      let skeletonHTML = '';

      for (let i = 0; i < count; i++) {
        switch (type) {
          case 'content':
            skeletonHTML += this.generateContentSkeleton(className);
            break;
          case 'relationship-card':
            skeletonHTML += this.generateRelationshipCardSkeleton(className);
            break;
          default:
            console.warn(`⚠️ Unknown post skeleton type: ${type}`);
            break;
        }
      }

      return skeletonHTML;
    } catch (error) {
      console.error('❌ Error generating post skeleton HTML:', error);
      return '';
    }
  }

  generateContentSkeleton(className = '') {
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
          <div class="skeleton-paragraph"></div>
          <div class="skeleton-paragraph short"></div>
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

  generateRelationshipCardSkeleton(className = '') {
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

  generateSkeletonCSS() {
    return `
      /* Post Skeleton Loading Animations */
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

      .skeleton-content-tags {
        display: flex;
        gap: 8px;
        margin-top: 20px;
      }

      .skeleton-content-tag {
        height: 20px;
        background: linear-gradient(90deg, rgba(139, 93, 255, 0.1) 25%, rgba(139, 93, 255, 0.2) 50%, rgba(139, 93, 255, 0.1) 75%);
        background-size: 200% 100%;
        animation: skeleton-shimmer 2s infinite;
        border-radius: 10px;
        width: 50px;
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
        .skeleton-content {
          padding: 15px;
        }

        .skeleton-content-title {
          width: 95%;
        }

        .skeleton-content-meta {
          flex-direction: column;
          gap: 8px;
        }

        .skeleton-paragraph {
          margin-bottom: 10px;
        }
      }
    `;
  }
}

// Initialize skeleton loader when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  try {
    // Create global instance
    window.postSkeletonLoader = new PostSkeletonLoader();

    console.log('✅ Post skeleton loader ready');
  } catch (error) {
    console.error('❌ Error initializing post skeleton loader:', error);
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PostSkeletonLoader;
}
