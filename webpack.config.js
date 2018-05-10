const path = require('path');

module.exports = {
  entry: './applications/defaultApp.js',
  output: {
      path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};