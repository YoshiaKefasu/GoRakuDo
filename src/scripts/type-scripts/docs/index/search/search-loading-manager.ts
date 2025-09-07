import type { SearchLoadingManager as ISearchLoadingManager } from '../global';

/**
 * Search Engine Loading State Management
 * Manages the loading states of search input and filter buttons
 */
export class SearchLoadingManager implements ISearchLoadingManager {
  searchInput: HTMLInputElement | null = null;
  filterButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.filter-button');
  loadingIndicator: HTMLElement | null = null;
  isReady = false;

  constructor() {
    this.init();
  }

  private init(): void {
    // Get DOM elements
    this.searchInput = document.getElementById('searchInput') as HTMLInputElement;
    this.filterButtons = document.querySelectorAll('.filter-button') as NodeListOf<HTMLButtonElement>;
    this.loadingIndicator = document.getElementById('searchLoadingIndicator');

    // Ensure initial loading state
    this.setLoadingState();
  }

  setLoadingState(): void {
    if (this.searchInput) {
      this.searchInput.disabled = true;
      this.searchInput.classList.add('search-input-loading');
      this.searchInput.classList.remove('search-input-ready');
      this.searchInput.placeholder = 'Memuat sistem pencarian...';
    }

    // Disable filter buttons
    this.filterButtons.forEach((button) => {
      button.disabled = true;
      button.classList.add('filter-button-loading');
    });

    // Show loading indicator
    if (this.loadingIndicator) {
      this.loadingIndicator.style.display = 'flex';
    }
  }

  setReadyState(): void {
    if (this.searchInput) {
      this.searchInput.disabled = false;
      this.searchInput.classList.remove('search-input-loading');
      this.searchInput.classList.add('search-input-ready');
      this.searchInput.placeholder = 'Cari konten Indonesian (min 2 karakter)';
    }

    // Enable filter buttons
    this.filterButtons.forEach((button) => {
      button.disabled = false;
      button.classList.remove('filter-button-loading');
    });

    // Hide loading indicator
    if (this.loadingIndicator) {
      this.loadingIndicator.style.display = 'none';
    }

    this.isReady = true;
    if (window.clientLogger && window.clientLogger.log) {
      window.clientLogger.log('Search engine ready for use', 'success');
    }
  }

  setErrorState(errorMessage = 'Search temporarily unavailable'): void {
    if (this.searchInput) {
      this.searchInput.disabled = true;
      this.searchInput.classList.add('search-input-loading');
      this.searchInput.classList.remove('search-input-ready');
      this.searchInput.placeholder = errorMessage;
    }

    // Keep filter buttons disabled
    this.filterButtons.forEach((button) => {
      button.disabled = true;
      button.classList.add('filter-button-loading');
    });

    // Update loading indicator to show error
    if (this.loadingIndicator) {
      this.loadingIndicator.innerHTML = `
        <div class="relative inline-flex items-center justify-center size-2.5">
          <div class="absolute inset-0 rounded-full border border-red-400/20"></div>
          <div class="absolute inset-0 rounded-full border border-transparent border-t-red-500 animate-spin"></div>
        </div>
        <span class="loading-text text-xs font-normal tracking-normal" style="color: #ef4444;">${errorMessage}</span>
      `;
    }
  }
}
