module.exports = {
  roots: ['<rootDir>/src'],
  preset: '@shelf/jest-mongodb',
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'jest-environment-node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  coveragePathIgnorePatterns: [
    '.+-(protocol|protocols|interface|model).ts$',
    'index.ts'
  ]
}
