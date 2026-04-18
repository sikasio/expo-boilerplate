/**
 * Centralized Logger Utility for @sikasio/expo-boilerplate
 *
 * Provides consistent logging across all apps with development/production control.
 * Always logs to console for debugging, but respects production environment for UI elements.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  app?: string;
  component?: string;
  function?: string;
  userId?: string;
  [key: string]: any;
}

class Logger {
  private appName: string;

  constructor() {
    this.appName = 'BP';
  }

  /**
   * Check if we're in production environment
   * In production, all console logs are suppressed for security and performance
   */
  private get isProduction(): boolean {
    return process.env.EXPO_PUBLIC_APP_ENV === 'production' ||
           process.env.NODE_ENV === 'production';
  }

  /**
   * Check if logging is enabled (disabled in production)
   */
  private get isLoggingEnabled(): boolean {
    return !this.isProduction;
  }

  /**
   * Set the current app name for context
   */
  setApp(appName: string) {
    this.appName = appName;
  }

  /**
   * Check if we should show UI error overlays (false in production)
   */
  get shouldShowErrorOverlays(): boolean {
    return !this.isProduction;
  }

  /**
   * Format log message with context
   */
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const now = new Date();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const timestamp = `${minutes}:${seconds}`;
    
    const app = context?.app || this.appName;
    const component = context?.component ? `[${context.component}]` : '';
    const func = context?.function ? `::${context.function}` : '';

    return `[${timestamp}] ${level.toUpperCase()} ${app}${component}${func} - ${message}`;
  }

  /**
   * Format context data for display
   */
  private formatContext(context?: LogContext): any {
    if (!context) return undefined;

    // Remove internal fields used for formatting
    const { app, component, function: func, ...rest } = context;

    // Return remaining context if any
    return Object.keys(rest).length > 0 ? rest : undefined;
  }

  /**
   * Debug level logging - for detailed debugging info
   * Disabled in production
   */
  debug(message: string, context?: LogContext) {
    if (!this.isLoggingEnabled) return;

    const formattedMessage = this.formatMessage('debug', message, context);
    const contextData = this.formatContext(context);

    if (contextData) {
      console.log(formattedMessage, contextData);
    } else {
      console.log(formattedMessage);
    }
  }

  /**
   * Info level logging - for general information
   * Disabled in production
   */
  info(message: string, context?: LogContext) {
    if (!this.isLoggingEnabled) return;

    const formattedMessage = this.formatMessage('info', message, context);
    const contextData = this.formatContext(context);

    if (contextData) {
      console.info(formattedMessage, contextData);
    } else {
      console.info(formattedMessage);
    }
  }

  /**
   * Warning level logging - for warnings
   * Disabled in production
   */
  warn(message: string, context?: LogContext) {
    if (!this.isLoggingEnabled) return;

    const formattedMessage = this.formatMessage('warn', message, context);
    const contextData = this.formatContext(context);

    if (contextData) {
      console.warn(formattedMessage, contextData);
    } else {
      console.warn(formattedMessage);
    }
  }

  /**
   * Error level logging - for errors and exceptions
   * Disabled in production for security (errors should be sent to monitoring service instead)
   */
  error(message: string, error?: Error | any, context?: LogContext) {
    if (!this.isLoggingEnabled) return;

    const formattedMessage = this.formatMessage('error', message, context);
    const contextData = this.formatContext(context);

    if (error && contextData) {
      console.error(formattedMessage, error, contextData);
    } else if (error) {
      console.error(formattedMessage, error);
    } else if (contextData) {
      console.error(formattedMessage, contextData);
    } else {
      console.error(formattedMessage);
    }
  }

  /**
   * API request logging
   */
  api(method: string, url: string, context?: LogContext) {
    this.debug(`API ${method.toUpperCase()} ${url}`, {
      ...context,
      component: 'API',
    });
  }

  /**
   * Authentication event logging
   */
  auth(event: string, context?: LogContext) {
    this.info(`Auth: ${event}`, {
      ...context,
      component: 'Auth',
    });
  }

  /**
   * Navigation event logging
   */
  navigation(action: string, screen: string, context?: LogContext) {
    this.debug(`Navigation: ${action} -> ${screen}`, {
      ...context,
      component: 'Navigation',
    });
  }

  /**
   * Performance logging
   */
  performance(metric: string, value: number, unit: string = 'ms', context?: LogContext) {
    this.debug(`Performance: ${metric} = ${value}${unit}`, {
      ...context,
      component: 'Performance',
    });
  }

  /**
   * State management logging
   */
  state(action: string, context?: LogContext) {
    this.debug(`State: ${action}`, {
      ...context,
      component: 'State',
    });
  }

  /**
   * Firebase/Database operation logging
   */
  database(operation: string, collection?: string, context?: LogContext) {
    this.debug(`Database: ${operation}${collection ? ` on ${collection}` : ''}`, {
      ...context,
      component: 'Database',
    });
  }

  /**
   * Component lifecycle logging
   */
  lifecycle(component: string, event: string, context?: LogContext) {
    this.debug(`Lifecycle: ${component} ${event}`, {
      ...context,
      component: 'Lifecycle',
    });
  }

  /**
   * Custom app-specific logging
   */
  app(appName: string, message: string, context?: LogContext) {
    this.info(message, {
      ...context,
      app: appName,
    });
  }
}

// Create singleton instance
export const logger = new Logger();

// Export convenience functions for common usage
export const logDebug = (message: string, context?: LogContext) => logger.debug(message, context);
export const logInfo = (message: string, context?: LogContext) => logger.info(message, context);
export const logWarn = (message: string, context?: LogContext) => logger.warn(message, context);
export const logError = (message: string, error?: Error | any, context?: LogContext) => logger.error(message, error, context);
export const logAuth = (event: string, context?: LogContext) => logger.auth(event, context);
export const logAPI = (method: string, url: string, context?: LogContext) => logger.api(method, url, context);
export const logNavigation = (action: string, screen: string, context?: LogContext) => logger.navigation(action, screen, context);
export const logPerformance = (metric: string, value: number, unit?: string, context?: LogContext) => logger.performance(metric, value, unit, context);
export const logState = (action: string, context?: LogContext) => logger.state(action, context);
export const logDatabase = (operation: string, collection?: string, context?: LogContext) => logger.database(operation, collection, context);
export const logLifecycle = (component: string, event: string, context?: LogContext) => logger.lifecycle(component, event, context);

// Export production environment checks
export const shouldShowErrorOverlays = () => logger.shouldShowErrorOverlays;
export const isProductionMode = () => process.env.EXPO_PUBLIC_APP_ENV === 'production';

// Default export
export default logger;