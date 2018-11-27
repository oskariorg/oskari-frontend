const path = require('path');
const { IgnorePlugin } = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const LocalizationPlugin = require('./localizationPlugin.js');
const { existsSync } = require('fs');

module.exports = function generateEntries (appsetupPaths, context) {
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
        const copyPlugin = new CopyWebpackPlugin(
            [
                { from: appDir, to: appName },
                { from: 'resources/icons.css', to: appName, context },
                { from: 'resources/icons.png', to: appName, context }
            ]
        );
        entries[appName] = [
            path.resolve(context, './webpack/polyfill.js'),
            path.resolve(context, './webpack/oskari-core.js'),
            targetPath
        ];
        plugins.push(copyPlugin);
        plugins.push(new LocalizationPlugin(appName));
    });

    return {entries, plugins};
};
