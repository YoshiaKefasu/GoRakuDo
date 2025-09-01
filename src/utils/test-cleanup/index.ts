// ========== TEST CLEANUP SYSTEM EXPORTS ==========
// テストクリーンアップシステムのメインエクスポート
// 既存システムとの完全統合を保証

// テストクリーンアップ管理システム
export { manageTestCleanup, validateTestCleanup, generateCleanupStatistics } from './test-cleanup-manager.js';

// 型定義のエクスポート
export type {
  TestCleanupConfig,
  TestCleanupResult,
  RedundantFileInfo
} from '../../types/advanced-optimization.js';


