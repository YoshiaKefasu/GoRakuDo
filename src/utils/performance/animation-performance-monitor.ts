// Animation Performance Monitor
// Basic animation performance monitoring for GoRakuDo
// Google Engineering Team 2025

/**
 * Basic Animation Performance Monitor
 * Monitors and optimizes animation performance
 */
export class AnimationPerformanceMonitor {
  private config: any = {
    targetFPS: 60,
    memoryThreshold: 50 * 1024 * 1024, // 50MB
  };

  private metrics: any = {
    averageFPS: 0,
    frameDrops: 0,
    memoryUsage: 0,
  };

  private frameTimes: number[] = [];
  private observers: any[] = [];
  private deviceCapabilities: any = {};

  constructor(config: any = {}) {
    this.config = { ...this.config, ...config };
    this.initialize();
  }

  /**
   * Initialize the performance monitor
   */
  private initialize(): void {
    this.detectDeviceCapabilities();
    this.setupPerformanceObservers();
    this.startMonitoring();
  }

  /**
   * Start performance monitoring
   */
  startMonitoring(): void {
    // Start frame rate monitoring
    this.startFrameMonitoring();

    // Start memory monitoring
    this.startMemoryMonitoring();

    // Set up automatic optimizations
    this.setupAutoOptimization();
  }

  /**
   * Start frame rate monitoring
   */
  private startFrameMonitoring(): void {
    let lastTime = performance.now();

    const monitorFrame = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      this.frameTimes.push(deltaTime);

      // Keep only last 60 frames for average calculation
      if (this.frameTimes.length > 60) {
        this.frameTimes.shift();
      }

      // Calculate average FPS
      const avgDelta =
        this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
      this.metrics.averageFPS = 1000 / avgDelta;

      lastTime = currentTime;
      requestAnimationFrame(monitorFrame);
    };

