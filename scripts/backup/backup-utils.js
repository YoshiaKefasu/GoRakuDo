#!/usr/bin/env node

/**
 * Backup Utils - KISS原則に従ったシンプルなバックアップユーティリティ
 * 複雑な抽象化を避け、直接的なアプローチでバックアップ機能を提供
 */

import { execSync } from 'child_process';

/**
 * シンプルなバックアップ作成（KISS原則）
 */
export async function simpleBackup(phase, description = '') {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const tagName = `backup-${phase}-${timestamp}`;
    
    // 1. 現在の状態を保存
    execSync('git add -A', { stdio: 'inherit' });
    
    // 2. コミットを作成
    const message = `🔒 BACKUP: ${description || phase} completed`;
    execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
    
    // 3. タグを作成
    execSync(`git tag "${tagName}"`, { stdio: 'inherit' });
    
    console.log(`✅ Backup created: ${tagName}`);
    return tagName;
  } catch (error) {
    console.error(`❌ Backup failed: ${error.message}`);
    throw error;
  }
}

/**
 * シンプルなロールバック（KISS原則）
 */
export async function simpleRollback(backupTag) {
  try {
    execSync(`git checkout ${backupTag}`, { stdio: 'inherit' });
    console.log(`✅ Rolled back to: ${backupTag}`);
    return { success: true, tagName: backupTag };
  } catch (error) {
    console.error(`❌ Rollback failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * バックアップ一覧の表示（KISS原則）
 */
export function listBackups() {
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
export function validateBackup(tagName) {
  try {
    const result = execSync(`git show --name-only ${tagName}`, { encoding: 'utf8' });
    return { success: true, files: result.split('\n').filter(Boolean) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 段階的バックアップの実行（KISS原則）
 */
export async function executePhaseBackups() {
  const phases = [
    { name: 'phase1', description: 'AI utils removal' },
    { name: 'phase2', description: 'AI content removal' },
    { name: 'phase3', description: 'Component removal' },
    { name: 'phase4', description: 'Final cleanup' }
  ];

  console.log('🚀 Starting phase backups...');
  
  for (const phase of phases) {
    try {
      const tagName = await simpleBackup(phase.name, phase.description);
      console.log(`✅ ${phase.name} backup completed: ${tagName}`);
    } catch (error) {
      console.error(`❌ ${phase.name} backup failed: ${error.message}`);
      throw error;
    }
  }
  
  console.log('🎉 All phase backups completed successfully!');
}

// CLIインターフェース（KISS原則）
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  const phase = process.argv[3];
  const description = process.argv[4];

  switch (command) {
    case 'create':
      if (!phase) {
        console.log('Usage: node backup-utils.js create <phase> [description]');
        process.exit(1);
      }
      simpleBackup(phase, description);
      break;
      
    case 'rollback':
      if (!phase) {
        console.log('Usage: node backup-utils.js rollback <tag-name>');
        process.exit(1);
      }
      simpleRollback(phase);
      break;
      
    case 'list':
      const backups = listBackups();
      console.log('Available backups:');
      backups.forEach(backup => console.log(`  - ${backup}`));
      break;
      
    case 'validate':
      if (!phase) {
        console.log('Usage: node backup-utils.js validate <tag-name>');
        process.exit(1);
      }
      const validation = validateBackup(phase);
      console.log('Validation result:', validation);
      break;
      
    case 'phases':
      executePhaseBackups();
      break;
      
    default:
      console.log(`
Backup Utils - KISS原則準拠

Usage:
  node backup-utils.js create <phase> [description]  - シンプルなバックアップを作成
  node backup-utils.js rollback <tag-name>          - バックアップにロールバック
  node backup-utils.js list                         - バックアップ一覧を表示
  node backup-utils.js validate <tag-name>          - バックアップを検証
  node backup-utils.js phases                       - 全段階のバックアップを実行

Examples:
  node backup-utils.js create phase1 "AI utils removal"
  node backup-utils.js phases
  node backup-utils.js rollback backup-phase1-20241230-143000
      `);
  }
}
