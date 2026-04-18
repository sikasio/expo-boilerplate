/**
 * Jest config for @sikasio/expo-boilerplate.
 *
 * Tests target the pure-function utility and service layers — no React
 * Native rendering is required, so we use a plain node environment with
 * ts-jest instead of jest-expo (simpler, faster, no RN mocking surface).
 */
/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          target: 'ES2020',
          module: 'CommonJS',
          jsx: 'react-jsx',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          skipLibCheck: true,
          resolveJsonModule: true,
          isolatedModules: true,
          types: ['jest', 'node'],
        },
        diagnostics: false,
      },
    ],
  },
  testMatch: ['<rootDir>/__tests__/**/*.test.ts', '<rootDir>/__tests__/**/*.test.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  // Map the package's own path alias so tests can import from src/ cleanly.
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^react-native$': '<rootDir>/__tests__/__mocks__/react-native.ts',
  },
  collectCoverageFrom: [
    'src/utils/**/*.ts',
    '!src/utils/index.ts',
    '!src/utils/logger.ts',
    'src/services/cart.ts',
    'src/services/firstTime.service.ts',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov'],
};
