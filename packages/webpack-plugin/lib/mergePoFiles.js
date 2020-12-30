const { readdirSync } = require('fs');
const { forEachLimit } = require('async');
const { exec } = require('child_process');

function getPOFiles(srcpath) {
  return readdirSync(srcpath)
    .filter((file) => {
      const parts = file.split('.');

      if (parts.length > 0) {
        return parts[1] === 'po';
      }

      return false;
    });
}

function mergePOFiles(options) {
  return new Promise((resolve, reject) => {
    forEachLimit(getPOFiles(options.dist), 1, (item, next) => {
      if (item.indexOf(options.defaultLanguage) < 0) {
        exec(
          [
            'msgmerge',
            ' --backup=off',
            ' -U',
            ` ${options.dist}/${item}`,
            ` ${options.dist}/messages.pot`
          ].join(''), (err) => {
            if (err) {
              return reject(err);
            }
            next();
          }
        );
      } else {
        next();
      }
    }, resolve);
  });
}

module.exports = mergePOFiles;
