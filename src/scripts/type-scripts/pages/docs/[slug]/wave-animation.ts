/**
 * 波アニメーション機能 - [slug].astro分離スクリプト
 * Astroネイティブ + Strict TypeScript + ES Modules
 * DRY・KISS原則に従った実装
 */

import type { WaveConfig } from './types.js';

/**
 * 波アニメーションクラス
 * KISS原則: シンプルで理解しやすいアニメーション実装
 */
export class PostWaveAnimation {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationId: number | null = null;
  private time = 0;
  private waves: WaveConfig[] = [];
  private handleResize: (() => void) | null = null;

  constructor() {
    this.initializeWaveConfig();
    this.init();
  }

  /**
   * 波アニメーション設定の初期化
   * DRY原則: 設定の一元管理
   */
  private initializeWaveConfig(): void {
    this.waves = [
      {
        amplitude: 40,
        frequency: 0.01,
        speed: 0.02,
        offset: 0,
        color: "rgba(139, 93, 255, 0.08)",
        y: 0.875,
        yPos: 0,
      },
      {
        amplitude: 60,
        frequency: 0.008,
        speed: -0.015,
        offset: Math.PI / 3,
        color: "rgba(139, 93, 255, 0.06)",
        y: 0.9375,
        yPos: 0,
      },
      {
        amplitude: 35,
        frequency: 0.012,
        speed: 0.025,
        offset: Math.PI / 2,
        color: "rgba(139, 93, 255, 0.04)",
        y: 1,
        yPos: 0,
      },
    ];
  }

  /**
   * 波アニメーションの初期化
   * KISS原則: 初期化処理を明確に分離
   */
  private init(): void {
    this.canvas = document.getElementById("waveCanvas") as HTMLCanvasElement;
    if (!this.canvas) {
      console.warn("Wave canvas not found");
      return;
    }

    this.ctx = this.canvas.getContext("2d");
    if (!this.ctx) {
      console.warn("Canvas context not available");
      return;
    }

    this.setupResizeHandler();
    this.resizeCanvas();
    this.animate();
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
   * KISS原則: リサイズ処理を明確に分離
   */
  private resizeCanvas(): void {
    if (!this.canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    this.canvas.width = width;
    this.canvas.height = height;

    // 波のY位置を新しい高さに基づいて更新
    this.waves.forEach((wave) => {
      wave.yPos = height * wave.y;
    });
  }

  /**
   * アニメーションの実行
   * DRY原則: アニメーション処理の共通化
   */
  private animate(): void {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // グラデーション背景の描画
    this.drawGradientBackground();

    // 波の描画
    this.drawWaves();

    this.time += 0.5;
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  /**
   * グラデーション背景の描画
   * KISS原則: 背景描画処理を明確に分離
   */
  private drawGradientBackground(): void {
    if (!this.ctx || !this.canvas) return;

    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, "rgba(10, 10, 10, 1)");
    gradient.addColorStop(0.5, "rgba(10, 10, 10, 0.95)");
    gradient.addColorStop(1, "rgba(139, 93, 255, 0.02)");
    
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
      for (let x = 0; x <= this.canvas!.width + 10; x += 2) {
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
    });
  }

  /**
   * クリーンアップ処理
   * DRY原則: リソース管理の共通化
   */
  public destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.handleResize) {
      window.removeEventListener("resize", this.handleResize);
      this.handleResize = null;
    }

    console.log("Wave animation cleaned up");
  }
}

/**
 * 波アニメーションの初期化関数
 * KISS原則: シンプルな初期化処理
 */
export function initializeWaveAnimation(): PostWaveAnimation | null {
  try {
    const waveAnimation = new PostWaveAnimation();
    console.log("✅ Wave animation initialized");
    return waveAnimation;
  } catch (error) {
    console.error("Failed to initialize wave animation:", error);
    return null;
  }
}
