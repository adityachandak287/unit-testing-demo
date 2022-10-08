/** @type {import("jest").Config} */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
  collectCoverage: true,
  verbose: true,
  bail: false,
  detectOpenHandles: true,
  coverageDirectory: '../coverage',
  coverageReporters: ['lcov', 'text', 'text-summary'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coveragePathIgnorePatterns: [
    'src/main.ts',
    '.*\\.module\\.ts$',
    '.*\\.controller\\.ts$',
    '.*\\.repository\\.ts$',
  ],
};
