// Enhanced performance-based enhancement loader with browser detection and Discord error reporting

export interface PerformanceMetrics {
  loadTime: number;
  memory?: number;
  connection?: "slow-2g" | "2g" | "3g" | "4g" | "unknown";
  deviceMemory?: number;
  hardwareConcurrency?: number;
}

export interface EnhancementConfig {
  name: string;
  priority: "critical" | "high" | "medium" | "low";
  minLoadTime: number;
  minMemory?: number;
  minConnection?: "slow-2g" | "2g" | "3g" | "4g";
  enabled: boolean;
  loadFunction: () => void | Promise<void>;
  isCritical?: boolean; // New: Critical features load immediately
}

export interface UserPreferences {
  aggressiveLoading: boolean;
  customThresholds: {
    syntaxHighlighting: number;
    readingProgress: number;
    errorHandling: number;
  };
  enableAllFeatures: boolean;
  autoDetectCapabilities: boolean; // New: Enable browser-based detection
}

export interface BrowserCapabilities {
  isHighEndDevice: boolean;
  hasFastConnection: boolean;
  hasGoodPerformance: boolean;
  supportsAdvancedFeatures: boolean;
}

export class PerformanceEnhancementLoader {
  private static instance: PerformanceEnhancementLoader;
  private enhancements: Map<string, EnhancementConfig> = new Map();
  private metrics: PerformanceMetrics;
  private loadedEnhancements: Set<string> = new Set();
  private userPreferences: UserPreferences;
  private browserCapabilities: BrowserCapabilities;

  constructor() {
    this.metrics = this.capturePerformanceMetrics();
    this.userPreferences = this.loadUserPreferences();
    this.browserCapabilities = this.detectBrowserCapabilities();
    this.adjustPreferencesBasedOnCapabilities();
  }

  static getInstance(): PerformanceEnhancementLoader {
    if (!PerformanceEnhancementLoader.instance) {
      PerformanceEnhancementLoader.instance =
        new PerformanceEnhancementLoader();
    }
    return PerformanceEnhancementLoader.instance;
  }

  // Detect browser capabilities for automatic preference adjustment
  private detectBrowserCapabilities(): BrowserCapabilities {
    const capabilities: BrowserCapabilities = {
      isHighEndDevice: false,
      hasFastConnection: false,
      hasGoodPerformance: false,
      supportsAdvancedFeatures: false,
    };

    // Check device capabilities
    if (typeof navigator !== "undefined") {
      // Check memory
      if ((navigator as any).deviceMemory) {
        capabilities.isHighEndDevice = (navigator as any).deviceMemory >= 4;
      }

      // Check CPU cores
      if (navigator.hardwareConcurrency) {
        capabilities.isHighEndDevice =
          capabilities.isHighEndDevice || navigator.hardwareConcurrency >= 4;
      }

      // Check connection
      if ((navigator as any).connection) {
        const connection = (navigator as any).connection;
        const effectiveType = connection.effectiveType;
        capabilities.hasFastConnection =
          effectiveType === "4g" || effectiveType === "3g";
      }

      // Check for advanced features
      capabilities.supportsAdvancedFeatures =
        typeof IntersectionObserver !== "undefined" &&
        typeof ResizeObserver !== "undefined" &&
        typeof PerformanceObserver !== "undefined";
    }

    // Check performance history
    if (typeof performance !== "undefined") {
      const loadTime = this.metrics.loadTime;
      capabilities.hasGoodPerformance = loadTime < 2000; // Good if loads in under 2 seconds
    }

    return capabilities;
  }

  // Automatically adjust preferences based on browser capabilities
  private adjustPreferencesBasedOnCapabilities(): void {
    if (!this.userPreferences.autoDetectCapabilities) {
      return;
    }

    const adjustments: Partial<UserPreferences> = {};

    // Adjust based on device capabilities
    if (this.browserCapabilities.isHighEndDevice) {
      adjustments.aggressiveLoading = true;
      adjustments.enableAllFeatures = true;
      adjustments.customThresholds = {
        syntaxHighlighting: 500, // Very aggressive for high-end devices
        readingProgress: 300,
        errorHandling: 1000,
      };
    } else if (this.browserCapabilities.hasFastConnection) {
      adjustments.aggressiveLoading = true;
      adjustments.customThresholds = {
        syntaxHighlighting: 800,
        readingProgress: 500,
        errorHandling: 1500,
      };
    } else {
      // Conservative settings for low-end devices
      adjustments.aggressiveLoading = false;
      adjustments.enableAllFeatures = false;
      adjustments.customThresholds = {
        syntaxHighlighting: 2000,
        readingProgress: 1500,
        errorHandling: 3000,
      };
    }

    this.saveUserPreferences(adjustments);
  }

