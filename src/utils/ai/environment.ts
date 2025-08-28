import { logger } from "../logging/console-logger";

export interface EnvironmentConfig {
  isDevelopment: boolean;
  isProduction: boolean;
  isGitHubActions: boolean;
  enableAIProcessing: boolean;
  geminiConfig: {
    apiKey: string | undefined;
    model: string;
    rateLimitRPD: number;
    rateLimitRPM: number;
  };
}

export class EnvironmentManager {
  private static instance: EnvironmentManager;
  private config: EnvironmentConfig;

  private constructor() {
    this.config = this.loadEnvironmentConfig();
  }

  static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager();
    }
    return EnvironmentManager.instance;
  }

  private loadEnvironmentConfig(): EnvironmentConfig {
    const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
    const isDevelopment = process.env.NODE_ENV === "development";
    const isProduction =
      process.env.NODE_ENV === "production" || isGitHubActions;

    return {
      isDevelopment,
      isProduction,
      isGitHubActions,
      enableAIProcessing: this.shouldEnableAIProcessing(
        isGitHubActions,
        isDevelopment,
      ),
      geminiConfig: {
        apiKey: process.env.GOOGLE_API_KEY,
        model: process.env.GOOGLE_MODEL || "gemini-2.5-flash",
        rateLimitRPD: parseInt(process.env.GOOGLE_RATE_LIMIT_RPD || "500"),
        rateLimitRPM: parseInt(process.env.GOOGLE_RATE_LIMIT_RPM || "15"),
      },
    };
  }

  private shouldEnableAIProcessing(
    isGitHubActions: boolean,
    isDevelopment: boolean,
  ): boolean {
    // Enable AI processing only on localhost, not in GitHub Actions
    if (isGitHubActions) {
      logger.log("GitHub Actions detected - AI processing disabled", "warning");
      return false;
    }

    // Allow AI processing in development builds (even if NODE_ENV is production)
    // This allows AI processing during local builds
    const isLocalBuild =
      !process.env.GITHUB_ACTIONS &&
      process.env.ENABLE_AI_PROCESSING === "true";

    if (isLocalBuild) {
      logger.log("Local build detected - AI processing enabled", "success");
    } else if (!isDevelopment) {
      logger.log(
        "Production environment detected - AI processing disabled",
        "warning",
      );
      return false;
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      logger.log("No Gemini API key found - AI processing disabled", "warning");
      return false;
    }

    logger.log("AI processing enabled", "success");
    return true;
  }

  getConfig(): EnvironmentConfig {
    return this.config;
  }

  isAIAvailable(): boolean {
    return this.config.enableAIProcessing && !!this.config.geminiConfig.apiKey;
  }

  getGeminiConfig() {
    return this.config.geminiConfig;
  }

  getEnvironmentInfo(): string {
    return (
      `Environment: ${this.config.isDevelopment ? "Development" : "Production"}, ` +
      `GitHub Actions: ${this.config.isGitHubActions ? "Yes" : "No"}, ` +
      `AI Processing: ${this.config.enableAIProcessing ? "Enabled" : "Disabled"}`
    );
  }
}
