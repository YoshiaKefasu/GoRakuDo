// Progressive Error Handling System
export interface ErrorLevel {
  basic: string;
  enhanced: string;
  detailed: string;
}

export interface ErrorContext {
  component: string;
  action: string;
  timestamp: number;
  userAgent: string;
  performance?: PerformanceEntry[];
}

export class ProgressiveErrorHandler {
  private errorCounts: Map<string, number> = new Map();
  private userPreferences: {
    errorDetailLevel: 'basic' | 'enhanced' | 'detailed';
    showTechnicalDetails: boolean;
    autoReport: boolean;
  } = {
    errorDetailLevel: 'basic',
    showTechnicalDetails: false,
    autoReport: false,
  };

  constructor() {
    this.loadUserPreferences();
  }

  private loadUserPreferences() {
    try {
      const stored = localStorage.getItem('error-handler-preferences');
      if (stored) {
        this.userPreferences = {
          ...this.userPreferences,
          ...JSON.parse(stored),
        };
      }
    } catch (error) {
      console.warn('Could not load error handler preferences:', error);
    }
  }

  private saveUserPreferences() {
    try {
      localStorage.setItem(
        'error-handler-preferences',
        JSON.stringify(this.userPreferences)
      );
    } catch (error) {
      console.warn('Could not save error handler preferences:', error);
    }
  }

  public handleError(error: Error, context: ErrorContext): string {
    const errorKey = `${context.component}:${context.action}`;
    const count = (this.errorCounts.get(errorKey) || 0) + 1;
    this.errorCounts.set(errorKey, count);

    // Progressive enhancement based on error frequency and user preferences
    let message = this.getErrorMessage(error, context, count);

    // Log for debugging
    this.logError(error, context, count);

    return message;
  }

  private getErrorMessage(
    error: Error,
    context: ErrorContext,
    count: number
  ): string {
    const baseMessage = this.getBaseMessage(error, context);

    // Progressive enhancement based on error count
    if (count === 1) {
      return baseMessage;
    } else if (count <= 3) {
      return `${baseMessage}\n\nThis error has occurred ${count} times. We're working on a fix.`;
    } else {
      return `${baseMessage}\n\nThis is a recurring issue (${count} times). Please try refreshing the page or contact support if the problem persists.`;
    }
  }

  private getBaseMessage(error: Error, context: ErrorContext): string {
    switch (this.userPreferences.errorDetailLevel) {
      case 'basic':
        return this.getBasicMessage(error, context);
      case 'enhanced':
        return this.getEnhancedMessage(error, context);
      case 'detailed':
        return this.getDetailedMessage(error, context);
      default:
        return this.getBasicMessage(error, context);
    }
  }

  private getBasicMessage(_error: Error, context: ErrorContext): string {
    const messages: Record<string, string> = {
      'content-loading':
        'Unable to load content. Please try refreshing the page.',
      routing: 'Navigation error. Please check the URL and try again.',
      performance: 'Performance issue detected. The page may be slow to load.',
      network:
        'Network connection issue. Please check your internet connection.',
      default: 'An unexpected error occurred. Please try again.',
    };

    return (
      messages[context.action] ||
      messages.default ||
      '不明なエラーが発生しました'
    );
  }

  private getEnhancedMessage(error: Error, context: ErrorContext): string {
    const basicMessage = this.getBasicMessage(error, context);
    return `${basicMessage}\n\nComponent: ${context.component}\nAction: ${context.action}`;
  }

  private getDetailedMessage(error: Error, context: ErrorContext): string {
    const enhancedMessage = this.getEnhancedMessage(error, context);
    return `${enhancedMessage}\n\nError: ${error.message}\nStack: ${error.stack}`;
  }

  private logError(error: Error, context: ErrorContext, count: number) {
    const logData = {
      error: error.message,
      stack: error.stack,
      context,
      count,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };

    console.error('Progressive Error Handler:', logData);

    // Auto-report if enabled and error is frequent
    if (this.userPreferences.autoReport && count >= 3) {
      this.reportError(logData);
    }
  }

  private async reportError(logData: any) {
    try {
      // In a real implementation, this would send to your error reporting service
      console.log('Auto-reporting error:', logData);
    } catch (error) {
      console.warn('Failed to report error:', error);
    }
  }

  public updatePreferences(preferences: Partial<typeof this.userPreferences>) {
    this.userPreferences = { ...this.userPreferences, ...preferences };
    this.saveUserPreferences();
  }

  public getErrorStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    this.errorCounts.forEach((count, key) => {
      stats[key] = count;
    });
    return stats;
  }
}

// Global error handler instance
export const errorHandler = new ProgressiveErrorHandler();
