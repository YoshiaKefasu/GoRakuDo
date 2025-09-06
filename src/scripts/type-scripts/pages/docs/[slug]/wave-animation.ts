/**
 * 波アニメーション機能 - [slug].astro分離スクリプト
 * Astroネイティブ + Strict TypeScript + ES Modules
 * DRY・KISS原則に従った実装
 */

import { getLogger } from '../shared-logger.js';
import { WaveStarsAnimationManager } from '../WaveStarsAnimationManager.js';

/**
 * [slug]ページ用波アニメーションクラス
 * DRY原則: 共通WaveStarsAnimationManagerを使用
 */
export class PostWaveAnimation {
  private waveAnimationManager: WaveStarsAnimationManager | null = null;
  private logger = getLogger();

  constructor() {
    this.init();
  }

  /**
   * 波アニメーションの初期化
   * DRY原則: 共通WaveStarsAnimationManagerを使用
   */
  private init(): void {
    try {
      this.waveAnimationManager = new WaveStarsAnimationManager();
      const result = this.waveAnimationManager.init();

      if (result) {
        this.logger.log("Post wave animation initialized", "success");
      } else {
        this.logger.log("Wave animation initialization failed", "warning");
      }
    } catch (error) {
      this.logger.log(`Failed to initialize wave animation: ${error}`, "error");
    }
  }

  /**
   * クリーンアップ処理
   * DRY原則: 共通マネージャーのクリーンアップを使用
   */
  public destroy(): void {
    if (this.waveAnimationManager) {
      this.waveAnimationManager.cleanup();
      this.waveAnimationManager = null;
    }
    this.logger.log("Post wave animation cleaned up", "info");
  }
}

/**
 * 波アニメーションの初期化関数
 * KISS原則: シンプルな初期化処理
 */
export function initializeWaveAnimation(): PostWaveAnimation | null {
  try {
    const waveAnimation = new PostWaveAnimation();
    return waveAnimation;
  } catch (error) {
    const logger = getLogger();
    logger.log(`Failed to initialize wave animation: ${error}`, "error");
    return null;
  }
}
