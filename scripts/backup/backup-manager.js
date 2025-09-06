#!/usr/bin/env node

/**
 * Backup Manager - DRY/KISS原則に従った再利用可能なバックアップシステム
 * 共通のバックアップロジックを抽象化し、シンプルなインターフェースを提供
 */

import { execSync } from 'child_process';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

class BackupManager {
  constructor() {
    this.backupDir = join(process.cwd(), 'backups');
    this.backupLogFile = join(this.backupDir, 'backup-log.json');
  }

  /**
   * 共通のバックアップ作成ロジック（DRY原則）
   */
  async createBackup(phase, description) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const tagName = `backup-${phase}-${timestamp}`;
      
      // 共通のGit操作（DRY原則）
      await this.executeGitCommands(tagName, description);
      
      // バックアップログの記録
      await this.logBackup(phase, tagName, description, timestamp);
      
      console.log(`✅ Backup created: ${tagName}`);
      return tagName;
    } catch (error) {
      console.error(`❌ Backup failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * 共通のGit操作（DRY原則）
   */
  async executeGitCommands(tagName, description) {
    // 現在の状態を保存
    execSync('git add -A', { stdio: 'inherit' });
    
    // コミットを作成
    const message = `🔒 BACKUP: ${description}`;
    execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
    
    // タグを作成
    execSync(`git tag "${tagName}"`, { stdio: 'inherit' });
  }

  /**
   * バックアップログの記録（DRY原則）
   */
  async logBackup(phase, tagName, description, timestamp) {
    const logEntry = {
      phase,
      tagName,
      description,
      timestamp,
      status: 'success'
    };

    // 既存のログを読み込み
    let backupLog = [];
    try {
      const logContent = readFileSync(this.backupLogFile, 'utf8');
      backupLog = JSON.parse(logContent);
    } catch (error) {
      // ファイルが存在しない場合は新規作成
    }

    backupLog.push(logEntry);
    writeFileSync(this.backupLogFile, JSON.stringify(backupLog, null, 2));
  }

  /**
   * ロールバック機能（KISS原則）
   */
  async rollbackToBackup(tagName) {
    try {
      execSync(`git checkout ${tagName}`, { stdio: 'inherit' });
      console.log(`✅ Rolled back to: ${tagName}`);
      return { success: true, tagName };
    } catch (error) {
      console.error(`❌ Rollback failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * バックアップ一覧の表示（KISS原則）
   */
  listBackups() {
    try {
      const tags = execSync('git tag -l "backup-*"', { encoding: 'utf8' });
      return tags.split('\n').filter(Boolean).sort();
    } catch (error) {
      console.error(`❌ Failed to list backups: ${error.message}`);
      return [];
    }
  }

  /**
   * バックアップの検証（KISS原則）
   */
  validateBackup(tagName) {
    try {
      const result = execSync(`git show --name-only ${tagName}`, { encoding: 'utf8' });
      return { success: true, files: result.split('\n').filter(Boolean) };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// シンプルなCLIインターフェース（KISS原則）
if (import.meta.url === `file://${process.argv[1]}`) {
  const manager = new BackupManager();
  const command = process.argv[2];
  const phase = process.argv[3];
  const description = process.argv[4];

  switch (command) {
    case 'create':
      if (!phase || !description) {
        console.log('Usage: node backup-manager.js create <phase> <description>');
        process.exit(1);
      }
      manager.createBackup(phase, description);
      break;
      
    case 'list':
      const backups = manager.listBackups();
      console.log('Available backups:');
      backups.forEach(backup => console.log(`  - ${backup}`));
      break;
      
    case 'rollback':
      if (!phase) {
        console.log('Usage: node backup-manager.js rollback <tag-name>');
        process.exit(1);
      }
      manager.rollbackToBackup(phase);
      break;
      
    case 'validate':
      if (!phase) {
        console.log('Usage: node backup-manager.js validate <tag-name>');
        process.exit(1);
      }
      const validation = manager.validateBackup(phase);
      console.log('Validation result:', validation);
      break;
      
    default:
      console.log(`
Backup Manager - DRY/KISS原則準拠

Usage:
  node backup-manager.js create <phase> <description>  - バックアップを作成
  node backup-manager.js list                         - バックアップ一覧を表示
  node backup-manager.js rollback <tag-name>          - バックアップにロールバック
  node backup-manager.js validate <tag-name>          - バックアップを検証

Examples:
  node backup-manager.js create phase1 "AI utils removal"
  node backup-manager.js list
  node backup-manager.js rollback backup-phase1-20241230-143000
      `);
  }
}

export default BackupManager;
