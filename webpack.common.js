const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const LocalizationPlugin = require('./webpack/localizationPlugin');

module.exports = {
  entry: './applications/paikkatietoikkuna.fi/full-map/minifierAppSetup.json',
  output: {
    path: path.resolve(__dirname, 'dist/poc/full-map/'),
    publicPath: 'Oskari/dist/poc/full-map/',
    filename: 'oskari.min.js'
  },
  module: {
    rules: [
      {
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
        test: /\.(ttf|png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/'
            }
          }
        ]
      },
      {
        type: 'javascript/auto',
        test: /\/minifierAppSetup\.json$/,
        use: [
          {
            loader: path.resolve('./webpack/minifierLoader.js')
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/),
    new LocalizationPlugin(),
    new CopyWebpackPlugin(
      [
        { from: '*.js', context: 'applications/paikkatietoikkuna.fi/full-map/' },
        { from: 'css/**', context: 'applications/paikkatietoikkuna.fi/full-map/' },
        { from: 'resources/icons.css' },
        { from: 'resources/icons.png' }
      ]
    )
  ],
  resolveLoader: {
    modules: ['node_modules'],
    extensions: ['.js', '.json'],
    mainFields: ['loader', 'main'],
    alias: {
      'bundle-loader': path.resolve('./webpack/bundleLoader.js')
    }
  }
};