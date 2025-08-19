/**
 * Utility to get the current app name from the config file
 */

export function getCurrentApp(): string {
  try {
    // Try to load the config file dynamically to avoid build-time issues
    const appConfig = require('../../current-app.json');
    return appConfig.currentApp || '_default';
  } catch (error) {
    // Fallback to default if config file can't be loaded during build
    console.warn('Could not load current-app.json, falling back to default app');
    return '_default';
  }
}

export function getAppPrefix(): string {
  const currentApp = getCurrentApp();
  return currentApp === '_default' ? 'default_' : `${currentApp}_`;
}