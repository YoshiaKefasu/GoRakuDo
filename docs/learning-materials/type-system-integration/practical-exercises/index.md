# 実践的なコード改善演習

## 概要

このドキュメントでは、DRY・KISS原則とTypeScript型定義システムの実践的な応用を学習するための演習問題を提供します。各演習を通じて、理論を実際のコード改善に活かす方法を学びます。

## 演習1: DRY原則の実践 - 重複コードの共通化

### 問題設定

以下のコードには、重複する設定プロパティがあります。DRY原則を適用して重複を排除しなさい。

```typescript
// 演習用コード - 重複がある状態
interface UserServiceConfig {
  readonly enabled: boolean;
  readonly apiEndpoint: string;
  readonly timeout: number;
  readonly maxRetries: number;
}

interface ProductServiceConfig {
  readonly enabled: boolean;
  readonly apiEndpoint: string;
  readonly timeout: number;
  readonly maxRetries: number;
}

interface OrderServiceConfig {
  readonly enabled: boolean;
  readonly apiEndpoint: string;
  readonly timeout: number;
  readonly maxRetries: number;
}
```

### 演習タスク

#### Task 1.1: 共通設定の抽出
BaseServiceConfig インターフェースを作成し、重複を排除しなさい。

```typescript
// ここにコードを書く

```

#### Task 1.2: サービス固有設定の拡張
各サービスに固有の設定を追加しなさい。

```typescript
// ここにコードを書く

```

#### Task 1.3: デフォルト設定の作成
各サービスのデフォルト設定を作成しなさい。

```typescript
// ここにコードを書く

```

### 評価基準

- [ ] BaseServiceConfig が適切に定義されている
- [ ] 各サービスインターフェースが BaseServiceConfig を拡張している
- [ ] 重複コードが完全に排除されている
- [ ] デフォルト設定が型安全に定義されている

### 模範解答

```typescript
// 共通設定の抽出
interface BaseServiceConfig {
  readonly enabled: boolean;
  readonly apiEndpoint: string;
  readonly timeout: number;
  readonly maxRetries: number;
}

// サービス固有設定の拡張
interface UserServiceConfig extends BaseServiceConfig {
  readonly userCacheSize: number;
}

interface ProductServiceConfig extends BaseServiceConfig {
  readonly productCacheSize: number;
  readonly imageOptimization: boolean;
}

interface OrderServiceConfig extends BaseServiceConfig {
  readonly orderValidation: boolean;
  readonly paymentTimeout: number;
}

// デフォルト設定の作成
const DEFAULT_BASE_CONFIG: BaseServiceConfig = {
  enabled: true,
  apiEndpoint: '/api',
  timeout: 5000,
  maxRetries: 3,
} as const;

const DEFAULT_USER_CONFIG: UserServiceConfig = {
  ...DEFAULT_BASE_CONFIG,
  userCacheSize: 100,
} as const;

const DEFAULT_PRODUCT_CONFIG: ProductServiceConfig = {
  ...DEFAULT_BASE_CONFIG,
  productCacheSize: 50,
  imageOptimization: true,
} as const;

const DEFAULT_ORDER_CONFIG: OrderServiceConfig = {
  ...DEFAULT_BASE_CONFIG,
  orderValidation: true,
  paymentTimeout: 30000,
} as const;
```

## 演習2: KISS原則の実践 - 複雑さの簡素化

### 問題設定

以下のコードは過度に複雑です。KISS原則を適用してシンプルにしなさい。

```typescript
// 演習用コード - 過度に複雑
interface ComplexProductConfig {
  readonly productClassification: {
    readonly type: {
      readonly category: 'physical' | 'digital' | 'service';
      readonly subcategory: string;
      readonly tags: readonly string[];
      readonly complexity: 'simple' | 'medium' | 'complex';
    };
    readonly pricing: {
      readonly model: 'fixed' | 'subscription' | 'usage';
      readonly currency: string;
      readonly tiers: readonly {
        readonly name: string;
        readonly price: number;
        readonly features: readonly string[];
      }[];
    };
  };
}
```

### 演習タスク

#### Task 2.1: 構造の平坦化
ネストされた構造を平坦にしなさい。

```typescript
// ここにコードを書く

```

