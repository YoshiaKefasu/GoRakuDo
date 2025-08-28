import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
import type {
  GoogleGenAIConfig,
  GenerationConfig,
  EnvironmentInfo,
} from "./types";

// Load environment variables
dotenv.config();

export class NodeEnvSetup {
  private static instance: NodeEnvSetup;
  private ai: GoogleGenAI | null = null;
  private config: GoogleGenAIConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  static getInstance(): NodeEnvSetup {
    if (!NodeEnvSetup.instance) {
      NodeEnvSetup.instance = new NodeEnvSetup();
    }
    return NodeEnvSetup.instance;
  }

  private loadConfig(): GoogleGenAIConfig {
    const apiKey = process.env.GOOGLE_API_KEY || "";
    const model = process.env.GOOGLE_MODEL || "gemini-2.5-flash";
    const rateLimitRPD = parseInt(process.env.GOOGLE_RATE_LIMIT_RPD || "500");
    const rateLimitRPM = parseInt(process.env.GOOGLE_RATE_LIMIT_RPM || "15");

    if (!apiKey) {
      console.warn("⚠️ No Google API key found in environment variables");
    }

    return {
      apiKey,
      model,
      rateLimitRPD,
      rateLimitRPM,
    };
  }

  async initializeAI(): Promise<GoogleGenAI> {
    if (!this.ai) {
      if (!this.config.apiKey) {
        throw new Error(
          "No Google API key available. Please set GOOGLE_API_KEY in your .env file.",
        );
      }

      console.log("🤖 Initializing Google GenAI with new package...");
      this.ai = new GoogleGenAI({
        apiKey: this.config.apiKey,
      });

      // Test the connection
      try {
        await this.ai.models.generateContent({
          model: this.config.model,
          contents: "Test connection",
        });
        console.log("✅ Google GenAI initialized successfully");
      } catch (error) {
        console.error("❌ Failed to initialize Google GenAI:", error);
        throw error;
      }
    }

    return this.ai;
  }

  getConfig(): GoogleGenAIConfig {
    return this.config;
  }

  isEnvironmentReady(): boolean {
    return !!this.config.apiKey && !!this.ai;
  }

  getEnvironmentInfo(): EnvironmentInfo {
    return {
      hasApiKey: !!this.config.apiKey,
      model: this.config.model,
      rateLimits: {
        rpd: this.config.rateLimitRPD,
        rpm: this.config.rateLimitRPM,
      },
      isInitialized: !!this.ai,
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      if (!this.ai) {
        await this.initializeAI();
      }

      await this.ai!.models.generateContent({
        model: this.config.model,
        contents: "Hello, this is a test message.",
      });

      console.log("✅ AI connection test successful");
      return true;
    } catch (error) {
      console.error("❌ AI connection test failed:", error);
      return false;
    }
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
