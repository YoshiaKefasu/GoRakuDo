/**
 * WaveStarsAnimationManager - 波アニメーション + 星背景管理クラス
 * 
 * GoRakuDo Engineering Team 2025: Performance-optimized wave and stars animation for docs page
 * 
 * 設計原則:
 * - DRY: 波アニメーションと星背景処理の共通化
 * - KISS: シンプルで理解しやすいアニメーション実装
 * - Astro Native: Astroの最適化されたクライアントサイド処理
 */

import type { 
  WaveConfig, 
  IWaveStarsAnimationManager,
  LogLevel
} from './types.js';
import { getLogger } from './shared-logger.js';
import { WaveConfigFactory, GradientFactory, WAVE_ANIMATION_CONFIG } from './shared-wave-config.js';

export class WaveStarsAnimationManager implements IWaveStarsAnimationManager {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationId: number | null = null;
  private time = 0;
  private waves: WaveConfig[] = [];
  private handleResize: (() => void) | null = null;
  private starsContainer: HTMLElement | null = null;
  private stars: HTMLElement[] = [];
  private logger = getLogger();

  constructor() {
    this.initializeWaveConfig();
  }

  /**
   * 波アニメーションの初期化
   * DRY原則: 共通設定ファクトリーを使用
   */
  private initializeWaveConfig(): void {
    this.waves = WaveConfigFactory.getDocsWaves();
  }

  /**
   * 波アニメーション + 星背景の初期化
   * DRY原則: 初期化処理の共通化
   */
  public init(): { cleanup: () => void } | null {
    this.logger.log("Initializing docs page wave and stars animation...", "info");

    // 波アニメーションの初期化
    const waveResult = this.initializeWaveAnimation();
    if (!waveResult) {
      return null;
    }

    // 星背景の初期化
    const starsResult = this.initializeStarsBackground();
    if (!starsResult) {
      this.logger.log("Stars background initialization failed, continuing with wave animation only", "warning");
    }

    this.logger.log("Docs page wave and stars animation initialized successfully", "success");
    
    return {
      cleanup: () => this.cleanup()
    };
  }

  /**
   * 波アニメーションの初期化
   * KISS原則: 波アニメーション処理を明確に分離
   */
  private initializeWaveAnimation(): boolean {
    this.canvas = document.getElementById("waveCanvas") as HTMLCanvasElement;
    if (!this.canvas) {
      this.logger.log("Wave canvas not found for docs page", "warning");
      return false;
    }

    this.ctx = this.canvas.getContext("2d");
    if (!this.ctx) {
      this.logger.log("Canvas context not available for docs page", "warning");
      return false;
    }

    this.setupResizeHandler();
    this.resizeCanvas();
    this.startAnimation();

    this.logger.log("Wave animation initialized", "success");
    return true;
  }

  /**
   * 星背景の初期化
   * KISS原則: 星背景処理を明確に分離
   */
  private initializeStarsBackground(): boolean {
    this.starsContainer = document.getElementById("starsContainer");
    if (!this.starsContainer) {
      this.logger.log("Stars container not found for docs page", "warning");
      return false;
    }

    // Create stars (optimized for docs page)
    const starCount = 25; // Reduced for better performance
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = Math.random() * 100 + "%";
      star.style.top = Math.random() * 100 + "%";
      star.style.animationDelay = Math.random() * 3 + "s";
      star.style.animationDuration = 2 + Math.random() * 2 + "s";
      this.starsContainer.appendChild(star);
      this.stars.push(star);
    }

    // Add loaded class to trigger CSS animation
    this.starsContainer.classList.add("loaded");

    this.logger.log("Stars background initialized", "success");
    return true;
  }

  /**
   * リサイズハンドラーの設定
   * DRY原則: イベント処理の共通化
   */
  private setupResizeHandler(): void {
    this.handleResize = () => {
      this.resizeCanvas();
    };
    window.addEventListener("resize", this.handleResize);
  }

  /**
   * キャンバスのリサイズ
   * DRY原則: 共通ファクトリーを使用
   */
  private resizeCanvas(): void {
    if (!this.canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    this.canvas.width = width;
    this.canvas.height = height;

    // 波のY位置を新しい高さに基づいて更新
    WaveConfigFactory.updateWavePositions(this.waves, height);
  }

  /**
   * アニメーションの開始
   * DRY原則: アニメーション処理の共通化
   */
  private startAnimation(): void {
    const animate = () => {
      if (!this.ctx || !this.canvas) return;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // グラデーション背景の作成（docs専用）
      this.drawGradientBackground();

      // 波の描画
      this.drawWaves();

      this.time += WAVE_ANIMATION_CONFIG.TIME_INCREMENT;
      this.animationId = requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * グラデーション背景の描画
   * DRY原則: 共通ファクトリーを使用
   */
  private drawGradientBackground(): void {
    if (!this.ctx || !this.canvas) return;

    const gradient = GradientFactory.createDocsGradient(this.ctx, this.canvas.height);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * 波の描画
   * DRY原則: 波描画処理の共通化
   */
  private drawWaves(): void {
    if (!this.ctx || !this.canvas) return;

    this.waves.forEach((wave) => {
      this.ctx!.beginPath();

      // 波のパスを作成
      for (let x = 0; x <= this.canvas!.width + 10; x += WAVE_ANIMATION_CONFIG.CANVAS_RESOLUTION) {
        const y = wave.yPos + 
          Math.sin(x * wave.frequency + this.time * wave.speed + wave.offset) * wave.amplitude;

        if (x === 0) {
          this.ctx!.moveTo(x, y);
        } else {
          this.ctx!.lineTo(x, y);
        }
      }

      // パスを閉じて塗りつぶし領域を作成
      this.ctx!.lineTo(this.canvas!.width, this.canvas!.height);
      this.ctx!.lineTo(0, this.canvas!.height);
      this.ctx!.closePath();

      this.ctx!.fillStyle = wave.color;
      this.ctx!.fill();

      // より明確な定義のために微細なストロークを追加
      this.ctx!.strokeStyle = "rgba(139, 93, 255, 0.08)";
      this.ctx!.lineWidth = 0.5;
      this.ctx!.stroke();
    });
  }

  /**
   * クリーンアップ処理
   * DRY原則: リソース管理の共通化
   */
  public cleanup(): void {
    // 波アニメーションのクリーンアップ
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.handleResize) {
      window.removeEventListener("resize", this.handleResize);
      this.handleResize = null;
    }

    // 星背景のクリーンアップ
    if (this.starsContainer && this.stars.length > 0) {
      this.stars.forEach(star => {
        if (star.parentNode) {
          star.parentNode.removeChild(star);
        }
      });
      this.stars = [];
      // Remove loaded class
      this.starsContainer.classList.remove("loaded");
    }

    this.logger.log("Wave and stars animation cleaned up", "info");
  }

  /**
   * ログメッセージの出力（インターフェース互換性のため）
   * DRY原則: 共通ロガーを使用
   */
  public logMessage(message: string, level: LogLevel = 'info'): void {
    this.logger.log(message, level);
  }
}
