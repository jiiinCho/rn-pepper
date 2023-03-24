/** @type {import('jest').Config} */
const config = {
  preset: '@testing-library/react-native',
  rootDir: './',
  modulePaths: ['<rootDir>'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['./jest-setup.js'],
  cacheDirectory: './cache/jest',
  modulePathIgnorePatterns: ['<rootDir>/example/node_modules', '<rootDir>/lib/'],
  watchPathIgnorePatterns: ['<rootDir>/src/babel/__fixtures__/*'],
  transformIgnorePatterns: ['node_modules/(?!(@react-native|react-native(-.*)?)/)'],
  testPathIgnorePatterns: ['<rootDir>/example/'],
};
module.exports = config;
