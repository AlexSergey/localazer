const { writeFileSync } = require('fs');
const { execSync } = require('child_process');
const tempy = require('tempy');
const { normalize, extname, join } = require('path');
const mkdirp = require('mkdirp');
const deepExtend = require('deep-extend');
const mergePoFiles = require('./mergePoFiles');
const defaultOptions = require('../defaultOptions');

class MakePotPlugin {
  constructor(options) {
    console.log('Making POT file is started...');
    global.__LOCALAZER_DATA__ = [];
    this.options = deepExtend({}, defaultOptions, options);
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('MakePotPlugin', compilation => {
      compilation.hooks.normalModuleLoader.tap('MakePotPlugin', this.parse);
    });

    compiler.hooks.done.tap('MakePotPlugin', this.makePot);
  }

  parse = (loaderContext, module) => {
    const ext = extname(module.resource);

    if (this.options.extensions.includes(ext)) {
      module.loaders.unshift({
        loader: join(__dirname, 'loader.js'),
        options: {
          variables: this.options.variables
        }
      });
    }
  }

  makePot = () => {
    const result = global.__LOCALAZER_DATA__;

    if (result.length > 0) {
      try {
        const dict = tempy.file();
        const list = tempy.file();

        writeFileSync(dict, result.join(''));
        writeFileSync(list, dict);

        mkdirp.sync(this.options.dist);
        execSync(
          [
            'xgettext',
            ` --keyword="${this.options.variables.gettext}:1"`,
            ` --keyword="${this.options.variables.gettext}:1,2c"`,
            ` --keyword="${this.options.variables.ngettext}:1,2"`,
            ` --keyword="${this.options.variables.ngettext}:1,2,4c"`,
            ` --files-from="${list}"`,
            ' --language=JavaScript',
            ' --no-location',
            ' --from-code=UTF-8',
            ` --output="${normalize(`${this.options.dist}/messages.pot`)}"`
          ].join('')
        );
        console.log('messages.pot created');

        (async () => {
          console.log('if you have previous pot file it will be merged');
          await mergePoFiles(this.options);
        })();
      } catch (err) {
        throw new Error(err);
      }
    } else {
      console.log('Nothing found for translation in your project');
    }
  }
}

module.exports = MakePotPlugin;
