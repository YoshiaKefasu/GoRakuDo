#!/usr/bin/env node

/**
 * AI CLI Tool - Command Line Interface for AI API Requests
 * Run with: node ai-cli.js [command] [options]
 *
 * This script provides command-line access to all AI functions
 * Uses existing test scripts to avoid TypeScript import issues
 */

import { execSync } from "child_process";
import * as fs from "fs";

// Command line arguments
const args = process.argv.slice(2);
const command = args[0];

// Help text
const HELP_TEXT = `
🤖 AI CLI Tool - Command Line Interface for AI API Requests
===========================================================

USAGE:
  node ai-cli.js <command> [options]

COMMANDS:
  test        Run quick AI system test
  test-full   Run comprehensive AI prompt testing
  test-env    Run detailed environment testing
  meta        Generate meta description (interactive)
  keywords    Generate keywords (interactive)
  recommend   Generate recommendations (interactive)
  generate    Generate custom content (interactive)
  metadata    Generate metadata files for all posts
  silent      Generate metadata files silently (no test output)
  help        Show this help message

QUICK TESTS:
  node ai-cli.js test           # Quick system test
  node ai-cli.js test-full      # Full prompt testing
  node ai-cli.js test-env       # Environment testing

INTERACTIVE GENERATION:
  node ai-cli.js meta           # Interactive meta description
  node ai-cli.js keywords       # Interactive keywords generation
  node ai-cli.js recommend      # Interactive recommendations
  node ai-cli.js generate       # Interactive custom content
  node ai-cli.js metadata       # Generate metadata files for all posts
  node ai-cli.js silent         # Generate metadata files silently

EXAMPLES:
  # Quick system check
  node ai-cli.js test

  # Comprehensive testing
  node ai-cli.js test-full

  # Interactive meta description generation
  node ai-cli.js meta

  # Interactive custom content generation
  node ai-cli.js generate

DIRECT SCRIPT ACCESS:
  node quick-ai-test.js         # Quick system test
  node test-prompt-changes.js   # Comprehensive prompt testing
  node test-node-env.js         # Environment testing
  node geminiseo-metadata-cli.js     # Generate metadata files

ENVIRONMENT SETUP:
  1. Ensure .env file exists with GOOGLE_API_KEY
  2. Run: npm install (to install dependencies)
  3. Test: node ai-cli.js test
`;

// Utility functions
function checkEnvironment() {
  // Check if .env file exists
  if (!fs.existsSync(".env")) {
    console.error("❌ No .env file found!");
    console.log("💡 Solution:");
    console.log("  1. Copy env.example to .env: cp env.example .env");
    console.log(
      "  2. Edit .env and add your API key: GOOGLE_API_KEY=your_key_here",
    );
    console.log(
      "  3. Get API key from: https://makersuite.google.com/app/apikey",
    );
    process.exit(1);
  }

  // Check if test scripts exist
  const requiredScripts = [
    "quick-ai-test.js",
    "test-prompt-changes.js",
    "test-node-env.js",
  ];
  for (const script of requiredScripts) {
    if (!fs.existsSync(script)) {
      console.error(`❌ Required script not found: ${script}`);
      console.log("💡 Please ensure all test scripts are in the project root");
      process.exit(1);
    }
  }
}

function runCommand(command, description) {
  console.log(`🚀 ${description}`);
  console.log("=".repeat(description.length + 3));

  try {
    execSync(command, {
      stdio: "inherit",
      encoding: "utf8",
    });
  } catch (error) {
    console.error(`❌ Command failed: ${error.message}`);
    process.exit(1);
  }
}

async function promptUser(question) {
  const { createInterface } = await import("readline");
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    readline.question(question, (answer) => {
      readline.close();
      resolve(answer);
    });
  });
}

async function interactiveMetaGeneration() {
  console.log("📝 Interactive Meta Description Generation");
  console.log("==========================================");
  console.log("This will create a temporary test script for your content.\n");

  const title = await promptUser("Enter title: ");
  const content = await promptUser("Enter content (brief description): ");
  const keywords = await promptUser("Enter keywords (comma-separated): ");
  const language =
    (await promptUser("Enter language (id/ja) [default: id]: ")) || "id";

  // Create temporary test script
  const testScript = `
import * as dotenv from "dotenv";
import { GeminiAIServiceNew } from "./src/utils/ai/gemini-api-new.js";
import { nodeEnvSetup } from "./src/utils/ai/node-env-setup.js";

dotenv.config();

async function generateMeta() {
  try {
    console.log("🤖 Initializing AI Service...");
    const config = nodeEnvSetup.getConfig();
    const service = new GeminiAIServiceNew(config);
    await service.initialize();
    
    const startTime = Date.now();
    const result = await service.generateMetaDescription({
      title: "${title}",
      content: "${content}",
      keywords: [${keywords
        .split(",")
        .map((k) => `"${k.trim()}"`)
        .join(", ")}],
      language: "${language}"
    });
    const duration = Date.now() - startTime;
    
    console.log("\\n✅ Meta Description Generated:");
    console.log(\`"$\{result\}"\`);
    console.log(\`\\nLength: $\{result.length\} characters\`);
    console.log(\`Response Time: $\{duration\}ms\`);
  } catch (error) {
    console.error("❌ Generation failed:", error.message);
  }
}

generateMeta();
`;

  fs.writeFileSync("temp-meta-test.js", testScript);

  try {
    console.log("\n🚀 Generating meta description...");
    execSync("node temp-meta-test.js", { stdio: "inherit" });
  } finally {
    // Clean up temporary file
    if (fs.existsSync("temp-meta-test.js")) {
      fs.unlinkSync("temp-meta-test.js");
    }
  }
}

