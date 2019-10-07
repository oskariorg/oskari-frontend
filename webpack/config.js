const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const getStyleFileRules = (isProd, antThemeFile) => {
    const prodStyleConfig = {
        loader: MiniCssExtractPlugin.loader,
        options: {
            publicPath: '../'
        }
    };
    const styleLoaderImpl = isProd ? prodStyleConfig : 'style-loader';

    const lessLoaderOptions = {
        javascriptEnabled: true
    };
    if (antThemeFile) {
        lessLoaderOptions.modifyVars = {
            hack: `true; @import "${antThemeFile}";`
        };
    };

    const rules = [
        {
            test: /\.css$/,
            use: [
                styleLoaderImpl,
                { loader: 'css-loader', options: { } }
            ]
        },
        {
            test: /\.scss$/,
            use: [
                styleLoaderImpl,
                { loader: 'css-loader', options: { } },
                'sass-loader' // compiles Sass to CSS
            ]
        },
        {
            test: /\.less$/,
            use: [
                styleLoaderImpl,
                { loader: 'css-loader' },
                {
                    loader: 'less-loader',
                    options: lessLoaderOptions
                }
            ]
        }
    ];
    return rules;
};

const BABEL_LOADER_RULE = {
    test: /\.(js|jsx)$/,
    exclude: [/libraries/, /\.min\.js$/],
    use: {
        loader: 'babel-loader',
        options: {
            presets: [
                [
                    require.resolve('@babel/preset-env'), // Resolve path for use from external projects
                    {
                        useBuiltIns: 'entry',
                        targets: '> 0.25%, not dead, ie 11'
                    }
                ],
                require.resolve('@babel/preset-react') // Resolve path for use from external projects
            ],
            plugins: [
                require.resolve('babel-plugin-styled-components'), // Resolve path for use from external projects
                require.resolve('babel-plugin-transform-remove-strict-mode')
            ]
        }
    }
};

const getModuleRules = (isProd = false, antThemeFile) => {
    const styleFileRules = getStyleFileRules(isProd, antThemeFile);
    const rules = [
        {
            test: require.resolve('sumoselect'),
            use: 'imports-loader?define=>undefined,exports=>undefined'
        },
        BABEL_LOADER_RULE,
        ...styleFileRules,
        {
            test: /\.(ttf|png|jpg|gif|svg)$/,
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
                    loader: path.resolve(__dirname, './minifierLoader.js')
                }
            ]
        }
    ];
    return rules;
};

const RESOLVE = {
    extensions: ['.js', '.jsx'],
    modules: [path.resolve(__dirname, '../node_modules'), 'node_modules'], // allow use of oskari-frontend node_modules from external projects
    symlinks: false,
    alias: {
        'oskari-ui': path.resolve(__dirname, '../src/react')
    }
};
const RESOLVE_LOADER = {
    modules: [path.resolve(__dirname, '../node_modules'), 'node_modules'], // allow external projects to use loaders in oskari-frontend node_modules
    extensions: ['.js', '.json'],
    mainFields: ['loader', 'main'],
    alias: {
        'oskari-loader': path.resolve(__dirname, './oskariLoader.js'),
        'oskari-lazy-loader': path.resolve(__dirname, './oskariLazyLoader.js')
    }
};

module.exports = {
    getModuleRules,
    getStyleFileRules,
    RESOLVE,
    RESOLVE_LOADER,
    BABEL_LOADER_RULE
};
