// Error Handling Utilities - Index File
// Centralized exports for all error handling and monitoring utilities

export {
  DiscordErrorReporter,
  discordErrorReporter,
} from './discord-error-reporter';

export type {
  DiscordErrorReport,
  DiscordErrorUI,
} from './discord-error-reporter';

export { ProgressiveErrorHandler, errorHandler } from './error-handler';

export type { ErrorLevel, ErrorContext } from './error-handler';

export {
  HybridErrorHandler,
  errorHandler as hybridErrorHandler,
} from './hybrid-error-handler';

export type {
  ErrorContext as HybridErrorContext,
  ErrorLogEntry,
  ErrorType,
} from './hybrid-error-handler';
