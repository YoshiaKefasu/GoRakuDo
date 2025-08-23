// Discord-based error reporting system for user feedback

export interface DiscordErrorReport {
  type: string;
  message: string;
  details?: any;
  timestamp: string;
  url: string;
  userAgent: string;
  enhancement?: string;
  performance?: {
    loadTime: number;
    memory?: number;
    connection?: string;
  };
}

export interface DiscordErrorUI {
  showErrorNotification: (error: DiscordErrorReport) => void;
  showDiscordInvite: () => void;
  collectUserFeedback: (error: DiscordErrorReport) => Promise<string>;
}

export class DiscordErrorReporter {
  private static instance: DiscordErrorReporter;
  private errorQueue: DiscordErrorReport[] = [];
  private maxQueueSize = 20;
  private discordInviteUrl = "https://discord.gg/gorakudo";

  static getInstance(): DiscordErrorReporter {
    if (!DiscordErrorReporter.instance) {
      DiscordErrorReporter.instance = new DiscordErrorReporter();
    }
    return DiscordErrorReporter.instance;
  }

  // Report an error with Discord integration
  reportError(error: DiscordErrorReport): void {
    this.errorQueue.push(error);

    // Keep queue size manageable
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue = this.errorQueue.slice(-this.maxQueueSize);
    }

    // Store in localStorage for persistence
    this.persistErrorQueue();

    // Show user-friendly error notification
    this.showUserFriendlyError(error);

    // Log for development
    console.error(
      `[Discord Error Report] ${error.type}: ${error.message}`,
      error,
    );
  }

  // Show user-friendly error notification with Discord invite
  private showUserFriendlyError(error: DiscordErrorReport): void {
    if (typeof window === "undefined") return;

    // Create error notification
    const notification = document.createElement("div");
    notification.className = "discord-error-notification";
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #8b5dff, #7b4def);
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(139, 93, 255, 0.3);
      z-index: 10000;
      max-width: 350px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      line-height: 1.5;
      transform: translateX(400px);
      transition: transform 0.3s ease;
    `;

    // Create error message based on type
    const errorMessage = this.getErrorMessage(error);

    notification.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <div style="flex-shrink: 0; margin-top: 2px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <div style="flex: 1;">
          <div style="font-weight: 600; margin-bottom: 4px;">Oops! Ada masalah kecil</div>
          <div style="margin-bottom: 12px; opacity: 0.9;">${errorMessage}</div>
          <div style="display: flex; gap: 8px;">
            <button onclick="window.discordErrorReporter.joinDiscord()" style="
              background: rgba(255, 255, 255, 0.2);
              border: 1px solid rgba(255, 255, 255, 0.3);
              color: white;
              padding: 6px 12px;
              border-radius: 6px;
              font-size: 12px;
              cursor: pointer;
              transition: all 0.2s ease;
            " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
              Laporkan di Discord
            </button>
            <button onclick="window.discordErrorReporter.dismissError(this)" style="
              background: transparent;
              border: 1px solid rgba(255, 255, 255, 0.3);
              color: white;
              padding: 6px 12px;
              border-radius: 6px;
              font-size: 12px;
              cursor: pointer;
              transition: all 0.2s ease;
            " onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">
              Tutup
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      this.dismissError(notification);
    }, 10000);
  }

  // Get user-friendly error message based on error type
  private getErrorMessage(error: DiscordErrorReport): string {
    switch (error.type) {
      case "enhancement-load-error":
        return "Fitur tambahan tidak dapat dimuat. Ini tidak mempengaruhi fungsi utama situs.";
      case "performance-error":
        return "Ada masalah dengan performa halaman. Coba refresh halaman.";
      case "content-load-error":
        return "Konten tidak dapat dimuat dengan sempurna. Coba refresh halaman.";
      case "network-error":
        return "Masalah koneksi terdeteksi. Periksa koneksi internet Anda.";
      default:
        return "Terjadi kesalahan yang tidak terduga. Tim kami akan segera memperbaikinya.";
    }
  }

  // Join Discord server
  joinDiscord(): void {
    if (typeof window !== "undefined") {
      window.open(this.discordInviteUrl, "_blank");

      // Show success message
      this.showDiscordSuccess();
    }
  }

  // Show Discord success message
  private showDiscordSuccess(): void {
    if (typeof window === "undefined") return;

    const successNotification = document.createElement("div");
    successNotification.className = "discord-success-notification";
    successNotification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
      z-index: 10001;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      transform: translateX(400px);
      transition: transform 0.3s ease;
    `;

    successNotification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22,4 12,14.01 9,11.01"></polyline>
        </svg>
        <span>Terima kasih! Discord akan terbuka di tab baru.</span>
      </div>
    `;

    document.body.appendChild(successNotification);

    // Animate in
    setTimeout(() => {
      successNotification.style.transform = "translateX(0)";
    }, 100);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      this.dismissError(successNotification);
    }, 3000);
  }

  // Dismiss error notification
  dismissError(element: HTMLElement): void {
    element.style.transform = "translateX(400px)";
    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }, 300);
  }

  // Collect user feedback for Discord
  async collectUserFeedback(error: DiscordErrorReport): Promise<string> {
    return new Promise((resolve) => {
      if (typeof window === "undefined") {
        resolve("Feedback tidak tersedia");
        return;
      }

      const feedback = prompt(
        `Bantu kami memperbaiki masalah ini!\n\n` +
          `Jelaskan apa yang Anda lakukan saat error terjadi:\n` +
          `(Kosongkan jika tidak ingin memberikan feedback)`,
        "",
      );

      resolve(feedback || "Tidak ada feedback");
    });
  }

  // Persist error queue to localStorage
  private persistErrorQueue(): void {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        localStorage.setItem(
          "gorakudo-discord-errors",
          JSON.stringify(this.errorQueue),
        );
      } catch (error) {
        console.warn("Could not persist error queue:", error);
      }
    }
  }

  // Load error queue from localStorage
  loadErrorQueue(): void {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        const stored = localStorage.getItem("gorakudo-discord-errors");
        if (stored) {
          this.errorQueue = JSON.parse(stored);
        }
      } catch (error) {
        console.warn("Could not load error queue:", error);
      }
    }
  }

  // Get error queue for Discord reporting
  getErrorQueue(): DiscordErrorReport[] {
    return [...this.errorQueue];
  }

  // Clear error queue
  clearErrorQueue(): void {
    this.errorQueue = [];
    this.persistErrorQueue();
  }

  // Generate Discord report text
  generateDiscordReport(): string {
    const report = this.errorQueue
      .map((error) => {
        return (
          `**${error.type}** - ${error.timestamp}\n` +
          `Message: ${error.message}\n` +
          `URL: ${error.url}\n` +
          `User Agent: ${error.userAgent.substring(0, 100)}...\n` +
          `---`
        );
      })
      .join("\n\n");

    return `# GoRakuDo Error Report\n\n${report}`;
  }
}

// Global instance
export const discordErrorReporter = DiscordErrorReporter.getInstance();

// Make available globally for static hosting compatibility
if (typeof window !== "undefined") {
  (window as any).discordErrorReporter = discordErrorReporter;
  discordErrorReporter.loadErrorQueue();
}
