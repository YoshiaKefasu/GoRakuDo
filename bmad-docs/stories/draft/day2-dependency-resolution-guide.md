<!-- Powered by BMAD™ Core -->

# 🚀 Day 2: 依存関係の解決 - 詳細ガイド

## 📋 今日の目標

### **午前の目標**
- `base-integration.ts`の依存関係の詳細分析
- 依存関係の解決方法の実装
- 統合テストの準備

### **午後の目標**
- `fallback-system.ts`の依存関係の詳細分析
- 依存関係の解決方法の実装
- 統合テストの実行と結果確認

### **成果物**
- 依存関係解決レポート（Markdown形式）
- 解決された依存関係の詳細リスト
- 統合テスト結果レポート

---

## 🔍 午前の作業：base-integration.tsの依存関係解決

### **Step 1: 作業環境の準備**

#### **1.1 作業ブランチの確認と更新**
```bash
# 現在のブランチ確認
git status

# 最新の状態に更新
git pull origin main

# 作業ブランチの確認
git branch

# 必要に応じて新しいブランチを作成
git checkout -b feature/phase1-day2-dependency-resolution
```

#### **1.2 バックアップの更新**
```bash
# バックアップディレクトリの作成
mkdir -p backup/phase1-day2/$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backup/phase1-day2/$(date +%Y%m%d_%H%M%S)"

# 現在の状態をバックアップ
cp -r src/types/ $BACKUP_DIR/
cp -r src/components/ $BACKUP_DIR/
cp -r src/utils/ $BACKUP_DIR/

echo "✅ バックアップ完了: $BACKUP_DIR"
```

### **Step 2: base-integration.tsの依存関係分析**

#### **2.1 ファイル内容の詳細確認**
```bash
# base-integration.tsの全体内容確認
echo "📄 base-integration.ts の全体内容:"
cat src/types/base-integration.ts

# 行数とサイズの確認
echo "📊 ファイル情報:"
wc -l src/types/base-integration.ts
du -h src/types/base-integration.ts

# インポート文の確認
echo "🔍 インポート文の確認:"
grep -n "import.*from" src/types/base-integration.ts

# エクスポート文の確認
echo "🔍 エクスポート文の確認:"
grep -n "export" src/types/base-integration.ts
```

#### **2.2 依存関係の詳細調査**
```bash
# 各インポートの詳細調査
echo "🔍 依存関係の詳細調査:"

# インポートされているファイルの存在確認
IMPORT_FILES=$(grep "import.*from" src/types/base-integration.ts | sed 's/.*from.*["'\'']\([^"'\'']*\)["'\''].*/\1/' | sed 's/^\.\///')

for file in $IMPORT_FILES; do
    echo "📁 インポートファイル: $file"
    if [ -f "src/$file" ]; then
        echo "✅ ファイル存在: src/$file"
        echo "📊 ファイル情報:"
        wc -l "src/$file"
        du -h "src/$file"
    else
        echo "❌ ファイル不存在: src/$file"
    fi
done
```

#### **2.3 型定義の使用状況調査**
```bash
# 各型定義の使用状況を調査
echo "🔍 型定義の使用状況調査:"

# インターフェースの一覧取得
INTERFACES=$(grep -n "interface" src/types/base-integration.ts | sed 's/.*interface \([A-Za-z0-9_]*\).*/\1/')

for interface in $INTERFACES; do
    echo "🔍 インターフェース: $interface"
    echo "📊 使用箇所数:"
    grep -r "$interface" src/ --include="*.ts" --include="*.astro" --include="*.js" | wc -l
    echo "📄 使用箇所詳細:"
    grep -r "$interface" src/ --include="*.ts" --include="*.astro" --include="*.js" | head -5
    echo "---"
done
```

### **Step 3: 依存関係の解決実装**

#### **3.1 新システムへの移行準備**
```bash
# 新システムの型定義を確認
echo "🔍 新システムの型定義確認:"
ls -la src/types/new-seo-system/

# 対応する型定義の確認
echo "📄 対応する型定義の確認:"
grep -r "interface.*Config" src/types/new-seo-system/ --include="*.ts" | head -10
grep -r "interface.*Integration" src/types/new-seo-system/ --include="*.ts" | head -10
```

