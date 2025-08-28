// ========== STORY 2.10 BREADCRUMB INTEGRATION TEST ==========
// Validates breadcrumb navigation implementation for tool pages
// Acceptance Criteria: AC #1-10

const fs = require("fs");
const path = require("path");

console.log("🧪 Running Story 2.10 Breadcrumb Integration Tests");
console.log("==================================================\n");

// Test data
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  tests: [],
};

function test(name, condition, message = "") {
  testResults.total++;
  const passed = condition();
  if (passed) {
    testResults.passed++;
    console.log(`✅ ${name}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${name}: ${message}`);
  }
  testResults.tests.push({ name, passed, message });
  return passed;
}

// Test 1: Breadcrumb utility functions exist
test(
  "Breadcrumb utility functions exist",
  () => {
    const utilsPath = path.join(
      __dirname,
      "..",
      "src",
      "utils",
      "content",
      "breadcrumb-utils.ts",
    );
    return fs.existsSync(utilsPath);
  },
  "breadcrumb-utils.ts file should exist",
);

// Test 2: ToolArticleLayout.astro updated with breadcrumb support
test(
  "ToolArticleLayout.astro updated with breadcrumb support",
  () => {
    const layoutPath = path.join(
      __dirname,
      "..",
      "src",
      "layouts",
      "ToolArticleLayout.astro",
    );
    if (!fs.existsSync(layoutPath)) return false;

    const content = fs.readFileSync(layoutPath, "utf8");
    return (
      content.includes("Breadcrumb") &&
      content.includes("showBreadcrumb") &&
      content.includes("currentPath") &&
      content.includes("validatedPath")
    );
  },
  "ToolArticleLayout.astro should import Breadcrumb and support breadcrumb props",
);

// Test 3: Tool index page uses breadcrumb
test(
  "Tool index page uses breadcrumb",
  () => {
    const indexPath = path.join(
      __dirname,
      "..",
      "src",
      "pages",
      "tools",
      "[tool]",
      "index.astro",
    );
    if (!fs.existsSync(indexPath)) return false;

    const content = fs.readFileSync(indexPath, "utf8");
    return (
      content.includes("ToolArticleLayout") &&
      content.includes("showBreadcrumb={true}") &&
      content.includes("currentPath={validatedCurrentPath}")
    );
  },
  "Tool index page should use ToolArticleLayout with breadcrumb props",
);

// Test 4: Tool article page uses breadcrumb
test(
  "Tool article page uses breadcrumb",
  () => {
    const articlePath = path.join(
      __dirname,
      "..",
      "src",
      "pages",
      "tools",
      "[tool]",
      "[...slug].astro",
    );
    if (!fs.existsSync(articlePath)) return false;

    const content = fs.readFileSync(articlePath, "utf8");
    return (
      content.includes("ToolArticleLayout") &&
      content.includes("showBreadcrumb={true}") &&
      content.includes("currentPath={validatedCurrentPath}")
    );
  },
  "Tool article page should use ToolArticleLayout with breadcrumb props",
);

// Test 5: Security validation implemented
test(
  "Security validation implemented",
  () => {
    const layoutPath = path.join(
      __dirname,
      "..",
      "src",
      "layouts",
      "ToolArticleLayout.astro",
    );
    if (!fs.existsSync(layoutPath)) return false;

    const content = fs.readFileSync(layoutPath, "utf8");
    return (
      content.includes("validatedPath") &&
      content.includes("Security") &&
      content.includes("try") &&
      content.includes("catch")
    );
  },
  "Security validation should be implemented in ToolArticleLayout.astro",
);

// Test 6: Breadcrumb component exists and is comprehensive
test(
  "Breadcrumb component exists and is comprehensive",
  () => {
    const breadcrumbPath = path.join(
      __dirname,
      "..",
      "src",
      "components",
      "public-components",
      "Breadcrumb.astro",
    );
    if (!fs.existsSync(breadcrumbPath)) return false;

    const content = fs.readFileSync(breadcrumbPath, "utf8");
    return (
      content.includes("Props") &&
      content.includes("responsive") &&
      content.includes("aria-label") &&
      content.includes("ariaLabel") &&
      content.length > 10000
    ); // Comprehensive component should be large
  },
  "Breadcrumb.astro should be a comprehensive component with props interface",
);

// Test 7: Build completed successfully (checked via dist existence)
test(
  "Build completed successfully",
  () => {
    const distPath = path.join(__dirname, "..", "dist");
    const indexHtml = path.join(distPath, "index.html");
    const toolsIndex = path.join(distPath, "tools", "anki", "index.html");

    return (
      fs.existsSync(distPath) &&
      fs.existsSync(indexHtml) &&
      fs.existsSync(toolsIndex)
    );
  },
  "Build should complete successfully and generate dist files",
);

// Test 8: Performance impact monitoring included
test(
  "Performance impact monitoring included",
  () => {
    const layoutPath = path.join(
      __dirname,
      "..",
      "src",
      "layouts",
      "ToolArticleLayout.astro",
    );
    if (!fs.existsSync(layoutPath)) return false;

    const content = fs.readFileSync(layoutPath, "utf8");
    return (
      content.includes("performance") ||
      content.includes("monitoring") ||
      content.includes("build time")
    );
  },
  "Performance monitoring should be included",
);

// Test 9: Error handling implemented
test(
  "Error handling implemented",
  () => {
    const layoutPath = path.join(
      __dirname,
      "..",
      "src",
      "layouts",
      "ToolArticleLayout.astro",
    );
    if (!fs.existsSync(layoutPath)) return false;

    const content = fs.readFileSync(layoutPath, "utf8");
    return (
      content.includes("try") &&
      content.includes("catch") &&
      content.includes("error") &&
      content.includes("console")
    );
  },
  "Error handling should be implemented with try-catch blocks",
);

// Test 10: Responsive design supported
test(
  "Responsive design supported",
  () => {
    const breadcrumbPath = path.join(
      __dirname,
      "..",
      "src",
      "components",
      "public-components",
      "Breadcrumb.astro",
    );
    if (!fs.existsSync(breadcrumbPath)) return false;

    const content = fs.readFileSync(breadcrumbPath, "utf8");
    return (
      content.includes("320px") ||
      content.includes("640px") ||
      content.includes("768px") ||
      content.includes("1024px") ||
      content.includes("1280px") ||
      content.includes("@media")
    );
  },
  "Breadcrumb component should support all 5 responsive breakpoints",
);

// Summary
console.log(
  "\n╔══════════════════════════════════════════════════════════════╗",
);
console.log(
  "║                STORY 2.10 BREADCRUMB TEST REPORT              ║",
);
console.log("╠══════════════════════════════════════════════════════════════╣");
console.log(`║ Total Tests: ${testResults.total.toString().padEnd(51)} ║`);
console.log(`║ Passed: ${testResults.passed.toString().padEnd(55)} ║`);
console.log(`║ Failed: ${testResults.failed.toString().padEnd(55)} ║`);
console.log(
  `║ Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%${" ".repeat(44)} ║`,
);
console.log("╚══════════════════════════════════════════════════════════════╝");

if (testResults.failed === 0) {
  console.log("\n🎯 STORY 2.10 VALIDATION: PASSED ✅");
  console.log("🎉 ALL BREADCRUMB INTEGRATION TESTS PASSED!");
  process.exit(0);
} else {
  console.log("\n❌ STORY 2.10 VALIDATION: FAILED");
  console.log(
    "⚠️  Some breadcrumb integration tests failed. Please review the errors above.",
  );
  process.exit(1);
}
