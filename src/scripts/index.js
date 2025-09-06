// Scripts Index - Easy imports for all categorized scripts
// Google Engineering Team 2025 Approach

// UI Scripts
export { default as DocsPagination } from './ui/docs-pagination.js';

// Core Scripts
export { default as HomepageScript } from './core/hompage-script.js';
// PostScriptはTypeScript分離版に置き換えられました
export { default as UpgradeBrowser } from './core/upgrade-browsermu.js';

// Utility function to load scripts dynamically
export function loadScript(category, scriptName) {
  const scriptMap = {
    ui: {
      'docs-pagination': () => import('./ui/docs-pagination.js'),
    },
    core: {
      'homepage-script': () => import('./core/hompage-script.js'),
      // post-scriptはTypeScript分離版に置き換えられました
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
  } else if (path.startsWith('/docs/') && path !== '/docs') {
    // Individual post page - TypeScript分離版を使用
    // import('./core/post-script.js'); // 削除済み
  } else if (path === '/docs') {
    // Docs listing page
    import('./ui/docs-pagination.js');
  }
}
