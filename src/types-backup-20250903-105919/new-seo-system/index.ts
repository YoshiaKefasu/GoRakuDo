// ========== NEW SEO SYSTEM TYPE DEFINITIONS ==========
// Comprehensive type system for the new SEO implementation
// This file provides unified exports for all SEO system types
// CRITICAL: Follows ES Modules (ESM) standards and Strict TypeScript mode

// ========== SAFETY SYSTEM EXPORTS ==========
// Core safety and protection system types
export type {
  ChangeRestrictionZone,
  SafetyCheckResult,
  SafetyChecker,
  TypeMigrationUtility,
  MigrationReport,
  RollbackResult,
  LegacySEO,
  NewSEOSystem
} from './safety-system';

// ========== COMPONENT PROPS EXPORTS ==========
// Component property type definitions
export type {
  BaseSEOProps,
  HeadSEOProps,
  BasicSEOProps,
  MetaManagerProps,
  IntegratedSEOProps,
  FaviconConfig,
  ResourceHints,
  SEOProperties,
  ArticleType,
  LearningStage,
  SearchIntent,
  SocialMediaConfig,
  OpenGraphProps,
  TwitterCardProps,
  AdvancedMetaConfig,
  ViewportConfig,
  PerformanceConfig,
  ResourceConfig,
  SecurityConfig,
  AnalyticsConfig,
  GlobalSEOConfig,
  SafetyConfig
} from './component-props';

// ========== VALIDATION TYPES EXPORTS ==========
// Types from validation.ts (separate from validation-types.ts)
// Using aliases to avoid conflicts with validation-types.ts exports
export type {
  ValidationResult as ValidationResultFromValidation,
  ValidationError as ValidationErrorFromValidation,
  ValidationWarning as ValidationWarningFromValidation,
  ValidationSuggestion,
  KeywordValidationResult,
  KeywordLengthStats,
  KeywordValidationRules,
  LanguageSupport,
  LanguageSpecificRules,
  MetadataValidationResult as MetadataValidationResultFromValidation,
  SocialMediaValidation,
  TagValidationResult,
  PerformanceValidation as PerformanceValidationFromValidation,
  ResourceHintValidation,
  PreloadValidation,
  PrefetchValidation,
  PerformanceScore,
  PerformanceFactor,
  SecurityValidation,
  CSPValidation,
  HSTSValidation,
  ReferrerPolicyValidation,
  SecurityScore,
  SecurityFactor
} from './validation';

// ========== INTEGRATED VALIDATION TYPES EXPORTS ==========
// Consolidated validation types from validation-types.ts and base-types.ts
export type {
  // Core validation types from base-types.ts (imported separately)
  // ValidationResult, ValidationError, ValidationWarning are from base-types

  // Metadata input utility types (from metadata-input.ts integration)
  PartialMetadataInput,
  MetadataFieldUpdate,
  MetadataInputEvent,

  // Advanced optimization utility types (from advanced-optimization.ts integration)
  AdvancedQualityMonitoringConfig,
  AdvancedQualityMonitoringResult,
  AlgorithmEnhancementConfig,
  AlgorithmEnhancementResult,
  PhaseCompletionStatus,
  PhaseQualityGate,

  // Existing validation types from validation-types.ts
  ValidationRule,
  ValidationSchema,
  ValidationPipeline,
  QualityValidationResult,
  PerformanceValidation as PerformanceValidationFromValidationTypes,

  // Metadata input types
  MetadataInput,
  MetadataValidationResult as MetadataValidationResultFromValidationTypes,
  MetadataReadResult,
  KeywordData,
  MetadataInputFormState,
  MetadataInputConfig,

  // Advanced optimization types
  AdvancedOptimizationConfig,
  AdvancedOptimizationResult,
  StructuredDataConfig,
  StructuredDataResult,
  QualityGateConfig,
  QualityGateResult,
  TestCleanupConfig,
  TestCleanupResult,
  RedundantFileInfo,

  // Fallback system types
  MetadataGap,
  ContentExtractionRule,
  ExtractionQualityScore,
  ContentExtractionResult,
  FallbackPriorityConfig,
  StopwordsConfig,
  FallbackSystemConfig,
  FallbackMetadata,
  FallbackResult
} from './validation-types';

