const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const parseParams = require('./webpack/parseParams.js');
const { lstatSync, readdirSync } = require('fs');
const generateEntries = require('./webpack/generateEntries.js');

const proxyPort = 8081;

module.exports = (env, argv) => {
    const isProd = argv.mode === 'production';

    const {version, pathParam, publicPathPrefix} = parseParams(env);

    const isDirectory = source => lstatSync(source).isDirectory();
    const getDirectories = source => readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
    const appsetupPaths = getDirectories(path.resolve(pathParam));

    const {entries, plugins} = generateEntries(appsetupPaths, isProd, __dirname);
    plugins.push(new MiniCssExtractPlugin({
        filename: '[name]/oskari.min.css'
    }));

    const styleLoaderImpl = isProd ? {
        loader: MiniCssExtractPlugin.loader,
        options: {
            publicPath: '../'
        }
    } : 'style-loader';

    // Common config for both prod & dev
    const config = {
        node: {
            fs: 'empty'
        },
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
                    test: require.resolve('sumoselect'),
                    use: 'imports-loader?define=>undefined,exports=>undefined'
                },
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
                        styleLoaderImpl,
                        { loader: 'css-loader', options: { minimize: true } }
                    ]
                },
                {
                    test: /\.scss$/,
                    use: [
                        styleLoaderImpl,
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
