const colors = require('colors/safe');
const deepExtend = require('deep-extend');
const defaultOptions = require('../defaultOptions');
const make = require('./make');
const errorHandler = require('./errorHandler');

module.exports = async (opts = {}) => {
  errorHandler();
  try {
    const options = deepExtend({}, defaultOptions, opts);
    await make(options);
    console.log(colors.rainbow('========================='));
  } catch (err) {
    console.log(colors.red.underline(`Error: ${err}`));
    process.exit(1);
  }
  console.log(colors.green('Everything has compiled !'));
  process.exit();
};
