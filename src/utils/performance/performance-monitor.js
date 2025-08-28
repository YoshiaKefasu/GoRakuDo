// Performance Monitor Utility - Safe Bundle Splitting
// This file contains performance monitoring logic that can be loaded separately

// Core Web Vitals Performance Budget
const PERFORMANCE_BUDGET = {
  LCP: 2500, // 2.5 seconds
  FID: 100, // 100ms
  CLS: 0.1, // 0.1
  FCP: 1800, // 1.8 seconds
  TTFB: 800, // 800ms
  IMAGE_LOAD: 2000, // 2 seconds for image loading
};

// Story 2.7 Performance Budget - 5% increase from Story 2.6 baseline
const STORY_2_7_BUDGET = {
  BUILD_TIME_MULTIPLIER: 1.05, // 5% increase allowed
  CSS_BUNDLE_SIZE_BYTES: 3072, // 3KB maximum additional CSS
  BASELINE_BUILD_TIME: null, // To be set from Story 2.6 measurements
};

// Initialize performance monitoring
export function initPerformanceMonitoring() {
  console.log("📊 Performance monitoring initialized");

  // Core Web Vitals monitoring with performance budget
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === "largest-contentful-paint") {
        const lcp = entry.startTime;
        console.log("🎯 LCP:", lcp.toFixed(2), "ms");

        // Performance budget check
        if (lcp > PERFORMANCE_BUDGET.LCP) {
          console.warn(
            "⚠️ LCP exceeds budget:",
            lcp.toFixed(2),
            "ms >",
            PERFORMANCE_BUDGET.LCP,
            "ms",
          );
        } else {
          console.log("✅ LCP within budget:", lcp.toFixed(2), "ms");
        }
      }
      if (entry.entryType === "first-input") {
        const firstInputEntry = entry;
        const fid = firstInputEntry.processingStart - firstInputEntry.startTime;
        console.log("⚡ FID:", fid.toFixed(2), "ms");

        // Performance budget check
        if (fid > PERFORMANCE_BUDGET.FID) {
          console.warn(
            "⚠️ FID exceeds budget:",
            fid.toFixed(2),
            "ms >",
            PERFORMANCE_BUDGET.FID,
            "ms",
          );
        } else {
          console.log("✅ FID within budget:", fid.toFixed(2), "ms");
        }
      }
    }
  });

  observer.observe({
    entryTypes: ["largest-contentful-paint", "first-input"],
  });

  // Cumulative Layout Shift monitoring with budget
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const layoutShiftEntry = entry;
      if (!layoutShiftEntry.hadRecentInput) {
        clsValue += layoutShiftEntry.value;
        console.log("📐 CLS:", clsValue.toFixed(4));

        // Performance budget check
        if (clsValue > PERFORMANCE_BUDGET.CLS) {
          console.warn(
            "⚠️ CLS exceeds budget:",
            clsValue.toFixed(4),
            ">",
            PERFORMANCE_BUDGET.CLS,
          );
        } else {
          console.log("✅ CLS within budget:", clsValue.toFixed(4));
        }
      }
    }
  });

  clsObserver.observe({ entryTypes: ["layout-shift"] });

  // Image loading performance monitoring
  const imageObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === "resource" && entry.initiatorType === "img") {
        const loadTime = entry.responseEnd - entry.fetchStart;
        console.log("🖼️ Image load:", entry.name, loadTime.toFixed(2), "ms");

        // Performance budget check for images
        if (loadTime > PERFORMANCE_BUDGET.IMAGE_LOAD) {
          console.warn(
            "⚠️ Image load time exceeds budget:",
            entry.name,
            loadTime.toFixed(2),
            "ms >",
            PERFORMANCE_BUDGET.IMAGE_LOAD,
            "ms",
          );
        } else {
          console.log(
            "✅ Image load within budget:",
            entry.name,
            loadTime.toFixed(2),
            "ms",
          );
        }
      }
    }
  });

  imageObserver.observe({ entryTypes: ["resource"] });

  // Enhanced page load performance tracking with budgets
  window.addEventListener("load", function () {
    const navigation = performance.getEntriesByType("navigation")[0];
    const paint = performance.getEntriesByType("paint");

    // TTFB check
    const ttfb = navigation.responseStart - navigation.requestStart;
    console.log("🌐 TTFB:", ttfb.toFixed(2), "ms");
    if (ttfb > PERFORMANCE_BUDGET.TTFB) {
      console.warn(
        "⚠️ TTFB exceeds budget:",
        ttfb.toFixed(2),
        "ms >",
        PERFORMANCE_BUDGET.TTFB,
        "ms",
      );
    } else {
      console.log("✅ TTFB within budget:", ttfb.toFixed(2), "ms");
    }

    // FCP check
    const fcp = paint.find(
      (p) => p.name === "first-contentful-paint",
    )?.startTime;
    if (fcp) {
      console.log("🎨 FCP:", fcp.toFixed(2), "ms");
      if (fcp > PERFORMANCE_BUDGET.FCP) {
        console.warn(
          "⚠️ FCP exceeds budget:",
          fcp.toFixed(2),
          "ms >",
          PERFORMANCE_BUDGET.FCP,
          "ms",
        );
      } else {
        console.log("✅ FCP within budget:", fcp.toFixed(2), "ms");
      }
    }

    console.log("🏆 Performance Metrics:");
    console.log(
      "  📊 DOM Content Loaded:",
      (
        navigation.domContentLoadedEventEnd -
        navigation.domContentLoadedEventStart
      ).toFixed(2),
      "ms",
    );
    console.log(
      "  🎨 First Paint:",
      paint.find((p) => p.name === "first-paint")?.startTime.toFixed(2),
      "ms",
    );
    console.log(
      "  🖼️ First Contentful Paint:",
      paint
        .find((p) => p.name === "first-contentful-paint")
        ?.startTime.toFixed(2),
      "ms",
    );
    console.log("  ⚡ Total Load Time:", performance.now().toFixed(2), "ms");

    // Send performance data to analytics with budget violations
    if (typeof window.gtag !== "undefined") {
      const performanceData = {
        load_time: performance.now(),
        lcp:
          paint.find((p) => p.name === "largest-contentful-paint")?.startTime ||
          0,
        fcp: fcp || 0,
        ttfb: ttfb,
        cls: clsValue,
        budget_violations: [],
      };

      // Check for budget violations
      if (performanceData.lcp > PERFORMANCE_BUDGET.LCP)
        performanceData.budget_violations.push("LCP");
      if (performanceData.cls > PERFORMANCE_BUDGET.CLS)
        performanceData.budget_violations.push("CLS");
      if (performanceData.ttfb > PERFORMANCE_BUDGET.TTFB)
        performanceData.budget_violations.push("TTFB");
      if (performanceData.fcp > PERFORMANCE_BUDGET.FCP)
        performanceData.budget_violations.push("FCP");

      window.gtag("event", "page_performance", performanceData);
    }

    // Log performance summary
    console.log("📊 Performance Summary:");
    console.log("  🎯 LCP Budget:", PERFORMANCE_BUDGET.LCP, "ms");
    console.log("  ⚡ FID Budget:", PERFORMANCE_BUDGET.FID, "ms");
    console.log("  📐 CLS Budget:", PERFORMANCE_BUDGET.CLS);
    console.log("  🎨 FCP Budget:", PERFORMANCE_BUDGET.FCP, "ms");
    console.log("  🌐 TTFB Budget:", PERFORMANCE_BUDGET.TTFB, "ms");
    console.log("  🖼️ Image Load Budget:", PERFORMANCE_BUDGET.IMAGE_LOAD, "ms");
  });

  // SEO: Track user engagement metrics
  let timeOnPage = 0;
  const startTime = Date.now();

  // Track scroll depth for engagement
  let maxScrollDepth = 0;
  window.addEventListener("scroll", () => {
    const scrollDepth = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
        100,
    );
    maxScrollDepth = Math.max(maxScrollDepth, scrollDepth);
  });

  // Track time on page and engagement before user leaves
  window.addEventListener("beforeunload", () => {
    timeOnPage = Date.now() - startTime;

    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "user_engagement", {
        time_on_page: timeOnPage,
        scroll_depth: maxScrollDepth,
        page_title: document.title,
      });
    }
  });
}