async function interactiveKeywordsGeneration() {
  console.log("🔑 Interactive Keywords Generation");
  console.log("==================================");
  console.log("This will create a temporary test script for your content.\n");

  const title = await promptUser("Enter title: ");
  const content = await promptUser("Enter content: ");

  // Create temporary test script
  const testScript = `
import * as dotenv from "dotenv";
import { GeminiAIServiceNew } from "./src/utils/ai/gemini-api-new.js";
import { nodeEnvSetup } from "./src/utils/ai/node-env-setup.js";

dotenv.config();

async function generateKeywords() {
  try {
    console.log("🤖 Initializing AI Service...");
    const config = nodeEnvSetup.getConfig();
    const service = new GeminiAIServiceNew(config);
    await service.initialize();
    
    const startTime = Date.now();
    const result = await service.generateKeywords("${content}", "${title}");
    const duration = Date.now() - startTime;
    
    console.log("\\n✅ Keywords Generated:");
    console.log(result);
    console.log(\`\\nKeywords Count: $\{result.length\}\`);
    console.log(\`Response Time: $\{duration\}ms\`);
  } catch (error) {
    console.error("❌ Generation failed:", error.message);
  }
}

generateKeywords();
`;

  fs.writeFileSync("temp-keywords-test.js", testScript);

  try {
    console.log("\n🚀 Generating keywords...");
    execSync("node temp-keywords-test.js", { stdio: "inherit" });
  } finally {
    // Clean up temporary file
    if (fs.existsSync("temp-keywords-test.js")) {
      fs.unlinkSync("temp-keywords-test.js");
    }
  }
}

async function interactiveCustomGeneration() {
  console.log("🎯 Interactive Custom Content Generation");
  console.log("=======================================");
  console.log("This will create a temporary test script for your prompt.\n");

  const prompt = await promptUser("Enter your custom prompt: ");

  // Create temporary test script
  const testScript = `
import * as dotenv from "dotenv";
import { nodeEnvSetup } from "./src/utils/ai/node-env-setup.js";

dotenv.config();

async function generateCustom() {
  try {
    console.log("🤖 Generating custom content...");
    const startTime = Date.now();
    const result = await nodeEnvSetup.generateContent("${prompt}");
    const duration = Date.now() - startTime;
    
    console.log("\\n✅ Custom Content Generated:");
    console.log(result);
    console.log(\`\\nContent Length: $\{result.length\} characters\`);
    console.log(\`Response Time: $\{duration\}ms\`);
  } catch (error) {
    console.error("❌ Generation failed:", error.message);
  }
}

generateCustom();
`;

  fs.writeFileSync("temp-custom-test.js", testScript);

  try {
    console.log("\n🚀 Generating custom content...");
    execSync("node temp-custom-test.js", { stdio: "inherit" });
  } finally {
    // Clean up temporary file
    if (fs.existsSync("temp-custom-test.js")) {
      fs.unlinkSync("temp-custom-test.js");
    }
  }
}

// Main execution
async function main() {
  // Check for help
  if (
    !command ||
    command === "help" ||
    command === "--help" ||
    command === "-h"
  ) {
    console.log(HELP_TEXT);
    process.exit(0);
  }

  // Check environment
  checkEnvironment();

  // Execute command
  switch (command) {
    case "test":
      runCommand("node quick-ai-test.js", "Running Quick AI System Test");
      break;

    case "test-full":
      runCommand(
        "node test-prompt-changes.js",
        "Running Comprehensive AI Prompt Testing",
      );
      break;

    case "test-env":
      runCommand(
        "node test-node-env.js",
        "Running Detailed Environment Testing",
      );
      break;

    case "meta":
      await interactiveMetaGeneration();
      break;

    case "keywords":
      await interactiveKeywordsGeneration();
      break;

    case "generate":
      await interactiveCustomGeneration();
      break;

    case "metadata":
      runCommand(
        "node geminiseo-metadata-cli.js",
        "Generating Metadata Files for All Posts",
      );
      break;

    case "silent":
      runCommand(
        "node geminiseo-metadata-cli-silent.js",
        "Generating Metadata Files Silently",
      );
      break;

    case "recommend":
      console.log("📚 Content Recommendations");
      console.log("==========================");
      console.log(
        "For content recommendations, please use the comprehensive test:",
      );
      console.log("node ai-cli.js test-full");
      console.log(
        "\nThis will test all AI functions including recommendations.",
      );
      break;

    default:
      console.error(`❌ Unknown command: ${command}`);
      console.log("Run 'node ai-cli.js help' for usage information");
      process.exit(1);
  }
}

// Run the CLI
main().catch((error) => {
  console.error("❌ CLI execution failed:", error.message);
  process.exit(1);
});
