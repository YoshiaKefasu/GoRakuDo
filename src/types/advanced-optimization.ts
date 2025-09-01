// ========== ADVANCED OPTIMIZATION TYPE DEFINITIONS ==========
// Strict TypeScript準拠の高度化システム型定義
// 既存システムとの完全な整合性を保証

export interface AdvancedOptimizationConfig {
  readonly structuredData: {
    readonly enabled: boolean;        // 構造化データ生成の有効化
    readonly schemas: readonly string[]; // 生成対象スキーマ
    readonly autoGeneration: boolean; // 自動生成の有効化
  };
  readonly qualityMonitoring: {
    readonly enabled: boolean;        // 高度品質監視の有効化
    readonly realTime: boolean;       // リアルタイム監視の有効化
    readonly autoDetection: boolean;  // 自動問題検出の有効化
  };
  readonly algorithmEnhancement: {
    readonly enabled: boolean;        // アルゴリズム高度化の有効化
    readonly machineLearning: boolean; // 機械学習の有効化
    readonly userBehavior: boolean;   // ユーザー行動分析の有効化
  };
}

export interface AdvancedOptimizationResult {
  readonly success: boolean;          // 高度化成功フラグ
  readonly quality: number;           // 高度化品質スコア（0-100）
  readonly enhancement: number;       // 高度化レベルスコア（0-100）
  readonly issues: readonly string[]; // 高度化時の問題点
  readonly recommendations: readonly string[]; // 改善推奨事項
}

export interface StructuredDataConfig {
  readonly articleSchema: boolean;    // Articleスキーマ生成
  readonly organizationSchema: boolean; // Organizationスキーマ生成
  readonly websiteSchema: boolean;    // Websiteスキーマ生成
  readonly breadcrumbSchema: boolean; // Breadcrumbスキーマ生成
  readonly autoGeneration: boolean;   // 自動生成の有効化
}

export interface StructuredDataResult {
  readonly success: boolean;          // 生成成功フラグ
  readonly schemas: readonly string[]; // 生成されたスキーマ
  readonly quality: number;           // 構造化データ品質スコア（0-100）
  readonly validation: readonly string[]; // 検証結果
}

export interface AdvancedQualityMonitoringConfig {
  readonly realTime: boolean;         // リアルタイム監視
  readonly autoDetection: boolean;    // 自動問題検出
  readonly metrics: readonly string[]; // 監視対象メトリクス
  readonly thresholds: Record<string, number>; // 品質閾値
}

export interface AdvancedQualityMonitoringResult {
  readonly status: 'active' | 'inactive' | 'error';
  readonly metrics: Record<string, number>; // 現在のメトリクス値
  readonly issues: readonly string[]; // 検出された問題
  readonly recommendations: readonly string[]; // 改善推奨事項
}

export interface AlgorithmEnhancementConfig {
  readonly machineLearning: boolean;  // 機械学習の有効化
  readonly userBehavior: boolean;     // ユーザー行動分析
  readonly optimizationLevel: 'basic' | 'advanced' | 'expert'; // 最適化レベル
  readonly adaptiveLearning: boolean; // 適応学習の有効化
}

export interface AlgorithmEnhancementResult {
  readonly success: boolean;          // 高度化成功フラグ
  readonly enhancement: number;       // 高度化レベルスコア（0-100）
  readonly improvements: readonly string[]; // 改善点
  readonly performance: Record<string, number>; // パフォーマンス指標
}

// ========== PHASE COMPLETION TYPE DEFINITIONS ==========
// Phase完了状態の型定義（新規追加）

export interface PhaseCompletionStatus {
  readonly phase: 'phase5' | 'phase6';
  readonly status: 'pending' | 'in-progress' | 'completed' | 'failed';
  readonly completionDate?: string;
  readonly qualityScore?: number;
  readonly issues?: readonly string[];
}

export interface PhaseQualityGate {
  readonly phase: 'phase5' | 'phase6';
  readonly passed: boolean;
  readonly score: number;
  readonly requirements: readonly string[];
  readonly completedRequirements: readonly string[];
  readonly missingRequirements: readonly string[];
}

// ========== QUALITY GATE TYPE DEFINITIONS ==========
// 段階的品質ゲートの型定義（新規追加）

export interface QualityGateConfig {
  readonly phase5: {
    readonly minQualityScore: number; // Phase 5最小品質スコア
    readonly requiredFeatures: readonly string[]; // 必須機能
    readonly testCoverage: number;    // 最小テストカバレッジ
  };
  readonly phase6: {
    readonly minQualityScore: number; // Phase 6最小品質スコア
    readonly requiredFeatures: readonly string[]; // 必須機能
    readonly testCoverage: number;    // 最小テストカバレッジ
  };
}

export interface QualityGateResult {
  readonly phase: 'phase5' | 'phase6';
  readonly passed: boolean;
  readonly score: number;
  readonly details: {
    readonly qualityScore: number;
    readonly testCoverage: number;
    readonly featureCompleteness: number;
    readonly issues: readonly string[];
  };
}

// ========== TEST CLEANUP TYPE DEFINITIONS ==========
// テストクリーンアップシステムの型定義（新規追加）

export interface TestCleanupConfig {
  readonly enabled: boolean;          // クリーンアップの有効化
  readonly autoCleanup: boolean;      // 自動クリーンアップ
  readonly redundantFileDetection: boolean; // 冗長ファイル検出
  readonly duplicateTestMerging: boolean; // 重複テスト統合
  readonly cleanupPatterns: readonly string[]; // クリーンアップパターン
}

export interface TestCleanupResult {
  readonly success: boolean;          // クリーンアップ成功フラグ
  readonly cleanedFiles: readonly string[]; // クリーンアップされたファイル
  readonly removedArtifacts: readonly string[]; // 削除されたアーティファクト
  readonly mergedTests: readonly string[]; // 統合されたテスト
  readonly spaceSaved: number;        // 節約された容量（バイト）
}

export interface RedundantFileInfo {
  readonly path: string;              // ファイルパス
  readonly type: 'test' | 'artifact' | 'temporary' | 'duplicate';
  readonly size: number;              // ファイルサイズ
  readonly lastModified: string;      // 最終更新日
  readonly reason: string;            // 冗長と判定された理由
}


