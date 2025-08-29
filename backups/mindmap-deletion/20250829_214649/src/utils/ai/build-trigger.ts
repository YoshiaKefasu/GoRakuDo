import { SmartProcessor } from "./smart-processor";
import { EnvironmentManager } from "./environment";
import { logger } from "../logging/console-logger";

/**
 * AI Build Trigger
 * This function is called during the build process to ensure AI processing happens
 * It will process content and generate AI metadata if AI is available
 */
export async function triggerAIBuildProcessing() {
  logger.startGroup("AI Build Trigger");
  logger.log("Starting AI processing...");

  const environment = EnvironmentManager.getInstance();

  if (!environment.isAIAvailable()) {
    logger.log(
      "AI processing disabled - skipping build-time AI processing",
      "warning",
    );
    logger.endGroup();
    return;
  }

  logger.log("AI processing enabled - processing content...", "success");

  try {
    const processor = new SmartProcessor();

    // Get processing stats
    const stats = await processor.getProcessingStats();
    logger.logSummary("AI Processing Stats", {
      "Total files": stats.totalFiles,
      "Valid files": stats.validFiles,
      "Invalid files": stats.invalidFiles,
    });

    // Validate all data
    await processor.validateAllData();

    logger.log("Processing completed successfully", "success");
  } catch (error) {
    logger.log(`Processing failed: ${error}`, "error");
  } finally {
    logger.endGroup();
  }
}

/**
 * Test AI functionality during build
 * This function can be called to test if AI is working
 */
export async function testAIFunctionality() {
  logger.startGroup("AI Functionality Test");
  logger.log("Testing AI functionality during build...");

  const environment = EnvironmentManager.getInstance();
  const envInfo = environment.getEnvironmentInfo();

  logger.log(`Environment: ${envInfo}`);

  if (environment.isAIAvailable()) {
    logger.log("AI is available and ready for processing", "success");
    logger.endGroup();
    return true;
  } else {
    logger.log("AI is not available for processing", "error");
    logger.endGroup();
    return false;
  }
}
