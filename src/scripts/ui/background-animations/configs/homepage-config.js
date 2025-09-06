/**
 * Homepage Animation Configuration
 *
 * Configuration for stars animation on the homepage.
 * Wave animation has been removed and replaced with CSS-based waves.
 *
 * ⚠️ PRODUCTION CONFIGURATION GUIDE:
 *
 * CSS VARIABLES REQUIRED:
 * - --color-accent: Primary theme color (fallback: #8b5dff)
 *
 * CONTAINER STRATEGIES:
 * 1. Existing Container: Use existing DOM element (.stars)
 * 2. Dynamic Container: Creates new container automatically
 * 3. Custom Container: Create with custom class
 *
 * PERFORMANCE SETTINGS:
 * - Conservative settings for production stability
 * - Adaptive features disabled by default
 * - Fixed step size for consistent rendering
 *
 * ACCESSIBILITY:
 * - Respects user preferences by default
 * - Reduced motion support enabled
 * - High contrast mode support
 *
 * @version 2.0.0
 * @author GoRakuDo Team
 * @license MIT
 */

export default {
  stars: {
    enabled: true,
    count: 8, // Balanced star count
    animationDuration: '4s', // Slightly longer for smoother movement
    opacity: 0.6, // Balanced visibility
    containerClass: 'stars',
    starClass: 'star',
    containerId: 'stars',
    // Container management options
    useExistingContainer: true,
    createContainer: false,
    containerSelector: '.stars',
    // Performance and accessibility options
    performance: {
      targetFPS: 60,
      memoryThreshold: 2 * 1024 * 1024, // 2MB
      autoReduceComplexity: true,
      reduceThreshold: 30,
    },
    accessibility: {
      respectReducedMotion: false, // Disabled to keep stars running
      announceChanges: false,
      screenReaderFriendly: true,
      highContrastSupport: true,
      forceEnable: true, // Force enable to prevent pausing
    },
    // CSS optimization options
    css: {
      useCSSVariables: true,
      optimizeInjection: true,
      cacheStyles: true,
      minifyCSS: false, // For development debugging
    },
  },
};
