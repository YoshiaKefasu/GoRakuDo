# TypeScript型定義の基本概念

## 概要

TypeScriptの型定義システムは、大規模アプリケーションの開発において重要な役割を果たします。このドキュメントでは、型（type）、インターフェース（interface）、ジェネリクス（generics）の基本概念について説明します。

## 1. 型 (Type) と インターフェース (Interface)

### 基本的な違い

#### インターフェース (Interface)
```typescript
// オブジェクトの構造を定義
interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly createdAt: Date;
}

// 使用例
const user: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date(),
};
```

#### 型エイリアス (Type)
```typescript
// より柔軟な型定義
type UserId = string;
type Email = string;
type Timestamp = number;

// ユニオン型
type UserRole = 'admin' | 'user' | 'guest';

// オブジェクト型
type User = {
  readonly id: UserId;
  readonly name: string;
  readonly email: Email;
  readonly role: UserRole;
  readonly createdAt: Timestamp;
};
```

### 使い分けのガイドライン

#### インターフェースを使う場合
- オブジェクトの構造を定義する場合
- クラスを実装する場合
- 拡張（extends）する場合
- 宣言的マージングが必要な場合

#### 型エイリアスを使う場合
- プリミティブ型やユニオン型を定義する場合
- 複雑な型式を簡略化する場合
- 条件付き型やマッピング型を使う場合
- 型を計算する場合

### 実践例
```typescript
// インターフェース - 拡張可能
interface BaseEntity {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

interface User extends BaseEntity {
  readonly name: string;
  readonly email: string;
}

// 型エイリアス - 柔軟な定義
type UserId = string;
type UserStatus = 'active' | 'inactive' | 'suspended';
type UserPermissions = readonly string[];

// 組み合わせ
type User = {
  readonly id: UserId;
  readonly name: string;
  readonly email: string;
  readonly status: UserStatus;
  readonly permissions: UserPermissions;
} & BaseEntity;
```

## 2. ジェネリクス (Generics)

### 基本概念

ジェネリクスは、型をパラメータ化することで、再利用可能な汎用的な型を定義できます。

#### 基本的なジェネリクス
```typescript
// ジェネリック関数
function identity<T>(value: T): T {
  return value;
}

// 使用例
const result1 = identity<string>('hello');     // string
const result2 = identity<number>(42);          // number
const result3 = identity<User>(user);          // User
```

#### ジェネリックインターフェース
```typescript
interface Result<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
}

interface ListResponse<T> {
  readonly items: readonly T[];
  readonly total: number;
  readonly hasMore: boolean;
}

// 使用例
type UserResult = Result<User>;
type UserListResponse = ListResponse<User>;

const userResult: UserResult = {
  success: true,
  data: user,
};

const userList: UserListResponse = {
  items: [user],
  total: 1,
  hasMore: false,
};
```

### 高度なジェネリクス

#### 制約付きジェネリクス
```typescript
// Tは特定のプロパティを持つことを制約
interface HasId {
  readonly id: string;
}

function findById<T extends HasId>(items: readonly T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}

// 使用例
const users: readonly User[] = [/* ... */];
const foundUser = findById(users, '1'); // User | undefined
```

#### 複数の型パラメータ
```typescript
interface Dictionary<TKey, TValue> {
  readonly [key: string]: TValue;
}

function mapDictionary<TKey, TValue, TResult>(
  dict: Dictionary<TKey, TValue>,
  mapper: (key: string, value: TValue) => TResult
): Dictionary<TKey, TResult> {
  const result: Dictionary<TKey, TResult> = {};

  for (const [key, value] of Object.entries(dict)) {
    result[key] = mapper(key, value);
  }

  return result;
}
```

#### デフォルト型パラメータ
```typescript
interface Config<TValue = string> {
  readonly key: string;
  readonly value: TValue;
  readonly required: boolean;
}

// 使用例
const stringConfig: Config = { key: 'name', value: 'John', required: true };
const numberConfig: Config<number> = { key: 'age', value: 30, required: false };
```

## 3. 高度な型定義パターン

### 条件付き型 (Conditional Types)
```typescript
// 条件に基づいて型を決定
type IsArray<T> = T extends readonly unknown[] ? true : false;

type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

// 使用例
type StringArray = string[];
type ElementType = ArrayElement<StringArray>; // string

type NumberArray = number[];
type NumberElement = ArrayElement<NumberArray>; // number
```