#### Task 2.2: プリミティブ型の活用
複雑なオブジェクトをシンプルなプリミティブ型に置き換えなさい。

```typescript
// ここにコードを書く

```

#### Task 2.3: 使用例の作成
新しいシンプルなインターフェースを使用した実装例を作成しなさい。

```typescript
// ここにコードを書く

```

### 評価基準

- [ ] ネスト深度が3レベル以内に収まっている
- [ ] プリミティブ型が適切に活用されている
- [ ] コードの可読性が向上している
- [ ] 型安全性が維持されている

### 模範解答

```typescript
// 構造の平坦化
interface SimpleProductConfig {
  readonly productType: 'physical' | 'digital' | 'service';
  readonly category: string;
  readonly tags: readonly string[];
  readonly complexity: 'simple' | 'medium' | 'complex';
  readonly pricingModel: 'fixed' | 'subscription' | 'usage';
  readonly currency: string;
}

// 型エイリアスの活用
type ProductId = string;
type ProductName = string;
type Price = number;
type Currency = 'USD' | 'EUR' | 'JPY';

// よりシンプルな設定
interface FlatProductConfig {
  readonly id: ProductId;
  readonly name: ProductName;
  readonly type: 'physical' | 'digital' | 'service';
  readonly category: string;
  readonly tags: readonly string[];
  readonly complexity: 'simple' | 'medium' | 'complex';
  readonly price: Price;
  readonly currency: Currency;
  readonly pricingModel: 'fixed' | 'subscription' | 'usage';
}

// 使用例
const productConfig: FlatProductConfig = {
  id: 'prod-001',
  name: 'Wireless Headphones',
  type: 'physical',
  category: 'electronics',
  tags: ['audio', 'wireless', 'bluetooth'],
  complexity: 'medium',
  price: 199.99,
  currency: 'USD',
  pricingModel: 'fixed',
};

// ヘルパー関数
function formatPrice(config: FlatProductConfig): string {
  return `${config.currency} ${config.price.toFixed(2)}`;
}

function isDigitalProduct(config: FlatProductConfig): boolean {
  return config.type === 'digital';
}
```

## 演習3: ジェネリクスと型安全性の実践

### 問題設定

以下のコードにジェネリクスを適用して型安全性を向上させなさい。

```typescript
// 演習用コード - 型安全性が不十分
interface ApiResponse {
  readonly success: boolean;
  readonly data: any;        // 型安全性なし
  readonly error: any;       // 型安全性なし
}

function fetchUser(id: string): ApiResponse {
  // 実装
  return { success: true, data: { id, name: 'John' } };
}

function fetchProduct(id: string): ApiResponse {
  // 実装
  return { success: true, data: { id, name: 'Product', price: 100 } };
}
```

### 演習タスク

#### Task 3.1: ジェネリックApiResponseの作成
型パラメータを使用して型安全なApiResponseを作成しなさい。

```typescript
// ここにコードを書く

```

#### Task 3.2: 型安全なAPI関数の作成
各API関数が適切な型を返すように修正しなさい。

```typescript
// ここにコードを書く

```

#### Task 3.3: エラーハンドリングの改善
Result型パターンを適用してエラーハンドリングを改善しなさい。

```typescript
// ここにコードを書く

```

### 評価基準

- [ ] ApiResponse がジェネリック型パラメータを使用している
- [ ] 各API関数が適切な戻り値型を持っている
- [ ] エラーハンドリングが型安全に行われている
- [ ] 呼び出し側での型推論が正しく機能する

### 模範解答