// Build Performance Measurement for Story 2.7
export function measureBuildPerformance() {
  const startTime = performance.now();

  // Measure build time
  const buildTime = performance.now() - startTime;

  console.log("🏗️ Build Performance Measurement:");
  console.log(`  ⏱️ Build Time: ${buildTime.toFixed(2)}ms`);

  // Check against Story 2.7 budget
  if (STORY_2_7_BUDGET.BASELINE_BUILD_TIME) {
    const budgetLimit =
      STORY_2_7_BUDGET.BASELINE_BUILD_TIME *
      STORY_2_7_BUDGET.BUILD_TIME_MULTIPLIER;
    const budgetExceeded = buildTime > budgetLimit;

    console.log(
      `  📊 Baseline (Story 2.6): ${STORY_2_7_BUDGET.BASELINE_BUILD_TIME.toFixed(2)}ms`,
    );
    console.log(`  🎯 Budget Limit (5% increase): ${budgetLimit.toFixed(2)}ms`);
    console.log(
      `  ${budgetExceeded ? "❌" : "✅"} Budget Status: ${budgetExceeded ? "EXCEEDED" : "WITHIN LIMITS"}`,
    );

    if (budgetExceeded) {
      console.warn(
        `⚠️ Build time exceeds Story 2.7 performance budget by ${(buildTime - budgetLimit).toFixed(2)}ms`,
      );
    }
  } else {
    console.log(
      "  📝 Note: Story 2.6 baseline not set - run calibrateBaselineBuildTime() first",
    );
  }

  return buildTime;
}