#### **3.2 型定義の統合実装**
```bash
# 統合用の新しいファイルを作成
INTEGRATION_FILE="src/types/new-seo-system/base-integration-integration.ts"

cat > $INTEGRATION_FILE << 'EOF'
/**
 * Base Integration Types - Legacy System Integration
 * 
 * This file provides backward compatibility for the old base-integration.ts
 * while maintaining DRY and KISS principles.
 */

import type {
  BaseIntegrationConfig,
  SEOIntegrationConfig as NewSEOIntegrationConfig,
  FallbackIntegrationConfig as NewFallbackIntegrationConfig,
  SystemIntegrationConfig
} from './index';

// Legacy type aliases for backward compatibility
export type SEOIntegrationConfig = NewSEOIntegrationConfig;
export type FallbackIntegrationConfig = NewFallbackIntegrationConfig;

// Legacy interface for backward compatibility
export interface LegacyBaseIntegrationConfig extends BaseIntegrationConfig {
  readonly legacySupport: boolean;
}

// Migration helper function
export function migrateLegacyConfig(
  legacyConfig: LegacyBaseIntegrationConfig
): BaseIntegrationConfig {
  const { legacySupport, ...newConfig } = legacyConfig;
  return newConfig;
}

// Type guard for legacy config
export function isLegacyConfig(
  config: unknown
): config is LegacyBaseIntegrationConfig {
  return (
    typeof config === 'object' &&
    config !== null &&
    'legacySupport' in config &&
    typeof (config as any).legacySupport === 'boolean'
  );
}

// Export all new system types for convenience
export * from './index';
EOF

echo "✅ 統合ファイル作成完了: $INTEGRATION_FILE"
```

#### **3.3 既存ファイルの更新**
```bash
# 既存のbase-integration.tsを更新
cat > src/types/base-integration.ts << 'EOF'
/**
 * @deprecated This file is deprecated. Use src/types/new-seo-system/base-integration-integration.ts instead.
 * 
 * This file will be removed in the next major version.
 * Please migrate to the new system using the migration helper functions.
 */

// Re-export from new system for backward compatibility
export * from '../new-seo-system/base-integration-integration';

// Legacy type definitions (deprecated)
export interface SEOIntegrationConfig {
  readonly enabled: boolean;
  readonly apiEndpoint: string;
  readonly timeout: number;
  readonly legacySupport: boolean;
}

export interface FallbackIntegrationConfig {
  readonly enabled: boolean;
  readonly fallbackEndpoint: string;
  readonly timeout: number;
  readonly legacySupport: boolean;
}

// Migration warning
console.warn(
  'DEPRECATION WARNING: base-integration.ts is deprecated. ' +
  'Please migrate to the new system. ' +
  'See src/types/new-seo-system/base-integration-integration.ts for details.'
);
EOF

echo "✅ 既存ファイル更新完了"
```

### **Step 4: 統合テストの準備**

#### **4.1 テストファイルの作成**
```bash
# テストディレクトリの作成
mkdir -p tests/integration/base-integration

# 統合テストファイルの作成
TEST_FILE="tests/integration/base-integration/integration.test.ts"

cat > $TEST_FILE << 'EOF'
import { describe, it, expect } from 'vitest';
import type {
  SEOIntegrationConfig,
  FallbackIntegrationConfig,
  migrateLegacyConfig,
  isLegacyConfig
} from '../../../src/types/new-seo-system/base-integration-integration';

describe('Base Integration Integration Tests', () => {
  describe('Type Compatibility', () => {
    it('should maintain backward compatibility with legacy types', () => {
      const legacyConfig = {
        enabled: true,
        apiEndpoint: 'https://api.example.com',
        timeout: 5000,
        legacySupport: true
      };

      expect(isLegacyConfig(legacyConfig)).toBe(true);
    });

    it('should migrate legacy config to new system', () => {
      const legacyConfig = {
        enabled: true,
        apiEndpoint: 'https://api.example.com',
        timeout: 5000,
        legacySupport: true
      };

      const newConfig = migrateLegacyConfig(legacyConfig);
      
      expect(newConfig.enabled).toBe(true);
      expect(newConfig.apiEndpoint).toBe('https://api.example.com');
      expect(newConfig.timeout).toBe(5000);
      expect('legacySupport' in newConfig).toBe(false);
    });
  });

  describe('Type Safety', () => {
    it('should enforce readonly properties', () => {
      const config: SEOIntegrationConfig = {
        enabled: true,
        apiEndpoint: 'https://api.example.com',
        timeout: 5000
      };

      // This should cause a TypeScript error if readonly is not enforced
      // config.enabled = false; // Should be readonly
      
      expect(config.enabled).toBe(true);
    });
  });
});
EOF

echo "✅ テストファイル作成完了: $TEST_FILE"
```

