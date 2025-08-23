import { SmartProcessor } from "./smart-processor";
import { EnvironmentManager } from "./environment";

/**
 * AI Build Trigger
 * This function is called during the build process to ensure AI processing happens
 * It will process content and generate AI metadata if AI is available
 */
export async function triggerAIBuildProcessing() {
  console.log("🤖 AI Build Trigger - Starting AI processing...");

  const environment = EnvironmentManager.getInstance();

  if (!environment.isAIAvailable()) {
    console.log(
      "🔒 AI processing disabled - skipping build-time AI processing",
    );
    return;
  }

  console.log("✅ AI processing enabled - processing content...");

  try {
    const processor = new SmartProcessor();

    // Get processing stats
    const stats = await processor.getProcessingStats();
    console.log(
      `📊 AI Processing Stats: ${stats.totalFiles} total files, ${stats.validFiles} valid, ${stats.invalidFiles} invalid`,
    );

    // Validate all data
    await processor.validateAllData();

    console.log("✅ AI Build Trigger - Processing completed successfully");
  } catch (error) {
    console.error("❌ AI Build Trigger - Processing failed:", error);
  }
}

/**
 * Test AI functionality during build
 * This function can be called to test if AI is working
 */
export async function testAIFunctionality() {
  console.log("🧪 Testing AI functionality during build...");

  const environment = EnvironmentManager.getInstance();
  const envInfo = environment.getEnvironmentInfo();

  console.log(`📋 Environment: ${envInfo}`);

  if (environment.isAIAvailable()) {
    console.log("✅ AI is available and ready for processing");
    return true;
  } else {
    console.log("❌ AI is not available for processing");
    return false;
  }
}
