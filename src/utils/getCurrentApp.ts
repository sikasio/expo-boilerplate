/**
 * Utility to get the current app name from the config file
 */

import appConfig from '../../app.config.json';

export function getCurrentApp(): string {
  return appConfig.currentApp || '_default';
}

export function getAppPrefix(): string {
  const currentApp = getCurrentApp();
  return currentApp === '_default' ? 'default_' : `${currentApp}_`;
}