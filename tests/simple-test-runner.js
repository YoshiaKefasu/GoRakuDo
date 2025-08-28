#!/usr/bin/env node

/**
 * Simple Test Runner for GoRakuDo
 * Executes tests using Node.js ES modules without Jest complications
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SimpleTestRunner {
  constructor() {
    this.results = {
      unit: { passed: 0, failed: 0, total: 0 },
      integration: { passed: 0, failed: 0, total: 0 },
      e2e: { passed: 0, failed: 0, total: 0 },
      overall: { passed: 0, failed: 0, total: 0 },
    };
    this.startTime = Date.now();
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

  async runTestFile(filePath) {
    try {
      this.log(`Attempting to load: ${filePath}`, "info");
      const resolvedPath = path.resolve(filePath);
      this.log(`Resolved path: ${resolvedPath}`, "info");

      // Check if file exists
      if (!fs.existsSync(resolvedPath)) {
        this.log(`❌ File does not exist: ${resolvedPath}`, "error");
        return false;
      }

      const module = await import(resolvedPath);
      this.log(`✅ Loaded test file: ${path.basename(filePath)}`, "success");
      return true;
    } catch (error) {
      this.log(
        `❌ Failed to load test file: ${path.basename(filePath)}`,
        "error",
      );
      this.log(`Error details: ${error.message}`, "error");
      this.log(`Stack trace: ${error.stack}`, "error");
      return false;
    }
  }

  async runUnitTests() {
    this.log("🚀 Running Unit Tests...", "info");

    const unitTestDir = path.join(__dirname, "unit");
    this.log(`Looking for tests in: ${unitTestDir}`, "info");

    try {
      const files = fs.readdirSync(unitTestDir);
      this.log(`Found files in unit directory: ${files.join(", ")}`, "info");

      const testFiles = files
        .filter((file) => file.endsWith(".test.js"))
        .map((file) => path.join(unitTestDir, file));

      this.log(
        `Test files to run: ${testFiles.map((f) => path.basename(f)).join(", ")}`,
        "info",
      );

      for (const testFile of testFiles) {
        this.log(`Running test file: ${path.basename(testFile)}`, "info");
        const success = await this.runTestFile(testFile);
        if (success) {
          this.results.unit.passed++;
        } else {
          this.results.unit.failed++;
        }
        this.results.unit.total++;
      }
    } catch (error) {
      this.log(
        `❌ Error accessing unit test directory: ${error.message}`,
        "error",
      );
    }

    this.log(
      `✅ Unit Tests Completed: ${this.results.unit.passed}/${this.results.unit.total} passed`,
      "success",
    );
    return this.results.unit;
  }

  async runIntegrationTests() {
    this.log("🔧 Running Integration Tests...", "info");

    const integrationTestDir = path.join(__dirname, "integration");
    const testFiles = fs
      .readdirSync(integrationTestDir)
      .filter((file) => file.endsWith(".test.js"))
      .map((file) => path.join(integrationTestDir, file));

    for (const testFile of testFiles) {
      const success = await this.runTestFile(testFile);
      if (success) {
        this.results.integration.passed++;
      } else {
        this.results.integration.failed++;
      }
      this.results.integration.total++;
    }

    this.log(
      `✅ Integration Tests Completed: ${this.results.integration.passed}/${this.results.integration.total} passed`,
      "success",
    );
    return this.results.integration;
  }

  async runE2ETests() {
    this.log("🌐 Running E2E Tests...", "info");

    const e2eTestDir = path.join(__dirname, "e2e");
    const testFiles = fs
      .readdirSync(e2eTestDir)
      .filter((file) => file.endsWith(".test.js"))
      .map((file) => path.join(e2eTestDir, file));

    for (const testFile of testFiles) {
      const success = await this.runTestFile(testFile);
      if (success) {
        this.results.e2e.passed++;
      } else {
        this.results.e2e.failed++;
      }
      this.results.e2e.total++;
    }

    this.log(
      `✅ E2E Tests Completed: ${this.results.e2e.passed}/${this.results.e2e.total} passed`,
      "success",
    );
    return this.results.e2e;
  }

  generateReport() {
    const duration = Date.now() - this.startTime;
    const { overall } = this.results;

    const report = `
╔══════════════════════════════════════════════════════════════╗
║                    SIMPLE TEST REPORT                        ║
╠══════════════════════════════════════════════════════════════╣
║ Test Suites: 3                                                 ║
║ Total Tests: ${overall.total}                                                ║
║ Passed: ${overall.passed} ✅                                                    ║
║ Failed: ${overall.failed} ${overall.failed > 0 ? "❌" : "✅"}                                                     ║
║ Duration: ${duration}ms                                               ║
║ Success Rate: ${overall.total > 0 ? ((overall.passed / overall.total) * 100).toFixed(1) : 0}%                  ║
╠══════════════════════════════════════════════════════════════╣
║ UNIT TESTS: ${this.results.unit.passed}/${this.results.unit.total} ✅                       ║
║ INTEGRATION TESTS: ${this.results.integration.passed}/${this.results.integration.total} ✅                ║
║ E2E TESTS: ${this.results.e2e.passed}/${this.results.e2e.total} ✅                          ║
╚══════════════════════════════════════════════════════════════╝

🎯 TEST EXECUTION STATUS: ${overall.failed === 0 ? "SUCCESS" : "ISSUES FOUND"}
`;

    return report;
  }

  async runAllTests() {
    this.log("🎯 Starting Simple Test Execution", "info");
    this.log("=".repeat(60), "info");

    try {
      // Run tests in order
      const unitResults = await this.runUnitTests();
      this.updateResults("unit", unitResults);

      const integrationResults = await this.runIntegrationTests();
      this.updateResults("integration", integrationResults);

      const e2eResults = await this.runE2ETests();
      this.updateResults("e2e", e2eResults);

      // Generate and display final report
      console.log("\n" + this.generateReport());

      // Final status
      const { overall } = this.results;
      if (overall.failed === 0) {
        this.log(`🎉 ALL TESTS PASSED!`, "success");
        process.exit(0);
      } else {
        this.log(
          `⚠️ ${overall.failed} tests failed. Please review and fix issues.`,
          "error",
        );
        process.exit(1);
      }
    } catch (error) {
      this.log(`💥 Test execution failed: ${error.message}`, "error");
      console.error(error);
      process.exit(1);
    }
  }

  updateResults(type, results) {
    this.results.overall.passed += results.passed;
    this.results.overall.failed += results.failed;
    this.results.overall.total += results.total;
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const testRunner = new SimpleTestRunner();
  testRunner.runAllTests();
}

export default SimpleTestRunner;
