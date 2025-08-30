import { logger } from "../logging/console-logger";

export interface EnvironmentConfig {
  isDevelopment: boolean;
  isProduction: boolean;
  isGitHubActions: boolean;
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

    };
  }

  private shouldEnableAIProcessing(
    isGitHubActions: boolean,
    isDevelopment: boolean,
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
      `Environment: ${this.config.isDevelopment ? "Development" : "Production"}, ` +
      `GitHub Actions: ${this.config.isGitHubActions ? "Yes" : "No"}, ` +
      `AI Processing: ${this.config.enableAIProcessing ? "Enabled" : "Disabled"}`
    );
  }
}