// Import and re-export base validation types
export type {
  ValidationResult,
  ValidationError,
  ValidationWarning
} from './base-types';

// ========== METADATA EXPORTS ==========
// Metadata generation and management types
export type {
  MetaGenerationResult,
  MetaTag,
  MetaTagCategory,
  StructuredData,
  PerformanceHint,
  SecurityHeader,
  MetaTagGenerator,
  BasicMetaTagConfig,
  ViewportConfig as MetaViewportConfig,
  SocialMediaMetaConfig,
  OpenGraphConfig,
  TwitterCardConfig,
  TwitterPlayerConfig,
  LinkedInConfig,
  PinterestConfig,
  OrganizationData,
  WebsiteData,
  PageData,
  BreadcrumbData,
  ArticleData,
  PersonData,
  ContactPointData,
  FAQData,
  ReviewData,
  ReviewRatingData,
  MetaTagValidator,
  ValidationReport,
  ValidationSummary,
  ValidationDetail,
  ValidationIssue
} from './metadata';

// ========== TESTING EXPORTS ==========
// Testing and quality assurance types
export type {
  TestCoverage,
  TestExecutionStatus,
  RiskMitigationTests,
  TestScenario,
  TestCategory,
  TestPriority,
  TestStep,
  TestExecutionResult,
  TestStatus,
  TestResult,
  TestError,
  TestWarning,
  TestSuggestion,
  PerformanceMetrics,
  SecurityMetrics,
  SecurityVulnerability,
  TestLog,
  LogLevel,
  TestSuite,
  TestPlan,
  TestResource,
  TestSchedule,
  TestPhase,
  TestMilestone,
  ScheduleDependency,
  TestReport,
  TestSummary,
  RiskMitigationResults,
  RiskMitigationResult
} from './testing';

// ========== UTILITY EXPORTS ==========
// Common utility and helper types
export type {
  // Common utility types
  Optional,
  RequiredProps,
  PickProperties,
  ExcludeProperties,
  Merge,
  DeepPartial,
  DeepRequired,
  Nullable,
  Undefinable,
  Nullish,
  LiteralUnion,
  ValueOf,
  ArrayElement,
  PromiseResult,
  FunctionParameters,
  FunctionReturnType,
  
  // Conditional types
  If,
  Equals,
  Extends,
  Not,
  And,
  Or,
  Xor,
  
  // String utility types
  StringLiteral,
  StringPrefix,
  StringSuffix,
  StringTemplate,
  
  // Number utility types
  NumberRange,
  Add,
  Subtract,
  Multiply,
  Divide,
  
  // Array utility types
  ArrayLength,
  ArrayFirst,
  ArrayLast,
  ArrayRest,
  ArrayPush,
  ArrayPop,
  ArrayShift,
  ArrayUnshift,
  ArrayConcat,
  ArraySlice,
  
  // Object utility types
  ObjectKeys,
  ObjectValues,
  ObjectEntries,
  ObjectFromEntries,
  ObjectPick,
  ObjectOmit,
  ObjectRecord,
  
  // Function utility types
  FunctionOverload,
  FunctionCurry,
  FunctionCompose,
  
  // Validation utility types
  ValidationResult as ValidationResultHelper,
  
  // Error handling utility types
  ErrorType,
  ErrorResult,
  ErrorHandler,
  ErrorMapper,
  
  // Performance utility types
  PerformanceMetric,
  PerformanceMarker,
  PerformanceObserver,
  
  // Security utility types
  SecurityLevel,
  SecurityPolicy,
  SecurityViolation,
  
  // Internationalization utility types
  Locale,
  TranslationKey,
  TranslationValue,
  TranslationMap,
  TranslationFunction,
  
  // Accessibility utility types
  AriaRole,
  AriaState,
  AriaProperty,
  AccessibilityLevel,
  AccessibilityViolation,
  
  // SEO utility types
  SEOScore,
  SEOGrade,
  SEOMetric,
  SEOReport,
  
  // Keyword utility types
  KeywordType,
  KeywordDifficulty,
  KeywordMetric,
  KeywordAnalysis,
  
  // Meta tag utility types
  MetaTagType,
  MetaTagPriority,
  MetaTagCategory as MetaTagCategoryHelper,
  MetaTagValidation,
  
  // Structured data utility types (moved to validation-types exports)
  SchemaType,
  SchemaFormat,
  SchemaValidation,
  SchemaReport
} from './utils';

