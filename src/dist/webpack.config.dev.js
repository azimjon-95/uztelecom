"use strict";

var JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = function override(config, env) {
  if (env === 'production') {
    config.plugins.push(new JavaScriptObfuscator({
      rotateUnicodeArray: true,
      selfDefending: true,
      deadCodeInjection: true,
      debugProtection: true,
      debugProtectionInterval: true,
      disableConsoleOutput: true
    }, []));
  }

  return config;
};