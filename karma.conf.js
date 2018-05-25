var webpackConfig = require('./webpack.test.config.js');

var config = function(config) {
  return config.set({
    basePath: '',
    browsers: [
      // 'Chrome',
      // 'Firefox'
      'PhantomJS'
      // 'PhantomJS2'
    ],
    frameworks: [
      'jasmine'
    ],
    files: [ /*测试的入口文件*/
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      './node_modules/babel-polyfill/dist/polyfill.min.js',
      './test/**/*-spec.js'
    ],
    preprocessors: {
      // 测试文件，当前1个表达式即可满足
      './test/**/*-spec.js': ['webpack','sourcemap'],

      // 业务文件（或者组件），通常为多个表达式
      './src/pages/tenant*/*.jsx': ['webpack','sourcemap'], // "租客管理"功能对应的业务组件

      // 被测试代码覆盖率。由于使用了istanbul进行了覆盖率展示，此处不再需要
      // 'test/**/*-spec.js': 'coverage' // 测试覆盖率相关
    },

    /**
     * 持续集成（如Jenkins）、或本地（不考虑持续集成）下不同的覆盖率配置。详见下面的配置。
     * @author 郑彦义
     * @copyright 反复测试的经验结果，仅用于CALIS
     */

    // 不考虑持续集成，使用如下的配置即可
    // reporters: [
    //   'progress',
    //   'coverage'
    // ],
    // coverageReporter: {
    //   type: 'html',
    //   dir: './coverage-istanbul/',
    // },

    // 如考虑持续集成，必须使用如下的配置！！！
    reporters: ['dots', 'junit','coverage'],
    coverageReporter:{
        type: 'cobertura',
        dir: 'coverage-junit/'
    },
    junitReporter: {
      outputFile: 'test-results.xml'
    },

    webpack: Object.assign(
      {},
      webpackConfig,
      {
        externals: {
          'react/addons': true,
          'react/lib/ExecutionEnvironment': true,
          'react/lib/ReactContext': true,
        },
      }
    ),
    webpackServer: {
      noInfo: true,
    },
    colors: true,
    autoWatch: true,
    plugins: [
      'karma-webpack',
      'karma-jasmine',
      'karma-sourcemap-loader',
      'karma-phantomjs-launcher',
      // 'karma-phantomjs2-launcher',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-coverage',
      'karma-junit-reporter'
    ],
    singleRun: true
  });
};

module.exports = config;