  // Load user preferences from localStorage
  private loadUserPreferences(): UserPreferences {
    const defaultPreferences: UserPreferences = {
      aggressiveLoading: true,
      customThresholds: {
        syntaxHighlighting: 1000,
        readingProgress: 800,
        errorHandling: 2000,
      },
      enableAllFeatures: true,
      autoDetectCapabilities: true, // Enable by default
    };

    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        const stored = localStorage.getItem("gorakudo-enhancement-preferences");
        if (stored) {
          return { ...defaultPreferences, ...JSON.parse(stored) };
        }
      } catch (error) {
        console.warn("Could not load user preferences:", error);
      }
    }

    return defaultPreferences;
  }

  // Save user preferences to localStorage
  saveUserPreferences(preferences: Partial<UserPreferences>): void {
    this.userPreferences = { ...this.userPreferences, ...preferences };

    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        localStorage.setItem(
          "gorakudo-enhancement-preferences",
          JSON.stringify(this.userPreferences),
        );
      } catch (error) {
        console.warn("Could not save user preferences:", error);
      }
    }
  }

  // Get current user preferences
  getUserPreferences(): UserPreferences {
    return { ...this.userPreferences };
  }

  // Get browser capabilities
  getBrowserCapabilities(): BrowserCapabilities {
    return { ...this.browserCapabilities };
  }

  // Capture current performance metrics
  private capturePerformanceMetrics(): PerformanceMetrics {
    const metrics: PerformanceMetrics = {
      loadTime: 0,
    };

    if (typeof performance !== "undefined" && performance.timing) {
      const timing = performance.timing;
      metrics.loadTime = timing.loadEventEnd - timing.navigationStart;
    } else if (typeof performance !== "undefined" && performance.now) {
      metrics.loadTime = performance.now();
    }

    if (typeof navigator !== "undefined" && (navigator as any).deviceMemory) {
      metrics.deviceMemory = (navigator as any).deviceMemory;
    }

    if (typeof navigator !== "undefined" && (navigator as any).connection) {
      const connection = (navigator as any).connection;
      metrics.connection = connection.effectiveType || "unknown";
    }

    if (typeof navigator !== "undefined" && navigator.hardwareConcurrency) {
      metrics.hardwareConcurrency = navigator.hardwareConcurrency;
    }

    return metrics;
  }

  // Register an enhancement
  registerEnhancement(config: EnhancementConfig): void {
    this.enhancements.set(config.name, config);
  }

  // Hybrid enhancement loading: immediate for critical, progressive for others
  async loadEnhancements(): Promise<void> {
    // Load critical features immediately
    await this.loadCriticalEnhancements();

    // Load other features based on user preferences and capabilities
    if (this.userPreferences.enableAllFeatures) {
      await this.loadAllEnhancements();
    } else {
      await this.loadProgressiveEnhancements();
    }
  }

  // Load critical features immediately
  private async loadCriticalEnhancements(): Promise<void> {
    const criticalEnhancements = Array.from(this.enhancements.values()).filter(
      (enhancement) => enhancement.enabled && enhancement.isCritical,
    );

    for (const enhancement of criticalEnhancements) {
      await this.loadEnhancement(enhancement);
    }
  }

  // Load all enhancements immediately
  async loadAllEnhancements(): Promise<void> {
    const sortedEnhancements = Array.from(this.enhancements.values())
      .filter((enhancement) => enhancement.enabled)
      .sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

    for (const enhancement of sortedEnhancements) {
      await this.loadEnhancement(enhancement);
    }
  }

  // Load enhancements progressively based on performance
  private async loadProgressiveEnhancements(): Promise<void> {
    const sortedEnhancements = Array.from(this.enhancements.values())
      .filter((enhancement) => enhancement.enabled && !enhancement.isCritical)
      .sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

    for (const enhancement of sortedEnhancements) {
      if (this.shouldLoadEnhancement(enhancement)) {
        await this.loadEnhancement(enhancement);
      }
    }
  }

  // Determine if enhancement should be loaded
  private shouldLoadEnhancement(enhancement: EnhancementConfig): boolean {
    const customThreshold =
      this.userPreferences.customThresholds[
        enhancement.name as keyof UserPreferences["customThresholds"]
      ];
    const loadTimeThreshold = customThreshold || enhancement.minLoadTime;

    if (this.metrics.loadTime > loadTimeThreshold) {
      return false;
    }

    if (enhancement.minMemory && this.metrics.deviceMemory) {
      if (this.metrics.deviceMemory < enhancement.minMemory) {
        return false;
      }
    }

    if (enhancement.minConnection && this.metrics.connection) {
      const connectionOrder = { "slow-2g": 1, "2g": 2, "3g": 3, "4g": 4 };
      const currentConnection =
        this.metrics.connection === "unknown"
          ? 2
          : connectionOrder[this.metrics.connection] || 0;
      const minConnection = connectionOrder[enhancement.minConnection] || 0;

      if (currentConnection < minConnection) {
        return false;
      }
    }

    return true;
  }

  // Load a specific enhancement
  private async loadEnhancement(enhancement: EnhancementConfig): Promise<void> {
    if (this.loadedEnhancements.has(enhancement.name)) {
      return;
    }

    try {
      await enhancement.loadFunction();
      this.loadedEnhancements.add(enhancement.name);

      if (typeof window !== "undefined") {
        console.log(`[Enhancement] Loaded: ${enhancement.name}`);
      }
    } catch (error) {
      console.error(`[Enhancement] Failed to load ${enhancement.name}:`, error);
      // Report error to Discord system
      this.reportErrorToDiscord(enhancement.name, error);
    }
  }

  // Report errors to Discord system
  private reportErrorToDiscord(enhancementName: string, error: any): void {
    if (typeof window !== "undefined") {
      const errorData = {
        type: "enhancement-load-error",
        enhancement: enhancementName,
        error: error.message || error.toString(),
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      };

      // Store error for Discord reporting
      this.storeErrorForDiscord(errorData);
    }
  }

  // Store error data for Discord reporting
  private storeErrorForDiscord(errorData: any): void {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        const existingErrors =
          localStorage.getItem("gorakudo-discord-errors") || "[]";
        const errors = JSON.parse(existingErrors);
        errors.push(errorData);

        // Keep only last 10 errors
        if (errors.length > 10) {
          errors.splice(0, errors.length - 10);
        }

        localStorage.setItem("gorakudo-discord-errors", JSON.stringify(errors));
      } catch (error) {
        console.warn("Could not store error for Discord reporting:", error);
      }
    }
  }

  // Get current performance metrics
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Get loaded enhancements
  getLoadedEnhancements(): string[] {
    return Array.from(this.loadedEnhancements);
  }

  // Get all registered enhancements
  getAllEnhancements(): EnhancementConfig[] {
    return Array.from(this.enhancements.values());
  }

  // Update metrics
  updateMetrics(): void {
    this.metrics = this.capturePerformanceMetrics();
  }

  // Force load a specific enhancement
  async forceLoadEnhancement(name: string): Promise<void> {
    const enhancement = this.enhancements.get(name);
    if (enhancement) {
      await this.loadEnhancement(enhancement);
    }
  }

  // Toggle aggressive loading mode
  toggleAggressiveLoading(): void {
    this.userPreferences.aggressiveLoading =
      !this.userPreferences.aggressiveLoading;
    this.saveUserPreferences({
      aggressiveLoading: this.userPreferences.aggressiveLoading,
    });
  }

  // Update custom thresholds
  updateCustomThresholds(
    thresholds: Partial<UserPreferences["customThresholds"]>,
  ): void {
    this.userPreferences.customThresholds = {
      ...this.userPreferences.customThresholds,
      ...thresholds,
    };
    this.saveUserPreferences({
      customThresholds: this.userPreferences.customThresholds,
    });
  }

  // Toggle enable all features
  toggleEnableAllFeatures(): void {
    this.userPreferences.enableAllFeatures =
      !this.userPreferences.enableAllFeatures;
    this.saveUserPreferences({
      enableAllFeatures: this.userPreferences.enableAllFeatures,
    });
  }

  // Toggle auto-detect capabilities
  toggleAutoDetectCapabilities(): void {
    this.userPreferences.autoDetectCapabilities =
      !this.userPreferences.autoDetectCapabilities;
    this.saveUserPreferences({
      autoDetectCapabilities: this.userPreferences.autoDetectCapabilities,
    });

    if (this.userPreferences.autoDetectCapabilities) {
      this.adjustPreferencesBasedOnCapabilities();
    }
  }
}

// Global instance
export const performanceLoader = PerformanceEnhancementLoader.getInstance();

// Make available globally for static hosting compatibility
if (typeof window !== "undefined") {
  (window as any).performanceLoader = performanceLoader;
}
