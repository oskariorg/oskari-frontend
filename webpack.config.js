const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const LocalizationPlugin = require('./webpack/localizationPlugin');
const parseParams = require('./webpack/parseParams.js');
const { lstatSync, readdirSync, existsSync } = require('fs');

const proxyPort = 8081;

module.exports = (env, argv) => {
    const isProd = argv.mode === 'production';

    const {version, pathParam, publicPathPrefix} = parseParams(env);

    const isDirectory = source => lstatSync(source).isDirectory();
    const getDirectories = source => readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
    const appsetupPaths = getDirectories(path.resolve(pathParam));

    const entries = {};
    const plugins = [
        new webpack.IgnorePlugin(/^\.\/locale$/),
        new CopyWebpackPlugin(
            [
                { from: 'resources', to: 'resources', context: __dirname },
                { from: 'bundles/integration/admin-layerselector', to: 'assets/admin-layerselector', context: __dirname }
            ]
        )
    ];

    appsetupPaths.forEach(appDir => {
        const minifierFile = path.resolve(appDir + path.sep + 'minifierAppSetup.json');
        if (!existsSync(minifierFile)) {
            // skip
            console.log('No minifierAppSetup.json file in ' + appDir + '. Skipping!');
            return;
        }
        const dirParts = appDir.split(path.sep);
        const appName = dirParts[dirParts.length - 1];
        const copyPlugin = new CopyWebpackPlugin(
            [
                { from: appDir, to: appName },
                { from: 'resources/icons.css', to: appName, context: __dirname },
                { from: 'resources/icons.png', to: appName, context: __dirname }
            ]
        );
        entries[appName] = [
            path.resolve(__dirname, './webpack/polyfill.js'),
            path.resolve(__dirname, './webpack/oskari-core.js'),
            minifierFile
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
            publicPath: `${publicPathPrefix}Oskari/dist/${version}/`,
            filename: '[name]/oskari.min.js'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: [/libraries/, /\.min\.js$/],
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    require.resolve('@babel/preset-env'), // Resolve path for use from external porojects
                                    {
                                        useBuiltIns: 'entry',
                                        targets: '> 0.25%, not dead, ie 11'
                                    }
                                ]
                            ],
                            plugins: [require.resolve('babel-plugin-transform-remove-strict-mode')] // Resolve path for use from external porojects
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
            modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'], // allow external projects to use loaders in oskari-frontend node_modules
            extensions: ['.js', '.json'],
            mainFields: ['loader', 'main'],
            alias: {
                'oskari-loader': path.resolve(__dirname, './webpack/oskariLoader.js'),
                'oskari-lazy-loader': path.resolve(__dirname, './webpack/oskariLazyLoader.js')
            }
        },
        resolve: {
            alias: {

            },
            modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'], // allow use of oskari-frontend node_modules from external projects
            symlinks: false
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
