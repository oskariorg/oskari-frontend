const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const LocalizationPlugin = require('./webpack/localizationPlugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  // Common config for both prod & dev
  const config = {
    mode: isProd ? 'production' : 'development',
    entry: './applications/paikkatietoikkuna.fi/full-map/minifierAppSetup.json',
    devtool: isProd ? 'source-map' : 'cheap-eval-source-map',
    output: {
      path: path.resolve(__dirname, 'dist/poc/full-map/'),
      publicPath: 'Oskari/dist/poc/full-map/',
      filename: 'oskari.min.js'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            "style-loader", // creates style nodes from JS strings
            { loader: "css-loader", options: { minimize: true } },
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

  // Mode specific config
  if (isProd) {
    config.optimization = {
      minimizer: [
        new UglifyJsPlugin({
          sourceMap: true,
          parallel: true
        })
      ]
    };
  } else {
    config.devServer = {
      proxy: [{
        context: ['**', '!Oskari/dist/poc/full-map/**'],
        target: 'http://localhost:8080',
      }]
    };
  }

  return config;
};