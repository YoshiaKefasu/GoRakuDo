import { logger } from "../logging/console-logger";

export interface EnvironmentConfig {
  isProduction: boolean;
  enableAIProcessing: boolean;
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
    // const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
    // const isDevelopment = process.env.NODE_ENV === "development";
    const isProduction = process.env.NODE_ENV === "production";

    return {
      isProduction,
      enableAIProcessing: this.shouldEnableAIProcessing(
        false, // isGitHubActions
        false, // isDevelopment
      ),

    };
  }

  private shouldEnableAIProcessing(
    _isGitHubActions: boolean,
    _isDevelopment: boolean,
  ): boolean {
    // AI processing is disabled for security
    logger.log("AI processing disabled for security", "warning");
    return false;
  }

  getConfig(): EnvironmentConfig {
    return this.config;
  }

  isAIAvailable(): boolean {
    return false; // AI processing disabled for security
  }

  getEnvironmentInfo(): string {
    return (
      `Environment: Production, ` +
      `GitHub Actions: No, ` +
      `AI Processing: ${this.config.enableAIProcessing ? "Enabled" : "Disabled"}`
    );
  }
}
