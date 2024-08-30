const path = require('path');

// to fix static assest from being processed like import 'ol/ol.css';
module.exports = {
  process(src, filename, config, options) {
    return {
      code: 'module.exports = ' + JSON.stringify(path.basename(filename)) + ';';
    }
  }
};
