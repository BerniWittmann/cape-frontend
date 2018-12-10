module.exports = {
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'vue'
  ],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  snapshotSerializers: [
    'jest-serializer-vue'
  ],
  testMatch: [
    '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'
  ],
  testURL: 'http://localhost/',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**',
    'src/**/*.(vue|js|jsx)',
    '!**/node_modules/**',
    '!src/*',
    '!src/assets/**',
    '!src/locales/**',
    '!src/plugins/*',
    '!src/plugins/bpmn/**/index.js',
    '!src/routes/**',
    '!src/vuex/store.js'
  ],
  coverageReporters: [
    'lcov', 'html', 'text-summary'
  ],
  coverageThreshold: {
    global: {
      statements: 80
    }
  }
}
