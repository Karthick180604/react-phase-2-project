/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setUpTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
    "/\.(png|jpg|jpeg|gif|webp|svg)$/": "<rootDir>/__mocks__/fileMock.js"

  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.app.json' }],
  },
  testMatch: ['**/__tests__/**/*.(spec|test).[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.tsx',
    '!src/**/index.ts',
    '!src/**/types.ts',
    '!src/constants/**',
    '!src/assets/**',
    '!src/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  globals: {
    'ts-jest': {
      diagnostics: false
    },
  },
};