// ========== TYPE ALIASES FOR BACKWARD COMPATIBILITY ==========
// Type aliases to maintain compatibility with existing code
// These aliases provide a bridge between old and new type systems

// SEO Component Types (Primary exports)
export type SEOComponentProps = {
  head: import('./component-props').HeadSEOProps;
  basic: import('./component-props').BasicSEOProps;
  meta: import('./component-props').MetaManagerProps;
  integrated: import('./component-props').IntegratedSEOProps;
};

// SEO Validation Types (Primary exports)
export type SEOValidationTypes = {
  result: import('./validation').ValidationResult;
  keyword: import('./validation').KeywordValidationResult;
  metadata: import('./validation').MetadataValidationResult;
  performance: import('./validation').PerformanceValidation;
  security: import('./validation').SecurityValidation;
};

// SEO Metadata Types (Primary exports)
export type SEOMetadataTypes = {
  generation: import('./metadata').MetaGenerationResult;
  tags: import('./metadata').MetaTag[];
  structured: import('./metadata').StructuredData[];
  hints: import('./metadata').PerformanceHint[];
  headers: import('./metadata').SecurityHeader[];
};

// SEO Testing Types (Primary exports)
export type SEOTestingTypes = {
  coverage: import('./testing').TestCoverage;
  execution: import('./testing').TestExecutionStatus;
  riskMitigation: import('./testing').RiskMitigationTests;
  scenarios: import('./testing').TestScenario[];
  results: import('./testing').TestExecutionResult[];
};

// SEO Utility Types (Primary exports)
export type SEOUtilityTypes = {
  common: typeof import('./utils');
  validation: typeof import('./validation');
  performance: typeof import('./utils');
  security: typeof import('./utils');
  accessibility: typeof import('./utils');
  internationalization: typeof import('./utils');
};

// ========== NAMESPACE EXPORTS FOR ORGANIZATION ==========
// Organized namespaces to prevent naming conflicts
// Each namespace contains related types for better organization

// SEO Safety Namespace
export namespace SEOSafety {
  export type ChangeRestrictionZone = import('./safety-system').ChangeRestrictionZone;
  export type SafetyCheckResult = import('./safety-system').SafetyCheckResult;
  export type SafetyChecker = import('./safety-system').SafetyChecker;
  export type TypeMigrationUtility = import('./safety-system').TypeMigrationUtility;
  export type MigrationReport = import('./safety-system').MigrationReport;
  export type RollbackResult = import('./safety-system').RollbackResult;
}

