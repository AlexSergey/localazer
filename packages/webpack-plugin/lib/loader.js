const parser = require('./parser');
const utils = require('loader-utils');

function loader (source) {
  const options = utils.getOptions(this);

  parser({
    variables : options.variables
  }, source, global.__LOCALAZER_DATA__);

  return source;
}


module.exports = loader;
