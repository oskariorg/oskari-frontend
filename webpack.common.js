const path = require('path');
const webpack = require('webpack');
const LocalizationPlugin = require('./tools/localizationPlugin.js');

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
            loader: path.resolve('./tools/minifierLoader.js')
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/),
    new LocalizationPlugin()
  ],
  resolveLoader: {
    modules: ['node_modules'],
    extensions: ['.js', '.json'],
    mainFields: ['loader', 'main'],
    alias: {
      'bundle-loader': path.resolve('./tools/bundleLoader.js')
    }
  }
};