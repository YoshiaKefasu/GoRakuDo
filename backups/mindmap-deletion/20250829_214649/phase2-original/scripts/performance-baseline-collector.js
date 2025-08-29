/**
 * Performance Baseline Collector Script
 * Collects performance baseline data for the tools page
 *
 * Usage: Include this script in the tools page to automatically collect baseline data
 */

(function () {
  "use strict";

  // Wait for page to load completely
  window.addEventListener("load", async function () {
    console.log("🚀 Starting performance baseline collection...");

    // Wait additional time for all content and animations to load
    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      // Import the baseline monitor
      const { performanceBaselineMonitor } = await import(
        "../utils/performance/performance-baseline-monitor.ts"
      );

      // Establish baseline
      const baseline = await performanceBaselineMonitor.establishBaseline();

      // Display results in console
      console.log("📊 BASELINE PERFORMANCE REPORT 📊");
      console.log("=====================================");
      console.log(`URL: ${baseline.url}`);
      console.log(`Timestamp: ${baseline.timestamp}`);
      console.log("");

      console.log("🎯 Core Web Vitals:");
      console.log(`  - LCP: ${baseline.coreWebVitals.lcp.toFixed(2)}ms`);
      console.log(`  - FID: ${baseline.coreWebVitals.fid.toFixed(2)}ms`);
      console.log(`  - CLS: ${baseline.coreWebVitals.cls.toFixed(4)}`);
      console.log(`  - FCP: ${baseline.coreWebVitals.fcp.toFixed(2)}ms`);
      console.log("");

      console.log("🎬 Animation Metrics:");
      console.log(
        `  - Average FPS: ${baseline.animationMetrics.averageFps.toFixed(1)}`,
      );
      console.log(`  - Frame Drops: ${baseline.animationMetrics.frameDrops}`);
      console.log(
        `  - Memory Usage: ${baseline.animationMetrics.memoryUsage.toFixed(1)}MB`,
      );
      console.log("");

      console.log("📦 Bundle Metrics:");
      console.log(
        `  - Total Size: ${baseline.bundleMetrics.totalSize.toFixed(1)}KB`,
      );
      console.log(
        `  - CSS Size: ${baseline.bundleMetrics.cssSize.toFixed(1)}KB`,
      );
      console.log(`  - JS Size: ${baseline.bundleMetrics.jsSize.toFixed(1)}KB`);
      console.log("");

      console.log("📄 Page Metrics:");
      console.log(
        `  - Load Time: ${baseline.pageMetrics.loadTime.toFixed(2)}ms`,
      );
      console.log(
        `  - DOM Content Loaded: ${baseline.pageMetrics.domContentLoaded.toFixed(2)}ms`,
      );
      console.log(
        `  - First Paint: ${baseline.pageMetrics.firstPaint.toFixed(2)}ms`,
      );
      console.log("");

      // Export data to global scope for easy access
      window.performanceBaseline = baseline;

      // Also save as JSON file download (for development)
      const dataStr = JSON.stringify(baseline, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `baseline-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log("💾 Baseline data saved to downloads folder");
      console.log("=====================================");

      // Check for performance issues
      const issues = [];

      if (baseline.coreWebVitals.lcp > 2000) {
        issues.push(
          `⚠️ LCP too high: ${baseline.coreWebVitals.lcp.toFixed(2)}ms (target: <2000ms)`,
        );
      }
      if (baseline.coreWebVitals.fid > 100) {
        issues.push(
          `⚠️ FID too high: ${baseline.coreWebVitals.fid.toFixed(2)}ms (target: <100ms)`,
        );
      }
      if (baseline.coreWebVitals.cls > 0.1) {
        issues.push(
          `⚠️ CLS too high: ${baseline.coreWebVitals.cls.toFixed(4)} (target: <0.1)`,
        );
      }
      if (baseline.animationMetrics.averageFps < 55) {
        issues.push(
          `⚠️ FPS too low: ${baseline.animationMetrics.averageFps.toFixed(1)} (target: >55)`,
        );
      }
      if (baseline.animationMetrics.memoryUsage > 100) {
        issues.push(
          `⚠️ Memory usage high: ${baseline.animationMetrics.memoryUsage.toFixed(1)}MB (target: <100MB)`,
        );
      }

      if (issues.length > 0) {
        console.log("🚨 PERFORMANCE ISSUES DETECTED:");
        issues.forEach((issue) => console.log(`  ${issue}`));
      } else {
        console.log("✅ All performance metrics within acceptable ranges");
      }

      console.log("✅ Performance baseline collection complete!");
    } catch (error) {
      console.error("❌ Error collecting performance baseline:", error);
    }
  });

  // Also collect data on page unload to measure full session
  window.addEventListener("beforeunload", function () {
    try {
      if (window.performanceBaselineMonitor) {
        const comparison =
          window.performanceBaselineMonitor.compareAgainstBaseline();
        console.log("📊 SESSION PERFORMANCE COMPARISON:");
        console.log("===================================");

        if (comparison.regressions.length > 0) {
          console.log("🚨 REGRESSIONS DETECTED:");
          comparison.regressions.forEach((regression) =>
            console.log(`  ${regression}`),
          );
        } else {
          console.log("✅ No significant regressions detected");
        }

        // Export comparison data
        window.performanceComparison = comparison;
      }
    } catch (error) {
      console.error("Error during performance comparison:", error);
    }
  });
})();
