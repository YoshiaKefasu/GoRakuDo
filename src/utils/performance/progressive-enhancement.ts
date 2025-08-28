// Hybrid Progressive Enhancement System
export interface EnhancementConfig {
  id: string;
  name: string;
  description: string;
  category: "performance" | "ux" | "accessibility" | "feature";
  priority: "low" | "medium" | "high" | "critical";
  dependencies: string[];
  featureTest: () => boolean | Promise<boolean>;
  performanceTest: () => boolean | Promise<boolean>;
  userPreference: string;
  apply: () => void | Promise<void>;
  revert: () => void | Promise<void>;
}

export interface EnhancementState {
  enabled: boolean;
  applied: boolean;
  lastTested: number;
  performanceScore: number;
  userPreference: boolean;
}

export class HybridProgressiveEnhancement {
  private enhancements: Map<string, EnhancementConfig> = new Map();
  private states: Map<string, EnhancementState> = new Map();
  private userPreferences: Map<string, boolean> = new Map();

  constructor() {
    this.loadUserPreferences();
    this.initializeEnhancements();
  }

  private loadUserPreferences() {
    try {
      // SSG-safe localStorage access
      if (
        typeof window !== "undefined" &&
        typeof localStorage !== "undefined"
      ) {
        const stored = localStorage.getItem("enhancement-preferences");
        if (stored) {
          const prefs = JSON.parse(stored);
          Object.entries(prefs).forEach(([key, value]) => {
            this.userPreferences.set(key, value as boolean);
          });
        }
      }
    } catch (error) {
      console.warn("Could not load enhancement preferences:", error);
    }
  }

  private saveUserPreferences() {
    try {
      // SSG-safe localStorage access
      if (
        typeof window !== "undefined" &&
        typeof localStorage !== "undefined"
      ) {
        const prefs: Record<string, boolean> = {};
        this.userPreferences.forEach((value, key) => {
          prefs[key] = value;
        });
        localStorage.setItem("enhancement-preferences", JSON.stringify(prefs));
      }
    } catch (error) {
      console.warn("Could not save enhancement preferences:", error);
    }
  }

  private initializeEnhancements() {
    // Performance Enhancements
    this.addEnhancement({
      id: "lazy-loading",
      name: "Lazy Loading",
      description: "Load images and content as needed",
      category: "performance",
      priority: "high",
      dependencies: [],
      featureTest: () => "IntersectionObserver" in window,
      performanceTest: async () => {
        const navigation = performance.getEntriesByType(
          "navigation",
        )[0] as PerformanceNavigationTiming;
        return navigation
          ? navigation.loadEventEnd - navigation.loadEventStart < 2000
          : false;
      },
      userPreference: "enable-lazy-loading",
      apply: () => this.applyLazyLoading(),
      revert: () => this.revertLazyLoading(),
    });

    // UX Enhancements
    this.addEnhancement({
      id: "smooth-scroll",
      name: "Smooth Scrolling",
      description: "Enable smooth scrolling behavior",
      category: "ux",
      priority: "medium",
      dependencies: [],
      featureTest: () => "scrollBehavior" in document.documentElement.style,
      performanceTest: async () => true, // Smooth scroll doesn't significantly impact performance
      userPreference: "enable-smooth-scroll",
      apply: () => this.applySmoothScroll(),
      revert: () => this.revertSmoothScroll(),
    });

    // Accessibility Enhancements
    this.addEnhancement({
      id: "focus-indicators",
      name: "Focus Indicators",
      description: "Enhanced focus indicators for keyboard navigation",
      category: "accessibility",
      priority: "high",
      dependencies: [],
      featureTest: () => true, // CSS focus styles are always available
      performanceTest: async () => true, // CSS doesn't impact performance
      userPreference: "enable-focus-indicators",
      apply: () => this.applyFocusIndicators(),
      revert: () => this.revertFocusIndicators(),
    });

    // Feature Enhancements
    this.addEnhancement({
      id: "offline-support",
      name: "Offline Support",
      description: "Enable offline functionality with service worker",
      category: "feature",
      priority: "medium",
      dependencies: [],
      featureTest: () => "serviceWorker" in navigator,
      performanceTest: async () => true, // Service worker doesn't impact initial load
      userPreference: "enable-offline-support",
      apply: () => this.applyOfflineSupport(),
      revert: () => this.revertOfflineSupport(),
    });
  }

  private addEnhancement(config: EnhancementConfig) {
    this.enhancements.set(config.id, config);
    this.states.set(config.id, {
      enabled: false,
      applied: false,
      lastTested: 0,
      performanceScore: 0,
      userPreference: this.userPreferences.get(config.userPreference) ?? true,
    });
  }

  public async evaluateEnhancements(): Promise<void> {
    for (const [id, enhancement] of this.enhancements) {
      const state = this.states.get(id)!;

      try {
        // Check feature support
        const featureSupported = await enhancement.featureTest();

        // Check performance
        const performanceOk = await enhancement.performanceTest();

        // Check user preference
        const userWants = state.userPreference;

        // Check dependencies
        const dependenciesMet = enhancement.dependencies.every((depId) => {
          const depState = this.states.get(depId);
          return depState?.applied ?? false;
        });

        // Determine if enhancement should be applied
        const shouldApply =
          featureSupported && performanceOk && userWants && dependenciesMet;

        // Update state
        state.enabled = shouldApply;
        state.lastTested = Date.now();
        state.performanceScore = performanceOk ? 1 : 0;

        // Apply or revert enhancement
        if (shouldApply && !state.applied) {
          await enhancement.apply();
          state.applied = true;
        } else if (!shouldApply && state.applied) {
          await enhancement.revert();
          state.applied = false;
        }
      } catch (error) {
        console.warn(`Error evaluating enhancement ${id}:`, error);
        state.enabled = false;
        state.applied = false;
      }
    }
  }

  public setUserPreference(enhancementId: string, enabled: boolean): void {
    const enhancement = this.enhancements.get(enhancementId);
    if (!enhancement) return;

    const state = this.states.get(enhancementId)!;
    state.userPreference = enabled;
    this.userPreferences.set(enhancement.userPreference, enabled);
    this.saveUserPreferences();

    // Re-evaluate this enhancement
    this.evaluateEnhancements();
  }

  public getEnhancementStatus(): Record<string, EnhancementState> {
    const status: Record<string, EnhancementState> = {};
    this.states.forEach((state, id) => {
      status[id] = { ...state };
    });
    return status;
  }

  // Enhancement implementations
  private applyLazyLoading(): void {
    // Add lazy loading to images
    const images = document.querySelectorAll("img[data-src]");
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src!;
            img.classList.remove("lazy");
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach((img) => imageObserver.observe(img));
    }
  }

  private revertLazyLoading(): void {
    // Remove lazy loading
    const images = document.querySelectorAll("img[data-src]");
    images.forEach((img) => {
      const image = img as HTMLImageElement;
      if (image.dataset.src) {
        image.src = image.dataset.src;
      }
    });
  }

  private applySmoothScroll(): void {
    document.documentElement.style.scrollBehavior = "smooth";
  }

  private revertSmoothScroll(): void {
    document.documentElement.style.scrollBehavior = "auto";
  }

  private applyFocusIndicators(): void {
    document.body.classList.add("enhanced-focus");
  }

  private revertFocusIndicators(): void {
    document.body.classList.remove("enhanced-focus");
  }

  private applyOfflineSupport(): void {
    // Register service worker for offline support
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }

  private revertOfflineSupport(): void {
    // Unregister service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      });
    }
  }
}

// Global enhancement instance
export const progressiveEnhancement = new HybridProgressiveEnhancement();
