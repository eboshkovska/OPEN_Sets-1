// Karma configuration
// Generated on Mon Apr 25 2016 15:12:17 GMT+0200 (Central European Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      { pattern: 'src/tests/*.ts', watched: false },
      { pattern: 'src/scripts/logic/*.js', watched: false }
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/tests/*.ts': ['typescript'],
      'src/scripts/logic/*.js': ['coverage']
    },

    typescriptPreprocessor: {
      // options passed to typescript compiler  
      tsconfigPath: './tsconfig.json', // *obligatory 
      compilerOptions: { // *optional 
        removeComments: false
      },
      ignorePath: function(path) { // ignore all files that ends with .d.ts (this files will not be served) 
        return /\.d\.ts$/.test(path);
      },
      // transforming the filenames  
      // you can pass more than one, they will be execute in order 
      transformPath: [function(path) { // *optional 
        return path.replace(/\.ts$/, '.js');
      }, function(path) {
        return path.replace(/[\/\\]test[\/\\]/i, '/'); // remove directory test and change to / 
      }]
    },

    coverageReporter: {
      reporters: [
        { type: 'json', subdir: '.', file: 'coverage-final.json' },
        { type: 'html', subdir: '.', file: 'coverage.html' },
        { type: 'text-summary', subdir: '.' }
      ]
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    plugins: [
      'karma-jasmine',
      'karma-coverage',
      'karma-chrome-launcher',
      'karma-sourcemap-loader',
      'karma-phantomjs-launcher',
      'karma-typescript-preprocessor2'
    ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
