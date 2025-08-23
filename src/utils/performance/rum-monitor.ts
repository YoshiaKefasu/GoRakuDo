/**
 * Real User Monitoring (RUM) System
 * Google Engineering Team 2025 Standards
 *
 * Purpose: Comprehensive performance monitoring and analytics
 * Benefits: Real-time performance insights, user experience optimization
 */

export interface RUMEvent {
  timestamp: number;
  type:
    | "navigation"
    | "resource"
    | "paint"
    | "largest-contentful-paint"
    | "first-input"
    | "layout-shift"
    | "custom";
  name: string;
  value?: number;
  metadata?: Record<string, any>;
}

export interface RUMNavigationTiming {
  navigationStart: number;
  unloadEventStart: number;
  unloadEventEnd: number;
  redirectStart: number;
  redirectEnd: number;
  fetchStart: number;
  domainLookupStart: number;
  domainLookupEnd: number;
  connectStart: number;
  connectEnd: number;
  secureConnectionStart: number;
  requestStart: number;
  responseStart: number;
  responseEnd: number;
  domLoading: number;
  domInteractive: number;
  domContentLoadedEventStart: number;
  domContentLoadedEventEnd: number;
  domComplete: number;
  loadEventStart: number;
  loadEventEnd: number;
}

export interface RUMPerformanceMetrics {
  // Core Web Vitals
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  fcp: number; // First Contentful Paint

  // Navigation Timing
  navigationTiming: RUMNavigationTiming;

  // Resource Timing
  resourceTiming: PerformanceResourceTiming[];

  // Custom Metrics
  customMetrics: Record<string, number>;

  // User Experience
  userAgent: string;
  viewport: { width: number; height: number };
  connection: string;
  deviceMemory?: number;
  hardwareConcurrency?: number;
}

/**
 * Real User Monitoring Class
 * Comprehensive performance monitoring and analytics
 */
