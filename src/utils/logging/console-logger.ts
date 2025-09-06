/**
 * Console Logger Utility
 * Provides clean, organized console logging for the AI build process
 */

export interface LogGroup {
  title: string;
  logs: string[];
  startTime?: number;
}

export class ConsoleLogger {
  private static instance: ConsoleLogger;
  private currentGroup: LogGroup | null = null;
  private groups: LogGroup[] = [];
  private isVerboseMode = false;
  private isBuildMode = false;
  private criticalErrorsOnly = true; // Only show critical errors

  constructor() {
    // Auto-detect build mode based on environment
    this.isBuildMode = this.detectBuildMode();
  }

  /**
   * Auto-detect if we're in a build environment
   */
  private detectBuildMode(): boolean {
    // Check for common build environment indicators
    return (
      process.env.NODE_ENV === 'production' ||
      process.env.ASTRO_ENV === 'build' ||
      (typeof process !== 'undefined' && process.argv.includes('build')) ||
      (typeof process !== 'undefined' && process.argv.includes('astro')) ||
      false
    );
  }

  static getInstance(): ConsoleLogger {
    if (!ConsoleLogger.instance) {
      ConsoleLogger.instance = new ConsoleLogger();
    }
    return ConsoleLogger.instance;
  }

  /**
   * Force build mode for all instances
   */
  static setGlobalBuildMode(enabled: boolean): void {
    if (ConsoleLogger.instance) {
      ConsoleLogger.instance.setBuildMode(enabled);
    }
    // Also set for future instances
    ConsoleLogger.prototype.isBuildMode = enabled;
  }

  /**
   * Set global critical errors only mode
   */
  static setGlobalCriticalErrorsOnly(enabled: boolean): void {
    if (ConsoleLogger.instance) {
      ConsoleLogger.instance.setCriticalErrorsOnly(enabled);
    }
    // Also set for future instances
    ConsoleLogger.prototype.criticalErrorsOnly = enabled;
  }

  /**
   * Start a new log group
   */
  startGroup(title: string): void {
    if (this.currentGroup) {
      this.endGroup();
    }

    this.currentGroup = {
      title,
      logs: [],
      startTime: performance.now(),
    };

    // Only show for critical errors
    if (!this.isBuildMode && !this.criticalErrorsOnly) {
      console.log(`\n${'='.repeat(50)}`);
      console.log(`🚀 ${title}`);
      console.log(`${'='.repeat(50)}`);
    }
  }

  /**
   * End the current log group
   */
  endGroup(): void {
    if (!this.currentGroup) return;

    const duration = this.currentGroup.startTime
      ? ` (${(performance.now() - this.currentGroup.startTime).toFixed(2)}ms)`
      : '';

    // Only show for critical errors
    if (!this.isBuildMode && !this.criticalErrorsOnly) {
      console.log(`${'='.repeat(50)}`);
      console.log(`✅ ${this.currentGroup.title}${duration}`);
      console.log(`${'='.repeat(50)}\n`);
    }

    this.groups.push(this.currentGroup);
    this.currentGroup = null;
  }

  /**
   * Log a message within the current group
   */
  log(
    message: string,
    level: 'info' | 'success' | 'warning' | 'error' = 'info'
  ): void {
    const emoji = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
    }[level];

    const formattedMessage = `${emoji} ${message}`;

    if (this.currentGroup) {
      this.currentGroup.logs.push(formattedMessage);
    }

    // Only show critical errors, suppress everything else
    if (
      !this.isBuildMode &&
      (this.criticalErrorsOnly ? level === 'error' : true)
    ) {
      console.log(formattedMessage);
    }
  }

  /**
   * Log a summary of processing results
   */
  logSummary(title: string, data: Record<string, unknown>): void {
    // Only show for critical errors
    if (!this.isBuildMode && !this.criticalErrorsOnly) {
      console.log(`\n📊 ${title}:`);
      Object.entries(data).forEach(([key, value]) => {
        const formattedValue =
          typeof value === 'number' && value > 1000
            ? value.toLocaleString()
            : value;
        console.log(`   ${key}: ${formattedValue}`);
      });
    }
  }

  /**
   * Log word-to-link conversion results in a clean format
   */
  logWordToLinkResults(
    slug: string, 
    stats: { 
      convertedWords?: number; 
      totalWords?: number; 
      processingTime?: number; 
      [key: string]: unknown; 
    }, 
    conversions: Array<{ 
      from: string; 
      to: string; 
      count: number; 
      originalWord?: string; 
      targetTitle?: string; 
    }>
  ): void {
    // Only show for critical errors
    if (!this.isBuildMode && !this.criticalErrorsOnly) {
      console.log(`\n🔗 Word-to-Link Results for "${slug}":`);
      console.log(
        `   📊 Stats: ${stats.convertedWords || 0}/${stats.totalWords || 0} words converted`
      );
      console.log(`   ⏱️  Time: ${(stats.processingTime || 0).toFixed(2)}ms`);

      if (conversions.length > 0) {
        console.log(`   🔗 Conversions:`);
        conversions.slice(0, 3).forEach((conv, index) => {
          console.log(
            `     ${index + 1}. "${conv.originalWord || conv.from}" → "${conv.targetTitle || conv.to}"`
          );
        });
        if (conversions.length > 3) {
          console.log(`     ... and ${conversions.length - 3} more`);
        }
      }
    }
  }

  /**
   * Log pagination information in a clean format
   */
  logPaginationInfo(
    totalPosts: number,
    postsPerPage: number,
    currentPage: number
  ): void {
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = Math.min(startIndex + postsPerPage, totalPosts);

    // Only show for critical errors
    if (!this.isBuildMode && !this.criticalErrorsOnly) {
      console.log(`\n📄 Pagination Summary:`);
      console.log(`   📚 Total posts: ${totalPosts.toLocaleString()}`);
      console.log(`   📖 Posts per page: ${postsPerPage}`);
      console.log(`   📑 Total pages: ${totalPages}`);
      console.log(`   🎯 Current page: ${currentPage}`);
      console.log(`   👁️  Showing posts: ${startIndex + 1} to ${endIndex}`);
    }
  }

  /**
   * Set verbose mode for detailed logging
   */
  setVerboseMode(enabled: boolean): void {
    this.isVerboseMode = enabled;
  }

  /**
   * Set build mode to suppress console output during builds
   */
  setBuildMode(enabled: boolean): void {
    this.isBuildMode = enabled;
  }

  /**
   * Set critical errors only mode
   */
  setCriticalErrorsOnly(enabled: boolean): void {
    this.criticalErrorsOnly = enabled;
  }

  /**
   * Log only if verbose mode is enabled
   */
  verbose(message: string): void {
    if (this.isVerboseMode && !this.isBuildMode && !this.criticalErrorsOnly) {
      console.log(`🔍 ${message}`);
    }
  }

  /**
   * Log content preview (truncated)
   */
  logContentPreview(
    title: string,
    content: string,
    maxLength = 150
  ): void {
    const preview =
      content.length > maxLength
        ? content.substring(0, maxLength) + '...'
        : content;

    // Only show for critical errors
    if (!this.isBuildMode && !this.criticalErrorsOnly) {
      console.log(`📝 ${title}:`);
      console.log(`   ${preview}`);
    }
  }
}

// Export singleton instance
export const logger = ConsoleLogger.getInstance();
