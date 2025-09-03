// Enhanced error handler with proper TypeScript definitions for static hosting

// Type definitions
export interface ErrorContext {
  component?: string;
  action?: string;
  userAgent?: string;
  timestamp: string;
  url: string;
  stack?: string; // Add stack property to interface
}

export interface ErrorLogEntry {
  timestamp: string;
  type: string;
  message: string;
  context?: ErrorContext;
  stack?: string;
}

export type ErrorType =
  | "performance"
  | "content"
  | "routing"
  | "network"
  | "interaction"
  | "system";

export class HybridErrorHandler {
  private static instance: HybridErrorHandler;
  private errorLog: ErrorLogEntry[] = [];
  private maxLogSize = 100; // Prevent memory leaks

  static getInstance(): HybridErrorHandler {
    if (!HybridErrorHandler.instance) {
      HybridErrorHandler.instance = new HybridErrorHandler();
    }
    return HybridErrorHandler.instance;
  }

  logError(
    type: ErrorType,
    message: string,
    context?: Partial<ErrorContext>,
  ): void {
    const errorEntry: ErrorLogEntry = {
      timestamp: new Date().toISOString(),
      type,
      message,
      context: {
        timestamp: new Date().toISOString(),
        url: typeof window !== "undefined" ? window.location.href : "unknown",
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
        ...context,
      },
    };

    // Add stack trace if available
    if (typeof Error !== "undefined") {
      const error = new Error();
      if (error.stack) {
        errorEntry.stack = error.stack;
      }
    }

    this.errorLog.push(errorEntry);

    // Prevent memory leaks
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize);
    }

    // Log to console for development
    if (typeof window !== "undefined") {
      console.error(`[${type}] ${message}`, context || "");
    }

    // Store in localStorage for persistence (static hosting compatible)
    this.persistToStorage();
  }

  getErrorLog(): ErrorLogEntry[] {
    return [...this.errorLog];
  }

  clearLog(): void {
    this.errorLog = [];
    this.clearFromStorage();
  }

  getErrorsByType(type: ErrorType): ErrorLogEntry[] {
    return this.errorLog.filter((error) => error.type === type);
  }

  getRecentErrors(count: number = 10): ErrorLogEntry[] {
    return this.errorLog.slice(-count);
  }

  // Static hosting compatible persistence
  private persistToStorage(): void {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        localStorage.setItem(
          "gorakudo-error-log",
          JSON.stringify(this.errorLog),
        );
      } catch (error) {
        console.warn("Could not save error log to localStorage:", error);
      }
    }
  }

  private clearFromStorage(): void {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        localStorage.removeItem("gorakudo-error-log");
      } catch (error) {
        console.warn("Could not clear error log from localStorage:", error);
      }
    }
  }

  loadFromStorage(): void {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        const stored = localStorage.getItem("gorakudo-error-log");
        if (stored) {
          this.errorLog = JSON.parse(stored);
        }
      } catch (error) {
        console.warn("Could not load error log from localStorage:", error);
      }
    }
  }

  // Enhanced error reporting for static hosting
  reportError(error: Error, context?: Partial<ErrorContext>): void {
    const errorContext: Partial<ErrorContext> = {
      ...context
    };

    // Handle optional stack property with exactOptionalPropertyTypes
    if (error.stack !== undefined) {
      (errorContext as any).stack = error.stack;
    }

    this.logError("system", error.message, errorContext);
  }

  // Performance monitoring for static hosting
  logPerformance(
    metric: string,
    value: number,
    context?: Partial<ErrorContext>,
  ): void {
    this.logError("performance", `${metric}: ${value}ms`, context);
  }
}

// Global instance
export const errorHandler = HybridErrorHandler.getInstance();

// Load existing errors on initialization
if (typeof window !== "undefined") {
  errorHandler.loadFromStorage();
}
