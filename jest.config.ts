import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest/presets/default-esm',

  testEnvironment: 'allure-jest/node',

  setupFilesAfterEnv: ['<rootDir>/src/hooks/jest.hooks.ts'],

  globalSetup: '<rootDir>/src/setup/globalSetup.ts',
  globalTeardown: '<rootDir>/src/setup/globalTeardown.ts',

  testMatch: ['**/tests/**/*.spec.ts'],
  maxWorkers: 1,
  testTimeout: 60000
}

export default config
