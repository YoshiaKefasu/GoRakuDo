/**
 * Wave Animation Module
 *
 * A modular, configurable wave animation system for Astro applications.
 * Extracted from homepage script with enhanced configuration and error handling.
 *
 * @version 1.0.0
 * @author GoRakuDo Team
 * @license MIT
 */

/**
 * Wave Animation Class
 * Handles canvas-based wave animations with configurable parameters
 */
export class WaveAnimation {
  constructor(config = {}) {
    // Default configuration matching existing 4-wave system
    this.defaultConfig = {
      enabled: true,
      waves: [
        {
          amplitude: 40,
          frequency: 0.01,
          speed: 0.02,
          offset: 0,
          color: "rgba(139, 93, 255, 0.6)",
          y: 0.7,
        },
        {
          amplitude: 60,
          frequency: 0.008,
          speed: -0.015,
          offset: Math.PI / 3,
          color: "rgba(139, 93, 255, 0.5)",
          y: 0.75,
        },
        {
          amplitude: 35,
          frequency: 0.012,
          speed: 0.025,
          offset: Math.PI / 2,
          color: "rgba(139, 93, 255, 0.4)",
          y: 0.8,
        },
        {
          amplitude: 45,
          frequency: 0.009,
          speed: -0.018,
          offset: Math.PI,
          color: "rgba(139, 93, 255, 0.35)",
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
    };

    // Merge user configuration with defaults
    this.config = this.mergeConfig(this.defaultConfig, config);

    // Animation state
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.time = 0;
    this.isInitialized = false;
    this.isDestroyed = false;

    // Performance monitoring
    this.performanceMetrics = {
      fps: 0,
      frameCount: 0,
      lastFrameTime: 0,
      memoryUsage: 0,
      startTime: 0,
    };

    // Error handling
    this.errorState = {
      hasError: false,
      errorMessage: null,
      errorType: null,
    };

    // Page visibility handling
    this.isPageVisible = true;
    this.setupPageVisibilityHandler();

    console.log(
      "🌊 Wave Animation Module initialized with configuration:",
      this.config,
    );
  }

  /**
   * Merge user configuration with defaults
   * @param {Object} defaults - Default configuration
   * @param {Object} userConfig - User-provided configuration
   * @returns {Object} Merged configuration
   */
  mergeConfig(defaults, userConfig) {
    const merged = { ...defaults };

    // Deep merge for nested objects
    if (userConfig.waves) {
      merged.waves = userConfig.waves.map((wave, index) => ({
        ...(defaults.waves[index] || defaults.waves[0]),
        ...wave,
      }));
    }

    if (userConfig.particles) {
      merged.particles = { ...defaults.particles, ...userConfig.particles };
    }

    if (userConfig.performance) {
      merged.performance = {
        ...defaults.performance,
        ...userConfig.performance,
      };
    }

    // Validate configuration
    this.validateConfig(merged);

    return merged;
  }

  /**
   * Validate configuration parameters
   * @param {Object} config - Configuration to validate
   */
  validateConfig(config) {
    const errors = [];

    // Validate waves array
    if (!Array.isArray(config.waves) || config.waves.length === 0) {
      errors.push("Waves configuration must be a non-empty array");
    }

    // Validate each wave
    config.waves.forEach((wave, index) => {
      if (
        typeof wave.amplitude !== "number" ||
        wave.amplitude < 20 ||
        wave.amplitude > 80
      ) {
        errors.push(
          `Wave ${index}: amplitude must be between 20-80, got ${wave.amplitude}`,
        );
      }
      if (
        typeof wave.frequency !== "number" ||
        wave.frequency < 0.005 ||
        wave.frequency > 0.015
      ) {
        errors.push(
          `Wave ${index}: frequency must be between 0.005-0.015, got ${wave.frequency}`,
        );
      }
      if (typeof wave.y !== "number" || wave.y < 0.6 || wave.y > 0.9) {
        errors.push(
          `Wave ${index}: y position must be between 0.6-0.9, got ${wave.y}`,
        );
      }
      if (!wave.color || typeof wave.color !== "string") {
        errors.push(`Wave ${index}: color must be a valid CSS color string`);
      }
    });

    // Validate particles
    if (config.particles.enabled) {
      if (
        typeof config.particles.count !== "number" ||
        config.particles.count < 1 ||
        config.particles.count > 20
      ) {
        errors.push(
          `Particles count must be between 1-20, got ${config.particles.count}`,
        );
      }
    }

    if (errors.length > 0) {
      const errorMessage = `Configuration validation failed:\n${errors.join("\n")}`;
      console.error("❌ Wave Animation Configuration Error:", errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Initialize the wave animation
   * @param {string} containerId - Canvas element ID
   * @returns {boolean} Success status
   */
  init(containerId = "waveCanvas") {
    try {
      if (this.isDestroyed) {
        console.warn("⚠️ Cannot initialize destroyed wave animation");
        return false;
      }

      if (this.isInitialized) {
        console.warn("⚠️ Wave animation already initialized");
        return true;
      }

      console.log("🔍 Looking for canvas element with ID:", containerId);

      // Get canvas element
      this.canvas = document.getElementById(containerId);
      console.log("📐 Canvas element found:", this.canvas);

      if (!this.canvas) {
        throw new Error(`Canvas element with ID '${containerId}' not found`);
      }

      // Get 2D context first
      console.log("🎨 Getting 2D context...");
      this.ctx = this.canvas.getContext("2d");
      console.log("🎨 2D context obtained:", this.ctx);

      if (!this.ctx) {
        throw new Error("Failed to get 2D context from canvas");
      }

      // Resize canvas FIRST before any drawing operations
      console.log("📏 Resizing canvas to window dimensions...");
      this.resizeCanvas();

      // Check canvas properties after resize
      console.log("📐 Canvas properties after resize:", {
        tagName: this.canvas.tagName,
        width: this.canvas.width,
        height: this.canvas.height,
        offsetWidth: this.canvas.offsetWidth,
        offsetHeight: this.canvas.offsetHeight,
      });

      // Simple drawing test on properly sized canvas
      console.log("🧪 Testing canvas drawing capability...");
      try {
        // Draw a visible test rectangle on the full canvas
        this.ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        this.ctx.fillRect(0, 0, this.width, this.height);
        console.log("✅ Canvas drawing test successful - red background drawn");

        // Clear it immediately and start animation
        this.ctx.clearRect(0, 0, this.width, this.height);
        console.log("🎬 Canvas test completed, animation will start...");
      } catch (drawError) {
        console.error("❌ Canvas drawing test failed:", drawError);
        throw new Error("Canvas drawing test failed: " + drawError.message);
      }

      // Calculate wave positions
      this.config.waves.forEach((wave) => {
        wave.yPos = this.height * wave.y;
      });

      console.log(
        "🌊 Wave positions calculated:",
        this.config.waves.map((w) => ({ y: w.y, yPos: w.yPos })),
      );

      // Set up event listeners
      this.setupEventListeners();

      // CRITICAL FIX: Mark as initialized BEFORE starting animation
      // Root Cause: startAnimation() was called before isInitialized = true was set,
      // causing the condition if (!this.isInitialized || this.animationId) return;
      // to prevent the animation from starting
      this.isInitialized = true;
      this.performanceMetrics.startTime = performance.now();

      // Start animation AFTER setting initialized flag
      this.startAnimation();

      console.log("✅ Wave animation initialized successfully");
      return true;
    } catch (error) {
      console.error("❌ Wave Animation Init Error:", error);
      this.handleError("INIT_ERROR", error.message);
      return false;
    }
  }

  /**
   * Set up canvas resize and event listeners
   */
  setupEventListeners() {
    // Debounced resize handler
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.resizeCanvas();
      }, 100);
    };

    window.addEventListener("resize", handleResize);

    // Store cleanup function
    this.cleanupResize = () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }

  /**
   * Set up page visibility API for performance optimization
   */
  setupPageVisibilityHandler() {
    const handleVisibilityChange = () => {
      this.isPageVisible = !document.hidden;

      if (this.isPageVisible && this.isInitialized && !this.animationId) {
        // Resume animation when page becomes visible
        this.startAnimation();
      } else if (!this.isPageVisible && this.animationId) {
        // Pause animation when page becomes hidden
        this.stopAnimation();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Store cleanup function
    this.cleanupVisibility = () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }

  /**
   * Resize canvas to match window dimensions
   */
  resizeCanvas() {
    if (!this.canvas) return;

    try {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;

      // Update wave y positions based on new height
      this.config.waves.forEach((wave) => {
        wave.yPos = this.height * wave.y;
      });

      console.log(`📐 Canvas resized to ${this.width}x${this.height}`);
    } catch (error) {
      this.handleError("RESIZE_ERROR", error.message);
    }
  }

  /**
   * Start the animation loop
   *
   * CRITICAL FIX: This method was previously called before isInitialized = true was set,
   * causing the condition below to prevent animation from starting.
   * The fix was to reorder initialization in the init() method.
   */
  startAnimation() {
    if (!this.isInitialized || this.animationId) return;

    console.log("🎬 Starting wave animation loop...");
    this.animate();
    console.log("🎬 Wave animation started");
  }

  /**
   * Stop the animation loop
   */
  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
      console.log("⏸️ Wave animation paused");
    }
  }

  /**
   * Main animation loop
   *
   * This method is called by requestAnimationFrame to create the continuous animation.
   * The animation loop was previously not starting due to initialization order issues
   * in the startAnimation() method.
   */
  animate() {
    if (!this.isInitialized || this.isDestroyed) {
      console.warn("⚠️ Animation loop stopped - not initialized or destroyed");
      return;
    }

    try {
      // Performance monitoring
      this.updatePerformanceMetrics();

      // Check for performance issues
      if (this.shouldReducePerformance()) {
        this.reducePerformance();
      }

      // Create gradient background (includes canvas clear)
      this.drawBackground();

      // Draw waves
      this.drawWaves();

      // Draw particles
      if (this.config.particles.enabled) {
        this.drawParticles();
      }

      // Update time
      this.time += 1;

      // Continue animation loop - use arrow function to preserve context
      this.animationId = requestAnimationFrame(() => this.animate());
    } catch (error) {
      console.error("❌ Animation loop error:", error);
      this.handleError("ANIMATION_ERROR", error.message);
      this.stopAnimation();
    }
  }

  /**
   * Draw gradient background
   */
  drawBackground() {
    try {
      // Clear canvas completely
      this.ctx.clearRect(0, 0, this.width, this.height);

      // Draw a subtle dark background
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      this.ctx.fillRect(0, 0, this.width, this.height);

      // Add a beautiful gradient overlay
      const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
      gradient.addColorStop(0, "rgba(139, 93, 255, 0.02)");
      gradient.addColorStop(0.5, "rgba(139, 93, 255, 0.01)");
      gradient.addColorStop(1, "rgba(139, 93, 255, 0.03)");

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.width, this.height);
    } catch (error) {
      console.error("❌ Background drawing error:", error);
    }
  }

  /**
   * Draw all waves
   */
  drawWaves() {
    try {
      this.config.waves.forEach((wave, index) => {
        this.ctx.beginPath();

        // Create wave path
        for (let x = 0; x <= this.width + 10; x += 2) {
          const y =
            wave.yPos +
            Math.sin(
              x * wave.frequency + this.time * wave.speed + wave.offset,
            ) *
              wave.amplitude;

          if (x === 0) {
            this.ctx.moveTo(x, y);
          } else {
            this.ctx.lineTo(x, y);
          }
        }

        // Close the path to create filled area
        this.ctx.lineTo(this.width, this.height);
        this.ctx.lineTo(0, this.height);
        this.ctx.closePath();

        // Fill wave with the configured color
        this.ctx.fillStyle = wave.color;
        this.ctx.fill();

        // Add subtle stroke for definition
        this.ctx.strokeStyle = "rgba(139, 93, 255, 0.3)";
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      });
    } catch (error) {
      console.error("❌ Wave drawing error:", error);
    }
  }

  /**
   * Draw floating particles
   */
  drawParticles() {
    const { count, opacity, size, movement } = this.config.particles;

    for (let i = 0; i < count; i++) {
      const x =
        this.width * 0.1 +
        i * this.width * 0.1 +
        Math.sin(this.time * 0.01 + i) * 20;
      const y = this.height * 0.3 + Math.sin(this.time * 0.008 + i * 1.5) * 30;
      const particleSize = size + Math.sin(this.time * 0.02 + i) * 0.5;
      const particleOpacity = opacity + Math.sin(this.time * 0.015 + i) * 0.2;

      this.ctx.beginPath();
      this.ctx.arc(x, y, particleSize, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(139, 93, 255, ${Math.max(particleOpacity, 0.1)})`;
      this.ctx.fill();

      // Add glow effect for better visibility
      this.ctx.shadowColor = "rgba(139, 93, 255, 0.5)";
      this.ctx.shadowBlur = 3;
      this.ctx.fill();
      this.ctx.shadowBlur = 0; // Reset shadow
    }
  }

  /**
   * Update performance metrics
   */
  updatePerformanceMetrics() {
    const now = performance.now();
    this.performanceMetrics.frameCount++;

    if (this.performanceMetrics.lastFrameTime > 0) {
      const frameTime = now - this.performanceMetrics.lastFrameTime;
      this.performanceMetrics.fps = 1000 / frameTime;
    }

    this.performanceMetrics.lastFrameTime = now;

    // Monitor memory usage if available
    if (performance.memory) {
      this.performanceMetrics.memoryUsage = performance.memory.usedJSHeapSize;
    }
  }

  /**
   * Check if performance should be reduced
   * @returns {boolean} Whether to reduce performance
   */
  shouldReducePerformance() {
    if (!this.config.performance.autoReduceWaves) return false;

    return (
      this.performanceMetrics.fps < this.config.performance.reduceThreshold ||
      this.performanceMetrics.memoryUsage >
        this.config.performance.memoryThreshold
    );
  }

  /**
   * Reduce performance by simplifying animation
   */
  reducePerformance() {
    if (this.config.waves.length > 2) {
      // Remove one wave temporarily
      this.config.waves.pop();
      console.warn("⚠️ Performance optimization: Reduced wave count");
    }
  }

  /**
   * Handle errors gracefully
   * @param {string} type - Error type
   * @param {string} message - Error message
   */
  handleError(type, message) {
    this.errorState = {
      hasError: true,
      errorType: type,
      errorMessage: message,
    };

    console.error(`❌ Wave Animation Error (${type}):`, message);

    // Emit error event for external handling
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("waveAnimationError", {
          detail: { type, message, timestamp: Date.now() },
        }),
      );
    }
  }

  /**
   * Update configuration at runtime
   * @param {Object} newConfig - New configuration options
   */
  updateConfig(newConfig) {
    try {
      const oldConfig = { ...this.config };
      this.config = this.mergeConfig(this.config, newConfig);

      // Recalculate wave positions if height changed
      if (this.isInitialized) {
        this.config.waves.forEach((wave) => {
          wave.yPos = this.height * wave.y;
        });
      }

      console.log("⚙️ Wave animation configuration updated:", newConfig);

      // Emit config update event
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("waveAnimationConfigUpdated", {
            detail: { oldConfig, newConfig, timestamp: Date.now() },
          }),
        );
      }
    } catch (error) {
      this.handleError("CONFIG_UPDATE_ERROR", error.message);
    }
  }

  /**
   * Get current performance metrics
   * @returns {Object} Performance metrics
   */
  getPerformanceMetrics() {
    return { ...this.performanceMetrics };
  }

  /**
   * Get current error state
   * @returns {Object} Error state
   */
  getErrorState() {
    return { ...this.errorState };
  }

  /**
   * Reset error state
   */
  resetErrorState() {
    this.errorState = {
      hasError: false,
      errorMessage: null,
      errorType: null,
    };
  }

  /**
   * Destroy the animation and clean up resources
   */
  destroy() {
    try {
      // Stop animation
      this.stopAnimation();

      // Clean up event listeners
      if (this.cleanupResize) {
        this.cleanupResize();
      }

      if (this.cleanupVisibility) {
        this.cleanupVisibility();
      }

      // Clear canvas
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.width, this.height);
      }

      // Reset state
      this.canvas = null;
      this.ctx = null;
      this.isInitialized = false;
      this.isDestroyed = true;

      console.log("🗑️ Wave animation destroyed and cleaned up");
    } catch (error) {
      console.error("❌ Error during wave animation destruction:", error);
    }
  }
}

/**
 * Factory function to create wave animation instance
 * @param {Object} config - Configuration object
 * @returns {WaveAnimation} Wave animation instance
 */
export function initWaveAnimation(config = {}) {
  return new WaveAnimation(config);
}

/**
 * Utility function to validate wave configuration
 * @param {Object} config - Configuration to validate
 * @returns {boolean} Whether configuration is valid
 */
export function validateWaveConfig(config) {
  try {
    const tempAnimation = new WaveAnimation(config);
    return true;
  } catch (error) {
    console.error("Configuration validation failed:", error.message);
    return false;
  }
}

/**
 * Default configuration export
 */
export const defaultWaveConfig = {
  enabled: true,
  waves: [
    {
      amplitude: 40,
      frequency: 0.01,
      speed: 0.02,
      offset: 0,
      color: "rgba(139, 93, 255, 0.6)",
      y: 0.7,
    },
    {
      amplitude: 60,
      frequency: 0.008,
      speed: -0.015,
      offset: Math.PI / 3,
      color: "rgba(139, 93, 255, 0.5)",
      y: 0.75,
    },
    {
      amplitude: 35,
      frequency: 0.012,
      speed: 0.025,
      offset: Math.PI / 2,
      color: "rgba(139, 93, 255, 0.4)",
      y: 0.8,
    },
    {
      amplitude: 45,
      frequency: 0.009,
      speed: -0.018,
      offset: Math.PI,
      color: "rgba(139, 93, 255, 0.35)",
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
    memoryThreshold: 5 * 1024 * 1024,
  },
};