    requestAnimationFrame(monitorFrame);
  }

  /**
   * Start memory monitoring
   */
  private startMemoryMonitoring(): void {
    // Memory monitoring is not available in all browsers
    // This is a basic implementation
    if (typeof performance !== "undefined" && (performance as any).memory) {
      const checkMemory = () => {
        this.metrics.memoryUsage = (performance as any).memory.usedJSHeapSize;

        // Check if we need to optimize memory usage
        if (this.metrics.memoryUsage > this.config.memoryThreshold) {
          this.optimizeMemoryUsage();
        }
      };

      // Check memory every 10 seconds
      setInterval(checkMemory, 10000);
      checkMemory(); // Initial check
    }
  }

  /**
   * Setup performance observers
   */
  private setupPerformanceObservers(): void {
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      try {
        // Monitor long animation frames
        const observer = new (window as any).PerformanceObserver(
          (list: any) => {
            const entries = list.getEntries();
            this.metrics.frameDrops = entries.length;
          },
        );

        observer.observe({ entryTypes: ["long-animation-frame"] });
        this.observers.push(observer);
      } catch (error) {
        console.warn("Long animation frame monitoring not supported:", error);
      }
    }
  }

  /**
   * Detect device capabilities
   */
  private detectDeviceCapabilities(): void {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    let gpuTier: "high" | "medium" | "low" = "medium";
    const deviceMemory = (navigator as any).deviceMemory;

    if (gl) {
      const renderer =
        (gl as any).getParameter((gl as any).RENDERER)?.toLowerCase() || "";
      const isSoftwareRenderer =
        renderer.includes("software") || renderer.includes("llvmpipe");

      if (isSoftwareRenderer) {
        gpuTier = "low";
      } else {
        // Check for high-end GPU indicators
        const hasLimitedMemory = deviceMemory && deviceMemory < 4;
        gpuTier = hasLimitedMemory ? "medium" : "high";
      }
    }

    this.deviceCapabilities = {
      gpuTier,
      hasWebGL: !!gl,
      hardwareConcurrency: navigator.hardwareConcurrency || 4,
      deviceMemory: deviceMemory || 4,
    };
  }

  /**
   * Setup automatic optimization
   */
  private setupAutoOptimization(): void {
    // Get recommended settings based on device
    const recommendations = this.getRecommendedSettings();

    // Apply optimizations
    this.adjustCanvasQuality(recommendations.complexity);

    if (recommendations.disableHeavyAnimations) {
      this.disableHeavyAnimations();
    }

    if (recommendations.optimizeCSS) {
      this.optimizeCSSAnimations(recommendations.complexity);
    }

    // Set up performance status logging
    setInterval(() => {
      this.logPerformanceStatus();
    }, 30000); // Log every 30 seconds
  }

  /**
   * Get recommended settings
   */
  private getRecommendedSettings(): any {
    const isLowEnd =
      this.deviceCapabilities.gpuTier === "low" ||
      this.deviceCapabilities.deviceMemory < 4;

    if (isLowEnd) {
      return {
        targetFPS: 30,
        complexity: "low" as const,
        disableHeavyAnimations: true,
        optimizeCSS: true,
      };
    }

    return {
      targetFPS: 60,
      complexity: "medium" as const,
      disableHeavyAnimations: false,
      optimizeCSS: false,
    };
  }

  /**
   * Adjust canvas quality
   */
  private adjustCanvasQuality(complexity: "high" | "medium" | "low"): void {
    const canvases = document.querySelectorAll("canvas");

    canvases.forEach((canvas) => {
      const ctx = (canvas as HTMLCanvasElement).getContext("2d");
      if (ctx) {
        // Adjust image smoothing based on complexity
        (ctx as any).imageSmoothingEnabled = complexity !== "low";
        (ctx as any).imageSmoothingQuality = complexity;
      }
    });

    console.log(`🎨 Canvas quality adjusted to: ${complexity}`);
  }

  /**
   * Disable heavy animations
   */
  private disableHeavyAnimations(): void {
    // Disable animations on stars or other heavy elements
    const starsContainer = document.getElementById("stars");
    if (starsContainer) {
      const stars = starsContainer.querySelectorAll("*");
      stars.forEach((star, index) => {
        if (index >= 50) {
          // Keep only first 50 stars
          (star as HTMLElement).style.display = "none";
        }
      });
    }
  }

  /**
   * Optimize CSS animations
   */
  private optimizeCSSAnimations(complexity: "high" | "medium" | "low"): void {
    const styleId = "animation-performance-optimizations";

    // Remove existing style if it exists
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    let css = "";

    switch (complexity) {
      case "low":
        css = `
          * {
            animation-duration: 0.3s !important;
            animation-timing-function: linear !important;
          }
          .heavy-animation {
            display: none !important;
          }
        `;
        break;
      case "medium":
        css = `
          * {
            animation-duration: 0.5s !important;
          }
        `;
        break;
      case "high":
        css = `
          /* High quality animations enabled */
        `;
        break;
    }

    // Create and append style
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = css;
    document.head.appendChild(style);

    console.log(`⚡ CSS animations optimized for: ${complexity} complexity`);
  }

  /**
   * Optimize memory usage
   */
  private optimizeMemoryUsage(): void {
    // Force garbage collection if available
    if (typeof window !== "undefined" && (window as any).gc) {
      (window as any).gc();
    }

    // Clear frame times history to free memory
    this.frameTimes = [];

    // Adjust canvas quality to low if memory is critical
    this.adjustCanvasQuality("low");
  }

  /**
   * Log performance status
   */
  private logPerformanceStatus(): void {
    const emoji =
      this.metrics.averageFPS > this.config.targetFPS * 0.9 ? "✅" : "⚠️";

    console.log(
      `${emoji} Animation FPS: ${this.metrics.averageFPS.toFixed(1)} ` +
        `(Target: ${this.config.targetFPS}) | ` +
        `Memory: ${(this.metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB | ` +
        `Frame Drops: ${this.metrics.frameDrops}`,
    );
  }

  /**
   * Get current metrics
   */
  getMetrics(): any {
    return { ...this.metrics };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: any): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    this.stop();
  }

  /**
   * Apply device-specific optimizations
   */
  applyDeviceOptimizations(): void {
    // Apply optimizations based on device capabilities
    if (this.deviceCapabilities.gpuTier === "low") {
      this.adjustCanvasQuality("low");
      this.disableHeavyAnimations();
    } else if (this.deviceCapabilities.gpuTier === "medium") {
      this.adjustCanvasQuality("medium");
    }
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    // Disconnect all observers
    this.observers.forEach((observer) => {
      if (observer.disconnect) {
        observer.disconnect();
      }
    });
    this.observers = [];
  }
}

// Export a singleton instance for convenience
export const animationPerformanceMonitor = new AnimationPerformanceMonitor();
