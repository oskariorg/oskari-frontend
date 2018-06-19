const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: [
    //'./src.es6/core.js',
    './applications/paikkatietoikkuna.fi/full-map/minifierAppSetup.json'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        "style-loader", // creates style nodes from JS strings
        "css-loader", // translates CSS into CommonJS
        "sass-loader" // compiles Sass to CSS
      ]
    },
    {
      test: /\.css$/,
      use: [
        "style-loader", // creates style nodes from JS strings
        "css-loader", // translates CSS into CommonJS
      ]
    },

    {
      test: /\.(png|jpg|gif)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192
          }
        }
      ]
    },
    {
      test: /\.(ttf)$/,
      use: [
        {
          loader: 'file-loader',
          options: {}
        }
      ]
    },
    {
      type: 'javascript/auto',
      test: /minifierAppSetup\.json$/,
      use: [
        {
          loader: path.resolve('./tools/minifierLoader.js')
        }
      ]
    },
    {
      test: /bundle\.js$/,
      use: [
        {
          loader: path.resolve('./tools/bundleLoader.js')
        }
      ]
    }]
  },
  plugins: [new webpack.IgnorePlugin(/(^\.\/locale)|(^\.\/jqtree-circle\.png)|(x[0-9]{3}\.png)$/)]
};