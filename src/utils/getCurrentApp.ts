let currentApp = '_default';

export function setCurrentApp(name: string): void {
  if (name && typeof name === 'string') {
    currentApp = name;
  }
}

export function getCurrentApp(): string {
  return currentApp;
}

export function getAppPrefix(): string {
  return currentApp === '_default' ? 'default_' : `${currentApp}_`;
}
