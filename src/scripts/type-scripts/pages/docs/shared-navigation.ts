/**
 * 共通ナビゲーション機能 - docs/と[slug]/共通
 * DRY原則: ナビゲーション機能の一元化
 * Astroネイティブ + Strict TypeScript + ES Modules
 */

import { getLogger } from './shared-logger.js';

/**
 * 共通ナビゲーション関数
 * KISS原則: シンプルで再利用可能なナビゲーション
 */
export function goHome(): void {
  const logger = getLogger();
  logger.log("Navigating to home...", "info");
  window.location.href = "/";
}

export function goToDocs(): void {
  const logger = getLogger();
  logger.log("Navigating to docs...", "info");
  window.location.href = "/docs";
}

export function goToInvitation(): void {
  const logger = getLogger();
  logger.log("Navigating to Discord...", "info");
  window.location.href = "/discord";
}

export function retryLoad(): void {
  const logger = getLogger();
  logger.log("Retrying page load...", "info");
  window.location.reload();
}

/**
 * 投稿URLのコピー機能（モダンAPI使用）
 * DRY原則: クリップボード処理の共通化
 */
export function copyPostUrl(url: string, buttonElement?: HTMLElement): void {
  const fullUrl = window.location.origin + url;

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        // ボタン要素が提供されている場合は視覚的フィードバックを表示
        if (buttonElement) {
          const originalText = buttonElement.textContent;
          buttonElement.textContent = "✅";
          buttonElement.style.color = "#4CAF50";

          setTimeout(() => {
            buttonElement.textContent = originalText;
            buttonElement.style.color = "#8B5DFF";
          }, 2000);
        } else {
          alert("URL copied to clipboard!");
        }
      })
      .catch(() => {
        fallbackCopyTextToClipboard(fullUrl);
      });
  } else {
    fallbackCopyTextToClipboard(fullUrl);
  }
}

/**
 * イベントベースの投稿URLコピー機能（後方互換性用）
 * 既存のHTML onclick属性との互換性を保つ
 */
export function copyPostUrlFromEvent(url: string, event: Event): void {
  const buttonElement = event.target as HTMLElement;
  copyPostUrl(url, buttonElement);
}

/**
 * フォールバック用のクリップボードコピー（モダンAPI使用）
 * KISS原則: フォールバック処理を明確に分離
 */
export function fallbackCopyTextToClipboard(text: string): void {
  // モダンなClipboard APIを優先使用
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert("URL copied to clipboard!");
      })
      .catch(() => {
        // 最終フォールバック: 古いAPIを使用
        legacyCopyTextToClipboard(text);
      });
  } else {
    // 古いブラウザ用のフォールバック
    legacyCopyTextToClipboard(text);
  }
}

/**
 * レガシー用のクリップボードコピー（非推奨API）
 * 古いブラウザサポート用の最終フォールバック
 */
function legacyCopyTextToClipboard(text: string): void {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.top = "-9999px";
  textArea.style.left = "-9999px";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    // 非推奨だが古いブラウザサポートのため残す
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const success = (document as any).execCommand("copy");
    if (success) {
      alert("URL copied to clipboard!");
    } else {
      alert("Failed to copy URL");
    }
  } catch {
    alert("Failed to copy URL");
  }

  document.body.removeChild(textArea);
}

/**
 * 日付のフォーマット
 * DRY原則: 日付処理の共通化
 */
export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const logger = getLogger();

  // Validate input
  if (!dateString || typeof dateString !== "string") {
    logger.log(`Invalid date string provided: ${dateString}`, "warning");
    return "Invalid Date";
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      logger.log(`Invalid date format: ${dateString}`, "warning");
      return "Invalid Date";
    }

    return date.toLocaleDateString("id-ID", options);
  } catch (error) {
    logger.log(`Date formatting error: ${error}`, "error");
    return "Invalid Date";
  }
}

/**
 * 共有機能
 * KISS原則: シンプルな共有機能実装
 */
export function sharePost(): void {
  const logger = getLogger();

  if (navigator.share) {
    navigator.share({
      title: document.title,
      url: window.location.href,
    }).then(() => {
      logger.log("Content shared successfully", "success");
    }).catch((error) => {
      logger.log(`Share failed: ${error}`, "error");
    });
  } else {
    // Fallback: copy URL to clipboard
    navigator.clipboard.writeText(window.location.href).then(() => {
      logger.log("URL copied to clipboard as fallback", "success");
      alert("Link berhasil disalin ke clipboard!");
    }).catch((error) => {
      logger.log(`Clipboard fallback failed: ${error}`, "error");
    });
  }
}

/**
 * スクロールアニメーションの設定
 * DRY原則: アニメーション処理の共通化
 */
export function setupScrollAnimations(): void {
  const logger = getLogger();
  logger.log("Setting up scroll animations...", "info");

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).style.opacity = "1";
        (entry.target as HTMLElement).style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // 投稿カードのアニメーション
  const postCards = document.querySelectorAll(".post-card");
  postCards.forEach((card, index) => {
    (card as HTMLElement).style.opacity = "0";
    (card as HTMLElement).style.transform = "translateY(30px)";
    (card as HTMLElement).style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
  });

  logger.log("Scroll animations setup complete", "success");
}

/**
 * ナビバーのスクロール効果
 * KISS原則: スクロール効果を明確に分離
 */
export function handleNavbarScroll(): void {
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    if (window.scrollY > 50) {
      (navbar as HTMLElement).style.background = "rgba(10, 10, 10, 0.95)";
    } else {
      (navbar as HTMLElement).style.background = "rgba(10, 10, 10, 0.9)";
    }
  }
}

/**
 * グローバルナビゲーション関数の設定
 * DRY原則: グローバル関数の一元管理
 */
export function setupGlobalNavigationFunctions(): void {
  const logger = getLogger();
  logger.log("Setting up global navigation functions...", "info");

  const globalWindow = window as unknown as {
    goHome: typeof goHome;
    goToDocs: typeof goToDocs;
    goToInvitation: typeof goToInvitation;
    retryLoad: typeof retryLoad;
    copyPostUrl: typeof copyPostUrlFromEvent;
    sharePost: typeof sharePost;
  };

  globalWindow.goHome = goHome;
  globalWindow.goToDocs = goToDocs;
  globalWindow.goToInvitation = goToInvitation;
  globalWindow.retryLoad = retryLoad;
  globalWindow.copyPostUrl = copyPostUrlFromEvent; // イベントベース版を使用
  globalWindow.sharePost = sharePost;

  logger.log("Global navigation functions setup complete", "success");
}
