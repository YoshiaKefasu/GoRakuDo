/**
 * Localhost Performance Monitor for GoRakuDo Project
 * Google Engineering Team 2025 Approach
 * Target: Every page load under 10ms for localhost
 */

class LocalhostPerformanceMonitor {
  constructor() {
    this.targetLoadTime = 10; // 10ms target for localhost
    this.metrics = {};
    this.observers = [];
    this.init();
  }

  init() {
    // Monitor localhost page load performance
    this.observeLocalhostNavigationTiming();

    // Monitor Core Web Vitals for localhost
    this.observeLocalhostCoreWebVitals();

    // Monitor localhost resource loading
    this.observeLocalhostResourceTiming();

    // Monitor localhost long tasks
    this.observeLocalhostLongTasks();

    console.log("🚀 Localhost Performance Monitor initialized - Target: 10ms");
  }

  observeLocalhostNavigationTiming() {
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "navigation") {
            this.measureLocalhostPageLoad(entry);
          }
        }
      });

      observer.observe({ entryTypes: ["navigation"] });
      this.observers.push(observer);
    }
  }

  observeLocalhostCoreWebVitals() {
    if ("PerformanceObserver" in window) {
      // First Contentful Paint for localhost
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.measureLocalhostFCP(entry);
        }
      });
      fcpObserver.observe({ entryTypes: ["paint"] });
      this.observers.push(fcpObserver);

      // Largest Contentful Paint for localhost
      const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.measureLocalhostLCP(entry);
        }
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
      this.observers.push(lcpObserver);

      // First Input Delay for localhost
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.measureLocalhostFID(entry);
        }
      });
      fidObserver.observe({ entryTypes: ["first-input"] });
      this.observers.push(fidObserver);

      // Cumulative Layout Shift for localhost
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.measureLocalhostCLS(entry);
        }
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });
      this.observers.push(clsObserver);
    }
  }

  observeLocalhostResourceTiming() {
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "resource") {
            this.measureLocalhostResourceLoad(entry);
          }
        }
      });

      observer.observe({ entryTypes: ["resource"] });
      this.observers.push(observer);
    }
  }

  observeLocalhostLongTasks() {
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 10) {
            // Tasks longer than 10ms for localhost
            this.reportLocalhostLongTask(entry);
          }
        }
      });

      observer.observe({ entryTypes: ["longtask"] });
      this.observers.push(observer);
    }
  }

  measureLocalhostPageLoad(entry) {
    const loadTime = entry.loadEventEnd - entry.loadEventStart;
    const domContentLoaded =
      entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart;
    const firstPaint = entry.responseEnd - entry.fetchStart;

    this.metrics.pageLoad = {
      loadTime,
      domContentLoaded,
      firstPaint,
      targetMet: loadTime <= this.targetLoadTime,
      performance: this.getLocalhostPerformanceGrade(loadTime),
    };

    this.reportLocalhostMetrics("Localhost Page Load", {
      "Total Load Time": `${loadTime.toFixed(2)}ms`,
      "DOM Content Loaded": `${domContentLoaded.toFixed(2)}ms`,
      "First Paint": `${firstPaint.toFixed(2)}ms`,
      "Target Met": loadTime <= this.targetLoadTime ? "✅" : "❌",
    });
  }

  measureLocalhostFCP(entry) {
    if (entry.name === "first-contentful-paint") {
      this.metrics.fcp = {
        value: entry.startTime,
        targetMet: entry.startTime <= 500, // 500ms target for localhost
        performance: this.getLocalhostPerformanceGrade(entry.startTime),
      };

      this.reportLocalhostMetrics("Localhost First Contentful Paint", {
        FCP: `${entry.startTime.toFixed(2)}ms`,
        "Target Met": entry.startTime <= 500 ? "✅" : "❌",
      });
    }
  }

  measureLocalhostLCP(entry) {
    this.metrics.lcp = {
      value: entry.startTime,
      targetMet: entry.startTime <= 750, // 750ms target for localhost
      performance: this.getLocalhostPerformanceGrade(entry.startTime),
    };

    this.reportLocalhostMetrics("Localhost Largest Contentful Paint", {
      LCP: `${entry.startTime.toFixed(2)}ms`,
      "Target Met": entry.startTime <= 750 ? "✅" : "❌",
    });
  }

  measureLocalhostFID(entry) {
    this.metrics.fid = {
      value: entry.processingStart - entry.startTime,
      targetMet: entry.processingStart - entry.startTime <= 50, // 50ms target for localhost
      performance: this.getLocalhostPerformanceGrade(
        entry.processingStart - entry.startTime,
      ),
    };

    this.reportLocalhostMetrics("Localhost First Input Delay", {
      FID: `${(entry.processingStart - entry.startTime).toFixed(2)}ms`,
      "Target Met": entry.processingStart - entry.startTime <= 50 ? "✅" : "❌",
    });
  }

  measureLocalhostCLS(entry) {
    if (!this.metrics.cls) {
      this.metrics.cls = { value: 0, entries: [] };
    }

    this.metrics.cls.entries.push(entry);
    this.metrics.cls.value = this.calculateLocalhostCLS(
      this.metrics.cls.entries,
    );
    this.metrics.cls.targetMet = this.metrics.cls.value <= 0.05; // 0.05 target for localhost

    this.reportLocalhostMetrics("Localhost Cumulative Layout Shift", {
      CLS: this.metrics.cls.value.toFixed(3),
      "Target Met": this.metrics.cls.value <= 0.05 ? "✅" : "❌",
    });
  }

  calculateLocalhostCLS(entries) {
    let cls = 0;
    for (const entry of entries) {
      if (!entry.hadRecentInput) {
        cls += entry.value;
      }
    }
    return cls;
  }

  measureLocalhostResourceLoad(entry) {
    const loadTime = entry.responseEnd - entry.fetchStart;

    if (loadTime > 50) {
      // Report slow resources for localhost
      this.reportLocalhostMetrics("Localhost Slow Resource", {
        Resource: entry.name,
        "Load Time": `${loadTime.toFixed(2)}ms`,
        Size: `${(entry.transferSize / 1024).toFixed(2)}KB`,
      });
    }
  }

  reportLocalhostLongTask(entry) {
    this.reportLocalhostMetrics("Localhost Long Task Detected", {
      Duration: `${entry.duration.toFixed(2)}ms`,
      "Start Time": `${entry.startTime.toFixed(2)}ms`,
    });
  }

  getLocalhostPerformanceGrade(value) {
    if (value <= 5) return "EXCELLENT";
    if (value <= 10) return "GOOD";
    if (value <= 15) return "ACCEPTABLE";
    if (value <= 25) return "NEEDS IMPROVEMENT";
    return "CRITICAL";
  }

  reportLocalhostMetrics(category, data) {
    const timestamp = new Date().toISOString();
    const report = {
      timestamp,
      category,
      data,
      url: window.location.href,
      environment: "localhost",
    };

    // Console reporting for localhost
    console.group(`📊 ${category} (localhost)`);
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
    this.sendLocalhostToAnalytics(report);
  }

  sendLocalhostToAnalytics(report) {
    // Send to Google Analytics or other analytics service
    if (typeof gtag !== "undefined") {
      gtag("event", "localhost_performance_metric", {
        event_category: report.category,
        event_label: report.url,
        value: Object.values(report.data)[0],
        environment: "localhost",
      });
    }
  }

  getLocalhostSummary() {
    const summary = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      targetLoadTime: this.targetLoadTime,
      environment: "localhost",
      metrics: this.metrics,
      overall: this.calculateLocalhostOverallScore(),
    };

    return summary;
  }

  calculateLocalhostOverallScore() {
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

// Initialize localhost performance monitor when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.localhostPerformanceMonitor = new LocalhostPerformanceMonitor();
  });
} else {
  window.localhostPerformanceMonitor = new LocalhostPerformanceMonitor();
}

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = LocalhostPerformanceMonitor;
}
