const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const OskariConfig = require('./webpack/config.js');
const parseParams = require('./webpack/parseParams.js');
const { lstatSync, readdirSync } = require('fs');
const generateEntries = require('./webpack/generateEntries.js');
const { DefinePlugin, NormalModuleReplacementPlugin } = require('webpack');
const CopywebpackPlugin = require('copy-webpack-plugin');

const proxyPort = 8081;
// helpers
const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source => readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);

// The path to the CesiumJS source code
const cesiumSource = 'node_modules/cesium/Source';
const cesiumTarget = 'cesium';

module.exports = (env, argv) => {
    const isProd = argv.mode === 'production';

    const { version, pathParam, publicPathPrefix, theme } = parseParams(env);
    // assumes applications are directories under pathParam
    const appsetupPaths = getDirectories(path.resolve(pathParam));

    // entries are configs for each app, plugins accumulate resource copying etc from all the apps
    const { entries, plugins } = generateEntries(appsetupPaths, isProd, __dirname);
    plugins.push(new MiniCssExtractPlugin({
        filename: '[name]/oskari.min.css'
    }));

    // Replace ant design global styles with a custom solution to prevent global styles affecting the app.
    const replacement = path.join(__dirname, 'src/react/ant-globals.less');
    plugins.push(new NormalModuleReplacementPlugin(/..\/..\/style\/index\.less/, replacement));

    // Copy Cesium Assets, Widgets, and Workers to a static directory
    plugins.push(new CopywebpackPlugin([
        { from: path.join(__dirname, cesiumSource, '../Build/Cesium/Workers'), to: cesiumTarget + '/Workers' },
        { from: path.join(__dirname, cesiumSource, 'Assets'), to: cesiumTarget + '/Assets' },
        { from: path.join(__dirname, cesiumSource, 'Widgets'), to: cesiumTarget + '/Widgets' },
        // copy Cesium's minified third-party scripts
        { from: path.join(__dirname, cesiumSource, '../Build/Cesium/ThirdParty'), to: cesiumTarget + '/ThirdParty' }
    ]));

    // Define relative base path in Cesium for loading assets
    plugins.push(new DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify(`${publicPathPrefix}Oskari/dist/${version}/${cesiumTarget}`)
    }));

    const themeFile = theme ? path.resolve(theme) : path.join(__dirname, 'src/react/ant-theme.less');

    // Common config for both prod & dev
    const config = {
        node: {
            fs: 'empty'
        },
        amd: {
            // Enable webpack-friendly use of require in Cesium
            toUrlUndefined: true
        },
        mode: isProd ? 'production' : 'development',
        entry: entries,
        devtool: isProd ? 'source-map' : 'cheap-module-eval-source-map',
        output: {
            path: path.resolve(`dist/${version}/`),
            publicPath: `${publicPathPrefix}Oskari/dist/${version}/`,
            filename: '[name]/oskari.min.js',

            // Needed to compile multiline strings in Cesium
            sourcePrefix: ''
        },
        module: {
            rules: OskariConfig.getModuleRules(isProd, themeFile)
        },
        plugins,
        resolveLoader: OskariConfig.RESOLVE_LOADER,
        resolve: OskariConfig.RESOLVE
    };

    // Mode specific config
    if (isProd) {
        config.optimization = {
            minimizer: [
                new UglifyJsPlugin({
                    sourceMap: true,
                    parallel: true
                }),
                new OptimizeCSSAssetsPlugin({})
            ]
        };
    } else {
        config.devServer = {
            port: proxyPort,
            proxy: [{
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
