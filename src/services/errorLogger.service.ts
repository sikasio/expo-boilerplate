/**
 * Error Logger Service - Boilerplate
 *
 * Logs errors locally to AsyncStorage and provides utilities to view/manage logs.
 * Provides local debugging capabilities.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const ERROR_LOG_KEY = '@app/error_logs';
const INIT_STATUS_KEY = '@app/init_status';
const MAX_LOGS = 50; // Keep last 50 errors

export interface ErrorLog {
  id: string;
  timestamp: string;
  message: string;
  stack?: string;
  componentStack?: string;
  context?: Record<string, any>;
  level: 'error' | 'fatal' | 'warning' | 'info';
}

export interface InitStatus {
  timestamp: string;
  environment: string;
  version: string;
  [key: string]: any;
}

/**
 * Log an error to local storage
 */
export async function logError(
  error: Error,
  componentStack?: string,
  context?: Record<string, any>
): Promise<void> {
  try {
    const logs = await getErrorLogs();

    const errorLog: ErrorLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      message: error.message || 'Unknown error',
      stack: error.stack,
      componentStack,
      context,
      level: 'error',
    };

    logs.unshift(errorLog);

    // Keep only last MAX_LOGS entries
    const trimmedLogs = logs.slice(0, MAX_LOGS);

    await AsyncStorage.setItem(ERROR_LOG_KEY, JSON.stringify(trimmedLogs));

    console.log('[ErrorLogger] Error logged:', errorLog.id);
  } catch (storageError) {
    console.error('[ErrorLogger] Failed to log error:', storageError);
  }
}

// Alias for backwards compatibility
export const logErrorToStorage = logError;

/**
 * Get all error logs
 */
export async function getErrorLogs(): Promise<ErrorLog[]> {
  try {
    const logsJson = await AsyncStorage.getItem(ERROR_LOG_KEY);
    if (!logsJson) return [];

    return JSON.parse(logsJson);
  } catch (error) {
    console.error('[ErrorLogger] Failed to get error logs:', error);
    return [];
  }
}

/**
 * Clear all error logs
 */
export async function clearErrorLogs(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ERROR_LOG_KEY);
    console.log('[ErrorLogger] Logs cleared');
  } catch (error) {
    console.error('[ErrorLogger] Failed to clear logs:', error);
  }
}

/**
 * Get error logs as formatted text
 */
export async function getErrorLogsText(): Promise<string> {
  const logs = await getErrorLogs();

  if (logs.length === 0) {
    return 'No error logs found';
  }

  return logs.map((log, index) => {
    return `
===========================================
ERROR #${index + 1} - ${log.id}
===========================================
Timestamp: ${log.timestamp}
Level: ${log.level.toUpperCase()}

Message:
${log.message}

Stack Trace:
${log.stack || 'No stack trace'}

Component Stack:
${log.componentStack || 'No component stack'}

Context:
${log.context ? JSON.stringify(log.context, null, 2) : 'No context'}
`;
  }).join('\n');
}

/**
 * Save initialization status
 */
export async function saveInitStatus(status: InitStatus): Promise<void> {
  try {
    await AsyncStorage.setItem(INIT_STATUS_KEY, JSON.stringify(status));
  } catch (error) {
    console.error('[ErrorLogger] Failed to save init status:', error);
  }
}

/**
 * Get initialization status
 */
export async function getInitStatus(): Promise<InitStatus | null> {
  try {
    const statusJson = await AsyncStorage.getItem(INIT_STATUS_KEY);
    if (!statusJson) return null;

    return JSON.parse(statusJson);
  } catch (error) {
    console.error('[ErrorLogger] Failed to get init status:', error);
    return null;
  }
}

/**
 * Export logs as shareable text
 */
export async function exportLogsAsText(): Promise<string> {
  const [logs, initStatus] = await Promise.all([
    getErrorLogsText(),
    getInitStatus(),
  ]);

  return `
===========================================
INITIALIZATION STATUS
===========================================
${initStatus ? JSON.stringify(initStatus, null, 2) : 'No init status available'}

===========================================
ERROR LOGS (Last ${MAX_LOGS})
===========================================
${logs}

Generated: ${new Date().toISOString()}
`;
}

/**
 * Send test error to local logs
 */
export async function sendTestError(): Promise<void> {
  const testError = new Error('Test error from Error Logs Screen');

  // Log locally
  await logError(testError, 'Test component stack', {
    test: true,
    source: 'ErrorLogsScreen',
  });

  console.log('[ErrorLogger] Test error sent');
}

/**
 * Get error log statistics
 */
export async function getErrorLogStats(): Promise<{
  total: number;
  byLevel: Record<string, number>;
  lastErrorTime?: string;
}> {
  const logs = await getErrorLogs();

  const stats = {
    total: logs.length,
    byLevel: {} as Record<string, number>,
    lastErrorTime: logs[0]?.timestamp,
  };

  logs.forEach(log => {
    stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
  });

  return stats;
}