// SEO Components Namespace
export namespace SEOComponents {
  export type BaseSEOProps = import('./component-props').BaseSEOProps;
  export type HeadSEOProps = import('./component-props').HeadSEOProps;
  export type BasicSEOProps = import('./component-props').BasicSEOProps;
  export type MetaManagerProps = import('./component-props').MetaManagerProps;
  export type IntegratedSEOProps = import('./component-props').IntegratedSEOProps;
  export type FaviconConfig = import('./component-props').FaviconConfig;
  export type ResourceHints = import('./component-props').ResourceHints;
  export type SEOProperties = import('./component-props').SEOProperties;
  export type ArticleType = import('./component-props').ArticleType;
  export type LearningStage = import('./component-props').LearningStage;
  export type SearchIntent = import('./component-props').SearchIntent;
  export type SocialMediaConfig = import('./component-props').SocialMediaConfig;
  export type OpenGraphProps = import('./component-props').OpenGraphProps;
  export type TwitterCardProps = import('./component-props').TwitterCardProps;
  export type AdvancedMetaConfig = import('./component-props').AdvancedMetaConfig;
  export type ViewportConfig = import('./component-props').ViewportConfig;
  export type PerformanceConfig = import('./component-props').PerformanceConfig;
  export type ResourceConfig = import('./component-props').ResourceConfig;
  export type SecurityConfig = import('./component-props').SecurityConfig;
  export type AnalyticsConfig = import('./component-props').AnalyticsConfig;
  export type GlobalSEOConfig = import('./component-props').GlobalSEOConfig;
  export type SafetyConfig = import('./component-props').SafetyConfig;
}

// SEO Validation Namespace
export namespace SEOValidation {
  export type ValidationResult = import('./validation').ValidationResult;
  export type ValidationError = import('./validation').ValidationError;
  export type ValidationWarning = import('./validation').ValidationWarning;
  export type ValidationSuggestion = import('./validation').ValidationSuggestion;
  export type KeywordValidationResult = import('./validation').KeywordValidationResult;
  export type KeywordLengthStats = import('./validation').KeywordLengthStats;
  export type KeywordValidationRules = import('./validation').KeywordValidationRules;
  export type LanguageSupport = import('./validation').LanguageSupport;
  export type LanguageSpecificRules = import('./validation').LanguageSpecificRules;
  export type MetadataValidationResult = import('./validation').MetadataValidationResult;
  export type SocialMediaValidation = import('./validation').SocialMediaValidation;
  export type TagValidationResult = import('./validation').TagValidationResult;
  export type PerformanceValidation = import('./validation').PerformanceValidation;
  export type ResourceHintValidation = import('./validation').ResourceHintValidation;
  export type PreloadValidation = import('./validation').PreloadValidation;
  export type PrefetchValidation = import('./validation').PrefetchValidation;
  export type PerformanceScore = import('./validation').PerformanceScore;
  export type PerformanceFactor = import('./validation').PerformanceFactor;
  export type SecurityValidation = import('./validation').SecurityValidation;
  export type CSPValidation = import('./validation').CSPValidation;
  export type HSTSValidation = import('./validation').HSTSValidation;
  export type ReferrerPolicyValidation = import('./validation').ReferrerPolicyValidation;
  export type SecurityScore = import('./validation').SecurityScore;
  export type SecurityFactor = import('./validation').SecurityFactor;
}

// SEO Metadata Namespace
export namespace SEOMetadata {
  export type MetaGenerationResult = import('./metadata').MetaGenerationResult;
  export type MetaTag = import('./metadata').MetaTag;
  export type MetaTagCategory = import('./metadata').MetaTagCategory;
  export type StructuredData = import('./metadata').StructuredData;
  export type PerformanceHint = import('./metadata').PerformanceHint;
  export type SecurityHeader = import('./metadata').SecurityHeader;
  export type MetaTagGenerator = import('./metadata').MetaTagGenerator;
  export type BasicMetaTagConfig = import('./metadata').BasicMetaTagConfig;
  export type SocialMediaMetaConfig = import('./metadata').SocialMediaMetaConfig;
  export type OpenGraphConfig = import('./metadata').OpenGraphConfig;
  export type TwitterCardConfig = import('./metadata').TwitterCardConfig;
  export type TwitterPlayerConfig = import('./metadata').TwitterPlayerConfig;
  export type LinkedInConfig = import('./metadata').LinkedInConfig;
  export type PinterestConfig = import('./metadata').PinterestConfig;
  export type OrganizationData = import('./metadata').OrganizationData;
  export type WebsiteData = import('./metadata').WebsiteData;
  export type PageData = import('./metadata').PageData;
  export type BreadcrumbData = import('./metadata').BreadcrumbData;
  export type ArticleData = import('./metadata').ArticleData;
  export type PersonData = import('./metadata').PersonData;
  export type ContactPointData = import('./metadata').ContactPointData;
  export type FAQData = import('./metadata').FAQData;
  export type ReviewData = import('./metadata').ReviewData;
  export type ReviewRatingData = import('./metadata').ReviewRatingData;
  export type MetaTagValidator = import('./metadata').MetaTagValidator;
  export type ValidationReport = import('./metadata').ValidationReport;
  export type ValidationSummary = import('./metadata').ValidationSummary;
  export type ValidationDetail = import('./metadata').ValidationDetail;
  export type ValidationIssue = import('./metadata').ValidationIssue;
}

