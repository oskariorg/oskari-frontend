const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const LocalizationPlugin = require('./webpack/localizationPlugin');
const parseParams = require('./webpack/parseParams.js');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  const parts = parseParams(env);

  const version = parts.length > 1 ? parts[0] : 'devapp';
  const appsetupPath = parts.length > 1 ? parts[1] : parts[0];
  const appsetupDir = path.dirname(appsetupPath);
  const appName = appsetupDir.split('/').pop();

  // Common config for both prod & dev
  const config = {
    mode: isProd ? 'production' : 'development',
    entry: path.resolve(appsetupPath),
    devtool: isProd ? 'source-map' : 'cheap-eval-source-map',
    output: {
      path: path.resolve(`dist/${version}/${appName}/`),
      publicPath: `Oskari/dist/${version}/${appName}/`,
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
          test: /\.scss$/,
          use: [
            "style-loader", // creates style nodes from JS strings
            { loader: "css-loader", options: { minimize: true } },
            "sass-loader" // compiles Sass to CSS
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
          test: path.resolve(__dirname, appsetupPath),
          use: [
            {
              loader: path.resolve(__dirname, './webpack/minifierLoader.js')
            }
          ]
        }
      ]
    },
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/), // moment.js fix
      new LocalizationPlugin(),
      new CopyWebpackPlugin(
        [
          { from: '*.js', context: appsetupDir },
          { from: 'css/**', context: appsetupDir },
          { from: 'resources/icons.css', context: __dirname },
          { from: 'resources/icons.png', context: __dirname }
        ]
      )
    ],
    resolveLoader: {
      modules: ['node_modules'],
      extensions: ['.js', '.json'],
      mainFields: ['loader', 'main'],
      alias: {
        'oskaribundle-loader': path.resolve(__dirname, './webpack/oskariBundleLoader.js')
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
        context: ['**', `!Oskari/dist/${version}/${appName}/**`],
        target: 'http://localhost:8080',
      }]
    };
  }

  return config;
};