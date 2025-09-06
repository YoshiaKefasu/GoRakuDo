/**
 * ナビゲーション・ユーティリティ関数 - [slug].astro分離スクリプト
 * Astroネイティブ + Strict TypeScript + ES Modules
 * DRY・KISS原則に従った実装
 */

// 共通ナビゲーション機能のインポート
export {
  goHome,
  goToDocs,
  goToInvitation,
  retryLoad,
  copyPostUrl,
  copyPostUrlFromEvent,
  fallbackCopyTextToClipboard,
  formatDate,
  sharePost,
  setupScrollAnimations,
  handleNavbarScroll,
  setupGlobalNavigationFunctions
} from '../shared-navigation.js';