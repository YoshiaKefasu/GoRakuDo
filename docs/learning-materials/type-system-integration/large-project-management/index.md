# 大規模プロジェクトでの型管理手法

## 概要

大規模プロジェクトでは、TypeScriptの型定義が数百から数千に達することがあります。このドキュメントでは、大規模プロジェクトでの効果的な型管理手法について説明します。

## 1. 型定義の組織化

### ファイル構造の設計原則

#### 機能別組織化
```
src/types/
├── core/           # コアとなる共通型
│   ├── base.ts
│   ├── common.ts
│   └── primitives.ts
├── domain/         # ドメイン固有の型
│   ├── user.ts
│   ├── product.ts
│   └── order.ts
├── infrastructure/ # インフラ層の型
│   ├── api.ts
│   ├── database.ts
│   └── cache.ts
└── integration/    # 外部統合の型
    ├── payment.ts
    ├── notification.ts
    └── analytics.ts
```

#### プロジェクトでの実践例
```
src/types/
├── new-seo-system/
│   ├── base-types.ts      # 共通の基本型
│   ├── integration-types.ts # 統合システムの型
│   ├── validation-types.ts  # バリデーション関連型
│   ├── component-props.ts   # コンポーネントプロパティ
│   └── index.ts            # 公開API
├── refactored/             # リファクタリング中の型
└── global.d.ts            # グローバル型定義
```

### インポート/エクスポート戦略

#### バレルエクスポート (Barrel Export)
```typescript
// types/index.ts - 単一のエントリーポイント
export * from './base-types';
export * from './integration-types';
export * from './validation-types';
export * from './component-props';

// 使用例
import { User, Product, Order } from '@/types';
```

#### 選択的エクスポート
```typescript
// types/user.ts
export interface User { /* ... */ }
export interface UserProfile { /* ... */ }

// 内部使用のみの型はexportしない
interface InternalUserData { /* ... */ }
```

## 2. 循環参照の回避

### 問題の特定

循環参照は以下のような場合に発生します：
```typescript
// user.ts
import type { Order } from './order';

// order.ts
import type { User } from './user';
```

### 解決手法

#### 1. 型のみのインポート
```typescript
// user.ts
import type { Order } from './order'; // type-only import

export interface User {
  readonly id: string;
  readonly orders: readonly Order[];
}

// order.ts
import type { User } from './user'; // type-only import

export interface Order {
  readonly id: string;
  readonly user: User;
}
```

#### 2. 共通の基底型
```typescript
// types/primitives.ts
export type ID = string;
export type Timestamp = number;

// user.ts
import type { ID, Timestamp } from './primitives';

export interface User {
  readonly id: ID;
  readonly name: string;
  readonly createdAt: Timestamp;
}

// order.ts
import type { ID, Timestamp } from './primitives';

export interface Order {
  readonly id: ID;
  readonly userId: ID;
  readonly createdAt: Timestamp;
}
```

#### 3. インターフェースの分割
```typescript
// 循環参照を避けるためにインターフェースを分割
export interface UserSummary {
  readonly id: string;
  readonly name: string;
}

export interface User extends UserSummary {
  readonly orders: readonly OrderSummary[];
}

export interface OrderSummary {
  readonly id: string;
  readonly total: number;
}

export interface Order extends OrderSummary {
  readonly user: UserSummary;
}
```

## 3. 型安全性の確保

### Strict TypeScriptモードの活用

#### tsconfig.jsonの設定
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### 型ガードの実装

#### カスタム型ガード
```typescript
// 型安全性を確保するための型ガード
export function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as User).id === 'string' &&
    typeof (obj as User).name === 'string'
  );
}

export function isOrder(obj: unknown): obj is Order {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as Order).id === 'string' &&
    typeof (obj as Order).total === 'number'
  );
}

// 使用例
function processData(data: unknown) {
  if (isUser(data)) {
    // dataはUser型として扱える
    console.log(data.name);
  } else if (isOrder(data)) {
    // dataはOrder型として扱える
    console.log(data.total);
  }
}
```

#### ユーティリティ型ガード
```typescript
// 汎用的な型ガード関数
export function hasProperty<T extends object, K extends string>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> {
  return key in obj;
}

export function isNonNull<T>(value: T | null | undefined): value is T {
  return value != null;
}

// 使用例
function processUserData(data: unknown) {
  if (hasProperty(data, 'name') && typeof data.name === 'string') {
    // data.nameはstring型
  }
}
```

## 4. エラーハンドリングの型定義

### 結果型のパターン

