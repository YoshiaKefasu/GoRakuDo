/**
 * Homepage Animation Configuration
 *
 * Configuration for wave and stars animations on the homepage.
 * Matches the existing homepage animation parameters.
 *
 * ⚠️ PRODUCTION CONFIGURATION GUIDE:
 *
 * CSS VARIABLES REQUIRED:
 * - --color-accent: Primary theme color (fallback: #8b5dff)
 *
 * CONTAINER STRATEGIES:
 * 1. Dynamic Container (RECOMMENDED): Creates new container automatically
 * 2. Existing Container: Use existing DOM element
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
 * @version 1.0.0
 * @author GoRakuDo Team
 * @license MIT
 */

export default {
  wave: {
    enabled: true,
    waves: [
      {
        amplitude: 40,
        frequency: 0.01,
        speed: 0.02,
        offset: 0,
        color: "rgba(139, 93, 255, 0.08)",
        y: 0.7,
      },
      {
        amplitude: 60,
        frequency: 0.008,
        speed: -0.015,
        offset: Math.PI / 3,
        color: "rgba(139, 93, 255, 0.06)",
        y: 0.75,
      },
      {
        amplitude: 35,
        frequency: 0.012,
        speed: 0.025,
        offset: Math.PI / 2,
        color: "rgba(139, 93, 255, 0.04)",
        y: 0.8,
      },
      {
        amplitude: 45,
        frequency: 0.009,
        speed: -0.018,
        offset: Math.PI,
        color: "rgba(139, 93, 255, 0.03)",
        y: 0.85,
      },
    ],
    particles: {
      enabled: true,
      count: 8,
      opacity: 0.3,
      size: 1,
      movement: 0.01,
    },
    performance: {
      targetFPS: 60,
      autoReduceWaves: true,
      reduceThreshold: 30,
      memoryThreshold: 5 * 1024 * 1024, // 5MB
    },
  },
  stars: {
    enabled: true,
    count: 8,
    animationDuration: "3s",
    opacity: 0.6,
    containerClass: "stars",
    starClass: "star",
    containerId: "stars",
    // Container management options
    useExistingContainer: true,
    createContainer: false,
    containerSelector: ".stars",
    // Performance and accessibility options
    performance: {
      targetFPS: 60,
      memoryThreshold: 2 * 1024 * 1024, // 2MB
      autoReduceComplexity: true,
      reduceThreshold: 30,
    },
    accessibility: {
      respectReducedMotion: true,
      announceChanges: false,
      screenReaderFriendly: true,
      highContrastSupport: true,
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
