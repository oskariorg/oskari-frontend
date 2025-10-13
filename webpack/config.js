const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const getStyleFileRules = (isProd) => {
    const prodStyleConfig = {
        loader: MiniCssExtractPlugin.loader,
        options: {
            publicPath: '../'
        }
    };
    const styleLoaderImpl = isProd ? prodStyleConfig : 'style-loader';

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
        }
    ];
    return rules;
};

const regexpPathSep = `\\${path.sep}`;
const joinRegexpPath = parts => parts.join(regexpPathSep);

const getBlacklistedModules = modules => [
    ...modules.map(cur => new RegExp(joinRegexpPath(['node_modules', cur]))),
    ...modules.map(cur => new RegExp(joinRegexpPath(['node_modules', 'oskari-frontend', 'node_modules', cur])))
];

const getWhitelistedModules = modules => {
    if (!Array.isArray(modules) || modules.length === 0) {
        return [];
    }
    const moduleStr = modules.join('|');
    return [
        new RegExp(`node_modules${regexpPathSep}(?!(${moduleStr}))`),
        new RegExp(joinRegexpPath(['node_modules', 'oskari-frontend', 'node_modules']) + `${regexpPathSep}(?!(${moduleStr}))`)
    ];
};

/**
 * Optimizing babel transpiling by excluding specified node_modules.
 * Transpiling all node module dependencies is an expensive task, but some modules require ES6 transpiling for IE to work.
 *
 * Modules can be whitelisted (only these node modules will be transpiled) or blacklisted (transpile all other node modules).
 *
 * @param {string[]} modules Modules we wan't to give a special treatment to.
 * @param {boolean} blacklisted Blacklisted or whitelist. Defaults to blacklisting.
 */
// eslint-disable-next-line no-unused-vars
const getExcludedNodeModules = (modules, blacklisted = true) => {
    return blacklisted ? getBlacklistedModules(modules) : getWhitelistedModules(modules);
};

const BABEL_LOADER_RULE = {
    /* eslint-disable array-bracket-spacing */
    test: /\.(js|jsx)$/,
    exclude: [
        /libraries/,
        /\.min\.js$/,
        // https://github.com/zloirock/core-js/issues/514 core-js shouldn't be run through babel
        getExcludedNodeModules(['react-dom', '@ant-design', 'antd', 'core-js'])
        // Exclude all but named dependencies (named deps contain es6+ modules that require transpiling)
        // FIXME: olcs seems problematic - adding it makes the build take reeeeaaaally long compared to not having it
        // getWhitelistedModules(['oskari-frontend', 'oskari-frontend-contrib', 'olcs', 'cesium', '@cesium', 'jsts', '@mapbox'])
    ],
    use: {
        loader: 'babel-loader',
        options: {
            presets: [
                [
                    require.resolve('@babel/preset-env'), // Resolve path for use from external projects
                    {
                        corejs: 3,
                        useBuiltIns: 'entry',
                        targets: '> 0.25%, not dead, ie 11',
                        // https://babeljs.io/blog/2020/03/16/7.9.0
                        bugfixes: true
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

const getModuleRules = (isProd = false) => {
    const styleFileRules = getStyleFileRules(isProd);
    const rules = [
        /*
        webpack-import-meta-loader fixes this error for building Cesium:
        ERROR in ../oskari-frontend/node_modules/@cesium/engine/Source/Core/buildModuleUrl.js 42:43
        Module parse failed: Unexpected token (42:43)
        */
        {
            test: /\.js$/,
            loader: require.resolve('@open-wc/webpack-import-meta-loader')
        },
        BABEL_LOADER_RULE,
        ...styleFileRules,
        {
            test: /\.(ttf|png|jpg|gif|svg)$/,
            type: 'asset/resource',
            generator: {
                filename: 'assets/[name].[ext]'
            }
        },
        {
            test: /\.m?js$/,
            include: /node_modules[\\/]olcs[\\/]/,
            resolve: { fullySpecified: false } // exception to allow import ../core instead of ../core.js from olcs
        }
    ];
    return rules;
};

const RESOLVE = {
    extensions: ['.js', '.jsx'],
    // allow use of oskari-frontend node_modules from external projects
    modules: [path.resolve(__dirname, '../node_modules'), 'node_modules'],
    symlinks: false,
    alias: {
        'oskari-ui': path.resolve(__dirname, '../src/react')
    },
    fallback: {
        fs: false
    }
};
const RESOLVE_LOADER = {
    // allow external projects to use loaders in oskari-frontend node_modules
    modules: [path.resolve(__dirname, '../node_modules'), 'node_modules'],
    extensions: ['.js', '.json'],
    mainFields: ['loader', 'main'],
    alias: {
        'oskari-loader': path.resolve(__dirname, './oskariLoader.js'),
        'oskari-bundle': path.resolve(__dirname, './oskariBundleLoader.js'),
        'oskari-lazy-bundle': path.resolve(__dirname, './oskariBundleLazyLoader.js'),
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
