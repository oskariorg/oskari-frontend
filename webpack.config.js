const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const LocalizationPlugin = require('./webpack/localizationPlugin');
const parseParams = require('./webpack/parseParams.js');
const { lstatSync, readdirSync } = require('fs');

const proxyPort = 8081;

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  const parts = parseParams(env);

  const version = parts.length > 1 ? parts[0] : 'devapp';
  const appsetupPath = parts.length > 1 ? parts[1] : parts[0];

  const isDirectory = source => lstatSync(source).isDirectory();
  const getDirectories = source => readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
  const appsetupPaths = getDirectories(path.resolve(appsetupPath));

  const entries = {};
  const plugins = [
    new webpack.IgnorePlugin(/^\.\/locale$/)
  ];

  appsetupPaths.forEach(appDir => {
    const dirParts = appDir.split(path.sep);
    const appName = dirParts[dirParts.length - 1];
    const copyPlugin = new CopyWebpackPlugin(
      [
        { from: '*.js', to: appName, context: appDir },
        { from: 'css/**', to: appName, context: appDir },
        { from: 'resources/icons.css', to: appName, context: __dirname },
        { from: 'resources/icons.png', to: appName, context: __dirname }
      ]
    );
    entries[appName] = [
      path.resolve(__dirname, './webpack/oskari-core.js'),
      path.resolve(appDir + path.sep + 'minifierAppSetup.json')
    ];
    plugins.push(copyPlugin);
    plugins.push(new LocalizationPlugin(appName));
  });

  // Common config for both prod & dev
  const config = {
    mode: isProd ? 'production' : 'development',
    entry: entries,
    devtool: isProd ? 'source-map' : 'cheap-module-eval-source-map',
    output: {
      path: path.resolve(`dist/${version}/`),
      publicPath: `Oskari/dist/${version}/`,
      filename: '[name]/oskari.min.js'
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
            { loader: 'css-loader', options: { minimize: true } }
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
          test: /minifierAppSetup.json$/,
          use: [
            {
              loader: path.resolve(__dirname, './webpack/minifierLoader.js')
            }
          ]
        }
      ]
    },
    plugins,
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
        'goog': path.join(__dirname, 'node_modules/ol-cesium/src/goog') // needed for ol-cesium. Can be removed when v 2.3 will be released
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
      port: proxyPort,
      proxy: [{
        context: ['/transport/cometd'],
        target: 'ws://localhost:8080',
        secure: false,
        changeOrigin: true,
        ws: true
      }, {
        context: ['**', `!/Oskari/dist/${version}/**`, '!/Oskari/bundles/bundle.js'],
        target: 'http://localhost:8080',
        secure: false,
        changeOrigin: true,
        headers: {
          'X-Forwarded-Host': 'localhost:' + proxyPort,
          'X-Forwarded-Proto': 'http'
        }
      }]
    };
  }

  return config;
};