// Scripts Index - Easy imports for all categorized scripts

// UI Scripts
export { default as DocsPagination } from './ui/docs-pagination.js';

// Core Scripts
export { default as HomepageScript } from './core/hompage-script.js';
export { default as UpgradeBrowser } from './core/upgrade-browsermu.js';

// Utility function to load scripts dynamically
export function loadScript(category, scriptName) {
  const scriptMap = {
    ui: {
      'docs-pagination': () => import('./ui/docs-pagination.js'),
    },
    core: {
      'homepage-script': () => import('./core/hompage-script.js'),
      'upgrade-browsermu': () => import('./core/upgrade-browsermu.js'),
    },
  };

  if (scriptMap[category] && scriptMap[category][scriptName]) {
    return scriptMap[category][scriptName]();
  }

  throw new Error(`Script not found: ${category}/${scriptName}`);
}

// Initialize all scripts
export function initializeScripts() {
  // Auto-initialize based on page type
  const path = window.location.pathname;

  if (path === '/') {
    // Homepage
    import('./core/hompage-script.js');
  } else if (path === '/docs') {
    // Docs listing page
    import('./ui/docs-pagination.js');
  }
}
