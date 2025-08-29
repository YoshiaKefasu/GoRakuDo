#!/usr/bin/env node
/**
 * Build Performance Monitor for Story 2.7
 * Measures build time and validates 5% performance budget from Story 2.6 baseline
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Story 2.7 Performance Budget Configuration
const STORY_2_7_BUDGET = {
  BUILD_TIME_MULTIPLIER: 1.05, // 5% increase allowed
  CSS_BUNDLE_SIZE_BYTES: 3072, // 3KB maximum additional CSS
  BASELINE_BUILD_TIME: null, // To be set from Story 2.6 measurements
};

// Performance measurement data storage
const PERFORMANCE_LOG_DIR = path.join(process.cwd(), ".ai");
const PERFORMANCE_LOG_PATH = path.join(
  PERFORMANCE_LOG_DIR,
  "build-performance.json",
);

class BuildPerformanceMonitor {
  constructor() {
    this.startTime = null;
    this.endTime = null;
    this.buildTime = null;
    this.ensureLogDirectory();
    this.loadBaselineData();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(PERFORMANCE_LOG_DIR)) {
      fs.mkdirSync(PERFORMANCE_LOG_DIR, { recursive: true });
      console.log(
        `📁 Created performance log directory: ${PERFORMANCE_LOG_DIR}`,
      );
    }
  }

  loadBaselineData() {
    try {
      if (fs.existsSync(PERFORMANCE_LOG_PATH)) {
        const data = JSON.parse(fs.readFileSync(PERFORMANCE_LOG_PATH, "utf8"));
        STORY_2_7_BUDGET.BASELINE_BUILD_TIME = data.baselineBuildTime || null;
      }
    } catch (error) {
      console.log(
        "📝 No baseline performance data found - run calibration first",
      );
    }
  }

  startBuildMeasurement() {
    this.startTime = performance.now();
    console.log("🏗️ Build performance measurement started...");
  }

  endBuildMeasurement() {
    if (!this.startTime) {
      console.warn(
        "⚠️ Build measurement not started - call startBuildMeasurement() first",
      );
      return;
    }

    this.endTime = performance.now();
    this.buildTime = this.endTime - this.startTime;

    this.logBuildPerformance();
    this.validatePerformanceBudget();

    return this.buildTime;
  }

  logBuildPerformance() {
    const logData = {
      timestamp: new Date().toISOString(),
      buildTime: this.buildTime,
      baselineBuildTime: STORY_2_7_BUDGET.BASELINE_BUILD_TIME,
      budgetExceeded: false,
      budgetExceededBy: 0,
    };

    // Write to log file
    try {
      let existingData = [];
      if (fs.existsSync(PERFORMANCE_LOG_PATH)) {
        existingData = JSON.parse(
          fs.readFileSync(PERFORMANCE_LOG_PATH, "utf8"),
        );
        if (!Array.isArray(existingData)) {
          existingData = [existingData];
        }
      }

      existingData.push(logData);
      fs.writeFileSync(
        PERFORMANCE_LOG_PATH,
        JSON.stringify(existingData, null, 2),
      );
    } catch (error) {
      console.warn("⚠️ Failed to write performance log:", error.message);
    }
  }

  validatePerformanceBudget() {
    console.log("\n=== STORY 2.7 PERFORMANCE VALIDATION ===");
    console.log(`🏗️ Build Time: ${this.buildTime.toFixed(2)}ms`);

    if (STORY_2_7_BUDGET.BASELINE_BUILD_TIME) {
      const budgetLimit =
        STORY_2_7_BUDGET.BASELINE_BUILD_TIME *
        STORY_2_7_BUDGET.BUILD_TIME_MULTIPLIER;
      const budgetExceeded = this.buildTime > budgetLimit;
      const exceededBy = this.buildTime - budgetLimit;

      console.log(
        `📊 Baseline (Story 2.6): ${STORY_2_7_BUDGET.BASELINE_BUILD_TIME.toFixed(2)}ms`,
      );
      console.log(`🎯 Budget Limit (5% increase): ${budgetLimit.toFixed(2)}ms`);
      console.log(
        `${budgetExceeded ? "❌" : "✅"} Budget Status: ${budgetExceeded ? "EXCEEDED" : "WITHIN LIMITS"}`,
      );

      if (budgetExceeded) {
        console.error(
          `🚨 Build time exceeds Story 2.7 performance budget by ${exceededBy.toFixed(2)}ms`,
        );
        console.error(
          `💡 Consider optimizing CSS or removing unnecessary dependencies`,
        );

        // Update log with budget violation
        this.updateLogWithBudgetViolation(exceededBy);
      } else {
        console.log(
          `✅ Build performance within budget - ${(budgetLimit - this.buildTime).toFixed(2)}ms remaining`,
        );
      }
    } else {
      console.log(
        "📝 Note: Story 2.6 baseline not set - run calibrateBaselineBuildTime() first",
      );
      console.log(
        "💡 To calibrate: node src/scripts/build-performance-monitor.js calibrate <buildTimeMs>",
      );
    }
  }

  updateLogWithBudgetViolation(exceededBy) {
    try {
      const data = JSON.parse(fs.readFileSync(PERFORMANCE_LOG_PATH, "utf8"));
      const lastEntry = Array.isArray(data) ? data[data.length - 1] : data;

      if (lastEntry) {
        lastEntry.budgetExceeded = true;
        lastEntry.budgetExceededBy = exceededBy;

        fs.writeFileSync(
          PERFORMANCE_LOG_PATH,
          JSON.stringify(Array.isArray(data) ? data : [data], null, 2),
        );
      }
    } catch (error) {
      console.warn(
        "⚠️ Failed to update log with budget violation:",
        error.message,
      );
    }
  }

  calibrateBaselineBuildTime(buildTimeMs) {
    STORY_2_7_BUDGET.BASELINE_BUILD_TIME = buildTimeMs;

    const data = {
      baselineBuildTime: buildTimeMs,
      calibratedAt: new Date().toISOString(),
      storyVersion: "2.6",
      budgetFor: "2.7",
      budgetMultiplier: STORY_2_7_BUDGET.BUILD_TIME_MULTIPLIER,
      budgetLimit: buildTimeMs * STORY_2_7_BUDGET.BUILD_TIME_MULTIPLIER,
    };

    fs.writeFileSync(PERFORMANCE_LOG_PATH, JSON.stringify([data], null, 2));

    console.log(
      `📊 Story 2.6 Baseline Calibrated: ${buildTimeMs.toFixed(2)}ms`,
    );
    console.log(
      `🎯 Story 2.7 Budget Limit: ${(buildTimeMs * STORY_2_7_BUDGET.BUILD_TIME_MULTIPLIER).toFixed(2)}ms (5% increase allowed)`,
    );
    console.log(`✅ Calibration saved to ${PERFORMANCE_LOG_PATH}`);
  }

  measureCssBundleSize() {
    const distDir = path.join(process.cwd(), "dist");
    let totalCssSize = 0;

    console.log("📦 CSS Bundle Size Analysis for Story 2.7:");
    console.log(`🔍 Looking for CSS files in: ${distDir}`);

    if (fs.existsSync(distDir)) {
      console.log("📁 Dist directory found");

      // Look for CSS files in _astro subdirectory (typical Astro build structure)
      const astroDir = path.join(distDir, "_astro");
      let cssFiles = [];

      if (fs.existsSync(astroDir)) {
        console.log("📁 _astro directory found");
        cssFiles = this.findCssFiles(astroDir);
      } else {
        console.log(
          "📁 No _astro directory found, scanning entire dist directory",
        );
        cssFiles = this.findCssFiles(distDir);
      }

      console.log(`🔍 Found ${cssFiles.length} CSS files:`);

      if (cssFiles.length === 0) {
        console.log("  No CSS files found in dist directory");
        console.log("  💡 Make sure to run the build first: npm run build");
      } else {
        // Analyze each CSS file in detail
        const cssAnalysis = this.analyzeCssFiles(cssFiles, distDir);

        cssAnalysis.forEach((file, index) => {
          console.log(
            `  ${index + 1}. ${file.relativePath} - ${file.sizeKB}KB`,
          );
          if (file.isLarge && file.category !== "article-specific") {
            console.log(`      ⚠️  LARGE FILE (${file.category})`);
            console.log(`      💡 ${file.optimizationSuggestion}`);
          }
          totalCssSize += file.sizeBytes;
        });

        const budgetExceeded =
          totalCssSize > STORY_2_7_BUDGET.CSS_BUNDLE_SIZE_BYTES;
        console.log(`\n📊 Measurement Results:`);
        console.log(
          `  📦 Total CSS Size: ${(totalCssSize / 1024).toFixed(2)}KB`,
        );
        console.log(
          `  🎯 Budget Limit: ${(STORY_2_7_BUDGET.CSS_BUNDLE_SIZE_BYTES / 1024).toFixed(2)}KB`,
        );
        console.log(
          `  📈 Size Difference: ${((totalCssSize - STORY_2_7_BUDGET.CSS_BUNDLE_SIZE_BYTES) / 1024).toFixed(2)}KB`,
        );
        console.log(
          `${budgetExceeded ? "❌" : "✅"} Budget Status: ${budgetExceeded ? "EXCEEDED" : "WITHIN LIMITS"}`,
        );

        // Provide optimization recommendations
        this.provideOptimizationRecommendations(cssAnalysis, budgetExceeded);

        if (budgetExceeded) {
          const exceededBy = (
            (totalCssSize - STORY_2_7_BUDGET.CSS_BUNDLE_SIZE_BYTES) /
            1024
          ).toFixed(2);
          console.error(
            `\n🚨 CRITICAL: CSS bundle size exceeds Story 2.7 budget by ${exceededBy}KB`,
          );
          console.error(`💡 Immediate actions needed:`);
          console.error(`   1. Implement CSS purging for unused utilities`);
          console.error(
            `   2. Extract article-specific styles to separate bundle`,
          );
          console.error(`   3. Optimize/reduce large CSS files (>50KB)`);
          console.error(`   4. Enable Tailwind purging in production`);
        } else {
          const remaining = (
            (STORY_2_7_BUDGET.CSS_BUNDLE_SIZE_BYTES - totalCssSize) /
            1024
          ).toFixed(2);
          console.log(
            `✅ CSS bundle size within budget - ${remaining}KB remaining`,
          );
        }
      }
    } else {
      console.log("❌ No dist directory found");
      console.log("💡 Run the build first: npm run build");
      console.log("   Then run CSS measurement: npm run perf:css");
    }

    return totalCssSize;
  }

  analyzeCssFiles(cssFiles, distDir) {
    return cssFiles
      .map((file) => {
        const stats = fs.statSync(file);
        const sizeKB = (stats.size / 1024).toFixed(2);
        const sizeBytes = stats.size;
        const relativePath = path.relative(distDir, file);
        const fileName = path.basename(file);

        // Categorize CSS files and provide optimization suggestions
        let category = "unknown";
        let optimizationSuggestion = "Review for unused styles";
        let isLarge = sizeBytes > 50 * 1024; // 50KB threshold

        if (fileName.includes("Navbar")) {
          category = "component-specific";
          optimizationSuggestion = "Consider lazy loading navbar styles";
        } else if (fileName.includes("vue")) {
          category = "framework-specific";
          optimizationSuggestion = "Ensure Vue components are tree-shaken";
        } else if (
          fileName.includes("_astro-renderers") ||
          fileName.includes("global")
        ) {
          category = "global-styles";
          optimizationSuggestion =
            "URGENT: Enable Tailwind purging and remove unused utilities";
        } else if (
          relativePath.includes("article") ||
          fileName.includes("article")
        ) {
          category = "article-specific";
          optimizationSuggestion = "Consider code splitting for article styles";
          isLarge = sizeBytes > 10 * 1024; // Lower threshold for article styles
        } else if (
          fileName.includes("slideshow") ||
          fileName.includes("animation")
        ) {
          category = "animations";
          optimizationSuggestion =
            "Optimize keyframe animations and consider lazy loading";
        } else if (
          fileName.includes("tailwind") ||
          fileName.includes("utilities")
        ) {
          category = "utilities";
          optimizationSuggestion = "URGENT: Purge unused Tailwind classes";
        }

        return {
          filePath: file,
          relativePath,
          fileName,
          sizeKB,
          sizeBytes,
          category,
          optimizationSuggestion,
          isLarge,
          percentage: 0, // Will be calculated after analysis
        };
      })
      .map((file) => {
        // Calculate percentage of total
        const totalSize = cssFiles.reduce(
          (sum, f) => sum + fs.statSync(f).size,
          0,
        );
        file.percentage = ((file.sizeBytes / totalSize) * 100).toFixed(1);
        return file;
      })
      .sort((a, b) => b.sizeBytes - a.sizeBytes); // Sort by size descending
  }

  provideOptimizationRecommendations(cssAnalysis, budgetExceeded) {
    console.log(`\n🔍 CSS Optimization Analysis:`);

    // Group by category
    const byCategory = cssAnalysis.reduce((acc, file) => {
      if (!acc[file.category]) acc[file.category] = [];
      acc[file.category].push(file);
      return acc;
    }, {});

    Object.entries(byCategory).forEach(([category, files]) => {
      const categorySize = files.reduce((sum, f) => sum + f.sizeBytes, 0);
      const categorySizeKB = (categorySize / 1024).toFixed(2);
      console.log(
        `  📁 ${category}: ${categorySizeKB}KB (${files.length} files)`,
      );

      // Show largest files in this category
      files
        .filter((f) => f.isLarge)
        .forEach((file) => {
          console.log(
            `    🚨 ${file.fileName}: ${file.sizeKB}KB (${file.percentage}%)`,
          );
          console.log(`       💡 ${file.optimizationSuggestion}`);
        });
    });

    console.log(`\n🎯 Optimization Strategy:`);
    if (budgetExceeded) {
      console.log(`  🚨 CRITICAL OVERSIZE - Immediate action required:`);
      console.log(`  1. 🏗️  Enable Tailwind CSS purging in production build`);
      console.log(
        `  2. 📦 Extract article styles to separate lazy-loaded bundle`,
      );
      console.log(`  3. 🗂️  Implement CSS code splitting by route/component`);
      console.log(`  4. 🧹 Remove unused utility classes and animations`);
      console.log(`  5. 📊 Set up continuous CSS size monitoring`);
    } else {
      console.log(`  ✅ CSS size within acceptable range`);
      console.log(`  📊 Consider ongoing monitoring for future changes`);
    }
  }

  findCssFiles(dir, files = []) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        this.findCssFiles(fullPath, files);
      } else if (item.endsWith(".css")) {
        files.push(fullPath);
      }
    }

    return files;
  }

  generatePerformanceReport() {
    try {
      const data = JSON.parse(fs.readFileSync(PERFORMANCE_LOG_PATH, "utf8"));
      const entries = Array.isArray(data) ? data : [data];

      console.log("\n=== BUILD PERFORMANCE REPORT ===");
      console.log(`📊 Total Measurements: ${entries.length}`);

      if (entries.length > 0) {
        const latest = entries[entries.length - 1];
        const baseline = STORY_2_7_BUDGET.BASELINE_BUILD_TIME;

        if (baseline && latest.buildTime) {
          const budgetLimit = baseline * STORY_2_7_BUDGET.BUILD_TIME_MULTIPLIER;
          const efficiency =
            ((budgetLimit - latest.buildTime) / budgetLimit) * 100;

          console.log(`🏗️ Latest Build Time: ${latest.buildTime.toFixed(2)}ms`);
          console.log(`📊 Baseline: ${baseline.toFixed(2)}ms`);
          console.log(`🎯 Budget Limit: ${budgetLimit.toFixed(2)}ms`);
          console.log(`📈 Budget Efficiency: ${efficiency.toFixed(1)}%`);

          if (latest.budgetExceeded) {
            console.log(
              `❌ Budget Status: EXCEEDED by ${latest.budgetExceededBy.toFixed(2)}ms`,
            );
          } else {
            console.log(`✅ Budget Status: WITHIN LIMITS`);
          }
        }
      }

      console.log(`📁 Report saved at: ${PERFORMANCE_LOG_PATH}`);
    } catch (error) {
      console.log("📝 No performance data available - run builds first");
    }
  }
}

// CLI Interface
// Check if this is the main module (ES module equivalent of require.main === module)
if (import.meta.url === `file://${process.argv[1]}`) {
  const monitor = new BuildPerformanceMonitor();
  const command = process.argv[2];

  switch (command) {
    case "start":
      monitor.startBuildMeasurement();
      break;

    case "end":
      monitor.endBuildMeasurement();
      break;

    case "calibrate":
      const buildTime = parseFloat(process.argv[3]);
      if (isNaN(buildTime)) {
        console.error("❌ Please provide a valid build time in milliseconds");
        console.log(
          "Example: node src/scripts/build-performance-monitor.js calibrate 3500",
        );
        process.exit(1);
      }
      monitor.calibrateBaselineBuildTime(buildTime);
      break;

    case "css":
      monitor.measureCssBundleSize();
      break;

    case "report":
      monitor.generatePerformanceReport();
      break;

    default:
      console.log("🏗️ Build Performance Monitor for Story 2.7");
      console.log("");
      console.log("Usage:");
      console.log(
        "  node src/scripts/build-performance-monitor.js start    - Start build measurement",
      );
      console.log(
        "  node src/scripts/build-performance-monitor.js end      - End build measurement and validate budget",
      );
      console.log(
        "  node src/scripts/build-performance-monitor.js calibrate <ms> - Set Story 2.6 baseline build time",
      );
      console.log(
        "  node src/scripts/build-performance-monitor.js css      - Measure CSS bundle size",
      );
      console.log(
        "  node src/scripts/build-performance-monitor.js report   - Generate performance report",
      );
      console.log("");
      console.log("Example workflow:");
      console.log("  1. Measure Story 2.6 build time: time npm run build");
      console.log(
        "  2. Calibrate baseline: node src/scripts/build-performance-monitor.js calibrate 3500",
      );
      console.log(
        "  3. Wrap build commands: node src/scripts/build-performance-monitor.js start && npm run build && node src/scripts/build-performance-monitor.js end",
      );
  }
}

export default BuildPerformanceMonitor;
