const path = require('path');
const { IgnorePlugin } = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const LocalizationPlugin = require('./localizationPlugin.js');
const { existsSync } = require('fs');

module.exports = function generateEntries (appsetupPaths, isProd, context) {
    const entries = {};
    const plugins = [
        new IgnorePlugin(/^\.\/locale$/),
        new CopyWebpackPlugin(
            [
                { from: 'resources', to: 'resources', context },
                { from: 'bundles/integration/admin-layerselector', to: 'assets/admin-layerselector', context }
            ]
        )
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
            { from: 'resources/icons.css', to: appName, context },
            { from: 'resources/icons.png', to: appName, context }
        ];
        if (!isProd) {
            copyDef.push({ from: 'empty.js', to: path.join(appName, 'oskari.min.css'), context }); // empty CSS to keep browser happy in dev mode
        }
        entries[appName] = [
            path.resolve(context, './webpack/polyfill.js'),
            path.resolve(context, './webpack/oskari-core.js'),
            targetPath
        ];
        plugins.push(new CopyWebpackPlugin(copyDef));
        plugins.push(new LocalizationPlugin(appName));
    });

    return {entries, plugins};
};
