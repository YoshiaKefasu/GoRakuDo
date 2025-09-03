// Skeleton Loading Utility for Performance Optimization
// Provides reusable skeleton components and loading states
// 100% safe implementation with comprehensive error handling

export interface SkeletonConfig {
  type:
    | 'post-card'
    | 'search-result'
    | 'pagination'
    | 'content'
    | 'relationship-card';
  count?: number;
  className?: string;
}

export interface SkeletonPostCard {
  title: string;
  description: string;
  tags: string[];
  readTime: string;
  date: string;
}

export interface SkeletonContent {
  title: string;
  paragraphs: number;
  tags: string[];
}

export interface SkeletonRelationshipCard {
  title: string;
  reason: string;
  strength: string;
}

// Generate skeleton post card HTML
export function generateSkeletonPostCard(className: string = ''): string {
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

// Generate skeleton search result HTML
export function generateSkeletonSearchResult(className: string = ''): string {
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

// Generate skeleton pagination HTML
export function generateSkeletonPagination(className: string = ''): string {
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

// Generate skeleton content HTML
export function generateSkeletonContent(className: string = ''): string {
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

// Generate skeleton relationship card HTML
export function generateSkeletonRelationshipCard(
  className: string = ''
): string {
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

// Generate multiple skeleton items
export function generateSkeletonItems(config: SkeletonConfig): string {
  const { type, count = 1, className = '' } = config;

  try {
    let skeletonHTML = '';

    for (let i = 0; i < count; i++) {
      switch (type) {
        case 'post-card':
          skeletonHTML += generateSkeletonPostCard(className);
          break;
        case 'search-result':
          skeletonHTML += generateSkeletonSearchResult(className);
          break;
        case 'pagination':
          skeletonHTML += generateSkeletonPagination(className);
          break;
        case 'content':
          skeletonHTML += generateSkeletonContent(className);
          break;
        case 'relationship-card':
          skeletonHTML += generateSkeletonRelationshipCard(className);
          break;
        default:
          console.warn(`⚠️ Unknown skeleton type: ${type}`);
          break;
      }
    }

    return skeletonHTML;
  } catch (error) {
    console.error('❌ Error generating skeleton items:', error);
    return ''; // Return empty string as fallback
  }
}

// Generate skeleton CSS styles
export function generateSkeletonCSS(): string {
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
  `;
}

// Show skeleton loading
export function showSkeleton(
  containerId: string,
  config: SkeletonConfig
): void {
  try {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`⚠️ Container not found: ${containerId}`);
      return;
    }

    const skeletonHTML = generateSkeletonItems(config);
    container.innerHTML = skeletonHTML;
    container.classList.add('skeleton-loading');

    console.log(
      `✅ Skeleton loading shown for ${containerId} (${config.type})`
    );
  } catch (error) {
    console.error('❌ Error showing skeleton:', error);
  }
}

// Hide skeleton loading
export function hideSkeleton(containerId: string): void {
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

    console.log(`✅ Skeleton loading hidden for ${containerId}`);
  } catch (error) {
    console.error('❌ Error hiding skeleton:', error);
  }
}

// Initialize skeleton loading system
export function initializeSkeletonSystem(): void {
  try {
    // Inject skeleton CSS if not already present
    if (!document.getElementById('skeleton-styles')) {
      const style = document.createElement('style');
      style.id = 'skeleton-styles';
      style.textContent = generateSkeletonCSS();
      document.head.appendChild(style);
    }

    console.log('✅ Skeleton loading system initialized');
  } catch (error) {
    console.error('❌ Error initializing skeleton system:', error);
  }
}

// Global skeleton loading manager
export class SkeletonManager {
  private static instance: SkeletonManager;
  private activeSkeletons: Set<string> = new Set();

  static getInstance(): SkeletonManager {
    if (!SkeletonManager.instance) {
      SkeletonManager.instance = new SkeletonManager();
    }
    return SkeletonManager.instance;
  }

  show(containerId: string, config: SkeletonConfig): void {
    this.activeSkeletons.add(containerId);
    showSkeleton(containerId, config);
  }

  hide(containerId: string): void {
    this.activeSkeletons.delete(containerId);
    hideSkeleton(containerId);
  }

  hideAll(): void {
    this.activeSkeletons.forEach(containerId => {
      hideSkeleton(containerId);
    });
    this.activeSkeletons.clear();
  }

  isActive(containerId: string): boolean {
    return this.activeSkeletons.has(containerId);
  }
}

// Export singleton instance
export const skeletonManager = SkeletonManager.getInstance();

console.log('✅ Skeleton loading utility loaded successfully');
