/**
 * 共通波アニメーション設定 - docs/[slug]共通
 * Astroネイティブ + Strict TypeScript + ES Modules
 * DRY原則: 波アニメーション設定の一元化
 */

import type { WaveConfig } from './shared-types.js';

/**
 * 波アニメーション設定の定数
 * KISS原則: 設定の明確な分離
 */
export const WAVE_ANIMATION_CONFIG = {
  // アニメーション速度
  TIME_INCREMENT: 0.5,
  
  // キャンバス解像度
  CANVAS_RESOLUTION: 2,
  
  // デフォルト波設定
  DEFAULT_WAVES: [
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
  ] as const satisfies readonly WaveConfig[],

  // docs専用波設定（軽量版）
  DOCS_WAVES: [
    {
      amplitude: 35,
      frequency: 0.008,
      speed: 0.015,
      offset: 0,
      color: "rgba(139, 93, 255, 0.06)",
      y: 0.75,
      yPos: 0,
    },
    {
      amplitude: 45,
      frequency: 0.006,
      speed: -0.012,
      offset: Math.PI / 3,
      color: "rgba(139, 93, 255, 0.04)",
      y: 0.8,
      yPos: 0,
    },
    {
      amplitude: 30,
      frequency: 0.01,
      speed: 0.018,
      offset: Math.PI / 2,
      color: "rgba(139, 93, 255, 0.03)",
      y: 0.85,
      yPos: 0,
    },
  ] as const satisfies readonly WaveConfig[],

  // グラデーション設定
  GRADIENTS: {
    DEFAULT: [
      { stop: 0, color: "rgba(10, 10, 10, 1)" },
      { stop: 0.5, color: "rgba(10, 10, 10, 0.95)" },
      { stop: 1, color: "rgba(139, 93, 255, 0.02)" },
    ],
    DOCS: [
      { stop: 0, color: "rgba(10, 10, 10, 1)" },
      { stop: 0.6, color: "rgba(10, 10, 10, 0.98)" },
      { stop: 1, color: "rgba(139, 93, 255, 0.015)" },
    ],
  } as const,
} as const;

/**
 * 波アニメーション設定ファクトリー
 * DRY原則: 設定生成の共通化
 */
export class WaveConfigFactory {
  /**
   * デフォルト波設定の取得
   * KISS原則: シンプルな設定取得
   */
  public static getDefaultWaves(): WaveConfig[] {
    return WAVE_ANIMATION_CONFIG.DEFAULT_WAVES.map(wave => ({ ...wave }));
  }

  /**
   * docs専用波設定の取得
   * KISS原則: シンプルな設定取得
   */
  public static getDocsWaves(): WaveConfig[] {
    return WAVE_ANIMATION_CONFIG.DOCS_WAVES.map(wave => ({ ...wave }));
  }

  /**
   * カスタム波設定の生成
   * DRY原則: 設定生成の共通化
   */
  public static createCustomWaves(
    count: number,
    baseConfig: Partial<WaveConfig> = {}
  ): WaveConfig[] {
    const waves: WaveConfig[] = [];
    
    for (let i = 0; i < count; i++) {
      const wave: WaveConfig = {
        amplitude: 40 + (i * 10),
        frequency: 0.008 + (i * 0.002),
        speed: 0.015 + (i * 0.005),
        offset: (i * Math.PI) / 4,
        color: `rgba(139, 93, 255, ${0.08 - (i * 0.02)})`,
        y: 0.8 + (i * 0.05),
        yPos: 0,
        ...baseConfig,
      };
      waves.push(wave);
    }
    
    return waves;
  }

  /**
   * 波のY位置を更新
   * DRY原則: 位置更新の共通化
   */
  public static updateWavePositions(waves: WaveConfig[], height: number): void {
    waves.forEach(wave => {
      wave.yPos = height * wave.y;
    });
  }
}

/**
 * グラデーション設定ファクトリー
 * DRY原則: グラデーション生成の共通化
 */
export class GradientFactory {
  /**
   * デフォルトグラデーションの作成
   * KISS原則: シンプルなグラデーション生成
   */
  public static createDefaultGradient(
    ctx: CanvasRenderingContext2D,
    height: number
  ): CanvasGradient {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    
    WAVE_ANIMATION_CONFIG.GRADIENTS.DEFAULT.forEach(({ stop, color }) => {
      gradient.addColorStop(stop, color);
    });
    
    return gradient;
  }

  /**
   * docs専用グラデーションの作成
   * KISS原則: シンプルなグラデーション生成
   */
  public static createDocsGradient(
    ctx: CanvasRenderingContext2D,
    height: number
  ): CanvasGradient {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    
    WAVE_ANIMATION_CONFIG.GRADIENTS.DOCS.forEach(({ stop, color }) => {
      gradient.addColorStop(stop, color);
    });
    
    return gradient;
  }
}

