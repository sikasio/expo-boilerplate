// Example-specific Metro config.
// Tells Metro to watch the parent package (@sikasio/expo-boilerplate) so
// local edits to src/ live-reload into this example.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const packageRoot = path.resolve(projectRoot, '..', '..');

const config = getDefaultConfig(projectRoot);

config.transformer.unstable_allowRequireContext = true;

// Watch the parent package source so edits to src/*.ts live-reload.
config.watchFolders = [packageRoot];

// Allow Metro to resolve modules from both the example's node_modules
// AND the parent package's node_modules (where peer deps may resolve).
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(packageRoot, 'node_modules'),
];

// Ensure duplicate packages (React, RN) resolve to the example's copy only.
config.resolver.disableHierarchicalLookup = false;

module.exports = config;
