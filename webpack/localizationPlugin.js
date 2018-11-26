const fs = require('fs');
const path = require('path');
const merge = require('merge');

const fileRex = /^(.{2,3})\.js$/;

function isLocaleFile (filePath) {
    if (path.basename(path.dirname(filePath)) !== 'locale') {
        return false;
    }
    return fileRex.test(path.basename(filePath));
}

class LocalizationPlugin {
    constructor (appName) {
        this.startTime = Date.now();
        this.prevTimestamps = new Map();
        this.appPath = appName ? appName + '/' : '';
    }
    apply (compiler) {
        compiler.hooks.emit.tapAsync('LocalizationPlugin', (compilation, callback) => {
            const localeFiles = Array.from(compilation.fileDependencies)
                .filter(isLocaleFile);
            const changedLanguages = new Set();
            localeFiles
                .filter(path => {
                    return (this.prevTimestamps.get(path) || this.startTime) < (compilation.fileTimestamps.get(path) || Infinity);
                })
                .forEach(path => {
                    const lang = this.langFromPath(path);
                    if (lang) {
                        changedLanguages.add(lang);
                    }
                });

            this.prevTimestamps = compilation.fileTimestamps;

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
                    const lang = this.langFromPath(path);
                    return lang === 'en' || changedLanguages.has(lang); // Always process English as it might be needed as fallback
                })
                .forEach(path => {
                    const source = fs.readFileSync(path, 'utf8');
                    /* eslint-disable-next-line */
                    eval(source);
                });

            const englishLoc = langToLoc.get('en') || new Map();
            for (let entry of langToLoc.entries()) {
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

                let fileContent = keyContents.map(content => `Oskari.registerLocalization(${JSON.stringify(content)});`).join('\n');
                compilation.assets[`${this.appPath}oskari_lang_${lang}.js`] = {
                    source () {
                        return fileContent;
                    },
                    size () {
                        return fileContent.length;
                    }
                };
            }

            callback();
        });
    }

    langFromPath (filePath) {
        const match = path.basename(filePath).match(fileRex);
        return match ? match[1] : null;
    }
}

module.exports = LocalizationPlugin;
