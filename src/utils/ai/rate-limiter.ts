import NodeCache from 'node-cache';

export class RateLimiter {
  private dailyCache: NodeCache;
  private minuteCache: NodeCache;
  private dailyLimit: number;
  private minuteLimit: number;

  constructor(dailyLimit: number = 500, minuteLimit: number = 15) {
    this.dailyLimit = dailyLimit;
    this.minuteLimit = minuteLimit;
    this.dailyCache = new NodeCache({ stdTTL: 86400 }); // 24 hours
    this.minuteCache = new NodeCache({ stdTTL: 60 }); // 1 minute
  }

  async checkLimit(): Promise<void> {
    const now = Date.now();
    const dayKey = new Date().toDateString();
    const minuteKey = Math.floor(now / 60000).toString();

    const dailyCount = this.dailyCache.get<number>(dayKey) || 0;
    const minuteCount = this.minuteCache.get<number>(minuteKey) || 0;

    if (dailyCount >= this.dailyLimit) {
      throw new Error(
        `Daily rate limit exceeded: ${dailyCount}/${this.dailyLimit}`
      );
    }

    if (minuteCount >= this.minuteLimit) {
      throw new Error(
        `Minute rate limit exceeded: ${minuteCount}/${this.minuteLimit}`
      );
    }

    this.dailyCache.set(dayKey, dailyCount + 1);
    this.minuteCache.set(minuteKey, minuteCount + 1);
  }

  getDailyUsage(): number {
    const dayKey = new Date().toDateString();
    return this.dailyCache.get<number>(dayKey) || 0;
  }

  getRemainingDaily(): number {
    return this.dailyLimit - this.getDailyUsage();
  }

  getMinuteUsage(): number {
    const minuteKey = Math.floor(Date.now() / 60000).toString();
    return this.minuteCache.get<number>(minuteKey) || 0;
  }

  getRemainingMinute(): number {
    return this.minuteLimit - this.getMinuteUsage();
  }

  resetDaily(): void {
    const dayKey = new Date().toDateString();
    this.dailyCache.del(dayKey);
  }

  resetMinute(): void {
    const minuteKey = Math.floor(Date.now() / 60000).toString();
    this.minuteCache.del(minuteKey);
  }

  getUsageStats(): {
    dailyUsage: number;
    dailyRemaining: number;
    minuteUsage: number;
    minuteRemaining: number;
    dailyLimit: number;
    minuteLimit: number;
  } {
    return {
      dailyUsage: this.getDailyUsage(),
      dailyRemaining: this.getRemainingDaily(),
      minuteUsage: this.getMinuteUsage(),
      minuteRemaining: this.getRemainingMinute(),
      dailyLimit: this.dailyLimit,
      minuteLimit: this.minuteLimit,
    };
  }
}