### マッピング型 (Mapped Types)
```typescript
// 既存の型のプロパティを変換
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P];
};

// 使用例
interface User {
  name: string;
  email: string;
  age?: number;
}

type ReadonlyUser = Readonly<User>;
type PartialUser = Partial<User>;
type RequiredUser = Required<User>;
```

### テンプレートリテラル型 (Template Literal Types)
```typescript
// 文字列リテラルを操作した型を生成
type EventName<T extends string> = `${T}Changed` | `${T}Updated` | `${T}Deleted`;

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type APIEndpoint = `/${string}`;

type HTTPEvent = EventName<HTTPMethod>;
// "GETChanged" | "GETUpdated" | "GETDeleted" | "POSTChanged" | ...

// 使用例
interface APIEventHandlers {
  onGETChanged: (endpoint: APIEndpoint) => void;
  onPOSTUpdated: (endpoint: APIEndpoint) => void;
  onPUTDeleted: (endpoint: APIEndpoint) => void;
  onDELETEChanged: (endpoint: APIEndpoint) => void;
}
```

## プロジェクトでの実践例

### 統合システムでの型定義

#### BaseIntegrationConfigの活用
```typescript
// 基本設定の共通化
export interface BaseIntegrationConfig {
  readonly enabled: boolean;
  readonly timeout: number;
  readonly maxRetries?: number;
}

// 具体的な設定への拡張
export interface SEOIntegrationConfig extends BaseIntegrationConfig {
  readonly apiEndpoint: string;
  readonly qualityThreshold: number;
}

export interface FallbackIntegrationConfig extends BaseIntegrationConfig {
  readonly fallbackEndpoint: string;
  readonly priority: 'manual' | 'auto' | 'fallback' | 'default';
}
```

#### ジェネリックな結果型
```typescript
// 汎用的な結果型
export interface Result<TData = unknown, TError = string> {
  readonly success: boolean;
  readonly data?: TData;
  readonly error?: TError;
  readonly timestamp: Date;
}

// 具体的な使用例
export type IntegrationResult = Result<IntegrationData, IntegrationError>;
export type ValidationResult = Result<ValidationData, ValidationError>;
export type APIResult<T> = Result<T, APIError>;
```

#### 設定の型安全性を確保
```typescript
// 設定キーの型安全性
export type ConfigKey = keyof IntegrationConfig;
export type ConfigValue<T extends ConfigKey> = IntegrationConfig[T];

// 型安全な設定取得関数
export function getConfigValue<T extends ConfigKey>(
  config: IntegrationConfig,
  key: T
): ConfigValue<T> {
  return config[key];
}

// 使用例
const timeout = getConfigValue(config, 'seoSystem'); // SEOIntegrationConfig
const endpoint = getConfigValue(config, 'fallbackSystem'); // FallbackIntegrationConfig
```

## ベストプラクティス

### 1. 型定義の命名規則
```typescript
// 良い例
interface UserProfile { /* ... */ }
type UserId = string;
type UserStatus = 'active' | 'inactive';

// 悪い例
interface userprofile { /* ... */ }  // PascalCaseを使用
type userid = string;               // PascalCaseを使用
type USER_STATUS = 'active';        // 型定義にSCREAMING_SNAKE_CASEを使用しない
```

### 2. 型の再利用
```typescript
// 共通の型を定義して再利用
export type ID = string;
export type Timestamp = number;
export type Email = string;

// 複数の場所で使用
interface User {
  readonly id: ID;
  readonly email: Email;
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}

interface Post {
  readonly id: ID;
  readonly authorId: ID;
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}
```

### 3. 型の拡張性
```typescript
// 将来の拡張を考慮した設計
interface BaseConfig {
  readonly enabled: boolean;
  readonly timeout: number;
}

// 拡張可能な設定
interface SEOConfig extends BaseConfig {
  readonly apiEndpoint: string;
  readonly qualityThreshold: number;
}

// 新しい機能を追加する場合
interface AdvancedSEOConfig extends SEOConfig {
  readonly caching: boolean;
  readonly analytics: boolean;
}
```

## まとめ

TypeScriptの型定義システムを効果的に活用することで：

1. **型安全性**: コンパイル時にエラーを検出
2. **開発効率**: IDEの支援を最大限に活用
3. **保守性**: リファクタリング時の安全性確保
4. **ドキュメント化**: コード自体が仕様となる

基本概念を理解し、適切に活用することで、より高品質で保守性の高いコードベースを構築できます。