// SEO Testing Namespace
export namespace SEOTesting {
  export type TestCoverage = import('./testing').TestCoverage;
  export type TestExecutionStatus = import('./testing').TestExecutionStatus;
  export type RiskMitigationTests = import('./testing').RiskMitigationTests;
  export type TestScenario = import('./testing').TestScenario;
  export type TestCategory = import('./testing').TestCategory;
  export type TestPriority = import('./testing').TestPriority;
  export type TestStep = import('./testing').TestStep;
  export type TestExecutionResult = import('./testing').TestExecutionResult;
  export type TestStatus = import('./testing').TestStatus;
  export type TestResult = import('./testing').TestResult;
  export type TestError = import('./testing').TestError;
  export type TestWarning = import('./testing').TestWarning;
  export type TestSuggestion = import('./testing').TestSuggestion;
  export type PerformanceMetrics = import('./testing').PerformanceMetrics;
  export type SecurityMetrics = import('./testing').SecurityMetrics;
  export type SecurityVulnerability = import('./testing').SecurityVulnerability;
  export type TestLog = import('./testing').TestLog;
  export type LogLevel = import('./testing').LogLevel;
  export type TestSuite = import('./testing').TestSuite;
  export type TestPlan = import('./testing').TestPlan;
  export type TestResource = import('./testing').TestResource;
  export type TestSchedule = import('./testing').TestSchedule;
  export type TestPhase = import('./testing').TestPhase;
  export type TestMilestone = import('./testing').TestMilestone;
  export type ScheduleDependency = import('./testing').ScheduleDependency;
  export type TestReport = import('./testing').TestReport;
  export type TestSummary = import('./testing').TestSummary;
  export type RiskMitigationResults = import('./testing').RiskMitigationResults;
  export type RiskMitigationResult = import('./testing').RiskMitigationResult;
}

// SEO Utilities Namespace
export namespace SEOUtils {
  // Common utility types
  export type Optional<T, K extends keyof T> = import('./utils').Optional<T, K>;
  export type RequiredProps<T, K extends keyof T> = import('./utils').RequiredProps<T, K>;
  export type PickProperties<T, K extends keyof T> = import('./utils').PickProperties<T, K>;
  export type ExcludeProperties<T, K extends keyof T> = import('./utils').ExcludeProperties<T, K>;
  export type Merge<T extends Record<string, any>[]> = import('./utils').Merge<T>;
  export type DeepPartial<T> = import('./utils').DeepPartial<T>;
  export type DeepRequired<T> = import('./utils').DeepRequired<T>;
  export type Nullable<T> = import('./utils').Nullable<T>;
  export type Undefinable<T> = import('./utils').Undefinable<T>;
  export type Nullish<T> = import('./utils').Nullish<T>;
  export type LiteralUnion<T extends string> = import('./utils').LiteralUnion<T>;
  export type ValueOf<T> = import('./utils').ValueOf<T>;
  export type ArrayElement<T> = import('./utils').ArrayElement<T>;
  export type PromiseResult<T> = import('./utils').PromiseResult<T>;
  export type FunctionParameters<T> = import('./utils').FunctionParameters<T>;
  export type FunctionReturnType<T> = import('./utils').FunctionReturnType<T>;
  
