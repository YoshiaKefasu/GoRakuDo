/**
 * 共通ログ機能 - docs/[slug]共通
 * Astroネイティブ + Strict TypeScript + ES Modules
 * DRY原則: ログ機能の一元化
 */

import type { ILogger, LogLevel } from './shared-types.js';

/**
 * 共通ログ機能クラス
 * KISS原則: シンプルで理解しやすいログ実装
 */
export class SharedLogger implements ILogger {
  private static instance: SharedLogger | null = null;
  private isEnabled = true;

  private constructor() {
    // シングルトンパターン
  }

  /**
   * シングルトンインスタンスの取得
   * DRY原則: インスタンスの一元管理
   */
  public static getInstance(): SharedLogger {
    if (!SharedLogger.instance) {
      SharedLogger.instance = new SharedLogger();
    }
    return SharedLogger.instance;
  }

  /**
   * ログの有効/無効を設定
   * KISS原則: シンプルな設定管理
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * ログメッセージの出力
   * DRY原則: ログ処理の共通化
   */
  public log(message: string, level: LogLevel = 'info'): void {
    if (!this.isEnabled) return;

    // グローバルロガーが利用可能な場合はそれを使用
    if (window.clientLogger?.log) {
      window.clientLogger.log(message, level);
      return;
    }

    // フォールバック: コンソールログ
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    switch (level) {
      case 'error':
        console.error(`${prefix} ${message}`);
        break;
      case 'warning':
        console.warn(`${prefix} ${message}`);
        break;
      case 'success':
        console.log(`✅ ${prefix} ${message}`);
        break;
      default:
        console.log(`${prefix} ${message}`);
    }
  }

  /**
   * グループ開始
   * DRY原則: グループ機能の共通化
   */
  public startGroup(title: string): void {
    if (!this.isEnabled) return;

    if (window.clientLogger?.startGroup) {
      window.clientLogger.startGroup(title);
    } else {
      console.group(title);
    }
  }

  /**
   * グループ終了
   * DRY原則: グループ機能の共通化
   */
  public endGroup(title: string): void {
    if (!this.isEnabled) return;

    if (window.clientLogger?.endGroup) {
      window.clientLogger.endGroup(title);
    } else {
      console.groupEnd();
    }
  }
}

/**
 * グローバルログインスタンスの取得
 * KISS原則: シンプルなアクセス方法
 */
export function getLogger(): SharedLogger {
  return SharedLogger.getInstance();
}

/**
 * ログ機能の初期化
 * DRY原則: 初期化処理の共通化
 */
export function initializeLogger(): SharedLogger {
  const logger = getLogger();
  logger.log('Logger initialized', 'success');
  return logger;
}
