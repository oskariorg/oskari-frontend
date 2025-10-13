const path = require('path');
const { IgnorePlugin } = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const LocalizationPlugin = require('./localizationPluginFor5.js');
const WebpackBar = require('webpackbar');
const { existsSync } = require('fs');

module.exports = function generateEntries (appsetupPaths, isProd, context) {
    const entries = {};
    const plugins = [
        new WebpackBar(),
        new IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(context + '/resources'), to: 'resources' }
            ]
        })
    ];

    appsetupPaths.forEach(appDir => {
        const minifierPath = path.resolve(appDir, 'minifierAppSetup.json');
        const mainJsPath = path.resolve(appDir, 'main.js');
        let targetPath;
        if (existsSync(minifierPath)) {
            targetPath = minifierPath;
        } else if (existsSync(mainJsPath)) {
            targetPath = mainJsPath;
        } else {
            // skip
            console.log('No minifierAppSetup.json file or main.js file in ' + appDir + '. Skipping!');
            return;
        }
        const appName = path.basename(appDir);
        const copyDef = [
            { from: appDir, to: appName },
            { from: path.resolve(context + '/resources/icons.css'), to: appName },
            { from: path.resolve(context + '/resources/icons.png'), to: appName }
        ];
        if (!isProd) {
            copyDef.push({ from: path.resolve(context + '/webpack/empty.js'), to: path.join(appName, 'oskari.min.css') }); // empty CSS to keep browser happy in dev mode
        }
        entries[appName] = [
            path.resolve(context, './webpack/polyfill.js'),
            path.resolve(context, './webpack/oskari-core.js'),
            targetPath
        ];
        plugins.push(new CopyWebpackPlugin({ patterns: copyDef }));
        plugins.push(new LocalizationPlugin(appName));
    });

    return { entries, plugins };
};
