// Scripts Index - Easy imports for all categorized scripts

// Core Scripts
export { default as HomepageScript } from './core/hompage-script.js';
export { default as UpgradeBrowser } from './core/upgrade-browsermu.js';

// Utility function to load scripts dynamically
export function loadScript(category, scriptName) {
  const scriptMap = {
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
  }
  // Docs page no longer needs JavaScript - using pure Astro SSG
}