#### Result型
```typescript
// 成功/失敗を表すResult型
export interface Result<T, E = Error> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: E;
}

// 使用例
export type UserResult = Result<User>;
export type OrderResult = Result<Order>;

function createUser(data: CreateUserData): UserResult {
  try {
    const user = validateAndCreateUser(data);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
```

#### Either型
```typescript
// より関数型的なアプローチ
export type Either<L, R> = Left<L> | Right<R>;

export interface Left<L> {
  readonly _tag: 'Left';
  readonly left: L;
}

export interface Right<R> {
  readonly _tag: 'Right';
  readonly right: R;
}

// 使用例
export type ValidationResult = Either<ValidationError[], User>;

function validateUser(data: unknown): ValidationResult {
  const errors = validateUserData(data);
  if (errors.length > 0) {
    return { _tag: 'Left', left: errors };
  }
  return { _tag: 'Right', right: data as User };
}
```

### エラータイプの階層化

```typescript
// エラータイプの階層構造
export interface BaseError {
  readonly code: string;
  readonly message: string;
  readonly timestamp: Date;
}

export interface ValidationError extends BaseError {
  readonly field: string;
  readonly value: unknown;
}

export interface NetworkError extends BaseError {
  readonly statusCode: number;
  readonly endpoint: string;
}

export interface DatabaseError extends BaseError {
  readonly operation: string;
  readonly table: string;
}
```

## 5. パフォーマンス最適化

### 型の遅延評価

#### 条件付き型の活用
```typescript
// 大きな型定義を条件付きで評価
export type ComponentProps<T> = T extends 'button'
  ? ButtonProps
  : T extends 'input'
  ? InputProps
  : T extends 'select'
  ? SelectProps
  : never;
```

#### 型の事前計算
```typescript
// 複雑な型を事前に計算
type UserKeys = keyof User;                    // 'id' | 'name' | 'email'
type OptionalUserKeys = {
  [K in UserKeys]?: User[K];
};
```

### バンドルサイズの最適化

#### ツリーシェイキング対応
```typescript
// 個別のエクスポート
export { validateUser } from './validation/user';
export { validateOrder } from './validation/order';

// バンドルされるのは使用された関数のみ
import { validateUser } from '@/validation';
```

## 6. ドキュメント化と保守性

### TSDocによるドキュメント化

```typescript
/**
 * ユーザー統合設定
 * SEOシステムとフォールバックシステムの設定を統合
 *
 * @example
 * ```typescript
 * const config: UserIntegrationConfig = {
 *   seoEnabled: true,
 *   fallbackEnabled: true,
 *   timeout: 5000
 * };
 * ```
 */
export interface UserIntegrationConfig {
  /** SEOシステムの有効化フラグ */
  readonly seoEnabled: boolean;

  /** フォールバックシステムの有効化フラグ */
  readonly fallbackEnabled: boolean;

  /** リクエストタイムアウト（ミリ秒） */
  readonly timeout: number;
}
```

### 型のバージョン管理

```typescript
// 型のバージョニング
export interface APIResponseV1 {
  readonly success: boolean;
  readonly data?: unknown;
}

export interface APIResponseV2 extends APIResponseV1 {
  readonly version: 'v2';
  readonly metadata?: Record<string, unknown>;
}

// 将来的な拡張のための基底型
export interface BaseAPIResponse {
  readonly success: boolean;
  readonly version: string;
}
```

## プロジェクトでの実践例

### 統合システムのアーキテクチャ

```typescript
// types/new-seo-system/index.ts
export * from './base-types';
export * from './integration-types';
export * from './validation-types';

// 主要な公開API
export type {
  IntegrationConfig,
  SEOIntegrationConfig,
  FallbackIntegrationConfig,
  ValidationResult
} from './integration-types';
```

### 段階的マイグレーション戦略

```typescript
// 移行中の型エイリアス
export type LegacySEOConfig = SEOIntegrationConfig;
export type LegacyFallbackConfig = FallbackIntegrationConfig;

// @deprecated マークで移行を促す
/**
 * @deprecated Use SEOIntegrationConfig instead
 */
export interface OldSEOConfig {
  readonly enabled: boolean;
  readonly endpoint: string;
  readonly timeout: number;
}
```

## まとめ

大規模プロジェクトでの型管理のポイント：

1. **構造化された組織化**: 機能別・層別でのファイル分割
2. **循環参照の回避**: type-only importと基底型の活用
3. **型安全性の確保**: Strictモードと型ガードの実装
4. **エラーハンドリング**: Result/Eitherパターンの活用
5. **パフォーマンス**: 遅延評価とツリーシェイキング
6. **保守性**: TSDocとバージョン管理

これらの手法を実践することで、スケーラブルで保守性の高いTypeScriptコードベースを構築できます。
