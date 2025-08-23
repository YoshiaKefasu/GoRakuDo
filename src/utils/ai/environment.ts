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
      console.log("🔒 GitHub Actions detected - AI processing disabled");
      return false;
    }

    // Allow AI processing in development builds (even if NODE_ENV is production)
    // This allows AI processing during local builds
    const isLocalBuild =
      !process.env.GITHUB_ACTIONS &&
      process.env.ENABLE_AI_PROCESSING === "true";

    if (isLocalBuild) {
      console.log("✅ Local build detected - AI processing enabled");
    } else if (!isDevelopment) {
      console.log(
        "🔒 Production environment detected - AI processing disabled",
      );
      return false;
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ No Gemini API key found - AI processing disabled");
      return false;
    }

    console.log("✅ AI processing enabled");
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
