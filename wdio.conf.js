exports.config = {

    //execute test runner: ./node_modules/.bin/wdio wdio.conf.js
    specs: [
        './specs/sudoku.js'
    ],
    exclude: [
    ],
    capabilities: [{
        browserName: 'chrome'
    }],
    logLevel: 'error',
    coloredLogs: true,
    screenshotPath: './errorShots/',
    baseUrl: 'http://localhost',
    waitforTimeout: 10000,
    framework: 'mocha',
    reporter: 'dot',
    mochaOpts: {
        ui: 'bdd',
        timeout: 9999999
    },
    onPrepare: function() {
    },
    before: function() {
      var chai = require('chai');
      global.expect = chai.expect;
    },
    after: function(failures, pid) {
    },
    onComplete: function() {
    }
};