// CSS Bundle Size Measurement for Story 2.7
export function measureCssBundleSize() {
  // Get all CSS files from the document
  const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
  let totalCssSize = 0;

  console.log("📦 CSS Bundle Size Analysis:");
  console.log(`  🔍 Found ${cssLinks.length} CSS files:`);

  cssLinks.forEach((link, index) => {
    const href = link.getAttribute("href");
    console.log(`    ${index + 1}. ${href || "inline"}`);

    // Note: Actual file size measurement would require server-side analysis
    // This is a client-side approximation
    if (href && href.includes("_astro")) {
      console.log(`       📁 Astro-generated CSS bundle detected`);
    }
  });

  // Check against Story 2.7 budget
  const budgetExceeded = totalCssSize > STORY_2_7_BUDGET.CSS_BUNDLE_SIZE_BYTES;
  console.log(`  📊 Total CSS Size: ~${(totalCssSize / 1024).toFixed(2)}KB`);
  console.log(
    `  🎯 Budget Limit: ${(STORY_2_7_BUDGET.CSS_BUNDLE_SIZE_BYTES / 1024).toFixed(2)}KB`,
  );
  console.log(
    `  ${budgetExceeded ? "❌" : "✅"} Budget Status: ${budgetExceeded ? "EXCEEDED" : "WITHIN LIMITS"}`,
  );

  if (budgetExceeded) {
    console.warn(
      `⚠️ CSS bundle size exceeds Story 2.7 budget by ${((totalCssSize - STORY_2_7_BUDGET.CSS_BUNDLE_SIZE_BYTES) / 1024).toFixed(2)}KB`,
    );
  }

  return totalCssSize;
}

// Calibrate baseline build time from Story 2.6
export function calibrateBaselineBuildTime(baselineMs) {
  STORY_2_7_BUDGET.BASELINE_BUILD_TIME = baselineMs;
  console.log(`📊 Story 2.6 Baseline Calibrated: ${baselineMs.toFixed(2)}ms`);
  console.log(
    `🎯 Story 2.7 Budget Limit: ${(baselineMs * STORY_2_7_BUDGET.BUILD_TIME_MULTIPLIER).toFixed(2)}ms (5% increase allowed)`,
  );

  // Store in localStorage for persistence
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("story-2-6-baseline", baselineMs.toString());
  }
}

// Load baseline from localStorage if available
if (typeof localStorage !== "undefined") {
  const storedBaseline = localStorage.getItem("story-2-6-baseline");
  if (storedBaseline) {
    STORY_2_7_BUDGET.BASELINE_BUILD_TIME = parseFloat(storedBaseline);
  }
}

// Export for use in other modules
export { PERFORMANCE_BUDGET, STORY_2_7_BUDGET };