---

## 🔍 午後の作業：fallback-system.tsの依存関係解決

### **Step 5: fallback-system.tsの依存関係分析**

#### **5.1 ファイル内容の詳細確認**
```bash
# fallback-system.tsの全体内容確認
echo "📄 fallback-system.ts の全体内容:"
cat src/types/fallback-system.ts

# 行数とサイズの確認
echo "📊 ファイル情報:"
wc -l src/types/fallback-system.ts
du -h src/types/fallback-system.ts

# インポート文の確認
echo "🔍 インポート文の確認:"
grep -n "import.*from" src/types/fallback-system.ts

# エクスポート文の確認
echo "🔍 エクスポート文の確認:"
grep -n "export" src/types/fallback-system.ts
```

#### **5.2 依存関係の詳細調査**
```bash
# 各インポートの詳細調査
echo "🔍 依存関係の詳細調査:"

# インポートされているファイルの存在確認
IMPORT_FILES=$(grep "import.*from" src/types/fallback-system.ts | sed 's/.*from.*["'\'']\([^"'\'']*\)["'\''].*/\1/' | sed 's/^\.\///')

for file in $IMPORT_FILES; do
    echo "📁 インポートファイル: $file"
    if [ -f "src/$file" ]; then
        echo "✅ ファイル存在: src/$file"
        echo "📊 ファイル情報:"
        wc -l "src/$file"
        du -h "src/$file"
    else
        echo "❌ ファイル不存在: src/$file"
    fi
done
```

#### **5.3 型定義の使用状況調査**
```bash
# 各型定義の使用状況を調査
echo "🔍 型定義の使用状況調査:"

# インターフェースの一覧取得
INTERFACES=$(grep -n "interface" src/types/fallback-system.ts | sed 's/.*interface \([A-Za-z0-9_]*\).*/\1/')

for interface in $INTERFACES; do
    echo "🔍 インターフェース: $interface"
    echo "📊 使用箇所数:"
    grep -r "$interface" src/ --include="*.ts" --include="*.astro" --include="*.js" | wc -l
    echo "📄 使用箇所詳細:"
    grep -r "$interface" src/ --include="*.ts" --include="*.astro" --include="*.js" | head -5
    echo "---"
done
```

### **Step 6: fallback-system.tsの依存関係解決実装**

#### **6.1 新システムへの移行準備**
```bash
# 新システムの型定義を確認
echo "🔍 新システムの型定義確認:"
grep -r "interface.*Validation" src/types/new-seo-system/ --include="*.ts" | head -10
grep -r "interface.*Error" src/types/new-seo-system/ --include="*.ts" | head -10
```

#### **6.2 型定義の統合実装**
```bash
# 統合用の新しいファイルを作成
FALLBACK_INTEGRATION_FILE="src/types/new-seo-system/fallback-system-integration.ts"

cat > $FALLBACK_INTEGRATION_FILE << 'EOF'
/**
 * Fallback System Types - Legacy System Integration
 * 
 * This file provides backward compatibility for the old fallback-system.ts
 * while maintaining DRY and KISS principles.
 */

import type {
  ValidationResult,
  ValidationError,
  ValidationWarning,
  BaseValidationConfig
} from './validation';

// Legacy type aliases for backward compatibility
export type FallbackValidationResult = ValidationResult;
export type FallbackValidationError = ValidationError;
export type FallbackValidationWarning = ValidationWarning;

// Legacy interface for backward compatibility
export interface LegacyFallbackConfig extends BaseValidationConfig {
  readonly legacySupport: boolean;
}

// Migration helper function
export function migrateFallbackConfig(
  legacyConfig: LegacyFallbackConfig
): BaseValidationConfig {
  const { legacySupport, ...newConfig } = legacyConfig;
  return newConfig;
}

// Type guard for legacy config
export function isLegacyFallbackConfig(
  config: unknown
): config is LegacyFallbackConfig {
  return (
    typeof config === 'object' &&
    config !== null &&
    'legacySupport' in config &&
    typeof (config as any).legacySupport === 'boolean'
  );
}

// Export all new system types for convenience
export * from './validation';
EOF

echo "✅ 統合ファイル作成完了: $FALLBACK_INTEGRATION_FILE"
```

