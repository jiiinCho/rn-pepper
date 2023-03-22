/** @type {import('jest').Config} */
const config = {
  preset: '@testing-library/react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['./jest-setup.js'],
  cacheDirectory: './cache/jest',
  modulePathIgnorePatterns: ['<rootDir>/example/node_modules', '<rootDir>/lib/'],
  watchPathIgnorePatterns: ['<rootDir>/src/babel/__fixtures__/*'],
  transformIgnorePatterns: ['node_modules/(?!(@react-native|react-native(-.*)?)/)'],
  moduleNameMapper: {
    '^components$': '<rootDir>/src/components',
    '^core$': '<rootDir>/src/core',
    '^styles$': '<rootDir>/src/styles',
    '^utils$': '<rootDir>/src/utils',
    '^types$': '<rootDir>/src/types',
  },
};
module.exports = config;
