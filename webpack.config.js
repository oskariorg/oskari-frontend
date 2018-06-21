const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './applications/paikkatietoikkuna.fi/full-map/minifierAppSetup.json',
  output: {
    path: path.resolve(__dirname, 'dist/poc/full-map/'),
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
        test: /\/minifierAppSetup\.json$/,
        use: [
          {
            loader: path.resolve('./tools/minifierLoader.js')
          }
        ]
      }
    ]
  },
  plugins: [new webpack.IgnorePlugin(/^\.\/locale$/)],
  resolveLoader: {
    modules: [ 'node_modules' ],
    extensions: [ '.js', '.json' ],
    mainFields: [ 'loader', 'main' ],
    alias: {
      'bundle-loader': path.resolve('./tools/bundleLoader.js')
    }
  }
};