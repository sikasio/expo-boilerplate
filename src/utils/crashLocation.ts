/**
 * Crash Location Utilities - Boilerplate
 *
 * Utilities for extracting crash location information from error stack traces.
 */

export interface CrashLocation {
  file: string;
  line: string;
  column: string;
  fullPath?: string;
}

/**
 * Extract crash location from error stack trace
 *
 * Parses the first line of the stack trace to extract:
 * - File name
 * - Line number
 * - Column number
 *
 * @param stack - Error stack trace string
 * @returns Crash location object or null if unable to parse
 *
 * @example
 * ```typescript
 * const location = extractCrashLocation(error.stack);
 * if (location) {
 *   console.log(`Crashed at ${location.file}:${location.line}`);
 * }
 * ```
 */
export function extractCrashLocation(stack?: string): CrashLocation | null {
  if (!stack) return null;

  // Parse first line of stack trace to get file location
  // Example formats:
  // - "at ComponentName (file:///path/to/file.tsx:123:45)"
  // - "at file:///path/to/file.tsx:123:45"
  // - "at Object.method (path/to/file.js:123:45)"

  const stackLines = stack.split('\n');
  const firstLine = stackLines[1] || stackLines[0]; // Skip error message line

  // Try format: "at ComponentName (file:///path/to/file.tsx:123:45)"
  const matchWithParens = firstLine.match(/\((.+):(\d+):(\d+)\)/);
  if (matchWithParens) {
    const [, filePath, line, column] = matchWithParens;
    const fileName = extractFileName(filePath);
    return { file: fileName, line, column, fullPath: filePath };
  }

  // Try format: "at file:///path/to/file.tsx:123:45"
  const matchWithoutParens = firstLine.match(/at\s+(.+):(\d+):(\d+)/);
  if (matchWithoutParens) {
    const [, filePath, line, column] = matchWithoutParens;
    const fileName = extractFileName(filePath);
    return { file: fileName, line, column, fullPath: filePath };
  }

  // Try format: "ComponentName@file:///path/to/file.tsx:123:45" (Safari/iOS)
  const matchSafari = firstLine.match(/(.+)@(.+):(\d+):(\d+)/);
  if (matchSafari) {
    const [, , filePath, line, column] = matchSafari;
    const fileName = extractFileName(filePath);
    return { file: fileName, line, column, fullPath: filePath };
  }

  return null;
}

/**
 * Extract just the filename from a full file path
 *
 * @param filePath - Full file path
 * @returns Just the filename
 */
function extractFileName(filePath: string): string {
  // Remove file:// protocol if present
  const cleanPath = filePath.replace('file://', '');

  // Get last segment of path
  const segments = cleanPath.split('/');
  const fileName = segments[segments.length - 1];

  // Remove query parameters if present
  return fileName.split('?')[0];
}

/**
 * Format crash location as a readable string
 *
 * @param location - Crash location object
 * @returns Formatted string like "file.tsx:123:45"
 *
 * @example
 * ```typescript
 * const formatted = formatCrashLocation(location);
 * // "VoiceRecordingButton.tsx:156:23"
 * ```
 */
export function formatCrashLocation(location: CrashLocation): string {
  return `${location.file}:${location.line}:${location.column}`;
}

/**
 * Extract the first N lines of the stack trace
 *
 * @param stack - Error stack trace
 * @param lines - Number of lines to extract (default: 3)
 * @returns Array of stack trace lines
 *
 * @example
 * ```typescript
 * const topLines = extractStackLines(error.stack, 3);
 * ```
 */
export function extractStackLines(stack?: string, lines: number = 3): string[] {
  if (!stack) return [];

  return stack
    .split('\n')
    .slice(0, lines + 1) // +1 to include error message
    .filter(line => line.trim().length > 0);
}