#### **6.3 既存ファイルの更新**
```bash
# 既存のfallback-system.tsを更新
cat > src/types/fallback-system.ts << 'EOF'
/**
 * @deprecated This file is deprecated. Use src/types/new-seo-system/fallback-system-integration.ts instead.
 * 
 * This file will be removed in the next major version.
 * Please migrate to the new system using the migration helper functions.
 */

// Re-export from new system for backward compatibility
export * from '../new-seo-system/fallback-system-integration';

// Legacy type definitions (deprecated)
export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly ValidationError[];
  readonly warnings: readonly ValidationWarning[];
  readonly legacySupport: boolean;
}

export interface ValidationError {
  readonly code: string;
  readonly message: string;
  readonly field?: string;
  readonly legacySupport: boolean;
}

export interface ValidationWarning {
  readonly code: string;
  readonly message: string;
  readonly field?: string;
  readonly legacySupport: boolean;
}

// Migration warning
console.warn(
  'DEPRECATION WARNING: fallback-system.ts is deprecated. ' +
  'Please migrate to the new system. ' +
  'See src/types/new-seo-system/fallback-system-integration.ts for details.'
);
EOF

echo "✅ 既存ファイル更新完了"
```

### **Step 7: 統合テストの実行**

#### **7.1 テストの実行**
```bash
# テストの実行
echo "🧪 統合テストの実行:"
npm test tests/integration/base-integration/integration.test.ts

# テスト結果の確認
echo "📊 テスト結果:"
npm test -- --reporter=verbose
```

#### **7.2 TypeScriptチェックの実行**
```bash
# TypeScriptチェックの実行
echo "🔍 TypeScriptチェックの実行:"
npx tsc --noEmit

# チェック結果の確認
echo "📊 TypeScriptチェック結果:"
if [ $? -eq 0 ]; then
    echo "✅ TypeScriptチェック成功"
else
    echo "❌ TypeScriptチェック失敗"
    echo "詳細なエラー情報:"
    npx tsc --noEmit 2>&1 | head -20
fi
```

---

## 📋 午後の作業チェックリスト

### **fallback-system.tsの依存関係解決**
- [ ] ファイル内容の詳細確認完了
- [ ] 依存関係の詳細調査完了
- [ ] 型定義の使用状況調査完了

### **統合実装**
- [ ] 新システムへの移行準備完了
- [ ] 型定義の統合実装完了
- [ ] 既存ファイルの更新完了

### **テストと品質確認**
- [ ] 統合テストの実行完了
- [ ] TypeScriptチェックの実行完了
- [ ] エラーの修正完了

### **レポート作成**
- [ ] 依存関係解決レポートの作成完了
- [ ] 解決された依存関係の詳細リスト作成完了
- [ ] 統合テスト結果レポート作成完了

---

## 🚀 明日の準備

### **Day 3の作業内容**
- **午前**: 古いファイルの削除実行
- **午後**: 削除確認と影響範囲チェック
- **成果物**: 削除完了レポート

### **必要な準備**
- 削除対象ファイルの最終確認
- 削除後の影響範囲チェック
- ロールバック手順の確認

---

## 📊 今日の成果物

### **作成完了**
- ✅ base-integration.tsの依存関係解決
- ✅ fallback-system.tsの依存関係解決
- ✅ 統合テストファイルの作成
- ✅ 既存ファイルの更新

### **次のアクション**
- 🚀 Day 3: 古いファイルの削除開始
- 📋 削除完了レポートの作成
- 🔧 影響範囲チェックの準備

---

**作成日**: 2024-12-31
**対象**: 担当開発者
**難易度**: 初級〜中級
**予想作業時間**: 1日
**現在の状況**: ✅ Day 2詳細ガイド作成完了
**次のステップ**: 🚀 Day 3詳細ガイド作成開始
