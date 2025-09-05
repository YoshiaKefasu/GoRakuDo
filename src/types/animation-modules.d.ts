/**
 * TypeScript declarations for animation modules
 *
 * This file provides type definitions for the wave and stars animation modules
 * to resolve TypeScript import errors in Astro files.
 */

declare module '../scripts/ui/background-animations/stars-animation.js' {
  export interface StarsConfig {
    enabled: boolean;
    count: number;
    animationDuration: string;
    opacity: number;
    containerClass: string;
    starClass: string;
    containerId: string;
    useExistingContainer: boolean;
    createContainer: boolean;
    containerSelector: string;
    performance: {
      targetFPS: number;
      memoryThreshold: number;
      autoReduceComplexity: boolean;
      reduceThreshold: number;
    };
    accessibility: {
      respectReducedMotion: boolean;
      announceChanges: boolean;
      screenReaderFriendly: boolean;
      highContrastSupport: boolean;
    };
    css: {
      useCSSVariables: boolean;
      optimizeInjection: boolean;
      cacheStyles: boolean;
      minifyCSS: boolean;
    };
  }

  export interface StarsAnimation {
    init(containerId: string): void;
    destroy(): void;
    updateConfig(config: Partial<StarsConfig>): void;
    getPerformanceStatus(): { isRunning: boolean; fps: number; memoryUsage: number };
    getErrorState(): { hasError: boolean; errorMessage?: string; errorCode?: string };
  }

  export function initStarsAnimation(
    config?: Partial<StarsConfig>
  ): StarsAnimation;
}
