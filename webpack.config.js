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
    entry: [
      path.resolve(__dirname, './webpack/oskari-core.js'),
      path.resolve(appsetupPath)
    ],
    devtool: isProd ? 'source-map' : 'cheap-module-eval-source-map',
    output: {
      path: path.resolve(`dist/${version}/${appName}/`),
      publicPath: `Oskari/dist/${version}/${appName}/`,
      filename: 'oskari.min.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [/node_modules(?!\/oskari-frontend)/, /libraries/, /\.min\.js$/],
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['es2015'],
              plugins: ['transform-remove-strict-mode']
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            'style-loader', // creates style nodes from JS strings
            { loader: 'css-loader', options: { minimize: true } },
          ]
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader', // creates style nodes from JS strings
            { loader: 'css-loader', options: { minimize: true } },
            'sass-loader' // compiles Sass to CSS
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
          test: path.resolve(appsetupPath),
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
    },
    resolve: {
      alias: {
        'goog': path.join(__dirname, "node_modules/ol-cesium/src/goog") // needed for ol-cesium. Can be removed when v 2.3 will be released
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
      port: 8081,
      proxy: [{
        context: ['/transport/cometd'],
        target: 'ws://localhost:8080',
        secure: false,
        changeOrigin: true,
        ws: true
      }, {
        context: ['**', `!/Oskari/dist/${version}/${appName}/**`, '!/Oskari/bundles/bundle.js'],
        target: 'http://localhost:8080',
        secure: false,
        changeOrigin: true
      }]
    };
  }

  return config;
};