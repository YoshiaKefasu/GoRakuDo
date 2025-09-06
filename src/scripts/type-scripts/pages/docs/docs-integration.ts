/**
 * Docsページ統合初期化 - DRY・KISS原則適用
 * Astroネイティブ + Strict TypeScript + ES Modules
 */

import { getLogger } from './shared-logger.js';
import { goHome, goToInvitation } from './shared-navigation.js';

/**
 * Docsページ専用ナビゲーション設定
 * DRY原則: ナビゲーション機能の一元化
 */
export function setupDocsNavigation(): void {
  const logger = getLogger();
  logger.log("Setting up docs navigation...", "info");

  // 共通ナビゲーション関数をグローバルに設定
  if (window) {
    window.goHome = goHome;
    window.goToPosts = function () {
      logger.log("Already on docs page...", "info");
      window.location.reload();
    };
    window.goToInvitation = goToInvitation;
  }

  logger.log("Docs navigation setup complete", "success");
}

/**
 * Tagポップアップ機能の初期化
 * DRY原則: Tag機能の一元化
 */
export function initializeTagPopups(): void {
  const logger = getLogger();
  logger.log("Initializing minimalist tag popups...", "info");

  const tagContainers = document.querySelectorAll(".post-tags");

  tagContainers.forEach((container) => {
    const moreButton = container.querySelector(".post-tag-more");
    if (!moreButton) return;

    const containerElement = container as HTMLElement;
    const allTags = JSON.parse(containerElement.dataset.allTags || "[]");
    const hiddenTags = allTags.slice(3);

    if (hiddenTags.length === 0) return;

    let popup: HTMLElement | null = null;

    // ポップアップ作成関数
    function createPopup(): void {
      popup = document.createElement("div");
      popup.className = "tag-popup";

      const header = document.createElement("div");
      header.className = "tag-popup-header";
      header.textContent = "Tag Lain-nya:";

      const content = document.createElement("div");
      content.className = "tag-popup-content";

      hiddenTags.forEach((tag: string) => {
        const tagElement = document.createElement("span");
        tagElement.className = "tag-popup-tag";
        tagElement.textContent = tag;
        content.appendChild(tagElement);
      });

      popup.appendChild(header);
      popup.appendChild(content);
      container.appendChild(popup);
    }

    // ポップアップ表示関数
    function showPopup(): void {
      if (!popup) createPopup();
      if (popup) {
        popup.classList.add("show");
        popup.setAttribute("aria-hidden", "false");
        moreButton?.setAttribute("aria-expanded", "true");
      }
    }

    // ポップアップ非表示関数
    function hidePopup(): void {
      if (popup) {
        popup.classList.remove("show");
        popup.setAttribute("aria-hidden", "true");
        moreButton?.setAttribute("aria-expanded", "false");
      }
    }

    // イベントリスナー設定
    moreButton?.addEventListener("mouseenter", showPopup);
    moreButton?.addEventListener("mouseleave", hidePopup);

    // タッチサポート（モバイル）
    moreButton?.addEventListener("touchstart", (e) => {
      e.preventDefault();
      if (popup && popup.classList.contains("show")) {
        hidePopup();
      } else {
        showPopup();
      }
    });

    // アクセシビリティ - キーボードサポート
    moreButton?.addEventListener("keydown", (e) => {
      const keyEvent = e as KeyboardEvent;
      if (keyEvent.key === "Enter" || keyEvent.key === " ") {
        e.preventDefault();
        if (popup && popup.classList.contains("show")) {
          hidePopup();
        } else {
          showPopup();
        }
      }
      if (keyEvent.key === "Escape") {
        hidePopup();
      }
    });

    // ARIA属性設定
    moreButton.setAttribute("role", "button");
    moreButton.setAttribute("aria-expanded", "false");
    moreButton.setAttribute("aria-haspopup", "true");
    moreButton.setAttribute("tabindex", "0");
    moreButton.setAttribute(
      "aria-label",
      `Tampilkan ${hiddenTags.length} tag lainnya`
    );
  });

  logger.log("Tag popups initialized", "success");
}

/**
 * Docsページ全体の統合初期化
 * KISS原則: シンプルな初期化処理
 */
export function initializeDocsPage(): void {
  const logger = getLogger();
  logger.log("GoRakuDo Docs Page Loading...", "info");

  // DOM読み込み完了時の初期化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setupDocsNavigation();
      initializeTagPopups();
      logger.log("Docs Page Loaded Successfully!", "success");
    });
  } else {
    setupDocsNavigation();
    initializeTagPopups();
    logger.log("Docs Page Loaded Successfully!", "success");
  }
}

// 自動初期化（ES Modules準拠）
if (typeof window !== "undefined") {
  initializeDocsPage();
}
