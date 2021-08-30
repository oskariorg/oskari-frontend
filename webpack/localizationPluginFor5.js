const fs = require('fs');
const path = require('path');
const merge = require('merge');;
const { sources, Compilation } = require('webpack');

const fileRex = /^(.{2,3})\.js$/;
const pluginName = 'LocalizationPlugin'

function isLocaleFile (filePath) {
    if (path.basename(path.dirname(filePath)) !== 'locale') {
        return false;
    }
    const parts = filePath.split(path.sep);
    if (parts[parts.length -3] !== 'resources') {
        // this could be things like:
        // - oskari-frontend\node_modules\moment\locale\af.js
        // - oskari-frontend\node_modules\antd\es\locale\en_US.js
        // for oskari locs we only want to process files in paths like:
        // - oskari-frontend\bundles\*\resources\locale\en.js
        return false;
    }
    return fileRex.test(path.basename(filePath));
}

const langFromPath = (filePath) => {
    const match = path.basename(filePath).match(fileRex);
    return match ? match[1] : null;
};

const getLanguagesToWrite = (files) => {
    const changedLanguages = new Set();
    files.forEach(path => {
        const lang = langFromPath(path);
        if (lang) {
            changedLanguages.add(lang);
        }
    });
    return changedLanguages;
};

const readLocalizationContent = (localeFiles) => {
    const changedLanguages = getLanguagesToWrite(localeFiles);

    const langToLoc = new Map();
    const langToOverride = new Map();
    const allKeys = new Set();
    /* eslint-disable-next-line */
    const Oskari = {
        registerLocalization: (loc, isOverride) => {
            const lang = loc.lang;
            if (!lang) {
                throw new Error('Localization file has no "lang"!');
            }
            const collection = isOverride ? langToOverride : langToLoc;
            let agg = new Map();
            if (collection.has(lang)) {
                agg = collection.get(lang);
            } else {
                collection.set(lang, agg);
            }
            agg.set(loc.key, loc);
            allKeys.add(loc.key);
        }
    };
    localeFiles
        .filter(path => {
            const lang = langFromPath(path);
            return lang === 'en' || changedLanguages.has(lang); // Always process English as it might be needed as fallback
        })
        .forEach(path => {
            const source = fs.readFileSync(path, 'utf8');
            /* eslint-disable-next-line */
            eval(source);
        });

    const englishLoc = langToLoc.get('en') || new Map();
    const result = {};
    for (const entry of langToLoc.entries()) {
        const lang = entry[0];
        const langLoc = entry[1];
        const langOverride = langToOverride.get(lang) || new Map();

        const keyContents = Array.from(allKeys)
            .filter(key => englishLoc.has(key) || langLoc.has(key) || langOverride.has(key))
            .map(key => {
                const englishForKey = lang === 'en' ? {} : englishLoc.get(key) || {}; // don't merge English with itself
                const locForKey = langLoc.get(key) || {};
                const overrideForKey = langOverride.get(key) || {};

                const mergedEnglish = merge.recursive(true, englishForKey, locForKey);
                const mergedOverride = merge.recursive(true, mergedEnglish, overrideForKey);
                mergedOverride.lang = lang; // value for "lang" key might be from fallback. Ensuring it's correct
                return mergedOverride;
            });

        const fileContent = keyContents.map(content => `Oskari.registerLocalization(${JSON.stringify(content)});`).join('\n');
        result[lang] = fileContent;
    }
    return result;
}

class LocalizationPlugin {
    constructor (appName) {
        this.appPath = appName ? appName + '/' : '';
    }
// https://stackoverflow.com/questions/65535038/webpack-processassets-hook-and-asset-source
// https://github.com/webpack/webpack/issues/11425
// https://survivejs.com/webpack/extending/plugins/
// https://webpack.js.org/api/compilation-hooks/#processassets
    apply (compiler) {
        compiler.hooks.emit.tap(pluginName, (compilation) => {
            const localeFiles = Array.from(compilation.fileDependencies).filter(isLocaleFile);
            console.log('\n\nNumber of locales: ', localeFiles.length);
                
            const oskariLangContents = readLocalizationContent(localeFiles)
            /*
            [DEP_WEBPACK_COMPILATION_ASSETS] DeprecationWarning: Compilation.assets will be frozen in future, all modifications are deprecated.
            BREAKING CHANGE: No more changes should happen to Compilation.assets after sealing the Compilation.
                    Do changes to assets earlier, e. g. in Compilation.hooks.processAssets.
                    Make sure to select an appropriate stage from Compilation.PROCESS_ASSETS_STAGE_*.
            */
            Object.keys(oskariLangContents).forEach(lang => {
                const fileContent = oskariLangContents[lang];
                compilation.emitAsset(`${this.appPath}oskari_lang_${lang}.js`, new sources.RawSource(fileContent));
            });
        });
    }
}

module.exports = LocalizationPlugin;
