const { join } = require('path');
const { parse } = require('po2json');
const { readFileSync, writeFileSync, readdirSync } = require('fs');
const mkdirp = require('mkdirp');
const { forEachLimit } = require('async');

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

function make(options) {
  return new Promise((resolve, reject) => {
    const src = options.src;
    const translations = getPOFiles(src);

    if (translations.length === 0) {
      return reject(new Error(`${src} - In current folder hasn't any PO files`));
    }

    forEachLimit(
      translations,
      1,
      (item, next) => {
        let buffer;
        const file = join(src, item);
        console.log(`Current translation: ${item}. File processing: ${file}`);
        try {
          buffer = readFileSync(file);
        } catch (err) {
          return reject(err);
        }
        const jsonData = parse(buffer, {
          format: 'jed1.x'
        });
        const filename = item.split('.')[0];

        if (!filename) {
          return reject(new Error('PO filename is empty'));
        }

        mkdirp.sync(options.dist);

        try {
          writeFileSync(join(options.dist, `${filename}.json`), JSON.stringify(jsonData));
        } catch (e) {
          return reject(e);
        }

        next();
      },
      resolve
    );
  });
}

module.exports = make;
