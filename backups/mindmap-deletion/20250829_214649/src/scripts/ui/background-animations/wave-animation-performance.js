/**
 * Wave Animation Performance Monitor
 * Monitors and optimizes wave animation performance for GoRakuDo
 *
 * Features:
 * - Canvas performance monitoring
 * - Memory usage tracking for canvas operations
 * - Device-specific optimization
 * - Frame rate capping
 */

export class WaveAnimationPerformanceMonitor {
  constructor(canvas, config = {}) {
    this.canvas = canvas;
    this.config = {
      targetFPS: 60,
      memoryThreshold: 50 * 1024 * 1024, // 50MB for canvas operations
      enableFrameRateCapping: true,
      adaptiveQuality: true,
      ...config,
    };

    this.metrics = {
      frameCount: 0,
      lastFrameTime: 0,
      averageFPS: 0,
      memoryUsage: 0,
      drawCalls: 0,
      lastMemoryCheck: 0,
    };

    this.frameTimes = [];
    this.maxFrameHistory = 60;
    this.animationId = null;
    this.isMonitoring = false;

    this.detectDeviceCapabilities();
  }

  /**
   * Start monitoring wave animation performance
   */
  startMonitoring() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    console.log(`🌊 Starting wave animation performance monitoring...`);

    // Start monitoring loop
    this.monitorFrame();

