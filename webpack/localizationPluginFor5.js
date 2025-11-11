const fs = require('fs');
const path = require('path');
const merge = require('merge');
const { sources, Compilation } = require('webpack');

const fileRex = /^(.{2,3})\.js$/;
const pluginName = 'LocalizationPlugin';

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
};

/**
 * 1) Processes oskari-frontend/bundles/[bundle id]/resources/locale/[lang].js,
 * 2) gathers the localizations to language specific files
 * 3) and generates new "assets" for the build to write to dist/[version]/appName/oskari_lang_[lang].js
 */
class LocalizationPlugin {
    constructor (appName) {
        this.appPath = appName ? appName + '/' : '';
    }

    apply (compiler) {
        compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
            compilation.hooks.processAssets.tap({
                name: pluginName,
                stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
            }, () => {

                const devModeEnabled = fs.lstatSync('./node_modules/oskari-frontend').isSymbolicLink();
                let localeFiles;
                if (devModeEnabled) {
                    // locale files for application's own bundles
                    const appDir = path.resolve(process.cwd(), './bundles');
                    localeFiles = findLocaleFiles(appDir);

                    const oskariDir = path.resolve(process.cwd(), './../oskari-frontend/bundles');
                    localeFiles = localeFiles.concat(findLocaleFiles(oskariDir));

                    const oskariFrontendContribDir = path.resolve(process.cwd(), './../oskari-frontend-contrib/bundles');
                    if (fs.existsSync(oskariFrontendContribDir)) {
                        localeFiles = localeFiles.concat(findLocaleFiles(oskariFrontendContribDir));
                    }
                } else {
                    localeFiles = findLocaleFiles(path.resolve(process.cwd(), './bundles'));
                    localeFiles = localeFiles.concat(findLocaleFiles(path.resolve(process.cwd(), './node_modules')));
                }

                const oskariLangContents = readLocalizationContent(localeFiles);
                Object.keys(oskariLangContents).forEach(lang => {
                    const fileContent = oskariLangContents[lang];
                    compilation.emitAsset(`${this.appPath}oskari_lang_${lang}.js`, new sources.RawSource(fileContent));
                });
            });
        });

    }
}

const findLocaleFiles = (dir, pattern = /[\\/]resources[\\/]locale[\\/][^\\/]+\.js$/i) => {
    let results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results = results.concat(findLocaleFiles(fullPath, pattern));
        } else if (pattern.test(fullPath)) {
            // console.log('found locale ', fullPath);
            results.push(fullPath);
        }
    }
    return results;
};

module.exports = LocalizationPlugin;
