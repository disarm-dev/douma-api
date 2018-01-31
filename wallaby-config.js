module.exports = function (wallaby) {
  return {
    files: [
      'src/**/*.js',
    ],
    tests: [
      'test/**/*.test.js'
    ],
    testFramework: 'ava',
    compilers: {
      '**/*.js': wallaby.compilers.babel()
    },
    env: {
      type: 'node',
      runner: 'node'
    }
  }
}