    // Start memory monitoring
    this.startMemoryMonitoring();
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    this.isMonitoring = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    console.log(`⏹️ Wave animation performance monitoring stopped`);
  }

  /**
   * Monitor frame rate and performance
   */
  monitorFrame = () => {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    this.metrics.frameCount++;

    if (this.metrics.lastFrameTime > 0) {
      const deltaTime = currentTime - this.metrics.lastFrameTime;
      const currentFPS = 1000 / deltaTime;

      // Track frame times for average calculation
      this.frameTimes.push(deltaTime);
      if (this.frameTimes.length > this.maxFrameHistory) {
        this.frameTimes.shift();
      }

      // Calculate average FPS
      if (this.frameTimes.length > 10) {
        const averageDeltaTime =
          this.frameTimes.reduce((sum, time) => sum + time, 0) /
          this.frameTimes.length;
        this.metrics.averageFPS = 1000 / averageDeltaTime;
      }

      // Apply device-specific optimizations if needed
      if (this.shouldOptimize()) {
        this.applyOptimizations();
      }

      // Log performance every 300 frames (5 seconds at 60fps)
      if (this.metrics.frameCount % 300 === 0) {
        this.logPerformanceStatus();
      }
    }

    this.metrics.lastFrameTime = currentTime;
    this.animationId = requestAnimationFrame(this.monitorFrame);
  };

  /**
   * Monitor canvas memory usage
   */
  startMemoryMonitoring() {
    const checkMemory = () => {
      if (!this.isMonitoring) return;

      const currentTime = performance.now();

      // Check memory usage every 10 seconds
      if (currentTime - this.metrics.lastMemoryCheck > 10000) {
        this.metrics.lastMemoryCheck = currentTime;

        if (performance.memory) {
          this.metrics.memoryUsage = performance.memory.usedJSHeapSize;

          if (this.metrics.memoryUsage > this.config.memoryThreshold) {
            console.warn(
              `🚨 High canvas memory usage: ${(this.metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB`,
            );
            this.optimizeMemoryUsage();
          }
        }
      }

      // Continue monitoring
      setTimeout(checkMemory, 1000);
    };

    checkMemory();
  }

  /**
   * Detect device capabilities and adjust settings
   */
  detectDeviceCapabilities() {
    const screenWidth = window.innerWidth;
    const isMobile = screenWidth < 768;
    const isLowEnd = this.isLowEndDevice();

    // Adjust target FPS based on device
    if (isLowEnd || isMobile) {
      this.config.targetFPS = isMobile ? 30 : 45;
    }

    console.log(
      `📱 Wave animation device detection: ${screenWidth}px screen, target FPS: ${this.config.targetFPS}`,
    );
  }

  /**
   * Check if device is low-end (cached result to avoid repeated WebGL context creation)
   */
  isLowEndDevice() {
    // Cache the result to avoid creating multiple WebGL contexts
    if (this._isLowEndDevice !== undefined) {
      return this._isLowEndDevice;
    }

    // Simple heuristics for low-end device detection
    const canvas = document.createElement("canvas");
    let gl;

    try {
      gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

      if (!gl) {
        this._isLowEndDevice = true;
        return true;
      }

      const renderer = gl.getParameter(gl.RENDERER)?.toLowerCase() || "";
      const isSoftwareRenderer =
        renderer.includes("software") || renderer.includes("llvmpipe");
      const hasLimitedMemory =
        navigator.deviceMemory && navigator.deviceMemory < 4;

      this._isLowEndDevice = isSoftwareRenderer || hasLimitedMemory;
    } catch (error) {
      console.warn("WebGL context creation failed:", error);
      this._isLowEndDevice = true;
    } finally {
      // Properly clean up the temporary canvas and context
      if (gl) {
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      }
      canvas.remove();
    }

    return this._isLowEndDevice;
  }

  /**
   * Check if optimizations should be applied
   */
  shouldOptimize() {
    const fpsThreshold = this.config.targetFPS * 0.8;
    return (
      this.metrics.averageFPS < fpsThreshold ||
      this.metrics.memoryUsage > this.config.memoryThreshold
    );
  }

  /**
   * Apply performance optimizations
   */
  applyOptimizations() {
    console.log(`⚡ Applying wave animation optimizations...`);

    // Reduce canvas resolution on low-end devices
    if (this.config.adaptiveQuality && this.isLowEndDevice()) {
      this.reduceCanvasResolution();
    }

    // Adjust animation complexity
    this.adjustAnimationComplexity();
  }

  /**
   * Reduce canvas resolution for better performance
   */
  reduceCanvasResolution() {
    if (!this.canvas) return;

    const originalWidth = this.canvas.width;
    const originalHeight = this.canvas.height;

    // Reduce resolution by 30% on low-end devices
    const newWidth = Math.floor(originalWidth * 0.7);
    const newHeight = Math.floor(originalHeight * 0.7);

    this.canvas.width = newWidth;
    this.canvas.height = newHeight;

    console.log(
      `🎨 Reduced canvas resolution from ${originalWidth}x${originalHeight} to ${newWidth}x${newHeight}`,
    );
  }

  /**
   * Adjust animation complexity based on performance
   */
  adjustAnimationComplexity() {
    // This would be implemented to modify wave parameters
    // For now, we'll adjust the frame rate capping
    if (this.metrics.averageFPS < this.config.targetFPS * 0.6) {
      this.config.targetFPS = Math.max(25, this.config.targetFPS - 10);
      console.log(
        `🔄 Reduced wave animation target FPS to ${this.config.targetFPS}`,
      );
    }
  }

  /**
   * Optimize memory usage
   */
  optimizeMemoryUsage() {
    // Force canvas context cleanup
    if (this.canvas) {
      const ctx = this.canvas.getContext("2d");
      if (ctx) {
        // Clear canvas completely
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Suggest garbage collection
        if (window.gc) {
          window.gc();
        }
      }
    }

    console.log(`🗑️ Optimized wave animation memory usage`);
  }

  /**
   * Get current performance metrics
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Log current performance status
   */
  logPerformanceStatus() {
    const emoji =
      this.metrics.averageFPS > this.config.targetFPS * 0.9 ? "✅" : "⚠️";

    console.log(
      `${emoji} Wave Animation FPS: ${this.metrics.averageFPS.toFixed(1)} ` +
        `(Target: ${this.config.targetFPS}) | ` +
        `Memory: ${(this.metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB | ` +
        `Frames: ${this.metrics.frameCount}`,
    );
  }
}

// Export factory function
export function initWaveAnimationPerformanceMonitor(canvas, config = {}) {
  return new WaveAnimationPerformanceMonitor(canvas, config);
}