```typescript
// ジェネリックApiResponse
interface ApiResponse<TData = unknown, TError = string> {
  readonly success: boolean;
  readonly data?: TData;
  readonly error?: TError;
}

// 具体的な型定義
interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly category: string;
}

// 型エイリアス
type UserResponse = ApiResponse<User>;
type ProductResponse = ApiResponse<Product>;
type ApiError = string;

// 型安全なAPI関数
function fetchUser(id: string): UserResponse {
  try {
    // 実際のAPI呼び出し
    const user: User = { id, name: 'John Doe', email: 'john@example.com' };
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: 'Failed to fetch user' };
  }
}

function fetchProduct(id: string): ProductResponse {
  try {
    // 実際のAPI呼び出し
    const product: Product = {
      id,
      name: 'Wireless Headphones',
      price: 199.99,
      category: 'electronics'
    };
    return { success: true, data: product };
  } catch (error) {
    return { success: false, error: 'Failed to fetch product' };
  }
}

// Result型パターンの適用
type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

function safeFetchUser(id: string): Result<User> {
  const response = fetchUser(id);
  if (response.success && response.data) {
    return { success: true, data: response.data };
  }
  return { success: false, error: new Error(response.error || 'Unknown error') };
}

// 使用例 - 完全な型安全性
const userResult = safeFetchUser('user-123');
if (userResult.success) {
  console.log(userResult.data.name); // User型として安全にアクセス
} else {
  console.error(userResult.error.message); // Error型として安全にアクセス
}
```

## 演習4: 大規模プロジェクトでの型管理

### 問題設定

以下のファイル構造には循環参照と命名の一貫性に問題があります。改善しなさい。

```typescript
// types/user.ts
export interface User {
  readonly id: string;
  readonly profile: UserProfile;
}

// types/profile.ts
import type { User } from './user'; // 循環参照の可能性
export interface UserProfile {
  readonly userId: string;
  readonly bio: string;
}
```

### 演習タスク

#### Task 4.1: 循環参照の解消
共通のプリミティブ型を使用して循環参照を解消しなさい。

```typescript
// ここにコードを書く

```

#### Task 4.2: 一貫性のある命名規則
プロジェクト全体で一貫性のある命名規則を適用しなさい。

```typescript
// ここにコードを書く

```

#### Task 4.3: バレルエクスポートの作成
効率的なインポートを可能にするバレルエクスポートを作成しなさい。

```typescript
// ここにコードを書く

```

### 評価基準

- [ ] 循環参照が完全に解消されている
- [ ] 命名規則が一貫している
- [ ] バレルエクスポートが適切に設定されている
- [ ] 型安全性が維持されている

### 模範解答

```typescript
// primitives.ts - 共通のプリミティブ型
export type ID = string;
export type Email = string;
export type Timestamp = number;

// user.ts - 循環参照を避ける
import type { ID, Email, Timestamp } from './primitives';

export interface User {
  readonly id: ID;
  readonly email: Email;
  readonly name: string;
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}

// profile.ts - 循環参照を避ける
import type { ID } from './primitives';

export interface UserProfile {
  readonly id: ID;
  readonly userId: ID;
  readonly bio: string;
  readonly avatar?: string;
  readonly website?: string;
}

// product.ts - 一貫性のある命名
import type { ID, Timestamp } from './primitives';

export interface Product {
  readonly id: ID;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly category: string;
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}

// index.ts - バレルエクスポート
export * from './primitives';
export * from './user';
export * from './profile';
export * from './product';

// 型エイリアスもエクスポート
export type {
  User as UserEntity,
  UserProfile as UserProfileEntity,
  Product as ProductEntity
};

// 使用例
import { User, UserProfile, Product, ID, Email } from '@/types';
import type { UserEntity, UserProfileEntity } from '@/types';
```

## 演習5: 統合計画の作成

### 問題設定

以下のレガシーシステムを新システムに統合する計画を作成しなさい。

```typescript
// レガシーシステム
interface LegacyAPI {
  fetchData(): any;
  saveData(data: any): boolean;
}

// 新システム
interface ModernAPI<T> {
  fetch<TData>(): Result<TData>;
  save<TData>(data: TData): Result<void>;
}
```

### 演習タスク

#### Task 5.1: 移行戦略の策定
段階的移行戦略を策定しなさい。

```typescript
// ここにコードを書く

```

#### Task 5.2: 互換性レイヤーの作成
後方互換性を確保する互換性レイヤーを作成しなさい。

```typescript
// ここにコードを書く

```

#### Task 5.3: テスト戦略の策定
統合テストとロールバックテストを策定しなさい。

```typescript
// ここにコードを書く

```

### 評価基準

- [ ] 移行戦略が段階的に定義されている
- [ ] 互換性レイヤーが適切に実装されている
- [ ] テスト戦略が包括的である
- [ ] ロールバック計画が策定されている

### 模範解答

