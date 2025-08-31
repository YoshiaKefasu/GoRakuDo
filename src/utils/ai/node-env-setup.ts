import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Load environment variables
dotenv.config();

export class NodeEnvSetup {
  private static instance: NodeEnvSetup;

  private constructor() {
    // AI processing disabled for security
  }

  static getInstance(): NodeEnvSetup {
    if (!NodeEnvSetup.instance) {
      NodeEnvSetup.instance = new NodeEnvSetup();
    }
    return NodeEnvSetup.instance;
  }

  // private loadConfig() {
  //   AI processing disabled for security
  //   return {};
  // }

  async initializeAI(): Promise<any> {
    // AI processing disabled for security
    throw new Error("AI processing disabled for security");
  }

  getConfig() {
    return {}; // AI processing disabled
  }

  isEnvironmentReady(): boolean {
    return false; // AI processing disabled
  }

  getEnvironmentInfo() {
    return {
      hasApiKey: false,
      model: "disabled",
      rateLimits: { rpd: 0, rpm: 0 },
      isInitialized: false,
    };
  }

  async testConnection(): Promise<boolean> {
    // AI processing disabled for security
    return false;
  }

  async generateContent(_prompt: string): Promise<string> {
    // AI processing disabled for security
    throw new Error("AI processing disabled for security");
  }

  async generateContentWithOptions(
    _prompt: string,
    _options: any = {},
  ): Promise<string> {
    // AI processing disabled for security
    throw new Error("AI processing disabled for security");
  }
}

// Export singleton instance
export const nodeEnvSetup = NodeEnvSetup.getInstance();
