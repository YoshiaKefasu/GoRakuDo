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

  private loadConfig() {
    // AI processing disabled for security
    return {};
  }

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

  async generateContent(prompt: string): Promise<string> {
    if (!this.ai) {
      await this.initializeAI();
    }

    try {
      const response = await this.ai!.models.generateContent({
        model: this.config.model,
        contents: prompt,
      });

      return response.text || "No response generated";
    } catch (error) {
      console.error("❌ Content generation failed:", error);
      throw error;
    }
  }

  async generateContentWithOptions(
    prompt: string,
    options: GenerationConfig = {},
  ): Promise<string> {
    if (!this.ai) {
      await this.initializeAI();
    }

    try {
      const response = await this.ai!.models.generateContent({
        model: this.config.model,
        contents: prompt,
        config: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxOutputTokens || 1024,
          topP: options.topP || 0.8,
          topK: options.topK || 40,
        },
      });

      return response.text || "No response generated";
    } catch (error) {
      console.error("❌ Content generation with options failed:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const nodeEnvSetup = NodeEnvSetup.getInstance();