```typescript
// 移行戦略の定義
interface MigrationPhase {
  readonly name: string;
  readonly duration: string;
  readonly components: readonly string[];
  readonly tests: readonly string[];
  readonly rollbackTime: number;
}

const MIGRATION_PHASES: readonly MigrationPhase[] = [
  {
    name: 'Phase 1: Compatibility Layer',
    duration: '1 week',
    components: ['LegacyAPI adapter', 'Type mapping'],
    tests: ['Unit tests', 'Compatibility tests'],
    rollbackTime: 30
  },
  {
    name: 'Phase 2: Gradual Migration',
    duration: '2 weeks',
    components: ['New API endpoints', 'Data migration'],
    tests: ['Integration tests', 'Performance tests'],
    rollbackTime: 60
  },
  {
    name: 'Phase 3: Full Migration',
    duration: '1 week',
    components: ['Legacy removal', 'Optimization'],
    tests: ['E2E tests', 'Load tests'],
    rollbackTime: 120
  }
];

// 互換性レイヤーの実装
class LegacyAPIAdapter implements LegacyAPI {
  constructor(private modernAPI: ModernAPI) {}

  fetchData(): any {
    const result = this.modernAPI.fetch();
    if (result.success) {
      return result.data;
    }
    throw new Error(result.error);
  }

  saveData(data: any): boolean {
    const result = this.modernAPI.save(data);
    return result.success;
  }
}

// 型安全なアダプター
class TypeSafeAPIAdapter {
  constructor(private modernAPI: ModernAPI) {}

  fetchUser(id: string): Result<User> {
    return this.modernAPI.fetch<User>();
  }

  saveUser(user: User): Result<void> {
    return this.modernAPI.save(user);
  }
}

// テスト戦略
interface TestStrategy {
  readonly unitTests: readonly string[];
  readonly integrationTests: readonly string[];
  readonly e2eTests: readonly string[];
  readonly performanceTests: readonly string[];
}

const INTEGRATION_TESTS: TestStrategy = {
  unitTests: [
    'LegacyAPIAdapter unit tests',
    'TypeSafeAPIAdapter unit tests',
    'Migration utility tests'
  ],
  integrationTests: [
    'API compatibility tests',
    'Data migration tests',
    'Error handling tests'
  ],
  e2eTests: [
    'User workflow tests',
    'Data consistency tests',
    'Rollback scenario tests'
  ],
  performanceTests: [
    'Migration performance tests',
    'API throughput tests',
    'Memory usage tests'
  ]
};

// ロールバック計画
interface RollbackPlan {
  readonly triggers: readonly string[];
  readonly procedures: readonly string[];
  readonly validation: readonly string[];
}

const ROLLBACK_PLAN: RollbackPlan = {
  triggers: [
    'API error rate > 5%',
    'Response time > 2s',
    'Data inconsistency detected'
  ],
  procedures: [
    'Stop new API traffic',
    'Switch to legacy API',
    'Restore database backup',
    'Validate system state'
  ],
  validation: [
    'All endpoints responding',
    'Data consistency verified',
    'User workflows functional',
    'Performance metrics normal'
  ]
};
```

## 演習の評価とフィードバック

### 総合評価基準

#### 技術的正確性 (40%)
- [ ] TypeScriptの構文が正しい
- [ ] 型安全性が確保されている
- [ ] パフォーマンスに配慮されている

#### 原則の適用 (30%)
- [ ] DRY原則が適切に適用されている
- [ ] KISS原則が適切に適用されている
- [ ] ベストプラクティスが守られている

#### 実用性 (20%)
- [ ] 実際のプロジェクトで使用可能
- [ ] エラーハンドリングが適切
- [ ] ドキュメントが充実している

#### コード品質 (10%)
- [ ] 読みやすいコードである
- [ ] 適切な命名規則が使用されている
- [ ] コメントが適切に記述されている

### フィードバックテンプレート

```
## 演習X 評価結果

### 強み
- [具体的な良い点1]
- [具体的な良い点2]

### 改善点
- [具体的な改善点1]
- [具体的な改善点2]

### 推奨事項
- [次のステップ1]
- [次のステップ2]

### 総合評価: ___ / 100点
```

この演習を通じて、DRY・KISS原則とTypeScript型定義システムの実践的なスキルを身につけることができます。
