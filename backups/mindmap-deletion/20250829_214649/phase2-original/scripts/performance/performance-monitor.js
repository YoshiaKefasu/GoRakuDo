/**
 * Performance Monitor for GoRakuDo Project
 * Google Engineering Team 2025 Approach
 * Target: Every page load under 30ms
 */

class PerformanceMonitor {
  constructor() {
    this.targetLoadTime = 30; // 30ms target
    this.metrics = {};
    this.observers = [];
    this.init();
  }

  init() {
    // Monitor page load performance
    this.observeNavigationTiming();

    // Monitor Core Web Vitals
    this.observeCoreWebVitals();

    // Monitor resource loading
    this.observeResourceTiming();

    // Monitor long tasks
    this.observeLongTasks();

    console.log("🚀 Performance Monitor initialized - Target: 30ms");
  }

  observeNavigationTiming() {
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "navigation") {
            this.measurePageLoad(entry);
          }
        }
      });

      observer.observe({ entryTypes: ["navigation"] });
      this.observers.push(observer);
    }
  }

  observeCoreWebVitals() {
    if ("PerformanceObserver" in window) {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.measureFCP(entry);
        }
      });
      fcpObserver.observe({ entryTypes: ["paint"] });
      this.observers.push(fcpObserver);

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.measureLCP(entry);
        }
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
      this.observers.push(lcpObserver);

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.measureFID(entry);
        }
      });
      fidObserver.observe({ entryTypes: ["first-input"] });
      this.observers.push(fidObserver);

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.measureCLS(entry);
        }
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });
      this.observers.push(clsObserver);
    }
  }

  observeResourceTiming() {
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "resource") {
            this.measureResourceLoad(entry);
          }
        }
      });

      observer.observe({ entryTypes: ["resource"] });
      this.observers.push(observer);
    }
  }

  observeLongTasks() {
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            // Tasks longer than 50ms
            this.reportLongTask(entry);
          }
        }
      });

      observer.observe({ entryTypes: ["longtask"] });
      this.observers.push(observer);
    }
  }

  measurePageLoad(entry) {
    const loadTime = entry.loadEventEnd - entry.loadEventStart;
    const domContentLoaded =
      entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart;
    const firstPaint = entry.responseEnd - entry.fetchStart;

    this.metrics.pageLoad = {
      loadTime,
      domContentLoaded,
      firstPaint,
      targetMet: loadTime <= this.targetLoadTime,
      performance: this.getPerformanceGrade(loadTime),
    };

    this.reportMetrics("Page Load", {
      "Total Load Time": `${loadTime.toFixed(2)}ms`,
      "DOM Content Loaded": `${domContentLoaded.toFixed(2)}ms`,
      "First Paint": `${firstPaint.toFixed(2)}ms`,
      "Target Met": loadTime <= this.targetLoadTime ? "✅" : "❌",
    });
  }

  measureFCP(entry) {
    if (entry.name === "first-contentful-paint") {
      this.metrics.fcp = {
        value: entry.startTime,
        targetMet: entry.startTime <= 1000, // 1s target
        performance: this.getPerformanceGrade(entry.startTime),
      };

      this.reportMetrics("First Contentful Paint", {
        FCP: `${entry.startTime.toFixed(2)}ms`,
        "Target Met": entry.startTime <= 1000 ? "✅" : "❌",
      });
    }
  }

  measureLCP(entry) {
    this.metrics.lcp = {
      value: entry.startTime,
      targetMet: entry.startTime <= 1500, // 1.5s target
      performance: this.getPerformanceGrade(entry.startTime),
    };

    this.reportMetrics("Largest Contentful Paint", {
      LCP: `${entry.startTime.toFixed(2)}ms`,
      "Target Met": entry.startTime <= 1500 ? "✅" : "❌",
    });
  }

  measureFID(entry) {
    this.metrics.fid = {
      value: entry.processingStart - entry.startTime,
      targetMet: entry.processingStart - entry.startTime <= 100, // 100ms target
      performance: this.getPerformanceGrade(
        entry.processingStart - entry.startTime,
      ),
    };

    this.reportMetrics("First Input Delay", {
      FID: `${(entry.processingStart - entry.startTime).toFixed(2)}ms`,
      "Target Met":
        entry.processingStart - entry.startTime <= 100 ? "✅" : "❌",
    });
  }

  measureCLS(entry) {
    if (!this.metrics.cls) {
      this.metrics.cls = { value: 0, entries: [] };
    }

    this.metrics.cls.entries.push(entry);
    this.metrics.cls.value = this.calculateCLS(this.metrics.cls.entries);
    this.metrics.cls.targetMet = this.metrics.cls.value <= 0.1; // 0.1 target

    this.reportMetrics("Cumulative Layout Shift", {
      CLS: this.metrics.cls.value.toFixed(3),
      "Target Met": this.metrics.cls.value <= 0.1 ? "✅" : "❌",
    });
  }

  calculateCLS(entries) {
    let cls = 0;
    for (const entry of entries) {
      if (!entry.hadRecentInput) {
        cls += entry.value;
      }
    }
    return cls;
  }

  measureResourceLoad(entry) {
    const loadTime = entry.responseEnd - entry.fetchStart;

    if (loadTime > 100) {
      // Report slow resources
      this.reportMetrics("Slow Resource", {
        Resource: entry.name,
        "Load Time": `${loadTime.toFixed(2)}ms`,
        Size: `${(entry.transferSize / 1024).toFixed(2)}KB`,
      });
    }
  }

  reportLongTask(entry) {
    this.reportMetrics("Long Task Detected", {
      Duration: `${entry.duration.toFixed(2)}ms`,
      "Start Time": `${entry.startTime.toFixed(2)}ms`,
    });
  }

  getPerformanceGrade(value) {
    if (value <= 10) return "EXCELLENT";
    if (value <= 20) return "GOOD";
    if (value <= 30) return "ACCEPTABLE";
    if (value <= 50) return "NEEDS IMPROVEMENT";
    return "CRITICAL";
  }

  reportMetrics(category, data) {
    const timestamp = new Date().toISOString();
    const report = {
      timestamp,
      category,
      data,
      url: window.location.href,
    };

    // Console reporting
    console.group(`📊 ${category}`);
    Object.entries(data).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
    console.groupEnd();

    // Store for analysis
    if (!this.metrics.reports) {
      this.metrics.reports = [];
    }
    this.metrics.reports.push(report);

    // Send to analytics if available
    this.sendToAnalytics(report);
  }

  sendToAnalytics(report) {
    // Send to Google Analytics or other analytics service
    if (typeof gtag !== "undefined") {
      gtag("event", "performance_metric", {
        event_category: report.category,
        event_label: report.url,
        value: Object.values(report.data)[0],
      });
    }
  }

  getSummary() {
    const summary = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      targetLoadTime: this.targetLoadTime,
      metrics: this.metrics,
      overall: this.calculateOverallScore(),
    };

    return summary;
  }

  calculateOverallScore() {
    const scores = [];

    if (this.metrics.pageLoad) {
      scores.push(this.metrics.pageLoad.targetMet ? 100 : 0);
    }
    if (this.metrics.fcp) {
      scores.push(this.metrics.fcp.targetMet ? 100 : 0);
    }
    if (this.metrics.lcp) {
      scores.push(this.metrics.lcp.targetMet ? 100 : 0);
    }
    if (this.metrics.fid) {
      scores.push(this.metrics.fid.targetMet ? 100 : 0);
    }
    if (this.metrics.cls) {
      scores.push(this.metrics.cls.targetMet ? 100 : 0);
    }

    return scores.length > 0
      ? scores.reduce((a, b) => a + b) / scores.length
      : 0;
  }

  disconnect() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

// Initialize performance monitor when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.performanceMonitor = new PerformanceMonitor();
  });
} else {
  window.performanceMonitor = new PerformanceMonitor();
}

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = PerformanceMonitor;
}