export class RUMMonitor {
  private static instance: RUMMonitor;
  private events: RUMEvent[] = [];
  private observers: Map<string, PerformanceObserver> = new Map();
  private isInitialized: boolean = false;
  private sessionId: string;
  private userId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = this.generateUserId();
  }

  static getInstance(): RUMMonitor {
    if (!RUMMonitor.instance) {
      RUMMonitor.instance = new RUMMonitor();
    }
    return RUMMonitor.instance;
  }

  /**
   * Initialize RUM monitoring
   * Sets up all performance observers and event listeners
   */
  initialize(): void {
    if (this.isInitialized) return;

    console.log("🚀 Initializing Real User Monitoring (RUM)...");

    // Set up Core Web Vitals monitoring
    this.setupCoreWebVitals();

    // Set up Navigation Timing monitoring
    this.setupNavigationTiming();

    // Set up Resource Timing monitoring
    this.setupResourceTiming();

    // Set up Paint Timing monitoring
    this.setupPaintTiming();

    // Set up Layout Shift monitoring
    this.setupLayoutShift();

    // Set up First Input monitoring
    this.setupFirstInput();

    // Set up custom performance monitoring
    this.setupCustomMonitoring();

    this.isInitialized = true;
    console.log("✅ RUM monitoring initialized successfully");
  }

  /**
   * Set up Core Web Vitals monitoring
   */
  private setupCoreWebVitals(): void {
    // Largest Contentful Paint (LCP)
    if ("PerformanceObserver" in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;

          this.addEvent({
            timestamp: Date.now(),
            type: "largest-contentful-paint",
            name: "LCP",
            value: lastEntry.startTime,
            metadata: {
              element: lastEntry.element?.tagName,
              url: lastEntry.url,
              size: lastEntry.size,
            },
          });
        });

        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
        this.observers.set("lcp", lcpObserver);
      } catch (error) {
        console.warn("LCP monitoring not supported:", error);
      }
    }
  }

  /**
   * Set up Navigation Timing monitoring
   */
  private setupNavigationTiming(): void {
    if ("performance" in window && "navigation" in performance) {
      const navigation = performance.getEntriesByType("navigation")[0] as any;

      if (navigation) {
        this.addEvent({
          timestamp: Date.now(),
          type: "navigation",
          name: "NavigationTiming",
          metadata: {
            dnsLookup:
              navigation.domainLookupEnd - navigation.domainLookupStart,
            tcpConnection: navigation.connectEnd - navigation.connectStart,
            serverResponse: navigation.responseEnd - navigation.requestStart,
            domContentLoaded:
              navigation.domContentLoadedEventEnd - navigation.navigationStart,
            loadComplete: navigation.loadEventEnd - navigation.navigationStart,
            totalTime: navigation.loadEventEnd - navigation.navigationStart,
          },
        });
      }
    }
  }

  /**
   * Set up Resource Timing monitoring
   */
  private setupResourceTiming(): void {
    if ("PerformanceObserver" in window) {
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries() as PerformanceResourceTiming[];

          entries.forEach((entry) => {
            // Only track resources that took significant time
            if (entry.duration > 100) {
              this.addEvent({
                timestamp: Date.now(),
                type: "resource",
                name: "ResourceTiming",
                value: entry.duration,
                metadata: {
                  name: entry.name,
                  initiatorType: entry.initiatorType,
                  transferSize: entry.transferSize,
                  decodedBodySize: entry.decodedBodySize,
                  dnsLookup: entry.domainLookupEnd - entry.domainLookupStart,
                  tcpConnection: entry.connectEnd - entry.connectStart,
                  serverResponse: entry.responseEnd - entry.requestStart,
                },
              });
            }
          });
        });

        resourceObserver.observe({ entryTypes: ["resource"] });
        this.observers.set("resource", resourceObserver);
      } catch (error) {
        console.warn("Resource timing monitoring not supported:", error);
      }
    }
  }

  /**
   * Set up Paint Timing monitoring
   */
  private setupPaintTiming(): void {
    if ("PerformanceObserver" in window) {
      try {
        const paintObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();

          entries.forEach((entry) => {
            this.addEvent({
              timestamp: Date.now(),
              type: "paint",
              name: entry.name,
              value: entry.startTime,
            });
          });
        });

        paintObserver.observe({ entryTypes: ["paint"] });
        this.observers.set("paint", paintObserver);
      } catch (error) {
        console.warn("Paint timing monitoring not supported:", error);
      }
    }
  }

  /**
   * Set up Layout Shift monitoring
   */
  private setupLayoutShift(): void {
    if ("PerformanceObserver" in window) {
      try {
        const layoutShiftObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries() as any[];

          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              this.addEvent({
                timestamp: Date.now(),
                type: "layout-shift",
                name: "LayoutShift",
                value: entry.value,
                metadata: {
                  sources: entry.sources?.map((source: any) => ({
                    node: source.node?.tagName,
                    currentRect: source.currentRect,
                    previousRect: source.previousRect,
                  })),
                },
              });
            }
          });
        });

        layoutShiftObserver.observe({ entryTypes: ["layout-shift"] });
        this.observers.set("layout-shift", layoutShiftObserver);
      } catch (error) {
        console.warn("Layout shift monitoring not supported:", error);
      }
    }
  }

  /**
   * Set up First Input monitoring
   */
  private setupFirstInput(): void {
    if ("PerformanceObserver" in window) {
      try {
        const firstInputObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();

          entries.forEach((entry) => {
            const firstInputEntry = entry as any;
            this.addEvent({
              timestamp: Date.now(),
              type: "first-input",
              name: "FirstInput",
              value:
                firstInputEntry.processingStart - firstInputEntry.startTime,
              metadata: {
                type: firstInputEntry.name,
                target: firstInputEntry.target?.tagName,
              },
            });
          });
        });

        firstInputObserver.observe({ entryTypes: ["first-input"] });
        this.observers.set("first-input", firstInputObserver);
      } catch (error) {
        console.warn("First input monitoring not supported:", error);
      }
    }
  }

  /**
   * Set up custom performance monitoring
   */
  private setupCustomMonitoring(): void {
    // Monitor long tasks
    if ("PerformanceObserver" in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();

          entries.forEach((entry) => {
            this.addEvent({
              timestamp: Date.now(),
              type: "custom",
              name: "LongTask",
              value: entry.duration,
              metadata: {
                startTime: entry.startTime,
                endTime: entry.startTime + entry.duration,
              },
            });
          });
        });

        longTaskObserver.observe({ entryTypes: ["longtask"] });
        this.observers.set("longtask", longTaskObserver);
      } catch (error) {
        console.warn("Long task monitoring not supported:", error);
      }
    }

    // Monitor memory usage
    if ("memory" in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.addEvent({
          timestamp: Date.now(),
          type: "custom",
          name: "MemoryUsage",
          metadata: {
            usedJSHeapSize: memory.usedJSHeapSize,
            totalJSHeapSize: memory.totalJSHeapSize,
            jsHeapSizeLimit: memory.jsHeapSizeLimit,
          },
        });
      }, 30000); // Every 30 seconds
    }
  }

  /**
   * Add custom performance event
   * @param event Custom performance event
   */
  addCustomEvent(
    name: string,
    value?: number,
    metadata?: Record<string, any>,
  ): void {
    this.addEvent({
      timestamp: Date.now(),
      type: "custom",
      name,
      value,
      metadata,
    });
  }

  /**
   * Add performance event to tracking
   * @param event Performance event
   */
  private addEvent(event: RUMEvent): void {
    this.events.push(event);

    // Keep only last 1000 events to prevent memory issues
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
  }

  /**
   * Get comprehensive performance metrics
   * @returns Performance metrics object
   */
  getPerformanceMetrics(): RUMPerformanceMetrics {
    const navigation = performance.getEntriesByType("navigation")[0] as any;
    const resources = performance.getEntriesByType(
      "resource",
    ) as PerformanceResourceTiming[];

    // Calculate Core Web Vitals
    const lcpEvents = this.events.filter(
      (e) => e.type === "largest-contentful-paint",
    );
    const fidEvents = this.events.filter((e) => e.type === "first-input");
    const clsEvents = this.events.filter((e) => e.type === "layout-shift");

    const lcp =
      lcpEvents.length > 0
        ? Math.max(...lcpEvents.map((e) => e.value || 0))
        : 0;
    const fid =
      fidEvents.length > 0
        ? Math.min(...fidEvents.map((e) => e.value || 0))
        : 0;
    const cls = clsEvents.reduce((sum, e) => sum + (e.value || 0), 0);

    return {
      lcp,
      fid,
      cls,
      ttfb: navigation ? navigation.responseStart - navigation.requestStart : 0,
      fcp: 0, // Will be populated by paint timing
      navigationTiming: navigation
        ? {
            navigationStart: navigation.navigationStart,
            unloadEventStart: navigation.unloadEventStart,
            unloadEventEnd: navigation.unloadEventEnd,
            redirectStart: navigation.redirectStart,
            redirectEnd: navigation.redirectEnd,
            fetchStart: navigation.fetchStart,
            domainLookupStart: navigation.domainLookupStart,
            domainLookupEnd: navigation.domainLookupEnd,
            connectStart: navigation.connectStart,
            connectEnd: navigation.connectEnd,
            secureConnectionStart: navigation.secureConnectionStart,
            requestStart: navigation.requestStart,
            responseStart: navigation.responseStart,
            responseEnd: navigation.responseEnd,
            domLoading: navigation.domLoading,
            domInteractive: navigation.domInteractive,
            domContentLoadedEventStart: navigation.domContentLoadedEventStart,
            domContentLoadedEventEnd: navigation.domContentLoadedEventEnd,
            domComplete: navigation.domComplete,
            loadEventStart: navigation.loadEventStart,
            loadEventEnd: navigation.loadEventEnd,
          }
        : ({} as RUMNavigationTiming),
      resourceTiming: resources,
      customMetrics: {},
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      connection: (navigator as any).connection?.effectiveType || "unknown",
      deviceMemory: (navigator as any).deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
    };
  }

  /**
   * Get performance report for analytics
   * @returns Performance report object
   */
  getPerformanceReport(): {
    sessionId: string;
    userId: string;
    timestamp: number;
    metrics: RUMPerformanceMetrics;
    events: RUMEvent[];
  } {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: Date.now(),
      metrics: this.getPerformanceMetrics(),
      events: this.events,
    };
  }

  /**
   * Send performance data to analytics service
   * @param endpoint Analytics endpoint URL
   */
  async sendToAnalytics(endpoint: string): Promise<void> {
    try {
      const report = this.getPerformanceReport();

      await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(report),
      });

      console.log("📊 Performance data sent to analytics");
    } catch (error) {
      console.error("Failed to send performance data:", error);
    }
  }

  /**
   * Clean up observers and resources
   */
  destroy(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
    this.events = [];
    this.isInitialized = false;
  }

  /**
   * Generate unique session ID
   * @returns Session ID string
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique user ID
   * @returns User ID string
   */
  private generateUserId(): string {
    let userId = localStorage.getItem("rum_user_id");
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("rum_user_id", userId);
    }
    return userId;
  }
}

export default RUMMonitor;