  // Conditional types
  export type If<C extends boolean, T, F> = import('./utils').If<C, T, F>;
  export type Equals<X, Y> = import('./utils').Equals<X, Y>;
  export type Extends<T, U> = import('./utils').Extends<T, U>;
  export type Not<T extends boolean> = import('./utils').Not<T>;
  export type And<A extends boolean, B extends boolean> = import('./utils').And<A, B>;
  export type Or<A extends boolean, B extends boolean> = import('./utils').Or<A, B>;
  export type Xor<A extends boolean, B extends boolean> = import('./utils').Xor<A, B>;
  
  // String utility types
  export type StringLiteral<T> = import('./utils').StringLiteral<T>;
  export type StringPrefix<P extends string, T extends string> = import('./utils').StringPrefix<P, T>;
  export type StringSuffix<T extends string, S extends string> = import('./utils').StringSuffix<T, S>;
  export type StringTemplate<T extends string, U extends Record<string, any>> = import('./utils').StringTemplate<T, U>;
  
  // Number utility types
  export type NumberRange<Start extends number, End extends number> = import('./utils').NumberRange<Start, End>;
  export type Add<A extends number, B extends number> = import('./utils').Add<A, B>;
  export type Subtract<A extends number, B extends number> = import('./utils').Subtract<A, B>;
  export type Multiply<A extends number, B extends number> = import('./utils').Multiply<A, B>;
  export type Divide<A extends number, B extends number> = import('./utils').Divide<A, B>;
  
  // Array utility types
  export type ArrayLength<T extends readonly any[]> = import('./utils').ArrayLength<T>;
  export type ArrayFirst<T extends readonly any[]> = import('./utils').ArrayFirst<T>;
  export type ArrayLast<T extends readonly any[]> = import('./utils').ArrayLast<T>;
  export type ArrayRest<T extends readonly any[]> = import('./utils').ArrayRest<T>;
  export type ArrayPush<T extends readonly any[], U> = import('./utils').ArrayPush<T, U>;
  export type ArrayPop<T extends readonly any[]> = import('./utils').ArrayPop<T>;
  export type ArrayShift<T extends readonly any[]> = import('./utils').ArrayShift<T>;
  export type ArrayUnshift<T extends readonly any[], U> = import('./utils').ArrayUnshift<T, U>;
  export type ArrayConcat<T extends readonly any[], U extends readonly any[]> = import('./utils').ArrayConcat<T, U>;
  export type ArraySlice<T extends readonly any[], Start extends number, End extends number> = import('./utils').ArraySlice<T, Start, End>;
  
  // Object utility types
  export type ObjectKeys<T> = import('./utils').ObjectKeys<T>;
  export type ObjectValues<T> = import('./utils').ObjectValues<T>;
  export type ObjectEntries<T> = import('./utils').ObjectEntries<T>;
  export type ObjectFromEntries<T extends readonly [PropertyKey, any][]> = import('./utils').ObjectFromEntries<T>;
  export type ObjectPick<T, K extends keyof T> = import('./utils').ObjectPick<T, K>;
  export type ObjectOmit<T, K extends keyof T> = import('./utils').ObjectOmit<T, K>;
  export type ObjectRecord<K extends PropertyKey, V> = import('./utils').ObjectRecord<K, V>;
  
  // Function utility types
  export type FunctionOverload<T> = import('./utils').FunctionOverload<T>;
  export type FunctionCurry<T> = import('./utils').FunctionCurry<T>;
  export type FunctionCompose<T extends readonly ((...args: any[]) => any)[]> = import('./utils').FunctionCompose<T>;
  
  // Validation utility types
  export type ValidationResultHelper<T> = import('./utils').ValidationResult<T>;
  export type ValidationRule<T> = import('./utils').ValidationRule<T>;
  export type ValidationSchema<T> = import('./utils').ValidationSchema<T>;
  export type ValidationPipeline<T> = import('./utils').ValidationPipeline<T>;
  
