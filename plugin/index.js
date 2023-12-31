const path = require('path');
const { debug } = require('../utils');

const PLUGIN_NAME = 'ConfigPlugin';

const MODULE_LOADER = path.resolve(`${__dirname}/loader.js`);
const REGEX_MODULE = /@entva\/config\/index\.js$/;

class ConfigPlugin {
  constructor(options) {
    this.options = options;
    debug('initialized plugin with options %O', options);
  }

  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap(PLUGIN_NAME, (normalModuleFactory) => {
      normalModuleFactory.hooks.afterResolve.tap(PLUGIN_NAME, ({ createData }) => {
        if (REGEX_MODULE.test(createData.resource)) {
          debug('injected module loader for %s', createData.resource);

          createData.loaders.push({
            loader: MODULE_LOADER,
            options: this.options,
          });
        }
      });
    });
  }
}

module.exports = ConfigPlugin;
