#!/usr/bin/env node

/**
 * Synchronous Test for Story 2.9
 * Validates the tools page changes without async/await issues
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SyncTest {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.total = 0;
  }

  log(message, type = "info") {
    const timestamp = new Date().toISOString();
    const colors = {
      info: "\x1b[36m", // Cyan
      success: "\x1b[32m", // Green
      error: "\x1b[31m", // Red
      warning: "\x1b[33m", // Yellow
      reset: "\x1b[0m",
    };
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
  }

  assert(condition, message) {
    this.total++;
    if (condition) {
      this.passed++;
      this.log(`✅ ${message}`, "success");
      return true;
    } else {
      this.failed++;
      this.log(`❌ ${message}`, "error");
      return false;
    }
  }

  runTests() {
    this.log("🧪 Running Story 2.9 Synchronous Tests", "info");
    this.log("=".repeat(60), "info");

    const toolsFilePath = path.join(
      __dirname,
      "..",
      "src",
      "pages",
      "tools.astro",
    );

    // Test 1: File exists
    const fileExists = fs.existsSync(toolsFilePath);
    this.assert(fileExists, "Tools page file exists");

    if (!fileExists) {
      this.log(
        "❌ Cannot continue tests - tools.astro file not found",
        "error",
      );
      this.generateReport();
      return;
    }

    // Test 2: Read file content
    let content;
    try {
      content = fs.readFileSync(toolsFilePath, "utf8");
      this.assert(true, "Successfully read tools.astro file");
    } catch (error) {
      this.assert(false, `Failed to read tools.astro file: ${error.message}`);
      this.generateReport();
      return;
    }

    // Test 3: Tools array exists
    this.assert(
      content.includes("const tools = ["),
      "Tools array declaration found",
    );

    // Test 4: Required tool IDs exist
    this.assert(content.includes('id: "anki"'), "Anki tool ID found");
    this.assert(
      content.includes('id: "yomitan"'),
      "Yomitan tool ID found (updated from yomichan)",
    );
    this.assert(content.includes('id: "migaku"'), "Migaku tool ID found");

    // Test 5: Old tool ID is not present
    this.assert(!content.includes('id: "yomichan"'), "Old yomichan ID removed");

    // Test 6: New link paths exist
    this.assert(
      content.includes('link: "/tools/anki"'),
      "Anki link updated to new path",
    );
    this.assert(
      content.includes('link: "/tools/yomitan"'),
      "Yomitan link updated to new path",
    );
    this.assert(
      content.includes('link: "/tools/migaku"'),
      "Migaku link updated to new path",
    );

    // Test 7: Old link paths are not present
    this.assert(
      !content.includes('link: "/docs/anki-guide"'),
      "Old Anki link path removed",
    );
    this.assert(
      !content.includes('link: "/docs/yomichan-guide"'),
      "Old Yomichan link path removed",
    );
    this.assert(
      !content.includes('link: "/docs/migaku-guide"'),
      "Old Migaku link path removed",
    );

    // Test 8: Dynamic routing template exists
    this.assert(
      content.includes("href={tool.link}"),
      "Dynamic link template found",
    );
    this.assert(
      content.includes("tools.map((tool)"),
      "Tools mapping function found",
    );

    // Test 9: Preload links updated
    this.assert(content.includes('"/tools/anki"'), "Anki preload link updated");
    this.assert(
      content.includes('"/tools/yomitan"'),
      "Yomitan preload link updated",
    );
    this.assert(
      content.includes('"/tools/migaku"'),
      "Migaku preload link updated",
    );

    // Test 10: File size is reasonable
    const stats = fs.statSync(toolsFilePath);
    const fileSizeKB = stats.size / 1024;
    this.assert(
      fileSizeKB < 100,
      `File size is reasonable (${fileSizeKB.toFixed(2)}KB < 100KB)`,
    );

    // Test 11: HTML structure preserved
    this.assert(
      content.includes('class="main-content'),
      "Main content structure preserved",
    );
    this.assert(
      content.includes('class="tools-grid'),
      "Tools grid structure preserved",
    );
    this.assert(
      content.includes("<Navbar client:visible />"),
      "Navbar component preserved",
    );

    this.generateReport();
  }

  generateReport() {
    const successRate =
      this.total > 0 ? ((this.passed / this.total) * 100).toFixed(1) : 0;

    const report = `
╔══════════════════════════════════════════════════════════════╗
║               STORY 2.9 SYNCHRONOUS TEST REPORT              ║
╠══════════════════════════════════════════════════════════════╣
║ Total Tests: ${this.total}                                                  ║
║ Passed: ${this.passed} ✅                                                    ║
║ Failed: ${this.failed} ${this.failed > 0 ? "❌" : "✅"}                                                     ║
║ Success Rate: ${successRate}%                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ✅ Tools array structure validated                              ║
║ ✅ Tool IDs updated (yomichan → yomitan)                       ║
║ ✅ Link paths updated to new dynamic routes                    ║
║ ✅ Old link paths removed                                      ║
║ ✅ Dynamic routing template preserved                         ║
║ ✅ Preload links updated                                      ║
║ ✅ HTML structure integrity maintained                        ║
║ ✅ File size within acceptable limits                         ║
╚══════════════════════════════════════════════════════════════╝

🎯 STORY 2.9 VALIDATION: ${this.failed === 0 ? "PASSED ✅" : "FAILED ❌"}
`;

    console.log("\n" + report);

    if (this.failed === 0) {
      this.log(
        "🎉 ALL TESTS PASSED! Story 2.9 validation successful.",
        "success",
      );
      process.exit(0);
    } else {
      this.log(
        `⚠️ ${this.failed} tests failed. Please review the issues above.`,
        "error",
      );
      process.exit(1);
    }
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const test = new SyncTest();
  test.runTests();
}

export default SyncTest;
