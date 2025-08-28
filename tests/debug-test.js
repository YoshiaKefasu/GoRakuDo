#!/usr/bin/env node

// Simple debug test
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Debug Test Starting...");
console.log("Current directory:", __dirname);

try {
  const unitTestDir = path.join(__dirname, "unit");
  console.log("Unit test directory:", unitTestDir);

  if (fs.existsSync(unitTestDir)) {
    const files = fs.readdirSync(unitTestDir);
    console.log("Files in unit directory:", files);

    const testFiles = files.filter((file) => file.endsWith(".test.js"));
    console.log("Test files found:", testFiles);

    if (testFiles.length > 0) {
      const firstTestFile = path.join(unitTestDir, testFiles[0]);
      console.log("Attempting to load first test file:", firstTestFile);

      if (fs.existsSync(firstTestFile)) {
        console.log("File exists, attempting import...");
        // Convert Windows path to file:// URL
        const fileUrl = new URL(`file://${firstTestFile.replace(/\\/g, "/")}`);
        console.log("File URL:", fileUrl.href);
        const module = await import(fileUrl.href);
        console.log("✅ Successfully imported test file");
        console.log("Module keys:", Object.keys(module));
      } else {
        console.log("❌ Test file does not exist");
      }
    } else {
      console.log("❌ No test files found");
    }
  } else {
    console.log("❌ Unit test directory does not exist");
  }
} catch (error) {
  console.error("❌ Error:", error.message);
  console.error("Stack:", error.stack);
}

console.log("✅ Debug test completed");
