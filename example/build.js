const path = require('path');
const { frontendCompiler, getArgs } = require('@rockpack/compiler');
const MakePotPlugin = require('@localazer/webpack-plugin');
const { makepot } = getArgs();

const alias = {
  alias: {
    'react-dom': path.resolve(__dirname, '../node_modules/react-dom'),
    react: path.resolve(__dirname, '../node_modules/react'),
    'react-dom/server': path.resolve(__dirname, '../node_modules/react-dom/server')
  }
};

frontendCompiler({
  url: './'
}, (config, modules, plugins) => {
  Object.assign(config.resolve, alias);

  if (makepot) {
    plugins.set('MakePotPlugin', new MakePotPlugin());
  }
});