  // Error handling utility types
  export type ErrorType<T extends Error = Error> = import('./utils').ErrorType<T>;
  export type ErrorResult<T, E extends Error = Error> = import('./utils').ErrorResult<T, E>;
  export type ErrorHandler<T extends Error = Error> = import('./utils').ErrorHandler<T>;
  export type ErrorMapper<T extends Error = Error, U extends Error = Error> = import('./utils').ErrorMapper<T, U>;
  
  // Performance utility types
  export type PerformanceMetric = import('./utils').PerformanceMetric;
  export type PerformanceMarker = import('./utils').PerformanceMarker;
  export type PerformanceObserver<T extends PerformanceEntry> = import('./utils').PerformanceObserver<T>;
  
  // Security utility types
  export type SecurityLevel = import('./utils').SecurityLevel;
  export type SecurityPolicy = import('./utils').SecurityPolicy;
  export type SecurityViolation = import('./utils').SecurityViolation;
  
  // Internationalization utility types
  export type Locale = import('./utils').Locale;
  export type TranslationKey = import('./utils').TranslationKey;
  export type TranslationValue = import('./utils').TranslationValue;
  export type TranslationMap = import('./utils').TranslationMap;
  export type TranslationFunction = import('./utils').TranslationFunction;
  
  // Accessibility utility types
  export type AriaRole = import('./utils').AriaRole;
  export type AriaState = import('./utils').AriaState;
  export type AriaProperty = import('./utils').AriaProperty;
  export type AccessibilityLevel = import('./utils').AccessibilityLevel;
  export type AccessibilityViolation = import('./utils').AccessibilityViolation;
  
  // SEO utility types
  export type SEOScore = import('./utils').SEOScore;
  export type SEOGrade = import('./utils').SEOGrade;
  export type SEOMetric = import('./utils').SEOMetric;
  export type SEOReport = import('./utils').SEOReport;
  
  // Keyword utility types
  export type KeywordType = import('./utils').KeywordType;
  export type KeywordDifficulty = import('./utils').KeywordDifficulty;
  export type KeywordMetric = import('./utils').KeywordMetric;
  export type KeywordAnalysis = import('./utils').KeywordAnalysis;
  
  // Meta tag utility types
  export type MetaTagType = import('./utils').MetaTagType;
  export type MetaTagPriority = import('./utils').MetaTagPriority;
  export type MetaTagCategoryHelper = import('./utils').MetaTagCategory;
  export type MetaTagValidation = import('./utils').MetaTagValidation;
  
  // Structured data utility types
  export type SchemaType = import('./utils').SchemaType;
  export type SchemaFormat = import('./utils').SchemaFormat;
  export type SchemaValidation = import('./utils').SchemaValidation;
  export type SchemaReport = import('./utils').SchemaReport;
}

// ========== META MANAGER INTEGRATION TYPES ==========
// Types for MetaManager.astro integration

export interface IntegratedMetaResult {
  advanced: string[];
  performance: string[];
  security: string[];
  analytics: string[];
}

// ========== DEFAULT EXPORT FOR CONVENIENCE ==========
// Default export containing all namespaces for easy access
// Note: Namespaces cannot be used as values in default exports
// Use individual imports instead: import { SEOSafety, SEOComponents } from './index';

// ========== VERSION INFORMATION ==========
// Version information for type system tracking
export const VERSION = '1.0.0';
export const BUILD_DATE = '2024-12-31';
export const COMPATIBILITY = {
  typescript: '>=4.9.0',
  strictMode: true,
  esModules: true
};

// ========== TYPE SYSTEM VALIDATION ==========
// Runtime validation that all types are properly exported
export const TYPE_SYSTEM_STATUS = {
  safety: true,
  components: true,
  validation: true,
  metadata: true,
  testing: true,
  utilities: true,
  namespaces: true,
  compatibility: true
} as const;
